import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import './card-carousel.css'

export type CardCarouselImage = {
  src: string
  title: string
  route: string
}

type CardCarouselProps = {
  images: CardCarouselImage[]
  className?: string
  onSelect: (route: string) => void
}

export function CardCarousel({ images, className = '', onSelect }: CardCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(images.length)
  const [viewportWidth, setViewportWidth] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const observer = new ResizeObserver(([entry]) => {
      setViewportWidth(entry.contentRect.width)
    })
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setActiveIndex((index) => {
      if (!images.length) return 0
      return images.length + ((index % images.length) + images.length) % images.length
    })
  }, [images.length])

  useEffect(() => {
    if (images.length < 2 || isHovered || reduceMotion) return

    const timer = window.setInterval(() => setActiveIndex((index) => index + 1), 4000)
    return () => window.clearInterval(timer)
  }, [images.length, isHovered, reduceMotion])

  if (images.length === 0) return null

  const categoryIndex = ((activeIndex % images.length) + images.length) % images.length
  const slideWidth = viewportWidth <= 600 ? 124 : viewportWidth <= 900 ? 148 : 166
  const offset = (viewportWidth - slideWidth) / 2 - activeIndex * slideWidth
  const activeImage = images[categoryIndex]
  const transition = reduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, bounce: 0.12, duration: 0.75 }

  const toPrev = () => setActiveIndex((index) => index - 1)
  const toNext = () => setActiveIndex((index) => index + 1)
  const centerRepeatedSlides = () => {
    if (activeIndex < images.length || activeIndex >= images.length * 2) {
      setActiveIndex(images.length + categoryIndex)
    }
  }

  return (
    <div
      className={`category-carousel ${className}`.trim()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="category-carousel__viewport" ref={viewportRef}>
        <motion.div
          className="category-carousel__track"
          animate={{ x: offset }}
          transition={transition}
          onAnimationComplete={centerRepeatedSlides}
        >
          {[-1, 0, 1].flatMap((copy) =>
            images.map((item, index) => {
              const slideIndex = (copy + 1) * images.length + index
              const isActive = activeIndex === slideIndex
              const distance = slideIndex - activeIndex

              return (
                <motion.div
                  className="category-carousel__slide"
                  key={`${copy}-${item.title}-${item.src}`}
                  style={{ width: slideWidth }}
                  animate={{
                    rotate: isHovered ? distance * 5 : 0,
                    scale: isActive ? 1 : isHovered ? 0.82 : 0.9,
                    y: isHovered ? Math.min(Math.abs(distance) * 5, 15) : 0,
                    opacity: isActive ? 1 : 0.72,
                  }}
                  transition={transition}
                >
                  <button
                    type="button"
                    className="category-carousel__image-button"
                    aria-label={`Select ${item.title}`}
                    aria-pressed={isActive}
                    onClick={() => setActiveIndex(slideIndex)}
                  >
                    <img src={item.src} alt="" loading="lazy" />
                  </button>
                  <span className={isActive ? 'category-carousel__title is-active' : 'category-carousel__title'}>
                    {item.title}
                  </span>
                </motion.div>
              )
            }),
          )}
        </motion.div>
      </div>

      <div className="category-carousel__controls" aria-label="Category carousel controls">
        <button
          type="button"
          className="category-carousel__arrow"
          onClick={toPrev}
          aria-label="Previous category"
        >
          <ChevronLeft size={17} />
        </button>
        <div className="category-carousel__dots" aria-label="Choose a category">
          {images.map((item, index) => (
            <button
              type="button"
              key={item.title}
              className={index === categoryIndex ? 'category-carousel__dot is-active' : 'category-carousel__dot'}
              aria-label={`Show ${item.title}`}
              aria-current={index === categoryIndex ? 'true' : undefined}
              onClick={() => setActiveIndex(images.length + index)}
            />
          ))}
        </div>
        <button
          type="button"
          className="category-carousel__arrow"
          onClick={toNext}
          aria-label="Next category"
        >
          <ChevronRight size={17} />
        </button>
      </div>

      <a
        href={`/${activeImage.route}`}
        className="category-carousel__shop"
        onClick={event => {
          if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
          event.preventDefault()
          onSelect(activeImage.route)
        }}
      >
        Shop {activeImage.title} <ArrowRight size={15} aria-hidden="true" />
      </a>
    </div>
  )
}

export default CardCarousel
