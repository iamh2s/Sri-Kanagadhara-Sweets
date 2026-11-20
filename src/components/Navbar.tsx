import { useEffect, useState } from 'react'
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from 'lucide-react'
import './Navbar.css'

// The props and route keys match the Navbar component you supplied.
type NavItem = {
  label: string
  href: string
  route: string
  category?: string
}

export type NavbarProps = {
  page: string
  cartCount: number
  wishlistCount: number
  wishlistOnly: boolean
  searchOpen: boolean
  searchQuery: string
  onNavigate: (route: string, category?: string) => void
  onSearchToggle: () => void
  onSearchChange: (query: string) => void
  onSearchSubmit: () => void
  onWishlistToggle: () => void
  onCartOpen: () => void
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/', route: 'home' },
  { label: 'Shop', href: '/shop-all', route: 'shop-all', category: 'All' },
  { label: 'About Us', href: '/our-story', route: 'our-story' },
  { label: 'Contact', href: '/contact', route: 'contact' },
  { label: 'Account', href: '/account', route: 'account' },
]

const LEFT_ITEMS = NAV_ITEMS.slice(0, 4)
const ACCOUNT_ITEM = NAV_ITEMS[4]

export function BrandMark({
  light = false,
  onNavigate,
}: {
  light?: boolean
  onNavigate?: () => void
}) {
  return (
    <a
      className={`ks-brand${light ? ' ks-brand--light' : ''}`}
      href="/"
      aria-label="Sri Kanagadhara Sweets — home"
      onClick={(event) => {
        if (!onNavigate) return
        event.preventDefault()
        onNavigate()
      }}
    >
      <img
        src="/brand/sri-kanagadhara-logo.webp"
        alt="Sri Kanagadhara Sweets"
        width={300}
        height={300}
        draggable={false}
      />
    </a>
  )
}

function CountBadge({ count }: { count: number }) {
  if (count < 1) return null
  return (
    <span className="ks-count" aria-hidden="true">
      {count > 99 ? '99+' : count}
    </span>
  )
}

function NavLink({
  item,
  active,
  mobile = false,
  onSelect,
}: {
  item: NavItem
  active: boolean
  mobile?: boolean
  onSelect: (item: NavItem) => void
}) {
  return (
    <a
      href={item.href}
      className={`${mobile ? 'ks-mobile-link' : 'ks-nav-link'}${active ? ' is-active' : ''}`}
      aria-current={active ? 'page' : undefined}
      onClick={(event) => {
        event.preventDefault()
        onSelect(item)
      }}
    >
      {item.label}
      {mobile && <span className="ks-mobile-chevron" aria-hidden="true">›</span>}
    </a>
  )
}

