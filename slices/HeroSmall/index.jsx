import styles from './HeroSmall.module.scss'
import Button from '@/components/Button'
import * as prismic from '@prismicio/client'
import { PrismicLink } from '@prismicio/react'

const HeroSmall = ({ slice, index }) => {
  const { primary } = slice
  const title = prismic.asText(primary.title)
  const subtitle = prismic.asText(primary.subtitle)
  const HeadingTag = `h${index === 0 ? '1' : '2'}`

  return (
    <section
      className={`${
        primary.backgroundColor !== 'White'
          ? styles.containerGreen
          : styles.container
      }`}>
      <div className={styles.content}>
        <>
          {primary.caption && (
            <span className={`${styles.caption} subtitle`}>
              {primary.caption}
            </span>
          )}
          {title && (
            <HeadingTag
              className={`h2 ${
                primary.wideTitle ? styles.titleWide : styles.title
              }`}>
              {title}
            </HeadingTag>
          )}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          {primary.buttonLabel && (
            <div className={styles.buttonWrapper}>
              <PrismicLink field={primary.buttonLink}>
                <Button
                  color={
                    primary.backgroundColor === 'White' ? 'green' : 'white'
                  }>
                  {primary.buttonLabel}
                </Button>
              </PrismicLink>
            </div>
          )}
        </>
      </div>
    </section>
  )
}

export default HeroSmall
