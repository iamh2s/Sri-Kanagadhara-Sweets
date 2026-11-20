import { ArrowRight, Clock3, Heart, Leaf, Sparkles } from 'lucide-react'
import type { ModulePagesProps } from './ModulePages'

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
      <section className="story-values">
        <div data-aos="fade-up"><span>01</span><Leaf size={22} /><h3>Honest ingredients</h3><p>We start with ingredients chosen for flavour, freshness, and the care they deserve.</p></div>
        <div data-aos="fade-up" data-aos-delay="90"><span>02</span><Clock3 size={22} /><h3>Time-honoured craft</h3><p>Good things take patience. We hold close to the methods that make every bite familiar.</p></div>
        <div data-aos="fade-up" data-aos-delay="180"><span>03</span><Heart size={22} /><h3>Made for sharing</h3><p>Every box is prepared with one simple thought: who will you share it with?</p></div>
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
