import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { PrismicLink } from '@prismicio/react'
import styles from './HeaderDesktop.module.scss'
import Logo from '@/components/Logo'
import TopBar from '@/components/TopBar'
import GlobalSearch from '@/components/GlobalSearch'

const HeaderDesktop = ({ menu, topBar }) => {
  const router = useRouter()
  return (
    <header className={`${styles.header}`}>
      <TopBar className={styles.topBar} labels={topBar} />
      <Link
        draggable={false}
        href="/"
        aria-label="Energipojkarna - startsida"
        className={`${styles.logo} container`}>
        <Logo />
      </Link>
      <nav className={`${styles.links} container`}>
        {menu?.map((m, index) => {
          const linkActive = router.asPath === m.link.url
          return (
            <motion.div
              key={'header-menu-' + index}
              whileTap={
                !linkActive ? { scale: 0.9, color: 'var(--green)' } : undefined
              }>
              <PrismicLink
                field={m.link}
                className={`${styles.link} ${
                  linkActive ? styles.activeLink : ''
                }`}>
                {m.label}
              </PrismicLink>
            </motion.div>
          )
        })}
      </nav>
      <div className={styles.searchArea}>
        <GlobalSearch />
      </div>
      <div className={styles.logoSpacer} />
    </header>
  )
}
export default HeaderDesktop
