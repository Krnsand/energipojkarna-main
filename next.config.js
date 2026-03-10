const redirects = require('./redirects')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  productionBrowserSourceMaps: process.env.ENABLE_SOURCEMAPS === 'true',
  images: {
    domains: [
      'images.prismic.io',
      'images.unsplash.com',
      'energipojkarna.cdn.prismic.io',
      'i.ytimg.com',
    ],
  },
  redirects,
  experimental: {
    optimizePackageImports: ['lodash', 'framer-motion'],
  },
}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
module.exports = withBundleAnalyzer(nextConfig)
