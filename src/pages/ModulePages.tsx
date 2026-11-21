import { CinematicHero } from '../components/CinematicHero'
import { ContactPage } from './ContactPage'
import { GiftBoxesPage } from './GiftBoxesPage'
import { ProductPage } from './ProductPage'
import { StoryPage } from './StoryPage'

export type Weight = '250g' | '500g' | '1kg'

export type Product = {
  id: number
  name: string
  description: string
  category: string
  image: string
  prices: Record<Weight, number>
  badge?: string
}

export type Collection = {
  title: string
  subtitle: string
  image: string
  className: string
  link: string
}

export type ModulePagesProps = {
  page: string
  products: Product[]
  collections: Collection[]
  catalogSearch: string
  wishlistOnly: boolean
  weights: Record<number, Weight>
  onWeightChange: (
    productId: number,
    weight: Weight
  ) => void
  onAddToCart: (
    product: Product,
    weight: Weight
  ) => void
  onViewProduct: (product: Product) => void
  wishlist: number[]
  onToggleWishlist: (productId: number) => void
  onNavigate: (path: string) => void
}

export function ModulePages(props: ModulePagesProps) {
  const { page, collections, onNavigate } = props

  return (
    <div
      className={`module-page module-page--${page}`}
      data-page={page}
    >
      {/* 01 — Cinematic hero for every module */}
      {page !== 'contact' && <CinematicHero page={page} />}

      {/* 02 — Shop All, Sweets and Savouries */}
      {['shop-all', 'sweets', 'savouries'].includes(page) && (
        <ProductPage {...props} />
      )}

      {/* 03 — Gift Boxes */}
      {page === 'gift-boxes' && (
        <GiftBoxesPage
          collections={collections}
          onNavigate={onNavigate}
        />
      )}

      {/* 04 — Our Story */}
      {page === 'our-story' && (
        <StoryPage onNavigate={onNavigate} />
      )}

      {/* 05 — Contact */}
      {page === 'contact' && <ContactPage />}

    </div>
  )
}
