/// <reference types="vite/client" />

const configuredEmail = import.meta.env.VITE_STORE_CONTACT_EMAIL?.trim() ?? ''

export const storeContactEmail = /^[\w.+-]+@[a-z\d.-]+\.[a-z]{2,}$/i.test(configuredEmail)
  ? configuredEmail
  : ''

export function storeEmailLink(subject: string, body = '') {
  return `mailto:${storeContactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
