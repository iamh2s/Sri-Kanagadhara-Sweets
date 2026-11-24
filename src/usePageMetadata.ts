import { useEffect } from 'react'
import { getSeoPage } from '../shared/seo'
import { defaultSiteOrigin, getHeadFields } from '../shared/seoHead'

export function usePageMetadata(pathname: string, search: string) {
  useEffect(() => {
    const page = getSeoPage(pathname, search)
    const { canonical, meta, schema } = getHeadFields(page, import.meta.env.VITE_SITE_URL || defaultSiteOrigin)
    document.title = page.title

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (canonical) {
      if (!link) {
        link = document.createElement('link')
        link.rel = 'canonical'
        document.head.append(link)
      }
      link.href = canonical
    } else {
      link?.remove()
    }

    for (const tag of document.head.querySelectorAll<HTMLMetaElement>('meta[property^="og:"], meta[name^="twitter:"]')) {
      const key = tag.getAttribute('property') || tag.name
      if (!(key in meta)) tag.remove()
    }
    for (const [key, content] of Object.entries(meta)) {
      const attribute = key.startsWith('og:') ? 'property' : 'name'
      let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute(attribute, key)
        document.head.append(tag)
      }
      tag.content = content
    }

    let script = document.head.querySelector<HTMLScriptElement>('#store-seo-schema')
    if (schema) {
      if (!script) {
        script = document.createElement('script')
        script.type = 'application/ld+json'
        script.id = 'store-seo-schema'
        document.head.append(script)
      }
      script.textContent = JSON.stringify(schema)
    } else {
      script?.remove()
    }
  }, [pathname, search])
}
