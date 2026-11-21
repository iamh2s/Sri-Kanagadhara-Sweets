import { catalogSlug } from '../../shared/catalogSlug'
import './HomePage.css'
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import {
  ArrowRight,
  ChevronDown,
  Flower2,
  Gift,
  Heart,
  Leaf,
  MessageCircle,
  PackageCheck,
  Plus,
  Sparkles,
  ShoppingBag,
  X,
} from 'lucide-react'
import Component from '@/components/ui/landing-page'
import CardCarousel from '@/components/ui/card-carousel'
import { formatPrice, image } from '../data/storefront'
import type { Collection, Product, Weight } from './ModulePages'
import PolaroidLineCarousel from "@/components/ui/PolaroidLineCarousel";

type Category = { name: string; image: string; route: string }
type CraftStory = { title: string; caption: string; image: string }
type CartAdd = (product: Product, weight: Weight) => void

type HomePageProps = {
  categories: Category[]
  craftStories: CraftStory[]
  collections: Collection[]
  products: Product[]
  wishlist: number[]
  toggleWishlist: (productId: number) => void
  weights: Record<number, Weight>
  setWeights: Dispatch<SetStateAction<Record<number, Weight>>>
  setActiveProduct: Dispatch<SetStateAction<Product | null>>
  addToCart: CartAdd
  navigate: (path: string) => void
}

export function HomePage({
  categories,
  craftStories,
  collections,
  products,
  wishlist,
  toggleWishlist,
  weights,
  setWeights,
  setActiveProduct,
  addToCart,
  navigate,
}: HomePageProps) {
  // Public assets are referenced from the site root, never with a "public/" prefix.
  const productVideos = [
    '/Video/mysore-pak.mp4',
    '/Video/laddo.mp4',
    '/Video/kajukatli.mp4',
    '/Video/badusha.mp4',
  ] as const
  const [videoQuickView, setVideoQuickView] = useState<Product | null>(null)
  const [modalWeight, setModalWeight] = useState<Weight>('250g')
  const [failedVideos, setFailedVideos] = useState<string[]>([])
  const modalVideoRef = useRef<HTMLVideoElement | null>(null)
  const cardVideoRefs = useRef<Record<number, HTMLVideoElement | null>>({})
  // Keep animation frames and playback control outside React state to avoid rerenders.
  const tiltFrames = useRef(new Map<HTMLElement, number>())
  const visibleVideoIds = useRef(new Set<number>())
  const prefersReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const openProduct = (product: Product) => {
    if (visibleBestSellers.some((item) => item.id === product.id)) {
      setModalWeight(weights[product.id] ?? '250g')
      setVideoQuickView(product)
    } else {
      setActiveProduct(product)
    }
  }

  const bestSellerOrder = ['mysore pak', 'laddu', 'kaju katli', 'badusha']
  const bestSellerProducts = bestSellerOrder
    .map((name) => products.find((product) => product.name.toLowerCase().includes(name)))
    .filter((product): product is Product => Boolean(product))
  const visibleBestSellers = [
    ...bestSellerProducts,
    ...products.filter((product) => !bestSellerProducts.some((item) => item.id === product.id)),
  ].slice(0, 4)
  const sellerIds = visibleBestSellers.map((product) => product.id).join(',')

  // Only decode videos while their cards are on screen and the page is active.
  // The observer itself updates videos; no React setState during scrolling.
  useEffect(() => {
    const videos = Object.values(cardVideoRefs.current).filter(
      (video): video is HTMLVideoElement => Boolean(video)
    )
    const playVisible = (video: HTMLVideoElement) => {
      const id = Number(video.dataset.productId)
      const allowed = visibleVideoIds.current.has(id) && !videoQuickView &&
        !document.hidden && !prefersReducedMotion
      if (!allowed) {
        video.pause()
      } else if (video.paused) {
        void video.play().catch(() => {})
      }
    }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const video = entry.target as HTMLVideoElement
        const id = Number(video.dataset.productId)
        if (entry.isIntersecting) visibleVideoIds.current.add(id)
        else visibleVideoIds.current.delete(id)
        playVisible(video)
      }
    }, { threshold: 0.15, rootMargin: '80px 0px' })
    for (const video of videos) observer.observe(video)
    const updatePlayback = () => videos.forEach(playVisible)
    document.addEventListener('visibilitychange', updatePlayback)
    updatePlayback()
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', updatePlayback)
      videos.forEach((video) => video.pause())
    }
  }, [sellerIds, videoQuickView, prefersReducedMotion])

  useEffect(() => {
    return () => {
      for (const frame of tiltFrames.current.values()) cancelAnimationFrame(frame)
      tiltFrames.current.clear()
    }
  }, [])

  useEffect(() => {
    if (!videoQuickView) return
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setVideoQuickView(null)
    }
    window.addEventListener('keydown', onEscape)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onEscape)
      document.body.style.overflow = previousOverflow
    }
  }, [videoQuickView])

  // Same 3D effect and glare, now capped to one DOM write per animation frame.
  const onTilt = (event: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion) return
    const el = event.currentTarget
    const rect = el.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    const oldFrame = tiltFrames.current.get(el)
    if (oldFrame !== undefined) cancelAnimationFrame(oldFrame)
    tiltFrames.current.set(el, requestAnimationFrame(() => {
      el.style.setProperty('--ry', `${(x - 0.5) * 12}deg`)
      el.style.setProperty('--rx', `${(0.5 - y) * 12}deg`)
      el.style.setProperty('--mx', `${x * 100}%`)
      el.style.setProperty('--my', `${y * 100}%`)
      tiltFrames.current.delete(el)
    }))
  }

  const resetTilt = (event: React.MouseEvent<HTMLElement>) => {
    const el = event.currentTarget
    const oldFrame = tiltFrames.current.get(el)
    if (oldFrame !== undefined) cancelAnimationFrame(oldFrame)
    tiltFrames.current.delete(el)
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
    el.style.setProperty('--mx', '50%')
    el.style.setProperty('--my', '50%')
  }

