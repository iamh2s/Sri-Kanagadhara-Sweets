import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, Gift, Heart, MapPin, Package, Search } from 'lucide-react'
import type { CartLine } from '../components/ShoppingOverlays'
import { formatPrice } from '../data/storefront'
import './CustomerCommerce.css'

type Props = { page: string; cart: CartLine[]; cartTotal: number }
type Address = { name: string; street: string; city: string; state: string; pin: string }
type OrderItem = { name: string; weight: string; quantity: number; total: number }
type Order = { ref: string; date: string; items: OrderItem[]; subtotal: number; gift: boolean }
const ordersKey = 'kanagadhara.demo.orders.v1'
const addressesKey = 'kanagadhara.demo.addresses.v1'
const blankAddress: Address = { name: '', street: '', city: '', state: '', pin: '' }
const sampleAddress: Address = { name: 'Sample Guest', street: '12 Example Street', city: 'Chennai', state: 'Tamil Nadu', pin: '600001' }
const addressFields: { key: keyof Address; label: string; limit: number }[] = [
  { key: 'name', label: 'Recipient name', limit: 80 }, { key: 'street', label: 'Street address', limit: 180 },
  { key: 'city', label: 'Town or city', limit: 80 }, { key: 'state', label: 'State or union territory', limit: 80 },
  { key: 'pin', label: 'PIN code', limit: 6 },
]

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
function isAddress(value: unknown): value is Address {
  return record(value) && addressFields.every(({ key, limit }) => {
    const field = value[key]
    return typeof field === 'string' && field.trim().length > 0 && field.length <= limit
  }) && /^[1-9]\d{5}$/.test(String(value.pin))
}
function isOrder(value: unknown): value is Order {
  return record(value) && typeof value.ref === 'string' && /^KS-[A-F0-9]{16}$/.test(value.ref)
    && typeof value.date === 'string' && Number.isFinite(Date.parse(value.date))
    && typeof value.subtotal === 'number' && Number.isFinite(value.subtotal) && value.subtotal >= 0
    && typeof value.gift === 'boolean' && Array.isArray(value.items) && value.items.length > 0
    && value.items.every(item => record(item) && typeof item.name === 'string' && typeof item.weight === 'string'
      && typeof item.quantity === 'number' && Number.isSafeInteger(item.quantity) && item.quantity > 0
      && typeof item.total === 'number' && Number.isFinite(item.total) && item.total >= 0)
}
function saved<T>(key: string, valid: (item: unknown) => item is T): T[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? '[]')
    return Array.isArray(value) ? value.filter(valid) : []
  } catch { return [] }
}
function persist(key: string, value: unknown[]) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true }
  catch { return false }
}
function addressText(a: Address) {
  return [a.name, a.street, a.city, a.state, a.pin].join(', ')
}
function AddressFields({ value, change }: { value: Address; change: (a: Address) => void }) {
  return <div className="cc-fields">{addressFields.map(({ key, label, limit }) =>
    <label key={key} className={key === 'street' ? 'cc-wide' : undefined}>{label}
      <input required maxLength={limit} value={value[key]} autoComplete="off"
        inputMode={key === 'pin' ? 'numeric' : 'text'} pattern={key === 'pin' ? '[1-9][0-9]{5}' : '.*\\S.*'}
        onChange={e => change({ ...value, [key]: e.target.value })} />
    </label>)}</div>
}
function Panel({ title, children }: { title: string; children: ReactNode }) {
  return <section className="cc-panel"><h2>{title}</h2>{children}</section>
}
function Items({ items, subtotal }: { items: OrderItem[]; subtotal: number }) {
  return <><ul className="cc-items">{items.map((item, i) =>
    <li key={i}><span><strong>{item.name}</strong><small>{item.weight} · Qty {item.quantity}</small></span>
      <b>{formatPrice(item.total)}</b></li>)}</ul>
    <div className="cc-total"><span>Estimated item subtotal</span><strong>{formatPrice(subtotal)}</strong></div></>
}
function Checkout({ cart, cartTotal }: Pick<Props, 'cart' | 'cartTotal'>) {
  const navigate = useNavigate()
  const [address, setAddress] = useState(blankAddress)
  const [email, setEmail] = useState('')
  const [gift, setGift] = useState(false)
  const [message, setMessage] = useState('')
  const [review, setReview] = useState(false)
  const [error, setError] = useState('')
  const placing = useRef(false)
  const savedAddresses = saved(addressesKey, isAddress)
  const items = cart.map(({ product, weight, quantity }) => ({ name: product.name, weight, quantity, total: product.prices[weight] * quantity }))

  function place() {
    if (placing.current || !review || !items.length) return
    placing.current = true
    const random = Array.from(crypto.getRandomValues(new Uint8Array(8)), n => n.toString(16).padStart(2, '0')).join('')
    const ref = 'KS-' + random.toUpperCase()
    const order: Order = { ref, date: new Date().toISOString(), items, subtotal: cartTotal, gift }
    if (!persist(ordersKey, [order, ...saved(ordersKey, isOrder)])) {
      placing.current = false
      setError('This browser could not save the demo order. Enable local storage and try again.')
      return
    }
    navigate('/orders/' + ref + '/confirmation')
  }

  if (!cart.length) return <Panel title="Your bag is empty"><p>Choose a sweet or savoury to start your order.</p>
    <Link className="button button-primary" to="/shop-all#catalog">Browse the shop <ArrowRight size={16} /></Link></Panel>

  return <div className="cc-grid"><div className="cc-stack">
    <p className="cc-notice">Demo checkout. Use fictional details. Live payment and delivery are unavailable.</p>
    {review ? <Panel title="Review your details">
      <h3>Delivery address</h3><p>{addressText(address)}</p><h3>Contact email</h3><p>{email}</p>
      {gift && <><h3>Gift message</h3><p>{message.trim() || 'Gift packaging requested'}</p></>}
      <button className="cc-link" onClick={() => setReview(false)}>Edit details</button>
      <h3>Payment</h3><p>This preview saves an order summary on this device. No payment or delivery is requested.</p>
      <p><Link className="cc-link" to="/payment/status">View payment availability</Link></p>
      <button className="button button-primary" onClick={place}>Place demo order <ArrowRight size={16} /></button>
      {error && <p role="alert">{error}</p>}
    </Panel> : <form onSubmit={e => { e.preventDefault(); setReview(true) }}><Panel title="Contact and delivery">
      <button type="button" className="cc-link" onClick={() => { setAddress(sampleAddress); setEmail('guest@example.invalid') }}>Fill sample details</button>
      {savedAddresses.length > 0 && <label>Saved demo address<select defaultValue="" onChange={e => {
        const selected = savedAddresses.find(a => addressText(a) === e.target.value)
        if (selected) setAddress(selected)
      }}><option value="">Select an address</option>{savedAddresses.map(a => <option key={addressText(a)}>{addressText(a)}</option>)}</select></label>}
      <label>Contact email<input autoComplete="off" type="email" required maxLength={200} value={email} onChange={e => setEmail(e.target.value)} /></label>
      <AddressFields value={address} change={setAddress} />
      <label className="cc-check"><input type="checkbox" checked={gift} onChange={e => setGift(e.target.checked)} /><Gift size={17} /> This is a gift</label>
      {gift && <label>Gift message (optional)<textarea maxLength={240} value={message} onChange={e => setMessage(e.target.value)} /></label>}
      <button className="button button-primary" type="submit">Review order <ArrowRight size={16} /></button>
    </Panel></form>}
  </div><Panel title="Your bag"><Items items={items} subtotal={cartTotal} /></Panel></div>
}
function AddressBook() {
  const [entries, setEntries] = useState(() => saved(addressesKey, isAddress))
  const [address, setAddress] = useState(blankAddress)
  const [notice, setNotice] = useState('')
  function change(next: Address[], success: string) {
    if (!persist(addressesKey, next)) { setNotice('This browser could not update your address book.'); return false }
    setEntries(next); setNotice(success); return true
  }
  function add(event: FormEvent) {
    event.preventDefault()
    const existing = saved(addressesKey, isAddress)
    if (existing.some(a => addressText(a) === addressText(address))) { setNotice('This address is already saved.'); return }
    if (change([...existing, address], 'Demo address saved.')) setAddress(blankAddress)
  }
  return <><div className="cc-grid"><Panel title="Saved on this device">
    {entries.length ? <ul className="cc-list">{entries.map(a => <li key={addressText(a)}><strong>{a.name}</strong><p>{addressText(a)}</p>
      <button className="cc-link" onClick={() => change(saved(addressesKey, isAddress).filter(other => addressText(other) !== addressText(a)), 'Address removed.')}>Remove {a.name}</button></li>)}</ul> : <p>Your demo address book is empty.</p>}
  </Panel><Panel title="Add a demo address"><p>Use a fictional address. Saving it makes it visible to anyone using this browser.</p>
    <form onSubmit={add}><button type="button" className="cc-link" onClick={() => setAddress(sampleAddress)}>Fill sample address</button>
      <AddressFields value={address} change={setAddress} /><button className="button button-primary" type="submit">Save demo address on this device</button></form>
  </Panel></div><p role="status">{notice}</p></>
}
function OrderDetails() {
  const [params] = useSearchParams()
  const { pathname } = useLocation()
  const pathRef = /^\/(?:account\/orders\/([^/]+)|orders\/([^/]+)\/confirmation)\/?$/.exec(pathname)
  const ref = (pathRef?.[1] ?? pathRef?.[2] ?? params.get('ref'))?.trim().toUpperCase()
  const order = saved(ordersKey, isOrder).find(o => o.ref === ref)
  return order ? <Panel title="Demo order recorded"><p className="cc-reference">{order.ref}</p>
    <p>Saved on {new Date(order.date).toLocaleDateString('en-IN')}. Payment and dispatch are unavailable in demo checkout.</p>
    <Items items={order.items} subtotal={order.subtotal} />
    {order.gift && <p>Gift packaging requested</p>}
    {pathname.endsWith('/confirmation') && <p><Link className="cc-link" to={'/account/orders/' + order.ref}>View order details</Link></p>}
    <Link className="cc-link" to="/account/orders">View order history</Link></Panel> :
    <Panel title="Order unavailable"><p>Check the reference and use the browser where you placed the demo order.</p><Link className="cc-link" to="/track-order">Look up an order</Link></Panel>
}
function History() {
  const orders = saved(ordersKey, isOrder)
  return <Panel title="Orders on this device">{orders.length ? <ul className="cc-list">{orders.map(order => <li key={order.ref}>
    <Link className="cc-link" to={'/account/orders/' + order.ref}>{order.ref}</Link><p>{new Date(order.date).toLocaleDateString('en-IN')} · {formatPrice(order.subtotal)} · Demo order</p>
  </li>)}</ul> : <><p>Your demo order history is empty.</p><Link className="cc-link" to="/shop-all#catalog">Browse the shop</Link></>}</Panel>
}
function Tracking() {
  const navigate = useNavigate()
  const [ref, setRef] = useState('')
  return <Panel title="Find a demo order"><p>Enter the reference from an order placed in this browser.</p><form onSubmit={e => {
    e.preventDefault(); navigate('/order-status?ref=' + encodeURIComponent(ref.trim().toUpperCase()))
  }}><label>Order reference<input required maxLength={32} value={ref} placeholder="KS-…" onChange={e => setRef(e.target.value)} /></label>
    <button className="button button-primary" type="submit">Find order <Search size={16} /></button></form></Panel>
}
function PaymentStatus() {
  const [params] = useSearchParams()
  const states: Record<string, string> = { pending: 'Payment pending', incomplete: 'Payment incomplete', failed: 'Payment incomplete', cancelled: 'Payment cancelled' }
  const status = params.get('status') ?? ''
  const heading = Object.prototype.hasOwnProperty.call(states, status) ? states[status] : 'Payment unavailable'
  return <Panel title={heading}><p>Demo payment status. Online payments are unavailable and this preview cannot collect or verify a payment.</p><Link className="cc-link" to="/checkout">Return to checkout</Link></Panel>
}
const accountTools = [
  { to: '/account/orders', label: 'Order history', description: 'View your demo orders and item details.', icon: Package },
  { to: '/track-order', label: 'Track an order', description: 'Look up a demo order by its reference number.', icon: Search },
  { to: '/account/addresses', label: 'Saved addresses', description: 'Add or remove sample delivery addresses.', icon: MapPin },
  { to: '/account/wishlist', label: 'Wishlist', description: 'Browse the sweets and snacks you saved.', icon: Heart },
]

