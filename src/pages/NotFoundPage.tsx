import { products } from '../data/storefront'
import { AnimatedMarqueeHero } from '../components/ui/hero-3'

type NotFoundPageProps = {
  onNavigate: (path: string) => void
}

export function NotFoundPage({ onNavigate }: NotFoundPageProps) {
  return (
    <AnimatedMarqueeHero
      ariaLabel="Page not found"
      tagline="ERROR 404 — PAGE NOT FOUND"
      title={<>This sweet trail<br />ends <em>here.</em></>}
      description="We couldn’t find the page you were looking for. Let’s get you back to something delicious."
      ctaText="Back to Home"
      ctaHref="/"
      onCtaClick={() => onNavigate('home')}
      images={products.map((product) => ({ src: product.image, alt: product.name }))}
    />
  )
}
