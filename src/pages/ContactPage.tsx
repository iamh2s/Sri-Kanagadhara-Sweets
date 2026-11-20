import type { FormEvent } from 'react'
import { ArrowRight, Clock3, MapPin, MessageCircle, Sparkles } from 'lucide-react'
import { storeContactEmail, storeEmailLink } from '../data/storeContact'

function Flower2Icon() {
  return <Sparkles size={21} aria-hidden="true" />
}

export function ContactPage() {
  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const body = [
      String(fields.get('message')),
      '',
      `From ${fields.get('name')} (${fields.get('email')})`,
    ].join('\r\n')
    window.location.href = storeEmailLink('Message for Sri Kanagadhara Sweets', body)
  }

  return (
    <div id="module-content">
      <section className="contact-layout module-content-wrap">
        <div className="contact-copy" data-aos="fade-right">
          <p className="module-kicker module-kicker-dark"><span /> GOOD THINGS START WITH A HELLO</p>
          <h2>Tell us what<br />you’re <em>celebrating.</em></h2>
          <p>We’re here for gift ideas, special requests, and questions about your order.</p>
          <div className="contact-detail"><MessageCircle size={19} /><div><b>Let’s talk sweets</b><span>{storeContactEmail ? <a href={storeEmailLink('Store inquiry')}>{storeContactEmail}</a> : 'Online inquiries are currently unavailable.'}</span></div></div>
          <div className="contact-detail"><Clock3 size={19} /><div><b>Made fresh, answered with care</b><span>Our team will reply as soon as possible.</span></div></div>
          <div className="contact-detail"><MapPin size={19} /><div><b>Kanagadhara Sweets</b><span>Made with love, wherever you are.</span></div></div>
        </div>
        {storeContactEmail && <form className="contact-form" data-aos="fade-left" onSubmit={submitContact}>
          <span className="contact-form-mark"><Flower2Icon /></span>
          <p className="module-kicker module-kicker-dark"><span /> SEND US A LITTLE NOTE</p>
          <label>Your name<input name="name" autoComplete="name" required placeholder="How should we address you?" /></label>
          <label>Email address<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label>
          <label>What can we help with?<textarea name="message" rows={4} required placeholder="Tell us a little about it..." /></label>
          <button className="button button-primary" type="submit">Open email draft <ArrowRight size={15} /></button>
        </form>}
      </section>
      <section className="contact-bottom" data-aos="fade-up">
        <span>FOR ORDERS, GIFTS & LITTLE QUESTIONS</span>
        {storeContactEmail && <a href={storeEmailLink('Store inquiry')}>Email our team <ArrowRight size={14} /></a>}
      </section>
    </div>
  )
}
