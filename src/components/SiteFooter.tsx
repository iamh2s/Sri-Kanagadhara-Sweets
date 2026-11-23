import { Link } from 'react-router-dom'
import { BrandMark } from './Navbar'
import { contactLinks, storeAddress, storeContactEmail, storeEmailLink, storePhone, storePhoneHref } from '../data/storeContact'

type SiteFooterProps = {
  onNavigate: (path: string) => void
}

export function SiteFooter({ onNavigate }: SiteFooterProps) {
  const navigate = (event: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    event.preventDefault()
    onNavigate(path)
  }

  return (
    <footer className="site-footer" id="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <BrandMark light onNavigate={() => onNavigate('home')} />
          <p>A little sweetness for the moments that bring us together. Rooted in tradition, made for sharing.</p>
        </div>
        <div className="footer-links">
          <h3>Explore</h3>
          <a href="/shop-all" onClick={(event) => navigate(event, 'shop-all')}>Shop all</a>
          <a href="/sweets" onClick={(event) => navigate(event, 'sweets')}>Sweets</a>
          <a href="/savouries" onClick={(event) => navigate(event, 'savouries')}>Savouries</a>
          <a href="/gift-boxes" onClick={(event) => navigate(event, 'gift-boxes')}>Gift boxes</a>
          <Link to="/festival-preorders">Festival pre-orders</Link>
          <Link to="/bulk-enquiry">Bulk and corporate orders</Link>
        </div>
        <div className="footer-links">
          <h3>Here to help</h3>
          {contactLinks.map(link => <Link key={link.href} to={link.href}>{link.label}</Link>)}
        </div>
        <div className="footer-contact">
          <h3>Say hello</h3>
          <Link to="/stores">{storeAddress}</Link>
          <a href={storePhoneHref}>Call {storePhone}</a>
          <a href="/contact" onClick={(event) => navigate(event, 'contact')}>Open the contact page</a>
          {storeContactEmail && <a href={storeEmailLink('Store inquiry')}>{storeContactEmail}</a>}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Kanagadhara Sweets. Made with a little sweetness.</span>
        <div><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/admin">Admin preview</Link><button type="button" onClick={() => window.scrollTo({top:0})}>Back to top ↑</button></div>
      </div>
    </footer>
  )
}
