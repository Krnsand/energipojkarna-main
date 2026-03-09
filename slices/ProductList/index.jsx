import styles from './ProductList.module.scss'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import * as prismic from '@prismicio/client'
import TagLabel from '@/components/TagLabel'
import EnergyLabel from '@/components/EnergyLabel'
import BrandSelector from '@/components/BrandSelector'
import { getBrandsFromProductList } from '@/lib/utils/helpers'

const ProductList = ({ slice, context }) => {
  const products = React.useMemo(
    () =>
      slice?.items
        ?.flatMap(i => i.product)
        .filter(product => !!product.id && !!product.data),
    [slice?.items],
  )

  const brands = React.useMemo(
    () => getBrandsFromProductList(products),
    [products],
  )

  const getProductVariant = React.useCallback(product => {
    return product.data.variants?.[0]
  }, [])

  const productList = React.useMemo(() => {
    if (!context.brand) return products

    return products.filter(product => {
      return product.data.brand.uid === context.brand
    })
  }, [context.brand, products])

  const priceFormatter = React.useCallback(amount => {
    if (!amount) return null
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0,
    }).format(amount)
  }, [])

  return (
    <section className={`${styles.container} container`}>
      {brands.length && (
        <BrandSelector
          brands={brands}
          activeBrand={context.brand}
          baseUrl={context.baseUrl}
        />
      )}
      <div className={styles.productList}>
        {productList.map((product, i) => {
          const variant = getProductVariant(product)

          const price = priceFormatter(variant?.primary.price)
          return (
            <div key={`product-list-item-${product.id}-${i}`}>
              <motion.div whileTap={{ scale: 0.95 }}>
                <Link
                  draggable={false}
                  href={product.url}
                  className={styles.productCard}
                  scroll={true}>
                  <div className={styles.productImageWrapper}>
                    {variant?.primary.energy?.length > 0 && (
                      <div className={styles.energyLabel}>
                        <EnergyLabel label={variant?.primary.energy} />
                      </div>
                    )}
                    <figure className={styles.productImage}>
                      {product.data.primary_image?.url && (
                        <Image
                          draggable={false}
                          priority
                          src={prismic.asImageSrc(product.data.primary_image, {
                            width: 750,
                            q: 70,
                          })}
                          alt={product.data.name}
                          width={product.data.primary_image.dimensions.width}
                          height={product.data.primary_image.dimensions.height}
                        />
                      )}
                    </figure>
                  </div>

                  <div className={styles.productInfo}>
                    <div className={styles.productLabels}>
                      {variant?.primary.size?.length > 0 && (
                        <TagLabel color="green">
                          {variant?.primary.size}m²
                        </TagLabel>
                      )}
                      {variant?.primary.effect?.length > 0 && (
                        <TagLabel color="red">
                          {variant?.primary.effect}kW
                        </TagLabel>
                      )}
                      {variant?.primary.effect_cold?.length > 0 && (
                        <TagLabel color="blue">
                          {variant?.primary.effect_cold}kW
                        </TagLabel>
                      )}
                      {variant?.primary.five_year_warranty && (
                        <TagLabel color="yellow">5 ÅRS GARANTI</TagLabel>
                      )}
                    </div>
                    <div className="subtitle">{product.data.name}</div>
                    <div className={styles.priceContainer}>
                      {price && (
                        <span className={`body1 ${styles.priceText}`}>
                          {price}
                        </span>
                      )}
                      {variant?.primary?.price_note && (
                        <span className={`caption ${styles.priceNoteText}`}>
                          {variant?.primary?.price_note}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default ProductList
