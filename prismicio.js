import * as prismic from '@prismicio/client'
import * as prismicNext from '@prismicio/next'
import sm from './slicemachine.config.json'

// Update the routes array to match your project's route structure
/** @type {prismic.ClientConfig['routes']} **/
const routes = [
  {
    type: 'homepage',
    path: '/',
  },
  {
    type: 'category',
    path: '/produkter/:uid',
  },
  {
    type: 'product',
    path: '/produkter/:category/:brand/:uid',
    resolvers: {
      brand: 'brand',
      category: 'category',
    },
  },
  {
    type: 'page',
    path: '/:uid',
  },
]

/**
 * Creates a Prismic client for the project's repository. The client is used to
 * query content from the Prismic API.
 *
 * @param config {prismicNext.CreateClientConfig} - Configuration for the Prismic client.
 */
export const createClient = (config = {}) => {
  const client = prismic.createClient(sm.repositoryName, {
    routes,
    ...config,
  })

  prismicNext.enableAutoPreviews({
    client,
    previewData: config.previewData,
    req: config.req,
  })

  return client
}
