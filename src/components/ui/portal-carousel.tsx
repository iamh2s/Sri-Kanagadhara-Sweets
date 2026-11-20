import { useEffect, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import './portal-carousel.css'

export type PortalCarouselImage = {
  src: string
  alt?: string
  title?: string
}

type PortalCarouselProps = {
  images: PortalCarouselImage[]
  children?: ReactNode
  /** How long each slide is shown. The zoom runs for the same length. */
  slideDuration?: number
  /**
   * When true, the zoom and fades are turned off if the OS "Reduce motion"
   * setting is on. Pass false to show the zoom regardless of that setting.
   */
  respectReducedMotion?: boolean
}

const FADE_MS = 700

const wrapIndex = (index: number, count: number) => ((index % count) + count) % count

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return reduced
}

export default function PortalCarousel({
  images,
  children,
  slideDuration = 10000,
  respectReducedMotion = true,
}: PortalCarouselProps) {
  const count = images.length
  const prefersReducedMotion = usePrefersReducedMotion()
  const motionOff = respectReducedMotion && prefersReducedMotion

  const [active, setActive] = useState(0)
  const [previous, setPrevious] = useState<number | null>(null)

  const current = count ? wrapIndex(active, count) : 0

  // Auto-advance. The effect restarts whenever the current slide changes,
  // so every slide gets the full duration, including after a manual click.
  useEffect(() => {
    if (count < 2) return
    const timer = window.setTimeout(() => {
      setPrevious(current)
      setActive(wrapIndex(current + 1, count))
    }, slideDuration)
    return () => window.clearTimeout(timer)
  }, [current, count, slideDuration])

  // Keep the outgoing slide mounted (still zooming) until its fade finishes.
  useEffect(() => {
    if (previous === null) return
    const timer = window.setTimeout(() => setPrevious(null), FADE_MS)
    return () => window.clearTimeout(timer)
  }, [previous])

  const goNext = () => {
    if (count < 2) return
    setPrevious(current)
    setActive(wrapIndex(current + 1, count))
  }

  const onRootClick = (event: MouseEvent<HTMLElement>) => {
    if (
      event.target instanceof Element &&
      event.target.closest('a, button, input, select, textarea, [role="button"]')
    ) {
      return
    }
    goNext()
  }

  if (!count) return null

  const currentImage = images[current]
  const sectionClass = ['portal-carousel', motionOff && 'portal-carousel--static']
    .filter(Boolean)
    .join(' ')

  return (
    <section
      onClick={onRootClick}
      aria-label="Explore our handcrafted sweets"
      aria-roledescription="carousel"
      className={sectionClass}
      style={{ '--slide-duration': `${slideDuration}ms` } as CSSProperties}
    >
      {images.map((image, index) => {
        const isActive = index === current
        const isLeaving = index === previous && !isActive
        const className = [
          'portal-carousel__slide',
          isActive && 'is-active',
          isLeaving && 'is-leaving',
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <img
            key={image.src}
            src={image.src}
            alt=""
            aria-hidden="true"
            draggable={false}
            className={className}
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        )
      })}

      <div className="portal-carousel__shade" aria-hidden="true" />

      <div className="portal-carousel__content">{children}</div>

      <div className="portal-carousel__product">
        <span className="portal-carousel__counter" aria-hidden="true">
          {String(current + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </span>
        {currentImage.title && (
          <span className="portal-carousel__product-name">{currentImage.title}</span>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {`Product ${current + 1} of ${count}: ${currentImage.title ?? currentImage.alt ?? ''}`}
      </p>
    </section>
  )
}