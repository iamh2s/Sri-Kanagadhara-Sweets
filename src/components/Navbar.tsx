import { useEffect, useId, useRef, useState } from 'react'
import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { contactLinks } from '../data/storeContact'
import { products, shopLinks } from '../data/storefront'
import { ProductSearch } from './ProductSearch'
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
  onSearchSubmit: (query: string) => void
  onWishlistToggle: () => void
  onCartOpen: () => void
}

const LEFT_ITEMS: NavItem[] = [
  { label: 'Home', href: '/', route: 'home' },
  { label: 'Shop', href: '/shop-all', route: 'shop-all', category: 'All' },
  { label: 'About Us', href: '/our-story', route: 'our-story' },
  { label: 'Contact', href: '/contact', route: 'contact' },
]

const ADMIN_ITEM: NavItem = { label: 'Admin', href: '/admin', route: 'admin' }
const MOBILE_ITEMS = [...LEFT_ITEMS, ADMIN_ITEM]

const aboutLinks: NavItem[] = [
  { label: 'Our story', route: 'our-story', href: '/our-story' },
  { label: 'Our values', route: 'our-story#our-values', href: '/our-story#our-values' },
  { label: 'Inside the sweet box', route: 'our-story#sweet-box', href: '/our-story#sweet-box' },
  { label: 'Gifting traditions', route: 'our-story#gifting-traditions', href: '/our-story#gifting-traditions' },
]
const dropdownLinks: Partial<Record<string, NavItem[]>> = {
  'shop-all': shopLinks,
  'our-story': aboutLinks,
  contact: contactLinks,
}

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

function insideMobilePanel(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest('.ks-mobile-panel'))
}

function NavDropdown({ label, links, expandedId, mobile, active, onSelect, onOpen }: {
  label: string
  links: NavItem[]
  expandedId: string | null
  onOpen: (id: string) => void
  mobile: boolean
  active: boolean
  onSelect: (item: NavItem) => void
}) {
  const [mode, setMode] = useState<'hover' | 'click' | null>(null)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const panelId = useId()
  const open = expandedId === panelId && mode !== null
  const location = useLocation()
  useEffect(() => setMode(null), [location.key])
  useEffect(() => {
    if (!open) return
    const dismiss = (event: PointerEvent) => {
      if (mobile && insideMobilePanel(event.target)) return
      if (event.target instanceof Node && !root.current?.contains(event.target)) setMode(null)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMode(null)
    }
    document.addEventListener('keydown', escape)
    const breakpoint = window.matchMedia('(min-width: 1000px)')
    const close = () => setMode(null)
    document.addEventListener('pointerdown', dismiss)
    breakpoint.addEventListener('change', close)
    return () => {
      document.removeEventListener('keydown', escape)
      document.removeEventListener('pointerdown', dismiss)
      breakpoint.removeEventListener('change', close)
    }
  }, [open, mobile])

  return <div ref={root} className={mobile ? 'ks-shop ks-shop-mobile' : 'ks-shop'}
    onPointerEnter={event => {
      if (!mobile && event.pointerType === 'mouse' && !open) {
        onOpen(panelId)
        setMode('hover')
      }
    }}
    onPointerLeave={event => {
      if (event.pointerType === 'mouse' && mode === 'hover' && !root.current?.contains(document.activeElement)) setMode(null)
    }}
    onBlur={event => {
      if (mobile && insideMobilePanel(event.relatedTarget)) return
      if (!event.currentTarget.contains(event.relatedTarget)) setMode(null)
    }}
    onKeyDown={event => {
      if (open && event.key === 'Escape') {
        event.stopPropagation()
        setMode(null)
        trigger.current?.focus()
      }
    }}>
    <button type="button" ref={trigger} className={`ks-shop-toggle ${mobile ? 'ks-mobile-link' : 'ks-nav-link'}${active ? ' is-active' : ''}`}
      aria-expanded={open} aria-controls={panelId} onClick={() => {
        if (!open) onOpen(panelId)
        setMode(open && mode === 'click' ? null : 'click')
      }}>
      {label} <ChevronDown size={14} aria-hidden="true" />
    </button>
    <ul id={panelId} hidden={!open} className="ks-shop-options">
      {links.map(link => <li key={link.href}><a href={link.href}
        aria-current={link.href.startsWith('/our-story')
          ? (location.pathname + location.hash === link.href ? (location.hash ? 'location' : 'page') : undefined)
          : (location.pathname === link.href.split('#')[0] ? 'page' : undefined)}
        onClick={event => {
          if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
          event.preventDefault()
          setMode(null)
          onSelect(link)
        }}>{link.label}</a></li>)}
    </ul>
  </div>
}

function NavLink({
  item,
  active,
  mobile = false,
  onDropdownOpen,
  expandedId,
  onSelect,
}: {
  item: NavItem
  active: boolean
  mobile?: boolean
  expandedId: string | null
  onDropdownOpen: (id: string) => void
  onSelect: (item: NavItem) => void
}) {
  const links = dropdownLinks[item.route]
  if (links) return (
    <NavDropdown label={item.label} links={links} expandedId={expandedId} active={active}
      mobile={mobile} onSelect={onSelect} onOpen={onDropdownOpen} />
  )
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
  onSearchSubmit,
  onWishlistToggle,
  onCartOpen,
}: NavbarProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const openDropdown = (id: string) => {
    if (searchOpen) onSearchToggle()
    setExpandedId(id)
  }
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

  const accountIcon = (
    <a className="ks-icon-button ks-account-icon" href="/account" title="Your account"
      aria-label="Your account" aria-current={page === 'account' ? 'page' : undefined}
      onClick={event => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        event.preventDefault()
        navigate({ label: 'Account', href: '/account', route: 'account' })
      }}>
      <UserRound size={21} aria-hidden="true" />
    </a>
  )

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

              {accountIcon}

              <nav className="ks-desktop-links ks-desktop-links--left" aria-label="Primary navigation">
                {LEFT_ITEMS.map((item) => (
                  <NavLink
                    key={item.route}
                    item={item}
                    active={item.route === page || (item.route === 'contact' && contactLinks.some(link => link.route === page))}
                    expandedId={expandedId}
                    onDropdownOpen={openDropdown}
                    onSelect={navigate}
                  />
                ))}
              </nav>
            </div>

            <div className="ks-center-gap" aria-hidden="true" />

            <div className="ks-nav-right">
              <a className="ks-account" href={ADMIN_ITEM.href} onClick={event => {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
                event.preventDefault()
                navigate(ADMIN_ITEM)
              }}>Admin</a>

              <div className="ks-actions" aria-label="Shopping tools">
                {accountIcon}
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
            {MOBILE_ITEMS.map((item) => (
              <NavLink
                key={item.route}
                item={item}
                active={item.route === page || (item.route === 'contact' && contactLinks.some(link => link.route === page))}
                mobile
                expandedId={expandedId}
                onDropdownOpen={openDropdown}
                onSelect={navigate}
              />
            ))}
            <p className="ks-mobile-signoff">Made with tradition, shared with love.</p>
          </nav>
        </>
      )}

      {searchOpen && (
        <div className="ks-search-panel" id="ks-search-panel">
          <ProductSearch header products={products} initialQuery={searchQuery} label="Search sweets and savouries"
            onSearch={onSearchSubmit} onNavigate={onNavigate} />
        </div>
      )}
    </header>
  )
}

export default Navbar
