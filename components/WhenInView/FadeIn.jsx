import { motion } from 'framer-motion'

export default function FadeIn({
  children,
  className = '',
  duration = 1,
  delay = 0,
}) {
  return (
    <motion.div
      className={className}
      style={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{
        once: true,
        amount: 'some',
      }}
      transition={{ duration, delay }}
      inherit={false}>
      {children}
    </motion.div>
  )
}
