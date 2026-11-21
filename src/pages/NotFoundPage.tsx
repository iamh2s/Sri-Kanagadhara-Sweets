import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import './NotFoundPage.css'

const suggestions = [
  { label: 'Shop all', href: '/shop-all' },
  { label: 'Gift boxes', href: '/gift-boxes' },
  { label: 'Track an order', href: '/track-order' },
  { label: 'Frequently asked questions', href: '/faq' },
  { label: 'Contact us', href: '/contact' },
]

export function NotFoundPage() {
  return (
    <section className="store-not-found" aria-labelledby="not-found-title">
      <p className="not-found-code">404</p>
      <h1 id="not-found-title">Page not found</h1>
      <p className="not-found-description">The page you’re looking for doesn’t exist or has been moved.</p>
      <nav aria-label="Suggested pages">
        <p>You might be looking for:</p>
        <ul>
          {suggestions.map(({ label, href }) => (
            <li key={href}><Link to={href}>{label}<ArrowRight size={15} aria-hidden="true" /></Link></li>
          ))}
        </ul>
      </nav>
      <div className="not-found-actions">
        <Link className="button button-primary" to="/">Go home</Link>
        <Link className="button button-outline" to="/contact">Contact support</Link>
      </div>
    </section>
  )
}
