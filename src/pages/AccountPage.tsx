import { ArrowRight, Heart, PackageCheck } from 'lucide-react'
import type { ModulePagesProps } from './ModulePages'

export function AccountPage({ onNavigate }: Pick<ModulePagesProps, 'onNavigate'>) {
  return (
    <div id="module-content" className="account-page">
      <section className="account-editorial">
        <div className="account-image" data-aos="fade-right">
          <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1600&q=90" alt="A box of celebratory sweets" loading="lazy" />
          <span>YOUR NEXT<br />SWEET MOMENT</span>
        </div>
        <div className="account-copy" data-aos="fade-left">
          <span className="account-icon-large"><Heart size={23} /></span>
          <p className="module-kicker module-kicker-dark"><span /> YOUR KANAGADHARA</p>
          <h2>A familiar favourite<br />is never far <em>away.</em></h2>
          <p>Online accounts and order history are currently unavailable.</p>
          <div className="account-benefit"><PackageCheck size={17} /><span>Order support, with a personal touch</span></div>
          <a className="button button-primary" href="/contact" onClick={(event) => { event.preventDefault(); onNavigate('contact') }}>Contact our team <ArrowRight size={15} /></a>
        </div>
      </section>
    </div>
  )
}
