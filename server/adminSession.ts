import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import express, { type ErrorRequestHandler, type Request, type Response } from 'express'
import { rateLimit } from 'express-rate-limit'

const lifetime = 4 * 60 * 60 * 1000
const digest = (value: string) => createHash('sha256').update(value).digest()

export function adminSessions() {
  const router = express.Router()
  const username = process.env.ADMIN_USERNAME ?? ''
  const password = process.env.ADMIN_PASSWORD ?? ''
  const localPreview = process.env.NODE_ENV === 'development' && process.env.HOST === '127.0.0.1'
  const configured = username.trim().length > 0 && username.length <= 128 && password.length >= (localPreview ? 8 : 12) && password.length <= 256
  const expectedUser = digest(username)
  const expectedPassword = digest(password)
  const secure = process.env.NODE_ENV === 'production'
  const cookieName = secure ? '__Host-ks_admin' : 'ks_admin_dev'
  const options = { httpOnly: true, secure, sameSite: 'strict' as const, path: '/' }
  const sessions = new Map<string, number>()
  const sessionKey = (req: Request) => {
    const entry = (req.headers.cookie ?? '').split(';').map(s => s.trim()).find(s => s.startsWith(cookieName + '='))
    return entry ? digest(entry.slice(cookieName.length + 1)).toString('hex') : ''
  }
  const fail = (res: Response, status: number, code: string, message: string) =>
    res.status(status).json({ error: { code, message }, requestId: res.locals.requestId })
  const success = (res: Response, expiresAt: number) =>
    res.json({ data: { authenticated: true, expiresAt: new Date(expiresAt).toISOString() } })

  router.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    if (!configured) return fail(res, 503, 'ADMIN_UNAVAILABLE', 'Admin sign-in is unavailable.')
    if (req.method === 'POST' || req.method === 'DELETE') {
      // A cross-origin browser cannot send this header without a successful CORS preflight.
      if (req.get('X-Admin-Request') !== '1' || req.get('Sec-Fetch-Site') === 'cross-site') {
        return fail(res, 403, 'ORIGIN_DENIED', 'Request unavailable.')
      }
      const origin = req.get('Origin')
      const expectedOrigin = (secure ? 'https' : req.protocol) + '://' + req.get('host')
      if (origin && origin !== expectedOrigin) return fail(res, 403, 'ORIGIN_DENIED', 'Request unavailable.')
    }
    next()
  })
  router.get('/', (req, res) => {
    const key = sessionKey(req)
    const expiry = sessions.get(key)
    if (expiry && expiry > Date.now()) return success(res, expiry)
    sessions.delete(key)
    return fail(res, 401, 'SIGN_IN_REQUIRED', 'Please sign in.')
  })
  router.post('/', rateLimit({
    windowMs: 15 * 60_000, limit: 8, standardHeaders: 'draft-8', legacyHeaders: false,
    skipSuccessfulRequests: true,
    handler: (_req, res) => fail(res, 429, 'RATE_LIMITED', 'Too many sign-in attempts. Try again later.'),
  }), express.json({ limit: '4kb', inflate: false }), (req, res) => {
    const body = req.body
    if (!body || typeof body.username !== 'string' || typeof body.password !== 'string' ||
        Object.keys(body).length !== 2 || body.username.length > 128 || body.password.length > 256) {
      return fail(res, 400, 'INVALID_INPUT', 'Enter your username and password.')
    }
    const userMatches = timingSafeEqual(digest(body.username), expectedUser)
    const passwordMatches = timingSafeEqual(digest(body.password), expectedPassword)
    if (!userMatches || !passwordMatches) return fail(res, 401, 'INVALID_LOGIN', 'Incorrect username or password.')
    const now = Date.now()
    for (const [key, expiry] of sessions) if (expiry <= now) sessions.delete(key)
    sessions.delete(sessionKey(req))
    if (sessions.size >= 64) sessions.delete(sessions.keys().next().value!)
    const token = randomBytes(32).toString('hex')
    sessions.set(digest(token).toString('hex'), now + lifetime)
    res.cookie(cookieName, token, { ...options, maxAge: lifetime })
    return success(res, now + lifetime)
  })
  router.delete('/', (req, res) => {
    sessions.delete(sessionKey(req))
    res.clearCookie(cookieName, options)
    res.sendStatus(204)
  })
  const handleBodyError: ErrorRequestHandler = (error, _req, res, next) => {
    if ([400, 413, 415].includes(error.status)) {
      fail(res, error.status, 'INVALID_INPUT', 'Invalid sign-in request.')
    } else next(error)
  }
  router.use(handleBodyError)
  return router
}
