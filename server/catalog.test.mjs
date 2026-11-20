import assert from 'node:assert/strict'
import { once } from 'node:events'
import { after, before, test } from 'node:test'
import { createApp } from './dist/server/app.js'

let server
let api
before(async () => {
  server = createApp().listen(0, '127.0.0.1')
  await once(server, 'listening')
  api = 'http://127.0.0.1:' + server.address().port + '/api/v1'
})
after(() => new Promise((resolve) => server.close(resolve)))

test('serves existing categories and stable catalog IDs with canonical SKU prices', async () => {
  const { data: categories } = await (await fetch(api + '/categories')).json()
  assert.equal(categories.length, 7)
  assert.ok(categories.some(({ slug }) => slug === 'ghee-sweets'))
  const { data, nextCursor } = await (await fetch(api + '/products')).json()
  assert.deepEqual(data.map(({ id }) => id), [1, 2, 3, 4, 5, 6, 7, 8])
  assert.equal(nextCursor, null)
  const product = (await (await fetch(api + '/products/mysore-pak')).json()).data
  assert.deepEqual(product, data[0])
  assert.equal(product.currency, 'INR')
  assert.deepEqual(product.variants, [
    { sku: 'KS-1-250g', weight: '250g', pricePaise: 18000 },
    { sku: 'KS-1-500g', weight: '500g', pricePaise: 35000 },
    { sku: 'KS-1-1kg', weight: '1kg', pricePaise: 68000 },
  ])
})

test('applies search and category before pagination', async () => {
  const path = api + '/products?category=traditional-sweets&q=SWEET&limit=2'
  const page = await (await fetch(path)).json()
  assert.deepEqual(page.data.map(({ id }) => id), [3, 4])
  assert.equal(page.nextCursor, '4')
  const last = await (await fetch(path + '&cursor=' + page.nextCursor)).json()
  assert.deepEqual(last.data.map(({ id }) => id), [6])
  assert.equal(last.nextCursor, null)
  assert.deepEqual(await (await fetch(api + '/products?category=gift-boxes')).json(), { data: [], nextCursor: null })
})

test('returns bounded validation errors or missing resources with a request ID', async () => {
  for (const [path, expected] of [
    ['/products?limit=0',400], ['/products?limit=51',400], ['/products?q=a&q=b',400],
    ['/products?cursor=-1',400], ['/products?category=missing',400], ['/products?extra=1',400],
    ['/products?q=' + 'a'.repeat(101),400], ['/products/missing',404], ['/products/%ZZ',400],
    ['/categories?q=test',400], ['/products/mysore-pak?extra=1',400],
  ]) {
    const response = await fetch(api + path)
    assert.equal(response.status, expected, path)
    const body = await response.json()
    assert.ok(body.error.code && body.error.message)
    assert.equal(body.requestId, response.headers.get('x-request-id'))
  }
})

test('limits rapid requests with consistent errors', async () => {
  const limited = createApp(1).listen(0, '127.0.0.1')
  try {
    await once(limited, 'listening')
    const url = 'http://127.0.0.1:' + limited.address().port + '/api/v1/categories'
    assert.equal((await fetch(url)).status, 200)
    const response = await fetch(url)
    assert.equal(response.status, 429)
    assert.equal((await response.json()).error.code, 'RATE_LIMITED')
  } finally {
    await new Promise((resolve) => limited.close(resolve))
  }
})
