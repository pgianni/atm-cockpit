import { useState, useEffect } from 'react'
import { ChevronRight, ExternalLink, ArrowUpRight, ArrowDownRight, Download, ArrowUp, ArrowDown, ArrowUpDown, Plus, X } from 'lucide-react'
import { breadcrumbBanner, breadcrumbLink, breadcrumbCurrent } from '../ui'

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

/* Status/health palettes are their own scale, outside the theme tokens. */
const BADGE = 'inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold leading-5'

const STATUS_COLORS = {
  'Signed':      'bg-[#007d57]/10 text-[#007d57]',
  'Pre-closing': 'bg-[#1e64c8]/10 text-[#1e64c8]',
  'Committee':   'bg-[#c0580e]/10 text-[#c0580e]',
  'KYC Review':  'bg-[#6f42c1]/10 text-[#6f42c1]',
  'Prospect':    'bg-[#5e6a71]/10 text-[#5e6a71]',
}

const HEALTH_LABELS = {
  good:  { label: 'Active',     cls: 'bg-[#007d57]/10 text-[#007d57]' },
  watch: { label: 'Watch list', cls: 'bg-[#c0580e]/10 text-[#c0580e]' },
}

/* ─── Table class fragments (shared by both tables) ─────────────────── */
const TH        = 'whitespace-nowrap px-2.5 py-2 text-left text-xs font-semibold text-minor md:px-4 md:py-3 md:text-sm'
const CELL      = 'px-2.5 py-2 align-middle text-xs text-major md:px-4 md:py-3 md:text-sm'
const LINK_CELL = 'block w-full cursor-pointer p-0 text-left font-semibold text-major underline decoration-transparent underline-offset-2 transition-[color,text-decoration-color] duration-150 hover:text-primary hover:decoration-primary'
const ICON_LINK = 'inline-flex h-7 w-7 items-center justify-center rounded text-minor transition-colors duration-150 hover:bg-primary-subtle hover:text-primary'

const CLIENT_OPTIONS  = [...new Set(DEALS.map(d => d.client))].sort()
const STATUS_OPTIONS  = ['Signed', 'Pre-closing', 'Committee', 'KYC Review', 'Prospect']

/* ─── KPI card ──────────────────────────────────────────────────────── */

function KpiCard({ kpi }) {
  const positive = kpi.trend > 0
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-line bg-surface p-4 transition-shadow duration-150 hover:shadow-[0_2px_10px_rgba(19,21,23,0.07)] md:p-6">
      <span className="text-sm font-normal text-minor">{kpi.label}</span>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold leading-[1.1] text-major md:text-[32px]">{kpi.value}</span>
        {kpi.unit && <span className="text-base font-semibold text-minor">{kpi.unit}</span>}
      </div>
      <div className={`flex items-center gap-[3px] text-sm font-semibold ${positive ? 'text-primary' : 'text-danger'}`}>
        {positive ? <ArrowUpRight size={14} strokeWidth={2} /> : <ArrowDownRight size={14} strokeWidth={2} />}
        <span>{positive ? '+' : ''}{kpi.trend}{kpi.trendIsPercent ? '%' : ''} {kpi.trendLabel}</span>
      </div>
    </div>
  )
}

/* ─── Filter select ─────────────────────────────────────────────────── */

function FilterSelect({ label, value, onChange, options, placeholder }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <label className="text-sm font-semibold leading-[1.3] text-minor">{label}</label>
      <div className="relative flex items-center">
        <select
          className="h-[34px] w-full cursor-pointer appearance-none rounded border border-line bg-surface py-0 pl-3 pr-6 text-sm text-major transition-[border-color,box-shadow] duration-150 hover:border-[#9aabb0] focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/[0.12]"
          value={value}
          onChange={e => onChange(e.target.value)}
        >
          <option value="">{placeholder}</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ArrowDown size={14} strokeWidth={2} className="pointer-events-none absolute right-2 shrink-0 text-minor" />
      </div>
    </div>
  )
}

/* ─── Sortable column header ────────────────────────────────────────── */

