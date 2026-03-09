import { useCallback, useEffect, useRef } from 'react'
import { updateWindowSize } from '@/lib/redux/slices'
import { useAppDispatch } from '@/lib/redux/hooks'
import styles from './WindowWatcher.module.scss'

const WindowWatcher = () => {
  const gutterRef = useRef(null)
  const dispatch = useAppDispatch()

  const updateViewportHeight = () => {
    document.documentElement.style.setProperty(
      '--viewport-height',
      `${window.innerHeight}px`,
    )
  }

  useEffect(() => {
    window.addEventListener('resize', updateViewportHeight)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => window.removeEventListener('resize', updateViewportHeight)
  }, [])

  const windowResize = useCallback(() => {
    let gutter = 10
    if (gutterRef.current) {
      gutter = gutterRef.current?.getBoundingClientRect().height
      if (gutter === 0) {
        gutter = 10
      }
    }

    dispatch(
      updateWindowSize({
        innerHeight: window.innerHeight,
        innerWidth: window.innerWidth,
        gutter: gutter,
      }),
    )
  }, [dispatch])

  useEffect(() => {
    windowResize()
    window.addEventListener('resize', windowResize)
    return () => {
      window.removeEventListener('resize', windowResize)
    }
  }, [dispatch, windowResize])

  return (
    <div className={styles.windowMeasurement}>
      <div ref={gutterRef} className={styles.gutter} />
    </div>
  )
}

export default WindowWatcher
