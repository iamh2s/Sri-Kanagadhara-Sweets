import express, { type ErrorRequestHandler, type Request, type Response } from 'express'
import { rateLimit } from 'express-rate-limit'
import { randomUUID } from 'node:crypto'
import { adminSessions } from './adminSession.js'
import { categories, catalogProducts } from '../shared/catalog.js'

import { catalogSlug as slug } from '../shared/catalogSlug.js'
const categoryList = categories.map((category) => ({ ...category, slug: slug(category.name) }))
const categorySlugs = new Set(categoryList.map((category) => category.slug))
const productList = catalogProducts.map(({ prices, ...product }) => ({
  ...product,
  slug: slug(product.name),
  categorySlug: slug(product.category),
  currency: 'INR',
  variants: Object.entries(prices).map(([weight, rupees]) => ({
    sku: `KS-${product.id}-${weight}`,
    weight,
    pricePaise: Math.round(rupees * 100),
  })),
})).sort((a, b) => a.id - b.id)

function respondError(res: Response, status: number, code: string, message: string) {
  res.status(status).json({ error: { code, message }, requestId: res.locals.requestId })
}

function validQuery(req: Request, allowed: string[]) {
  return Object.entries(req.query).every(([key, value]) =>
    allowed.includes(key) && typeof value === 'string',
  )
}

export function createApp(requestsPerMinute = 240) {
  const app = express()
  app.disable('x-powered-by')
  app.set('query parser', 'simple')
  app.use((_req, res, next) => {
    res.locals.requestId = randomUUID()
    res.set('X-Request-Id', res.locals.requestId)
    res.set('X-Content-Type-Options', 'nosniff')
    next()
  })
  app.use('/api/v1', rateLimit({
    windowMs: 60_000,
    limit: requestsPerMinute,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (_req, res) => respondError(res, 429, 'RATE_LIMITED', 'Please try again later.'),
  }))

  app.use('/api/v1/admin/session', adminSessions())

  app.get('/api/v1/categories', (req, res) => {
    if (!validQuery(req, [])) return respondError(res, 400, 'INVALID_QUERY', 'Unexpected query parameters.')
    res.json({ data: categoryList })
  })

  app.get('/api/v1/products', (req, res) => {
    if (!validQuery(req, ['q', 'category', 'limit', 'cursor'])) {
      return respondError(res, 400, 'INVALID_QUERY', 'Unknown or repeated query parameter.')
    }
    const { q = '', category, limit = '20', cursor } = req.query as Record<string, string | undefined>
    if (q.length > 100 || (category !== undefined && !categorySlugs.has(category))) {
      return respondError(res, 400, 'INVALID_QUERY', 'Use a known category and a search term of up to 100 characters.')
    }
    if (!/^[1-9]\d?$/.test(limit) || Number(limit) > 50) {
      return respondError(res, 400, 'INVALID_QUERY', 'Limit must be an integer between 1 and 50.')
    }
    if (cursor !== undefined && (!/^[1-9]\d{0,15}$/.test(cursor) || !Number.isSafeInteger(Number(cursor)))) {
      return respondError(res, 400, 'INVALID_QUERY', 'Invalid product cursor.')
    }

    const query = q.trim().toLowerCase()
    const results = productList.filter((item) =>
      item.id > Number(cursor ?? 0) &&
      (!category || item.categorySlug === category) &&
      `${item.name} ${item.description} ${item.category}`.toLowerCase().includes(query),
    )
    const data = results.slice(0, Number(limit))
    res.json({ data, nextCursor: results.length > data.length ? String(data[data.length - 1].id) : null })
  })

  app.get('/api/v1/products/:slug', (req, res) => {
    if (!validQuery(req, [])) return respondError(res, 400, 'INVALID_QUERY', 'Unexpected query parameters.')
    const product = productList.find((item) => item.slug === req.params.slug)
    if (!product) return respondError(res, 404, 'NOT_FOUND', 'Product unavailable.')
    res.json({ data: product })
  })

  app.use((_req, res) => respondError(res, 404, 'NOT_FOUND', 'Resource unavailable.'))
  const handleError: ErrorRequestHandler = (error, _req, res, _next) => {
    if (error instanceof URIError) {
      respondError(res, 400, 'INVALID_PATH', 'Invalid URL encoding.')
      return
    }
    respondError(res, 500, 'INTERNAL_ERROR', 'Request could not be completed.')
  }
  app.use(handleError)
  return app
}
