import { uniq } from 'lodash'
import { NextSeo } from 'next-seo'
import { SliceZone } from '@prismicio/react'
import { asLink } from '@prismicio/client'

import { createClient } from '@/prismicio'
import { components } from '@/slices'

const CategoryPage = ({ page, brand }) => {
  return (
    <>
      <NextSeo
        title={page?.data?.metaTitle || page?.data?.name}
        description={page?.data?.metaDescription}
      />

      <SliceZone
        slices={page.data.slices}
        components={components}
        context={{ baseUrl: asLink(page), brand }}
      />
    </>
  )
}

export default CategoryPage

export async function getStaticProps({ params, previewData }) {
  const client = createClient({ previewData })

  const brand = params?.brand?.[0] || null

  try {
    const page = await client.getByUID('category', params.category, {
      fetchLinks: [
        'product.name',
        'product.variants',
        'product.energy',
        'product.size',
        'product.effect',
        'product.effect_cold',
        'product.five_year_warranty',
        'product.price',
        'product.price_note',
        'product.primary_image',

        'product.brand',
        'brand.name',
        'brand.logo',
      ],
    })

    return {
      props: {
        page,
        brand,
      },
      revalidate: 10,
    }
  } catch (error) {
    // Maybe log ?
  }

  return { notFound: true, revalidate: 10 }
}

export async function getStaticPaths(props) {
  const client = createClient()

  const pages = await client.getAllByType('category', {
    fetchLinks: ['product.brand', 'brand.name'],
  })

  const pagesWithBrands = pages.map(page => ({
    categoryUrl: asLink(page),
    brandSlugs: uniq(
      page.data?.slices
        .filter(slice => slice.slice_type === 'product_list')
        .flatMap(slice =>
          slice.items.map(item => {
            return item.product?.data?.brand?.uid
          }),
        )
        .filter(Boolean),
    ),
  }))

  return {
    paths: [
      ...pages.map(page => asLink(page)),
      ...pagesWithBrands.reduce((acc, page) => {
        return [
          ...acc,
          ...page.brandSlugs.map(slug => {
            return `${page.categoryUrl}/${slug}`
          }),
        ]
      }, []),
    ],
    fallback: 'blocking',
  }
}
