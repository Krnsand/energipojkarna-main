import styles from './404.module.scss'
import { NextSeo } from 'next-seo'
import Button from '@/components/Button'
import Link from 'next/link'

const PageNotFound = () => {
  return (
    <div className={`container ${styles.container}`}>
      <NextSeo title={'Sidan kunde inte hittas'} />
      <section className={``}>
        <h1 className={`h3 ${styles.title}`}>
          Hoppsan! Sidan kunde inte hittas.
        </h1>
        <div className={`body1 ${styles.text}`}>
          Kanske har den flyttat eller så har den aldrig funnits.{' '}
        </div>
        <Link href="/" draggable={false}>
          <Button size="large" color="primary">
            Gå till startsidan
          </Button>
        </Link>
      </section>
    </div>
  )
}

export default PageNotFound
