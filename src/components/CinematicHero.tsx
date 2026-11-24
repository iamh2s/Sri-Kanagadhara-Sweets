import { ArrowDown } from 'lucide-react'
import './CinematicHero.css'

/* =========================================
   PAGE IMAGES
========================================= */

const pageImages: Record<string, string> = {
  'shop-all': '/brand/indian-sweets-hero.webp',
  sweets: '/brand/sweets.webp',
  savouries: '/brand/savouries.webp',
  'gift-boxes': '/brand/giftbox.webp',
  'our-story': '/brand/homecelebration1.webp',
}

/* =========================================
   PAGE CONTENT
========================================= */

type PageCopy = {
  kicker: string
  title: string
  accent: string
  summary: string
}

const pageCopy: Record<string, PageCopy> = {
  'shop-all': {
    kicker: 'THE KANAGADHARA COLLECTION',
    title: 'A little joy,',
    accent: 'for every table.',
    summary:
      'Explore the flavours that turn everyday moments into something worth remembering.',
  },

  sweets: {
    kicker: 'HANDCRAFTED WITH TRADITION',
    title: 'Golden days,',
    accent: 'sweeter ways.',
    summary:
      'From ghee-rich classics to delicate milk sweets, every piece carries a taste of home.',
  },

  savouries: {
    kicker: 'CRUNCH INTO SOMETHING GOOD',
    title: 'A little spice,',
    accent: 'a lot of joy.',
    summary:
      'Small-batch savouries made for chai breaks, long conversations, and one-more-handful moments.',
  },

  'gift-boxes': {
    kicker: 'GIVE A LITTLE HAPPINESS',
    title: 'Thoughtful gifts,',
    accent: 'beautifully shared.',
    summary:
      'A celebration-ready collection, wrapped with care and filled with everyone’s favourites.',
  },

  'our-story': {
    kicker: 'ROOTED IN THE WAY WE SHARE',
    title: 'Made with care.',
    accent: 'Kept by tradition.',
    summary:
      'Some recipes feel like coming home. We make every sweet to bring that feeling to your table.',
  },
}

/* =========================================
   IMAGE CONFIGURATION
========================================= */

const imageWidths = [640, 960, 1280, 1600]

function getHeroImage(imageId: string) {
  if (imageId.startsWith('/')) {
    return {
      src: imageId,
      srcSet: undefined,
    }
  }

  const baseUrl = `https://images.unsplash.com/${imageId}`

  return {
    src: `${baseUrl}?auto=format&fit=crop&w=1280&q=80`,

    srcSet: imageWidths
      .map(
        (width) =>
          `${baseUrl}?auto=format&fit=crop&w=${width}&q=80 ${width}w`,
      )
      .join(', '),
  }
}

/* =========================================
   HERO COMPONENT
========================================= */

type CinematicHeroProps = {
  page: string
}

export function CinematicHero({
  page,
}: CinematicHeroProps) {
  const copy = pageCopy[page] ?? pageCopy['shop-all']

  const imageId =
    pageImages[page] ?? pageImages['shop-all']

  const { src, srcSet } = getHeroImage(imageId)

  return (
    <section
      key={page}
      className={`module-hero module-hero-${page}`}
      aria-labelledby="module-hero-title"
    >
      {/* Background image */}

      <img
        className="module-hero-image"
        src={src}
        srcSet={srcSet}
        sizes="100vw"
        alt=""
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />

      {/* Background gradient */}

      <div
        className="module-hero-shade"
        aria-hidden="true"
      />

      {/* Decorative texture */}

      <div
        className="module-hero-grain"
        aria-hidden="true"
      />

      {/* Decorative corners */}

      <span
        className="hero-corner hero-corner-top-left"
        aria-hidden="true"
      />

      <span
        className="hero-corner hero-corner-top-right"
        aria-hidden="true"
      />

      <span
        className="hero-corner hero-corner-bottom-left"
        aria-hidden="true"
      />

      <span
        className="hero-corner hero-corner-bottom-right"
        aria-hidden="true"
      />

      {/* Main content */}

      <div className="module-hero-content">

        <p className="module-kicker">
          <span aria-hidden="true" />

          {copy.kicker}

          <span aria-hidden="true" />
        </p>

        <h1 id="module-hero-title">
          <span className="module-title-main">
            {copy.title}
          </span>

          <em className="module-title-accent">
            {copy.accent}
          </em>
        </h1>

        <p className="module-hero-summary">
          {copy.summary}
        </p>

        {/* Discover button */}

        <a
          className="module-scroll-link"
          href="#module-content"
        >
          <span className="module-button-text">
            DISCOVER MORE
          </span>

          <span className="module-button-icon">
            <ArrowDown size={17} strokeWidth={1.8} />
          </span>
        </a>

      </div>

      {/* Bottom right brand signature */}

      <div
        className="module-hero-index"
        aria-hidden="true"
      >
        <span>SRI</span>

        <strong>KANAGADHARA</strong>

        <i />
      </div>

      {/* Bottom left caption */}

      <span className="module-hero-caption">
        SRI KANAGADHARA SWEETS

        <i aria-hidden="true" />

        MADE TO BE SHARED
      </span>

    </section>
  )
}