import { useState } from 'react'
import { ChevronRight, TrendingUp, TrendingDown, ExternalLink, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import './PortfolioPage.css'

/* ─── Data ────────────────────────────────────────────────────────── */

const KPIS = [
  {
    id: 'deals',
    label: 'Booked deals',
    value: '28',
    unit: '',
    trend: +3,
    trendLabel: 'vs last month',
  },
  {
    id: 'nbi',
    label: 'YTD NBI',
    value: '500.9',
    unit: 'M EUR',
    trend: +12,
    trendLabel: 'vs last year',
    trendIsPercent: true,
  },
  {
    id: 'rwa',
    label: 'RWA',
    value: '197.5',
    unit: 'M EUR',
    trend: -4,
    trendLabel: 'vs last year',
    trendIsPercent: true,
  },
  {
    id: 'commitment',
    label: 'Current commitment',
    value: '499',
    unit: 'M EUR',
    trend: +8,
    trendLabel: 'vs last year',
    trendIsPercent: true,
  },
]

const CLIENTS = [
  { id: 1, name: 'Atlas Energy',            sector: 'Energy',         commitment: '150 M',  deals: 3, lastDeal: '2025-10-28', health: 'good' },
  { id: 2, name: 'Silverpath Infrastructure', sector: 'Infrastructure', commitment: '120 M', deals: 2, lastDeal: '2025-09-14', health: 'good' },
  { id: 3, name: 'Helios Aviation Partners', sector: 'Aviation',       commitment: '75 M',   deals: 1, lastDeal: '2025-08-03', health: 'watch' },
  { id: 4, name: 'Meridian Renewables',      sector: 'Renewables',    commitment: '60 M',   deals: 2, lastDeal: '2025-11-01', health: 'good' },
  { id: 5, name: 'Nordic Capital Group',     sector: 'Infrastructure', commitment: '45 M',   deals: 1, lastDeal: '2025-07-22', health: 'good' },
  { id: 6, name: 'Gaia Infrastructure',      sector: 'Infrastructure', commitment: '38 M',   deals: 1, lastDeal: '2025-10-28', health: 'watch' },
]

const DEAL_STATUSES = ['All', 'Signed', 'Pre-closing', 'Committee', 'KYC Review', 'Prospect']

const DEALS = [
  { id: 1, name: 'Silverpath Infra',    client: 'Atlas Energy',            type: 'Infrastructure',  size: 150, currency: 'EUR', status: 'Signed',      date: '2025-10-28' },
  { id: 2, name: 'Energy Project',      client: 'Helios Aviation Partners', type: 'Renewable Energy', size: 75,  currency: 'EUR', status: 'Committee',   date: '2025-11-04' },
  { id: 3, name: 'Nordic Wind Farm',    client: 'Nordic Capital Group',    type: 'Infrastructure',  size: 45,  currency: 'EUR', status: 'KYC Review',  date: '2025-09-18' },
  { id: 4, name: 'Meridian Solar II',   client: 'Meridian Renewables',     type: 'Renewable Energy', size: 60,  currency: 'EUR', status: 'Pre-closing', date: '2025-11-01' },
  { id: 5, name: 'Atlas Infra Bridge',  client: 'Atlas Energy',            type: 'Bridge Loan',     size: 30,  currency: 'EUR', status: 'Signed',      date: '2025-08-15' },
  { id: 6, name: 'Gaia Road Project',   client: 'Gaia Infrastructure',     type: 'Infrastructure',  size: 38,  currency: 'EUR', status: 'Committee',   date: '2025-10-12' },
  { id: 7, name: 'Meridian Wind I',     client: 'Meridian Renewables',     type: 'Renewable Energy', size: 42,  currency: 'EUR', status: 'Signed',      date: '2025-07-03' },
  { id: 8, name: 'Helios Cargo Hub',    client: 'Helios Aviation Partners', type: 'Infrastructure',  size: 25,  currency: 'EUR', status: 'Prospect',    date: '2025-11-08' },
]

const STATUS_COLORS = {
  'Signed':      'status--green',
  'Pre-closing': 'status--blue',
  'Committee':   'status--orange',
  'KYC Review':  'status--purple',
  'Prospect':    'status--grey',
}

const HEALTH_LABELS = {
  good:  { label: 'Active',     cls: 'health--good' },
  watch: { label: 'Watch list', cls: 'health--watch' },
}

/* ─── Sub-components ──────────────────────────────────────────────── */

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
        {positive
          ? <ArrowUpRight   size={14} strokeWidth={2} />
          : <ArrowDownRight size={14} strokeWidth={2} />
        }
        <span>
          {positive ? '+' : ''}{kpi.trend}{kpi.trendIsPercent ? '%' : ''} {kpi.trendLabel}
        </span>
      </div>
    </div>
  )
}