const titles: Record<string, string> = { 'payment/status': 'Payment status', checkout: 'Checkout', account: 'Your account', 'account/orders': 'Order history', 'account/addresses': 'Address book', 'order-status': 'Order status', 'track-order': 'Track your order' }
export function CustomerCommerce({ page, cart, cartTotal }: Props) {
  return <div className="customer-commerce module-content-wrap"><header><Link className="cc-link" to={page.startsWith('account/') ? '/account' : '/shop-all#catalog'}>{page.startsWith('account/') ? 'Back to account' : 'Back to shop'}</Link>
    <h1>{titles[page]}</h1></header>
    {page === 'checkout' && <Checkout cart={cart} cartTotal={cartTotal} />}
    {page === 'account' && <>
      <p className="cc-account-intro">Your demo orders, addresses and favourites are saved in this browser.</p>
      <nav aria-label="Account tools" className="cc-hub">
        {accountTools.map(({ to, label, description, icon: Icon }) => (
          <Link key={to} to={to}>
            <Icon aria-hidden="true" />
            <span><strong>{label}</strong><small>{description}</small></span>
            <ArrowRight aria-hidden="true" />
          </Link>
        ))}
      </nav>
    </>}
    {page === 'account/orders' && <History />}
    {page === 'account/addresses' && <AddressBook />}
    {page === 'order-status' && <OrderDetails />}
    {page === 'track-order' && <Tracking />}
    {page === 'payment/status' && <PaymentStatus />}
  </div>
}
