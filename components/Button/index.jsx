import { motion } from 'framer-motion'
import styles from './Button.module.scss'

const Button = ({
  children,
  size = 'default',
  color = 'default',
  border = true,
  boxShadow = false,
  className = '',
  ...props
}) => {
  return (
    <motion.button
      className={`${size === 'small' ? 'button2' : 'button1'} ${
        styles.button
      } ${styles[`size-${size}`] || ''} ${styles[`color-${color}`] || ''} ${
        border ? styles.border : ''
      } ${boxShadow ? styles.boxShadow : ''} ${className}`}
      whileTap={{
        scale: 0.95,
        boxShadow: boxShadow ? '0px 0px 0px rgba(0,0,0,0)' : '',
      }}
      {...props}>
      {children}
    </motion.button>
  )
}

export default Button
