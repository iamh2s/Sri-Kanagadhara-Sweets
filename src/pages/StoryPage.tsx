import {
  ArrowRight,
  Clock3,
  Heart,
  Leaf,
  Sparkles,
} from 'lucide-react'

import type { ModulePagesProps } from './ModulePages'
import { Link } from 'react-router-dom'
import './StoryPage.css'

/* =========================================
   BRAND VALUES
========================================= */

const values = [
  {
    icon: Leaf,
    title: 'Honest ingredients',
    text: 'We start with ingredients chosen for flavour, freshness, and the care they deserve.',
  },
  {
    icon: Clock3,
    title: 'Time-honoured craft',
    text: 'Good things take patience. We hold close to the methods that make every bite familiar.',
  },
  {
    icon: Heart,
    title: 'Made for sharing',
    text: 'Every box is prepared with one simple thought: who will you share it with?',
  },
]

/* =========================================
   STORY PAGE
========================================= */

export function StoryPage({
  onNavigate,
}: Pick<ModulePagesProps, 'onNavigate'>) {
  return (
    <div
      id="module-content"
      className="story-page ks-story"
    >

      {/* =====================================
          SECTION 1 — A NOTE FROM OUR FAMILY
      ====================================== */}

      <section className="story-opening module-content-wrap">

        <div
          className="story-opening-copy"
          data-aos="fade-up"
          data-aos-duration="450"
        >

          <p className="module-kicker module-kicker-dark">
            <span />
            A NOTE FROM OUR FAMILY
          </p>

          <h2>
            Some recipes
            <br />
            carry <em>memories.</em>
          </h2>

          <p>
            At Kanagadhara, sweetness has never been just
            about taste. It is the first box opened at a
            family gathering, the treat tucked into a visit,
            and the last piece someone saves for you.
          </p>

          <span className="story-signature">
            Made with warmth, <b>Kanagadhara</b>
          </span>

        </div>

        {/* IMAGE 1 — ABOUT US */}

        <figure
          className="story-opening-image"
          data-aos="fade-up"
          data-aos-duration="450"
        >

          <img
            src="/brand/aboutus1.webp"
            alt="Traditional Kanagadhara sweets made with care"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />

          <figcaption>
            EVERY RECIPE BEGINS WITH A REASON TO SHARE
          </figcaption>

        </figure>

      </section>

      {/* =====================================
          SECTION 2 — OUR VALUES
      ====================================== */}

      <section
        id="our-values"
        tabIndex={-1}
        aria-labelledby="story-values-title"
        className="story-values"
      >

        <header className="story-values-heading">

          <p className="module-kicker">
            ✦ THE KANAGADHARA WAY ✦
          </p>

          <h2 id="story-values-title">
            Rooted in <em>tradition.</em>
          </h2>

        </header>

        <div className="story-values-grid">

          {values.map(
            ({ icon: Icon, title, text }, index) => (
              <article
                className="story-value-card"
                key={title}
                data-aos="fade-up"
                data-aos-delay={index * 60}
                data-aos-duration="450"
              >

                <span className="story-value-number">
                  0{index + 1}
                </span>

                <span className="story-value-icon">

                  <Icon
                    size={26}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />

                </span>

                <h3>{title}</h3>

                <p>{text}</p>

              </article>
            ),
          )}

        </div>

      </section>

      {/* =====================================
          SECTION 3 — INSIDE THE SWEET BOX
      ====================================== */}

      <section
        id="sweet-box"
        tabIndex={-1}
        aria-labelledby="sweet-box-heading"
        className="story-opening module-content-wrap story-reversed"
      >

        {/* IMAGE 2 — LADDU MAKING */}

        <figure
          className="story-opening-image"
          data-aos="fade-up"
          data-aos-duration="450"
        >

          <img
            src="/brand/laddu-maker.webp"
            alt="A sweet maker preparing laddu"
            loading="lazy"
            decoding="async"
          />

        </figure>

        <div
          className="story-opening-copy"
          data-aos="fade-up"
          data-aos-duration="450"
        >

          <p className="module-kicker module-kicker-dark">
            <span />
            HANDCRAFTED HAPPINESS
          </p>

          <h2 id="sweet-box-heading">
            Inside the <em>sweet box.</em>
          </h2>

          <p>
            Open a mixed box and each sweet has its own
            texture. Motichoor Laddu pulls apart into tiny
            pearls. Kaju Katli has a smooth cashew bite,
            while Badusha breaks into delicate layers.
          </p>

          <p>
            For a tea-time spread, set a little Butter
            Murukku beside the sweets. Its salty crunch
            makes a lovely pairing with a soft piece
            of Mysore Pak.
          </p>

          <Link
            className="button button-primary story-cta"
            to="/shop-all#catalog"
          >
            Explore the collection
            <ArrowRight size={17} />
          </Link>

        </div>

      </section>

      {/* =====================================
          SECTION 4 — THE JOY OF GIVING
      ====================================== */}

      <section
        id="gifting-traditions"
        tabIndex={-1}
        aria-labelledby="gifting-heading"
        className="story-opening module-content-wrap"
      >

        <div
          className="story-opening-copy"
          data-aos="fade-up"
          data-aos-duration="450"
        >

          <p className="module-kicker module-kicker-dark">
            <span />
            THE JOY OF GIVING
          </p>

          <h2 id="gifting-heading">
            A box to <em>take along.</em>
          </h2>

          <p>
            For a visit to someone’s home, start with
            the sweet they always reach for. For a
            festival table, choose a mix of flavours
            so everyone can find a favourite.
          </p>

          <p>
            Planning gifts for a wedding or an office
            gathering? Share your guest count, occasion
            and date with the shop so you can discuss
            a selection that suits the day.
          </p>

          <Link
            className="button button-primary story-cta"
            to="/gift-boxes"
          >
            Explore gift boxes
            <ArrowRight size={17} />
          </Link>

        </div>

        {/* IMAGE 3 — KAJU KATLI MAKING */}

        <figure
          className="story-opening-image"
          data-aos="fade-up"
          data-aos-duration="450"
        >

          <img
            src="/brand/kaju-katli-maker.webp"
            alt="Kaju Katli being prepared"
            loading="lazy"
            decoding="async"
          />

        </figure>

      </section>

      {/* =====================================
          SECTION 5 — OUR PROMISE
      ====================================== */}

      <section
        className="story-closing"
        data-aos="fade-up"
        data-aos-duration="450"
      >

        {/* IMAGE 4 — KAJU ROLL */}

        <div className="story-closing-image">

          <img
            src="/products/kaju-roll.webp"
            alt="Traditional Kanagadhara Kaju Roll"
            loading="lazy"
            decoding="async"
          />

        </div>

        <div className="story-closing-copy">

          <Sparkles
            size={28}
            aria-hidden="true"
          />

          <p className="module-kicker">
            OUR PROMISE
          </p>

          <h2>
            Tradition served
            <br />
            <em>with every bite.</em>
          </h2>

          <a
            className="button button-light story-cta"
            href="/shop-all"
            onClick={(event) => {
              if (
                event.ctrlKey ||
                event.metaKey ||
                event.shiftKey ||
                event.altKey
              ) {
                return
              }

              event.preventDefault()
              onNavigate('shop-all')
            }}
          >
            Taste our tradition
            <ArrowRight size={17} />
          </a>

        </div>

      </section>

    </div>
  )
}