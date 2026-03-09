import { useEffect, useCallback, useState } from 'react'
import { createClient } from '@/prismicio'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const Layout = ({ page, children }) => {
  const [headerData, setHeaderData] = useState({})
  const [footerData, setFooterData] = useState({})

  const getLayoutData = useCallback(async () => {
    const client = createClient()
    const header = await client.getSingle('header')
    const footer = await client.getSingle('footer')

    return { header: header.data, footer: footer.data }
  }, [])

  useEffect(() => {
    getLayoutData().then(({ header, footer }) => {
      setHeaderData(header || {})
      setFooterData(footer || {})
    })
  }, [page?.id, getLayoutData])

  return (
    <>
      <Header {...headerData} />
      <div className="content">{children}</div>
      <Footer {...footerData} />
    </>
  )
}

export default Layout