function ClientRow({ client, onNavigateClient }) {
  const health = HEALTH_LABELS[client.health]
  return (
    <tr className="ptable__row">
      <td className="ptable__cell ptable__cell--name">
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

function DealRow({ deal, onNavigateDeal, onNavigateClient }) {
  function handleOpen() { onNavigateDeal?.(deal.id) }
  return (
    <tr className="ptable__row ptable__row--clickable" onClick={handleOpen}>
      <td className="ptable__cell ptable__cell--name">
        <button className="ptable__client-link" onClick={e => { e.stopPropagation(); handleOpen() }}>
          {deal.name}
        </button>
      </td>
      <td className="ptable__cell ptable__cell--minor">
        <button className="ptable__client-link" onClick={e => { e.stopPropagation(); onNavigateClient?.(deal.client) }}>
          {deal.client}
        </button>
      </td>
      <td className="ptable__cell ptable__cell--minor">{deal.type}</td>
      <td className="ptable__cell ptable__cell--right ptable__cell--bold">
        {deal.size} M {deal.currency}
      </td>
      <td className="ptable__cell">
        <span className={`status-badge ${STATUS_COLORS[deal.status] || 'status--grey'}`}>
          {deal.status}
        </span>
      </td>
      <td className="ptable__cell ptable__cell--minor">{deal.date}</td>
      <td className="ptable__cell ptable__cell--action">
        <button className="ptable__icon-link" onClick={e => { e.stopPropagation(); handleOpen() }}>
          <ExternalLink size={14} strokeWidth={1.5} />
        </button>
      </td>
    </tr>
  )
}

/* ─── Page ────────────────────────────────────────────────────────── */

export default function PortfolioPage({ style, onNavigateDeal, onNavigateClient }) {
  const [activeStatus, setActiveStatus] = useState('All')

  const filteredDeals = activeStatus === 'All'
    ? DEALS
    : DEALS.filter(d => d.status === activeStatus)

  return (
    <main className="portfolio-page" style={style}>

      {/* ── Breadcrumb banner ── */}
      <div className="portfolio-page__breadcrumb">
        <a href="#" className="portfolio-page__bc-link" onClick={e => e.preventDefault()}>Home</a>
        <ChevronRight size={14} strokeWidth={2} className="portfolio-page__bc-sep" />
        <span className="portfolio-page__bc-current">My portfolio</span>
      </div>

      <div className="portfolio-page__content">

        {/* ── Page header ── */}
        <div className="portfolio-page__header">
          <h1 className="portfolio-page__title">My portfolio</h1>
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

        {/* ── Active deals ── */}
        <section className="portfolio-section">
          <div className="portfolio-section__header">
            <div>
              <h2 className="portfolio-section__title">Active deals</h2>
              <p className="portfolio-section__subtitle">All deals currently in progress across my portfolio.</p>
            </div>
            <a href="#" className="portfolio-section__link" onClick={e => e.preventDefault()}>
              See all deals <ExternalLink size={12} strokeWidth={1.5} />
            </a>
          </div>

          {/* Status filter chips */}
          <div className="portfolio-chips">
            {DEAL_STATUSES.map(s => (
              <button
                key={s}
                className={`chip${activeStatus === s ? ' chip--active' : ''}`}
                onClick={() => setActiveStatus(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="ptable-wrap">
            <table className="ptable">
              <thead>
                <tr className="ptable__head-row">
                  <th className="ptable__th">Deal</th>
                  <th className="ptable__th">Client</th>
                  <th className="ptable__th">Type</th>
                  <th className="ptable__th ptable__th--right">Size</th>
                  <th className="ptable__th">Status</th>
                  <th className="ptable__th">Date</th>
                  <th className="ptable__th" />
                </tr>
              </thead>
              <tbody>
                {filteredDeals.map(d => <DealRow key={d.id} deal={d} onNavigateDeal={onNavigateDeal} onNavigateClient={onNavigateClient} />)}
              </tbody>
            </table>
            {filteredDeals.length === 0 && (
              <p className="ptable__empty">No deals match this filter.</p>
            )}
          </div>
        </section>

      </div>
    </main>
  )
}
