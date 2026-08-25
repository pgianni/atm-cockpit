import { useState, useEffect } from 'react'
import { ChevronRight, ExternalLink, ArrowUpRight, ArrowDownRight, Download, ArrowUp, ArrowDown, ArrowUpDown, Plus, X } from 'lucide-react'
import './PortfolioPage.css'

/* ─── Data ────────────────────────────────────────────────────────── */

const KPIS = [
  { id: 'deals',      label: 'Booked deals',        value: '28',   unit: '',      trend: +3,  trendLabel: 'vs last month' },
  { id: 'nbi',        label: 'YTD NBI',              value: '500.9',unit: 'M EUR', trend: +12, trendLabel: 'vs last year', trendIsPercent: true },
  { id: 'rwa',        label: 'RWA',                  value: '197.5',unit: 'M EUR', trend: -4,  trendLabel: 'vs last year', trendIsPercent: true },
  { id: 'commitment', label: 'Current commitment',   value: '499',  unit: 'M EUR', trend: +8,  trendLabel: 'vs last year', trendIsPercent: true },
]

const CLIENTS = [
  { id: 1, name: 'Atlas Energy',              sector: 'Energy',         commitment: '150 M', deals: 3, lastDeal: '2025-10-28', health: 'good'  },
  { id: 2, name: 'Silverpath Infrastructure', sector: 'Infrastructure', commitment: '120 M', deals: 2, lastDeal: '2025-09-14', health: 'good'  },
  { id: 3, name: 'Helios Aviation Partners',  sector: 'Aviation',       commitment: '75 M',  deals: 1, lastDeal: '2025-08-03', health: 'watch' },
  { id: 4, name: 'Meridian Renewables',       sector: 'Renewables',     commitment: '60 M',  deals: 2, lastDeal: '2025-11-01', health: 'good'  },
  { id: 5, name: 'Nordic Capital Group',      sector: 'Infrastructure', commitment: '45 M',  deals: 1, lastDeal: '2025-07-22', health: 'good'  },
  { id: 6, name: 'Gaia Infrastructure',       sector: 'Infrastructure', commitment: '38 M',  deals: 1, lastDeal: '2025-10-28', health: 'watch' },
]

const DEALS = [
  { id: 1, name: 'Silverpath Infra',   client: 'Atlas Energy',            size: 150, currency: 'EUR', status: 'Signed',      signingDate: '2025-10-28', maturityDate: '2032-10-28' },
  { id: 2, name: 'Energy Project',     client: 'Helios Aviation Partners', size: 75,  currency: 'EUR', status: 'Committee',   signingDate: '2025-11-04', maturityDate: '2031-11-04' },
  { id: 3, name: 'Nordic Wind Farm',   client: 'Nordic Capital Group',    size: 45,  currency: 'EUR', status: 'KYC Review',  signingDate: '2025-09-18', maturityDate: '2033-03-18' },
  { id: 4, name: 'Meridian Solar II',  client: 'Meridian Renewables',     size: 60,  currency: 'EUR', status: 'Pre-closing', signingDate: '2025-11-01', maturityDate: '2030-05-01' },
  { id: 5, name: 'Atlas Infra Bridge', client: 'Atlas Energy',            size: 30,  currency: 'EUR', status: 'Signed',      signingDate: '2025-08-15', maturityDate: '2027-02-15' },
  { id: 6, name: 'Gaia Road Project',  client: 'Gaia Infrastructure',     size: 38,  currency: 'EUR', status: 'Committee',   signingDate: '2025-10-12', maturityDate: '2034-10-12' },
  { id: 7, name: 'Meridian Wind I',    client: 'Meridian Renewables',     size: 42,  currency: 'EUR', status: 'Signed',      signingDate: '2025-07-03', maturityDate: '2031-07-03' },
  { id: 8, name: 'Helios Cargo Hub',   client: 'Helios Aviation Partners', size: 25,  currency: 'EUR', status: 'Prospect',    signingDate: '2025-11-08', maturityDate: '2030-11-08' },
]

