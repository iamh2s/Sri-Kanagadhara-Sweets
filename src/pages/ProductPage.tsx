import { ArrowRight, Heart, Plus, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../data/storefront'
import type { ModulePagesProps, Product, Weight } from './ModulePages'

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
        <button className="module-product-name" onClick={() => onViewProduct(product)}>{product.name}</button>
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
  wishlistOnly,
}: ModulePagesProps) {
  const query = catalogSearch.toLowerCase()
  const filteredProducts = products.filter((product) => {
    const matchesPage =
      page === 'shop-all' ||
      (page === 'sweets' && product.category.toLowerCase().includes('sweet')) ||
      (page === 'savouries' && (product.category === 'Savouries' || product.category === 'Traditional Snacks'))
    const matchesQuery = !query || `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(query)
    return matchesPage && matchesQuery && (!wishlistOnly || wishlist.includes(product.id))
  })
  const title = page === 'sweets'
    ? 'A heritage of sweetness'
    : page === 'savouries'
      ? 'The perfect chai-time companions'
      : 'Find your next favourite'
  const description = page === 'sweets'
    ? 'Slow-made classics, familiar festive flavours, and little treats for an ordinary Tuesday.'
    : page === 'savouries'
      ? 'Crisp, savoury, and always better when the kettle is on.'
      : 'Made fresh, packed with care, and ready to make a moment of its own.'

  return (
    <div id="module-content">
      <section className="module-intro module-content-wrap" data-aos="fade-up">
        <p className="module-kicker module-kicker-dark"><span /> FRESH FROM OUR KITCHEN <span /></p>
        <h2 id="catalog" tabIndex={-1}>
          {wishlistOnly ? 'Your wishlist' : catalogSearch ? 'Search results' : title}<em>.</em>
        </h2>
        <p>{catalogSearch ? `Results for “${catalogSearch}”` : wishlistOnly ? 'The sweets and savouries you’ve saved.' : description}</p>
        {(catalogSearch || wishlistOnly) && (
          <Link className="text-link" to="/shop-all#catalog">View all products <ArrowRight size={15} /></Link>
        )}
      </section>
      {filteredProducts.length === 0 && (
        <p className="empty-products module-content-wrap">
          {wishlistOnly ? 'Your wishlist is empty.' : 'No products match your search.'}
        </p>
      )}
      <section className="module-products-grid module-content-wrap" aria-label="Products">
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
      </section>
      {page !== 'shop-all' && (
        <section className="module-quote-band" data-aos="fade-up">
          <Sparkles size={24} />
          <p>“A familiar flavour can make anywhere feel like home.”</p>
          <span>THE KANAGADHARA WAY</span>
        </section>
      )}
    </div>
  )
}
