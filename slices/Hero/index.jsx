import { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './Hero.module.scss'
import Button from '@/components/Button'
import { useWindowSize } from '@/lib/hooks/useWindowSize'
import { PrismicLink, PrismicRichText } from '@prismicio/react'

const Hero = ({ slice }) => {
  const {
    primary: { titleRow1, titleRow2, text, imageDesktop, imageMobile },
    items,
  } = slice
  const { isMobile, isLoaded } = useWindowSize()
  const [image, setImage] = useState(null)

  useEffect(() => {
    if (isLoaded) {
      if (isMobile) {
        setImage(imageMobile)
      } else {
        setImage(imageDesktop)
      }
    }
  }, [imageDesktop, imageMobile, isLoaded, isMobile])

  return (
    <section className={styles.outerContainer}>
      <div className={styles.container}>
        {image?.url && (
          <div
            className={styles.imageWrapper}
            duration={isMobile ? 0 : undefined}>
            <Image
              draggable={false}
              src={image.url}
              alt="Välkomstbild på energipojkarna"
              width={image.dimensions.width}
              height={image.dimensions.height}
              priority
              sizes="100vw"
            />
          </div>
        )}
        <div className={styles.content} duration={isMobile ? 0 : undefined}>
          <>
            {(titleRow1 || titleRow2) && (
              <h1 className={`h2 ${styles.title}`}>
                {titleRow1 && <span>{titleRow1}</span>}
                {titleRow2 && <span>{titleRow2}</span>}
              </h1>
            )}
            <div className={`${styles.text}`}>
              {text && <PrismicRichText field={text} />}
            </div>
            {items.length > 0 && items[0].buttonLabel && (
              <div className={styles.buttons}>
                {items.map((i, n) => (
                  <div key={'button' + n} className={styles.buttonWrapper}>
                    <PrismicLink field={i.buttonLink}>
                      <Button
                        size="large"
                        color={n % 2 === 0 ? 'green' : 'white'}>
                        {i.buttonLabel}
                      </Button>
                    </PrismicLink>
                  </div>
                ))}
              </div>
            )}
          </>
        </div>
      </div>
    </section>
  )
}

export default Hero
