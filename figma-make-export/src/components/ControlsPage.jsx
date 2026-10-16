import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { chip, breadcrumbBanner, breadcrumbLink, breadcrumbCurrent } from '../ui'

/* ── Mock data ──────────────────────────────────────────────────── */
const CONTROLS = [
  {
    id: 1, severity: 'blocking', severityLabel: 'Operational',
    deal: 'Silverpath Infra', object: 'Tranche TLB-01',
    problem: 'Tranche without amortization schedule',
    impact: 'Cannot compute payment schedule → blocks booking',
    action: 'Add an amortization schedule',
    owner: 'Front Office / Structuration',
  },
  {
    id: 2, severity: 'regulatory', severityLabel: 'Regulatory',
    deal: 'Silverpath Infra', object: 'Deal (global level)',
    problem: 'Incorrect Basel portfolio (Corporate instead of Specialized Lending)',
    impact: 'Non-compliance risk on RWA and regulatory capital',
    action: 'Verify classification with Risk / Coverage',
    owner: 'Risk / Front Office',
  },
  {
    id: 3, severity: 'regulatory', severityLabel: 'Counterparty',
    deal: 'Energy Project', object: 'Orion Tech Subsidiary GmbH',
    problem: 'Incomplete KYC (UBO not validated)',
    impact: 'Regulatory block before booking',
    action: 'Escalate to KYC team',
    owner: 'KYC / Compliance',
  },
  {
    id: 4, severity: 'warning', severityLabel: 'Revenues',
    deal: 'Silverpath Infra', object: 'Facility Fee',
    problem: 'Fee calculated without pro-rata temporis',
    impact: 'Incorrect P&L (non-blocking)',
    action: 'Fix calculation formula',
    owner: 'Middle Office / Product Control',
  },
  {
    id: 5, severity: 'warning', severityLabel: 'Operational',
    deal: 'Nordic Wind Farm', object: 'Security Package',
    problem: 'Missing insurance certificate',
    impact: 'Condition precedent unsatisfied – first drawdown blocked',
    action: 'Request certificate from borrower',
    owner: 'Front Office',
  },
  {
    id: 6, severity: 'regulatory', severityLabel: 'Regulatory',
    deal: 'Meridian Solar II', object: 'Loan Agreement – Annex B',
    problem: 'Environmental clause not aligned with EU taxonomy',
    impact: 'Green bond eligibility at risk',
    action: 'Update clause with legal team',
    owner: 'Legal / ESG',
  },
]

const SEVERITY_FILTERS = [
  { id: 'all',        label: 'All' },
  { id: 'blocking',   label: 'Blocking' },
  { id: 'regulatory', label: 'Regulatory' },
  { id: 'warning',    label: 'Warning' },
]

/* Severity accents are their own scale, deliberately outside the theme tokens. */
const SEVERITY_META = {
  blocking:   { label: 'Blocking',   badge: 'bg-[#c81e1e]/10 text-[#c81e1e]', rule: 'border-l-[3px] border-l-[#c81e1e]', kpi: 'bg-[#c81e1e]/[0.08] text-[#c81e1e]' },
  regulatory: { label: 'Regulatory', badge: 'bg-[#116f6a]/10 text-[#116f6a]', rule: 'border-l-[3px] border-l-[#116f6a]', kpi: 'bg-[#116f6a]/[0.08] text-[#116f6a]' },
  warning:    { label: 'Warning',    badge: 'bg-[#c0580e]/10 text-[#c0580e]', rule: 'border-l-[3px] border-l-[#c0580e]', kpi: 'bg-[#c0580e]/[0.08] text-[#c0580e]' },
}

