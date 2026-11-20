import { AccountPage } from './AccountPage'
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
  onWeightChange: (productId: number, weight: Weight) => void
  onAddToCart: (product: Product, weight: Weight) => void
  onViewProduct: (product: Product) => void
  wishlist: number[]
  onToggleWishlist: (productId: number) => void
  onNavigate: (path: string) => void
}


export function ModulePages(props: ModulePagesProps) {
  return (
    <div className="module-page">
      <CinematicHero page={props.page} />
      {['shop-all', 'sweets', 'savouries'].includes(props.page) && <ProductPage {...props} />}
      {props.page === 'gift-boxes' && <GiftBoxesPage collections={props.collections} onNavigate={props.onNavigate} />}
      {props.page === 'our-story' && <StoryPage onNavigate={props.onNavigate} />}
      {props.page === 'contact' && <ContactPage />}
      {props.page === 'account' && <AccountPage onNavigate={props.onNavigate} />}
    </div>
  )
}
