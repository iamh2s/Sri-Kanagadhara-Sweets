import { type Dispatch, type SetStateAction } from 'react'
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
} from 'lucide-react'
import Component from '@/components/ui/landing-page'
import CardCarousel from '@/components/ui/card-carousel'
import { formatPrice, image } from '../data/storefront'
import type { Collection, Product, Weight } from './ModulePages'

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
          route,
        })
      )}
      onSelect={navigate}
    />
  </div>
</section>

        <section className="craft-section" aria-labelledby="craft-heading">
        <div className="craft-heading" data-aos="fade-up">
          <p className="eyebrow"><span /> A little care in every step</p>
          <h2 id="craft-heading">Crafted with Love,<br /><em>Perfected by Tradition.</em></h2>
          <p>Every piece is a reminder that the best things are worth making with care.</p>
        </div>
        <div className="craft-grid">
          {craftStories.map((story, index) => (
            <article className="craft-card" data-aos="fade-up" data-aos-delay={index * 120} key={story.title}>
              <div className="craft-image">
                <img src={story.image} alt={story.title} loading="lazy" />
                <span className="craft-image-index">0{index + 1}</span>
                <span className="craft-image-label">MADE BY HAND</span>
              </div>
              <div className="craft-card-copy">
                <p>{story.caption}</p>
                <h3>{story.title}</h3>
              </div>
            </article>
          ))}
        </div>
        </section>

        <section className="section bestsellers-section" id="bestsellers">
        <div className="section-heading" data-aos="fade-up">
          <div>
            <p className="eyebrow"><span /> Demo catalogue</p>
            <h2>Our <em>selection.</em></h2>
          </div>
            <a className="text-link" href="/shop-all" onClick={(event) => { event.preventDefault(); navigate('shop-all') }}>
              View all products <ArrowRight size={15} />
            </a>
          </div>
          <p className="catalog-note" data-aos="fade-up">Demo catalogue and indicative prices — confirm products, availability, and pricing before launch.</p>
            <div className="product-grid">
              {products.map((product) => {
                const weight = weights[product.id] ?? '250g'
                const isWishlisted = wishlist.includes(product.id)
                return (
                  <article className="product-card" key={product.id} data-aos="fade-up" data-aos-delay={(product.id % 4) * 70}>
                    <button className="product-image" onClick={() => setActiveProduct(product)} aria-label={`View ${product.name} details`}>
                      <img src={product.image} alt={product.name} loading="lazy" />
                      {product.badge && <span className="product-badge">{product.badge}</span>}
                      <span className="quick-view">Quick view <ArrowRight size={13} /></span>
                    </button>
                    <button
                      className={`product-wishlist${isWishlisted ? ' wishlisted' : ''}`}
                      onClick={() => toggleWishlist(product.id)}
                      aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                      aria-pressed={isWishlisted}
                    >
                      <Heart size={17} fill={isWishlisted ? 'currentColor' : 'none'} />
                    </button>
                    <div className="product-info">
                      <span className="product-category">{product.category}</span>
                      <button className="product-name" onClick={() => setActiveProduct(product)}>{product.name}</button>
                      <p className="product-description">{product.description}</p>
                      <div className="product-purchase">
                        <label className="weight-select">
                          <span className="sr-only">Choose weight for {product.name}</span>
                          <select
                            value={weight}
                            onChange={(event) =>
                              setWeights((current) => ({
                                ...current,
                                [product.id]: event.target.value as Weight,
                              }))
                            }
                          >
                            {(['250g', '500g', '1kg'] as const).map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                          <ChevronDown size={13} aria-hidden="true" />
                        </label>
                        <strong className="product-price">{formatPrice(product.prices[weight])}</strong>
                      </div>
                      <button className="add-button" onClick={() => addToCart(product, weight)}>
                        Add to bag <Plus size={15} />
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
        </section>

        <section className="offer-banner" data-aos="fade-up">
          <div className="offer-ornament" aria-hidden="true">✳</div>
          <div className="offer-content">
            <p className="eyebrow eyebrow-light"><span /> A reason to celebrate</p>
            <h2>Celebrate every<br /><em>occasion with sweetness.</em></h2>
            <p>Find a little something for the people who make every day special.</p>
            <a href="/gift-boxes" onClick={(event) => { event.preventDefault(); navigate('gift-boxes') }} className="button button-light">Explore gift boxes <ArrowRight size={15} /></a>
          </div>
          <div className="offer-image">
            <img src={image('photo-1549465220-1a8b9238cd48', 1000)} alt="A thoughtfully wrapped gift ready to give" loading="lazy" />
            <span className="offer-image-note">A sweet way<br />to say it all</span>
          </div>
          <span className="offer-corner" aria-hidden="true">✦</span>
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
          <div className="newsletter-decoration" aria-hidden="true">✳</div>
          <div className="newsletter-copy">
            <p className="eyebrow eyebrow-light"><span /> A little note from us</p>
            <h2>Stay connected<br />with <em>sweetness.</em></h2>
            <p>New arrivals, festive favourites, and little things worth celebrating—straight to your inbox.</p>
          </div>
          <p className="newsletter-fineprint">Newsletter signup is currently unavailable.</p>
        </section>
    </>
  )
}
