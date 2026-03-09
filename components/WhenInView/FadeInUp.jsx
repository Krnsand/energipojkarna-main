import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useWindowSize } from '@/lib/hooks/useWindowSize'

export default function FadeInLeft({
  children,
  className = '',
  duration = 1,
  delay = 0,
}) {
  const { isDesktop } = useWindowSize()

  return (
    <motion.div
      className={className}
      style={{ opacity: 0, y: isDesktop ? '5vw' : '0' }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        once: true,
        amount: 'some',
      }}
      transition={{
        duration,
        delay,
        ease: isDesktop ? [0.465, 0.183, 0.153, 0.946] : undefined,
      }}
      inherit={false}>
      {children}
    </motion.div>
  )
}
