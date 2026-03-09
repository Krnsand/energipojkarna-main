import { useEffect, useRef, useState } from 'react'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import dynamic from 'next/dynamic'
import styles from './Form.module.scss'
import Button from '@/components/Button'
import FormHeader from '@/components/Form/FormHeader'

const ContactForm = dynamic(() => import('@/components/Form/ContactForm'))

const FormWrapper = ({
  formTitle,
  formSubtitle,
  buttonText = 'Skicka förfrågan',
  checkboxText,
}) => {
  const formRef = useRef(null)
  const resultRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [finished, setFinished] = useState(false)
  const [error, setError] = useState(false)
  const [formHeight, setFormHeight] = useState(0)
  const [resultHeight, setResultHeight] = useState(0)

  useEffect(() => {
    calculateHeights()
    window.addEventListener('resize', calculateHeights)

    setTimeout(() => {
      setLoaded(true)
    }, 600)
    return () => {
      window.removeEventListener('resize', calculateHeights)
    }
  }, [])

  const calculateHeights = () => {
    if (formRef.current) {
      setFormHeight(formRef.current.offsetHeight)
    }
    if (resultRef.current) {
      setResultHeight(resultRef.current.offsetHeight)
    }
  }

  const handleValidate = () => {
    if (formRef.current) {
      setTimeout(() => {
        if (formRef.current) {
          setFormHeight(formRef.current.offsetHeight)
        }
      }, 100)
    }
  }

  const handleSuccess = () => {
    setLoading(false)
    setFinished(true)
  }

  const handleError = () => {
    setLoading(false)
    setError(true)
    setFinished(true)
  }

  return (
    <div id="formRef" className={styles.formWrapper}>
      <GoogleReCaptchaProvider
        reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
        language="sv">
        <div className={styles.formContent}>
          <>
            <div
              className={`${styles.form} ${loaded ? styles.formLoaded : ''}`}
              style={{ minHeight: finished ? resultHeight : formHeight }}>
              <div
                ref={formRef}
                className={`${
                  formHeight > 0 && !finished
                    ? styles.formHeightShow
                    : styles.formHeight
                }`}>
                {!finished && (
                  <>
                    <ContactForm
                      title={formTitle}
                      subtitle={formSubtitle}
                      buttonText={buttonText}
                      loading={loading}
                      checkboxText={checkboxText}
                      onSubmit={() => setLoading(true)}
                      onSuccess={handleSuccess}
                      onError={handleError}
                      onValidate={handleValidate}
                    />
                  </>
                )}
              </div>
              <div
                ref={resultRef}
                className={`${
                  finished ? styles.resultHeightShow : styles.resultHeight
                }`}>
                {error ? (
                  <FormHeader
                    title="Hoppsan något gick fel!"
                    subtitle="Något gick fel, vänligen försök igen."
                    // withLogo={true}
                  />
                ) : (
                  <FormHeader
                    title="Tack!"
                    subtitle="Vi kontaktar dig inom kort."
                    // withLogo={true}
                  />
                )}
                <div className={styles.buttonWrapper}>
                  <Button
                    size="small"
                    color="white"
                    onClick={() => {
                      setFinished(false)
                      setTimeout(() => {
                        setError(false)
                      }, 1000)
                    }}>
                    Skicka en ny förfrågan
                  </Button>
                </div>
              </div>
            </div>
          </>
        </div>
      </GoogleReCaptchaProvider>
    </div>
  )
}

export default FormWrapper
