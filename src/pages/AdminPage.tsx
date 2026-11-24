import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Boxes, ClipboardList, ExternalLink, Flower2, LayoutDashboard, Mail, Package, Pencil, Search, X } from 'lucide-react'
import { categories, formatPrice, products } from '../data/storefront'
import './AdminPage.css'

const navigation = [
  { name: 'Overview', path: '/admin', icon: LayoutDashboard },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Categories', path: '/admin/categories', icon: Boxes },
  { name: 'Orders', path: '/admin/orders', icon: ClipboardList },
  { name: 'Inquiries', path: '/admin/inquiries', icon: Mail },
]
const weights = ['250g', '500g', '1kg'] as const
const orderStages = ['Received', 'Preparing', 'Ready', 'Completed'] as const
const inquiryStages = ['New', 'In review', 'Resolved'] as const
const sampleOrders = [
  { id: 'DEMO-104', item: 'Mysore Pak', weight: '500g', quantity: 2, status: 'Received' },
  { id: 'DEMO-103', item: 'Kaju Katli', weight: '1kg', quantity: 1, status: 'Preparing' },
  { id: 'DEMO-102', item: 'Butter Murukku', weight: '250g', quantity: 3, status: 'Ready' },
  { id: 'DEMO-101', item: 'Paal Peda', weight: '500g', quantity: 1, status: 'Completed' },
]
const sampleInquiries = [
  { id: 'INQ-103', subject: 'Festival gift boxes', message: 'Which assortments can be packed as festival gifts?', status: 'New' },
  { id: 'INQ-102', subject: 'Bulk order enquiry', message: 'Can the shop prepare sweets in individual packs for an event?', status: 'In review' },
  { id: 'INQ-101', subject: 'Collection timing', message: 'When can a prepared order be collected?', status: 'Resolved' },
]
type CatalogProduct = (typeof products)[number]
type WorkItem = { id: string; title: string; detail: string; status: string }

function EditDialog({ title, children, close }: { title: string; children: ReactNode; close: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    dialog?.showModal()
    return () => dialog?.close()
  }, [])
  return <dialog className="ks-admin-dialog" ref={ref} aria-labelledby="admin-edit-title" onCancel={(e) => { e.preventDefault(); close() }}>
    <header><h2 id="admin-edit-title">{title}</h2><button className="ks-admin-icon-btn" onClick={close} aria-label="Close editor"><X size={19} /></button></header>
    {children}
  </dialog>
}

function ProductEditor({ product, names, save, close }: {
  product: CatalogProduct
  names: Record<string, string>
  save: (product: CatalogProduct) => void
  close: () => void
}) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name')).trim()
    if (!name) return
    const prices = { ...product.prices }
    for (const weight of weights) prices[weight] = Number(form.get(weight))
    save({ ...product, name, category: String(form.get('category')), prices })
  }
  return <EditDialog title="Edit product" close={close}>
    <form onSubmit={submit}>
      <label>Product name<input name="name" required pattern=".*\S.*" maxLength={80} defaultValue={product.name} /></label>
      <label>Category<select name="category" defaultValue={product.category}>{categories.map((c) => <option key={c.name} value={c.name}>{names[c.name]}</option>)}</select></label>
      <fieldset><legend>Price by weight in rupees</legend><div className="ks-admin-prices">{weights.map((w) => <label key={w}>{w}<input name={w} type="number" required min="1" max="999999" step="1" defaultValue={product.prices[w]} /></label>)}</div></fieldset>
      <button className="ks-admin-primary" type="submit">Save preview changes</button>
    </form>
  </EditDialog>
}

function Queue({ items, stages, update }: { items: WorkItem[]; stages: readonly string[]; update: (id: string, stage: string) => void }) {
  const [filter, setFilter] = useState('')
  const visible = items.filter((item) => !filter || item.status === filter)
  return <section className="ks-admin-panel">
    <div className="ks-admin-tools"><label>Status<select value={filter} onChange={(e) => setFilter(e.target.value)}><option value="">All statuses</option>{stages.map((s) => <option key={s}>{s}</option>)}</select></label></div>
    {visible.map((item) => <article key={item.id} className="ks-admin-row">
      <div><small>{item.id}</small><h3>{item.title}</h3><p>{item.detail}</p></div>
      <select value={item.status} aria-label={`Status for ${item.id}`} onChange={(e) => update(item.id, e.target.value)}>{stages.map((s) => <option key={s}>{s}</option>)}</select>
    </article>)}
    {!visible.length && <p className="ks-admin-empty">No items with this status.</p>}
  </section>
}

