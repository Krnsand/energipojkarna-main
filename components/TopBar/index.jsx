import styles from './TopBar.module.scss'
import { useWindowSize } from '@/lib/hooks'

const TopBar = ({ labels, className }) => {
  const { isTablet } = useWindowSize()
  return (
    <div className={`container ${styles.container} ${className}`}>
      {labels?.map((l, index) => (
        <div key={`topbar-label-${index}`} className={`${styles.bullet}`}>
          {l.label}
        </div>
      ))}
    </div>
  )
}
export default TopBar
