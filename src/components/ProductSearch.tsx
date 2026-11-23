import { useId, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { catalogSlug } from '../../shared/catalogSlug'
import type { Product } from '../pages/ModulePages'
import './ProductSearch.css'

type EnquirySweet = Pick<Product, 'name' | 'category'>
type SearchItem = Product | EnquirySweet

export function matchesProduct(product: SearchItem, query: string) {
  const description = 'description' in product ? product.description : ''
  return `${product.name} ${description} ${product.category}`.toLowerCase().includes(query)
}

export function ProductSearch({ products, enquiries, initialQuery, label, header = false, onSearch, onNavigate }: {
  products: Product[]
  enquiries: EnquirySweet[]
  initialQuery: string
  label: string
  header?: boolean
  onSearch: (query: string) => void
  onNavigate: (route: string) => void
}) {
  const [value, setValue] = useState(initialQuery)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const listId = useId()
  const list = useRef<HTMLUListElement>(null)
  const query = value.trim().toLowerCase()
  const matches = [...products, ...enquiries].filter(product => matchesProduct(product, query))
    .sort((a, b) => Number(b.name.toLowerCase().startsWith(query)) - Number(a.name.toLowerCase().startsWith(query)))
    .slice(0, 5)

  function close() { setOpen(false); setActive(-1) }
  function select(product: SearchItem) {
    close()
    if ('id' in product) onNavigate(`products/${catalogSlug(product.name)}`)
    else onSearch(product.name)
  }

  return <form className={header ? 'product-search ks-search-form' : 'product-search'} role="search" aria-label={label}
    onSubmit={event => { event.preventDefault(); close(); onSearch(value.trim()) }}>
    <Search size={header ? 20 : 18} aria-hidden="true" />
    <input name="q" type="search" role="combobox" aria-label={label} aria-autocomplete="list"
      aria-expanded={open} aria-controls={listId}
      aria-activedescendant={open && matches[active] ? `${listId}-${active}` : undefined}
      autoComplete="off" autoFocus={header} maxLength={100} value={value}
      placeholder={header ? 'Search Mysore Pak, Laddu, Murukku...' : label}
      onFocus={() => setOpen(true)} onClick={() => setOpen(true)} onBlur={close}
      onChange={event => { setValue(event.target.value); setActive(-1); setOpen(true) }}
      onKeyDown={event => {
        if (event.nativeEvent.isComposing) return
        if (event.key === 'Escape' && open) {
          event.preventDefault(); event.stopPropagation(); close()
        } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault()
          setOpen(true)
          if (!matches.length) return
          const next = event.key === 'ArrowDown' ? (active + 1) % matches.length
            : active <= 0 ? matches.length - 1 : active - 1
          setActive(next)
          list.current?.children[next]?.scrollIntoView({ block: 'nearest' })
        } else if (event.key === 'Enter' && open && matches[active]) {
          event.preventDefault(); select(matches[active])
        }
      }} />
    <button className={header ? 'ks-search-submit' : undefined} type="submit">Search</button>
    <div className="product-search-popup" hidden={!open}>
      <ul id={listId} ref={list} role="listbox" aria-label="Suggested products">
        {matches.map((product, index) => <li role="option" id={`${listId}-${index}`} key={product.name}
          aria-selected={index === active} onMouseDown={event => event.preventDefault()} onClick={() => select(product)}>
          <span>{product.name}</span><small>{'id' in product ? product.category : 'Enquire by phone'}</small>
        </li>)}
      </ul>
      {!matches.length && <p role="status">No matching products.</p>}
    </div>
  </form>
}
