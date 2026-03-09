const dotenv = require('dotenv')
const algoliasearch = require('algoliasearch')

// Load environment variables from .env file
dotenv.config()

const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_KEY,
)

module.exports = algoliaClient
