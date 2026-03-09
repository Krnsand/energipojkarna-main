import axios from 'axios'
import * as Yup from 'yup'
import { PrismicRichText } from '@prismicio/react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { useFormik } from 'formik'
import { motion } from 'framer-motion'
import FormHeader from '@/components/Form/FormHeader'
import FormFooter from '@/components/Form/FormFooter'
import { useUTMCookies } from '@/lib/hooks/useUTMCookies'

const ContactForm = ({
  title,
  subtitle,
  buttonText,
  checkboxText,
  loading,
  onSubmit,
  onSuccess,
  onError,
  onValidate,
}) => {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const { getUTMParams } = useUTMCookies()

  const {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: {
      name: '',
      message: '',
      phone: '',
      email: '',
      token: '',
      // approve: false,
    },
    onSubmit: async (values, { resetForm, setErrors, setFieldValue }) => {
      if (!executeRecaptcha) {
        return
      }

      let token
      try {
        token = await executeRecaptcha()
      } catch (error) {
        setErrors({
          token:
            'Tyvärr så kunde vi inte bekräfa att du inte är en robot 🤖, om detta är ett fel så ursäktar vi för detta och ber er kontakta oss via telefon.',
        })
        return
      }

      onSubmit()

      const utmData = getUTMParams()

      try {
        await axios.post(`/api/contact`, { ...values, token, utmData })

        if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
          window.fbq('track', 'Lead')
        }
        setTimeout(() => {
          onSuccess()
          resetForm()
        }, 2000)
      } catch {
        setTimeout(() => {
          onError()
          resetForm()
        }, 2000)
      }
    },
    validate: values => {
      onValidate()
    },
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: Yup.object().shape(
      {
        phone: Yup.string()
          .matches(
            /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
          )
          .when('email', function (v) {
            if (v == null) return this.required()
          }),
        email: Yup.string()
          .email()
          .when('phone', function (v) {
            if (v == null) return this.required()
          }),
        message: Yup.string(),
        // approve: Yup.bool().oneOf([true]),
      },
      ['phone', 'email', 'email', 'phone', 'message'],
    ),
  })

  const checkValueClass = value => {
    return value !== '' ? 'has-value' : ''
  }

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      {loading && (
        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 3,
          }}
        />
      )}
      <FormHeader title={title} subtitle={subtitle} />
      <input
        type="text"
        name="name"
        className={checkValueClass(values.name)}
        placeholder="Namn"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.name}
      />
      <input
        type="tel"
        name="phone"
        className={[
          checkValueClass(values.phone),
          errors.phone && touched.phone ? 'error' : '',
        ]
          .join(' ')
          .trim()}
        placeholder="Telefonnummer"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.phone}
      />
      <input
        type="email"
        name="email"
        className={[
          checkValueClass(values.email),
          errors.email && touched.email ? 'error' : '',
        ]
          .join(' ')
          .trim()}
        placeholder="Email"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.email}
      />
      <textarea
        type="text"
        name="message"
        className={checkValueClass(values.message)}
        placeholder="Meddelande"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.message}
      />
      {/* <label className={errors.approve && touched.approve ? 'error' : ''}>
        {checkboxText && checkboxText[0].text && (
          <PrismicRichText field={checkboxText} />
        )}
        <input
          type="checkbox"
          name="approve"
          checked={values.approve}
          onChange={e => {
            setFieldValue('approve', e.target.checked)
          }}
        />
        <span className="checkmark">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12.407"
            height="8.721"
            viewBox="0 0 12.407 8.721">
            <path
              id="Path_89"
              data-name="Path 89"
              d="M10825.219,2847.948l4.04,4.04,7.66-7.66"
              transform="translate(-10824.865 -2843.975)"
              fill="none"
              stroke="#fff"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
            />
          </svg>
        </span>
      </label> */}
      {errors.token && touched.token ? (
        <span className="body2 form-response">*{errors.token}</span>
      ) : (
        !isValid && (
          <span className="body2 form-response">
            *Vänligen kontrollera fälten
          </span>
        )
      )}
      <FormFooter buttonText={buttonText} loading={loading} />
    </form>
  )
}

export default ContactForm
