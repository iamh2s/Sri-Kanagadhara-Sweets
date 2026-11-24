import { useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { storeContactEmail, storeEmailLink } from '../data/storeContact'
import './CustomerSupport.css'
import { topics, type Topic } from '../../shared/supportTopics'

function EnquiryForm({ topic }: { topic: Topic }) {
  const isGift = topic.request === 'bulk' || topic.request === 'festival'

  const [draft, setDraft] = useState('')
  const [copyStatus, setCopyStatus] = useState('')
  const draftField = useRef<HTMLTextAreaElement>(null)

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(draft)
      setCopyStatus('Draft copied.')
    } catch {
      draftField.current?.focus()
      draftField.current?.select()
      setCopyStatus('Draft selected. Use your device’s copy command.')
    }
  }

  function openDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    const body = [
      isGift && `Approximate quantity: ${values.get('quantity')}`,
      isGift && values.get('date') && `Preferred date: ${values.get('date')}`,
      values.get('reference') && `Order reference: ${values.get('reference')}`,
      String(values.get('details') ?? '').trim(),
    ].filter(Boolean).join('\r\n')
    const subject = topic.title + ' — Sri Kanagadhara Sweets'
    if (storeContactEmail) {
      window.location.href = storeEmailLink(subject, body)
    } else {
      setDraft([subject, '', body].join('\r\n'))
      setCopyStatus('')
    }
  }

  return (
    <div><form className="ks-support-form" onSubmit={openDraft} onChange={() => { setDraft(''); setCopyStatus('') }}>
      {isGift ? (
        <div className="ks-support-fields">
          <label>Approximate quantity<input name="quantity" type="number" required min="1" step="1" /></label>
          <label>Preferred date (optional)<input name="date" type="date" /></label>
        </div>
      ) : <label>Order reference (optional)<input name="reference" maxLength={80} /></label>}
      <label>{isGift ? 'Products, pack sizes and delivery requirements' : 'Tell us what happened'}
        <textarea name="details" rows={4} maxLength={1200} required />
      </label>
      <p>{storeContactEmail ? 'Review the draft in your email app before sending.' : 'Email enquiries are currently unavailable. Prepare a draft to copy and keep on your device.'}</p>
      <button className="button button-primary" type="submit">{storeContactEmail ? 'Open email draft' : 'Prepare draft'}</button>
    </form>
    {draft && <section className="ks-support-draft" aria-label="Prepared enquiry">
      <p role="status">Draft ready. Your enquiry has not been sent.</p>
      <label>Your draft<textarea ref={draftField} readOnly rows={6} value={draft} /></label>
      <button type="button" className="text-link" onClick={copyDraft}>Copy draft</button>
      <span role="status">{copyStatus}</span>
    </section>}</div>
  )
}

export function CustomerSupport({ page }: { page: string }) {
  const topic = topics[page]
  if (!topic) return null

  return (
    <article className="ks-support">
      <header>
        <Link className="text-link" to="/">Home</Link>
        <h1>{topic.title}</h1>
        <p>{topic.intro}</p>
      </header>
      <div className="ks-support-layout">
        <section aria-label={topic.title} className="ks-support-content" key={page}>
          {topic.entries.map(([heading, copy]) => page === 'faq' ? (
            <details key={heading}><summary>{heading}</summary><p>{copy}</p></details>
          ) : (
            <div className="ks-support-section" key={heading}><h2>{heading}</h2><p>{copy}</p></div>
          ))}
          {topic.request ? <EnquiryForm topic={topic} /> : storeContactEmail ? (
            <a className="text-link" href={storeEmailLink(topic.title)}>Email the shop</a>
          ) : <p className="ks-support-availability">Email enquiries are currently unavailable.</p>}
        </section>
        <nav aria-label="Customer support topics" className="ks-support-nav">
          <h2>Customer support</h2>
          {Object.entries(topics).map(([route, item]) => (
            <Link key={route} to={`/${route}`} aria-current={page === route ? 'page' : undefined}>{item.title}</Link>
          ))}
        </nav>
      </div>
    </article>
  )
}
