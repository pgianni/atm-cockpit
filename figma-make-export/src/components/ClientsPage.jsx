import { useState, useEffect } from 'react'
import {
  ChevronRight, ChevronUp, ChevronDown, MessageSquare, Download,
  Network, Bell, Activity, Briefcase, Target, FolderOpen, ExternalLink,
  Eye, Gauge,
} from 'lucide-react'
import { TH, CELL, T_LINK, ROW, PRIMARY_BTN, TABLE_WRAP, TABLE, SortableTh, SearchRow, TableFooter } from './DataTable'

/* ── Shared class fragments ───────────────────────────────────────── */
/* Modules sit in a centred column; the hero below spans the full width. */
const MODULE   = 'mx-auto flex w-[calc(100%-32px)] max-w-[1200px] flex-col gap-6 rounded-lg bg-surface p-4 md:w-[calc(100%-64px)] md:p-6'
const CP_LINK  = 'mt-0.5 inline-flex items-center gap-1 text-sm font-semibold text-primary underline transition-opacity hover:opacity-80'
const META_LBL = 'm-0 text-xs font-normal text-white/75'
const HERO_LNK = 'inline-flex cursor-pointer items-center gap-1 font-semibold text-white underline transition-opacity hover:opacity-85'


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
    <div className="flex items-start justify-between gap-4">
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary-subtle text-primary">
          <Icon size={18} strokeWidth={1.75} />
        </div>
        <div className="flex min-w-0 flex-col gap-0.5 pt-0.5">
          <h2 className="m-0 text-xl font-bold text-major">{title}</h2>
          {showStatus && (
            <p className="m-0 text-sm text-minor [&_a]:font-semibold [&_a]:text-primary [&_a]:underline hover:[&_a]:opacity-80">
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
      <div className="flex shrink-0 items-center gap-2">
        {rightContent}
        {showExport && (
          <button
            className="inline-flex h-8 cursor-pointer items-center gap-2 rounded bg-transparent px-2 text-sm font-semibold text-primary hover:bg-primary-subtle"
            onClick={onExport}
          >
            <Download size={14} strokeWidth={1.75} />
            Export
          </button>
        )}
        <button
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded bg-transparent text-minor hover:bg-line"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <ChevronDown size={16} strokeWidth={1.75} /> : <ChevronUp size={16} strokeWidth={1.75} />}
        </button>
      </div>
    </div>
  )
}

