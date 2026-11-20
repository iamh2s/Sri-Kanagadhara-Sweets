import { ArrowDown } from 'lucide-react'

const pageImages: Record<string, string> = {
  'shop-all': '/brand/indian-sweets-hero.webp',
  sweets: 'photo-1606313564200-e75d5e30476c',
  savouries: 'photo-1599487488170-d11ec9c172f0',
  'gift-boxes': 'photo-1549465220-1a8b9238cd48',
  'our-story': 'photo-1555507036-ab1f4038808a',
  contact: 'photo-1555507036-ab1f4038808a',
  account: 'photo-1578985545062-69928b1d9587',
}

const pageCopy: Record<string, { kicker: string; title: string; accent: string; summary: string }> = {
  'shop-all': {
    kicker: 'THE KANAGADHARA COLLECTION',
    title: 'A little joy,',
    accent: 'for every table.',
    summary: 'Explore the flavours that turn everyday moments into something worth remembering.',
  },
  sweets: {
    kicker: 'HANDCRAFTED WITH TRADITION',
    title: 'Golden days,',
    accent: 'sweeter ways.',
    summary: 'From ghee-rich classics to delicate milk sweets, every piece carries a taste of home.',
  },
  savouries: {
    kicker: 'CRUNCH INTO SOMETHING GOOD',
    title: 'A little spice,',
    accent: 'a lot of joy.',
    summary: 'Small-batch savouries made for chai breaks, long conversations, and one-more-handful moments.',
  },
  'gift-boxes': {
    kicker: 'GIVE A LITTLE HAPPINESS',
    title: 'Thoughtful gifts,',
    accent: 'beautifully shared.',
    summary: 'A celebration-ready collection, wrapped with care and filled with everyone’s favourites.',
  },
  'our-story': {
    kicker: 'ROOTED IN THE WAY WE SHARE',
    title: 'Made with care.',
    accent: 'Kept by tradition.',
    summary: 'Some recipes feel like coming home. We make every sweet to bring that feeling to your table.',
  },
  contact: {
    kicker: 'A REAL PERSON, ALWAYS',
    title: 'Let’s make',
    accent: 'something sweet.',
    summary: 'Planning a celebration or choosing a gift? Tell us what you have in mind.',
  },
  account: {
    kicker: 'YOUR SWEET LITTLE CORNER',
    title: 'Everything you love,',
    accent: 'all in one place.',
    summary: 'Account services are coming soon. Until then, our team is happy to help with an order.',
  },
}

export function CinematicHero({ page }: { page: string }) {
  const copy = pageCopy[page] ?? pageCopy['shop-all']
  const imageId = pageImages[page] ?? pageImages['shop-all']
  const imageSrc = imageId.startsWith('/')
    ? imageId
    : `https://images.unsplash.com/${imageId}?auto=format&fit=crop&w=1280&q=80`
  const imageSrcSet = imageId.startsWith('/')
    ? undefined
    : [640, 960, 1280, 1600]
        .map((width) => `https://images.unsplash.com/${imageId}?auto=format&fit=crop&w=${width}&q=80 ${width}w`)
        .join(', ')

  return (
    <section className={`module-hero module-hero-${page}`}>
      <img
        className="module-hero-image"
        src={imageSrc}
        srcSet={imageSrcSet}
        sizes="100vw"
        alt=""
        loading="eager"
      />
      <div className="module-hero-shade" />
      <div className="module-hero-grain" aria-hidden="true" />
      <div className="module-hero-content">
        <p className="module-kicker" data-aos="fade-up"><span />{copy.kicker}<span /></p>
        <h1 data-aos="fade-up" data-aos-delay="100">{copy.title}<br /><em>{copy.accent}</em></h1>
        <p className="module-hero-summary" data-aos="fade-up" data-aos-delay="200">{copy.summary}</p>
        <a className="module-scroll-link" href="#module-content" data-aos="fade-up" data-aos-delay="300">
          DISCOVER MORE <ArrowDown size={15} />
        </a>
      </div>
      <div className="module-hero-index" aria-hidden="true">
        <span>SRI</span><strong>KANAGADHARA</strong><i />
      </div>
      <span className="module-hero-caption">SRI KANAGADHARA SWEETS <i /> MADE TO BE SHARED</span>
    </section>
  )
}
