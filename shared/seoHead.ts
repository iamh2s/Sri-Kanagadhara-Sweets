import { publicPages, type SeoPage } from './seo'
import { postalAddress, internationalPhone } from './storeLocation'

export const defaultSiteOrigin = 'https://srikanagadharasweets.vercel.app'
const businessName = 'Sri Kanagadhara Sweets'
const canonicalPaths = new Set(publicPages.map(page => page.path))

export function getHeadFields(page: SeoPage, siteUrl: string) {
  const site = new URL(siteUrl || defaultSiteOrigin)
  if (!['https:', 'http:'].includes(site.protocol)) throw new Error('VITE_SITE_URL must be an HTTP or HTTPS origin')
  const canonical = canonicalPaths.has(page.path) ? new URL(page.path, site.origin).href : ''
  const image = new URL(page.image || '/brand/sri-kanagadhara-logo.webp', site.origin).href
  const product = page.path.startsWith('/products/')
  const meta = {
    description: page.description,
    robots: page.indexable ? 'index, follow, max-image-preview:large' : 'noindex, follow',
    'og:site_name': businessName,
    'og:locale': 'en_IN',
    'og:type': product && page.indexable ? 'product' : 'website',
    ...(canonical ? { 'og:url': canonical } : {}),
    'og:title': page.title,
    'og:description': page.description,
    'og:image': image,
    'twitter:card': 'summary_large_image',
    'twitter:title': page.title,
    'twitter:description': page.description,
    'twitter:image': image,
  }
  let schema: Record<string, unknown> | null = null
  if (page.indexable && ['/', '/stores', '/contact'].includes(page.path)) {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'Store',
      '@id': site.origin + '/#store',
      name: businessName,
      url: site.origin + '/',
      image: new URL('/brand/sri-kanagadhara-logo.webp', site.origin).href,
      telephone: internationalPhone,
      address: { '@type': 'PostalAddress', ...postalAddress },
    }
  } else if (page.indexable && product) {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: page.heading,
      description: page.description,
      url: canonical,
      image,
      brand: { '@type': 'Brand', name: businessName },
    }
  }
  return { canonical, meta, schema }
}
