import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'

const DoubleBlockVideo = ({
  video,
  variation,
  styles,
  isMobile,
  isLoaded,
  isDesktop,
  isTablet,
  activeVideo,
  setActiveVideo,
  handleClick,
  iframeRef,
}) => {
  if (
    !video ||
    !['doubleBlockSmallWithVideo', 'doubleBlockLargeWithVideo'].includes(
      variation,
    )
  ) {
    return null
  }

  return (
    <div className={styles.videoWrapper}>
      <>
        {isMobile ? (
          <div className={styles.videoInner}>
            <div dangerouslySetInnerHTML={{ __html: video.html }} />
          </div>
        ) : (
          <a
            onClick={handleClick}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleClick()
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Spela upp video"
            className={styles.previewWrapper}>
            <Image
              draggable={false}
              className={styles.youtubeImage}
              width={video.thumbnail_width}
              height={video.thumbnail_height}
              src={video.thumbnail_url}
              alt="Förhandsvisning av video"
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
  )
}

export default DoubleBlockVideo
