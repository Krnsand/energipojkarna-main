import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { useCallback, useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { useRouter } from 'next/router'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import Button from '@/components/Button'

import styles from './ProductContactForm.module.scss'
import { gtmTrackEvent } from '@/lib/utils/helpers'
import { useUTMCookies } from '@/lib/hooks/useUTMCookies'

const ProductContactForm = ({ productName, onFormSuccess }) => {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [contactFormStatus, setContactFormStatus] = useState(null)
  const { getUTMParams } = useUTMCookies()

  const {
    isSubmitting,
    values,
    errors,
    touched,
    isValid,
    resetForm,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: {
      name: '',
      emailOrPhone: '',
    },
    validate: values => {
      const errors = {}
      if (!values.name) {
        errors.name = 'Namn är obligatoriskt'
      }
      if (!values.emailOrPhone) {
        errors.emailOrPhone = 'E-post eller telefonnummer är obligatoriskt'
      }

      let emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
      let phoneValidation =
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

      let strippedPhoneNumber = values.emailOrPhone.replace(/\D/g, '')
      if (
        !values.emailOrPhone.match(emailValidation) &&
        !strippedPhoneNumber.match(phoneValidation)
      ) {
        errors.emailOrPhone = 'Ogiltig e-post eller telefonnummer'
      }

      return errors
    },
    onSubmit: async (values, { setSubmitting }) => {
      if (!executeRecaptcha) {
        console.log('Recaptcha not available')
        onError()
        return
      }

      let token
      try {
        token = await executeRecaptcha()
      } catch (error) {
        console.log('ERROR ON CAPTCHA')
        onError()
        return
      }
      // Send the form data and the recaptcha token to your API
      setSubmitting(false)

      const utmData = getUTMParams()

      try {
        await axios.post(`/api/product-contact`, {
          ...values,
          token,
          product: productName,
          utmData,
        })

        // Determine if values.emailOrPhone is an email or phone number
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
          values.emailOrPhone,
        )

        onSuccess({
          name: values.name,
          email: isEmail ? values.emailOrPhone : undefined,
          phone: !isEmail ? values.emailOrPhone : undefined,
        })
      } catch (error) {
        onError()
      }
    },
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: Yup.object().shape({
      name: Yup.string().required(),
      emailOrPhone: Yup.string().required(),
    }),
  })

  const onSuccess = useCallback(
    data => {
      setContactFormStatus('success')

      gtmTrackEvent('generate_lead')

      onFormSuccess?.(data)

      // setTimeout(() => {
      //   resetForm()
      //   setContactFormStatus(null)
      // }, 4000)
    },
    [onFormSuccess],
  )

  const onError = useCallback(() => {
    setContactFormStatus('error')

    setTimeout(() => {
      resetForm()
      setContactFormStatus(null)
    }, 4000)
  }, [resetForm])

  const checkValueClass = value => {
    return value !== '' ? 'has-value' : ''
  }
  const animationConfig = {
    transition: { duration: 0.5 },
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  }

  return (
    <AnimatePresence mode="wait">
      {contactFormStatus === 'success' ? (
        <motion.div
          {...animationConfig}
          key="formSuccess"
          className={styles.contactFormStatus}>
          <legend className={`${styles.contactFormTitle} subtitle`}>
            Tack för ditt intresse, vi kommer kontakta dig så snart som möjligt!
          </legend>
        </motion.div>
      ) : contactFormStatus === 'error' ? (
        <motion.div
          {...animationConfig}
          exit={{ opacity: 0 }}
          key="formError"
          className={`${styles.contactFormStatus} ${styles.contactFormStatusError}`}>
          <legend className={`${styles.contactFormTitle} subtitle`}>
            Hoppsan, något gick fel. Vänligen försök igen eller kontakta oss via
            telefon.
          </legend>
        </motion.div>
      ) : (
        <motion.form
          {...animationConfig}
          exit={{ opacity: 0 }}
          key="form"
          className={styles.contactForm}
          onSubmit={handleSubmit}
          autoComplete="off">
          <legend className={`${styles.contactFormTitle} subtitle`}>
            Beställ offert
          </legend>
          <div className={styles.contactFormGroup}>
            <label
              htmlFor="name"
              className={`${styles.contactFormLabel} button5`}>
              Namn
            </label>
            <input
              type="text"
              id="name"
              autoComplete="on"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              disabled={isSubmitting}
              className={[
                checkValueClass(values.name),
                errors.name && touched.name ? 'error' : '',
                'small',
              ]
                .join(' ')
                .trim()}
              required
            />
          </div>
          <div className={styles.contactFormGroup}>
            <label
              htmlFor="emailOrPhone"
              className={`${styles.contactFormLabel} button5`}>
              Telefonnummer eller epostadress
            </label>
            <input
              type="text"
              id="emailOrPhone"
              autoComplete="on"
              onChange={handleChange}
              onBlur={handleBlur}
              // placeholder="Telefonnummer eller epostadress"
              value={values.emailOrPhone}
              disabled={isSubmitting}
              className={[
                checkValueClass(values.emailOrPhone),
                errors.emailOrPhone && touched.emailOrPhone ? 'error' : '',
                'small',
              ]
                .join(' ')
                .trim()}
              required
            />
          </div>

          <Button
            color="gray"
            type="submit"
            size="small"
            boxShadow
            disabled={isSubmitting}
            style={{ marginTop: '1rem', alignSelf: 'center', minWidth: '30%' }}>
            Skicka
          </Button>
          {errors.token && touched.token ? (
            <span className="body2 form-response">*{errors.token}</span>
          ) : (
            !isValid && (
              <span className="body2 form-response">
                *Vänligen kontrollera fälten
              </span>
            )
          )}
        </motion.form>
      )}
    </AnimatePresence>
  )
}

export default ProductContactForm
