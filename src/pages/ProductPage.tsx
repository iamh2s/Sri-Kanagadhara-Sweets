import { ArrowRight, Heart, Plus } from 'lucide-react'
import { matchesProduct, ProductSearch } from '../components/ProductSearch'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { catalogSlug } from '../../shared/catalogSlug'
import { categories, enquirySweets, formatPrice, shopLinks } from '../data/storefront'
import { storePhoneHref } from '../data/storeContact'
import type { ModulePagesProps, Product, Weight } from './ModulePages'
import './ProductPage.css'

function ProductTile({
  product,
  weight,
  onWeightChange,
  onAddToCart,
  onViewProduct,
  isWishlisted,
  onToggleWishlist,
}: {
  product: Product
  weight: Weight
  onWeightChange: (productId: number, weight: Weight) => void
  onAddToCart: (product: Product, weight: Weight) => void
  onViewProduct: (product: Product) => void
  isWishlisted: boolean
  onToggleWishlist: (productId: number) => void
}) {
  return (
    <article className="module-product">
      <button className="module-product-photo" onClick={() => onViewProduct(product)} aria-label={`View ${product.name}`}>
        <img src={product.image} alt={product.name} loading="lazy" />
        <span className="module-product-view">Discover this favourite <ArrowRight size={14} /></span>
        {product.badge && <span className="product-badge">{product.badge}</span>}
      </button>
      <button
        className={`module-product-wishlist${isWishlisted ? ' is-wishlisted' : ''}`}
        onClick={() => onToggleWishlist(product.id)}
        aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        aria-pressed={isWishlisted}
      >
        <Heart size={17} fill={isWishlisted ? 'currentColor' : 'none'} />
      </button>
      <div className="module-product-details">
        <p className="module-product-category">{product.category}</p>
        <Link className="module-product-name" to={`/products/${catalogSlug(product.name)}`}>{product.name}</Link>
        <p className="module-product-description">{product.description}</p>
        <div className="module-product-buy">
          <label>
            <span className="sr-only">Choose weight for {product.name}</span>
            <select value={weight} onChange={(event) => onWeightChange(product.id, event.target.value as Weight)}>
              {(['250g', '500g', '1kg'] as const).map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <strong>{formatPrice(product.prices[weight])}</strong>
        </div>
        <button className="module-add-button" onClick={() => onAddToCart(product, weight)}>
          ADD TO BAG <Plus size={15} />
        </button>
      </div>
    </article>
  )
}

export function ProductPage({
  page,
  products,
  weights,
  onWeightChange,
  onAddToCart,
  onViewProduct,
  wishlist,
  onToggleWishlist,
  catalogSearch,
  onNavigate,
  wishlistOnly,
}: ModulePagesProps) {
  const location = useLocation()
  const [params, setParams] = useSearchParams()
  const searchTerm = catalogSearch || (params.get('q') ?? '').trim()
  const query = searchTerm.toLowerCase()
  const activeCategory = categories.find(item => location.pathname.replace(/\/+$/, '') === '/sweets/' + catalogSlug(item.name))
  const sort = params.get('sort') || 'featured'
  const collectionProducts = products.filter((product) => {
    const matchesPage =
      page === 'shop-all' ||
      (page === 'sweets' && product.category.toLowerCase().includes('sweet')) ||
      (page === 'savouries' && (product.category === 'Savouries' || product.category === 'Traditional Snacks'))
    return matchesPage && (!wishlistOnly || wishlist.includes(product.id))
  })
  const filteredProducts = collectionProducts.filter(product => matchesProduct(product, query))
  const collectionEnquiries = !wishlistOnly && (page === 'shop-all' || page === 'sweets')
    ? enquirySweets.filter(sweet => !activeCategory || sweet.category === activeCategory.name)
    : []
  const filteredEnquiries = collectionEnquiries.filter(sweet => matchesProduct(sweet, query))
  const resultCount = filteredProducts.length + filteredEnquiries.length
  if (sort === 'price-low' || sort === 'price-high') {
    const direction = sort === 'price-low' ? 1 : -1
    filteredProducts.sort((a, b) => direction * (a.prices[weights[a.id] ?? '250g'] - b.prices[weights[b.id] ?? '250g']))
  }
  const title = activeCategory?.name ?? (page === 'sweets'
    ? 'A heritage of sweetness'
    : page === 'savouries'
      ? 'The perfect chai-time companions'
      : 'Shop all')

  function updateFilter(key: 'q' | 'sort', value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true, state: { preserveCatalogScroll: true } })
  }

  return (
    <div id="module-content" className="shop-listing">
      <section className="shop-heading module-content-wrap">
        <h2 id="catalog" tabIndex={-1}>
          {wishlistOnly ? 'Your wishlist' : title}
        </h2>
        <ProductSearch key={`${location.pathname}:${searchTerm}`} products={collectionProducts} enquiries={collectionEnquiries}
          initialQuery={searchTerm} label="Search this collection"
          onSearch={value => updateFilter('q', value)} onNavigate={onNavigate} />
      </section>
      <nav className="shop-collections module-content-wrap" aria-label="Shop categories">
        {shopLinks.map(link => (
          <Link key={link.href} to={link.href}
            aria-current={!wishlistOnly && location.pathname.replace(/\/+$/, '') === link.href.split('#')[0] ? 'page' : undefined}>
            <img src={categories.find(category => category.name === link.label)?.image ?? '/brand/indian-sweets-hero.webp'} alt="" loading="lazy" />
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
      <div className="shop-toolbar module-content-wrap">
        <div className="shop-result-summary"><span role="status">{resultCount} {resultCount === 1 ? 'product' : 'products'}{query && ` matching “${searchTerm}”`}</span>
          {query && <button onClick={() => updateFilter('q', '')}>Clear search</button>}
        </div>
        <label>Sort by <select value={sort} onChange={event => updateFilter('sort', event.target.value === 'featured' ? '' : event.target.value)}>
          <option value="featured">Featured</option><option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
        </select></label>
      </div>
      {resultCount === 0 && (
        <div className="shop-empty module-content-wrap">
          <h3>{query ? 'No matching products' : wishlistOnly ? 'Your wishlist is empty' : 'This collection is empty'}</h3>
          <p>{query ? 'Try a different product name or a broader search.' : wishlistOnly ? 'Tap the heart on a product to save it here.' : 'Browse the other collections to find a favourite.'}</p>
          <Link to="/shop-all#catalog">Browse all products <ArrowRight size={16} /></Link>
        </div>
      )}
      {filteredProducts.length > 0 && <section className="module-products-grid module-content-wrap" aria-label="Products">
        {filteredProducts.map((product, index) => (
          <div className="module-product-reveal" key={product.id} data-aos="fade-up" data-aos-delay={index * 70}>
            <ProductTile
              product={product}
              weight={weights[product.id] ?? '250g'}
              onWeightChange={onWeightChange}
              onAddToCart={onAddToCart}
              onViewProduct={onViewProduct}
              isWishlisted={wishlist.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
            />
          </div>
        ))}
      </section>}
      {filteredEnquiries.length > 0 && <section className="shop-enquiries module-content-wrap" aria-labelledby="enquiry-sweets-heading">
        <h2 id="enquiry-sweets-heading">Sweets by enquiry</h2>
        <p>Call the shop for prices, sizes and availability.</p>
        <ul>{filteredEnquiries.map(sweet => <li key={sweet.name}>
          <span>{sweet.name}</span><a href={storePhoneHref} aria-label={`Call about ${sweet.name}`}>Call the shop</a>
        </li>)}</ul>
      </section>}
    </div>
  )
}
