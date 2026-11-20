import type { CSSProperties, ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import './hero-3.css'

export type HeroMarqueeImage = {
  src: string
  alt: string
}

type AnimatedMarqueeHeroProps = {
  ariaLabel?: string
  copyDelay?: number
  tagline: string
  title: ReactNode
  description: string
  ctaText: string
  ctaHref: string
  images: HeroMarqueeImage[]
  onCtaClick: () => void
}

export function AnimatedMarqueeHero({
  ariaLabel = 'Welcome to Sri Kanagadhara Sweets',
  copyDelay = 0,
  tagline,
  title,
  description,
  ctaText,
  ctaHref,
  images,
  onCtaClick,
}: AnimatedMarqueeHeroProps) {
  const reduceMotion = useReducedMotion()
  const imageSet = images.length ? images : []
  const textDelay = reduceMotion ? 0 : copyDelay

  return (
    <section className="animated-marquee-hero" aria-label={ariaLabel}>
      <div
        className="animated-marquee-hero-copy"
        style={{ '--copy-delay': `${textDelay}s` } as CSSProperties}
      >
        <motion.p className="animated-marquee-tagline">
          <span aria-hidden="true" />
          {tagline}
        </motion.p>

        <motion.h1 className="animated-marquee-title">
          {title}
        </motion.h1>

        <motion.p className="animated-marquee-description">
          {description}
        </motion.p>

        <div className="animated-marquee-cta-reveal">
          <motion.a
            className="animated-marquee-cta"
            href={ctaHref}
            whileHover={reduceMotion ? undefined : { scale: 1.04 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            onClick={(event) => {
              event.preventDefault()
              onCtaClick()
            }}
          >
            {ctaText}
          </motion.a>
        </div>
      </div>

      <div className="animated-marquee-window" aria-label="A selection of our traditional sweets">
        <motion.div
          className="animated-marquee-track"
          aria-hidden="true"
          animate={reduceMotion ? { x: 0 } : { x: ['0%', '-50%'] }}
          transition={reduceMotion ? { duration: 0 } : { ease: 'linear', duration: 42, repeat: Infinity }}
        >
          {[0, 1].map((copy) => (
            <div className="animated-marquee-group" key={copy}>
              {imageSet.map((image, index) => (
                <div
                  className="animated-marquee-card"
                  key={`${copy}-${image.src}-${index}`}
                  style={{ rotate: index % 2 === 0 ? '-2deg' : '2deg' }}
                >
                  <img
                    src={image.src}
                    alt=""
                    loading={copy === 0 && index < 4 ? 'eager' : 'lazy'}
                  />
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
      <span className="sr-only">{imageSet.map((image) => image.alt).join(', ')}</span>
    </section>
  )
}
