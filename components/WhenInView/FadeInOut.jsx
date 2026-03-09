import { motion } from 'framer-motion'

export default function FadeInOut({
  children,
  className = '',
  duration = 0.8,
  delay = 0,
}) {
  return (
    <motion.div
      className={className}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration, delay }}
      viewport={{
        once: true,
        amount: 'some',
      }}
      inherit={false}>
      {children}
    </motion.div>
  )
}
