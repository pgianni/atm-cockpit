import { useState, useEffect } from 'react'
import {
  ChevronRight, ChevronUp, ChevronDown, MessageSquare, Download, Search,
  Network, Bell, Activity, Briefcase, Target, FolderOpen, ExternalLink,
  Eye, FileText, Gauge, ArrowUpDown, Filter,
} from 'lucide-react'
import './ClientsPage.css'

/* ── Clients database ─────────────────────────────────────────────── */
const CLIENTS_DB = {
  'Helios Aviation Partners': {
    name: 'Helios Aviation Partners',
    cpyId: '9876543210',
    subClientName: 'Helios Energy SPV',
    subClientId: '111222',
    coverage: 'A. Dupont',
    internalRating: 'A',
    nextReview: '20/07/2026',
    kyc: 'Verified',
    region: 'EMEA · France',
    sector: 'Air Transport & Aerospace',
    subSector: 'Capital Goods / Air Transport & Aerospace',
    parent: { cphName: 'Helios Group', cphId: '654321', rootClientName: 'Helios Group', rootClientId: '654321', rootClientSector: 'Capital Goods / Air Transport & Aerospace' },
    exposure: [
      { label: 'Booked deals', value: '2' }, { label: 'Opportunities', value: '1' }, { label: 'Year-to-Date NBI', value: '12.4 M EUR' },
      { label: 'Commitment', value: '125 M EUR' }, { label: 'Utilisation', value: '83 M EUR (66%)' }, { label: 'Pipeline NBI Simulation', value: '5.8 M EUR' },
    ],
  },
  'Atlas Energy': {
    name: 'Atlas Energy',
    cpyId: '1234567890',
    subClientName: 'Atlas Infra SPV',
    subClientId: '12345',
    coverage: 'C. Beckendorf',
    internalRating: 'BBB+',
    nextReview: '15/09/2026',
    kyc: 'Verified',
    region: 'EMEA · Spain',
    sector: 'Energy',
    subSector: 'Oil & Gas / Infrastructure',
    parent: { cphName: 'Atlas Holdings', cphId: '123456', rootClientName: 'Atlas Group', rootClientId: '123456', rootClientSector: 'Energy / Infrastructure' },
    exposure: [
      { label: 'Booked deals', value: '3' }, { label: 'Opportunities', value: '2' }, { label: 'Year-to-Date NBI', value: '18.2 M EUR' },
      { label: 'Commitment', value: '180 M EUR' }, { label: 'Utilisation', value: '150 M EUR (83%)' }, { label: 'Pipeline NBI Simulation', value: '9.4 M EUR' },
    ],
  },
  'Silverpath Holdings SA': {
    name: 'Silverpath Holdings SA',
    cpyId: '1234567890',
    subClientName: 'Silverpath Infra SPV',
    subClientId: '654321',
    coverage: 'P. Jackson',
    internalRating: 'BBB+',
    nextReview: '15/09/2026',
    kyc: 'Verified',
    region: 'EMEA · Netherlands',
    sector: 'Infrastructure',
    subSector: 'Transport & Logistics',
    parent: { cphName: 'Silverpath Group', cphId: '123456', rootClientName: 'Silverpath Group', rootClientId: '123456', rootClientSector: 'Infrastructure / Transport' },
    exposure: [
      { label: 'Booked deals', value: '2' }, { label: 'Opportunities', value: '0' }, { label: 'Year-to-Date NBI', value: '9.1 M EUR' },
      { label: 'Commitment', value: '120 M EUR' }, { label: 'Utilisation', value: '120 M EUR (100%)' }, { label: 'Pipeline NBI Simulation', value: '0 M EUR' },
    ],
  },
  'Meridian Renewables': {
    name: 'Meridian Renewables', cpyId: '5566778899', subClientName: 'Meridian Wind SPV', subClientId: '998877',
    coverage: 'A. Chase', internalRating: 'A-', nextReview: '10/03/2026', kyc: 'Verified',
    region: 'EMEA · Germany', sector: 'Renewable Energy', subSector: 'Wind & Solar',
    parent: { cphName: 'Meridian Group', cphId: '556677', rootClientName: 'Meridian Group', rootClientId: '556677', rootClientSector: 'Renewable Energy' },
    exposure: [
      { label: 'Booked deals', value: '2' }, { label: 'Opportunities', value: '1' }, { label: 'Year-to-Date NBI', value: '7.6 M EUR' },
      { label: 'Commitment', value: '102 M EUR' }, { label: 'Utilisation', value: '60 M EUR (59%)' }, { label: 'Pipeline NBI Simulation', value: '3.2 M EUR' },
    ],
  },
  'Nordic Capital Group': {
    name: 'Nordic Capital Group', cpyId: '2233445566', subClientName: 'Nordic Wind SPV', subClientId: '332211',
    coverage: 'K. Lambert', internalRating: 'A', nextReview: '22/07/2026', kyc: 'Verified',
    region: 'EMEA · Denmark', sector: 'Infrastructure', subSector: 'Renewable Energy',
    parent: { cphName: 'Nordic Holdings', cphId: '223344', rootClientName: 'Nordic Holdings', rootClientId: '223344', rootClientSector: 'Infrastructure' },
    exposure: [
      { label: 'Booked deals', value: '1' }, { label: 'Opportunities', value: '1' }, { label: 'Year-to-Date NBI', value: '4.5 M EUR' },
      { label: 'Commitment', value: '45 M EUR' }, { label: 'Utilisation', value: '30 M EUR (66%)' }, { label: 'Pipeline NBI Simulation', value: '1.8 M EUR' },
    ],
  },
  'Gaia Infrastructure': {
    name: 'Gaia Infrastructure', cpyId: '7788990011', subClientName: 'Gaia Road SPV', subClientId: '887766',
    coverage: 'S. Ramos', internalRating: 'BBB', nextReview: '12/10/2025', kyc: 'Verified',
    region: 'EMEA · Italy', sector: 'Infrastructure', subSector: 'Transport',
    parent: { cphName: 'Gaia Holdings', cphId: '778899', rootClientName: 'Gaia Holdings', rootClientId: '778899', rootClientSector: 'Infrastructure' },
    exposure: [
      { label: 'Booked deals', value: '1' }, { label: 'Opportunities', value: '0' }, { label: 'Year-to-Date NBI', value: '3.1 M EUR' },
      { label: 'Commitment', value: '38 M EUR' }, { label: 'Utilisation', value: '25 M EUR (66%)' }, { label: 'Pipeline NBI Simulation', value: '0 M EUR' },
    ],
  },
}

