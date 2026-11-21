import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { once } from 'node:events'
import { test } from 'node:test'
import { createApp } from './dist/server/app.js'

async function start(t, configured = true, production = false) {
  const password = randomBytes(24).toString('base64url')
  const settings = { ADMIN_USERNAME: 'test-owner', ADMIN_PASSWORD: configured ? password : '', NODE_ENV: production ? 'production' : 'test' }
  const original = Object.fromEntries(Object.keys(settings).map(key => [key, process.env[key]]))
  let server
  try {
    Object.assign(process.env, settings)
    server = createApp().listen(0, '127.0.0.1')
  } finally {
    for (const [key, value] of Object.entries(original)) {
      if (value === undefined) delete process.env[key]
      else process.env[key] = value
    }
  }
  t.after(() => new Promise(resolve => server.close(resolve)))
  await once(server, 'listening')
  const origin = 'http://127.0.0.1:' + server.address().port
  const url = origin + '/api/v1/admin/session'
  const login = (overrides = {}) => fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Admin-Request': '1', Origin: production ? origin.replace('http:', 'https:') : origin },
    body: JSON.stringify({ username: 'test-owner', password }),
    ...overrides,
  })
  return { url, login }
}

test('admin access requires a valid session and logout revokes it', async t => {
  const { url, login } = await start(t)
  assert.equal((await fetch(url)).status, 401)
  assert.equal((await login({ body: JSON.stringify({ username: 'test-owner', password: 'incorrect' }) })).status, 401)
  const response = await login()
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('cache-control'), 'no-store')
  const { data } = await response.json()
  assert.equal(data.authenticated, true)
  assert.ok(Date.parse(data.expiresAt) > Date.now())
  const cookie = response.headers.get('set-cookie')
  assert.match(cookie, /HttpOnly/i)
  assert.match(cookie, /SameSite=Strict/i)
  const headers = { Cookie: cookie.split(';')[0] }
  assert.equal((await fetch(url, { headers })).status, 200)
  assert.equal((await fetch(url, { method: 'DELETE', headers })).status, 403)
  assert.equal((await fetch(url, { method: 'DELETE', headers: { ...headers, 'X-Admin-Request': '1' } })).status, 204)
  assert.equal((await fetch(url, { headers })).status, 401)
})

test('rejects untrusted origins, oversized bodies, and repeated failed sign-ins', async t => {
  const { login } = await start(t)
  assert.equal((await login({ headers: { 'Content-Type': 'application/json', 'X-Admin-Request': '1', Origin: 'https://elsewhere.invalid' } })).status, 403)
  assert.equal((await login({ body: JSON.stringify({ username: 'x', password: 'x'.repeat(5000) }) })).status, 413)
  for (let i = 0; i < 7; i++) {
    assert.equal((await login({ body: JSON.stringify({ username: 'bad', password: 'bad' }) })).status, 401)
  }
  assert.equal((await login()).status, 429)
})

test('missing admin configuration leaves admin access closed', async t => {
  const { url, login } = await start(t, false)
  assert.equal((await fetch(url)).status, 503)
  assert.equal((await login()).status, 503)
})

test('production session cookies are restricted to the host and HTTPS', async t => {
  const { login } = await start(t, true, true)
  const res = await login()
  assert.equal(res.status, 200)
  assert.match(res.headers.get('set-cookie'), /^__Host-ks_admin=/)
  assert.match(res.headers.get('set-cookie'), /; Secure/i)
})
