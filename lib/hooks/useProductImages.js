import { useState, useEffect } from 'react'
import * as prismic from '@prismicio/client'
import _ from 'lodash'

const imageTransformer = (id, image) => ({
  id,
  original: image.url,
  originalAlt: image.alt,
  originalWidth: image.dimensions.width,
  originalHeight: image.dimensions.height,
  thumbnail: prismic.asImageSrc(image, {
    q: 50,
    width: 150,
  }),
  thumbnailAlt: image.alt,
  thumbnailWidth: 150,
})

export const useProductImages = page => {
  const [galleryImages, setGalleryImages] = useState([])
  const [primaryImage, setPrimaryImage] = useState(null)

  useEffect(() => {
    if (!_.isEmpty(page?.data?.primary_image)) {
      const primaryImage = imageTransformer(
        `${page.id}-image_primary`,
        page.data.primary_image,
      )

      setPrimaryImage(primaryImage)

      const otherImages = _(page?.data?.images)
        .filter(item => !_.isEmpty(item.image))
        .map((item, index) =>
          imageTransformer(`${page.id}-image_${index}`, item.image),
        )
        .value()

      setGalleryImages([primaryImage, ...otherImages])
    }
  }, [page])

  return { primaryImage, galleryImages }
}
