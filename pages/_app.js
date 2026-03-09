import '@/styles/globals.scss'
import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Provider } from 'react-redux'
import { DefaultSeo } from 'next-seo'
import NextNProgress from 'nextjs-progressbar'
import { GoogleTagManager } from '@next/third-parties/google'

import { PrismicProvider } from '@prismicio/react'
import { store } from '@/lib/redux/store'
import WindowWatcher from '@/components/WindowWatcher'
import Layout from '@/components/Layout'
import { isDevelopment, isProduction } from '@/lib/utils/helpers'
import { useUTMCookies } from '@/lib/hooks/useUTMCookies'

function App({ Component, pageProps }) {
  // Automatically capture and save UTM parameters on all pages
  useUTMCookies()

  const minifyNProgressCSS = React.useCallback(
    css => (
      <style>
        {css
          // Remove line breaks
          .replace(/(?:\r\n|\r|\n)|/g, '')
          // Remove all extra whitespace
          .replace(/\s{2}/g, '')
          // Remove whitespace before and after semicolons
          .replace(/;\s/, ';')}
      </style>
    ),
    [],
  )

  return (
    <Provider store={store}>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#8bb51d" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>
      {!isDevelopment && <GoogleTagManager gtmId="GTM-5TH5GBX5" />}
      <DefaultSeo
        openGraph={{
          type: 'website',
          locale: 'en_IE',
          url: 'https://www.energipojkarna.se/',
          siteName: 'Energipojkarna',
        }}
        norobots={!isProduction}
        title="Allt inom värmepumpar"
        titleTemplate="Energipojkarna | %s"
      />
      <WindowWatcher />
      <NextNProgress
        color="var(--green)"
        transformCSS={minifyNProgressCSS}
        options={{ showSpinner: false }}
      />
      <PrismicProvider
        internalLinkComponent={({ href, ...props }) => (
          <Link draggable={false} href={href} {...props} />
        )}>
        <div className="document">
          <Layout page={pageProps.page}>
            <Component {...pageProps} />
          </Layout>
        </div>
      </PrismicProvider>
    </Provider>
  )
}

export default App
