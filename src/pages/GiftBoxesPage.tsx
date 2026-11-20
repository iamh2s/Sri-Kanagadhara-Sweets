import { ArrowRight, Check, Gift } from 'lucide-react'
import type { ModulePagesProps } from './ModulePages'

export function GiftBoxesPage({ collections, onNavigate }: Pick<ModulePagesProps, 'collections' | 'onNavigate'>) {
  return (
    <div id="module-content">
      <section className="module-intro module-content-wrap" data-aos="fade-up">
        <p className="module-kicker module-kicker-dark"><span /> A GIFT WITH A STORY <span /></p>
        <h2>Make their moment<br /><em>unforgettable.</em></h2>
        <p>From thoughtful little gestures to the big family celebrations, give them a box full of togetherness.</p>
      </section>
      <section className="gift-editorial module-content-wrap">
        <div className="gift-editorial-image" data-aos="fade-right">
          <img src={collections[1]?.image} alt="A festive sweet box ready to gift" loading="lazy" />
          <span className="gift-image-seal"><Gift size={21} /><b>GIFT<br />WITH LOVE</b></span>
        </div>
        <div className="gift-editorial-copy" data-aos="fade-left">
          <p className="module-kicker module-kicker-dark"><span /> MADE FOR YOUR PEOPLE</p>
          <h2>Good things<br />come <em>beautifully wrapped.</em></h2>
          <p>Hand-picked favourites, elegant presentation, and the kind of gift that brings everyone around the table.</p>
          <ul>
            <li><Check size={16} /> A mix of much-loved classics</li>
            <li><Check size={16} /> Carefully packed for every journey</li>
            <li><Check size={16} /> A thoughtful touch for every occasion</li>
          </ul>
          <a className="button button-primary" href="/contact" onClick={(event) => { event.preventDefault(); onNavigate('contact') }}>
            Plan a gift <ArrowRight size={16} />
          </a>
        </div>
      </section>
      <section className="gift-collections module-content-wrap" data-aos="fade-up">
        <div className="module-subheading" data-aos="fade-up">
          <p className="module-kicker module-kicker-dark"><span /> A BOX FOR EVERY OCCASION</p>
          <h2>Choose your <em>kind of joy.</em></h2>
        </div>
        <div className="gift-collection-grid">
          {collections.map((collection, index) => (
            <button className="gift-collection-card" key={collection.title} data-aos="fade-up" data-aos-delay={index * 90} onClick={() => onNavigate(collection.link === 'Sweets' ? 'sweets' : 'shop-all')}>
              <img src={collection.image} alt="" loading="lazy" />
              <span className="gift-collection-shade" />
              <span className="gift-collection-number">0{index + 1}</span>
              <span className="gift-collection-copy"><strong>{collection.title}</strong><i>{collection.subtitle}</i><b>EXPLORE <ArrowRight size={13} /></b></span>
            </button>
          ))}
        </div>
      </section>
      <section className="gift-note" data-aos="fade-up">
        <Gift size={24} />
        <p>Have a larger celebration in mind?</p>
        <a href="/contact" onClick={(event) => { event.preventDefault(); onNavigate('contact') }}>Let’s plan it together <ArrowRight size={14} /></a>
      </section>
    </div>
  )
}
