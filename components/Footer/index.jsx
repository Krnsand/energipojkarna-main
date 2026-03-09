import styles from './Footer.module.scss'
import { PrismicLink, PrismicRichText, PrismicImage } from '@prismicio/react'

import { useRouter } from 'next/router'

const Footer = ({
  menu_links,
  visit_us_text,
  contact_us_text,
  partner_logos,
}) => {
  const router = useRouter()

  return (
    <footer className={`${styles.container} container`}>
      <div className="grid">
        <div className={styles.footerLinks}>
          <nav className={styles.footerNav}>
            {menu_links?.map((m, index) => {
              const linkActive = router.asPath === m.link.url
              return (
                <PrismicLink
                  key={`footer-link-${index}`}
                  field={m.link}
                  className={`${styles.footerTitle} ${styles.link} subtitle ${
                    linkActive ? styles.activeLink : ''
                  }`}>
                  {m.label}
                </PrismicLink>
              )
            })}
          </nav>
        </div>

        <div className={styles.footerPhone}>
          <div className={`${styles.footerTitle} subtitle`}>Besök oss</div>
          <PrismicRichText field={visit_us_text} />
        </div>
        <div className={styles.footerAddress}>
          <div className={`${styles.footerTitle} subtitle`}>Kontakta oss</div>
          <div className={styles.footerContactInformation}>
            <PrismicRichText field={contact_us_text} />
          </div>
        </div>
        <div className={styles.footerPartners}>
          <div className={`${styles.footerTitle} subtitle`}>Partners</div>
          <div className={styles.footerPartnerImages}>
            {partner_logos?.map((p, index) => (
              <div key={`footer-image-partner-${index}`}>
                <PrismicImage
                  draggable={false}
                  width={p.image.width}
                  field={p.image}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
