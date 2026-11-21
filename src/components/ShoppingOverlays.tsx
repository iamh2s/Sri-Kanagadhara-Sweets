import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { ArrowRight, Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { storeContactEmail, storeEmailLink } from '../data/storeContact'
import { Link } from 'react-router-dom'
import { catalogSlug } from '../../shared/catalogSlug'
import { formatPrice } from '../data/storefront'
import type { Product, Weight } from '../pages/ModulePages'
import './ShoppingOverlays.css'

export type CartLine = {
  product: Product
  weight: Weight
  quantity: number
}

type CartDrawerProps = {
  cart: CartLine[]
  cartCount: number
  cartTotal: number
  onClose: () => void
  onUpdateQuantity: (productId: number, weight: Weight, change: number) => void
  onBrowse: () => void
}

function ShoppingDialog({ className, titleId, onClose, children }: {
  className: string
  titleId: string
  onClose: () => void
  children: ReactNode
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useLayoutEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    dialog.showModal()
    return () => dialog.close()
  }, [])

  return (
    <dialog
      ref={dialogRef}
      className={`shopping-dialog ${className}`}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      {children}
    </dialog>
  )
}

export function CartDrawer({
  standalone = false,
  cart,
  cartCount,
  cartTotal,
  onClose,
  onUpdateQuantity,
  onBrowse,
}: CartDrawerProps & { standalone?: boolean }) {
  const orderItems = cart.map(({ product, weight, quantity }) =>
    `${quantity} × ${product.name} (${weight}) — ${formatPrice(product.prices[weight] * quantity)}`,
  )
  const orderBody = [
    'Hello, I’d like to check availability for these items:',
    '',
    ...orderItems,
    '',
    `Estimated subtotal: ${formatPrice(cartTotal)}`,
    'Please confirm availability, pricing, and delivery options.',
  ].join('\r\n')

  const bag = (
      <section className={standalone ? "cart-drawer cart-page" : "cart-drawer"}>
        <div className="drawer-heading">
          <div>
            <p className="eyebrow"><span /> Your little collection</p>
            <h2 id="cart-title">Your bag <span>({cartCount})</span></h2>
          </div>
          {standalone ? <Link className="text-link" to="/shop-all#catalog">Shop all</Link> : <button className="icon-button" aria-label="Close cart" autoFocus onClick={onClose}><X size={20} /></button>}
        </div>
        {cart.length === 0 ? (
          <div className="empty-cart">
            <ShoppingBag size={34} />
            <h3>Your bag is taking a little break.</h3>
            <p>Fill it with something lovely to share.</p>
            <button className="button button-primary" onClick={onBrowse}>
              Find a favourite <ArrowRight size={15} />
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((line) => (
                <article className="cart-line" key={`${line.product.id}-${line.weight}`}>
                  <img src={line.product.image} alt="" />
                  <div className="cart-line-copy">
                    <strong>{line.product.name}</strong>
                    <span>{line.weight} · {formatPrice(line.product.prices[line.weight])}</span>
                    <div className="quantity-control">
                      <button
                        aria-label={`Remove one ${line.product.name}`}
                        onClick={() => onUpdateQuantity(line.product.id, line.weight, -1)}
                      >
                        <Minus size={13} />
                      </button>
                      <span>{line.quantity}</span>
                      <button
                        aria-label={`Add one ${line.product.name}`}
                        onClick={() => onUpdateQuantity(line.product.id, line.weight, 1)}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                  <strong className="cart-line-total">
                    {formatPrice(line.product.prices[line.weight] * line.quantity)}
                  </strong>
                </article>
              ))}
            </div>
            <div className="cart-summary">
              <div><span>Subtotal</span><strong>{formatPrice(cartTotal)}</strong></div>
              <Link className="button button-primary checkout-button" to="/checkout" onClick={standalone ? undefined : onClose}>Review checkout <ArrowRight size={15} /></Link>
              {!standalone && <Link className="text-link" to="/cart" onClick={onClose}>View bag</Link>}
              {storeContactEmail ? (
                <>
                  <p>The shop will confirm availability, pricing, and delivery.</p>
                  <a
                    className="button button-primary checkout-button"
                    href={storeEmailLink('Order inquiry — Sri Kanagadhara Sweets', orderBody)}
                  >
                    Email your order inquiry <ArrowRight size={15} />
                  </a>
                </>
              ) : (
                <p className="checkout-notice">Checkout preview is available. Live orders are currently unavailable.</p>
              )}
              <button className="continue-shopping" onClick={onClose}>Continue browsing</button>
            </div>
          </>
        )}
      </section>
  )
  if (standalone) return bag
  return <ShoppingDialog className="drawer-backdrop" titleId="cart-title" onClose={onClose}>{bag}</ShoppingDialog>
}

type ProductQuickViewProps = {
  product: Product
  weight: Weight
  onClose: () => void
  onWeightChange: (weight: Weight) => void
  onAddToCart: () => void
}

function ProductQuickView({
  product,
  weight,
  onClose,
  onWeightChange,
  onAddToCart,
}: ProductQuickViewProps) {
  return (
    <ShoppingDialog className="modal-backdrop" titleId="modal-product-name" onClose={onClose}>
      <section className="product-modal">
        <button className="modal-close icon-button" aria-label="Close product details" autoFocus onClick={onClose}>
          <X size={19} />
        </button>
        <img src={product.image} alt={product.name} />
        <div className="modal-product-copy">
          <span className="product-category">{product.category}</span>
          <h2 id="modal-product-name">{product.name}</h2>
          <p>{product.description}</p>
          <Link className="text-link" to={`/products/${catalogSlug(product.name)}`} onClick={onClose}>View full product details</Link>
          <p className="modal-weight-label">Choose your size</p>
          <div className="modal-weights">
            {(['250g', '500g', '1kg'] as const).map((option) => (
              <button
                className={weight === option ? 'selected' : ''}
                aria-pressed={weight === option}
                key={option}
                onClick={() => onWeightChange(option)}
              >
                {option}<span>{formatPrice(product.prices[option])}</span>
              </button>
            ))}
          </div>
          <button className="button button-primary modal-add" onClick={onAddToCart}>
            Add to bag · {formatPrice(product.prices[weight])}
            <ShoppingBag size={16} />
          </button>
        </div>
      </section>
    </ShoppingDialog>
  )
}

type ShoppingOverlaysProps = CartDrawerProps & {
  cartOpen: boolean
  activeProduct: Product | null
  weights: Record<number, Weight>
  onCloseProduct: () => void
  onWeightChange: (productId: number, weight: Weight) => void
  onAddToCart: (product: Product, weight: Weight) => void
}

export function ShoppingOverlays({
  cartOpen,
  activeProduct,
  weights,
  onCloseProduct,
  onWeightChange,
  onAddToCart,
  ...cartProps
}: ShoppingOverlaysProps) {
  return (
    <>
      {cartOpen && <CartDrawer {...cartProps} />}
      {activeProduct && (
        <ProductQuickView
          product={activeProduct}
          weight={weights[activeProduct.id] ?? '250g'}
          onClose={onCloseProduct}
          onWeightChange={(weight) => onWeightChange(activeProduct.id, weight)}
          onAddToCart={() => onAddToCart(activeProduct, weights[activeProduct.id] ?? '250g')}
        />
      )}
    </>
  )
}