/* Aliases to resolve various id shapes (name, cpyId, numeric id) to a single key */
const CLIENT_ALIASES = {
  '9876543210': 'Helios Aviation Partners',
  '1234567890': 'Silverpath Holdings SA',
  1: 'Atlas Energy', 2: 'Silverpath Holdings SA', 3: 'Helios Aviation Partners',
  4: 'Meridian Renewables', 5: 'Nordic Capital Group', 6: 'Gaia Infrastructure',
}

function resolveClient(id) {
  if (id == null) return CLIENTS_DB['Helios Aviation Partners']
  if (CLIENTS_DB[id]) return CLIENTS_DB[id]
  const alias = CLIENT_ALIASES[id]
  if (alias && CLIENTS_DB[alias]) return CLIENTS_DB[alias]
  return CLIENTS_DB['Helios Aviation Partners']
}

const ALERTS = [
  {
    title: 'Waiver request pending',
    isCritical: true,
    description: 'A waiver request for "Deal Name" is awaiting validation.',
    actionLabel: 'See waiver',
  },
  {
    title: 'Annual review due in 30 days',
    isCritical: false,
    description: "Client's review must be submitted before Dec. 15, 2025.",
    actionLabel: 'Open review',
  },
]

const BOOKED_DEALS = [
  { dealId: 1, name: 'Infra Project B', tradeDate: '2024-08-31', maturityDate: '2030-04-01', commitment: '80 M EUR', rwa: '37 M EUR' },
  { dealId: 2, name: 'Infra Project A', tradeDate: '2024-08-31', maturityDate: '2030-09-01', commitment: '45 M EUR', rwa: '15 M EUR' },
]

