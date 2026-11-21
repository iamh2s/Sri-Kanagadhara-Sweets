import { ArrowRight, Clock3, Heart, Leaf, Sparkles } from 'lucide-react'
import type { ModulePagesProps } from './ModulePages'
import { Link } from 'react-router-dom'

export function StoryPage({ onNavigate }: Pick<ModulePagesProps, 'onNavigate'>) {
  return (
    <div id="module-content" className="story-page">
      <section className="story-opening module-content-wrap">
        <div className="story-opening-copy" data-aos="fade-right">
          <p className="module-kicker module-kicker-dark"><span /> A NOTE FROM OUR FAMILY</p>
          <h2>Some recipes<br />carry <em>memories.</em></h2>
          <p>At Kanagadhara, sweetness has never been just about taste. It is the first box opened at a family gathering, the treat tucked into a visit, and the last piece someone saves for you.</p>
          <span className="story-signature">Made with warmth, <b>Kanagadhara</b></span>
        </div>
        <figure className="story-opening-image" data-aos="fade-left">
          <img src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1400&q=90" alt="A lovingly prepared table for sharing sweets" loading="lazy" />
          <figcaption>EVERY RECIPE BEGINS WITH A REASON TO SHARE</figcaption>
        </figure>
      </section>
      <section id="our-values" tabIndex={-1} aria-label="Our values" className="story-values">
        <div data-aos="fade-up"><span>01</span><Leaf size={22} /><h3>Honest ingredients</h3><p>We start with ingredients chosen for flavour, freshness, and the care they deserve.</p></div>
        <div data-aos="fade-up" data-aos-delay="90"><span>02</span><Clock3 size={22} /><h3>Time-honoured craft</h3><p>Good things take patience. We hold close to the methods that make every bite familiar.</p></div>
        <div data-aos="fade-up" data-aos-delay="180"><span>03</span><Heart size={22} /><h3>Made for sharing</h3><p>Every box is prepared with one simple thought: who will you share it with?</p></div>
      </section>
      <section id="sweet-box" tabIndex={-1} aria-labelledby="sweet-box-heading" className="story-opening module-content-wrap">
        <figure className="story-opening-image">
          <img src="/brand/laddu-maker.webp" alt="A sweet maker preparing laddu" loading="lazy" />
        </figure>
        <div className="story-opening-copy">
          <h2 id="sweet-box-heading">Inside the <em>sweet box.</em></h2>
          <p>Open a mixed box and each sweet has its own texture. Motichoor Laddu pulls apart into tiny pearls. Kaju Katli has a smooth cashew bite, while Badusha breaks into delicate layers.</p>
          <p>For a tea-time spread, set a little Butter Murukku beside the sweets. Its salty crunch makes a lovely pairing with a soft piece of Mysore Pak.</p>
          <Link className="button button-primary" to="/shop-all#catalog">Explore the collection <ArrowRight size={15} /></Link>
        </div>
      </section>
      <section id="gifting-traditions" tabIndex={-1} aria-labelledby="gifting-heading" className="story-opening module-content-wrap">
        <div className="story-opening-copy">
          <h2 id="gifting-heading">A box to <em>take along.</em></h2>
          <p>For a visit to someone’s home, start with the sweet they always reach for. For a festival table, choose a mix of flavours so everyone can find a favourite.</p>
          <p>Planning gifts for a wedding or an office gathering? Share your guest count, occasion and date with the shop so you can discuss a selection that suits the day.</p>
          <Link className="button button-primary" to="/gift-boxes">Explore gift boxes <ArrowRight size={15} /></Link>
        </div>
        <figure className="story-opening-image">
          <img src="/brand/kaju-katli-maker.webp" alt="Kaju Katli being prepared" loading="lazy" />
        </figure>
      </section>
      <section className="story-closing" data-aos="fade-up">
        <div className="story-closing-image">
          <img src="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1600&q=90" alt="Traditional sweets made for a family celebration" loading="lazy" />
        </div>
        <div className="story-closing-copy">
          <Sparkles size={22} />
          <p className="module-kicker">OUR PROMISE</p>
          <h2>Tradition served<br /><em>with every bite.</em></h2>
          <a className="button button-light" href="/shop-all" onClick={(event) => { event.preventDefault(); onNavigate('shop-all') }}>Taste our tradition <ArrowRight size={15} /></a>
        </div>
      </section>
    </div>
  )
}
