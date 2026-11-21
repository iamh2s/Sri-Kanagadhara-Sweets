import type { Collection, Product } from '../pages/ModulePages'

import { categories, catalogProducts, image } from '../../shared/catalog'

import { catalogSlug } from '../../shared/catalogSlug'

export { categories, image }

export const shopLinks = [
  { label: 'Shop all', route: 'shop-all#catalog', href: '/shop-all#catalog' },
  ...categories.map(({ name, route }) => {
    const path = route === 'gift-boxes' ? route : `sweets/${catalogSlug(name)}#catalog`
    return { label: name, route: path, href: `/${path}` }
  }),
]
export const products: Product[] = catalogProducts

export const FREE_SHIPPING_THRESHOLD_INR = 999
export const announcementMessages = [
  `Free Shipping on Orders Above ₹${FREE_SHIPPING_THRESHOLD_INR}`,
  'Freshly Made in Small Batches',
  'Authentic Traditional Recipes',
  'Sweets, Savouries & Gift Boxes',
  'Thoughtfully Packed for Every Occasion',
  'A Little Taste of Tradition in Every Bite',
]

export const collections: Collection[] = [
  {
    title: 'Festival Specials',
    subtitle: 'Make every celebration a little sweeter.',
    image: image('photo-1571115177098-24ec42ed204d', 1000),
    className: 'collection-festival',
    link: 'Sweets',
  },
  {
    title: 'Gifts from the heart',
    subtitle: 'Thoughtful boxes, filled with joy.',
    image: image('photo-1549465220-1a8b9238cd48', 1000),
    className: 'collection-gifts',
    link: 'Gift Boxes',
  },
  {
    title: 'Everyday little joys',
    subtitle: 'A familiar favourite for any day.',
    image: image('photo-1606313564200-e75d5e30476c', 1000),
    className: 'collection-everyday',
    link: 'Shop All',
  },
]

const originalCraftStories = [
  {
    title: 'Fresh Jalebi, Made by Hand',
    caption: 'Tradition in Every Swirl',
    image: '/brand/jalebi-maker.webp',
  },
  {
    title: 'Traditional Kaju Katli',
    caption: 'Precision in Every Piece',
    image: '/brand/kaju-katli-maker.webp',
  },
  {
    title: 'Handmade Motichoor Laddus',
    caption: 'Handcrafted with Love',
    image: '/brand/laddu-maker.webp',
  },
  {
    title: 'Authentic Mysore Pak',
    caption: 'A Sweet Legacy',
    image: '/brand/mysorepak-maker.webp',
  },
  {
    title: 'Delicious Milk Peda',
    caption: 'A Taste of Tradition',
    image: '/brand/milk.webp',
  },
]

// Repeat all 6 cards 5 times = 30 cards
export const craftStories = Array.from(
  { length: 5 },
  () => originalCraftStories
).flat()


export const formatPrice = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
