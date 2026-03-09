/**
 * @typedef {import("@prismicio/client").Content.ProductVariantSlice} ProductVariantSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<ProductVariantSlice>} ProductVariantProps
 * @param {ProductVariantProps}
 */
const ProductVariant = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}>
      Placeholder component for product_variant (variation: {slice.variation})
      Slices
    </section>
  )
}

export default ProductVariant
