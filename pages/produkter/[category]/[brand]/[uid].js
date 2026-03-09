import axios from 'axios'
import { SliceZone, PrismicLink } from '@prismicio/react'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { motion } from 'framer-motion'
import { useProductImages } from '@/lib/hooks'
import _ from 'lodash'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useEffect, useState, useCallback } from 'react'
import { NextSeo } from 'next-seo'

import Button from '@/components/Button'
import Accordion from '@/components/Accordion'
import EnergyLabel from '@/components/EnergyLabel'
import GalleryOverlay from '@/components/GalleryOverlay'
import TagLabel from '@/components/TagLabel'
import ProductContactForm from '@/components/ProductContactForm'
import { useWindowSize } from '@/lib/hooks/useWindowSize'
import { createClient } from '@/prismicio'
import { components } from '@/slices'

import styles from './ProductPage.module.scss'
import { facebookTrackEvent } from '@/lib/utils/helpers'

const VariantPicker = ({ variants, activeVariant, setActiveVariant }) => {
  return (
    <div className={styles.activeVariantPicker}>
      <h4 className={`button1 ${styles.activeVariantTitle}`}>Välj storlek</h4>
      <div className={styles.variantButtonsContainer}>
        {variants.map(variant => (
          <Button
            className={styles.variantButton}
            key={variant.id}
            onClick={() => setActiveVariant(variant)}
            size="small"
            color={activeVariant?.id === variant.id ? 'default' : 'white'}
            border>
            <span className={styles.variantName}>{variant.primary.name}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}

const Price = ({ amount, note }) => {
  const priceText = new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
  }).format(amount)

  return (
    <div className={styles.priceContainer}>
      <div className={`h3 ${styles.priceText}`}>{priceText}</div>
      {note && <div className={`caption ${styles.priceNoteText}`}>{note}</div>}
    </div>
  )
}

const ProductPage = ({ page }) => {
  const [activeAccordion, setActiveAccordion] = useState('')
  const [showGallery, setShowGallery] = useState(false)
  const [activeGalleryId, setActiveGalleryId] = useState('')
  const [activeVariant, setActiveVariant] = useState(
    page.data.variants?.[0] || null,
  )

  const openGallery = id => {
    setActiveGalleryId(id)
    setShowGallery(!showGallery)
  }

  useEffect(() => {
    setActiveVariant(page.data.variants?.[0] || null)
    return () => setActiveVariant(null)
  }, [page.data.variants])

  useEffect(() => {
    if (
      !activeVariant ||
      // this is for page change, make sure
      !page.data.variants.map(variant => variant.id).includes(activeVariant?.id)
    )
      return

    const activeVariantPrice = activeVariant?.primary.price || 0

    facebookTrackEvent('ViewContent', {
      content_ids: [page.uid],
      content_type: 'product',
      value: activeVariantPrice,
      currency: 'SEK',
    })
  }, [activeVariant, page])

  const onFormSuccess = useCallback(
    async userData => {
      if (!activeVariant) return

      const activeVariantPrice = activeVariant?.primary.price || 0

      // Generate unique event ID for deduplication between pixel and CAPI
      const eventId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      const leadData = {
        content_ids: [page.uid],
        content_type: 'product',
        value: activeVariantPrice,
        currency: 'SEK',
      }

      // Send to Facebook Pixel with event ID
      facebookTrackEvent('Lead', leadData, { eventID: eventId })

      try {
        // Send to Conversions API with same event ID for deduplication
        await axios.post('/api/capi', {
          leadData: leadData,
          userData: {
            email: userData.email,
            phone: userData.phone,
            name: userData.name,
          },
          eventSourceUrl: window.location.href,
          eventId: eventId,
        })
      } catch (err) {
        console.error('Error:', err)
      }
    },
    [activeVariant, page.uid],
  )

  const { primaryImage, galleryImages } = useProductImages(page)

  const { isMobile } = useWindowSize()

  const technicalDataGroups = useMemo(() => {
    const technicalData = _(activeVariant?.items || [])
    return technicalData
      .filter(entry => !!entry.technical_data?.data?.category)
      .map(entry => ({
        ...entry,
        category: entry.technical_data.data.category,
      }))
      .groupBy('technical_data.data.category')
      .toPairs()
      .sortBy(0)
      .fromPairs()
      .toArray()
      .value()
  }, [activeVariant?.items])

  const documents = useMemo(() => {
    return _(page.data.documents)
      .filter(document => !!document?.file?.url)
      .value()
  }, [page.data.documents])

  const productCategory = page.data.category

  return (
    <>
      <GoogleReCaptchaProvider
        reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
        language="sv">
        <NextSeo
          title={page?.data?.metaTitle || page?.data?.name}
          description={page?.data?.metaDescription}
        />
        <div className={`${styles.container}`}>
          <div className={`${styles.productCard}`}>
            {isMobile && (
              <PrismicLink
                draggable={false}
                href={productCategory.url}
                className={`button3 ${styles.breadcrumbLink}`}>
                {productCategory.data.name}
              </PrismicLink>
            )}
            <div className={styles.productCardLeft}>
              {isMobile && (
                <h1 className={`${styles.title} h2`}>{page.data.name}</h1>
              )}
              <div className={`${styles.productImageWrapper}`}>
                <GalleryOverlay
                  items={galleryImages}
                  visible={showGallery}
                  setVisible={setShowGallery}
                  activeId={activeGalleryId}
                />

                <div>
                  <>
                    {page.data.energy?.length > 0 && (
                      <div className={styles.energyLabel}>
                        <EnergyLabel label={page.data.energy} />
                      </div>
                    )}
                    {primaryImage && (
                      <motion.figure
                        className={styles.productImage}
                        onClick={() => openGallery(primaryImage.id)}>
                        <Image
                          draggable={false}
                          priority
                          src={primaryImage.original}
                          alt={page.data.name}
                          width={primaryImage.originalWidth}
                          height={primaryImage.originalHeight}
                        />
                      </motion.figure>
                    )}
                    {!isMobile && galleryImages?.length > 0 && (
                      <div className={styles.productImageThumbnailContainer}>
                        {galleryImages
                          .filter(
                            image => image.id !== `${page.id}-image_primary`,
                          )
                          .splice(0, 4)
                          .map(image => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              onClick={() => openGallery(image.id)}
                              className={styles.productImageThumbnail}
                              key={image.id}
                              src={image.thumbnail}
                              alt={image.thumbnailAlt}
                            />
                          ))}
                      </div>
                    )}
                  </>
                </div>
              </div>
            </div>
            <div className={styles.productCardRight}>
              <div className={`${styles.productInfo}`}>
                <div>
                  {isMobile && activeVariant?.primary.price && (
                    <Price
                      amount={activeVariant.primary.price}
                      note={activeVariant.primary.price_note}
                    />
                  )}
                  <div className={styles.productLabels}>
                    {activeVariant?.primary.size?.length > 0 && (
                      <TagLabel color="green">
                        {activeVariant?.primary.size}m²
                      </TagLabel>
                    )}
                    {activeVariant?.primary.effect?.length > 0 && (
                      <TagLabel color="red">
                        {activeVariant?.primary.effect}kW
                      </TagLabel>
                    )}
                    {activeVariant?.primary.effect_cold?.length > 0 && (
                      <TagLabel color="blue">
                        {activeVariant?.primary.effect_cold}kW
                      </TagLabel>
                    )}
                    {activeVariant?.primary.five_year_warranty && (
                      <TagLabel color="yellow">5 ÅRS GARANTI</TagLabel>
                    )}
                  </div>
                  {!isMobile && (
                    <h1 className={`${styles.title} h2`}>{page.data.name}</h1>
                  )}
                  <div className="text subtitle">
                    {page.data.short_description}
                  </div>
                  {page.data.variants?.length && (
                    <VariantPicker
                      variants={page.data.variants}
                      activeVariant={activeVariant}
                      setActiveVariant={setActiveVariant}
                    />
                  )}
                  {!isMobile && activeVariant?.primary.price && (
                    <Price
                      amount={activeVariant.primary.price}
                      note={activeVariant.primary.price_note}
                    />
                  )}
                  <ProductContactForm
                    onFormSuccess={onFormSuccess}
                    productName={page.data.name}
                  />
                  <div className={styles.accordionWrapper}>
                    {technicalDataGroups.length > 0 && (
                      <Accordion
                        title="Teknisk data"
                        setActive={setActiveAccordion}
                        active={activeAccordion}>
                        {technicalDataGroups.map(group => {
                          return (
                            <div
                              className={styles.technicalDataGroup}
                              key={`product_data-group_${group[0].category}`}>
                              <h5
                                className={`body2 ${styles.technicalDataGroupTitle}`}>
                                {group[0].category}
                              </h5>
                              {group.map((item, index) => (
                                <div
                                  className={`button2 ${
                                    styles.technicalDataEntry
                                  } grid ${
                                    index % 2 === 0 &&
                                    styles.technicalDataEntryEven
                                  }`}
                                  key={item.technical_data.id}>
                                  <div
                                    className={styles.techincalDataEntryTitle}>
                                    {item.technical_data.data.title}
                                  </div>
                                  <div
                                    className={styles.techincalDataEntryUnit}>
                                    {item.technical_data.data.unit}
                                  </div>
                                  <div
                                    className={styles.techincalDataEntryValue}>
                                    {item.technical_data_value}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )
                        })}
                      </Accordion>
                    )}
                    {documents?.length > 0 && (
                      <Accordion
                        title="Dokument"
                        setActive={setActiveAccordion}
                        active={activeAccordion}>
                        {documents.map((document, index) => {
                          return (
                            <div key={`${page.id}_file_${index}`}>
                              <Link
                                draggable={false}
                                target="_blank"
                                href={document.file.url}
                                className={`body2`}>
                                📎 {document.name}
                              </Link>
                            </div>
                          )
                        })}
                      </Accordion>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <SliceZone slices={page.data.slices} components={components} />
        </div>
      </GoogleReCaptchaProvider>
    </>
  )
}

export async function getStaticProps({ params, previewData }) {
  const client = createClient({ previewData })

  try {
    const page = await client.getByUID('product', params.uid, {
      fetchLinks: [
        'technical_product_data.title',
        'technical_product_data.unit',
        'technical_product_data.category',
        'category.name',
      ],
    })

    return {
      props: {
        page,
      },
      revalidate: 10,
    }
  } catch (error) {
    // Maybe log ?
  }

  return { notFound: true, revalidate: 10 }
}

export async function getStaticPaths(props) {
  const client = createClient()

  const pages = await client.getAllByType('product')

  return {
    paths: pages.map(
      page =>
        `/produkter/${page.data.category.uid}/${page.data.brand.uid}/${page.uid}`,
    ),
    fallback: 'blocking',
  }
}

export default ProductPage