const OPP_FILTERS = [
  { id: 'all',      label: 'All (7)' },
  { id: 'active',   label: 'Active (4)', highlight: true },
  { id: 'archived', label: 'Archived (5)' },
  { id: 'hold',     label: 'On hold (1)' },
]

const OPPORTUNITIES = [
  { name: 'Infra Project D', status: 'Status', dealSize: '5.8 M EUR', finalTake: '12 M EUR', expectedBooking: '2025-11-01', probability: '50%' },
]

const DOCUMENTS = [
  { name: 'HAP_2025_DealReview...', type: 'Term sheet', deal: 'Infra Project B', dealType: 'Booked deal',  owner: 'P. Jackson', updated: '2025-11-01' },
  { name: 'HAP_2025_DealReview...', type: 'Term sheet', deal: 'Infra Project A', dealType: 'Booked deal',  owner: 'P. Jackson', updated: '2025-11-01' },
  { name: 'BOM_Opp_25',             type: 'BOM',        deal: 'Infra Project D', dealType: 'Opportunity',  owner: 'P. Jackson', updated: '2025-11-01' },
]

/* ── Module header ─────────────────────────────────────────────────── */
function ModuleHeader({ icon: Icon, title, showStatus = true, showExport = true, collapsed, onToggle, onExport, rightContent }) {
  return (
    <div className="cp-module__header">
      <div className="cp-module__header-left">
        <div className="cp-module__icon-box">
          <Icon size={18} strokeWidth={1.75} />
        </div>
        <div className="cp-module__header-text">
          <h2 className="cp-module__title">{title}</h2>
          {showStatus && (
            <p className="cp-module__status">
              Last updated today at 12:33 · Sources:{' '}
              <a href="#" onClick={e => e.preventDefault()}>App_Name</a>
              {' / '}
              <a href="#" onClick={e => e.preventDefault()}>App_Name</a>
              {' / '}
              <a href="#" onClick={e => e.preventDefault()}>App_Name</a>
            </p>
          )}
        </div>
      </div>
      <div className="cp-module__header-actions">
        {rightContent}
        {showExport && (
          <button className="cp-module__action-btn" onClick={onExport}>
            <Download size={14} strokeWidth={1.75} />
            Export
          </button>
        )}
        <button className="cp-module__collapse-btn" onClick={onToggle} aria-label={collapsed ? 'Expand' : 'Collapse'}>
          {collapsed ? <ChevronDown size={16} strokeWidth={1.75} /> : <ChevronUp size={16} strokeWidth={1.75} />}
        </button>
      </div>
    </div>
  )
}

/* ── Sortable table header cell ────────────────────────────────────── */
function SortableTh({ children, width }) {
  return (
    <th className="cp-table__th" style={{ width }}>
      <span className="cp-table__th-content">
        {children}
        <ArrowUpDown size={12} strokeWidth={1.75} className="cp-table__sort-icon" />
      </span>
    </th>
  )
}

/* ── Search row for table filters ──────────────────────────────────── */
function SearchRow({ cols }) {
  return (
    <tr className="cp-table__search-row">
      {cols.map((_, i) => (
        <td key={i} className="cp-table__search-cell">
          <div className="cp-table__search-box">
            <Search size={12} strokeWidth={1.75} />
            <input type="text" placeholder="Search" />
            <Filter size={12} strokeWidth={1.75} />
          </div>
        </td>
      ))}
    </tr>
  )
}

