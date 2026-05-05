import { useState, useRef, useEffect } from 'react'
import { Search, X, ExternalLink, Star } from 'lucide-react'
import AlertCard from './AlertCard'
import ScopeOverview from './ScopeOverview'
import SearchSuggestions from './SearchSuggestions'
import { searchResults } from '../data/searchData'
import { ALL_APPS, LS_KEY, getFavoriteIds } from '../data/appsData'
import logoGlass from '../assets/logo-glass.svg?url'
import logoComon from '../assets/logo-comon.svg?url'
import logoAsset from '../assets/logo-asset.svg?url'
import logoMitigant from '../assets/logo-mitigant.svg?url'
import logoDocManagement from '../assets/logo-docmanagement.svg?url'
import logoReporting from '../assets/logo-reporting.svg?url'
import './Dashboard.css'

const LOGO_ICONS = { glass: logoGlass, comon: logoComon, asset: logoAsset, mitigant: logoMitigant, docmanagement: logoDocManagement, reporting: logoReporting }

const RECENT_DEALS = [
  { id: 1, name: 'Silverpath Infra',   client: 'Atlas Energy',             type: 'Infrastructure',   size: '150 M EUR', status: 'Signed',      date: '2025-10-28' },
  { id: 2, name: 'Energy Project',     client: 'Helios Aviation Partners',  type: 'Renewable Energy', size: '75 M EUR',  status: 'Committee',   date: '2025-11-04' },
  { id: 4, name: 'Meridian Solar II',  client: 'Meridian Renewables',      type: 'Renewable Energy', size: '60 M EUR',  status: 'Pre-closing', date: '2025-11-01' },
  { id: 3, name: 'Nordic Wind Farm',   client: 'Nordic Capital Group',     type: 'Infrastructure',   size: '45 M EUR',  status: 'KYC Review',  date: '2025-09-18' },
  { id: 6, name: 'Gaia Road Project',  client: 'Gaia Infrastructure',      type: 'Infrastructure',   size: '38 M EUR',  status: 'Committee',   date: '2025-10-12' },
]

const DEAL_STATUS_CLS = {
  'Signed':      'ds-badge--green',
  'Pre-closing': 'ds-badge--blue',
  'Committee':   'ds-badge--orange',
  'KYC Review':  'ds-badge--purple',
  'Prospect':    'ds-badge--grey',
}

const ALERTS = [
  {
    id: 1,
    dealId: 1,
    tag: 'Critical alert',
    tagVariant: 'danger',
    title: 'New signed deal: Silverpath Infra',
    linkLabel: 'See deal',
    description: 'Signed on 2025-10-28 for a size of 150 M EUR.',
    clients: [{ name: 'Atlas Energy' }, { name: 'Gaia Infrastructure' }],
  },
  {
    id: 2,
    dealId: 2,
    tag: null,
    title: 'Status update: Energy Project',
    linkLabel: 'See opportunity',
    description: 'Status updated to "BOM Committee".',
    clients: [{ name: 'Helios Aviation Partners' }],
  },
]

