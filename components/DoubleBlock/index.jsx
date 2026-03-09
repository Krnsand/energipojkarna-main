import styles from './DoubleBlock.module.scss'
import Image from 'next/image'
import Button from '@/components/Button'
import Form from '@/components/Form'
import { PrismicLink, PrismicRichText } from '@prismicio/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useWindowSize } from '@/lib/hooks'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

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
            {image?.url && (
              <Image
                draggable={false}
                className={`${styles.image} ${
                  stretch_image ? styles.stretchImage : ''
                }`}
                quality={70}
                src={image.url}
                width={image.dimensions.width}
                height={image.dimensions.height}
                alt={image.alt}
              />
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
          <div className={styles.videoWrapper}>
            <>
              {isMobile ? (
                <div className={styles.videoInner}>
                  <div dangerouslySetInnerHTML={{ __html: video.html }} />
                </div>
              ) : (
                <a onClick={handleClick} className={styles.previewWrapper}>
                  <Image
                    draggable={false}
                    className={styles.youtubeImage}
                    width={video.thumbnail_width}
                    height={video.thumbnail_height}
                    src={video.thumbnail_url}
                    alt=""
                  />
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={styles.previewButtonWrapper}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="160"
                      height="160"
                      viewBox="0 0 160 160">
                      <g transform="translate(19604 -8440)">
                        <circle
                          cx="80"
                          cy="80"
                          r="80"
                          transform="translate(-19604 8440)"
                          fill="#fff"
                        />
                        <path
                          d="M29.817,8.885a6,6,0,0,1,10.365,0L64.736,50.977A6,6,0,0,1,59.554,60H10.446a6,6,0,0,1-5.183-9.023Z"
                          transform="translate(-19484 8485) rotate(90)"
                          fill="var(--green)"
                        />
                      </g>
                    </svg>
                  </motion.div>
                </a>
              )}
              {isLoaded && (
                <AnimatePresence>
                  {(isDesktop || isTablet) && activeVideo && (
                    <motion.div
                      animate={{ opacity: 1 }}
                      initial={{ opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={styles.modal}
                      onClick={() => setActiveVideo(false)}>
                      <div
                        className={styles.modalIframe}
                        ref={iframeRef}
                        dangerouslySetInnerHTML={{ __html: video.html }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </>
          </div>
        )}
    </section>
  )
}

export default DoubleBlock
