import Link from 'next/link'
import Logo from '@/components/Logo'
import styles from './HeaderMobile.module.scss'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef, useMemo } from 'react'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { PrismicLink } from '@prismicio/react'
import Button from '@/components/Button'
import GlobalSearch from '@/components/GlobalSearch'
import { usePathname } from 'next/navigation'

const HeaderMobile = ({ menu, buttons }) => {
  const [navbarActive, setNavbarActive] = useState(false)
  const pathname = usePathname()
  const menuRef = useRef(null)

  const [shouldHideSearch, setShouldHideSearch] = useState(true)

  useEffect(() => {
    if (!shouldHideSearch) {
      // scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [shouldHideSearch])

  // const hideOnPaths = ['/produkter/luftvarmepumpar/altech/altech-fxlvp']

  // // Create a variable to see if the route is produkter/luftvarmepumpar/altech/altech-fxlvp
  // const shouldHideSearch = useMemo(() => {
  //   return hideOnPaths.includes(pathname)
  // }, [pathname])

  useEffect(() => {
    if (menuRef.current) {
      if (navbarActive) {
        disableBodyScroll(menuRef.current)
      } else {
        clearAllBodyScrollLocks()
      }
    }
    return clearAllBodyScrollLocks
  }, [navbarActive])

  return (
    <div className={styles.container}>
      <header className={`${styles.header}`}>
        <div className={`${styles.navbar} container`}>
          <div className={styles.navbarInner}>
            <Link draggable={false} href={'/'} className={`${styles.logo}`}>
              <Logo textColor={navbarActive && 'var(--white)'} />
            </Link>
            {!navbarActive && (
              <div
                onClick={() => setShouldHideSearch(!shouldHideSearch)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px',
                  cursor: 'pointer',
                }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 50 50"
                  width="25"
                  height="25"
                  fill="var(--green)">
                  <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z" />
                </svg>
              </div>
            )}
            <div
              className={navbarActive ? styles.iconActive : styles.icon}
              onClick={() => setNavbarActive(!navbarActive)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="20"
                viewBox="0 0 30 20">
                <rect
                  width="30"
                  height="1"
                  fill={`${
                    navbarActive ? 'var(--white)' : 'var(--green)'
                  }`}></rect>
                <rect
                  y="9"
                  width="30"
                  height="1"
                  fill={`${
                    navbarActive ? 'var(--white)' : 'var(--green)'
                  }`}></rect>
                <rect
                  y="18"
                  width="30"
                  height="1"
                  fill={`${
                    navbarActive ? 'var(--white)' : 'var(--green)'
                  }`}></rect>
              </svg>
            </div>
          </div>
        </div>
        <motion.div
          ref={menuRef}
          className={`${styles.menu} container`}
          animate={navbarActive ? 'open' : 'closed'}
          transition={{ bounce: 0 }}
          initial={{ opacity: 0, height: '0%' }}
          variants={{
            open: { height: '100%', opacity: 1 },
            closed: { height: '0%' },
          }}>
          <motion.div
            className={styles.menuInner}
            initial={{ opacity: 0, y: 40 }}
            variants={{
              open: {
                opacity: 1,
                y: 0,
                transition: { delay: 0.3, bounce: 0 },
              },
              closed: {
                opacity: 0,
                y: 40,
              },
            }}
            animate={navbarActive ? 'open' : 'closed'}
            transition={{ duration: 0.15 }}>
            <ul className={styles.primaryMenu}>
              {menu?.map((m, index) => (
                <li
                  key={`mobile-header-link-${index}`}
                  className={styles.menuLink}>
                  <PrismicLink
                    field={m.link}
                    className="h3"
                    onClick={() => setNavbarActive(false)}>
                    {m.label}
                  </PrismicLink>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={{
              open: { y: 0, transition: { delay: 0.3, bounce: 0 } },
              closed: { y: '100%' },
            }}
            initial={{ y: '100%' }}
            transition={{ duration: 0.2 }}
            animate={navbarActive ? 'open' : 'closed'}
            className={`${styles.menuActions} container`}>
            {buttons?.map((b, index) => (
              <PrismicLink
                key={`mobile-header-button-${index}`}
                field={b.link}
                onClick={() => setNavbarActive(false)}>
                <Button size="large" color={index > 0 && 'contrast'}>
                  <strong>{b.label}</strong>
                </Button>
              </PrismicLink>
            ))}
          </motion.div>
        </motion.div>
      </header>

      <AnimatePresence>
        {!shouldHideSearch && (
          <motion.div className={`${styles.headerExtraContainer} container`}>
            <div className={styles.searchArea}>
              <GlobalSearch />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
export default HeaderMobile
