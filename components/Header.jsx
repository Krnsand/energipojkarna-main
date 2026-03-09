// import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { isSSR } from '@/lib/utils/helpers'
import { useWindowSize } from '@/lib/hooks/useWindowSize'
import HeaderDesktop from '@/components/HeaderDesktop'
import HeaderMobile from '@/components/HeaderMobile'

// let lastScroll = 0
const Header = ({ menu_links, top_bar, mobile_menu_buttons }) => {
  const { isMobile } = useWindowSize()

  // const scrollListener = () => {
  //   const currentScroll = window.scrollY

  //   if (currentScroll <= 0) {
  //     document.body.classList.remove('header-scroll-down')
  //     return
  //   }

  //   if (
  //     currentScroll > lastScroll &&
  //     !document.body.classList.contains('header-scroll-down')
  //   ) {
  //     document.body.classList.remove('header-scroll-up')
  //     document.body.classList.add('header-scroll-down')
  //   } else if (
  //     currentScroll < lastScroll &&
  //     document.body.classList.contains('header-scroll-down')
  //   ) {
  //     document.body.classList.remove('header-scroll-down')
  //     document.body.classList.add('header-scroll-up')
  //   }

  //   lastScroll = currentScroll
  // }

  // useEffect(() => {
  //   window.addEventListener('scroll', scrollListener)
  //   return () => window.removeEventListener('scroll', scrollListener)
  // }, [])

  return (
    <div>
      {isMobile ? (
        <HeaderMobile menu={menu_links} buttons={mobile_menu_buttons} />
      ) : (
        <HeaderDesktop menu={menu_links} topBar={top_bar} />
      )}
    </div>
  )
}

export default Header
