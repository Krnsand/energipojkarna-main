import { SliceZone } from '@prismicio/react'
import { asLink } from '@prismicio/client'
import { NextSeo } from 'next-seo'
import { createClient } from '@/prismicio'
import { components } from '@/slices'

const Page = ({ page }) => {
  return (
    <>
      <NextSeo
        title={page?.data?.metaTitle || page?.data?.title}
        description={page?.data?.metaDescription}
      />
      <SliceZone slices={page.data.slices} components={components} />
    </>
  )
}

export default Page

export async function getStaticProps({ params, previewData }) {
  const client = createClient({ previewData })

  try {
    const page = await client.getByUID('page', params.uid)

    return {
      props: {
        page,
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

  const pages = await client.getAllByType('page')

  return {
    paths: pages.map(page => asLink(page)),
    fallback: 'blocking',
  }
}
