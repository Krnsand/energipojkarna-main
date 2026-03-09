import styles from './GalleryOverlay.module.scss'

import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useOnClickOutside, useOnEscClick } from '@/lib/hooks'
import { useWindowSize } from '@/lib/hooks/useWindowSize'
import ImageGallery from 'react-image-gallery'

const LeftNav = (onClick, disabled) => {
  return (
    <button
      className={`${styles.nav} ${styles.navLeft}`}
      onClick={onClick}
      disabled={disabled}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 19.5L8.25 12l7.5-7.5"></path>
      </svg>
    </button>
  )
}

const CloseNav = ({ onClick }) => {
  return (
    <button className={`${styles.nav} ${styles.navClose}`} onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
  )
}

const RightNav = (onClick, disabled) => {
  return (
    <button
      className={`${styles.nav} ${styles.navRight}`}
      onClick={onClick}
      disabled={disabled}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 4.5l7.5 7.5-7.5 7.5"></path>
      </svg>
    </button>
  )
}

const GalleryOverlay = ({ items, activeId, visible, setVisible }) => {
  const galleryRef = useRef(null)
  const wrapperRef = useRef(null)

  const { isMobile } = useWindowSize()

  useOnClickOutside(wrapperRef, () => setVisible(false))
  useOnEscClick(visible, () => {
    setVisible(false)
  })

  useEffect(() => {
    if (galleryRef.current) {
      const index = items.findIndex(item => item.id === activeId)
      if (index > -1) {
        galleryRef.current.slideToIndex(index)
      }
    }
  }, [items, galleryRef, activeId])

  useEffect(() => {
    if (galleryRef.current) {
      if (visible) {
        disableBodyScroll(galleryRef.current)
      } else {
        clearAllBodyScrollLocks()
      }
    }
    return () => {
      clearAllBodyScrollLocks()
    }
  }, [visible, galleryRef])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="gallery"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          transition={{ duration: 0.5 }}
          style={{ pointerEvents: 'auto' }}
          className={`${styles.galleryOverlay} grid container`}>
          <div className={styles.activeItemWrapper} ref={wrapperRef}>
            <ImageGallery
              ref={galleryRef}
              items={items}
              showFullscreenButton={false}
              showThumbnails={!isMobile}
              showPlayButton={false}
              renderLeftNav={LeftNav}
              renderRightNav={RightNav}
              renderCustomControls={() => (
                <CloseNav onClick={() => setVisible(false)} />
              )}
              slideDuration={0}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default GalleryOverlay
