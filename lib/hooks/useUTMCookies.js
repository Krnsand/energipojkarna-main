import { useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/router'
import cookie from 'cookiejs'

const cookieName = 'utm_params'

export function useUTMCookies() {
  const router = useRouter()

  // Extract specific query params to avoid object reference issues
  // Handle both string and string[] types from router.query
  const utmSource = Array.isArray(router.query.utm_source)
    ? router.query.utm_source[0]
    : router.query.utm_source
  const utmMedium = Array.isArray(router.query.utm_medium)
    ? router.query.utm_medium[0]
    : router.query.utm_medium
  const utmCampaign = Array.isArray(router.query.utm_campaign)
    ? router.query.utm_campaign[0]
    : router.query.utm_campaign

  // Memoize UTM data to avoid unnecessary effect runs
  const utmData = useMemo(() => {
    if (!router.isReady) return null

    const data = {}
    let hasParams = false

    if (utmSource) {
      data.utm_source = utmSource
      hasParams = true
    }
    if (utmMedium) {
      data.utm_medium = utmMedium
      hasParams = true
    }
    if (utmCampaign) {
      data.utm_campaign = utmCampaign
      hasParams = true
    }

    return hasParams ? data : null
  }, [router.isReady, utmSource, utmMedium, utmCampaign])

  // Save UTM params to cookie when they exist
  useEffect(() => {
    if (utmData) {
      cookie.set(cookieName, JSON.stringify(utmData), { expires: 30 })
    }
  }, [utmData])

  // Get UTM parameters from cookies
  const getUTMParams = useCallback(() => {
    const cookies = cookie.get(cookieName)
    if (!cookies) return null

    try {
      return JSON.parse(cookies)
    } catch (error) {
      console.error('Failed to parse UTM cookies:', error)
      return null
    }
  }, [])

  return { getUTMParams, currentUTMParams: utmData }
}
