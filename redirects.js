const { HttpStatusCode } = require('axios')

// export type Redirect = {
//   source: string,
//   destination: string,
//   basePath?: false,
//   locale?: false,
//   has?: RouteHas[],
//   missing?: RouteHas[],
// } & (
//   | {
//       statusCode?: never,
//       permanent: boolean,
//     }
//   | {
//       statusCode: number,
//       permanent?: never,
//     }
// )

const urls = [
  {
    source: '/bli-uppringd',
    destination: '/kontakta-oss',
    statusCode: HttpStatusCode.MovedPermanently,
  },
  {
    source: '/sida/support',
    destination: '/alla-vara-installatorer-ar-utbildade-och-certifierade',
    statusCode: HttpStatusCode.MovedPermanently,
  },
  {
    source: '/sida/installation',
    destination: '/alla-vara-installatorer-ar-utbildade-och-certifierade',
    statusCode: HttpStatusCode.MovedPermanently,
  },
  {
    source: '/sida/garantier',
    destination: '/garantier',
    statusCode: HttpStatusCode.MovedPermanently,
  },
  {
    source: '/sida/om-oss',
    destination: '/varfor-valja-oss',
    statusCode: HttpStatusCode.MovedPermanently,
  },
  {
    source: '/sida/rotavdrag',
    destination: '/rotavdrag',
    statusCode: HttpStatusCode.MovedPermanently,
  },
  {
    source: '/kontakt',
    destination: '/kontakta-oss',
    statusCode: HttpStatusCode.MovedPermanently,
  },

  {
    source: '/produkter/vattenburen-varme',
    destination: '/produkter/luftvarmepumpar',
    statusCode: HttpStatusCode.MovedPermanently,
  },
  {
    source: '/produkter/vattenburen-varme/luft-vatten-varmepumpar',
    destination: '/produkter/luftvarmepumpar',
    statusCode: HttpStatusCode.MovedPermanently,
  },
  {
    source: '/produkter/luft-luft-varmepumpar',
    destination: '/produkter/luftvarmepumpar',
    statusCode: HttpStatusCode.MovedPermanently,
  },
  {
    source: '/produkter/luft-luft-varmepumpar/fujitsu',
    destination: '/produkter/luftvarmepumpar/fujitsu',
    statusCode: HttpStatusCode.MovedPermanently,
  },
  {
    source: '/produkter/luft-luft-varmepumpar/mitsubishi',
    destination: '/produkter/luftvarmepumpar/mitsubishi',
    statusCode: HttpStatusCode.MovedPermanently,
  },
  {
    source: '/produkter/luft-luft-varmepumpar/panasonic',
    destination: '/produkter/luftvarmepumpar/panasonic',
    statusCode: HttpStatusCode.MovedPermanently,
  },
  {
    source: '/produkter/luft-luft-varmepumpar/panasonic/panasonic-hz25-xke',
    destination: '/produkter/luftvarmepumpar/panasonic/panasonic-hz',
    statusCode: HttpStatusCode.MovedPermanently,
  },
  {
    source: '/produkter/luft-luft-varmepumpar/fujitsu/slim-excellence-14',
    destination: '/produkter/luftvarmepumpar/fujitsu/fujitsu-slim-excellence',
    statusCode: HttpStatusCode.MovedPermanently,
  },
  {
    source:
      '/produkter/luft-luft-varmepumpar/fujitsu/fujitsu-slim-excellence-12',
    destination: '/produkter/luftvarmepumpar/fujitsu/fujitsu-slim-excellence',
    statusCode: HttpStatusCode.MovedPermanently,
  },
  {
    source:
      '/produkter/luft-luft-varmepumpar/fujitsu/fujitsu-slim-excellence-09',
    destination: '/produkter/luftvarmepumpar/fujitsu/fujitsu-slim-excellence',
    statusCode: HttpStatusCode.MovedPermanently,
  },
]

module.exports = async () => urls
