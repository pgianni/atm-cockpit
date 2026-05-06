import { useState, useRef, useEffect } from 'react'
import { Search, X, ExternalLink, Star, Settings } from 'lucide-react'
import AlertCard from './AlertCard'
import ScopeOverview from './ScopeOverview'
import SearchSuggestions from './SearchSuggestions'
import HomepageCustomizeModal from './HomepageCustomizeModal'
import { searchResults } from '../data/searchData'
import { ALL_APPS, LS_KEY, getFavoriteIds } from '../data/appsData'
import logoGlass from '../assets/logo-glass.svg?url'
import logoComon from '../assets/logo-comon.svg?url'
import logoAsset from '../assets/logo-asset.svg?url'
import logoMitigant from '../assets/logo-mitigant.svg?url'
import logoDocManagement from '../assets/logo-docmanagement.svg?url'
import logoReporting from '../assets/logo-reporting.svg?url'
import './Dashboard.css'

const HOMEPAGE_WIDGETS_KEY = 'cockpit_homepage_widgets'
const DEFAULT_WIDGET_ORDER = ['alerts', 'scope', 'deals', 'controls', 'favorites']

function loadWidgetOrder() {
  try {
    const stored = localStorage.getItem(HOMEPAGE_WIDGETS_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {}
  return DEFAULT_WIDGET_ORDER
}

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

const CONTROLS = [
  {
    id: 1,
    severity: 'blocking',
    severityLabel: 'Operational',
    object: 'Tranche TLB-01',
    problem: 'Tranche sans plan d\'amortissement',
    impact: 'Impossible de calculer les échéances → bloque le booking',
    action: 'Ajouter un amortization schedule',
    owner: 'Front Office / Structuration',
  },
  {
    id: 2,
    severity: 'regulatory',
    severityLabel: 'Regulatory',
    object: 'Deal (niveau global)',
    problem: 'Bâle portfolio incorrect (Corporate au lieu de Specialized Lending)',
    impact: 'Risque de non-conformité sur RWA et capital réglementaire',
    action: 'Vérifier classification avec Risk / Coverage',
    owner: 'Risk / Front Office',
  },
  {
    id: 3,
    severity: 'regulatory',
    severityLabel: 'Counterparty',
    object: 'Orion Tech Subsidiary GmbH',
    problem: 'KYC incomplet (UBO non validé)',
    impact: 'Blocage réglementaire avant booking',
    action: 'Relancer équipe KYC',
    owner: 'KYC / Compliance',
  },
  {
    id: 4,
    severity: 'warning',
    severityLabel: 'Revenues',
    object: 'Facility Fee',
    problem: 'Fee calculée sans prorata temporis',
    impact: 'Mauvais P&L (non bloquant)',
    action: 'Corriger formule de calcul',
    owner: 'Middle Office / Product Control',
  },
]

export default function Dashboard({ style, onSearch, onNavigateDeal, onNavigatePortfolio, onNavigateClient, onNavigateApplications, onSearchBarHidden }) {
  const [value,   setValue]   = useState('')
  const [focused, setFocused] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [widgetOrder, setWidgetOrder] = useState(() => loadWidgetOrder())
  const inputRef   = useRef(null)
  const searchRef  = useRef(null)

  useEffect(() => {
    if (!searchRef.current) return
    const obs = new IntersectionObserver(
      ([entry]) => onSearchBarHidden?.(!entry.isIntersecting),
      { threshold: 0 }
    )
    obs.observe(searchRef.current)
    return () => obs.disconnect()
  }, [onSearchBarHidden])

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

  function handleSaveWidgets(newOrder) {
    setWidgetOrder(newOrder)
    try { localStorage.setItem(HOMEPAGE_WIDGETS_KEY, JSON.stringify(newOrder)) } catch {}
  }

  return (
    <main className="dashboard" style={style}>
      {/* Green banner background */}
      <div className="dashboard__banner" aria-hidden="true" />

      {/* Content */}
      <div className="dashboard__content">

        {/* ── Welcome header ── */}
        <header className="dashboard__header">
          <div className="dashboard__header-top">
            <div className="dashboard__welcome">
              <h1 className="dashboard__welcome-text">Welcome, Hancock</h1>
              <span className="dashboard__wave" role="img" aria-label="Waving hand">👋</span>
            </div>
            <button className="dashboard__customize-btn" onClick={() => setModalOpen(true)}>
              <Settings size={15} strokeWidth={2} />
              Customize homepage
            </button>
          </div>

          {/* Search bar */}
          <form className="dashboard__search" onSubmit={handleSubmit} ref={searchRef}>
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

        {/* ── Dynamic widget sections ── */}
        {widgetOrder.map(id => {
          switch (id) {
            case 'alerts':
              return (
                <section key="alerts" className="module">
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
              )

            case 'scope':
              return <ScopeOverview key="scope" onNavigatePortfolio={onNavigatePortfolio} />

            case 'deals':
              return (
                <section key="deals" className="module">
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
              )

            case 'controls':
              return (
                <section key="controls" className="module">
                  <div className="module__header">
                    <div>
                      <h2 className="module__title">Deals controls</h2>
                      <p className="module__subtitle">{CONTROLS.length} contrôles détectés sur vos deals actifs.</p>
                    </div>
                  </div>
                  <div className="ds-controls">
                    {CONTROLS.map(ctrl => (
                      <div key={ctrl.id} className={`ds-ctrl ds-ctrl--${ctrl.severity}`}>
                        <div className="ds-ctrl__left">
                          <span className={`ds-ctrl__badge ds-ctrl__badge--${ctrl.severity}`}>{ctrl.severityLabel}</span>
                          <p className="ds-ctrl__object">{ctrl.object}</p>
                        </div>
                        <div className="ds-ctrl__body">
                          <p className="ds-ctrl__problem">{ctrl.problem}</p>
                          <p className="ds-ctrl__impact">{ctrl.impact}</p>
                        </div>
                        <div className="ds-ctrl__right">
                          <p className="ds-ctrl__action-label">Action suggérée</p>
                          <p className="ds-ctrl__action">{ctrl.action}</p>
                          <p className="ds-ctrl__owner">{ctrl.owner}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )

            case 'favorites':
              return (
                <section key="favorites" className="module">
                  <div className="module__header">
                    <div>
                      <h2 className="module__title ds-fav__title">
                        <Star size={16} strokeWidth={1.75} className="ds-fav__star" />
                        My favorites applications
                      </h2>
                    </div>
                  </div>
                  {favoriteApps.length > 0 ? (
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
                  ) : (
                    <p className="ds-fav__empty">
                      No application has been added to your favorites yet.{' '}
                      <button className="ds-fav__empty-link" onClick={() => onNavigateApplications?.()}>
                        Go to My applications page
                      </button>
                    </p>
                  )}
                </section>
              )

            default:
              return null
          }
        })}

      </div>

      <HomepageCustomizeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        selection={widgetOrder}
        onSave={handleSaveWidgets}
      />
    </main>
  )
}
