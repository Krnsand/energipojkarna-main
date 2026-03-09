import styles from './FormFooter.module.scss'
import Button from '@/components/Button'
import Logo from '@/components/Logo'
import { useWindowSize } from '@/lib/hooks'

const FormFooter = ({ loading, buttonText }) => {
  const { isMobile } = useWindowSize()
  return (
    <div className={styles.formFooter}>
      <Button color="white" size={isMobile ? 'large' : ''} type="submit">
        {buttonText}
      </Button>
      {/* <div className={styles.logoWrapper}>{loading ? 'loading' : <Logo />}</div> */}
    </div>
  )
}

export default FormFooter