export default function AdminPage() {
  const [session, setSession] = useState<'checking' | 'signedOut' | 'signedIn'>('checking')
  const [expires, setExpires] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const endpoint = '/api/v1/admin/session'

  function openSession(body: { data?: { authenticated?: boolean; expiresAt?: string } }) {
    const deadline = Date.parse(body.data?.expiresAt ?? '')
    if (!body.data?.authenticated || !(deadline > Date.now())) throw new Error('Invalid session')
    setExpires(deadline)
    setSession('signedIn')
  }

  useEffect(() => {
    const controller = new AbortController()
    async function check() {
      try {
        const response = await fetch(endpoint, { signal: controller.signal, cache: 'no-store' })
        if (response.status === 401) setSession('signedOut')
        else if (response.ok) openSession(await response.json())
        else throw new Error('Service unavailable')
      } catch {
        if (controller.signal.aborted) return
        setSession('signedOut')
        setError('Admin sign-in is unavailable. Check that the configured API is running.')
      }
    }
    void check()
    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (session !== 'signedIn') return
    const controller = new AbortController()
    const expire = () => {
      if (Date.now() < expires) return
      setSession('signedOut')
      setError('Your session has expired. Sign in again.')
    }
    async function recheck() {
      if (Date.now() >= expires) return expire()
      try {
        const response = await fetch(endpoint, { signal: controller.signal, cache: 'no-store' })
        if (!response.ok) throw new Error('Session unavailable')
      } catch {
        if (controller.signal.aborted) return
        setSession('signedOut')
        setError('Your session could not be verified. Please sign in again.')
      }
    }
    const timer = window.setTimeout(expire, Math.max(0, expires - Date.now()))
    window.addEventListener('focus', recheck)
    window.addEventListener('pageshow', recheck)
    return () => {
      controller.abort()
      window.clearTimeout(timer)
      window.removeEventListener('focus', recheck)
      window.removeEventListener('pageshow', recheck)
    }
  }, [session, expires])

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setBusy(true)
    setError('')
    try {
      const response = await fetch(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Admin-Request': '1' },
        body: JSON.stringify({ username: data.get('username'), password: data.get('password') }),
      })
      if (response.ok) openSession(await response.json())
      else if (response.status === 401) setError('Check your username and password and try again.')
      else if (response.status === 429) setError('Too many attempts. Please try again later.')
      else throw new Error('Service unavailable')
    } catch { setError('Sign-in is unavailable. Check that the configured API is running.') }
    finally { setBusy(false) }
  }

  async function signOut() {
    setBusy(true)
    setError('')
    try {
      const response = await fetch(endpoint, { method: 'DELETE', headers: { 'X-Admin-Request': '1' } })
      if (!response.ok && response.status !== 401) throw new Error('Sign-out failed')
      setSession('signedOut')
    } catch { setError('Sign-out could not be confirmed. Please try again.') }
    finally { setBusy(false) }
  }

  if (session === 'signedIn') return <AdminWorkspace signOut={signOut} busy={busy} error={error} />
  return <main className="ks-admin-login"><section aria-labelledby="admin-login-title">
    <Flower2 size={32} aria-hidden="true" />
    <p>Kanagadhara Sweets</p><h1 id="admin-login-title">Admin sign-in</h1>
    {session === 'checking' ? <p role="status">Checking your session…</p> : <form onSubmit={signIn}>
      <label>Username<input name="username" autoComplete="username" required maxLength={128} /></label>
      <label>Password<input name="password" type="password" autoComplete="current-password" required maxLength={256} /></label>
      <button type="submit" className="ks-admin-primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      {error && <p role="alert">{error}</p>}
    </form>}
    <Link to="/">Back to the shop</Link>
  </section></main>
}