function SortTh({ col, sortConfig, onSort, children, className = '' }) {
  const active = sortConfig.key === col
  return (
    <th
      className={`${TH} group cursor-pointer select-none hover:text-major ${className}`}
      onClick={() => onSort(col)}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        <span
          className={[
            'inline-flex items-center transition-colors duration-150',
            active ? 'text-primary' : 'text-line group-hover:text-minor',
          ].join(' ')}
        >
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
    <tr className="border-b border-line transition-colors duration-100 last:border-b-0 hover:bg-primary/[0.03]">
      <td className={CELL}>
        <button className={LINK_CELL} onClick={() => onNavigateClient?.(client.id)}>
          {client.name}
        </button>
      </td>
      <td className={`${CELL} text-minor`}>{client.sector}</td>
      <td className={`${CELL} text-right font-semibold`}>{client.commitment} EUR</td>
      <td className={`${CELL} text-center`}>{client.deals}</td>
      <td className={`${CELL} text-minor`}>{client.lastDeal}</td>
      <td className={CELL}>
        <span className={`${BADGE} ${health.cls}`}>{health.label}</span>
      </td>
      <td className={`${CELL} w-10 text-right`}>
        <a href="#" className={ICON_LINK} onClick={e => e.preventDefault()}>
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
    <tr
      className="cursor-pointer border-b border-line transition-colors duration-100 last:border-b-0 hover:bg-primary/[0.06]"
      onClick={handleOpen}
    >
      <td className={CELL}>
        <button className={LINK_CELL} onClick={e => { e.stopPropagation(); handleOpen() }}>
          {deal.name}
        </button>
      </td>
      <td className={`${CELL} text-minor`}>
        <button className={LINK_CELL} onClick={e => { e.stopPropagation(); onNavigateClient?.(deal.client) }}>
          {deal.client}
        </button>
      </td>
      <td className={`${CELL} text-right font-semibold`}>
        {deal.size} M {deal.currency}
      </td>
      <td className={CELL}>
        <span className={`${BADGE} ${STATUS_COLORS[deal.status] || STATUS_COLORS.Prospect}`}>
          {deal.status}
        </span>
      </td>
      <td className={`${CELL} text-minor`}>{deal.signingDate}</td>
      <td className={`${CELL} text-minor`}>{deal.maturityDate}</td>
      <td className={`${CELL} w-10 text-right`}>
        <button className={ICON_LINK} onClick={e => { e.stopPropagation(); handleOpen() }}>
          <ExternalLink size={14} strokeWidth={1.5} />
        </button>
      </td>
    </tr>
  )
}

/* ─── Page ──────────────────────────────────────────────────────────── */

