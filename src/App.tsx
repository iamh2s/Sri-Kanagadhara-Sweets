import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import AOS from 'aos'
import {
  useLocation,
  useNavigate as useRouterNavigate,
} from 'react-router-dom'

import { Navbar } from './components/Navbar'
import { AnnouncementBar } from './components/AnnouncementBar'
import { ContactShortcut } from './components/ContactShortcut'
import { FeatherCursor } from './components/FeatherCursor'
import TraditionalLoader from './components/TraditionalLoader'
import { usePageMetadata } from './usePageMetadata'

import {
  CartDrawer,
  ShoppingOverlays,
  type CartLine,
} from './components/ShoppingOverlays'

import { SiteFooter } from './components/SiteFooter'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { catalogSlug } from '../shared/catalogSlug'
import { contactLinks } from './data/storeContact'
import { CustomerCommerce } from './pages/CustomerCommerce'
import { CustomerSupport } from './pages/CustomerSupport'
import { ServicePage } from './pages/ServicePage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'

import {
  announcementMessages,
  categories,
  collections,
  craftStories,
  products,
} from './data/storefront'

import {
  ModulePages,
  type Product,
  type Weight,
} from './pages/ModulePages'

import {
  loadCart,
  loadWishlist,
  saveCart,
  saveWishlist,
} from './data/shoppingStorage'

const AdminPage = lazy(() => import('./pages/AdminPage'))

const commerceRoutes = [
  'account',
  'checkout',
  'payment/status',
  'order-status',
  'track-order',
  'account/orders',
  'account/addresses',
]

const supportRoutes = [
  'faq',
  'shipping',
  'returns',
  'privacy',
  'terms',
  'grievance',
  'bulk-enquiry',
  'festival-preorders',
]

const serviceRoutes = [
  'stores',
  'maintenance',
  '500',
]

const aliases = new Map([
  ['about', 'our-story'],
  ['bulk-orders', 'bulk-enquiry'],
  ['search', 'shop-all'],
  ['account/wishlist', 'shop-all'],
  ['policies/shipping', 'shipping'],
  ['policies/returns', 'returns'],
  ['policies/privacy', 'privacy'],
  ['policies/terms', 'terms'],
  ['policies/grievance', 'grievance'],
])

const knownRoutes = [
  ...commerceRoutes,
  ...supportRoutes,
  ...serviceRoutes,
  'cart',
  'shop-all',
  'sweets',
  'savouries',
  'gift-boxes',
  'our-story',
  'contact',
]

const INITIAL_LOADER_DURATION = 2000
const NAVIGATION_LOADER_DURATION = 2000

const shopPages = new Set([
  'shop-all',
  'sweets',
  'savouries',
  'gift-boxes',
  'product',
])

const contactPages = new Set(
  contactLinks.map(link => link.route),
)

