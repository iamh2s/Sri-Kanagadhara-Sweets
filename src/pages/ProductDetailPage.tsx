import './ProductDetailPage.css'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../data/storefront'
import type { Product, Weight } from './ModulePages'

type Props = {
  product: Product
  weight: Weight
  onWeightChange: (weight: Weight) => void
  onAdd: () => void
}

export function ProductDetailPage({ product, weight, onWeightChange, onAdd }: Props) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = product.name + ' | Sri Kanagadhara Sweets'
    return () => { document.title = previousTitle }
  }, [product.name])

  return (
    <article className="product-detail-page module-content-wrap">
      <Link className="text-link" to="/shop-all#catalog">Back to all products</Link>
      <div className="product-detail-layout">
        <img src={product.image} alt={product.name} />
        <section className="modal-product-copy">
          <p className="product-category">{product.category}</p>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <fieldset>
            <legend>Choose your size</legend>
            <div className="modal-weights">
              {(['250g', '500g', '1kg'] as const).map(size => (
                <button key={size} aria-pressed={weight === size} className={weight === size ? 'selected' : ''}
                  onClick={() => onWeightChange(size)}>
                  {size}<span>{formatPrice(product.prices[size])}</span>
                </button>
              ))}
            </div>
          </fieldset>
          <button className="button button-primary modal-add" onClick={onAdd}>
            Add to bag &middot; {formatPrice(product.prices[weight])}
          </button>
        </section>
      </div>
      <section className="product-information" aria-label="Product information">
        <details><summary>Ingredients, allergens and shelf life</summary>
          <p>Verified label information is pending for this product. Please confirm dietary requirements with the shop before ordering.</p>
          <Link className="text-link" to="/contact">Contact the shop</Link>
        </details>
        <details><summary>Delivery and returns</summary>
          <p>Availability and delivery charges depend on the destination.</p>
          <Link className="text-link" to="/shipping">Delivery information</Link>
        </details>
        <details><summary>Customer reviews</summary><p>No approved reviews for this product yet.</p></details>
      </section>
    </article>
  )
}
