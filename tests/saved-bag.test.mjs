import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createServer } from 'vite'

let vite
let storage
let previousWindow
const saved = new Map()

before(async () => {
  vite = await createServer({
    configFile: false,
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { middlewareMode: true, hmr: false, watch: null },
    appType: 'custom',
  })
  storage = await vite.ssrLoadModule('/src/data/shoppingStorage.ts')
  previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      localStorage: {
        getItem: key => saved.get(key) ?? null,
        setItem: (key, value) => saved.set(key, value),
      },
    },
  })
})

after(async () => {
  if (previousWindow) Object.defineProperty(globalThis, 'window', previousWindow)
  else delete globalThis.window
  await vite?.close()
})

test('a pre-API bag restores distinct weights and resolves prices from the catalog', () => {
  const oldLines = [
    { productId: 1, weight: '250g', quantity: 2 },
    { productId: 1, weight: '500g', quantity: 1 },
    { productId: 7, weight: '1kg', quantity: 3 },
  ]
  saved.set('kanagadhara.cart.v1', JSON.stringify(oldLines))
  const cart = storage.loadCart()
  assert.deepEqual(cart.map(({ product }) => product.name), ['Mysore Pak', 'Mysore Pak', 'Butter Murukku'])
  for (const { product, weight } of cart) assert.ok(product.prices[weight] > 0)
  storage.saveCart(cart)
  assert.deepEqual(JSON.parse(saved.get('kanagadhara.cart.v1')), oldLines)
})

test('stale product and weight references are skipped without losing a valid saved line', () => {
  saved.set('kanagadhara.cart.v1', JSON.stringify([
    { productId: 999, weight: '250g', quantity: 2 },
    { productId: 1, weight: '4kg', quantity: 1 },
    { productId: 2, weight: '500g', quantity: 1 },
  ]))
  const cart = storage.loadCart()
  assert.equal(cart.length, 1)
  assert.equal(cart[0].product.name, 'Kaju Katli')
})

test('a pre-API wishlist resolves saved numeric product IDs', () => {
  saved.set('kanagadhara.wishlist.v1', '[1,7,999]')
  assert.deepEqual(storage.loadWishlist(), [1, 7])
})
