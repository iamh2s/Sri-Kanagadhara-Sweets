import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { loadEnv, type Plugin } from 'vite'
import { catalogProducts, categories, signatureSweetsOffer } from '../shared/catalog'
import { catalogSlug } from '../shared/catalogSlug'
import { getSeoPage, publicPages, seoAliases } from '../shared/seo'
import { defaultSiteOrigin, getHeadFields } from '../shared/seoHead'
import { storeAddress, storePhone, internationalPhone } from '../shared/storeLocation'
import { topics } from '../shared/supportTopics'

type Page = ReturnType<typeof getSeoPage>

function escape(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

function link(path: string, label: string) {
  return `<a href="${escape(path)}">${escape(label)}</a>`
}

function linkList(items: { path: string; heading: string }[]) {
  return `<ul>${items.map(item => `<li>${link(item.path, item.heading)}</li>`).join('')}</ul>`
}

const productPath = (name: string) => '/products/' + catalogSlug(name)
const categoryPath = (item: typeof categories[number]) =>
  item.route === 'gift-boxes' ? '/gift-boxes' : '/sweets/' + catalogSlug(item.name)

function renderBody(page: Page) {
  const product = catalogProducts.find(item => productPath(item.name) === page.path)
  const category = categories.find(item => categoryPath(item) === page.path)
  const topic = topics[page.path.slice(1)]
  let details = ''
  if (['/contact', '/stores', '/'].includes(page.path)) {
    details = `<address>${escape(storeAddress)}<br>${link('tel:' + internationalPhone, 'Call ' + storePhone)}</address>`
  } else if (topic) {
    const sections = topic.entries.map(([heading, text]) => `<section><h2>${escape(heading)}</h2><p>${escape(text)}</p></section>`)
    details = `<p>${escape(topic.intro)}</p>${sections.join('')}<p>${link('/contact', 'Contact the shop')}</p>`
  } else if (product) {
    const packs = Object.entries(product.prices).map(([weight, price]) =>
      `<li>${escape(weight)} — ₹${price}</li>`).join('')
    details = `<h2>Pack sizes and indicative prices</h2><ul>${packs}</ul>`
  } else if (page.path === '/gift-boxes') {
    details = `<h2>${escape(signatureSweetsOffer.title)}</h2><ol>${
      signatureSweetsOffer.products.map(name => `<li>${escape(name)}</li>`).join('')
    }</ol><p>₹${signatureSweetsOffer.price} · ${link('tel:+91' + signatureSweetsOffer.contact, 'Pre-book ' + signatureSweetsOffer.contact)}</p>`
  } else if (category || ['/shop-all', '/sweets', '/savouries'].includes(page.path)) {
    const rows = catalogProducts.filter(item => category ? item.category === category.name :
      page.path === '/shop-all' || (page.path === '/sweets' ? item.category.includes('Sweet') :
        ['Savouries', 'Traditional Snacks'].includes(item.category)))
    if (rows.length) details = '<h2>Products</h2>' + linkList(rows.map(item => ({ path: productPath(item.name), heading: item.name })))
    if (page.path === '/shop-all') details += '<h2>Shop by category</h2>' + linkList(categories.map(item => ({path: categoryPath(item), heading: item.name})))
  }

  const navigation = page.path === '/' ? publicPages.filter(item => !item.path.startsWith('/products/')) :
    publicPages.filter(item => ['/', '/shop-all', '/contact', '/stores'].includes(item.path) && item.path !== page.path)
  return `<main><h1>${escape(page.heading)}</h1><p>${escape(page.description)}</p>${details}</main><nav aria-label="Explore Sri Kanagadhara Sweets">${linkList(navigation)}</nav>`
}

function renderPage(template: string, page: Page, origin: string, genericPrivate = false) {
  const { canonical, meta, schema } = getHeadFields(page, origin)
  const elements = [`<title>${escape(page.title)}</title>`]
  if (!genericPrivate) elements.push(`<link rel="canonical" href="${escape(canonical)}">`)
  for (const [key, value] of Object.entries(meta)) {
    if (genericPrivate && key === 'og:url') continue
    elements.push(`<meta ${key.startsWith('og:') ? 'property' : 'name'}="${escape(key)}" content="${escape(value)}">`)
  }
  if (schema) {
    elements.push(`<script type="application/ld+json" id="store-seo-schema">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`)
  }
  return template.replace(/<!--seo-head-->[\s\S]*?<!--\/seo-head-->/, () => elements.join('\n'))
    .replace('<div id="root"></div>', () => `<div id="root">${renderBody(page)}</div>`)
}

export function storefrontSeo(): Plugin {
  let origin: string
  return {
    name: 'storefront-seo',
    enforce: 'post',
    configResolved(config) {
      const configured = loadEnv(config.mode, config.envDir, 'VITE_').VITE_SITE_URL || defaultSiteOrigin
      const url = new URL(configured)
      if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
        throw new Error('VITE_SITE_URL must be an absolute HTTP(S) origin.')
      }
      origin = url.origin
    },
    generateBundle: {
      order: 'post',
      handler(_options, bundle) {
        const index = bundle['index.html']
        if (index?.type !== 'asset' || typeof index.source !== 'string') throw new Error('Missing built storefront HTML.')
        const template = index.source
        if (!template.includes('<!--seo-head-->') || !template.includes('<!--/seo-head-->') || !template.includes('<div id="root"></div>')) {
          throw new Error('Missing storefront SEO template markers.')
        }
        const emit = (fileName: string, source: string) => this.emitFile({ type: 'asset', fileName, source })
        const emitRoute = (path: string, page: Page) => {
          const html = renderPage(template, page, origin)
          if (path === '/') index.source = html
          else emit(path.slice(1) + '/index.html', html)
        }
        for (const page of publicPages) emitRoute(page.path, page)
        for (const alias of Object.keys(seoAliases)) emitRoute(alias, getSeoPage(alias))
        const privateShell = {
          ...getSeoPage('/account'),
          title: 'Sri Kanagadhara Sweets',
          heading: 'Sri Kanagadhara Sweets',
          description: 'Enable JavaScript to use this part of the storefront.',
        }
        emit('private.html', renderPage(template, privateShell, origin, true))
        emit('404.html', renderPage(template, getSeoPage('/404'), origin))
        const urls = publicPages.filter(page => page.indexable).map(page =>
          `  <url><loc>${escape(new URL(page.path, origin).href)}</loc></url>`)
        emit('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.join('\n') + '\n</urlset>\n')
        emit('robots.txt', `User-agent: *\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`)
      },
    },
    configurePreviewServer(server) {
      const dist = resolve(server.config.root, server.config.build.outDir)
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') return next()
        const { pathname, search } = new URL(req.url || '/', 'http://localhost')
        if (/^\/(api|assets|brand|products\/[^/]+\.[^/]+|Video)(\/|$)/.test(pathname) || /\.[^/]+$/.test(pathname)) return next()
        const page = getSeoPage(pathname, search)
        const path = pathname.replace(/\/+$/, '') || '/'
        const existing = publicPages.some(item => item.path === path) || Object.hasOwn(seoAliases, path)
        if (existing) {
          if (!page.indexable) res.setHeader('X-Robots-Tag', 'noindex, follow')
          req.url = (path === '/' ? '' : path) + '/index.html' + search
          return next()
        }
        const missing = page.path === '/404'
        const fallback = missing ? '404.html' : page.indexable ? page.path.slice(1) + '/index.html' : 'private.html'
        try {
          const html = await readFile(resolve(dist, fallback))
          if (!page.indexable) res.setHeader('X-Robots-Tag', 'noindex, follow')
          res.writeHead(missing ? 404 : 200, { 'Content-Type': 'text/html; charset=utf-8' })
          res.end(req.method === 'HEAD' ? undefined : html)
        } catch (error) { next(error) }
      })
    },
  }
}
