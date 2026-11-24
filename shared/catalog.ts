/* =====================================================
   SRI KANAGADHARA SWEETS
   PRODUCT CATALOG — DEMO PRICING
   ===================================================== */

export const image = (id: string, width = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`


/* =====================================================
   PRODUCT CATALOG
   ===================================================== */

export const catalogProducts = [
  {
    id: 1,
    name: 'Mysore Pak',
    description: 'A traditional South Indian sweet with a rich, melt-in-your-mouth texture.',
    category: 'Traditional Sweets',
    image: '/products/mysore-pak.webp',
    prices: { '250g': 180, '500g': 350, '1kg': 680 },
  },

  {
    id: 2,
    name: 'Kaju Katli',
    description: 'Smooth and delicate cashew sweets, perfect for every celebration.',
    category: 'Dry Fruit Sweets',
    image: '/products/kaju-katli.webp',
    prices: { '250g': 260, '500g': 510, '1kg': 990 },
  },

  {
    id: 3,
    name: 'Laddu',
    description: 'Traditional golden laddus made for sweet celebrations.',
    category: 'Traditional Sweets',
    image: '/products/laddu.webp',
    prices: { '250g': 160, '500g': 310, '1kg': 600 },
  },

  {
    id: 4,
    name: 'Baatusha',
    description: 'A classic Indian sweet with delicate flaky layers and a delicious sugar glaze.',
    category: 'Traditional Sweets',
    image: '/products/badusha.webp',
    prices: { '250g': 150, '500g': 290, '1kg': 560 },
  },

  {
    id: 5,
    name: 'Chandrakala',
    description: 'A traditional festive sweet with a rich and delicious filling.',
    category: 'Traditional Sweets',
    image: '/products/chandrakala.webp',
    prices: { '250g': 180, '500g': 350, '1kg': 680 },
  },

  {
    id: 6,
    name: 'Suryakala',
    description: 'A beautifully crafted traditional sweet for special occasions.',
    category: 'Traditional Sweets',
    image: '/products/suryakala.webp',
    prices: { '250g': 180, '500g': 350, '1kg': 680 },
  },

  {
    id: 7,
    name: 'Khoya Samosa',
    description: 'A traditional sweet pastry with a delicious khoya filling.',
    category: 'Milk Sweets',
    image: '/products/khoya-samosa.webp',
    prices: { '250g': 200, '500g': 390, '1kg': 760 },
  },

  {
    id: 8,
    name: 'Milk Cake',
    description: 'A rich and delicious traditional milk-based sweet.',
    category: 'Milk Sweets',
    image: '/products/milk-cake.webp',
    prices: { '250g': 190, '500g': 370, '1kg': 720 },
  },

  {
    id: 9,
    name: 'Kalakand',
    description: 'A soft, delicately textured milk sweet for every occasion.',
    category: 'Milk Sweets',
    image: '/products/kalakand.webp',
    prices: { '250g': 210, '500g': 410, '1kg': 800 },
  },

  {
    id: 10,
    name: 'Halwa',
    description: 'A rich and comforting traditional Indian sweet.',
    category: 'Traditional Sweets',
    image: '/products/halwa.webp',
    prices: { '250g': 160, '500g': 310, '1kg': 600 },
  },

  {
    id: 11,
    name: 'Kaju Roll',
    description: 'An elegant cashew-based sweet with a deliciously smooth texture.',
    category: 'Dry Fruit Sweets',
    image: '/products/kaju-roll.webp',
    prices: { '250g': 280, '500g': 550, '1kg': 1080 },
  },

  {
    id: 12,
    name: 'Makhan Bada',
    description: 'A delightful traditional sweet with a rich, flaky texture.',
    category: 'Traditional Sweets',
    image: '/products/makhan-bada.webp',
    prices: { '250g': 170, '500g': 330, '1kg': 640 },
  },

  {
    id: 13,
    name: 'Sonpapdi',
    description: 'A light and delicate flaky Indian sweet that melts in your mouth.',
    category: 'Traditional Sweets',
    image: '/products/sonpapdi.webp',
    prices: { '250g': 140, '500g': 270, '1kg': 520 },
  },

  {
    id: 14,
    name: 'Special Laddoo',
    description: 'A premium laddoo crafted for memorable celebrations.',
    category: 'Traditional Sweets',
    image: '/products/special-laddoo.webp',
    prices: { '250g': 220, '500g': 430, '1kg': 840 },
  },

  {
    id: 15,
    name: 'Dry Fruit Halwa',
    description: 'A premium halwa enriched with delicious dry fruits.',
    category: 'Dry Fruit Sweets',
    image: '/products/dry-fruit-halwa.webp',
    prices: { '250g': 290, '500g': 570, '1kg': 1120 },
  },

  {
    id: 16,
    name: 'Ghee Mysore Pak',
    description: 'Rich and aromatic Mysore Pak with a melt-in-your-mouth texture.',
    category: 'Ghee Sweets',
    image: '/products/ghee-mysore-pak.webp',
    prices: { '250g': 240, '500g': 470, '1kg': 920 },
  },
]


/* =====================================================
   SHOP BY CATEGORY
   Separate Local Images
   ===================================================== */

export const categories = [
  {
    name: 'Traditional Sweets',
    image: '/brand/hero-slide-1.webp',
    route: 'sweets',
  },

  {
    name: 'Milk Sweets',
    image: '/brand/hero-slide-5.webp',
    route: 'sweets',
  },

  {
    name: 'Ghee Sweets',
    image: '/products/ghee-mysore-pak.webp',
    route: 'sweets',
  },

  {
    name: 'Dry Fruit Sweets',
    image: '/products/dry-fruit-halwa.webp',
    route: 'sweets',
  },

  {
    name: 'Gift Boxes',
    image: '/brand/sweetbox.webp',
    route: 'gift-boxes',
  },
]


/* =====================================================
   SIGNATURE SWEETS OFFER — ₹375
   ===================================================== */

export const signatureSweetsOffer = {
  title: 'Our Signature Sweets',

  subtitle:
    'Crafted for your sweetest occasions with our premium sweets.',

  price: 375,

  currency: 'INR',

  availability: 'Pre-book your order now',

  contact: '9677209077',

  products: [
    'Chandrakala',
    'Suryakala',
    'Khoya Samosa',
    'Mysore Pak',
    'Milk Cake',
    'Kalakand',
    'Halwa',
    'Kaju Katli',
    'Kaju Roll',
    'Laddu',
    'Makhan Bada',
    'Sonpapdi',
  ],
}


/* =====================================================
   SPECIAL SWEETS
   ===================================================== */

export const specialSweets = [
  {
    name: 'Special Laddoo',
    category: 'Traditional Sweets',
    image: '/products/special-laddoo.webp',
  },

  {
    name: 'Dry Fruit Halwa',
    category: 'Dry Fruit Sweets',
    image: '/products/dry-fruit-halwa.webp',
  },

  {
    name: 'Ghee Mysore Pak',
    category: 'Ghee Sweets',
    image: '/products/ghee-mysore-pak.webp',
  },
]