import { Component, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { storeAddress, storePhone, storePhoneHref } from '../data/storeContact'

export function ServicePage({ page }: { page: string }) {
  const store = page === 'stores'
  const maintenance = page === 'maintenance'
  return <article className="service-page module-content-wrap">
    <h1>{store ? 'Visit the shop' : maintenance ? 'Store maintenance' : 'This page could not load'}</h1>
    {store && <address>{storeAddress}</address>}
    <p>{store ? <>For visiting hours, call <a href={storePhoneHref}>{storePhone}</a>.</>
      : maintenance ? 'If ordering is unavailable, you can return to the catalog or contact the shop.' : 'Try reloading the page or return to the catalog.'}</p>
    <Link className="button button-primary" to={store ? '/contact' : '/shop-all'}>{store ? 'Contact the shop' : 'Browse the catalog'}</Link>
  </article>
}

export class StoreErrorBoundary extends Component<{children: ReactNode}, {failed: boolean}> {
  state = {failed: false}
  static getDerivedStateFromError() { return {failed: true} }
  render() {
    if (this.state.failed) return <main className="service-page module-content-wrap"><h1>This page could not load</h1>
      <a className="button button-primary" href="/">Return to the storefront</a></main>
    return this.props.children
  }
}
