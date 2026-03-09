import styles from './FormHeader.module.scss'
import Logo from '@/components/Logo'

const FormHeader = ({ title, subtitle, withLogo = false }) => {
  return (
    <div className={styles.container}>
      {withLogo && (
        <div className={styles.logoWrapper}>
          <Logo />
        </div>
      )}
      {title && <h3 className={`${styles.title} subtitle`}>{title}</h3>}
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  )
}

export default FormHeader
