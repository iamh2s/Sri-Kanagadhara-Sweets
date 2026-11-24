import { memo, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { ArrowRight, Heart, Plus } from 'lucide-react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'

import { matchesProduct, ProductSearch } from '../components/ProductSearch'
import { catalogSlug } from '../../shared/catalogSlug'
import {
  categories,
  enquirySweets,
  formatPrice,
  shopLinks,
} from '../data/storefront'

import type { ModulePagesProps, Product, Weight } from './ModulePages'
import './ProductPage.css'

const WEIGHT_OPTIONS = ['250g', '500g', '1kg'] as const

type ProductTileProps = {
  product: Product
  weight: Weight
  index: number
  onWeightChange: (productId: number, weight: Weight) => void
  onAddToCart: (product: Product, weight: Weight) => void
  isWishlisted: boolean
  onToggleWishlist: (productId: number) => void
}

// Share one observer for all product cards instead of one per card.
let cardObserver: IntersectionObserver | undefined
const revealCallbacks = new Map<Element, () => void>()

function observeCard(element: HTMLElement, reveal: () => void) {
  if (typeof IntersectionObserver === 'undefined') {
    reveal()
    return () => {}
  }
  cardObserver ??= new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      const callback = revealCallbacks.get(entry.target)
      cardObserver?.unobserve(entry.target)
      revealCallbacks.delete(entry.target)
      callback?.()
    }
  }, { threshold: 0.01, rootMargin: '100px 0px' })
  revealCallbacks.set(element, reveal)
  cardObserver.observe(element)
  return () => {
    cardObserver?.unobserve(element)
    revealCallbacks.delete(element)
  }
}

const ProductTile = memo(function ProductTile({
  product,
  weight,
  index,
  onWeightChange,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}: ProductTileProps) {
  const cardRef = useRef<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = cardRef.current

    if (!element) return

    return observeCard(element, () => setIsVisible(true))
  }, [])

  const animationStyle = {
    '--card-index': index % 3,
  } as CSSProperties

  return (
    <article
      ref={cardRef}
      className={`module-product cinematic-card module-product-reveal${
        isVisible ? ' is-visible' : ''
      }`}
      style={animationStyle}
    >
      {/* Product image */}
      <Link
        className="module-product-photo"
        to={`/products/${catalogSlug(product.name)}`}
        aria-label={`View ${product.name}`}
      >
        <img
          src={product.image}
          alt={product.name}
          loading={index < 3 ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={index === 0 ? "high" : "auto"}
        />

        <span className="cinematic-curtain cinematic-curtain-left" aria-hidden="true" />
        <span className="cinematic-curtain cinematic-curtain-right" aria-hidden="true" />

        <span className="module-product-view">
          Discover this favourite
          <ArrowRight size={14} />
        </span>

        {product.badge && (
          <span className="product-badge">
            {product.badge}
          </span>
        )}
      </Link>

      {/* Wishlist */}
      <button
        type="button"
        className={`module-product-wishlist${
          isWishlisted ? ' is-wishlisted' : ''
        }`}
        onClick={() => onToggleWishlist(product.id)}
        aria-label={
          isWishlisted
            ? `Remove ${product.name} from wishlist`
            : `Add ${product.name} to wishlist`
        }
        aria-pressed={isWishlisted}
      >
        <Heart
          size={16}
          fill={isWishlisted ? 'currentColor' : 'none'}
        />
      </button>

      {/* Product details */}
      <div className="module-product-details">
        <p className="module-product-category cinematic-category">
          {product.category}
        </p>

        <Link
          className="module-product-name cinematic-title"
          to={`/products/${catalogSlug(product.name)}`}
        >
          {product.name.split(' ').map((word, wordIndex) => (
            <span
              className="cinematic-word"
              key={`${word}-${wordIndex}`}
              style={
                {
                  '--word-index': wordIndex,
                } as CSSProperties
              }
            >
              {word}{' '}
            </span>
          ))}
        </Link>

        <p className="module-product-description cinematic-description">
          {product.description}
        </p>

        {/* Weight and price */}
        <div className="module-product-buy cinematic-buy">
          <label>
            <span className="sr-only">
              Choose weight for {product.name}
            </span>

            <select
              value={weight}
              onChange={(event) =>
                onWeightChange(
                  product.id,
                  event.target.value as Weight,
                )
              }
            >
              {WEIGHT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <strong
            key={weight}
            className="cinematic-price"
          >
            {formatPrice(product.prices[weight])}
          </strong>
        </div>

        {/* Add to bag */}
        <button
          type="button"
          className="module-add-button cinematic-add"
          onClick={() => onAddToCart(product, weight)}
        >
          <span>ADD TO BAG</span>
          <Plus size={14} />
        </button>
      </div>
    </article>
  )
})

