import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

const artifact = path => readFile(new URL('../dist/' + path, import.meta.url), 'utf8')
const htmlFor = path => artifact(path.replace(/^\//, '') + (path === '/' ? '' : '/') + 'index.html')

test('every sitemap URL has distinct, indexable HTML with its own canonical and description', async () => {
  const xml = await artifact('sitemap.xml')
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]))
  assert.ok(urls.some(url => url.pathname === '/'))
  assert.ok(urls.some(url => url.pathname === '/products/mysore-pak'))
  assert.equal(new Set(urls.map(url => url.href)).size, urls.length)
  const robots = await artifact('robots.txt')
  assert.ok(robots.includes('Sitemap: ' + urls[0].origin + '/sitemap.xml'))
  const titles = new Set()
  const descriptions = new Set()
  for (const url of urls) {
    const html = await htmlFor(url.pathname)
    assert.ok(html.includes(`rel="canonical" href="${url.href}"`), url.href)
    assert.ok(html.includes(`property="og:url" content="${url.href}"`), url.href)
    assert.match(html, /<h1>[^<]+<\/h1>/)
    assert.doesNotMatch(html, /name="robots" content="noindex/)
    titles.add(html.match(/<title>([^<]+)<\/title>/)[1])
    descriptions.add(html.match(/name="description" content="([^"]+)"/)[1])
  }
  assert.equal(titles.size, urls.length)
  assert.equal(descriptions.size, urls.length)
})

test('product and local business details are available before JavaScript runs', async () => {
  for (const [path, type] of [['/stores', 'Store'], ['/products/mysore-pak', 'Product']]) {
    const html = await htmlFor(path)
    const schema = JSON.parse(html.match(/<script[^>]+type="application\/ld\+json"[^>]*>([^<]+)<\/script>/)[1])
    assert.equal(schema['@type'], type)
    const detail = type === 'Store' ? schema.address.postalCode : '250g'
    assert.ok(html.slice(html.indexOf('<body>')).includes(detail))
  }
})

test('aliases point to their preferred URL and private pages stay outside the sitemap', async () => {
  assert.match(await htmlFor('/about'), /rel="canonical" href="[^"]+\/our-story"/)
  for (const file of ['private.html', '404.html']) {
    assert.match(await artifact(file), /name="robots" content="noindex/)
  }
  assert.doesNotMatch(await artifact('sitemap.xml'), /\/(?:account|checkout|admin|about|search|cart)(?:\/|<)/)
})
