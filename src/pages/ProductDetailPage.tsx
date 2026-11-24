
import './ProductDetailPage.css'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../data/storefront'
import type { Product, Weight } from './ModulePages'

const SIZES = ['250g', '500g', '1kg'] as const

type Props = {
  product: Product
  weight: Weight
  onWeightChange: (weight: Weight) => void
  onAdd: () => void
}

export function ProductDetailPage({
  product,
  weight,
  onWeightChange,
  onAdd,
}: Props) {
  const [justAdded, setJustAdded] = useState(false)

  useEffect(() => {
    const previousTitle = document.title

    document.title = `${product.name} | Sri Kanagadhara Sweets`

    return () => {
      document.title = previousTitle
    }
  }, [product.name])

  useEffect(() => {
    if (!justAdded) return

    const timer = window.setTimeout(() => {
      setJustAdded(false)
    }, 1400)

    return () => window.clearTimeout(timer)
  }, [justAdded])

  const handleAdd = () => {
    onAdd()
    setJustAdded(true)
  }

  return (
    <article className="product-detail-page module-content-wrap">

      {/* Back navigation */}
      <Link
        className="text-link back-link"
        to="/shop-all#catalog"
      >
        <span aria-hidden="true">←</span>
        Back to all products
      </Link>

      {/* Main product section */}
      <div
        className="product-detail-layout"
        key={product.name}
      >

        {/* Cinematic product image */}
        <div className="product-image-frame">
          <img
            key={product.image}
            src={product.image}
            alt={product.name}
          />
        </div>

        {/* Product details */}
        <section className="modal-product-copy">

          {/* Animated category */}
          <p className="product-category">
            {product.category}
          </p>

          {/* Word-by-word animated title */}
          <h1 aria-label={product.name}>
            {product.name.split(/\s+/).map((word, index) => (
              <span
                key={`${word}-${index}`}
                className="word"
                style={{
                  '--w': index,
                } as React.CSSProperties}
                aria-hidden="true"
              >
                {word}{' '}
              </span>
            ))}
          </h1>

          {/* Animated description */}
          <p className="product-description">
            {product.description}
          </p>

          {/* Weight selector */}
          <fieldset>
            <legend>Choose your size</legend>

            <div className="modal-weights">
              {SIZES.map((size, index) => (
                <button
                  key={size}
                  type="button"
                  aria-pressed={weight === size}
                  className={
                    weight === size ? 'selected' : ''
                  }
                  onClick={() => onWeightChange(size)}
                  style={{
                    '--weight-index': index,
                  } as React.CSSProperties}
                >
                  {size}

                  <span>
                    {formatPrice(product.prices[size])}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          {/* Add to bag */}
          <button
            type="button"
            className={`button button-primary modal-add${
              justAdded ? ' is-added' : ''
            }`}
            onClick={handleAdd}
          >
            {justAdded ? (
              <>
                Added to bag <span aria-hidden="true">✓</span>
              </>
            ) : (
              <>
                Add to bag &middot;{' '}
                <span key={weight} className="price-pop">
                  {formatPrice(product.prices[weight])}
                </span>
              </>
            )}
          </button>

          {/* Screen reader announcement */}
          <span className="sr-only" aria-live="polite">
            {justAdded
              ? `${product.name} added to bag`
              : ''}
          </span>

        </section>
      </div>

      {/* Product information accordion */}
      <section
        className="product-information"
        aria-label="Product information"
      >

        <details>
          <summary>
            Ingredients, allergens and shelf life
          </summary>

          <div className="details-body">
            <p>
              Verified label information is pending for this
              product. Please confirm dietary requirements
              with the shop before ordering.
            </p>

            <Link className="text-link" to="/contact">
              Contact the shop
            </Link>
          </div>
        </details>

        <details>
          <summary>
            Delivery and returns
          </summary>

          <div className="details-body">
            <p>
              Availability and delivery charges depend on
              the destination.
            </p>

            <Link className="text-link" to="/shipping">
              Delivery information
            </Link>
          </div>
        </details>

        <details>
          <summary>
            Customer reviews
          </summary>

          <div className="details-body">
            <p>
              No approved reviews for this product yet.
            </p>
          </div>
        </details>

      </section>
    </article>
  )
}
