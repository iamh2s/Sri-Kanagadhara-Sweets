import type { MouseEvent } from 'react'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import type { ModulePagesProps } from './ModulePages'
import { prebookingPhone, prebookingPhoneHref } from '../data/storeContact'
import './GiftBoxesPage.css'

const giftOptions = [
  {
    title: 'Festival boxes',
    description: 'Planning for a festival? Ask which sweets are available and when your boxes can be collected.',
    action: 'Ask about festival preorders',
    route: 'festival-preorders',
    image: '/brand/laddu-maker.webp',
  },
  {
    title: 'Gifts for a gathering',
    description: 'For wedding guests or the office team, tell us your headcount, occasion and preferred sweets.',
    action: 'Request a bulk quote',
    route: 'bulk-enquiry',
    image: '/brand/kaju-katli-maker.webp',
  },
  {
    title: 'A personal selection',
    description: 'Pick their favourites from the sweets collection and choose a weight for each one.',
    action: 'Browse sweets',
    route: 'sweets#catalog',
    image: '/brand/mysorepak-maker.webp',
  },
]

const signatureSweets = ['Chandrakala', 'Suryakala', 'Khoya Samosa', 'Mysore Pak', 'Milk Cake', 'Kalakand',
  'Halwa', 'Kaju Katli', 'Kaju Roll', 'Laddu', 'Makhan Bada', 'Sonpapdi']

export function GiftBoxesPage({ collections, onNavigate }: Pick<ModulePagesProps, 'collections' | 'onNavigate'>) {
  const giftImage = collections.find(collection => collection.link === 'Gift Boxes')?.image

  function follow(event: MouseEvent<HTMLAnchorElement>, route: string) {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    onNavigate(route)
  }

  return (
    <div id="module-content" className="gift-guide module-content-wrap">
      <section id="signature-sweets" className="signature-offer" aria-labelledby="signature-offer-title" tabIndex={-1}>
        <header className="gift-guide-heading"><h2 id="signature-offer-title">Our signature sweets</h2></header>
        <ol>{signatureSweets.map(name => <li key={name}>{name}</li>)}</ol>
        <p><strong>₹375</strong> · Call to pre-book and confirm availability.</p>
        <a className="button button-primary" href={prebookingPhoneHref}>Pre-book · {prebookingPhone}</a>
      </section>
      <section aria-labelledby="gift-guide-heading">
        <header className="gift-guide-heading">
          <h2 id="gift-guide-heading">Choose a gift for <em>the occasion.</em></h2>
        </header>

        <div className="gift-guide-grid">
          {giftOptions.map(option => (
            <article className="gift-guide-card" key={option.route}>
              <img src={option.route === 'bulk-enquiry' && giftImage ? giftImage : option.image} alt="" loading="lazy" />
              <div>
                <h3>{option.title}</h3>
                <p>{option.description}</p>
                <a href={'/' + option.route} onClick={event => follow(event, option.route)}>
                  {option.action} <ArrowRight size={17} aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="gift-guide-help" aria-labelledby="gift-help-heading">
        <ShoppingBag size={30} aria-hidden="true" />
        <div>
          <h2 id="gift-help-heading">Need help choosing a box?</h2>
          <p>Share your budget per box, how many you need and the date of your celebration.</p>
        </div>
        <a href="/contact" onClick={event => follow(event, 'contact')}>Contact the store <ArrowRight size={16} aria-hidden="true" /></a>
      </aside>
    </div>
  )
}
