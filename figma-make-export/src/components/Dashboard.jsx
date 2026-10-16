import { useState, useRef, useEffect } from 'react'
import { Search, X, ExternalLink, Star, Settings, Box, Calendar, ShieldCheck } from 'lucide-react'
import iconDeal     from '../assets/icon-deal.svg'
import iconContract from '../assets/icon-contract.svg'
import AlertCard from './AlertCard'
import ScopeOverview from './ScopeOverview'
import SearchSuggestions from './SearchSuggestions'
import HomepageCustomizeModal from './HomepageCustomizeModal'
import { searchResults } from '../data/searchData'
import { ALL_APPS, LS_KEY, getFavoriteIds } from '../data/appsData'
import { APP_ICON_COLOR, appIconBase } from '../ui'
import logoGlass from '../assets/logo-glass.svg?url'
import logoComon from '../assets/logo-comon.svg?url'
import logoAsset from '../assets/logo-asset.svg?url'
import logoMitigant from '../assets/logo-mitigant.svg?url'
import logoDocManagement from '../assets/logo-docmanagement.svg?url'
import logoReporting from '../assets/logo-reporting.svg?url'

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

/* ── Shared module + table class fragments ────────────────────────── */
const MODULE   = 'flex flex-col gap-6 overflow-hidden rounded-2xl bg-surface p-4 backdrop-blur-[20px] md:gap-8 md:p-6'
const M_TITLE  = 'text-xl font-bold text-major'
const M_SUB    = 'mt-0.5 text-sm font-normal text-minor'
const DS_TH    = 'whitespace-nowrap px-3 pb-2.5 pt-0 text-left text-[11px] font-semibold uppercase tracking-[0.4px] text-minor'
const DS_CELL  = 'p-3 text-left align-middle text-base text-major'
const DS_MINOR = 'text-xs text-minor'
const DS_ICON  = 'inline-flex h-7 w-7 items-center justify-center rounded text-minor transition-colors duration-100 hover:bg-primary/10 hover:text-primary'
const DS_LINK  = 'block w-full cursor-pointer p-0 text-left text-base font-semibold text-primary underline hover:opacity-75'
/* Type and Date are dropped on narrow screens to keep the table readable. */
const HIDE_SM  = 'hidden md:table-cell'

const RECENT_DEALS = [
  { id: 1, name: 'Silverpath Infra',   client: 'Atlas Energy',             type: 'Infrastructure',   size: '150 M EUR', status: 'Signed',      date: '2025-10-28' },
  { id: 2, name: 'Energy Project',     client: 'Helios Aviation Partners',  type: 'Renewable Energy', size: '75 M EUR',  status: 'Committee',   date: '2025-11-04' },
  { id: 4, name: 'Meridian Solar II',  client: 'Meridian Renewables',      type: 'Renewable Energy', size: '60 M EUR',  status: 'Pre-closing', date: '2025-11-01' },
  { id: 3, name: 'Nordic Wind Farm',   client: 'Nordic Capital Group',     type: 'Infrastructure',   size: '45 M EUR',  status: 'KYC Review',  date: '2025-09-18' },
  { id: 6, name: 'Gaia Road Project',  client: 'Gaia Infrastructure',      type: 'Infrastructure',   size: '38 M EUR',  status: 'Committee',   date: '2025-10-12' },
]