/* ── Page ───────────────────────────────────────────────────────── */
export default function ControlsPage({ offsetClass = '', onNavigateHome }) {
  const [activeFilter, setActiveFilter] = useState('all')

  const filtered = activeFilter === 'all'
    ? CONTROLS
    : CONTROLS.filter(c => c.severity === activeFilter)

  const counts = {
    blocking:   CONTROLS.filter(c => c.severity === 'blocking').length,
    regulatory: CONTROLS.filter(c => c.severity === 'regulatory').length,
    warning:    CONTROLS.filter(c => c.severity === 'warning').length,
  }

  return (
    <main className={`relative mt-16 min-h-[calc(100vh-64px)] bg-page ${offsetClass}`}>

      {/* Breadcrumb */}
      <div className={breadcrumbBanner}>
        <button className={breadcrumbLink} onClick={() => onNavigateHome?.()}>Home</button>
        <ChevronRight size={14} strokeWidth={2} className="shrink-0 text-white/70" />
        <span className={breadcrumbCurrent}>Controls</span>
      </div>

      <div className="mx-auto flex max-w-[1200px] flex-col gap-5 p-4 md:gap-8 md:p-8">

        {/* Header */}
        <div className="flex flex-col flex-wrap items-start justify-between gap-4 md:flex-row md:gap-6">
          <div>
            <h1 className="text-2xl font-bold text-major">Controls</h1>
            <p className="mt-0.5 text-base font-normal text-minor">
              {CONTROLS.length} controls detected across your active deals.
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="flex shrink-0 justify-start gap-3 md:gap-4">
              {['blocking', 'regulatory', 'warning'].map(key => (
                <div
                  key={key}
                  className={`flex min-w-[64px] flex-col items-center justify-center gap-0.5 rounded-lg px-3 py-2 md:min-w-[72px] md:px-4 md:py-3 ${SEVERITY_META[key].kpi}`}
                >
                  <span className="text-xl font-bold leading-none md:text-2xl">{counts[key]}</span>
                  <span className="text-sm font-semibold leading-[1.2]">{SEVERITY_META[key].label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {SEVERITY_FILTERS.map(f => (
            <button
              key={f.id}
              className={chip(activeFilter === f.id)}
              onClick={() => setActiveFilter(f.id)}
            >
              {f.label}{f.id !== 'all' ? ` (${counts[f.id]})` : ` (${CONTROLS.length})`}
            </button>
          ))}
        </div>

        {/* Controls list */}
        <div className="flex flex-col gap-4">
          {filtered.map(ctrl => {
            const meta = SEVERITY_META[ctrl.severity]
            return (
              <div
                key={ctrl.id}
                className={`grid grid-cols-1 items-start gap-4 rounded-lg border border-line bg-surface p-6 transition-shadow duration-150 hover:shadow-[0_2px_10px_rgba(19,21,23,0.08)] md:grid-cols-[200px_1fr_240px] md:gap-6 ${meta.rule}`}
              >
                {/* Left: badge + deal + object */}
                <div className="flex flex-col gap-2">
                  <span className={`inline-flex h-5 w-fit items-center rounded px-2 text-[11px] font-semibold tracking-[0.03em] ${meta.badge}`}>
                    {meta.label}
                  </span>
                  <p className="m-0 text-base font-semibold text-major">{ctrl.deal}</p>
                  <p className="m-0 text-sm text-minor">{ctrl.object}</p>
                </div>

                {/* Center: problem + impact */}
                <div className="flex flex-col gap-1.5">
                  <p className="m-0 text-base font-semibold text-major">{ctrl.problem}</p>
                  <p className="m-0 text-sm text-minor">{ctrl.impact}</p>
                </div>

                {/* Right: suggested action + owner */}
                <div className="flex flex-col gap-1 rounded-md bg-page px-4 py-3">
                  <p className="m-0 text-sm font-semibold uppercase tracking-[0.04em] text-minor">Suggested action</p>
                  <p className="m-0 text-base font-semibold text-major">{ctrl.action}</p>
                  <p className="m-0 text-sm text-minor">{ctrl.owner}</p>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <p className="p-8 text-center text-base text-minor">No controls for this filter.</p>
          )}
        </div>

      </div>
    </main>
  )
}
