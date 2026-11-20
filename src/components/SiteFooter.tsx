import { BrandMark } from './Navbar'
import { storeContactEmail, storeEmailLink } from '../data/storeContact'

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
          <p className="footer-setup-note">Official social links will appear here once confirmed.</p>
        </div>
        <div className="footer-links">
          <h3>Explore</h3>
          <a href="/shop-all" onClick={(event) => navigate(event, 'shop-all')}>Shop all</a>
          <a href="/sweets" onClick={(event) => navigate(event, 'sweets')}>Sweets</a>
          <a href="/savouries" onClick={(event) => navigate(event, 'savouries')}>Savouries</a>
          <a href="/gift-boxes" onClick={(event) => navigate(event, 'gift-boxes')}>Gift boxes</a>
        </div>
        <div className="footer-links">
          <h3>Here to help</h3>
          <a href="/contact" onClick={(event) => navigate(event, 'contact')}>Contact us</a>
          <span>Shipping policy — details to be confirmed</span>
          <span>Returns policy — details to be confirmed</span>
          <span>Privacy and terms — details to be confirmed</span>
        </div>
        <div className="footer-contact">
          <h3>Say hello</h3>
          <p>Questions, a special request, or just want to talk sweets?</p>
          <a href="/contact" onClick={(event) => navigate(event, 'contact')}>Open the contact page</a>
          {storeContactEmail && <a href={storeEmailLink('Store inquiry')}>{storeContactEmail}</a>}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Kanagadhara Sweets. Made with a little sweetness.</span>
        <div><a href="#home">Back to top ↑</a></div>
      </div>
    </footer>
  )
}
