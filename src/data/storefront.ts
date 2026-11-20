import type { Collection, Product } from '../pages/ModulePages'

import { categories, catalogProducts, image } from '../../shared/catalog'

export { categories, image }
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

export const craftStories = [
  {
    title: 'Fresh Jalebi, Made by Hand',
    caption: 'Tradition in Every Swirl',
    image: '/brand/jalebi-maker.png',
  },
  {
    title: 'Traditional Kaju Katli',
    caption: 'Precision in Every Piece',
    image: '/brand/kaju-katli-maker.png',
  },
  {
    title: 'Handmade Motichoor Laddus',
    caption: 'Handcrafted with Love',
    image: '/brand/laddu-maker.png',
  },
]

export const formatPrice = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