export function ProductPage({
  page,
  products,
  weights,
  onWeightChange,
  onAddToCart,
  wishlist,
  onToggleWishlist,
  catalogSearch,
  onNavigate,
  wishlistOnly,
}: ModulePagesProps) {
  const location = useLocation()
  const [params, setParams] = useSearchParams()

  /*
   * TRADITIONAL LOADER SYNCHRONIZATION
   */
  const [pageReady, setPageReady] = useState(() => {
    if (typeof document === 'undefined') return true

    return document.documentElement.dataset.pageReady !== 'false'
  })

  useEffect(() => {
    const handleLoaderStart = () => setPageReady(false)
    const handleLoaderComplete = () => setPageReady(true)

    window.addEventListener('site:loader-start', handleLoaderStart)
    window.addEventListener('site:loader-complete', handleLoaderComplete)

    return () => {
      window.removeEventListener('site:loader-start', handleLoaderStart)
      window.removeEventListener('site:loader-complete', handleLoaderComplete)
    }
  }, [])

  /*
   * SEARCH
   */
  const searchTerm = (
    catalogSearch || (params.get('q') ?? '')
  ).trim()

  const query = searchTerm.toLowerCase()

  /*
   * ACTIVE CATEGORY
   */
  const currentPath = location.pathname.replace(/\/+$/, '')

  const activeCategory = categories.find(
    (item) =>
      currentPath === `/sweets/${catalogSlug(item.name)}`,
  )

  /*
   * SORTING
   */
  const sort = params.get('sort') || 'featured'

  /*
   * COLLECTION FILTERING
   */
  const wishlistSet = useMemo(() => new Set(wishlist), [wishlist])
  const collectionProducts = useMemo(() => products.filter((product) => {
    const matchesPage =
      page === 'shop-all' ||
      (
        page === 'sweets' &&
        product.category.toLowerCase().includes('sweet')
      ) ||
      (
        page === 'savouries' &&
        (
          product.category === 'Savouries' ||
          product.category === 'Traditional Snacks'
        )
      )

    return (
      matchesPage &&
      (!wishlistOnly || wishlistSet.has(product.id))
    )
  }), [products, page, wishlistOnly, wishlistSet])

  /*
   * PRODUCT SEARCH FILTER
   */
  const matchingProducts = useMemo(() => collectionProducts.filter(
    (product) => matchesProduct(product, query),
  ), [collectionProducts, query])

  /*
   * ENQUIRY SWEETS
   */
  const collectionEnquiries = useMemo(() =>
    !wishlistOnly && (page === 'shop-all' || page === 'sweets')
      ? enquirySweets.filter(
          (sweet) =>
            !activeCategory ||
            sweet.category === activeCategory.name,
        )
      : [], [wishlistOnly, page, activeCategory])

  const filteredEnquiries = useMemo(() => collectionEnquiries.filter(
    (sweet) => matchesProduct(sweet, query),
  ), [collectionEnquiries, query])

  const filteredProducts = useMemo(() => {
    if (sort !== 'price-low' && sort !== 'price-high') return matchingProducts
    const direction = sort === 'price-low' ? 1 : -1
    return [...matchingProducts].sort((a, b) => direction * (
      a.prices[weights[a.id] ?? '250g'] - b.prices[weights[b.id] ?? '250g']
    ))
  }, [matchingProducts, sort, weights])
  const resultCount = filteredProducts.length + filteredEnquiries.length

  /*
   * PAGE TITLE
   */
  const title =
    activeCategory?.name ??
    (
      page === 'sweets'
        ? 'A heritage of sweetness'
        : page === 'savouries'
          ? 'The perfect chai-time companions'
          : 'Shop all'
    )

  /*
   * UPDATE URL FILTERS
   */
  function updateFilter(key: 'q' | 'sort', value: string) {
    const next = new URLSearchParams(params)

    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }

    setParams(next, {
      replace: true,
      state: { preserveCatalogScroll: true },
    })
  }

  return (
    <div id="module-content" className="shop-listing">
      {/* HEADING AND SEARCH */}
      <section className="shop-heading module-content-wrap">
        <h2 id="catalog" tabIndex={-1}>
          {wishlistOnly ? 'Your wishlist' : title}
        </h2>

        <ProductSearch
          key={`${location.pathname}:${searchTerm}`}
          products={collectionProducts}
          enquiries={collectionEnquiries}
          initialQuery={searchTerm}
          label="Search this collection"
          onSearch={(value) => updateFilter('q', value)}
          onNavigate={onNavigate}
        />
      </section>

      {/* CATEGORY NAVIGATION */}
      <nav
        className="shop-collections module-content-wrap"
        aria-label="Shop categories"
      >
        {shopLinks.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            aria-current={
              !wishlistOnly &&
              currentPath === link.href
                .split('#')[0]
                .replace(/\/+$/, '')
                ? 'page'
                : undefined
            }
          >
            <img
              src={
                categories.find(
                  (category) => category.name === link.label,
                )?.image ?? '/brand/indian-sweets-hero.webp'
              }
              alt=""
              loading="lazy"
              decoding="async"
              width={44}
              height={44}
            />

            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      {/* SORTING AND RESULT COUNT */}
      <div className="shop-toolbar module-content-wrap">
        <div className="shop-result-summary">
          <span role="status">
            {resultCount}{' '}
            {resultCount === 1 ? 'product' : 'products'}
            {query && ` matching “${searchTerm}”`}
          </span>

          {query && (
            <button
              type="button"
              onClick={() => updateFilter('q', '')}
            >
              Clear search
            </button>
          )}
        </div>

        <label className="shop-sort">
          Sort by

          <select
            value={sort}
            onChange={(event) =>
              updateFilter(
                'sort',
                event.target.value === 'featured'
                  ? ''
                  : event.target.value,
              )
            }
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </label>
      </div>

      {/* EMPTY STATE */}
      {resultCount === 0 && (
        <div className="shop-empty module-content-wrap">
          <h3>
            {query
              ? 'No matching products'
              : wishlistOnly
                ? 'Your wishlist is empty'
                : 'This collection is empty'}
          </h3>

          <p>
            {query
              ? 'Try a different product name or a broader search.'
              : wishlistOnly
                ? 'Tap the heart on a product to save it here.'
                : 'Browse the other collections to find a favourite.'}
          </p>

          <Link to="/shop-all#catalog">
            Browse all products
            <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {/* PRODUCT GRID */}
      {filteredProducts.length > 0 && (
        <section
          className={`module-products-grid module-content-wrap${
            pageReady ? ' cinematic-ready' : ''
          }`}
          aria-label="Products"
        >
          {filteredProducts.map((product, index) => (
            <ProductTile
              key={product.id}
              product={product}
              weight={weights[product.id] ?? '250g'}
              index={index}
              onWeightChange={onWeightChange}
              onAddToCart={onAddToCart}
              isWishlisted={wishlistSet.has(product.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </section>
      )}


    </div>
  )
}
