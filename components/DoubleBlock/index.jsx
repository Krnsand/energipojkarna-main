import styles from './DoubleBlock.module.scss'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import Button from '@/components/Button'
import Form from '@/components/Form'
import { PrismicLink, PrismicRichText } from '@prismicio/react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useWindowSize } from '@/lib/hooks'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

const DoubleBlockVideo = dynamic(() => import('./DoubleBlockVideo'))

const DoubleBlock = ({ slice, bookDemo, index }) => {
  const {
    slice_type,
    primary: {
      backgroundColor,
      titleRow1,
      titleRow2,
      bodyText,
      formTitle,
      formSubtitle,
      formButtonText,
      formCheckboxText,
      image,
      stretch_image,
      video,
      bodyTextLeft,
      bodyTextRight,
    },
    items,
    variation,
    defaults,
  } = slice

  const title1 = titleRow1?.length > 0 ? titleRow1 : defaults?.titleRow1
  const title2 = titleRow2?.length > 0 ? titleRow2 : defaults?.titleRow2
  const body = bodyText
    ? bodyText
    : bodyTextLeft
    ? bodyTextLeft
    : defaults?.bodyText

  const iframeRef = useRef(null)
  const [activeVideo, setActiveVideo] = useState(false)
  const { isMobile, isDesktop, isTablet, isLoaded } = useWindowSize()
  const isForm = ['doubleBlockLargeWithForm'].includes(variation) || bookDemo
  const isTextText = ['doubleBlockLargeWithTexts'].includes(variation)

  const classes = [
    isForm
      ? styles.containerBookDemo
      : slice_type === 'double_block_small'
      ? styles.containerSmall
      : styles.containerLarge,
    backgroundColor === 'LightGrey' ? styles.containerLightGrey : '',
    styles[variation],
  ]
    .join(' ')
    .trim()
  const HeadingTag = `h${index === 0 ? '1' : '2'}`

  const onVideoActive = useCallback(() => {
    if (activeVideo) {
      if (iframeRef.current !== null) {
        disableBodyScroll(iframeRef.current)
      }
    } else {
      clearAllBodyScrollLocks()
    }
  }, [activeVideo])

  useEffect(() => {
    if (!isDesktop || !isTablet) return

    onVideoActive()
    window.addEventListener('resize', onVideoActive)

    return () => {
      clearAllBodyScrollLocks()
      window.removeEventListener('resize', onVideoActive)
    }
  }, [activeVideo, isDesktop, isTablet, onVideoActive])

  const handleClick = () => {
    setTimeout(() => {
      if (iframeRef.current) {
        const iframe = iframeRef.current.querySelector('iframe')
        if (iframe) {
          iframe.src +=
            '?rel=0&modestbranding=0&autohide=1&mute=1&showinfo=0&controls=0&autoplay=1'
        }
      }
    }, 200)
    setActiveVideo(true)
  }

  return (
    <section className={classes}>
      {!isTextText && (
        <div className={styles.textWrapper}>
          <div className={styles.textInner}>
            <div>
              {(title1 || title2) && (
                <HeadingTag className={`${styles.title} h3`}>
                  {title1 && <span>{title1}</span>}
                  {title2 && <span>{title2}</span>}
                </HeadingTag>
              )}
              {body && (
                <div className="richtext">
                  <PrismicRichText field={body} />
                </div>
              )}
            </div>
            {items.length > 0 && items[0].buttonLabel && (
              <div className={styles.buttons}>
                {items.map((i, n) => (
                  <PrismicLink
                    key={'button' + n}
                    field={i.buttonLink}
                    className={styles.buttonWrapper}>
                    <Button color={n % 2 === 0 ? 'white' : 'contrast'}>
                      {i.buttonLabel}
                    </Button>
                  </PrismicLink>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {isTextText && (
        <div className={styles.textTextWrapper}>
          <div className={styles.textInner}>
            <div>
              {(title1 || title2) && (
                <HeadingTag className={`${styles.title} h3`}>
                  {title1 && <span>{title1}</span>}
                  {title2 && <span>{title2}</span>}
                </HeadingTag>
              )}
              <div className={styles.textTextInnerWrapper}>
                {body && (
                  <div className="richtext">
                    <PrismicRichText field={body} />
                  </div>
                )}
                {bodyTextRight && (
                  <div className="richtext">
                    <PrismicRichText field={bodyTextRight} />
                  </div>
                )}
              </div>
            </div>
            {items.length > 0 && items[0].buttonLabel && (
              <div className={styles.buttons}>
                {items.map((i, n) => (
                  <PrismicLink
                    key={'button' + n}
                    field={i.buttonLink}
                    className={styles.buttonWrapper}>
                    <Button color={n % 2 === 0 ? 'white' : 'contrast'}>
                      {i.buttonLabel}
                    </Button>
                  </PrismicLink>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {!video && (
        <div
          className={`${
            isForm ? styles.rightWrapperForm : styles.rightWrapper
          } ${stretch_image ? styles.rightWrapperFull : ''}`}>
          <>
            {image?.url && image?.dimensions?.width && image?.dimensions?.height && (
              <div
                className={styles.imageSizer}
                style={{
                  aspectRatio: `${image.dimensions.width} / ${image.dimensions.height}`,
                }}>
                <Image
                  draggable={false}
                  className={`${styles.image} ${
                    stretch_image ? styles.stretchImage : ''
                  }`}
                  quality={70}
                  src={image.url}
                  alt={image.alt || ''}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}
            {isForm && (
              <Form
                variation={variation}
                formTitle={formTitle}
                formSubtitle={formSubtitle}
                buttonText={formButtonText || defaults?.formButtonText}
                checkboxText={formCheckboxText}
              />
            )}
          </>
        </div>
      )}
      {video &&
        ['doubleBlockSmallWithVideo', 'doubleBlockLargeWithVideo'].includes(
          variation,
        ) && (
          <DoubleBlockVideo
            video={video}
            variation={variation}
            styles={styles}
            isMobile={isMobile}
            isLoaded={isLoaded}
            isDesktop={isDesktop}
            isTablet={isTablet}
            activeVideo={activeVideo}
            setActiveVideo={setActiveVideo}
            handleClick={handleClick}
            iframeRef={iframeRef}
          />
        )}
    </section>
  )
}

export default DoubleBlock
