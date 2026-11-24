export type Topic = {
  title: string
  intro: string
  entries: [string, string][]
  request?: 'bulk' | 'festival' | 'grievance'
}

export const topics: Record<string, Topic> = {
  faq: {
    title: 'Frequently asked questions',
    intro: 'Find help with choosing a pack, saving favourites and contacting the shop.',
    entries: [
      ['How do I choose a pack size?', 'Open a product, choose its weight and check the displayed price before adding it to your bag. Different weights appear as separate items.'],
      ['Where can I see my favourites?', 'Select the heart on a product, then open the wishlist from the navigation bar. Your saved selection is specific to this browser.'],
      ['Can I check ingredients or allergens?', 'Ask the shop about the exact sweet, pack size and batch before ordering if you need ingredient or allergen information.'],
      ['How do I arrange gifts for an event?', 'Use Bulk enquiries to share the number of boxes, your preferred selection and the date you need them.'],
    ],
  },
  shipping: {
    title: 'Shipping and delivery',
    intro: 'Delivery coverage, charges and dispatch timelines are awaiting confirmation from the shop.',
    entries: [
      ['Check a destination', 'Include the delivery PIN code, product and pack size in your enquiry so the shop can check serviceability.'],
      ['Plan a delivery date', 'For gifts and events, include the date you need the order. Ask for confirmation before relying on a delivery estimate.'],
    ],
  },
  returns: {
    title: 'Returns and refunds',
    intro: 'The shop’s return windows, eligibility criteria and refund timelines are awaiting publication.',
    entries: [
      ['Report an issue with a delivery', 'Describe the issue and include the item name, delivery date and order reference if available. Keep the packaging and a photo available for follow-up.'],
      ['Ask about a refund', 'Contact the shop with the order reference and a short description of the problem. Share only the details needed to identify the purchase.'],
    ],
  },
  privacy: {
    title: 'Privacy',
    intro: 'The shop’s full privacy notice is awaiting publication. Here is how the storefront currently handles saved selections.',
    entries: [
      ['Saved bags and wishlists', 'The storefront uses this browser’s local storage to remember selected product IDs, bag quantities, pack sizes and favourites. Clearing this site’s browser data also clears those selections.'],
      ['Demo addresses and orders', 'Saved demo addresses and order summaries are visible to anyone using this browser profile. Use fictional contact and delivery details. Remove saved addresses in the address book, or clear this site’s browser data to remove stored entries.'],
      ['Email enquiries', 'When the shop inbox is available, you can open and review a draft in your email app. Otherwise you can prepare and copy an unsent enquiry on this page.'],
    ],
  },
  terms: {
    title: 'Terms of purchase',
    intro: 'The shop’s formal terms of purchase are awaiting publication.',
    entries: [
      ['Catalog prices', 'The catalog displays indicative prices by weight. Ask the shop to confirm the final price, availability and delivery arrangements for your selection.'],
      ['Bulk and festival enquiries', 'The shop must confirm pricing and availability before an enquiry becomes a booking.'],
    ],
  },
  grievance: {
    title: 'Raise a concern',
    intro: 'Describe an issue with a product, delivery or shopping experience. Published grievance officer details are pending.',
    entries: [],
    request: 'grievance',
  },
  'bulk-enquiry': {
    title: 'Bulk enquiries',
    intro: 'Planning gifts for a wedding, celebration or office? Share your preferred selection and approximate quantity for a quote.',
    entries: [],
    request: 'bulk',
  },
  'festival-preorders': {
    title: 'Festival preorders',
    intro: 'Ask about festive gift boxes and seasonal sweets. Booking dates, availability and collection windows are awaiting confirmation.',
    entries: [],
    request: 'festival',
  },
}
