import React from 'react'
import { isProduction } from '@/lib/utils/helpers'

class Robots extends React.Component {
  static async getInitialProps({ res }) {
    // Remove trailing slash from base URL
    const baseUrl = (
      process.env.NEXT_PUBLIC_BASE_URL || 'http://energipojkarna.se'
    ).replace(/\/$/, '')

    const isVercel = Boolean(process.env.VERCEL)

    // If the environment is Vercel and not production, set the robots.txt to disallow all
    if (isProduction) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.write(`User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`)
      res.end()
      return
    }

    // Only deny all on Vercel preview/development deploys (avoid blocking locally)
    if (isVercel) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.write(`User-agent: *
Disallow: /`)
      res.end()
      return
    }

    // Local dev: allow crawling (so Lighthouse/SEO tools don't report indexing blocked)
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.write(`User-agent: *
Allow: /`)
    res.end()
  }
}

export default Robots