export default function Dashboard({ style, onSearch, onNavigateDeal, onNavigatePortfolio, onNavigateClient }) {
  const [value,   setValue]   = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)

  const suggestions  = focused ? searchResults(value) : []
  const showDropdown = focused && value.length >= 2

  function handleSubmit(e) {
    e.preventDefault()
    if (value.trim() && onSearch) onSearch(value.trim())
  }

  function handleSelectItem(item) {
    setValue(item.title)
    onSearch?.(item.title)
    setFocused(false)
  }

  function handleClear() {
    setValue('')
    inputRef.current?.focus()
  }

  const [favIds, setFavIds] = useState(() => getFavoriteIds())

  // Stay in sync when the user changes favorites from another page
  useEffect(() => {
    function onStorage(e) {
      if (e.key === LS_KEY) setFavIds(getFavoriteIds())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const favoriteApps = ALL_APPS.filter(a => favIds.has(a.id))

  return (
    <main className="dashboard" style={style}>
      {/* Green banner background */}
      <div className="dashboard__banner" aria-hidden="true" />

      {/* Content */}
      <div className="dashboard__content">

        {/* ── Welcome header ── */}
        <header className="dashboard__header">
          <div className="dashboard__welcome">
            <h1 className="dashboard__welcome-text">Welcome, Hancock</h1>
            <span className="dashboard__wave" role="img" aria-label="Waving hand">👋</span>
          </div>

          {/* Search bar */}
          <form className="dashboard__search" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              className="dashboard__search-input"
              type="text"
              value={value}
              onChange={e => setValue(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search for a client or a deal"
              aria-label="Search for a client or a deal"
            />
            {value ? (
              <button type="button" className="dashboard__search-clear" onClick={handleClear} aria-label="Effacer">
                <X size={14} strokeWidth={2} />
              </button>
            ) : (
              <Search size={16} strokeWidth={1.5} className="dashboard__search-icon" />
            )}
            {showDropdown && (
              <SearchSuggestions
                query={value}
                results={suggestions}
                onSelect={handleSelectItem}
                onSeeAll={q => { onSearch?.(q); setFocused(false) }}
              />
            )}
          </form>
        </header>

        {/* ── Alerts module ── */}
        <section className="module">
          <div className="module__header">
            <div>
              <h2 className="module__title">Coming up soon</h2>
              <p className="module__subtitle">
                A look at my upcoming alerts, reminders, and milestones over the next 30 days.
              </p>
            </div>
          </div>

          <div className="module__cards">
            {ALERTS.map(alert => (
              <AlertCard key={alert.id} {...alert} onNavigate={() => onNavigateDeal?.(alert.dealId)} />
            ))}
          </div>
        </section>

        {/* ── Scope overview module ── */}
        <ScopeOverview onNavigatePortfolio={onNavigatePortfolio} />

        {/* ── Recent deals module ── */}
        <section className="module">
          <div className="module__header">
            <div>
              <h2 className="module__title">Derniers deals ouverts</h2>
              <p className="module__subtitle">Les transactions récemment ajoutées à votre portefeuille.</p>
            </div>
          </div>

          <div className="ds-table-wrap">
            <table className="ds-table">
              <thead>
                <tr className="ds-table__head-row">
                  <th className="ds-table__th">Deal</th>
                  <th className="ds-table__th">Client</th>
                  <th className="ds-table__th ds-table__th--hidden-sm">Type</th>
                  <th className="ds-table__th ds-table__th--right">Montant</th>
                  <th className="ds-table__th">Statut</th>
                  <th className="ds-table__th ds-table__th--hidden-sm">Date</th>
                  <th className="ds-table__th" />
                </tr>
              </thead>
              <tbody>
                {RECENT_DEALS.map(deal => (
                  <tr
                    key={deal.id}
                    className="ds-table__row"
                    onClick={() => onNavigateDeal?.(deal.id)}
                  >
                    <td className="ds-table__cell ds-table__cell--name">
                      <button className="ds-table__name-btn" onClick={e => { e.stopPropagation(); onNavigateDeal?.(deal.id) }}>
                        {deal.name}
                      </button>
                    </td>
                    <td className="ds-table__cell ds-table__cell--minor">
                      <button className="ds-table__client-btn" onClick={e => { e.stopPropagation(); onNavigateClient?.(deal.client) }}>
                        {deal.client}
                      </button>
                    </td>
                    <td className="ds-table__cell ds-table__cell--minor ds-table__cell--hidden-sm">{deal.type}</td>
                    <td className="ds-table__cell ds-table__cell--right ds-table__cell--bold">{deal.size}</td>
                    <td className="ds-table__cell">
                      <span className={`ds-badge ${DEAL_STATUS_CLS[deal.status] || 'ds-badge--grey'}`}>{deal.status}</span>
                    </td>
                    <td className="ds-table__cell ds-table__cell--minor ds-table__cell--hidden-sm">{deal.date}</td>
                    <td className="ds-table__cell ds-table__cell--action">
                      <button className="ds-table__icon-btn" onClick={e => { e.stopPropagation(); onNavigateDeal?.(deal.id) }} aria-label={`Ouvrir ${deal.name}`}>
                        <ExternalLink size={14} strokeWidth={1.5} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Favorite apps ── */}
        {favoriteApps.length > 0 && (
          <section className="module">
            <div className="module__header">
              <div>
                <h2 className="module__title ds-fav__title">
                  <Star size={16} strokeWidth={1.75} className="ds-fav__star" />
                  My favorites
                </h2>
              </div>
            </div>
            <div className="ds-fav__grid">
              {favoriteApps.map(app => (
                <div key={app.id} className="ds-fav__card">
                  {app.figmaIcon
                    ? <img src={LOGO_ICONS[app.figmaIcon]} alt="" className="ds-fav__icon" />
                    : <div className={`app-icon app-icon--${app.iconColor}`}>{app.letter}</div>
                  }
                  <span className="ds-fav__name">{app.name}</span>
                  <a href="#" className="ds-fav__link" onClick={e => e.preventDefault()}>
                    Open <ExternalLink size={11} strokeWidth={1.5} />
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  )
}
