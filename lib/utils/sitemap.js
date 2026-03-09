import { fetchAllTypesPages } from '@/lib/utils/helpers'
import { createClient } from '@/prismicio'

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://www.energipojkarna.se'

export default async function sitemap() {
  const client = createClient()

  // Fetch dynamic pages from Prismic

  const allTypes = ['homepage', 'page', 'category', 'product']
  const allPages = await Promise.all(
    allTypes.map(type => client.getAllByType(type)),
  )
  const dynamicPages = allPages.flat()

  // Correctly map dynamic pages to the expected format
  const dynamicRoutes = dynamicPages.map(page => ({
    url: `${baseUrl}${page.url}`, // Use 'url' instead of 'loc'
    lastModified: page.last_publication_date,
  }))

  // Static routes directly added to the sitemap
  const staticRoutes = [
    // {
    //   url: 'https://energipojkarna.se',
    //   lastModified: new Date().toISOString(),
    //   // Optionally: change frequency & priority here
    // },
    // Add more static routes as needed
  ]

  const urls = [...staticRoutes, ...dynamicRoutes]

  return urls
    .map(
      ({ url, lastModified }) =>
        `<sitemap><loc>${url}</loc><lastmod>${lastModified}</lastmod></sitemap>`,
    )
    .join('')
}
