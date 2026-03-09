import styles from './TagLabel.module.scss'

const TagLabel = ({ children, color, ...props }) => (
  <div
    className={`${styles.tagLabel} ${styles[color || 'green']} button4`}
    {...props}>
    {children}
  </div>
)
export default TagLabel