/* ── Main component ────────────────────────────────────────────────── */
export default function ClientsPage({ offsetClass = '', clientId, onBack, onNavigateHome, onNavigatePortfolio, onNavigateDeal }) {
  const [activeFilter, setActiveFilter] = useState('active')
  const CLIENT_DATA = resolveClient(clientId)
  const PARENT_GROUP = CLIENT_DATA.parent
  const EXPOSURE_METRICS = CLIENT_DATA.exposure

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [clientId])

  return (
    <main className={`relative mt-16 min-h-[calc(100vh-64px)] bg-page transition-[margin-left] duration-200 ease-out ${offsetClass}`}>
      {/* Breadcrumb */}
      <div className="relative z-[202] flex h-10 items-center bg-[linear-gradient(90deg,#005740_0%,#007d57_60%,#009a6a_100%)] px-4 md:px-8">
        <nav className="flex items-center gap-0.5" aria-label="Breadcrumb">
          <button onClick={() => onNavigateHome?.()} className="cursor-pointer whitespace-nowrap p-0 text-base font-semibold text-reverse underline hover:opacity-80">Home</button>
          <ChevronRight size={16} strokeWidth={1.5} className="shrink-0 text-reverse" />
          <button onClick={() => onNavigatePortfolio?.()} className="cursor-pointer whitespace-nowrap p-0 text-base font-semibold text-reverse underline hover:opacity-80">Portfolio</button>
          <ChevronRight size={16} strokeWidth={1.5} className="shrink-0 text-reverse" />
          <span className="whitespace-nowrap text-base font-semibold text-reverse">{CLIENT_DATA.name}</span>
        </nav>
      </div>

      <div className="flex flex-col gap-4 pb-12">
        {/* ── Client Header ───────────────────────────────────────── */}
        <div className="relative z-[202] flex flex-col gap-6 bg-[linear-gradient(135deg,#005740_0%,#007d57_40%,#009a6a_100%)] px-4 pb-6 pt-5 text-white md:px-10 md:pb-10 md:pt-8">
          <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-white/10">
                <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="h-10 w-10">
                  <rect x="4" y="4" width="40" height="40" rx="4" fill="rgba(255,255,255,0.15)" />
                  <circle cx="24" cy="18" r="5" fill="rgba(255,255,255,0.55)" />
                  <path d="M12 38c2-6 6-9 12-9s10 3 12 9" stroke="rgba(255,255,255,0.55)" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex-1">
                <h1 className="m-0 mb-2 text-2xl font-bold leading-[1.2] text-white">{CLIENT_DATA.name}</h1>
                <div className="flex flex-wrap items-center gap-2 text-sm text-white/95 md:gap-6">
                  <span>CPY ID: <strong className="font-semibold text-white">{CLIENT_DATA.cpyId}</strong></span>
                  <span>Sub Client: <strong className="font-semibold text-white">{CLIENT_DATA.subClientName} (ID: {CLIENT_DATA.subClientId})</strong></span>
                  <a href="#" className={`${HERO_LNK} text-sm`} onClick={e => e.preventDefault()}>
                    Open in ClientLive <ExternalLink size={12} strokeWidth={2} />
                  </a>
                </div>
              </div>
            </div>

            {/* Header Metrics – 6 cards */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex min-h-[80px] flex-col gap-1 rounded-md bg-black/[0.18] px-4 py-3">
                <p className={META_LBL}>Primary Coverage Officer</p>
                <p className="m-0 text-base font-bold leading-[1.35] text-white">{CLIENT_DATA.coverage}</p>
                <a href="#" className={`${HERO_LNK} mt-0.5 text-xs`} onClick={e => e.preventDefault()}>
                  <MessageSquare size={12} strokeWidth={2} /> Chat on Teams
                </a>
              </div>
              <div className="flex min-h-[80px] flex-col gap-1 rounded-md bg-black/[0.18] px-4 py-3">
                <p className={META_LBL}>Internal rating</p>
                <p className="m-0 text-base font-bold leading-[1.35] text-white">{CLIENT_DATA.internalRating}</p>
                <p className={META_LBL}>Next review: {CLIENT_DATA.nextReview}</p>
              </div>
              <div className="flex min-h-[80px] flex-col gap-1 rounded-md bg-black/[0.18] px-4 py-3">
                <p className={META_LBL}>KYC</p>
                <div className="inline-flex w-fit items-center gap-1 rounded-xl bg-[#14851d] px-2.5 py-[3px] text-[13px] font-semibold text-white">
                  ✓ {CLIENT_DATA.kyc}
                </div>
                <a href="#" className={`${HERO_LNK} mt-0.5 text-xs`} onClick={e => e.preventDefault()}>
                  Open in Kiwis <ExternalLink size={12} strokeWidth={2} />
                </a>
              </div>
              <div className="flex min-h-[80px] flex-col gap-1 rounded-md bg-black/[0.18] px-4 py-3">
                <p className={META_LBL}>Region &amp; Country of risk</p>
                <p className="m-0 text-base font-bold leading-[1.35] text-white">{CLIENT_DATA.region}</p>
              </div>
              <div className="flex min-h-[80px] flex-col gap-1 rounded-md bg-black/[0.18] px-4 py-3">
                <p className={META_LBL}>Business sector</p>
                <p className="m-0 text-base font-bold leading-[1.35] text-white">{CLIENT_DATA.sector}</p>
              </div>
              <div className="flex min-h-[80px] flex-col gap-1 rounded-md bg-black/[0.18] px-4 py-3">
                <p className={META_LBL}>Sub client sector</p>
                <p className="m-0 text-base font-bold leading-[1.35] text-white">{CLIENT_DATA.subSector}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Parent group ────────────────────────────────────────── */}
        <section className={MODULE}>
          <ModuleHeader icon={Network} title="Parent group" showStatus={false} showExport={false} />
          <div className="h-px bg-line" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            <div className="flex flex-col gap-1">
              <p className="m-0 text-xs leading-[18px] text-minor">CPH name</p>
              <p className="m-0 text-base font-semibold text-major">{PARENT_GROUP.cphName}</p>
              <p className="m-0 text-sm text-major">ID: {PARENT_GROUP.cphId}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="m-0 text-xs leading-[18px] text-minor">Root client name</p>
              <p className="m-0 text-base font-semibold text-major">{PARENT_GROUP.rootClientName}</p>
              <p className="m-0 text-sm text-major">ID: {PARENT_GROUP.rootClientId}</p>
              <a href="#" className={CP_LINK} onClick={e => e.preventDefault()}>
                Open in ClientLive <ExternalLink size={12} strokeWidth={2} />
              </a>
            </div>
            <div className="flex flex-col gap-1">
              <p className="m-0 text-xs leading-[18px] text-minor">Root client sector</p>
              <p className="m-0 text-base font-semibold text-major">{PARENT_GROUP.rootClientSector}</p>
            </div>
          </div>
        </section>

        {/* ── Alerts & upcoming actions ───────────────────────────── */}
        <section className={MODULE}>
          <ModuleHeader icon={Bell} title="Alerts & upcoming actions" />
          <div className="h-px bg-line" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {ALERTS.map((alert, idx) => (
              <div
                key={idx}
                className={`relative flex flex-col gap-2 rounded-md border p-4 ${alert.isCritical ? 'border-[#e11d48]' : 'border-line'}`}
              >
                {alert.isCritical && (
                  <div className="absolute -top-2.5 left-4 inline-flex h-5 items-center gap-1 rounded-[10px] border border-[#e11d48] bg-surface px-2 text-[11px] font-semibold text-[#e11d48]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#e11d48]" />
                    Critical alert
                  </div>
                )}
                <div className="mt-1 flex items-center justify-between gap-3">
                  <h3 className="m-0 text-base font-bold text-major">{alert.title}</h3>
                  <a href="#" className={CP_LINK} onClick={e => e.preventDefault()}>
                    {alert.actionLabel} <ExternalLink size={12} strokeWidth={2} />
                  </a>
                </div>
                <p className="m-0 text-sm leading-[1.5] text-minor">{alert.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Exposure & performance ──────────────────────────────── */}
        <section className={MODULE}>
          <ModuleHeader icon={Activity} title="Exposure & performance" />
          <div className="h-px bg-line" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {EXPOSURE_METRICS.map((m, idx) => (
              <div key={idx} className="flex min-h-[114px] flex-col gap-4 rounded-lg border border-line bg-surface p-4">
                <p className="m-0 text-sm text-major">{m.label}</p>
                <p className="m-0 text-xl font-bold text-major">{m.value}</p>
              </div>
            ))}
          </div>
          <button className={PRIMARY_BTN}>
            <Gauge size={14} strokeWidth={2} />
            Explore analytics
          </button>
        </section>

        {/* ── Booked deals ────────────────────────────────────────── */}
        <section className={MODULE}>
          <ModuleHeader icon={Briefcase} title={`Booked deals (${BOOKED_DEALS.length})`} />
          <div className="h-px bg-line" />
          <div className={TABLE_WRAP}>
            <table className={TABLE}>
              <thead>
                <tr>
                  <SortableTh>Deal</SortableTh>
                  <SortableTh>Trade date</SortableTh>
                  <SortableTh>Maturity date</SortableTh>
                  <SortableTh>Commitment</SortableTh>
                  <SortableTh>RWA Economic</SortableTh>
                  <th className={TH} style={{ width: 36 }} />
                </tr>
                <SearchRow cols={[1, 2, 3, 4, 5, 6]} />
              </thead>
              <tbody>
                {BOOKED_DEALS.map((deal, idx) => (
                  <tr
                    key={idx}
                    className={`${ROW} cursor-pointer`}
                    onClick={() => onNavigateDeal?.(deal.dealId)}
                  >
                    <td className={CELL}>
                      <button className={T_LINK} onClick={e => { e.stopPropagation(); onNavigateDeal?.(deal.dealId) }}>{deal.name}</button>
                    </td>
                    <td className={CELL}>{deal.tradeDate}</td>
                    <td className={CELL}>{deal.maturityDate}</td>
                    <td className={CELL}>{deal.commitment}</td>
                    <td className={CELL}>{deal.rwa}</td>
                    <td className={`${CELL} w-9 text-center text-minor`}>
                      <Eye size={14} strokeWidth={1.75} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <TableFooter>
              <span>Rows: 2</span>
              <span>
                Total commitment: <strong className="font-bold text-major">125 M EUR</strong> · Total RWA Economic: <strong className="font-bold text-major">52 M EUR</strong>
              </span>
            </TableFooter>
          </div>
        </section>

        {/* ── Opportunities ───────────────────────────────────────── */}
        <section className={MODULE}>
          <ModuleHeader icon={Target} title="Opportunities (7)" />
          <div className="h-px bg-line" />
          <div className="flex flex-wrap gap-2">
            {OPP_FILTERS.map(f => (
              <button
                key={f.id}
                className={[
                  'inline-flex h-6 cursor-pointer items-center gap-1 rounded-xl border px-3 text-xs font-medium transition-all duration-150',
                  activeFilter === f.id
                    ? 'border-primary bg-primary text-white'
                    : 'border-line bg-surface text-major hover:border-primary hover:text-primary',
                ].join(' ')}
                onClick={() => setActiveFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className={TABLE_WRAP}>
            <table className={TABLE}>
              <thead>
                <tr>
                  <SortableTh>Deal & status</SortableTh>
                  <SortableTh>Deal size</SortableTh>
                  <SortableTh>Final take amount</SortableTh>
                  <SortableTh>Expected booking date</SortableTh>
                  <SortableTh>Probability</SortableTh>
                  <th className={TH} style={{ width: 36 }} />
                </tr>
                <SearchRow cols={[1, 2, 3, 4, 5, 6]} />
              </thead>
              <tbody>
                {OPPORTUNITIES.map((opp, idx) => (
                  <tr key={idx} className={ROW}>
                    <td className={CELL}>
                      <div className="flex flex-col gap-0.5">
                        <a href="#" className={T_LINK} onClick={e => e.preventDefault()}>{opp.name}</a>
                        <span className="inline-flex w-fit items-center rounded-[10px] bg-line px-1.5 py-px text-[10px] font-semibold text-minor">{opp.status}</span>
                      </div>
                    </td>
                    <td className={CELL}>{opp.dealSize}</td>
                    <td className={CELL}>{opp.finalTake}</td>
                    <td className={CELL}>{opp.expectedBooking}</td>
                    <td className={CELL}>{opp.probability}</td>
                    <td className={`${CELL} w-9 text-center text-minor`}>
                      <Eye size={14} strokeWidth={1.75} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <TableFooter>
              <span>Rows: 1</span>
              <span>
                Total size: <strong className="font-bold text-major">5.8 M EUR</strong> · Total final take amount: <strong className="font-bold text-major">12 M EUR</strong>
              </span>
            </TableFooter>
          </div>
        </section>

        {/* ── Recent documents ────────────────────────────────────── */}
        <section className={MODULE}>
          <ModuleHeader icon={FolderOpen} title="Recent documents" />
          <div className="h-px bg-line" />
          <div className={TABLE_WRAP}>
            <table className={TABLE}>
              <thead>
                <tr>
                  <SortableTh>Document name</SortableTh>
                  <SortableTh>Document type</SortableTh>
                  <SortableTh>Deal</SortableTh>
                  <SortableTh>Owner</SortableTh>
                  <SortableTh>Last update</SortableTh>
                  <th className={TH} style={{ width: 72 }} />
                </tr>
                <SearchRow cols={[1, 2, 3, 4, 5, 6]} />
              </thead>
              <tbody>
                {DOCUMENTS.map((doc, idx) => (
                  <tr key={idx} className={ROW}>
                    <td className={CELL}>{doc.name}</td>
                    <td className={CELL}>{doc.type}</td>
                    <td className={CELL}>
                      <div className="flex items-center gap-2">
                        <a href="#" className={T_LINK} onClick={e => e.preventDefault()}>{doc.deal}</a>
                        <span
                          className={[
                            'inline-flex items-center whitespace-nowrap rounded-[10px] px-2 py-0.5 text-[11px] font-semibold',
                            doc.dealType === 'Opportunity'
                              ? 'bg-[#b45309]/10 text-[#b45309]'
                              : 'bg-primary-subtle text-primary',
                          ].join(' ')}
                        >
                          {doc.dealType}
                        </span>
                      </div>
                    </td>
                    <td className={CELL}>{doc.owner}</td>
                    <td className={CELL}>{doc.updated}</td>
                    <td className={`${CELL} w-[72px] text-right text-minor [&_svg]:ml-2 [&_svg]:inline [&_svg]:cursor-pointer hover:[&_svg]:text-primary`}>
                      <Eye size={14} strokeWidth={1.75} />
                      <Download size={14} strokeWidth={1.75} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <TableFooter>
              <span>Rows: 3</span>
            </TableFooter>
          </div>
          <button className={PRIMARY_BTN}>
            <FolderOpen size={14} strokeWidth={2} />
            Explore repository
          </button>
        </section>
      </div>
    </main>
  )
}