const DEAL_STATUS_CLS = {
  'Signed':      'bg-[#e6f4ea] text-[#14851d]',
  'Pre-closing': 'bg-[#e8f0fe] text-[#1a56db]',
  'Committee':   'bg-[#fef3e2] text-[#b45309]',
  'KYC Review':  'bg-[#f3e8ff] text-[#7c3aed]',
  'Prospect':    'bg-[#f1f3f4] text-[#5e6a71]',
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

const RO_STATUS_COLOR = {
  'Effective':            { bg: '#14851d', text: '#fff'    },
  'Signed':               { bg: '#14851d', text: '#fff'    },
  'Confirmed':            { bg: '#14851d', text: '#fff'    },
  'Financed and pledged': { bg: '#14851d', text: '#fff'    },
  'Pre-closing':          { bg: '#176ec4', text: '#fff'    },
  'Draft':                { bg: '#176ec4', text: '#fff'    },
  'Terminated':           { bg: '#ee9d2b', text: '#262a2d' },
  'Archived':             { bg: '#e7e9ea', text: '#262a2d' },
  'Default':              { bg: '#5e6a71', text: '#fff'    },
}

const RECENT_OBJECTS = [
  { id: 'ro1',  objectType: 'deal',      status: 'Effective',            name: 'Silverpath Infra – Senior Secured', context: 'Silverpath Holdings SA',      openedAt: '2 min ago'   },
  { id: 'ro2',  objectType: 'document',  status: 'Effective',            name: 'SPI_2025_FacilityAgreement_v4...',  context: 'Silverpath Infra',            openedAt: '18 min ago'  },
  { id: 'ro3',  objectType: 'covenant',  status: 'Effective',            name: 'DSCR Test',                          context: 'Silverpath Infra',            openedAt: '45 min ago'  },
  { id: 'ro4',  objectType: 'deal',      status: 'Pre-closing',          name: 'Energy Project – Refinancement',     context: 'Helios Aviation Partners',    openedAt: '1 hour ago'  },
  { id: 'ro5',  objectType: 'asset',     status: 'Financed and pledged', name: 'Silverpath Solar Farm A',            context: 'Silverpath Infra',            openedAt: '2 hours ago' },
  { id: 'ro6',  objectType: 'mitigant',  status: 'Confirmed',            name: 'First Ranking Mortgage',             context: 'Silverpath Infra',            openedAt: '3 hours ago' },
  { id: 'ro7',  objectType: 'document',  status: 'Draft',                name: 'EP_2025_TermSheet_Final...',         context: 'Energy Project',              openedAt: 'Yesterday'   },
  { id: 'ro8',  objectType: 'covenant',  status: 'Effective',            name: 'Insurance Renewal',                  context: 'Energy Project',              openedAt: 'Yesterday'   },
  { id: 'ro9',  objectType: 'asset',     status: 'Financed and pledged', name: 'Wind Turbine Cluster Nord',          context: 'Silverpath Infra',            openedAt: 'Yesterday'   },
  { id: 'ro10', objectType: 'mitigant',  status: 'Confirmed',            name: 'Share Pledge – SPV',                 context: 'Silverpath Infra',            openedAt: '2 days ago'  },
]

const OBJECT_TYPE_META = {
  deal:     { label: 'Deal',     imgSrc: iconDeal,     cls: 'bg-[#176ec4]/[0.12] text-[#176ec4]' },
  document: { label: 'Document', imgSrc: iconContract, cls: 'bg-[#5e6a71]/[0.12] text-[#5e6a71]' },
  asset:    { label: 'Asset',    icon: Box,            cls: 'bg-[#14851d]/[0.12] text-[#14851d]' },
  covenant: { label: 'Covenant', icon: Calendar,       cls: 'bg-[#ae5c00]/[0.12] text-[#ae5c00]' },
  mitigant: { label: 'Mitigant', icon: ShieldCheck,    cls: 'bg-[#6e2bc4]/[0.12] text-[#6e2bc4]' },
}

const CTRL_RULE = {
  blocking:   'border-l-[#d92726]',
  regulatory: 'border-l-[#e07b28]',
  warning:    'border-l-[#e6b800]',
}
/* The leading dot is drawn with a ::before, matching the original design. */
const CTRL_BADGE = {
  blocking:   'bg-[#fde8e8] text-[#b01f1e] before:text-[#d92726]',
  regulatory: 'bg-[#fef0e6] text-[#b45309] before:text-[#e07b28]',
  warning:    'bg-[#fefce6] text-[#92660a] before:text-[#e6b800]',
}

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

export default function Dashboard({ offsetClass = '', onSearch, onNavigateDeal, onNavigatePortfolio, onNavigateClient, onNavigateApplications, onSearchBarHidden }) {
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
    <main className={`relative mt-16 min-h-[calc(100vh-64px)] transition-[margin-left] duration-200 ease-out ${offsetClass}`}>
      {/* Green banner background, with the decorative wave cut out of its base */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[340px] bg-[linear-gradient(135deg,#005740_0%,#007d57_40%,#009a6a_100%)] opacity-[0.92] after:absolute after:inset-x-0 after:bottom-0 after:h-20 after:bg-page after:content-[''] after:[clip-path:ellipse(55%_100%_at_50%_100%)] md:h-[475px]"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-[1] mx-auto flex max-w-[1200px] flex-col gap-6 p-4 md:gap-8 md:p-8">

        {/* ── Welcome header ── */}
        <header className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-2 md:flex-nowrap md:gap-4">
            <div className="flex items-center gap-2">
              <h1 className="whitespace-nowrap text-xl font-bold text-reverse md:text-2xl">Welcome, Hancock</h1>
              <span className="text-[28px] leading-none" role="img" aria-label="Waving hand">👋</span>
            </div>
            <button
              className="flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-md border-[1.5px] border-white/70 bg-transparent px-2.5 py-[5px] text-xs font-semibold text-white transition-[background-color,border-color] duration-150 hover:border-white/90 hover:bg-white/[0.12] md:px-3.5 md:py-1.5 md:text-sm"
              onClick={() => setModalOpen(true)}
            >
              <Settings size={15} strokeWidth={2} />
              Customize homepage
            </button>
          </div>

          {/* Search bar */}
          <form className="relative flex items-center" onSubmit={handleSubmit} ref={searchRef}>
            <input
              ref={inputRef}
              className="h-11 w-full rounded-full border border-[#8e979c] bg-surface py-1 pl-6 pr-[52px] text-sm font-normal text-major outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-minor focus:border-primary focus:shadow-[0_0_0_2px_rgba(0,125,87,0.15)] md:h-[52px] md:text-base"
              type="text"
              value={value}
              onChange={e => setValue(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search for a client or a deal"
              aria-label="Search for a client or a deal"
            />
            {value ? (
              <button
                type="button"
                className="absolute right-6 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-line text-minor transition-colors duration-150 hover:bg-minor hover:text-surface"
                onClick={handleClear}
                aria-label="Effacer"
              >
                <X size={14} strokeWidth={2} />
              </button>
            ) : (
              <Search size={16} strokeWidth={1.5} className="pointer-events-none absolute right-6 text-minor" />
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
                <section key="alerts" className={MODULE}>
                  <div className="flex items-start gap-2">
                    <div>
                      <h2 className={M_TITLE}>Coming up soon</h2>
                      <p className={M_SUB}>
                        A look at my upcoming alerts, reminders, and milestones over the next 30 days.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 md:flex-row">
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
                <section key="deals" className={MODULE}>
                  <div className="flex items-start gap-2">
                    <div>
                      <h2 className={M_TITLE}>Derniers deals ouverts</h2>
                      <p className={M_SUB}>Les transactions récemment ajoutées à votre portefeuille.</p>
                    </div>
                  </div>
                  <div className="-mx-4 overflow-x-auto px-4 md:-mx-6 md:px-6">
                    <table className="w-full min-w-[520px] border-collapse">
                      <thead>
                        <tr className="border-b border-line">
                          <th className={DS_TH}>Deal</th>
                          <th className={DS_TH}>Client</th>
                          <th className={`${DS_TH} ${HIDE_SM}`}>Type</th>
                          <th className={`${DS_TH} text-right`}>Montant</th>
                          <th className={DS_TH}>Statut</th>
                          <th className={`${DS_TH} ${HIDE_SM}`}>Date</th>
                          <th className={DS_TH} />
                        </tr>
                      </thead>
                      <tbody>
                        {RECENT_DEALS.map(deal => (
                          <tr
                            key={deal.id}
                            className="cursor-pointer border-b border-line transition-colors duration-100 last:border-b-0 hover:bg-primary/5"
                            onClick={() => onNavigateDeal?.(deal.id)}
                          >
                            <td className={DS_CELL}>
                              <button className={`${DS_LINK} whitespace-nowrap`} onClick={e => { e.stopPropagation(); onNavigateDeal?.(deal.id) }}>
                                {deal.name}
                              </button>
                            </td>
                            <td className={`${DS_CELL} ${DS_MINOR}`}>
                              <button className={DS_LINK} onClick={e => { e.stopPropagation(); onNavigateClient?.(deal.client) }}>
                                {deal.client}
                              </button>
                            </td>
                            <td className={`${DS_CELL} ${DS_MINOR} ${HIDE_SM}`}>{deal.type}</td>
                            <td className={`${DS_CELL} text-right font-semibold`}>{deal.size}</td>
                            <td className={DS_CELL}>
                              <span className={`inline-flex h-[22px] items-center whitespace-nowrap rounded px-2 text-[11px] font-semibold ${DEAL_STATUS_CLS[deal.status] || DEAL_STATUS_CLS.Prospect}`}>
                                {deal.status}
                              </span>
                            </td>
                            <td className={`${DS_CELL} ${DS_MINOR} ${HIDE_SM}`}>{deal.date}</td>
                            <td className={`${DS_CELL} w-9 text-center`}>
                              <button className={DS_ICON} onClick={e => { e.stopPropagation(); onNavigateDeal?.(deal.id) }} aria-label={`Ouvrir ${deal.name}`}>
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
                <section key="controls" className={MODULE}>
                  <div className="flex items-start gap-2">
                    <div>
                      <h2 className={M_TITLE}>Deals controls</h2>
                      <p className={M_SUB}>{CONTROLS.length} contrôles détectés sur vos deals actifs.</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {CONTROLS.map(ctrl => (
                      <div
                        key={ctrl.id}
                        className={`grid grid-cols-1 items-start gap-2.5 rounded-lg border border-line border-l-4 bg-surface px-4 py-3.5 md:grid-cols-[160px_1fr_220px] md:gap-4 ${CTRL_RULE[ctrl.severity]}`}
                      >
                        <div className="flex flex-col gap-1.5">
                          <span
                            className={`inline-flex w-fit items-center gap-[5px] rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.04em] before:text-[8px] before:content-['●'] ${CTRL_BADGE[ctrl.severity]}`}
                          >
                            {ctrl.severityLabel}
                          </span>
                          <p className="text-[13px] font-semibold text-major">{ctrl.object}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-semibold text-major">{ctrl.problem}</p>
                          <p className="text-[13px] leading-[1.4] text-minor">{ctrl.impact}</p>
                        </div>
                        <div className="flex flex-col gap-[3px] border-t border-line pl-0 pt-2.5 md:border-l md:border-t-0 md:pl-4 md:pt-0">
                          <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-minor">Action suggérée</p>
                          <p className="text-[13px] font-semibold text-primary">{ctrl.action}</p>
                          <p className="mt-0.5 text-xs text-minor">{ctrl.owner}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )

            case 'favorites':
              return (
                <section key="favorites" className={MODULE}>
                  <div className="flex items-start gap-2">
                    <div>
                      <h2 className={`${M_TITLE} flex items-center gap-2`}>
                        <Star size={16} strokeWidth={1.75} className="shrink-0 fill-[#f5a623] text-[#f5a623]" />
                        My favorites applications
                      </h2>
                    </div>
                  </div>
                  {favoriteApps.length > 0 ? (
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {favoriteApps.map(app => (
                        <div
                          key={app.id}
                          className="flex items-center gap-2.5 rounded-lg border border-line bg-surface px-2.5 py-2 transition-[box-shadow,border-color] duration-150 hover:border-[#b5bec3] hover:shadow-[0_2px_8px_rgba(19,21,23,0.08)] md:px-3.5 md:py-2.5"
                        >
                          {app.figmaIcon
                            ? <img src={LOGO_ICONS[app.figmaIcon]} alt="" className="h-6 w-6 shrink-0 object-contain" />
                            : <div className={`${appIconBase} ${APP_ICON_COLOR[app.iconColor] ?? APP_ICON_COLOR.green}`}>{app.letter}</div>
                          }
                          <span className="whitespace-nowrap text-sm font-semibold text-major">{app.name}</span>
                          <a
                            href="#"
                            className="ml-1 inline-flex items-center gap-[3px] whitespace-nowrap text-xs font-semibold text-primary no-underline transition-colors duration-150 hover:text-primary-hover"
                            onClick={e => e.preventDefault()}
                          >
                            Open <ExternalLink size={11} strokeWidth={1.5} />
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="px-4 py-6 text-sm text-minor">
                      No application has been added to your favorites yet.{' '}
                      <button
                        className="text-sm font-semibold text-primary underline underline-offset-2 transition-colors duration-150 hover:text-primary-hover"
                        onClick={() => onNavigateApplications?.()}
                      >
                        Go to My apps page
                      </button>
                    </p>
                  )}
                </section>
              )

            case 'recent-objects':
              return (
                <section key="recent-objects" className={MODULE}>
                  <div className="flex items-start gap-2">
                    <div>
                      <h2 className={M_TITLE}>Recently opened objects</h2>
                      <p className={M_SUB}>The last 10 objects you opened across deals, documents, assets, covenants and mitigants.</p>
                    </div>
                  </div>
                  <div className="-mx-4 overflow-x-auto px-4 md:-mx-6 md:px-6">
                    <table className="w-full min-w-[520px] border-collapse">
                      <thead>
                        <tr className="border-b border-line">
                          <th className={DS_TH}>Object</th>
                          <th className={DS_TH}>Type</th>
                          <th className={DS_TH}>Status</th>
                          <th className={`${DS_TH} ${HIDE_SM}`}>Context</th>
                          <th className={`${DS_TH} ${HIDE_SM}`}>Opened</th>
                          <th className={DS_TH} />
                        </tr>
                      </thead>
                      <tbody>
                        {RECENT_OBJECTS.map(obj => {
                          const meta = OBJECT_TYPE_META[obj.objectType]
                          const Icon = meta.icon
                          const sc = RO_STATUS_COLOR[obj.status] || RO_STATUS_COLOR['Default']
                          return (
                            <tr key={obj.id} className="border-b border-line transition-colors duration-100 last:border-b-0 hover:bg-primary/5">
                              <td className={DS_CELL}>
                                <span className="inline-flex items-center gap-[7px] text-sm font-semibold text-major">
                                  <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${meta.cls}`}>
                                    {meta.imgSrc
                                      ? <img src={meta.imgSrc} alt="" className="h-[18px] w-[18px] object-contain" />
                                      : <Icon size={18} strokeWidth={1.8} />
                                    }
                                  </span>
                                  {obj.name}
                                </span>
                              </td>
                              <td className={`${DS_CELL} ${DS_MINOR}`}>
                                {meta.label}
                              </td>
                              <td className={DS_CELL}>
                                <span
                                  className="inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-[18px]"
                                  style={{ background: sc.bg, color: sc.text }}
                                >
                                  {obj.status}
                                </span>
                              </td>
                              <td className={`${DS_CELL} ${DS_MINOR} ${HIDE_SM}`}>{obj.context}</td>
                              <td className={`${DS_CELL} ${DS_MINOR} ${HIDE_SM}`}>{obj.openedAt}</td>
                              <td className={`${DS_CELL} w-9 text-center`}>
                                <button className={DS_ICON} aria-label={`Open ${obj.name}`}>
                                  <ExternalLink size={14} strokeWidth={1.5} />
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
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
