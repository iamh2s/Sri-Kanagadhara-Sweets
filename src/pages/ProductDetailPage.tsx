import './ProductDetailPage.css'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, ChevronRight, PackageCheck, ShoppingBag, Truck, Info, MessageCircle, ZoomIn, X } from 'lucide-react'
import { formatPrice } from '../data/storefront'
import type { Product, Weight } from './ModulePages'

const SIZES = ['250g', '500g', '1kg'] as const

type Props = {
  product: Product
  weight: Weight
  onWeightChange: (weight: Weight) => void
  onAdd: () => void
}

export function ProductDetailPage(props: Props) {
  return <ProductDetails key={props.product.name} {...props} />
}

function ProductDetails({ product, weight, onWeightChange, onAdd }: Props) {
  const [justAdded, setJustAdded] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  const zoomDialog = useRef<HTMLDialogElement>(null)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  function handleAdd() {
    onAdd()
    setJustAdded(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setJustAdded(false), 1400)
  }

  return (
    <article className="product-detail-page module-content-wrap">
      <nav className="pd-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link><ChevronRight size={14} />
        <Link to="/shop-all#catalog">Shop all</Link><ChevronRight size={14} />
        <span aria-current="page">{product.name}</span>
      </nav>
      <Link className="pd-back" to="/shop-all#catalog"><ArrowLeft size={17} /> Back to all products</Link>
      <div className="product-detail-layout">
        <div className="pd-gallery">
          <div className="product-image-frame">
            <img src={product.image} alt={product.name} loading="eager" fetchPriority="high" decoding="async" />
            {product.badge && <span className="pd-badge">{product.badge}</span>}
            <button className="pd-zoom" type="button" aria-label="Enlarge product image" onClick={() => zoomDialog.current?.showModal()}><ZoomIn size={21} /></button>
          </div>
          <div className="pd-gallery-caption"><span>✦</span> Sri Kanagadhara Sweets <span>✦</span></div>
        </div>
        <section className="modal-product-copy">
          <p className="product-category"><span aria-hidden="true">✦</span> {product.category}</p>
          <h1 aria-label={product.name}>{product.name.split(/\s+/).map((word, index) => <span key={`${word}-${index}`} className="word" style={{ '--w': Math.min(index, 5) } as CSSProperties} aria-hidden="true">{word}{' '}</span>)}</h1>
          <p className="product-description">{product.description}</p>
          <div className="pd-price-panel">
            <span className="pd-price-label">Selected pack price</span>
            <div className="pd-price-row"><strong key={weight} className="price-pop">{formatPrice(product.prices[weight])}</strong><span>/ {weight}</span></div>
          </div>
          <fieldset>
            <legend>Choose your size <span>Net weight</span></legend>
            <div className="modal-weights">
              {SIZES.map(size => <button key={size} type="button" aria-pressed={weight === size} className={weight === size ? 'selected' : ''} onClick={() => { onWeightChange(size); setJustAdded(false) }}><span className="pd-size-check" aria-hidden="true">{weight === size && <Check size={12} />}</span><strong>{size}</strong><span>{formatPrice(product.prices[size])}</span></button>)}
            </div>
          </fieldset>
          <button type="button" className={`button button-primary modal-add${justAdded ? ' is-added' : ''}`} onClick={handleAdd}>
            {justAdded ? <><Check size={21} /> Added to bag</> : <><ShoppingBag size={20} /><span>Add to bag</span><span className="pd-button-price">{formatPrice(product.prices[weight])}</span><ArrowRight size={19} /></>}
          </button>
          <span className="sr-only" aria-live="polite">{justAdded ? `${product.name} added to bag` : ''}</span>
          <div className="pd-service-row">
            <Link to="/contact"><PackageCheck size={22} /><span>Product enquiries<small>Contact our shop</small></span></Link>
            <Link to="/shipping"><Truck size={22} /><span>Delivery information<small>Check availability</small></span></Link>
          </div>
        </section>
      </div>
      <section className="product-information" aria-label="Product information">
        <p className="pd-eyebrow">✦ THE FINER DETAILS ✦</p>
        <h2>Good to <em>know.</em></h2>
        <details><summary><Info size={20} /><span>Ingredients, allergens and shelf life</span></summary><div className="details-body"><p>Verified label information is pending for this product. Please confirm dietary requirements with the shop before ordering.</p><Link className="text-link" to="/contact">Contact the shop <ArrowRight size={14} /></Link></div></details>
        <details><summary><Truck size={20} /><span>Delivery and returns</span></summary><div className="details-body"><p>Availability and delivery charges depend on the destination.</p><Link className="text-link" to="/shipping">Delivery information <ArrowRight size={14} /></Link></div></details>
        <details><summary><MessageCircle size={20} /><span>Customer reviews</span></summary><div className="details-body"><p>No approved reviews for this product yet.</p></div></details>
      </section>
      <dialog ref={zoomDialog} className="pd-lightbox" aria-label={`${product.name} enlarged image`} onClick={event => { if (event.target === event.currentTarget) zoomDialog.current?.close() }}>
        <button type="button" className="pd-lightbox-close" aria-label="Close enlarged image" onClick={() => zoomDialog.current?.close()}><X size={24} /></button>
        <img src={product.image} alt={product.name} loading="lazy" decoding="async" />
      </dialog>
    </article>
  )
}
