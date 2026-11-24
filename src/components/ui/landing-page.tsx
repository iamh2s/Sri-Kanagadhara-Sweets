
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PortalCarousel from './portal-carousel'
import './landingpage.css'

const heroImages = [
  {
    src: '/brand/hero-slide-1.webp',
    alt: 'Golden Mysore Pak sweets on a brass plate',
    title: 'Mysore Pak',
  },
  {
    src: '/brand/hero-slide-2.webp',
    alt: 'Kaju Katli topped with pistachios',
    title: 'Kaju Katli',
  },
  {
    src: '/brand/hero-slide-3.webp',
    alt: 'Motichoor laddus on a festive plate',
    title: 'Motichoor Laddu',
  },
  {
    src: '/brand/hero-slide-4.webp',
    alt: 'Badusha sweets arranged on a banana leaf',
    title: 'Badusha',
  },
  {
    src: '/brand/hero-slide-5.webp',
    alt: 'Golden peda topped with pistachios on a festive plate',
    title: 'Peda',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <PortalCarousel
      images={heroImages}
      slideDuration={3000}
    >
      <div className="portal-landing-copy">

        <p className="portal-landing-eyebrow">
          Freshly made, rooted in tradition
        </p>

        <h1 className="portal-landing-title">
          Tradition, shared
          <br />
          in <em>every bite.</em>
        </h1>

        <p className="portal-landing-description">
          Discover handcrafted Indian sweets and savouries,
          made with care for every celebration and every
          moment worth sharing.
        </p>

        <a
          className="portal-landing-cta"
          href="/shop-all"
          onClick={(event) => {
            event.preventDefault()
            navigate('/shop-all')
          }}
        >
          Shop our favourites
          <ArrowRight size={16} aria-hidden="true" />
        </a>

      </div>
    </PortalCarousel>
  )
}
