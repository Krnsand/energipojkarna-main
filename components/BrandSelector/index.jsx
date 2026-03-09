import styles from './BrandSelector.module.scss'
import React from 'react'
import Button from '@/components/Button'

import Link from 'next/link'

const BrandSelector = ({ brands, activeBrand, baseUrl }) => {
  const brandIsActive = React.useCallback(
    brand => {
      return activeBrand === brand.uid
    },
    [activeBrand],
  )

  return (
    <div className={styles.wrapper}>
      {brands.map(brand => {
        return (
          <Link
            key={brand.id}
            draggable={false}
            scroll={false}
            href={brandIsActive(brand) ? baseUrl : `${baseUrl}/${brand.uid}`}>
            <Button
              size="small"
              color={brandIsActive(brand) ? 'default' : 'white'}
              border>
              <span>{brand.data.name}</span>
            </Button>
          </Link>
        )
      })}
    </div>
  )
}

export default BrandSelector
