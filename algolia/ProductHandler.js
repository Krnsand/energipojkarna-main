const fetch = require('node-fetch')
const prismic = require('@prismicio/client')
const algoliaClient = require('./algoliaClient')
const sm = require('../slicemachine.config.json')

export default class ProductHandler {
  static transformProduct(product, brands, categories) {
    const brand = brands.find(brand => brand.uid === product.data.brand.uid)
    const category = categories.find(
      category => category.uid === product.data.category.uid,
    )

    return {
      objectID: product.id,
      type: product.type,
      uid: product.uid,
      title: product.data.name,
      brand: brand?.data?.name,
      category: category?.data?.name,
      publish_date: product.first_publication_date,
      url: `/produkter/${category?.uid}/${brand?.uid}/${product.uid}`,
      imageThumbnail: prismic.asImageSrc(product?.data?.primary_image, {
        q: 50,
        width: 150,
      }),
      excerpt: product.data.short_description,
    }
  }

  static async publish(documentIds) {
    if (!documentIds || !Array.isArray(documentIds) || !documentIds.length) {
      throw new Error(
        `Can't publish empty documentIds recieved: ${JSON.stringify(
          documentIds,
        )}`,
      )
    }

    const prismicClient = prismic.createClient(sm.repositoryName, {
      fetch,
      accessToken: process.env.PRISMIC_MASTER_ACCESS_TOKEN,
    })

    const brands = await prismicClient.getAllByType('brand')
    const categories = await prismicClient.getAllByType('category')

    const products = await prismicClient.getAllByIDs(documentIds)

    if (!products || !products.length) {
      return
    }

    const records = products.map(product =>
      this.transformProduct(product, brands, categories),
    )

    const index = algoliaClient.initIndex('products')
    await index.saveObjects(records)
  }
  static async unpublish(documentIds) {
    if (!documentIds || !Array.isArray(documentIds) || !documentIds.length) {
      throw new Error("Can't publish empty documentIds")
    }

    const index = algoliaClient.initIndex('products')

    await index.deleteObjects(documentIds)
  }
}