const STATUS_COLORS = {
  'Signed':      'status--green',
  'Pre-closing': 'status--blue',
  'Committee':   'status--orange',
  'KYC Review':  'status--purple',
  'Prospect':    'status--grey',
}

const HEALTH_LABELS = {
  good:  { label: 'Active',     cls: 'health--good'  },
  watch: { label: 'Watch list', cls: 'health--watch' },
}

const CLIENT_OPTIONS  = [...new Set(DEALS.map(d => d.client))].sort()
const STATUS_OPTIONS  = ['Signed', 'Pre-closing', 'Committee', 'KYC Review', 'Prospect']

/* ─── KPI card ──────────────────────────────────────────────────────── */

function KpiCard({ kpi }) {
  const positive = kpi.trend > 0
  return (
    <div className="kpi-card">
      <span className="kpi-card__label">{kpi.label}</span>
      <div className="kpi-card__value-row">
        <span className="kpi-card__value">{kpi.value}</span>
        {kpi.unit && <span className="kpi-card__unit">{kpi.unit}</span>}
      </div>
      <div className={`kpi-card__trend ${positive ? 'kpi-card__trend--up' : 'kpi-card__trend--down'}`}>
        {positive ? <ArrowUpRight size={14} strokeWidth={2} /> : <ArrowDownRight size={14} strokeWidth={2} />}
        <span>{positive ? '+' : ''}{kpi.trend}{kpi.trendIsPercent ? '%' : ''} {kpi.trendLabel}</span>
      </div>
    </div>
  )
}

/* ─── Filter select ─────────────────────────────────────────────────── */

function FilterSelect({ label, value, onChange, options, placeholder }) {
  return (
    <div className="pf-select">
      <label className="pf-select__label">{label}</label>
      <div className="pf-select__wrap">
        <select
          className="pf-select__input"
          value={value}
          onChange={e => onChange(e.target.value)}
        >
          <option value="">{placeholder}</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ArrowDown size={14} strokeWidth={2} className="pf-select__chevron" />
      </div>
    </div>
  )
}

/* ─── Sortable column header ────────────────────────────────────────── */

function SortTh({ col, sortConfig, onSort, children, className = '' }) {
  const active = sortConfig.key === col
  return (
    <th
      className={`ptable__th ptable__th--sortable ${className}`}
      onClick={() => onSort(col)}
    >
      <span className="ptable__th-inner">
        {children}
        <span className={`ptable__sort-icon${active ? ' ptable__sort-icon--active' : ''}`}>
          {!active
            ? <ArrowUpDown  size={12} strokeWidth={1.8} />
            : sortConfig.dir === 'asc'
              ? <ArrowUp    size={12} strokeWidth={2} />
              : <ArrowDown  size={12} strokeWidth={2} />
          }
        </span>
      </span>
    </th>
  )
}

/* ─── Client row ────────────────────────────────────────────────────── */

function ClientRow({ client, onNavigateClient }) {
  const health = HEALTH_LABELS[client.health]
  return (
    <tr className="ptable__row">
      <td className="ptable__cell">
        <button className="ptable__client-link" onClick={() => onNavigateClient?.(client.id)}>
          {client.name}
        </button>
      </td>
      <td className="ptable__cell ptable__cell--minor">{client.sector}</td>
      <td className="ptable__cell ptable__cell--right ptable__cell--bold">{client.commitment} EUR</td>
      <td className="ptable__cell ptable__cell--center">{client.deals}</td>
      <td className="ptable__cell ptable__cell--minor">{client.lastDeal}</td>
      <td className="ptable__cell">
        <span className={`health-badge ${health.cls}`}>{health.label}</span>
      </td>
      <td className="ptable__cell ptable__cell--action">
        <a href="#" className="ptable__icon-link" onClick={e => e.preventDefault()}>
          <ExternalLink size={14} strokeWidth={1.5} />
        </a>
      </td>
    </tr>
  )
}