export function Navbar({
  page,
  cartCount,
  wishlistCount,
  wishlistOnly,
  searchOpen,
  searchQuery,
  onNavigate,
  onSearchToggle,
  onSearchChange,
  onSearchSubmit,
  onWishlistToggle,
  onCartOpen,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMobileMenuOpen(false), [page])

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1000px)')
    const onChange = () => {
      if (media.matches) setMobileMenuOpen(false)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!mobileMenuOpen && !searchOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || (event.target instanceof Element && event.target.closest('dialog[open]'))) return
      if (mobileMenuOpen) setMobileMenuOpen(false)
      else if (searchOpen) onSearchToggle()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [mobileMenuOpen, searchOpen, onSearchToggle])

  const navigate = (item: NavItem) => {
    setMobileMenuOpen(false)
    if (searchOpen) onSearchToggle()
    onNavigate(item.route, item.category)
  }

  const goHome = () => {
    setMobileMenuOpen(false)
    if (searchOpen) onSearchToggle()
    onNavigate('home')
  }

  const toggleSearch = () => {
    setMobileMenuOpen(false)
    onSearchToggle()
  }

  const toggleMenu = () => {
    if (searchOpen) onSearchToggle()
    setMobileMenuOpen((old) => !old)
  }

  return (
    <header className={`ks-header${isScrolled ? ' is-scrolled' : ''}`}>
     

      <div className="ks-nav-outer">
        <div className="ks-nav-frame">
          {/* Gold corner flourishes and logo-side ornaments are decorative. */}
          <span className="ks-corner ks-corner--tl" aria-hidden="true">❦</span>
          <span className="ks-corner ks-corner--tr" aria-hidden="true">❦</span>
          <span className="ks-corner ks-corner--bl" aria-hidden="true">❦</span>
          <span className="ks-corner ks-corner--br" aria-hidden="true">❦</span>
          <span className="ks-logo-divider ks-logo-divider--left" aria-hidden="true" />
          <span className="ks-logo-divider ks-logo-divider--right" aria-hidden="true" />

          <div className="ks-nav-grid">
            <div className="ks-nav-left">
              <button
                type="button"
                className="ks-icon-button ks-menu-toggle"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
                aria-controls="ks-mobile-navigation"
                onClick={toggleMenu}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <nav className="ks-desktop-links ks-desktop-links--left" aria-label="Primary navigation">
                {LEFT_ITEMS.map((item) => (
                  <NavLink
                    key={item.route}
                    item={item}
                    active={item.route === page}
                    onSelect={navigate}
                  />
                ))}
              </nav>
            </div>

            <div className="ks-center-gap" aria-hidden="true" />

            <div className="ks-nav-right">
              <a
                className={`ks-account${page === 'account' ? ' is-active' : ''}`}
                href={ACCOUNT_ITEM.href}
                aria-current={page === 'account' ? 'page' : undefined}
                onClick={(event) => {
                  event.preventDefault()
                  navigate(ACCOUNT_ITEM)
                }}
              >
                <UserRound size={18} aria-hidden="true" />
                <span>Account</span>
              </a>

              <div className="ks-actions" aria-label="Shopping tools">
                <button
                  type="button"
                  className={`ks-icon-button${searchOpen ? ' is-active' : ''}`}
                  aria-label={searchOpen ? 'Close search' : 'Search products'}
                  aria-expanded={searchOpen}
                  aria-controls="ks-search-panel"
                  onClick={toggleSearch}
                >
                  {searchOpen ? <X size={21} /> : <Search size={21} />}
                </button>

                <button
                  type="button"
                  className={`ks-icon-button${wishlistOnly ? ' is-active' : ''}`}
                  aria-label={wishlistOnly ? 'Show all products' : `Show wishlist (${wishlistCount} items)`}
                  aria-pressed={wishlistOnly}
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onWishlistToggle()
                  }}
                >
                  <Heart size={21} fill={wishlistOnly ? 'currentColor' : 'none'} aria-hidden="true" />
                  <CountBadge count={wishlistCount} />
                </button>

                <button
                  type="button"
                  className="ks-icon-button"
                  aria-label={`Open cart (${cartCount} items)`}
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onCartOpen()
                  }}
                >
                  <ShoppingBag size={21} aria-hidden="true" />
                  <CountBadge count={cartCount} />
                </button>
              </div>
            </div>
          </div>

          {/* This element is positioned *above and below* the framed navbar. */}
          <BrandMark onNavigate={goHome} />
        </div>
      </div>

      {/* Reserve a little room so the badge does not cover the next section. */}
      <div className="ks-logo-overhang" aria-hidden="true" />

      {mobileMenuOpen && (
        <>
          <button
            type="button"
            className="ks-mobile-backdrop"
            aria-label="Close navigation menu"
            onClick={() => setMobileMenuOpen(false)}
          />
          <nav className="ks-mobile-panel" id="ks-mobile-navigation" aria-label="Mobile navigation">
            <div className="ks-mobile-heading">Explore Our Collections</div>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.route}
                item={item}
                active={item.route === page}
                mobile
                onSelect={navigate}
              />
            ))}
            <p className="ks-mobile-signoff">Made with tradition, shared with love.</p>
          </nav>
        </>
      )}

      {searchOpen && (
        <div className="ks-search-panel" id="ks-search-panel" role="search">
          <form
            className="ks-search-form"
            onSubmit={(event) => {
              event.preventDefault()
              onSearchSubmit()
            }}
          >
            <Search size={20} aria-hidden="true" />
            <input
              autoFocus
              type="search"
              aria-label="Search sweets and savouries"
              placeholder="Search Mysore Pak, Laddu, Murukku..."
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
            />
            <button className="ks-search-submit" type="submit">Search</button>
          </form>
        </div>
      )}
    </header>
  )
}

export default Navbar
