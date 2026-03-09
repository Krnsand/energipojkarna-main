import { uniqBy } from 'lodash'

export const linkResolver = doc => {
  if (!doc) {
    return '#'
  }
  //   if (doc.link_type === 'Web') {
  //     return doc.url
  //   }
  //   if (doc.isBroken) {
  //     return '/not-found'
  //   }
  if (doc.type === 'page') {
    return doc.url
  }
  if (doc.type === 'homepage') {
    return '/'
  }
  if (doc.type === 'category') {
    return `/produkter/${doc.uid}`
  }
  //   if (doc.type === 'function') {
  //     return `/funktioner/${doc.uid}`
  //   }
  return '/'
}

export const isSSR = typeof window === 'undefined'

export const isDevelopment = process?.env?.NODE_ENV === 'development'

export const isProduction = process?.env?.VERCEL_ENV === 'production'

export const activeLink = (href, asPath) => {
  if (asPath === href) {
    return 'active'
  }
  return ''
}

export const facebookTrackEvent = (event, data = {}, options = {}) => {
  if (isDevelopment) {
    console.log('Facebook Event Tracked:', { event, data, options })
    return
  }
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', event, data, options)
  }
}

export const gtmTrackEvent = (event, data = {}) => {
  if (isDevelopment) {
    console.log('GTM Event Tracked:', {
      event,
      ...data,
    })
    return
  }

  if (typeof window !== 'undefined' && Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event,
      ...data,
    })
  }
}

export const convertToSlug = text => {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

export const getBrandsFromProductList = productList => {
  return uniqBy(
    productList.flatMap(product => product.data.brand).filter(Boolean),
    'id',
  )
}

export const createPagination = (current, total) => {
  const center = [current - 2, current - 1, current, current + 1, current + 2],
    filteredCenter = center.filter(p => p > 1 && p < total),
    includeThreeLeft = current === 5,
    includeThreeRight = current === total - 4,
    includeLeftDots = current > 5,
    includeRightDots = current < total - 4

  if (includeThreeLeft) filteredCenter.unshift(2)
  if (includeThreeRight) filteredCenter.push(total - 1)

  if (includeLeftDots) filteredCenter.unshift('...')
  if (includeRightDots) filteredCenter.push('...')

  return [1, ...filteredCenter, total]
}

export const getCookie = name => {
  if (typeof window === 'undefined') return
  return localStorage.getItem(name)
}

export const setCookie = (name, value) => {
  if (typeof window === 'undefined') return
  return localStorage.setItem(name, value)
}

export const isIOS = () => {
  if (typeof window === 'undefined' || !window?.navigator) return false

  return (
    [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod',
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  )
}

export const withSliceData = async (client, props) => {
  if (!props.props.page?.data?.slices?.length) {
    return props
  }

  for (let i = 0; i < props.props.page.data.slices.length; i++) {
    const slice = props.props.page.data.slices[i]

    // if (slice.slice_type === 'product_list') {
    //   slice.products = await client.getAllByType('product', {
    //     predicates: [
    //       predicate.at(
    //         'my.product.category',
    //         slice.primary.product_category.id,
    //       ),
    //     ],
    //   })
    // }
  }
  return props
}
