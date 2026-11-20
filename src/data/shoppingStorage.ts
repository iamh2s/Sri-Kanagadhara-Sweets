import type { CartLine } from '../components/ShoppingOverlays'
import { products } from './storefront'

const cartKey = 'kanagadhara.cart.v1'
const wishlistKey = 'kanagadhara.wishlist.v1'

function readList(key: string): unknown[] {
  try {
    const stored: unknown = JSON.parse(window.localStorage.getItem(key) ?? '[]')
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

function writeList(key: string, values: unknown[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(values))
  } catch {
    // Shopping still works for the current visit when storage is unavailable.
  }
}

export function loadCart(): CartLine[] {
  const lines = new Map<string, CartLine>()
  for (const saved of readList(cartKey)) {
    if (typeof saved !== 'object' || saved === null) continue
    const { productId, weight, quantity } = saved as Record<string, unknown>
    const product = products.find((item) => item.id === productId)
    if (!product || (weight !== '250g' && weight !== '500g' && weight !== '1kg')) continue
    if (typeof quantity !== 'number' || !Number.isSafeInteger(quantity) || quantity <= 0) continue

    lines.set(`${product.id}-${weight}`, { product, weight, quantity })
  }
  return [...lines.values()]
}

export function saveCart(cart: CartLine[]) {
  writeList(cartKey, cart.map(({ product, weight, quantity }) => ({
    productId: product.id,
    weight,
    quantity,
  })))
}

export function loadWishlist(): number[] {
  const saved = readList(wishlistKey)
  return products.filter(({ id }) => saved.includes(id)).map(({ id }) => id)
}

export function saveWishlist(wishlist: number[]) {
  writeList(wishlistKey, wishlist)
}