function App() {
  const location = useLocation()
  const routerNavigate = useRouterNavigate()

  // =====================================
  // TRADITIONAL PAGE LOADING SYSTEM
  // =====================================

  const [websiteReady, setWebsiteReady] = useState(
    () => document.readyState === 'complete',
  )

  const [loader, setLoader] = useState<{
    key: string
    ready: boolean
    duration: number
  } | null>(() => {
    // Keep product animations paused until the first loader completes.
    document.documentElement.dataset.pageReady = 'false'

    return {
      key: location.key,
      ready: document.readyState === 'complete',
      duration: INITIAL_LOADER_DURATION,
    }
  })

  // Browser initial load readiness
  useEffect(() => {
    if (document.readyState === 'complete') {
      setWebsiteReady(true)
      return
    }

    const handleLoad = () => {
      setWebsiteReady(true)
    }

    window.addEventListener('load', handleLoad)

    return () => {
      window.removeEventListener('load', handleLoad)
    }
  }, [])

  // Synchronize the initial loader with document readiness
  useEffect(() => {
    if (!websiteReady) return

    setLoader(current => {
      if (!current || current.ready) return current

      return {
        ...current,
        ready: true,
      }
    })
  }, [websiteReady])

  // Finish loader only after its doors have opened.
  const finishLoader = useCallback((key: string) => {
    if (loader?.key !== key) return

    document.documentElement.dataset.pageReady = 'true'

    window.dispatchEvent(
      new Event('site:loader-complete'),
    )

    setLoader(current =>
      current?.key === key ? null : current,
    )
  }, [loader])

  // =====================================
  // ROUTE RESOLUTION
  // =====================================

  const currentRoute = location.pathname.replace(
    /^\/+|\/+$/g,
    '',
  )

  const detailProduct = products.find(
    product =>
      currentRoute ===
        `products/${catalogSlug(product.name)}` ||
      currentRoute ===
        `sweets/${catalogSlug(product.category)}/${catalogSlug(product.name)}`,
  )

  const category = categories.find(
    item =>
      currentRoute ===
      `sweets/${catalogSlug(item.name)}`,
  )

  let page = aliases.get(currentRoute) ?? currentRoute

  if (!currentRoute) {
    page = 'home'
  } else if (
    currentRoute === 'admin' ||
    currentRoute.startsWith('admin/')
  ) {
    page = 'admin'
  } else if (detailProduct) {
    page = 'product'
  } else if (category) {
    page =
      category.route === 'gift-boxes'
        ? 'gift-boxes'
        : 'shop-all'
  } else if (
    /^orders\/[^/]+\/confirmation$|^account\/orders\/[^/]+$/.test(
      currentRoute,
    )
  ) {
    page = 'order-status'
  } else if (/^festival\/[^/]+$/.test(currentRoute)) {
    page = 'festival-preorders'
  } else if (!knownRoutes.includes(page)) {
    page = 'not-found'
  }

  // =====================================
  // ROUTE LOADER MANAGEMENT
  // =====================================

  const section = shopPages.has(page)
    ? 'shop'
    : contactPages.has(page)
      ? 'contact'
      : null

  const previousNavigation = useRef({
    key: location.key,
    section,
  })

  useEffect(() => {
    const previous = previousNavigation.current

    if (previous.key === location.key) return

    previousNavigation.current = {
      key: location.key,
      section,
    }

    // Same-section navigation does not show the loader.
    if (section && section === previous.section) {
      setLoader(null)
      return
    }

    // A new loader is starting. Pause product animations.
    document.documentElement.dataset.pageReady = 'false'

    window.dispatchEvent(
      new Event('site:loader-start'),
    )

    setLoader({
      key: location.key,
      ready: true,
      duration: NAVIGATION_LOADER_DURATION,
    })
  }, [location.key, section])

  const params = new URLSearchParams(location.search)

  const catalogSearch =
    page === 'shop-all'
      ? (params.get('q') ?? '').trim()
      : ''

  const wishlistOnly =
    page === 'shop-all' &&
    (
      params.get('wishlist') === '1' ||
      currentRoute === 'account/wishlist'
    )

  // =====================================
  // SHOPPING STATES
  // =====================================

  const [weights, setWeights] =
    useState<Record<number, Weight>>({})

  const [cart, setCart] =
    useState<CartLine[]>(loadCart)

  const [wishlist, setWishlist] =
    useState<number[]>(loadWishlist)

  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const [activeProduct, setActiveProduct] =
    useState<Product | null>(null)

  // =====================================
  // SEO AND DOCUMENT TITLE
  // =====================================

  usePageMetadata(location.pathname, location.search)

  // =====================================
  // LOCAL STORAGE
  // =====================================

  useEffect(() => saveCart(cart), [cart])
  useEffect(() => saveWishlist(wishlist), [wishlist])

  // =====================================
  // AOS ANIMATIONS
  // =====================================

  useEffect(() => {
    AOS.init({
      duration: 750,
      easing: 'ease-out-cubic',
      offset: 75,
      once: false,
      mirror: true,
      disable: () =>
        window.matchMedia(
          '(prefers-reduced-motion: reduce)',
        ).matches,
    })
  }, [])

  // =====================================
  // SCROLL MANAGEMENT
  // =====================================

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      AOS.refreshHard()

      if (location.state?.preserveCatalogScroll) {
        return
      }

      const target = location.hash
        ? document.getElementById(location.hash.slice(1))
        : null

      if (target) {
        target.focus({ preventScroll: true })

        target.scrollIntoView({
          behavior: 'instant',
        })
      } else {
        window.scrollTo({
          top: 0,
          behavior: 'instant',
        })
      }
    })

    return () => window.cancelAnimationFrame(frame)
  }, [
    location.key,
    location.hash,
    location.state,
  ])

  // =====================================
  // NAVIGATION
  // =====================================

  const navigate = (path: string) => {
    setSearchOpen(false)

    routerNavigate(
      path === '/' || path === 'home'
        ? '/'
        : `/${path.replace(/^\/+/, '')}`,
    )
  }

  const showCatalog = (query = '') => {
    setCartOpen(false)
    navigate(`shop-all${query}#catalog`)
  }

  // =====================================
  // CART CALCULATIONS
  // =====================================

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0,
  )

  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      item.product.prices[item.weight] *
        item.quantity,
    0,
  )

  // =====================================
  // ADD TO CART
  // =====================================

  const addToCart = (
    product: Product,
    weight: Weight,
  ) => {
    setCart(current => {
      const existing = current.find(
        line =>
          line.product.id === product.id &&
          line.weight === weight,
      )

      if (existing) {
        return current.map(line =>
          line === existing
            ? {
                ...line,
                quantity: line.quantity + 1,
              }
            : line,
        )
      }

      return [
        ...current,
        {
          product,
          weight,
          quantity: 1,
        },
      ]
    })

    setCartOpen(true)
    setActiveProduct(null)
  }

  // =====================================
  // UPDATE CART QUANTITY
  // =====================================

  const updateQuantity = (
    productId: number,
    weight: Weight,
    change: number,
  ) => {
    setCart(current =>
      current
        .map(line =>
          line.product.id === productId &&
          line.weight === weight
            ? {
                ...line,
                quantity: line.quantity + change,
              }
            : line,
        )
        .filter(line => line.quantity > 0),
    )
  }

  // =====================================
  // WISHLIST
  // =====================================

  const toggleWishlist = (id: number) => {
    setWishlist(current =>
      current.includes(id)
        ? current.filter(
            productId => productId !== id,
          )
        : [...current, id],
    )
  }

  // =====================================
  // LOADER RENDERING
  // =====================================

  const loadingScreen = loader ? (
    <TraditionalLoader
      key={loader.key}
      isReady={loader.ready}
      duration={loader.duration}
      onComplete={() => finishLoader(loader.key)}
    />
  ) : null

  // =====================================
  // ADMIN PAGE
  // =====================================

  if (page === 'admin') {
    return (
      <>
        {loadingScreen}

        <Suspense
          fallback={
            <main aria-busy="true">
              Opening shop administration…
            </main>
          }
        >
          <AdminPage />
        </Suspense>
      </>
    )
  }

  // =====================================
  // MAIN WEBSITE
  // =====================================

  return (
    <>
      {loadingScreen}

      <div
        className={`site-shell page-${page}`}
        id={page === 'home' ? 'home' : 'app'}
      >
        <AnnouncementBar
          messages={announcementMessages}
        />

        <Navbar
          page={page}
          cartCount={cartCount}
          wishlistCount={wishlist.length}
          wishlistOnly={wishlistOnly}
          searchOpen={searchOpen}
          searchQuery={catalogSearch}
          onNavigate={navigate}
          onSearchToggle={() => {
            setSearchOpen(open => !open)
          }}
          onSearchSubmit={query => {
            showCatalog(
              query
                ? `?${new URLSearchParams({
                    q: query,
                  })}`
                : '',
            )
          }}
          onWishlistToggle={() =>
            showCatalog(
              wishlistOnly ? '' : '?wishlist=1',
            )
          }
          onCartOpen={() =>
            page === 'cart'
              ? window.scrollTo({ top: 0 })
              : setCartOpen(true)
          }
        />

        <main>
          {detailProduct ? (
            <ProductDetailPage
              product={detailProduct}
              weight={
                weights[detailProduct.id] ?? '250g'
              }
              onWeightChange={weight =>
                setWeights(current => ({
                  ...current,
                  [detailProduct.id]: weight,
                }))
              }
              onAdd={() =>
                addToCart(
                  detailProduct,
                  weights[detailProduct.id] ?? '250g',
                )
              }
            />
          ) : commerceRoutes.includes(page) ? (
            <CustomerCommerce
              key={currentRoute}
              page={page}
              cart={cart}
              cartTotal={cartTotal}
            />
          ) : supportRoutes.includes(page) ? (
            <CustomerSupport
              key={page}
              page={page}
            />
          ) : serviceRoutes.includes(page) ? (
            <ServicePage page={page} />
          ) : page === 'cart' ? (
            <CartDrawer
              standalone
              cart={cart}
              cartCount={cartCount}
              cartTotal={cartTotal}
              onUpdateQuantity={updateQuantity}
              onBrowse={() => showCatalog()}
              onClose={() => showCatalog()}
            />
          ) : page === 'not-found' ? (
            <NotFoundPage />
          ) : page !== 'home' ? (
            <ModulePages
              page={page}
              products={
                category
                  ? products.filter(
                      item =>
                        item.category === category.name,
                    )
                  : products
              }
              collections={collections}
              catalogSearch={catalogSearch}
              wishlistOnly={wishlistOnly}
              weights={weights}
              wishlist={wishlist}
              onWeightChange={(productId, weight) =>
                setWeights(current => ({
                  ...current,
                  [productId]: weight,
                }))
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
          onCloseProduct={() =>
            setActiveProduct(null)
          }
          onWeightChange={(productId, weight) =>
            setWeights(current => ({
              ...current,
              [productId]: weight,
            }))
          }
          onAddToCart={addToCart}
        />
      </div>

      <FeatherCursor />
    </>
  )
}

export default App
