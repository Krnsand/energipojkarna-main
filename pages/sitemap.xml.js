import React from 'react'
import sitemap from '@/lib/utils/sitemap'

class Sitemap extends React.Component {
  static async getInitialProps({ res }) {
    const urls = await sitemap()

    const urlset =
      `<sitemapindex xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/siteindex.xsd">${urls}</sitemapindex>`.replace(
        /(\r\n|\n|\r)/gm,
        '',
      )
    res.setHeader('Content-Type', 'text/xml')
    res.write(`<?xml version="1.0" encoding="utf-8"?>${urlset}`)
    res.end()
  }
}

export default Sitemap
