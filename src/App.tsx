import { useEffect, useState } from 'react'
import AOS from 'aos'
import { useLocation, useNavigate as useRouterNavigate } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { AnnouncementBar } from './components/AnnouncementBar'
import { ContactShortcut } from './components/ContactShortcut'
import { FeatherCursor } from './components/FeatherCursor'
import { ShoppingOverlays, type CartLine } from './components/ShoppingOverlays'
import { SiteFooter } from './components/SiteFooter'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import {
  announcementMessages,
  categories,
  collections,
  craftStories,
  products,
} from './data/storefront'
import { ModulePages, type Product, type Weight } from './pages/ModulePages'
import { loadCart, loadWishlist, saveCart, saveWishlist } from './data/shoppingStorage'

function App() {
  const location = useLocation()
  const routerNavigate = useRouterNavigate()
  const currentRoute = location.pathname.replace(/^\/+|\/+$/g, '')
  const knownRoutes = ['shop-all', 'sweets', 'savouries', 'gift-boxes', 'our-story', 'contact', 'account']
  const page = !currentRoute ? 'home' : knownRoutes.includes(currentRoute) ? currentRoute : 'not-found'
  const params = new URLSearchParams(location.search)
  const catalogSearch = page === 'shop-all' ? (params.get('q') ?? '').trim() : ''
  const wishlistOnly = page === 'shop-all' && params.get('wishlist') === '1'
  const [weights, setWeights] = useState<Record<number, Weight>>({})
  const [cart, setCart] = useState<CartLine[]>(loadCart)
  const [wishlist, setWishlist] = useState<number[]>(loadWishlist)
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeProduct, setActiveProduct] = useState<Product | null>(null)

  useEffect(() => saveCart(cart), [cart])
  useEffect(() => saveWishlist(wishlist), [wishlist])

  useEffect(() => {
    AOS.init({
      duration: 750,
      easing: 'ease-out-cubic',
      offset: 75,
      once: false,
      mirror: true,
      disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    })
  }, [])

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      AOS.refreshHard()
      const target = location.hash === '#catalog' ? document.getElementById('catalog') : null
      if (target) {
        target.focus({ preventScroll: true })
        target.scrollIntoView({ behavior: 'instant' })
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
    })
    return () => window.cancelAnimationFrame(frame)
  }, [location.key, location.hash])

  const navigate = (path: string) => {
    setSearchOpen(false)
    setSearchQuery('')
    routerNavigate(path === '/' || path === 'home' ? '/' : `/${path}`)
  }

  const showCatalog = (query = '') => {
    setCartOpen(false)
    navigate(`shop-all${query}#catalog`)
  }

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cart.reduce(
    (total, item) => total + item.product.prices[item.weight] * item.quantity,
    0,
  )

  const addToCart = (product: Product, weight: Weight) => {
    setCart((current) => {
      const existing = current.find(
        (line) => line.product.id === product.id && line.weight === weight,
      )
      if (existing) {
        return current.map((line) =>
          line === existing ? { ...line, quantity: line.quantity + 1 } : line,
        )
      }
      return [...current, { product, weight, quantity: 1 }]
    })
    setCartOpen(true)
    setActiveProduct(null)
  }

  const updateQuantity = (productId: number, weight: Weight, change: number) => {
    setCart((current) =>
      current
        .map((line) =>
          line.product.id === productId && line.weight === weight
            ? { ...line, quantity: line.quantity + change }
            : line,
        )
        .filter((line) => line.quantity > 0),
    )
  }

  const toggleWishlist = (id: number) => {
    setWishlist((current) =>
      current.includes(id) ? current.filter((productId) => productId !== id) : [...current, id],
    )
  }

  return (
    <>
      <div className="site-shell" id="home">
        <AnnouncementBar messages={announcementMessages} />

        <Navbar
          page={page}
          cartCount={cartCount}
          wishlistCount={wishlist.length}
          wishlistOnly={wishlistOnly}
          searchOpen={searchOpen}
          searchQuery={searchQuery}
          onNavigate={navigate}
          onSearchToggle={() => {
            setSearchOpen((open) => !open)
            setSearchQuery(catalogSearch)
          }}
          onSearchChange={setSearchQuery}
          onSearchSubmit={() => {
            const query = searchQuery.trim()
            showCatalog(query ? `?${new URLSearchParams({ q: query })}` : '')
          }}
          onWishlistToggle={() => showCatalog(wishlistOnly ? '' : '?wishlist=1')}
          onCartOpen={() => setCartOpen(true)}
        />

        <main>
          {page === 'not-found' ? (
            <NotFoundPage onNavigate={navigate} />
          ) : page !== 'home' ? (
            <ModulePages
              page={page}
              products={products}
              collections={collections}
              catalogSearch={catalogSearch}
              wishlistOnly={wishlistOnly}
              weights={weights}
              wishlist={wishlist}
              onWeightChange={(productId, weight) =>
                setWeights((current) => ({ ...current, [productId]: weight }))
              }
              onAddToCart={addToCart}
              onViewProduct={setActiveProduct}
              onToggleWishlist={toggleWishlist}
              onNavigate={navigate}
            />
          ) : (
            <HomePage
              categories={categories}
              craftStories={craftStories}
              collections={collections}
              products={products}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              weights={weights}
              setWeights={setWeights}
              setActiveProduct={setActiveProduct}
              addToCart={addToCart}
              navigate={navigate}
            />
          )}
        </main>

        <SiteFooter onNavigate={navigate} />
        <ContactShortcut onNavigate={navigate} />
        <ShoppingOverlays
          cartOpen={cartOpen}
          cart={cart}
          cartCount={cartCount}
          cartTotal={cartTotal}
          onClose={() => setCartOpen(false)}
          onUpdateQuantity={updateQuantity}
          onBrowse={() => showCatalog()}
          activeProduct={activeProduct}
          weights={weights}
          onCloseProduct={() => setActiveProduct(null)}
          onWeightChange={(productId, weight) =>
            setWeights((current) => ({ ...current, [productId]: weight }))
          }
          onAddToCart={addToCart}
        />
      </div>
      <FeatherCursor />
    </>
  )
}

export default App