/* ─── Deal row ──────────────────────────────────────────────────────── */

function DealRow({ deal, onNavigateDeal, onNavigateClient }) {
  function handleOpen() { onNavigateDeal?.(deal.id) }
  return (
    <tr className="ptable__row ptable__row--clickable" onClick={handleOpen}>
      <td className="ptable__cell">
        <button className="ptable__client-link" onClick={e => { e.stopPropagation(); handleOpen() }}>
          {deal.name}
        </button>
      </td>
      <td className="ptable__cell ptable__cell--minor">
        <button className="ptable__client-link" onClick={e => { e.stopPropagation(); onNavigateClient?.(deal.client) }}>
          {deal.client}
        </button>
      </td>
      <td className="ptable__cell ptable__cell--right ptable__cell--bold">
        {deal.size} M {deal.currency}
      </td>
      <td className="ptable__cell">
        <span className={`status-badge ${STATUS_COLORS[deal.status] || 'status--grey'}`}>
          {deal.status}
        </span>
      </td>
      <td className="ptable__cell ptable__cell--minor">{deal.signingDate}</td>
      <td className="ptable__cell ptable__cell--minor">{deal.maturityDate}</td>
      <td className="ptable__cell ptable__cell--action">
        <button className="ptable__icon-link" onClick={e => { e.stopPropagation(); handleOpen() }}>
          <ExternalLink size={14} strokeWidth={1.5} />
        </button>
      </td>
    </tr>
  )
}

/* ─── Page ──────────────────────────────────────────────────────────── */