/* ── Main component ────────────────────────────────────────────────── */
export default function ClientsPage({ style, clientId, onBack, onNavigatePortfolio, onNavigateDeal }) {
  const [activeFilter, setActiveFilter] = useState('active')
  const CLIENT_DATA = resolveClient(clientId)
  const PARENT_GROUP = CLIENT_DATA.parent
  const EXPOSURE_METRICS = CLIENT_DATA.exposure

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [clientId])

  return (
    <main className="clients-page" style={style}>
      {/* Breadcrumb */}
      <div className="clients-page__breadcrumb">
        <nav className="clients-page__breadcrumb-nav" aria-label="Breadcrumb">
          <button onClick={onBack} className="clients-page__crumb clients-page__crumb--link">Home</button>
          <ChevronRight size={16} strokeWidth={1.5} className="clients-page__crumb-sep" />
          <button onClick={() => onNavigatePortfolio?.()} className="clients-page__crumb clients-page__crumb--link">Portfolio</button>
          <ChevronRight size={16} strokeWidth={1.5} className="clients-page__crumb-sep" />
          <span className="clients-page__crumb">{CLIENT_DATA.name}</span>
        </nav>
      </div>

      <div className="clients-page__content">
        {/* ── Client Header ───────────────────────────────────────── */}
        <div className="clients-page__header">
          <div className="clients-page__header-inner">
          <div className="clients-page__header-top">
            <div className="clients-page__avatar">
              <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
                <rect x="4" y="4" width="40" height="40" rx="4" fill="rgba(255,255,255,0.15)" />
                <circle cx="24" cy="18" r="5" fill="rgba(255,255,255,0.55)" />
                <path d="M12 38c2-6 6-9 12-9s10 3 12 9" stroke="rgba(255,255,255,0.55)" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
            </div>
            <div className="clients-page__header-text">
              <h1 className="clients-page__title">{CLIENT_DATA.name}</h1>
              <div className="clients-page__header-codes">
                <span>CPY ID: <strong>{CLIENT_DATA.cpyId}</strong></span>
                <span>Sub Client: <strong>{CLIENT_DATA.subClientName} (ID: {CLIENT_DATA.subClientId})</strong></span>
                <a href="#" className="clients-page__header-link" onClick={e => e.preventDefault()}>
                  Open in ClientLive <ExternalLink size={12} strokeWidth={2} />
                </a>
              </div>
            </div>
          </div>

          {/* Header Metrics – 6 cards in 3 columns */}
          <div className="clients-page__metrics">
            <div className="clients-page__metric-card">
              <p className="clients-page__metric-label">Primary Coverage Officer</p>
              <p className="clients-page__metric-value">{CLIENT_DATA.coverage}</p>
              <a href="#" className="clients-page__metric-link" onClick={e => e.preventDefault()}>
                <MessageSquare size={12} strokeWidth={2} /> Chat on Teams
              </a>
            </div>
            <div className="clients-page__metric-card">
              <p className="clients-page__metric-label">Internal rating</p>
              <p className="clients-page__metric-value">{CLIENT_DATA.internalRating}</p>
              <p className="clients-page__metric-sub">Next review: {CLIENT_DATA.nextReview}</p>
            </div>
            <div className="clients-page__metric-card">
              <p className="clients-page__metric-label">KYC</p>
              <div className="clients-page__kyc-tag">✓ {CLIENT_DATA.kyc}</div>
              <a href="#" className="clients-page__metric-link" onClick={e => e.preventDefault()}>
                Open in Kiwis <ExternalLink size={12} strokeWidth={2} />
              </a>
            </div>
            <div className="clients-page__metric-card">
              <p className="clients-page__metric-label">Region & Country of risk</p>
              <p className="clients-page__metric-value">{CLIENT_DATA.region}</p>
            </div>
            <div className="clients-page__metric-card">
              <p className="clients-page__metric-label">Business sector</p>
              <p className="clients-page__metric-value">{CLIENT_DATA.sector}</p>
            </div>
            <div className="clients-page__metric-card">
              <p className="clients-page__metric-label">Sub client sector</p>
              <p className="clients-page__metric-value">{CLIENT_DATA.subSector}</p>
            </div>
          </div>
          </div>{/* /header-inner */}
        </div>

        {/* ── Parent group ────────────────────────────────────────── */}
        <section className="cp-module">
          <ModuleHeader icon={Network} title="Parent group" showStatus={false} showExport={false} />
          <div className="cp-module__divider" />
          <div className="cp-parent-grid">
            <div className="cp-parent-item">
              <p className="cp-parent-item__label">CPH name</p>
              <p className="cp-parent-item__value">{PARENT_GROUP.cphName}</p>
              <p className="cp-parent-item__sub">ID: {PARENT_GROUP.cphId}</p>
            </div>
            <div className="cp-parent-item">
              <p className="cp-parent-item__label">Root client name</p>
              <p className="cp-parent-item__value">{PARENT_GROUP.rootClientName}</p>
              <p className="cp-parent-item__sub">ID: {PARENT_GROUP.rootClientId}</p>
              <a href="#" className="cp-link" onClick={e => e.preventDefault()}>
                Open in ClientLive <ExternalLink size={12} strokeWidth={2} />
              </a>
            </div>
            <div className="cp-parent-item">
              <p className="cp-parent-item__label">Root client sector</p>
              <p className="cp-parent-item__value">{PARENT_GROUP.rootClientSector}</p>
            </div>
          </div>
        </section>

        {/* ── Alerts & upcoming actions ───────────────────────────── */}
        <section className="cp-module">
          <ModuleHeader icon={Bell} title="Alerts & upcoming actions" />
          <div className="cp-module__divider" />
          <div className="cp-alerts">
            {ALERTS.map((alert, idx) => (
              <div key={idx} className={`cp-alert${alert.isCritical ? ' cp-alert--critical' : ''}`}>
                {alert.isCritical && (
                  <div className="cp-alert__critical-badge">
                    <span className="cp-alert__critical-dot" />
                    Critical alert
                  </div>
                )}
                <div className="cp-alert__title-row">
                  <h3 className="cp-alert__title">{alert.title}</h3>
                  <a href="#" className="cp-link" onClick={e => e.preventDefault()}>
                    {alert.actionLabel} <ExternalLink size={12} strokeWidth={2} />
                  </a>
                </div>
                <p className="cp-alert__description">{alert.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Exposure & performance ──────────────────────────────── */}
        <section className="cp-module">
          <ModuleHeader icon={Activity} title="Exposure & performance" />
          <div className="cp-module__divider" />
          <div className="cp-exposure-grid">
            {EXPOSURE_METRICS.map((m, idx) => (
              <div key={idx} className="cp-exposure-card">
                <p className="cp-exposure-card__label">{m.label}</p>
                <p className="cp-exposure-card__value">{m.value}</p>
              </div>
            ))}
          </div>
          <button className="cp-primary-btn">
            <Gauge size={14} strokeWidth={2} />
            Explore analytics
          </button>
        </section>

        {/* ── Booked deals ────────────────────────────────────────── */}
        <section className="cp-module">
          <ModuleHeader icon={Briefcase} title={`Booked deals (${BOOKED_DEALS.length})`} />
          <div className="cp-module__divider" />
          <div className="cp-table-wrap">
            <table className="cp-table">
              <thead>
                <tr>
                  <SortableTh>Deal</SortableTh>
                  <SortableTh>Trade date</SortableTh>
                  <SortableTh>Maturity date</SortableTh>
                  <SortableTh>Commitment</SortableTh>
                  <SortableTh>RWA Economic</SortableTh>
                  <th className="cp-table__th" style={{ width: 36 }} />
                </tr>
                <SearchRow cols={[1, 2, 3, 4, 5, 6]} />
              </thead>
              <tbody>
                {BOOKED_DEALS.map((deal, idx) => (
                  <tr key={idx} className="cp-table__row" onClick={() => onNavigateDeal?.(deal.dealId)} style={{ cursor: 'pointer' }}>
                    <td className="cp-table__cell">
                      <button className="cp-table__link" onClick={e => { e.stopPropagation(); onNavigateDeal?.(deal.dealId) }}>{deal.name}</button>
                    </td>
                    <td className="cp-table__cell">{deal.tradeDate}</td>
                    <td className="cp-table__cell">{deal.maturityDate}</td>
                    <td className="cp-table__cell">{deal.commitment}</td>
                    <td className="cp-table__cell">{deal.rwa}</td>
                    <td className="cp-table__cell cp-table__cell--action">
                      <Eye size={14} strokeWidth={1.75} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="cp-table__footer">
              <span className="cp-table__rows">Rows: 2</span>
              <span className="cp-table__totals">
                Total commitment: <strong>125 M EUR</strong> · Total RWA Economic: <strong>52 M EUR</strong>
              </span>
            </div>
          </div>
        </section>

        {/* ── Opportunities ───────────────────────────────────────── */}
        <section className="cp-module">
          <ModuleHeader icon={Target} title="Opportunities (7)" />
          <div className="cp-module__divider" />
          <div className="cp-chips">
            {OPP_FILTERS.map(f => (
              <button
                key={f.id}
                className={`cp-chip${activeFilter === f.id ? ' cp-chip--active' : ''}`}
                onClick={() => setActiveFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="cp-table-wrap">
            <table className="cp-table">
              <thead>
                <tr>
                  <SortableTh>Deal & status</SortableTh>
                  <SortableTh>Deal size</SortableTh>
                  <SortableTh>Final take amount</SortableTh>
                  <SortableTh>Expected booking date</SortableTh>
                  <SortableTh>Probability</SortableTh>
                  <th className="cp-table__th" style={{ width: 36 }} />
                </tr>
                <SearchRow cols={[1, 2, 3, 4, 5, 6]} />
              </thead>
              <tbody>
                {OPPORTUNITIES.map((opp, idx) => (
                  <tr key={idx} className="cp-table__row">
                    <td className="cp-table__cell">
                      <div className="cp-opp-cell">
                        <a href="#" className="cp-table__link" onClick={e => e.preventDefault()}>{opp.name}</a>
                        <span className="cp-opp-status">{opp.status}</span>
                      </div>
                    </td>
                    <td className="cp-table__cell">{opp.dealSize}</td>
                    <td className="cp-table__cell">{opp.finalTake}</td>
                    <td className="cp-table__cell">{opp.expectedBooking}</td>
                    <td className="cp-table__cell">{opp.probability}</td>
                    <td className="cp-table__cell cp-table__cell--action">
                      <Eye size={14} strokeWidth={1.75} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="cp-table__footer">
              <span className="cp-table__rows">Rows: 1</span>
              <span className="cp-table__totals">
                Total size: <strong>5.8 M EUR</strong> · Total final take amount: <strong>12 M EUR</strong>
              </span>
            </div>
          </div>
        </section>

        {/* ── Recent documents ────────────────────────────────────── */}
        <section className="cp-module">
          <ModuleHeader icon={FolderOpen} title="Recent documents" />
          <div className="cp-module__divider" />
          <div className="cp-table-wrap">
            <table className="cp-table">
              <thead>
                <tr>
                  <SortableTh>Document name</SortableTh>
                  <SortableTh>Document type</SortableTh>
                  <SortableTh>Deal</SortableTh>
                  <SortableTh>Owner</SortableTh>
                  <SortableTh>Last update</SortableTh>
                  <th className="cp-table__th" style={{ width: 72 }} />
                </tr>
                <SearchRow cols={[1, 2, 3, 4, 5, 6]} />
              </thead>
              <tbody>
                {DOCUMENTS.map((doc, idx) => (
                  <tr key={idx} className="cp-table__row">
                    <td className="cp-table__cell">{doc.name}</td>
                    <td className="cp-table__cell">{doc.type}</td>
                    <td className="cp-table__cell">
                      <div className="cp-doc-deal">
                        <a href="#" className="cp-table__link" onClick={e => e.preventDefault()}>{doc.deal}</a>
                        <span className={`cp-doc-tag cp-doc-tag--${doc.dealType === 'Opportunity' ? 'opp' : 'booked'}`}>
                          {doc.dealType}
                        </span>
                      </div>
                    </td>
                    <td className="cp-table__cell">{doc.owner}</td>
                    <td className="cp-table__cell">{doc.updated}</td>
                    <td className="cp-table__cell cp-table__cell--action cp-table__cell--action-wide">
                      <Eye size={14} strokeWidth={1.75} />
                      <Download size={14} strokeWidth={1.75} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="cp-table__footer">
              <span className="cp-table__rows">Rows: 3</span>
            </div>
          </div>
          <button className="cp-primary-btn">
            <FolderOpen size={14} strokeWidth={2} />
            Explore repository
          </button>
        </section>
      </div>
    </main>
  )
}
