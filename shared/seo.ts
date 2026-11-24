import { catalogProducts, categories } from './catalog'
import { catalogSlug } from './catalogSlug'

export type SeoPage = {
  path: string
  title: string
  description: string
  image: string
  heading: string
  indexable: boolean
}

const brand = 'Sri Kanagadhara Sweets'
const defaultImage = '/brand/indian-sweets-hero.webp'

function page(path: string, heading: string, description: string, image = defaultImage): SeoPage {
  // The catalog reserves this path, but the Milk Cake photograph has not been supplied.
  const previewImage = image === '/products/milk-cake.webp' ? defaultImage : image
  return { path, heading, title: `${heading} | ${brand}`, description, image: previewImage, indexable: true }
}

const informationPages = [
  page('/', 'Traditional Indian Sweets in Ambur', 'Explore Sri Kanagadhara Sweets in Ambur, Tamil Nadu. Browse traditional sweets, compare pack sizes and discover gifts for family and festive occasions.'),
  page('/shop-all', 'Shop the Sweets Collection', 'Browse the full Sri Kanagadhara collection by category. Compare Mysore Pak, Kaju Katli, laddus and other favourites, with weights and prices for each pack.'),
  page('/sweets', 'Indian Sweets', 'Choose traditional, milk, cashew and ghee sweets from our Ambur shop. Explore the collection and find a sweet for your next family visit or celebration.'),
  page('/savouries', 'Indian Savouries', 'Explore the savouries section at Sri Kanagadhara Sweets and contact our Ambur shop for the current selection.'),
  page('/gift-boxes', 'Sweet Gift Boxes', 'Explore gift ideas for festivals, weddings and office gatherings. See the signature sweets selection and contact our Ambur shop to pre-book.'),
  page('/our-story', 'Our Story', 'Meet Sri Kanagadhara Sweets and discover the textures, flavours and gifting traditions behind a shared box of Indian sweets.', '/brand/laddu-maker.webp'),
  page('/contact', 'Contact the Ambur Shop', 'Contact Sri Kanagadhara Sweets in Ambur for questions about products, gift boxes, bulk quantities, pre-booking and orders.'),
  page('/stores', 'Visit Our Shop in Ambur', 'Find Sri Kanagadhara Sweets on Gandhi Road in Krishnapuram, Ambur, Tamil Nadu. Get the address and call the shop to confirm visiting hours.'),
  page('/faq', 'Frequently Asked Questions', 'Find answers about choosing sweets, selecting pack sizes, saving favourites and getting help from Sri Kanagadhara Sweets.'),
  page('/shipping', 'Shipping and Delivery Enquiries', 'Ask the shop about delivery coverage, dispatch times and shipping charges before placing an order.'),
  page('/returns', 'Returns and Refund Enquiries', 'Find out how to contact Sri Kanagadhara Sweets about returns, cancellations or a refund for your order.'),
  page('/privacy', 'Privacy Information', 'Learn how the storefront handles your saved shopping selections and how to contact the shop with a privacy question.'),
  page('/terms', 'Terms of Purchase', 'Read the purchase information for this storefront and find out which order details to confirm directly with Sri Kanagadhara Sweets.'),
  page('/grievance', 'Raise a Concern', 'Contact the shop about a product, delivery or shopping concern and prepare the details needed for follow-up.'),
  page('/bulk-enquiry', 'Bulk Sweet Orders and Corporate Gifts', 'Planning wedding gifts or sweets for the office? Enquire about quantities, preferred sweets and a quote from Sri Kanagadhara Sweets in Ambur.'),
  page('/festival-preorders', 'Festival Sweet Preorders', 'Ask about festival gift boxes, seasonal selections, booking dates and collection options from our Ambur shop.'),
]

const collectionPages = categories.filter(category => category.route !== 'gift-boxes').map(category => {
  const items = catalogProducts.filter(product => product.category === category.name)
  const examples = items.slice(0, 3).map(product => product.name).join(', ')
  const description = examples
    ? `Explore ${category.name.toLowerCase()} at our Ambur shop. The selection includes ${examples}. View pack sizes and product details.`
    : `Explore the ${category.name.toLowerCase()} collection at Sri Kanagadhara Sweets in Ambur.`
  return page(`/sweets/${catalogSlug(category.name)}`, category.name, description, items[0]?.image)
})

const productPages = catalogProducts.map(product => page(
  `/products/${catalogSlug(product.name)}`, product.name,
  `${product.description} Explore ${product.name} pack sizes at Sri Kanagadhara Sweets in Ambur.`,
  product.image,
))

export const publicPages = [...informationPages, ...collectionPages, ...productPages]
const byPath = new Map(publicPages.map(item => [item.path, item]))

export const seoAliases: Record<string, string> = {
  '/about': '/our-story',
  '/bulk-orders': '/bulk-enquiry',
  '/policies/shipping': '/shipping',
  '/policies/returns': '/returns',
  '/policies/privacy': '/privacy',
  '/policies/terms': '/terms',
  '/policies/grievance': '/grievance',
  ...Object.fromEntries(categories.filter(item => item.route === 'gift-boxes')
    .map(item => [`/sweets/${catalogSlug(item.name)}`, '/gift-boxes'])),
  ...Object.fromEntries(catalogProducts.map(item => [
    `/sweets/${catalogSlug(item.category)}/${catalogSlug(item.name)}`,
    `/products/${catalogSlug(item.name)}`,
  ])),
}

const privateTitles = new Map([
  ['/admin', 'Store Administration'], ['/account', 'Your Account'], ['/account/orders', 'Order History'],
  ['/account/addresses', 'Saved Addresses'], ['/account/wishlist', 'Your Wishlist'], ['/cart', 'Your Shopping Bag'],
  ['/checkout', 'Checkout'], ['/payment/status', 'Payment Status'], ['/order-status', 'Order Status'],
  ['/track-order', 'Track an Order'], ['/search', 'Search the Catalog'], ['/maintenance', 'Store Maintenance'],
  ['/500', 'Store Unavailable'], ['/404', 'Page Not Found'],
])

export function getSeoPage(pathname: string, search = ''): SeoPage {
  const route = '/' + pathname.replace(/^\/+|\/+$/g, '')
  const canonical = /^\/festival\/[^/]+$/.test(route) ? '/festival-preorders' : seoAliases[route] ?? route
  const publicPage = byPath.get(canonical)
  if (publicPage) {
    const params = new URLSearchParams(search)
    return ['q', 'sort', 'wishlist'].some(key => params.has(key))
      ? { ...publicPage, indexable: false }
      : publicPage
  }
  let path = route
  if (route.startsWith('/admin/')) path = '/admin'
  else if (/^\/(?:orders\/[^/]+\/confirmation|account\/orders\/[^/]+)$/.test(route)) path = '/order-status'
  else if (!privateTitles.has(route)) path = '/404'
  const heading = privateTitles.get(path)!
  return { ...page(path, heading, `${heading} at ${brand}.`), indexable: false }
}
