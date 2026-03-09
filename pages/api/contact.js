import FormData from 'form-data'
import nodemailer from 'nodemailer'
import axios from 'axios'

const verifyRecaptcha = async token => {
  const secretKey = process.env.RECAPTHA_SECRET_KEY

  let res
  const formData = `secret=${secretKey}&response=${token}`
  try {
    res = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )
  } catch (e) {
    console.log('recaptcha error:', e)
    return false
  }

  // Checking if the response sent by reCaptcha success or not and if the score is above 0.5
  // In ReCaptcha v3, a score sent which tells if the data sent from front end is from Human or from Bots. If score above 0.5 then it is human otherwise it is bot
  // For more info check, https://developers.google.com/recaptcha/docs/v3
  // ReCaptcha v3 response:
  // {
  //   "success": true|false,      // whether this request was a valid reCAPTCHA token for your site
  //   "score": number             // the score for this request (0.0 - 1.0)
  //   "action": string            // the action name for this request (important to verify)
  //   "challenge_ts": timestamp,  // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
  //   "hostname": string,         // the hostname of the site where the reCAPTCHA was solved
  //   "error-codes": [...]        // optional
  // }
  return res?.data?.success && res?.data?.score >= 0.5
}

export default async function handler(req, res) {
  // Validate that the request is coming from the correct domain
  const validDomains = [
    process.env.NEXT_PUBLIC_BASE_URL,
    'https://energipojkarna.vercel.app',
  ]

  const referer = req.headers.referer

  if (!validDomains.some(domain => referer.includes(domain))) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  // Validate recaptcha
  const token = req.body.token

  if (!(await verifyRecaptcha(token))) {
    return res.status(400).json({ message: 'Recaptcha failed' })
  }

  // Validate that either phone or email is provided
  if (req.body.phone?.length === 0 && req.body.email?.length === 0) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  // Send email
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false,
    },
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  const utmData = req.body.utmData
    ? `
  ----
  UTM Source: ${req.body.utmData.utm_source || 'N/A'}
  UTM Medium: ${req.body.utmData.utm_medium || 'N/A'}
  UTM Campaign: ${req.body.utmData.utm_campaign || 'N/A'}`
    : ''

  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: process.env.MAIL_TO,
    cc: process.env.MAIL_CC, // Add CC recipient(s) person1@example.com,person2@example.com
    subject: 'Nytt meddelande från hemsidan',
    text: `
Namn: ${req.body.name}
Telefon: ${req.body.phone}
E-post: ${req.body.email}
Meddelande:
${req.body.message}
${utmData}`,
  }
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('error', error)
      return res.status(400).json({ message: 'Failed to send email' })
    } else {
      return res.status(200).json()
    }
  })
}