export default function PortfolioPage({ offsetClass = '', onNavigateDeal, onNavigateClient, onNavigateHome }) {
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
    <main className={`relative mt-16 min-h-[calc(100vh-64px)] bg-page transition-[margin-left] duration-200 ease-out ${offsetClass}`}>

      {/* ── Breadcrumb ── */}
      <div className={breadcrumbBanner}>
        <button className={breadcrumbLink} onClick={() => onNavigateHome?.()}>Home</button>
        <ChevronRight size={14} strokeWidth={2} className="shrink-0 text-white/70" />
        <span className={breadcrumbCurrent}>My portfolio</span>
      </div>

      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 p-4 md:gap-8 md:p-8">

        {/* ── Page header ── */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-major">My portfolio</h1>
          <button className="inline-flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded border border-primary bg-primary px-4 text-xs font-semibold text-reverse transition-colors duration-150 hover:border-primary-hover hover:bg-primary-hover md:h-9 md:text-sm">
            <Download size={15} strokeWidth={1.8} />
            Export to Excel
          </button>
        </div>

        {/* ── KPIs ── */}
        <div className="grid grid-cols-2 gap-3 min-[901px]:grid-cols-4 md:gap-4">
          {KPIS.map(kpi => <KpiCard key={kpi.id} kpi={kpi} />)}
        </div>

        {/* ── Top clients ── */}
        <section className="flex flex-col gap-4 rounded-lg bg-surface p-4 md:gap-6 md:p-6">
          <div className="flex flex-col items-start justify-between gap-1.5 md:flex-row md:gap-4">
            <div>
              <h2 className="text-xl font-bold text-major">Top clients</h2>
              <p className="mt-0.5 text-sm font-normal text-minor">My most significant client relationships by current commitment.</p>
            </div>
            <a
              href="#"
              className="hidden shrink-0 items-center gap-1 whitespace-nowrap text-sm font-semibold text-primary underline underline-offset-2 transition-colors duration-150 hover:text-primary-hover md:inline-flex"
              onClick={e => e.preventDefault()}
            >
              See all clients <ExternalLink size={12} strokeWidth={1.5} />
            </a>
          </div>

          <div className="overflow-x-auto rounded-lg border border-line">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-line bg-page">
                  <th className={TH}>Client</th>
                  <th className={TH}>Sector</th>
                  <th className={`${TH} text-right`}>Commitment</th>
                  <th className={`${TH} text-center`}>Deals</th>
                  <th className={TH}>Last deal</th>
                  <th className={TH}>Status</th>
                  <th className={TH} />
                </tr>
              </thead>
              <tbody>
                {CLIENTS.map(c => <ClientRow key={c.id} client={c} onNavigateClient={onNavigateClient} />)}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Filter block ── */}
        <div className="flex flex-col gap-3 rounded-lg border border-line bg-surface px-4 py-3 md:px-6 md:py-4">
          <h3 className="text-base font-semibold leading-[1.3] text-major">Filters</h3>
          <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-[1fr_1fr_1fr_auto]">
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
            <div className="flex flex-row items-center justify-end gap-1.5 pb-px md:flex-col md:items-end">
              {hasActiveFilters && (
                <button
                  className="inline-flex h-[26px] cursor-pointer items-center gap-1 whitespace-nowrap rounded px-2 text-xs font-semibold text-danger transition-colors duration-150 hover:bg-[rgba(200,0,0,0.06)]"
                  onClick={clearFilters}
                >
                  <X size={13} strokeWidth={2} />
                  Clear filters
                </button>
              )}
              <button className="inline-flex h-[34px] cursor-pointer items-center gap-1 whitespace-nowrap rounded border border-line bg-surface px-3 text-sm font-semibold text-minor transition-[border-color,color] duration-150 hover:border-primary hover:text-primary">
                <Plus size={14} strokeWidth={2} />
                Show more filters
              </button>
            </div>
          </div>
        </div>

        {/* ── Booked deals ── */}
        <section className="flex flex-col gap-4 rounded-lg bg-surface p-4 md:gap-6 md:p-6">
          <div className="flex flex-col items-start justify-between gap-1.5 md:flex-row md:gap-4">
            <div>
              <h2 className="text-xl font-bold text-major">Booked deals</h2>
              <p className="mt-0.5 text-sm font-normal text-minor">All deals currently in progress across my portfolio.</p>
            </div>
          </div>

          {/* ── Deals table ── */}
          <div className="overflow-x-auto rounded-lg border border-line">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-line bg-page">
                  <SortTh col="name"         sortConfig={sortConfig} onSort={handleSort}>Deal</SortTh>
                  <SortTh col="client"       sortConfig={sortConfig} onSort={handleSort}>Client</SortTh>
                  <SortTh col="size"         sortConfig={sortConfig} onSort={handleSort} className="!text-right">Size</SortTh>
                  <SortTh col="status"       sortConfig={sortConfig} onSort={handleSort}>Status</SortTh>
                  <SortTh col="signingDate"  sortConfig={sortConfig} onSort={handleSort}>Signing date</SortTh>
                  <SortTh col="maturityDate" sortConfig={sortConfig} onSort={handleSort}>Maturity date</SortTh>
                  <th className={TH} />
                </tr>
              </thead>
              <tbody>
                {visibleDeals.map(d => (
                  <DealRow key={d.id} deal={d} onNavigateDeal={onNavigateDeal} onNavigateClient={onNavigateClient} />
                ))}
              </tbody>
            </table>
            {visibleDeals.length === 0 && (
              <p className="p-8 text-center text-sm text-minor">No deals match the current filters.</p>
            )}
          </div>

          {/* Result count */}
          <p className="pt-1 text-right text-sm text-minor">{visibleDeals.length} deal{visibleDeals.length !== 1 ? 's' : ''}</p>
        </section>

      </div>
    </main>
  )
}
