import React from 'react'
import { isProduction } from '@/lib/utils/helpers'

class Robots extends React.Component {
  static async getInitialProps({ res }) {
    // Remove trailing slash from base URL
    const baseUrl = (
      process.env.NEXT_PUBLIC_BASE_URL || 'http://energipojkarna.se'
    ).replace(/\/$/, '')

    // If the environment is Vercel and not production, set the robots.txt to disallow all

    if (isProduction) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.write(`User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`)
      res.end()
      return
    }

    // Is not production, deny all
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.write(`User-agent: *
Disallow: /`)
    res.end()
  }
}

export default Robots