function AdminWorkspace({ signOut, busy, error }: { signOut: () => void; busy: boolean; error: string }) {
  const path = useLocation().pathname.replace(/\/+$/, '')
  const section = navigation.find((item) => item.path === path)?.name
  const [catalog, setCatalog] = useState(products)
  const [categoryNames, setCategoryNames] = useState<Record<string, string>>(() =>
    Object.fromEntries(categories.map((item) => [item.name, item.name])),
  )
  const [orders, setOrders] = useState(sampleOrders)
  const [inquiries, setInquiries] = useState(sampleInquiries)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [productEdit, setProductEdit] = useState<CatalogProduct | null>(null)
  const [categoryEdit, setCategoryEdit] = useState('')
  const [notice, setNotice] = useState('')
  useEffect(() => {
    setProductEdit(null)
    setCategoryEdit('')
    setNotice('')
  }, [section])
  const visibleProducts = catalog.filter((product) =>
    (!category || category === product.category) && product.name.toLowerCase().includes(query.trim().toLowerCase()),
  )
  const orderRows = orders.map((order) => ({
    id: order.id, title: order.item, detail: `${order.quantity} × ${order.weight}`, status: order.status,
  }))
  const saveCategory = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const input = event.currentTarget.elements.namedItem('name') as HTMLInputElement
    const name = input.value.trim()
    if (!name) return
    if (Object.entries(categoryNames).some(([id, value]) => id !== categoryEdit && value.toLowerCase() === name.toLowerCase())) {
      input.setCustomValidity('Choose a different category name.')
      input.reportValidity()
      return
    }
    setCategoryNames((old) => ({ ...old, [categoryEdit]: name }))
    setCategoryEdit('')
    setNotice('Category updated in this preview.')
  }
  return <div className="ks-admin">
    <aside className="ks-admin-sidebar">
      <Link className="ks-admin-brand" to="/admin"><Flower2 size={32} aria-hidden="true" /><span>Kanagadhara<small>Sweets administration</small></span></Link>
      <nav aria-label="Administration">{navigation.map(({ name, path: to, icon: Icon }) =>
        <Link key={to} to={to} aria-current={section === name ? 'page' : undefined}><Icon size={18} />{name}</Link>,
      )}</nav>
      <Link to="/" className="ks-admin-store"><ExternalLink size={16} /> Visit storefront</Link>
      <button className="ks-admin-edit" onClick={signOut} disabled={busy}>{busy ? 'Signing out…' : 'Sign out'}</button>
      {error && <p role="alert">{error}</p>}
    </aside>
    <main className="ks-admin-main">
      <header className="ks-admin-heading"><div><p>Store administration</p><h1>{section === 'Overview' ? 'Store overview' : section ?? 'Page unavailable'}</h1></div><span className="ks-admin-tag">Local preview</span></header>
      <p className="ks-admin-note">Sample orders and inquiries. Edits stay in this preview until you refresh or leave the panel.</p>
      <p className="ks-admin-status" role="status">{notice}</p>
      {section === 'Overview' && <>
        <div className="ks-admin-metrics">{[
          { title: 'Catalog products', value: catalog.length, to: 'products', icon: Package },
          { title: 'Open orders', value: orders.filter((o) => o.status !== 'Completed').length, to: 'orders', icon: ClipboardList },
          { title: 'Open inquiries', value: inquiries.filter((i) => i.status !== 'Resolved').length, to: 'inquiries', icon: Mail },
        ].map(({ title, value, to, icon: Icon }) => <Link key={to} to={`/admin/${to}`}><Icon size={22} /><span>{title}</span><strong>{value}</strong><ArrowRight className="ks-admin-metric-arrow" size={16} /></Link>)}</div>
        <section className="ks-admin-panel"><div className="ks-admin-panel-title"><h2>Recent orders</h2><Link to="/admin/orders">Manage orders <ArrowRight size={14} /></Link></div>
          {orderRows.map((o) => <article className="ks-admin-row" key={o.id}><div><small>{o.id}</small><h3>{o.title}</h3><p>{o.detail}</p></div><span className="ks-admin-pill">{o.status}</span></article>)}
        </section>
      </>}
      {section === 'Products' && <section className="ks-admin-panel">
        <div className="ks-admin-tools"><label>Find a product<span className="ks-admin-search"><Search size={16} /><input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name" /></span></label>
          <label>Category<select value={category} onChange={(e) => setCategory(e.target.value)}><option value="">All categories</option>{categories.map((c) => <option key={c.name} value={c.name}>{categoryNames[c.name]}</option>)}</select></label></div>
        {visibleProducts.map((p) => <article className="ks-admin-row" key={p.id}><div><small>{categoryNames[p.category]}</small><h3>{p.name}</h3><p>250g · {formatPrice(p.prices['250g'])}</p></div><button className="ks-admin-edit" onClick={() => setProductEdit(p)} aria-label={`Edit ${p.name}`}><Pencil size={14} /> Edit</button></article>)}
        {!visibleProducts.length && <p className="ks-admin-empty">No products match these filters.</p>}
      </section>}
      {section === 'Categories' && <section className="ks-admin-panel"><div className="ks-admin-panel-title"><h2>Catalog categories</h2><span>{categories.length} categories</span></div>
        {categories.map((c) => <article key={c.name} className="ks-admin-row"><div><h3>{categoryNames[c.name]}</h3><p>{catalog.filter((p) => p.category === c.name).length} products</p></div><button className="ks-admin-edit" onClick={() => setCategoryEdit(c.name)} aria-label={`Edit ${categoryNames[c.name]}`}><Pencil size={14} /> Edit</button></article>)}
      </section>}
      {section === 'Orders' && <Queue key="orders" items={orderRows} stages={orderStages} update={(id, status) => {
        setOrders((items) => items.map((item) => item.id === id ? { ...item, status } : item))
        setNotice(`${id} updated to ${status}.`)
      }} />}
      {section === 'Inquiries' && <Queue key="inquiries" items={inquiries.map((item) => ({ ...item, title: item.subject, detail: item.message }))} stages={inquiryStages} update={(id, status) => {
        setInquiries((items) => items.map((item) => item.id === id ? { ...item, status } : item))
        setNotice(`${id} updated to ${status}.`)
      }} />}
      {!section && <Link className="ks-admin-edit" to="/admin">Return to overview</Link>}
    </main>
    {productEdit && <ProductEditor product={productEdit} names={categoryNames} close={() => setProductEdit(null)} save={(next) => {
      setCatalog((items) => items.map((item) => item.id === next.id ? next : item))
      setProductEdit(null)
      setNotice('Product updated in this preview.')
    }} />}
    {categoryEdit && <EditDialog title="Edit category" close={() => setCategoryEdit('')}><form onSubmit={saveCategory}><label>Category name<input name="name" required maxLength={80} pattern=".*\S.*" defaultValue={categoryNames[categoryEdit]} onInput={(e) => e.currentTarget.setCustomValidity('')} /></label><button className="ks-admin-primary">Save preview changes</button></form></EditDialog>}
  </div>
}
