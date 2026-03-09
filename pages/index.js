import { SliceZone } from '@prismicio/react'
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

export async function getStaticProps() {
  const client = createClient()

  try {
    const page = await client.getSingle('homepage')

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