export default function PortfolioPage({ style, onNavigateDeal, onNavigateClient, onNavigateHome }) {
  const [filterClient,  setFilterClient]  = useState('')
  const [filterStatus,  setFilterStatus]  = useState('')
  const [sortConfig,    setSortConfig]    = useState({ key: null, dir: 'asc' })

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [])

  function handleSort(key) {
    setSortConfig(prev => ({
      key,
      dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc',
    }))
  }

  function clearFilters() {
    setFilterClient('')
    setFilterStatus('')
  }

  const hasActiveFilters = filterClient || filterStatus

  // Filter
  let visibleDeals = DEALS
  if (filterClient) visibleDeals = visibleDeals.filter(d => d.client === filterClient)
  if (filterStatus) visibleDeals = visibleDeals.filter(d => d.status === filterStatus)

  // Sort
  if (sortConfig.key) {
    visibleDeals = [...visibleDeals].sort((a, b) => {
      let av = a[sortConfig.key]
      let bv = b[sortConfig.key]
      if (typeof av === 'string') { av = av.toLowerCase(); bv = bv.toLowerCase() }
      if (av < bv) return sortConfig.dir === 'asc' ? -1 : 1
      if (av > bv) return sortConfig.dir === 'asc' ?  1 : -1
      return 0
    })
  }

  return (
    <main className="portfolio-page" style={style}>

      {/* ── Breadcrumb ── */}
      <div className="portfolio-page__breadcrumb">
        <button className="portfolio-page__bc-link" onClick={() => onNavigateHome?.()}>Home</button>
        <ChevronRight size={14} strokeWidth={2} className="portfolio-page__bc-sep" />
        <span className="portfolio-page__bc-current">My portfolio</span>
      </div>

      <div className="portfolio-page__content">

        {/* ── Page header ── */}
        <div className="portfolio-page__header">
          <h1 className="portfolio-page__title">My portfolio</h1>
          <button className="portfolio-page__export-btn">
            <Download size={15} strokeWidth={1.8} />
            Export to Excel
          </button>
        </div>

        {/* ── KPIs ── */}
        <div className="kpi-row">
          {KPIS.map(kpi => <KpiCard key={kpi.id} kpi={kpi} />)}
        </div>

        {/* ── Top clients ── */}
        <section className="portfolio-section">
          <div className="portfolio-section__header">
            <div>
              <h2 className="portfolio-section__title">Top clients</h2>
              <p className="portfolio-section__subtitle">My most significant client relationships by current commitment.</p>
            </div>
            <a href="#" className="portfolio-section__link" onClick={e => e.preventDefault()}>
              See all clients <ExternalLink size={12} strokeWidth={1.5} />
            </a>
          </div>

          <div className="ptable-wrap">
            <table className="ptable">
              <thead>
                <tr className="ptable__head-row">
                  <th className="ptable__th">Client</th>
                  <th className="ptable__th">Sector</th>
                  <th className="ptable__th ptable__th--right">Commitment</th>
                  <th className="ptable__th ptable__th--center">Deals</th>
                  <th className="ptable__th">Last deal</th>
                  <th className="ptable__th">Status</th>
                  <th className="ptable__th" />
                </tr>
              </thead>
              <tbody>
                {CLIENTS.map(c => <ClientRow key={c.id} client={c} onNavigateClient={onNavigateClient} />)}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Filter block ── */}
        <div className="portfolio-filters">
          <h3 className="portfolio-filters__title">Filters</h3>
          <div className="portfolio-filters__grid">
            <FilterSelect
              label="Client"
              value={filterClient}
              onChange={setFilterClient}
              options={CLIENT_OPTIONS}
              placeholder="Select client"
            />
            <FilterSelect
              label="Status"
              value={filterStatus}
              onChange={setFilterStatus}
              options={STATUS_OPTIONS}
              placeholder="Select status"
            />
            <FilterSelect
              label="Size"
              value=""
              onChange={() => {}}
              options={['< 50 M EUR', '50 – 100 M EUR', '> 100 M EUR']}
              placeholder="All sizes"
            />
            <div className="portfolio-filters__actions">
              {hasActiveFilters && (
                <button className="portfolio-filters__clear-btn" onClick={clearFilters}>
                  <X size={13} strokeWidth={2} />
                  Clear filters
                </button>
              )}
              <button className="portfolio-filters__more-btn">
                <Plus size={14} strokeWidth={2} />
                Show more filters
              </button>
            </div>
          </div>
        </div>

        {/* ── Booked deals ── */}
        <section className="portfolio-section">
          <div className="portfolio-section__header">
            <div>
              <h2 className="portfolio-section__title">Booked deals</h2>
              <p className="portfolio-section__subtitle">All deals currently in progress across my portfolio.</p>
            </div>
          </div>

          {/* ── Deals table ── */}
          <div className="ptable-wrap">
            <table className="ptable">
              <thead>
                <tr className="ptable__head-row">
                  <SortTh col="name"         sortConfig={sortConfig} onSort={handleSort}>Deal</SortTh>
                  <SortTh col="client"       sortConfig={sortConfig} onSort={handleSort}>Client</SortTh>
                  <SortTh col="size"         sortConfig={sortConfig} onSort={handleSort} className="ptable__th--right">Size</SortTh>
                  <SortTh col="status"       sortConfig={sortConfig} onSort={handleSort}>Status</SortTh>
                  <SortTh col="signingDate"  sortConfig={sortConfig} onSort={handleSort}>Signing date</SortTh>
                  <SortTh col="maturityDate" sortConfig={sortConfig} onSort={handleSort}>Maturity date</SortTh>
                  <th className="ptable__th" />
                </tr>
              </thead>
              <tbody>
                {visibleDeals.map(d => (
                  <DealRow key={d.id} deal={d} onNavigateDeal={onNavigateDeal} onNavigateClient={onNavigateClient} />
                ))}
              </tbody>
            </table>
            {visibleDeals.length === 0 && (
              <p className="ptable__empty">No deals match the current filters.</p>
            )}
          </div>

          {/* Result count */}
          <p className="ptable__count">{visibleDeals.length} deal{visibleDeals.length !== 1 ? 's' : ''}</p>
        </section>

      </div>
    </main>
  )
}
