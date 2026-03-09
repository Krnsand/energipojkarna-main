import styles from './Accordion.module.scss'
import { useRef, useState, useCallback } from 'react'
import { useScrollTo } from 'framer-motion-scroll-to-hook'
import { motion, AnimatePresence } from 'framer-motion'

import { useEffect } from 'react'

const Accordion = ({ children, title, active, setActive, ...props }) => {
  const ref = useRef(null)
  const [expanded, setExpanded] = useState(false)
  const scrollTo = useScrollTo()

  const shouldBeActive = active === title

  useEffect(() => {
    setExpanded(shouldBeActive && !expanded)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, active])

  const onExpandComplete = useCallback(() => {
    if (expanded && shouldBeActive) {
      scrollTo(ref.current, -60)
    }
  }, [expanded, shouldBeActive, scrollTo, title])

  return (
    <div {...props}>
      <div className={styles.container} ref={ref}>
        <motion.header
          className={`${styles.header} ${
            expanded ? styles.headerExpanded : ''
          }`}
          onClick={() => {
            shouldBeActive ? setActive('') : setActive(title)
          }}>
          <span className={`${styles.title} button3`}>{title}</span>
          <div className={styles.activeIcon}>
            <motion.div
              animate={{ scale: expanded ? 0 : 1 }}
              className={`${styles.activeIconVertical} ${
                expanded ? styles.activeIconExpanded : ''
              }`}
            />
            <div
              className={`${styles.activeIconHorizontal} ${
                expanded ? styles.activeIconExpanded : ''
              }`}
            />
          </div>
        </motion.header>
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="content"
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1, height: 'auto' },
                collapsed: { opacity: 0, height: 0 },
              }}
              transition={{ duration: 0.3 }}
              onAnimationComplete={onExpandComplete}>
              <div className={styles.content}>{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Accordion
