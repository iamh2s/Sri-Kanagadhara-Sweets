import type { Collection, Product } from '../pages/ModulePages'

export const image = (id: string, width = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`

export const FREE_SHIPPING_THRESHOLD_INR = 999
export const announcementMessages = [
  `Free Shipping on Orders Above ₹${FREE_SHIPPING_THRESHOLD_INR}`,
  'Freshly Made in Small Batches',
  'Authentic Traditional Recipes',
  'Sweets, Savouries & Gift Boxes',
  'Thoughtfully Packed for Every Occasion',
  'A Little Taste of Tradition in Every Bite',
]

export const products: Product[] = [
  {
    id: 1,
    name: 'Mysore Pak',
    description: 'A melt-in-your-mouth South Indian classic.',
    category: 'Ghee Sweets',
    image: image('photo-1563729784474-d77dbb933a9e'),
    prices: { '250g': 180, '500g': 350, '1kg': 680 },
  },
  {
    id: 2,
    name: 'Kaju Katli',
    description: 'Silky cashew goodness for every celebration.',
    category: 'Dry Fruit Sweets',
    image: image('photo-1578985545062-69928b1d9587'),
    prices: { '250g': 260, '500g': 510, '1kg': 990 },
  },
  {
    id: 3,
    name: 'Motichoor Laddu',
    description: 'Little golden pearls, lovingly hand-shaped.',
    category: 'Traditional Sweets',
    image: image('photo-1606313564200-e75d5e30476c'),
    prices: { '250g': 160, '500g': 310, '1kg': 600 },
  },
  {
    id: 4,
    name: 'Badusha',
    description: 'Flaky layers with just the right sweetness.',
    category: 'Traditional Sweets',
    image: image('photo-1571115177098-24ec42ed204d'),
    prices: { '250g': 150, '500g': 290, '1kg': 560 },
  },
  {
    id: 5,
    name: 'Paal Peda',
    description: 'Soft, milky bites for a moment of sweetness.',
    category: 'Milk Sweets',
    image: image('photo-1464349095431-e9a21285b5f3'),
    prices: { '250g': 190, '500g': 370, '1kg': 720 },
  },
  {
    id: 6,
    name: 'Jangiri',
    description: 'A bright, syrup-kissed festive favourite.',
    category: 'Traditional Sweets',
    image: image('photo-1565958011703-44f9829ba187'),
    prices: { '250g': 140, '500g': 270, '1kg': 520 },
  },
  {
    id: 7,
    name: 'Butter Murukku',
    description: 'A crisp, savoury snack for chai time.',
    category: 'Traditional Snacks',
    image: image('photo-1509440159596-0249088772ff'),
    prices: { '250g': 130, '500g': 250, '1kg': 480 },
  },
  {
    id: 8,
    name: 'Ribbon Pakoda',
    description: 'Light, crunchy, and made for sharing.',
    category: 'Savouries',
    image: image('photo-1599487488170-d11ec9c172f0'),
    prices: { '250g': 130, '500g': 250, '1kg': 480 },
  },
]

export const categories = [
  {
    name: 'Traditional Sweets',
    image: '/brand/hero-slide-3.webp',
    route: 'sweets',
  },
  {
    name: 'Milk Sweets',
    image: '/brand/hero-slide-5.webp',
    route: 'sweets',
  },
  {
    name: 'Ghee Sweets',
    image: '/brand/hero-slide-1.webp',
    route: 'sweets',
  },
  {
    name: 'Dry Fruit Sweets',
    image: '/brand/hero-slide-2.webp',
    route: 'sweets',
  },
  {
    name: 'Traditional Snacks',
    image: products[6].image,
    route: 'savouries',
  },
  {
    name: 'Savouries',
    image: products[7].image,
    route: 'savouries',
  },
  {
    name: 'Gift Boxes',
    image: image('photo-1549465220-1a8b9238cd48', 700),
    route: 'gift-boxes',
  },
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