// change this to try other effects: tilt | spin | shine | overlay | focus (combine with spaces)
const cardEffect = 'tilt shine focus'

  return (
    <>
      <Component />

        <section className="promise-strip" aria-label="Our promise" data-aos="fade-up">
          <div><Leaf size={40} /><span style={{fontSize:12}}>Freshly Made Daily</span></div>
          <span className="promise-separator">✦</span>
          <div><Sparkles size={40} /><span style={{fontSize:12}}>Premium Ingredients</span></div>
          <span className="promise-separator">✦</span>
          <div><PackageCheck size={40} /><span style={{fontSize:12}}>Traditional Recipes</span></div>
          <span className="promise-separator">✦</span>
          <div><Gift size={40} /><span style={{fontSize:12}}  >Elegant Gift Packaging</span></div>
        </section>

        {/* UPDATED SHOP BY CATEGORY JSX */}

<section
  className="section category-section"
  id="categories"
>
  <div
    className="category-heading"
    data-aos="fade-up"
  >
    <span
      className="category-heading-ornament"
      aria-hidden="true"
    >
      ✧
    </span>

    <h2>Shop by Category</h2>
  </div>

  <div data-aos="fade-up" data-aos-delay="80" style={{ maxWidth: '780px', margin: '0 auto' }}>
    <CardCarousel
      images={categories.map(
        ({ image: src, name: title, route }) => ({
          src,
          title,
          route: route === 'gift-boxes' ? route : `sweets/${catalogSlug(title)}`,
        })
      )}
      onSelect={navigate}
    />
  </div>
</section>

       {/* A little care in every step Crafted with Love, Perfected by Tradition. */}

<section
  className="craft-section"
  aria-labelledby="craft-heading"
>
  <div className="craft-heading" data-aos="fade-up">
    <p className="eyebrow">
      <span /> A little care in every step
    </p>

    <h2 id="craft-heading">
      Crafted with Love,
      <br />
      <em>Perfected by Tradition.</em>
    </h2>

    <p>
      Every piece is a reminder that the best things
      are worth making with care.
    </p>
  </div>

  <div className="craft-polaroid" data-aos="fade-up">
    <PolaroidLineCarousel
      slides={craftStories.map((story) => ({
        image: story.image,
        title: story.title,
        caption: story.caption,
        alt: story.title,
      }))}
      height="clamp(440px, 55vw, 620px)"
      cardWidth={270}
      sag={30}
      swing={0.5}
      autoplay={3500}
      string="#b99555"
      ink="#17302e"
      ariaLabel="Our traditional sweet-making process"
    />
  </div>
</section>

{/* best sellers */}

<section className="section bestsellers-section" id="bestsellers">
  <div className="bestsellers-inner">
    <div className="bestsellers-heading" data-aos="fade-up">
      <div className="bestsellers-eyebrow">
        <span className="ornament-line" />
        <span className="ornament-flower">✥</span>
        Our Selection
        <span className="ornament-flower">✥</span>
        <span className="ornament-line" />
      </div>

      <div className="bestsellers-title-row">
        <h2>
          Best <em>Sellers.</em>
        </h2>
        <a
          className="bestsellers-view-all"
          href="/shop-all"
          onClick={(event) => {
            event.preventDefault()
            navigate("shop-all")
          }}
        >
          View all products <ArrowRight size={17} />
        </a>
      </div>

      <p className="bestsellers-note">
        A curated selection of our most popular sweets, loved by our customers for their authentic taste and premium quality.
      </p>
    </div>

    <div
      className={`premium-product-grid ${cardEffect
        .split(' ')
        .map((fx) => `fx-${fx}`)
        .join(' ')}`}
    >
      {visibleBestSellers.map((product, index) => {
        const weight = weights[product.id] ?? "250g"
        const isWishlisted = wishlist.includes(product.id)
        const royalBadges = ['★ Bestseller', '♥ Most Loved', '♛ Premium', '✦ Classic']
        const royalCategories = ['Ghee Sweets', 'Festive Sweets', 'Dry Fruit Sweets', 'Traditional Sweets']
        const displayName = product.name.toLowerCase().includes('laddu') ? 'Laddu' : product.name
        const royalDescriptions = [
          'A melt-in-your-mouth South Indian classic.',
          'Traditional, aromatic laddus perfect for every celebration.',
          'Smooth, rich and delicate cashew delight with a royal touch.',
          'A flaky, juicy sweet with a perfect traditional taste.',
        ]
        const productImage = [
          '/products/mysore-pak.webp',
          '/products/laddu.webp',
          '/products/kaju-katli.webp',
          '/products/badusha.webp',
        ][index]
        const videoSrc = productVideos[index]
        const videoFailed = failedVideos.includes(videoSrc)

        return (
          <article
            className="premium-product-card"
            key={product.id}
            onClick={() => openProduct(product)}
            onMouseMove={onTilt}
            onMouseLeave={resetTilt}
          >
            <div className="premium-card-border">
              <span className="royal-card-crown" aria-hidden="true">✦</span>
              <div className="premium-card-content">
                <div className="premium-image-wrap">
                  <button
                    className="premium-product-image"
                    onClick={(event) => { event.stopPropagation(); openProduct(product) }}
                    aria-label={`View ${product.name} details`}
                  >
                    {videoFailed || prefersReducedMotion ? (
                      <img src={productImage} alt={product.name} loading="lazy" />
                    ) : (
                      <video
                        ref={(node) => { cardVideoRefs.current[product.id] = node }}
                        data-product-id={product.id}
                        src={videoSrc}
                        poster={productImage}
                        aria-label={`${product.name} product video`}
                        muted
                        loop
                        playsInline
                        preload="none"
                        disablePictureInPicture
                        onError={() => setFailedVideos((current) => current.includes(videoSrc) ? current : [...current, videoSrc])}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', aspectRatio: '4 / 3' }}
                      />
                    )}
                  </button>

                  <span className={`premium-product-badge premium-badge-${index}`}>
                    {royalBadges[index]}
                  </span>

                  <button
                    className={`premium-wishlist ${isWishlisted ? "is-active" : ""}`}
                    onClick={(event) => { event.stopPropagation(); toggleWishlist(product.id) }}
                    aria-label={
                      isWishlisted
                        ? `Remove ${product.name} from wishlist`
                        : `Add ${product.name} to wishlist`
                    }
                    aria-pressed={isWishlisted}
                  >
                    <Heart size={19} fill={isWishlisted ? "currentColor" : "none"} />
                  </button>

                  <button
                    className="premium-quick-view"
                    onClick={(event) => { event.stopPropagation(); openProduct(product) }}
                  >
                    Quick view <ArrowRight size={14} />
                  </button>
                </div>

                <div className="premium-product-info">
                  <div className="premium-category">
                    <span />
                    {royalCategories[index]}
                    <span />
                  </div>

                  <button
                    className="premium-product-name"
                    onClick={(event) => { event.stopPropagation(); openProduct(product) }}
                  >
                    {displayName}
                  </button>

                  <p className="premium-description">{royalDescriptions[index]}</p>

                  <div className="premium-purchase">
                    <label className="premium-weight">
                      <span className="sr-only">Choose weight for {product.name}</span>
                      <select
                        value={weight}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) =>
                          setWeights((current) => ({
                            ...current,
                            [product.id]: event.target.value as Weight,
                          }))
                        }
                      >
                        {(["250g", "500g", "1kg"] as const).map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={15} />
                    </label>

                    <span className="premium-price-divider" />

                    <strong className="premium-price">
                      {formatPrice(product.prices[weight])}
                    </strong>
                  </div>

                  <button
                    className="premium-add-button"
                    onClick={(event) => { event.stopPropagation(); addToCart(product, weight) }}
                  >
                    <span className="premium-bag-icon">
                      <ShoppingBag size={17} />
                    </span>
                    Add to bag
                    <Plus size={17} />
                  </button>

                  <div className="premium-bottom-ornament">
                    <span>❁</span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  </div>
</section>


        {/* Premium gifting banner — layout isolated from legacy offer styles */}
        <section className="offer-banner ks-gift-banner" id="gift-offer" data-aos="fade-up">
          <div className="offer-glow offer-glow-one" aria-hidden="true" />
          <div className="offer-glow offer-glow-two" aria-hidden="true" />
          <span className="offer-decor offer-decor-top" aria-hidden="true">✦</span>
          <span className="offer-decor offer-decor-bottom" aria-hidden="true">✧</span>

          <div className="offer-content">
            <p className="offer-kicker">
              <span className="offer-kicker-line" /> THE ART OF GIFTING <span className="offer-kicker-line" />
            </p>
            <span className="offer-ornament" aria-hidden="true"></span>
            <h2>Celebrate every<br /><em>sweet occasion.</em></h2>
            <p className="offer-description">
              Beautifully curated sweets, thoughtfully wrapped and made to turn
              every celebration into a cherished memory.
            </p>
            <div className="offer-actions">
              <a
                href="/gift-boxes"
                className="offer-cta"
                onClick={(event) => { event.preventDefault(); navigate('gift-boxes') }}
              >
                Explore Gift Boxes
                <span className="offer-cta-icon"><ArrowRight size={17} /></span>
              </a>
              <span className="offer-crafted"><span>✦</span> Handcrafted with love</span>
            </div>
          </div>

          <div className="offer-visual">
            <div className="offer-image-frame">
              <img
                src={image('photo-1549465220-1a8b9238cd48', 1000)}
                alt="A thoughtfully wrapped gift ready to give"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="offer-floating-note">
              <span className="offer-note-icon" aria-hidden="true">✦</span>
              <div><strong>A Gift of Sweetness</strong><small>Made for special moments</small></div>
            </div>
            <span className="offer-image-sparkle sparkle-a" aria-hidden="true">✧</span>
            <span className="offer-image-sparkle sparkle-b" aria-hidden="true">✦</span>
          </div>
          <div className="offer-bottom-line" aria-hidden="true" />
        </section>

        <section className="section reasons-section">
          <div className="center-heading" data-aos="fade-up">
            <p className="eyebrow"><span /> The Kanagadhara way <span /></p>
            <h2>Good things, <em>from the heart.</em></h2>
          </div>
          <div className="reasons-grid">
            <article className="reason-card" data-aos="fade-up">
              <span className="reason-icon"><Flower2 size={23} /></span>
              <h3>Freshly made daily</h3>
              <p>Prepared fresh with care for the moments you want to share.</p>
            </article>
            <article className="reason-card" data-aos="fade-up" data-aos-delay="80">
              <span className="reason-icon"><Leaf size={23} /></span>
              <h3>Premium ingredients</h3>
              <p>Ingredients selected carefully for flavour and quality.</p>
            </article>
            <article className="reason-card" data-aos="fade-up" data-aos-delay="160">
              <span className="reason-icon"><Sparkles size={23} /></span>
              <h3>Traditional recipes</h3>
              <p>Familiar recipes that bring the taste of tradition to your table.</p>
            </article>
            <article className="reason-card" data-aos="fade-up" data-aos-delay="240">
              <span className="reason-icon"><Heart size={23} /></span>
              <h3>Elegant gift packaging</h3>
              <p>Thoughtful presentation for gifts and celebrations.</p>
            </article>
          </div>
        </section>

        <section className="section collection-section" id="collections">
          <div className="section-heading" data-aos="fade-up">
            <div>
              <p className="eyebrow"><span /> A box for every kind of joy</p>
              <h2>Celebrate every <em>occasion.</em></h2>
            </div>
            <a className="text-link" href="/gift-boxes" onClick={(event) => { event.preventDefault(); navigate('gift-boxes') }}>Explore gift boxes <ArrowRight size={15} /></a>
          </div>
          <div className="collection-grid">
            {collections.map((collection, index) => (
              <a
                className={`collection-card ${collection.className}`}
                data-aos="fade-up"
                data-aos-delay={index * 90}
                href={collection.link === 'Gift Boxes' ? '/gift-boxes' : collection.link === 'Sweets' ? '/sweets' : '/shop-all'}
                key={collection.title}
                onClick={(event) => {
                  event.preventDefault()
                  navigate(collection.link === 'Gift Boxes' ? 'gift-boxes' : collection.link === 'Sweets' ? 'sweets' : 'shop-all')
                }}
              >
                <img src={collection.image} alt="" loading="lazy" />
                <span className="collection-shade" />
                <span className="collection-copy">
                  <span className="collection-kicker">A little joy, just because</span>
                  <strong>{collection.title}</strong>
                  <span>{collection.subtitle}</span>
                  <span className="collection-link">Explore collection <ArrowRight size={14} /></span>
                </span>
                <span className="collection-corner" aria-hidden="true"><ArrowRight size={18} /></span>
              </a>
            ))}
          </div>
        </section>

        <section className="story-section" id="story">
          <div className="story-image-wrap" data-aos="fade-right">
            <img src={image('photo-1555507036-ab1f4038808a', 1100)} alt="A warm table set for a shared moment" loading="lazy" />
            <span className="story-image-caption">A little sweetness goes a long way</span>
            <div className="story-roundel"><Flower2 size={20} /><span>MADE TO<br />BRING US<br />TOGETHER</span></div>
          </div>
          <div className="story-copy" data-aos="fade-left">
            <p className="eyebrow"><span /> A note from us</p>
            <h2>A legacy of<br /><em>authentic taste.</em></h2>
            <p>
              At Kanagadhara Sweets, every sweet represents the joy of tradition, the warmth of family, and the happiness of sharing.
            </p>
            <p className="story-secondary">
              From festive gatherings to an ordinary afternoon cup of chai, we believe there is always room for one more sweet moment.
            </p>
            <a href="/our-story" onClick={(event) => { event.preventDefault(); navigate('our-story') }} className="button button-outline">Discover our story <ArrowRight size={15} /></a>
            <span className="story-signoff">With sweetness, <em>Kanagadhara</em></span>
          </div>
        </section>

        <section className="community-section" data-aos="fade-up">
          <div className="community-mark"><MessageCircle size={21} /></div>
          <p className="eyebrow"><span /> From our table to yours</p>
          <h2>Some things are just <em>better shared.</em></h2>
          <p>Tag your sweet moments with <strong>#KanagadharaSweets</strong> and let us be a little part of your celebrations.</p>
          <a href="/contact" onClick={(event) => { event.preventDefault(); navigate('contact') }} className="text-link">Get in touch <ArrowRight size={15} /></a>
        </section>

        <section className="newsletter-section" data-aos="fade-up">
         
          <div className="newsletter-copy">
            <p className="eyebrow eyebrow-light"><span /> A little note from us</p>
            <h2>Stay connected<br />with <em>sweetness.</em></h2>
            <p>New arrivals, festive favourites, and little things worth celebrating—straight to your inbox.</p>
          </div>
          <p className="newsletter-fineprint">Newsletter signup is currently unavailable.</p>
        </section>

        {videoQuickView && (() => {
          const index = visibleBestSellers.findIndex((item) => item.id === videoQuickView.id)
          const src = productVideos[index]
          const fallbackImage = ['/products/mysore-pak.webp', '/products/laddu.webp', '/products/kaju-katli.webp', '/products/badusha.webp'][index]
          return (
            <div className="ks-video-modal-backdrop" onMouseDown={(event) => {
              if (event.target === event.currentTarget) setVideoQuickView(null)
            }}>
              <section className="ks-video-modal ks-cinematic-preview" role="dialog" aria-modal="true" aria-label={`${videoQuickView.name} quick view`}>
                <button className="ks-video-modal-close" aria-label="Close quick view" onClick={() => setVideoQuickView(null)}><X size={22} /></button>
                <div className="ks-video-modal-media">
                  {prefersReducedMotion || failedVideos.includes(src) ? (
                    <img src={fallbackImage} alt={videoQuickView.name} />
                  ) : (
                    <video
                      key={src}
                      ref={modalVideoRef}
                      src={src}
                      poster={fallbackImage}
                      autoPlay muted loop playsInline preload="metadata"
                      disablePictureInPicture
                      onError={() => setFailedVideos((current) => current.includes(src) ? current : [...current, src])}
                    />
                  )}
                </div>
                <div className="ks-video-modal-content">
                  <p className="ks-video-modal-category">{['Ghee Sweets', 'Festive Sweets', 'Dry Fruit Sweets', 'Traditional Sweets'][index]}</p>
                  <h2>{videoQuickView.name}</h2>
                  <p>{['A melt-in-your-mouth South Indian classic.', 'Traditional, aromatic laddus perfect for every celebration.', 'Smooth, rich and delicate cashew delight with a royal touch.', 'A flaky, juicy sweet with a perfect traditional taste.'][index]}</p>
                  <div className="ks-video-modal-sizes" aria-label="Choose weight">
                    {(['250g', '500g', '1kg'] as const).map((weight) => (
                      <button key={weight} type="button" aria-pressed={modalWeight === weight} className={modalWeight === weight ? 'active' : ''} onClick={() => setModalWeight(weight)}>{weight}</button>
                    ))}
                  </div>
                  <strong className="ks-video-modal-price">{formatPrice(videoQuickView.prices[modalWeight])}</strong>
                  <button className="ks-video-modal-add" onClick={() => { addToCart(videoQuickView, modalWeight); setVideoQuickView(null) }}>
                    <ShoppingBag size={18} /> Add to bag
                  </button>
                </div>
              </section>
            </div>
          )
        })()}
    </>
  )
}
