import { useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

import {
  ArrowRight,
  ChevronRight,
  Copy,
  HelpCircle,
  Mail,
  MessageCircle,
  Package,
  RotateCcw,
  Truck,
  MapPin,
  Phone,
} from 'lucide-react'

import {
  contactLinks,
  storeAddress,
  storeContactEmail,
  storeEmailLink,
  storePhone,
  storePhoneHref,
} from '../data/storeContact'

import './ContactPage.css'

const supportIcons = {
  contact: Mail,
  faq: HelpCircle,
  'track-order': Package,
  shipping: Truck,
  returns: RotateCcw,
  grievance: MessageCircle,
}

export function ContactPage() {
  const [draft, setDraft] = useState<{
    subject: string
    body: string
  } | null>(null)

  const [status, setStatus] = useState('')

  const preview = useRef<HTMLTextAreaElement>(null)

  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const fields = new FormData(event.currentTarget)

    const value = (name: string) =>
      String(fields.get(name) ?? '').trim()

    if (!value('message')) {
      const message = event.currentTarget.elements.namedItem(
        'message'
      ) as HTMLTextAreaElement

      message.setCustomValidity('Please enter your message.')
      message.reportValidity()

      return
    }

    const contact = [
      value('name'),
      value('email'),
    ]
      .filter(Boolean)
      .join(' · ')

    setDraft({
      subject: value('topic'),
      body: [
        value('message'),
        contact,
      ]
        .filter(Boolean)
        .join('\n\n'),
    })

    setStatus('Your draft is ready. It has not been sent.')
  }

  async function copy() {
    if (!draft) return

    try {
      await navigator.clipboard.writeText(
        draft.subject + '\n\n' + draft.body
      )

      setStatus('Draft copied.')
    } catch {
      preview.current?.focus()
      preview.current?.select()

      setStatus(
        'Draft selected. Use your device’s copy command.'
      )
    }
  }

  return (
    <article
      className="contact-studio"
      id="module-content"
    >

      {/* =========================================
          CONTACT HERO SECTION
      ========================================== */}

      <header className="cs-intro">

        <div className="cs-intro-copy">

          <div className="cs-eyebrow">
            <span />
            WE ARE HERE TO HELP
            <span />
          </div>

          <h1>
            Contact <em>us.</em>
          </h1>

          <p className="cs-intro-description">
            Planning a gift, choosing sweets for a
            celebration, or checking on an order?
            Tell us how we can help.
          </p>

          <div className="cs-contact-divider" />

          {/* Contact information */}

          <div className="cs-contact-details">

            {/* Address */}

            <div className="cs-contact-item">

              <div className="cs-contact-icon">
                <MapPin size={21} strokeWidth={1.5} />
              </div>

              <div className="cs-contact-text">

                <span className="cs-contact-label">
                  Visit our store
                </span>

                <address>
                  {storeAddress}
                </address>

              </div>

            </div>

            {/* Phone */}

            <a
              className="cs-contact-item"
              href={storePhoneHref}
            >

              <div className="cs-contact-icon">
                <Phone size={20} strokeWidth={1.5} />
              </div>

              <div className="cs-contact-text">

                <span className="cs-contact-label">
                  Call the shop
                </span>

                <span className="cs-contact-value">
                  {storePhone}
                </span>

              </div>

            </a>

            {/* Email */}

            {storeContactEmail && (
              <a
                className="cs-contact-item"
                href={storeEmailLink('Shop enquiry')}
              >

                <div className="cs-contact-icon">
                  <Mail size={21} strokeWidth={1.5} />
                </div>

                <div className="cs-contact-text">

                  <span className="cs-contact-label">
                    Email us
                  </span>

                  <span className="cs-contact-value">
                    {storeContactEmail}
                  </span>

                </div>

              </a>
            )}

          </div>

        </div>

        {/* Existing sweet-maker image */}

        <div className="cs-intro-visual">

          <img
            className="cs-intro-photo"
            src="/brand/kaju-katli-maker.webp"
            alt="Preparing traditional kaju katli"
            {...{ fetchpriority: 'high' }}
          />

        </div>

      </header>

      {/* =========================================
          CUSTOMER SUPPORT AND ENQUIRY FORM
      ========================================== */}

      <div className="cs-body">

        <nav
          className="cs-directory"
          aria-label="Contact and support"
        >

          <h2>Customer support</h2>

          {contactLinks.map(link => {

            const Icon =
              supportIcons[
                link.route as keyof typeof supportIcons
              ] ?? MessageCircle

            return (
              <Link
                key={link.route}
                to={link.href}
                aria-current={
                  link.route === 'contact'
                    ? 'page'
                    : undefined
                }
              >

                <Icon size={18} />

                <span>
                  {link.label}
                </span>

                <ChevronRight size={15} />

              </Link>
            )
          })}

        </nav>

        {/* Message form */}

        <section
          className="cs-message"
          aria-labelledby="cs-message-title"
        >

          <h2 id="cs-message-title">
            Write to us
          </h2>

          <p>
            {storeContactEmail
              ? 'Prepare your enquiry, then review and send it in your email app.'
              : 'Our online inbox is currently unavailable. You can prepare and copy an enquiry here.'}
          </p>

          <form
            onSubmit={prepare}
            onChange={() => {
              setDraft(null)
              setStatus('')
            }}
          >

            <div className="cs-fields">

              <label>
                Your name

                <input
                  name="name"
                  autoComplete="name"
                  maxLength={100}
                  required={Boolean(storeContactEmail)}
                />
              </label>

              <label>
                Email address

                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  required={Boolean(storeContactEmail)}
                />
              </label>

            </div>

            <label>
              Enquiry topic

              <select
                name="topic"
                defaultValue="General enquiry"
              >

                {[
                  'General enquiry',
                  'Product information',
                  'Gifting and bulk orders',
                  'Order support',
                ].map(topic => (
                  <option key={topic}>
                    {topic}
                  </option>
                ))}

              </select>

            </label>

            <label>
              Your message

              <textarea
                name="message"
                rows={4}
                maxLength={1500}
                required
                onInput={e =>
                  e.currentTarget.setCustomValidity('')
                }
              />

            </label>

            <button
              type="submit"
              className="cs-primary"
            >
              Prepare enquiry

              <ArrowRight size={16} />
            </button>

          </form>

          <p
            className="cs-status"
            role="status"
          >
            {status}
          </p>

          {/* Enquiry draft */}

          {draft && (
            <section
              className="cs-draft"
              aria-label="Enquiry draft"
            >

              <label>
                Enquiry draft

                <textarea
                  readOnly
                  ref={preview}
                  value={
                    draft.subject +
                    '\n\n' +
                    draft.body
                  }
                  rows={4}
                />

              </label>

              <div>

                {storeContactEmail && (
                  <a
                    className="cs-primary"
                    href={storeEmailLink(
                      draft.subject,
                      draft.body
                    )}
                  >
                    Open email app

                    <Mail size={16} />
                  </a>
                )}

                <button
                  type="button"
                  onClick={copy}
                >
                  <Copy size={16} />

                  Copy draft
                </button>

              </div>

            </section>
          )}

        </section>

      </div>

    </article>
  )
}