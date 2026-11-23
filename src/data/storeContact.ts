/// <reference types="vite/client" />

const configuredEmail = import.meta.env.VITE_STORE_CONTACT_EMAIL?.trim() ?? ''
export const storeAddress = 'No. 3, Gandhi Road, Krishnapuram, Ambur, Tirupathur, Tamil Nadu 635802'
export const storePhone = '7603-945699'
export const storePhoneHref = 'tel:+917603945699'
export const prebookingPhone = '9677209077'
export const prebookingPhoneHref = 'tel:+919677209077'

export const storeContactEmail = /^[\w.+-]+@[a-z\d.-]+\.[a-z]{2,}$/i.test(configuredEmail)
  ? configuredEmail
  : 'srikhanagadharasweets@shakshagroupllp.in'

export function storeEmailLink(subject: string, body = '') {
  return `mailto:${storeContactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export const contactLinks = [
  { label: 'Contact us', route: 'contact' },
  { label: 'Frequently asked questions', route: 'faq' },
  { label: 'Track an order', route: 'track-order' },
  { label: 'Shipping and delivery', route: 'shipping' },
  { label: 'Returns and refunds', route: 'returns' },
  { label: 'Privacy', route: 'privacy' },
  { label: 'Terms of purchase', route: 'terms' },
  { label: 'Raise a concern', route: 'grievance' },
  { label: 'Bulk enquiries', route: 'bulk-enquiry' },
  { label: 'Festival preorders', route: 'festival-preorders' },
].map(item => ({ ...item, href: '/' + item.route }))
