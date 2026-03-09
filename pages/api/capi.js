const bizSdk = require('facebook-nodejs-business-sdk')

const access_token = process.env.CAPI_ACCESS_TOKEN
const pixel_id = process.env.PIXEL_ID

// Initialize Facebook Ads API once at module load
if (access_token) {
  bizSdk.FacebookAdsApi.init(access_token)
}

export default async function handler(req, res) {
  // Validate request method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Validate environment variables
  if (!access_token || !pixel_id) {
    console.error('CAPI Error: Missing environment variables')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  // Validate request body
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Invalid request body' })
  }

  const leadData = req.body.leadData || {}
  const userData = req.body.userData || {}

  // Clean and validate user data
  const email = userData.email?.trim()
  const phone = userData.phone?.trim()
  const name = userData.name?.trim()

  // Ensure at least some user data exists for matching
  if (!email && !phone) {
    return res.status(400).json({
      error: 'At least email or phone number is required',
    })
  }

  // Extract client IP address (handle x-forwarded-for with multiple IPs)
  const forwardedFor = req.headers['x-forwarded-for']
  const clientIp = forwardedFor
    ? forwardedFor.split(',')[0].trim()
    : req.socket.remoteAddress

  // Extract Facebook cookies from request
  const cookies = req.headers.cookie || ''
  const fbp = cookies.match(/_fbp=([^;]+)/)?.[1]
  const fbc = cookies.match(/_fbc=([^;]+)/)?.[1]

  // Clean and format phone number
  let phoneNumber = null
  if (phone) {
    phoneNumber = phone.replace(/[\s-]/g, '')
    // Only process if there's actual content after cleaning
    if (phoneNumber.length > 0) {
      // Add +46 if it's a Swedish number without country code
      if (phoneNumber.startsWith('0')) {
        phoneNumber = '+46' + phoneNumber.substring(1)
      } else if (!phoneNumber.startsWith('+')) {
        phoneNumber = '+46' + phoneNumber
      }
    } else {
      phoneNumber = null
    }
  }

  // Parse name
  const nameParts = name?.split(/\s+/) || []
  const firstName = nameParts[0]
  const lastName = nameParts.slice(1).join(' ')

  // 1. Setup User Data (only set fields that have values)
  const metaUserData = new bizSdk.UserData()

  if (email) metaUserData.setEmail(email.toLowerCase())
  if (phoneNumber) metaUserData.setPhone(phoneNumber)
  if (firstName) metaUserData.setFirstName(firstName)
  if (lastName) metaUserData.setLastName(lastName)
  if (clientIp) metaUserData.setClientIpAddress(clientIp)
  if (req.headers['user-agent'])
    metaUserData.setClientUserAgent(req.headers['user-agent'])
  if (fbp) metaUserData.setFbp(fbp)
  if (fbc) metaUserData.setFbc(fbc)

  // 2. Setup Custom Data (product/conversion info)
  const contentIds = Array.isArray(leadData.content_ids)
    ? leadData.content_ids
    : leadData.content_ids
    ? [leadData.content_ids]
    : []

  const customData = new bizSdk.CustomData()
    .setContentIds(contentIds)
    .setContentType(leadData.content_type || 'product')
    .setValue(leadData.value || 0)
    .setCurrency(leadData.currency || 'SEK')

  // Generate fallback event ID if not provided
  const eventId =
    req.body.eventId ||
    `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`

  // 3. Create the Lead Event
  const serverEvent = new bizSdk.ServerEvent()
    .setEventName('Lead')
    .setEventId(eventId)
    .setEventTime(Math.floor(Date.now() / 1000))
    .setUserData(metaUserData)
    .setCustomData(customData)
    .setActionSource('website')
    .setEventSourceUrl(req.body.eventSourceUrl || '')

  // Log what we're sending (helpful for debugging Vercel)

  // 4. Send the Request
  const eventRequest = new bizSdk.EventRequest(
    access_token,
    pixel_id,
  ).setEvents([serverEvent])

  // Add test event code for development testing
  if (process.env.CAPI_TEST_CODE) {
    console.log('Using CAPI test event code: ' + process.env.CAPI_TEST_CODE)
    eventRequest.setTestEventCode(process.env.CAPI_TEST_CODE)

    console.log('CAPI Request:', {
      eventId,
      eventSourceUrl: req.body.eventSourceUrl,
      email: email,
      phoneNumber: phoneNumber,
      clientIp,
      fbp: fbp,
      fbc: fbc,
      environment: process.env.VERCEL_ENV || 'local',
    })
  }

  try {
    const response = await eventRequest.execute()
    console.log('CAPI Success:', {
      events_received: response.events_received,
      messages: response.messages,
    })
    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('CAPI Error:', {
      message: err.message,
      code: err.code,
      details: err.response?.data || err,
    })
    return res.status(500).json({
      success: false,
      error: 'Failed to send conversion event',
    })
  }
}
