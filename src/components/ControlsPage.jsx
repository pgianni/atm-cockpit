import { useState } from 'react'
import { ChevronRight, ShieldAlert, Download } from 'lucide-react'
import './ControlsPage.css'

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

const SEVERITY_META = {
  blocking:   { label: 'Blocking',   cls: 'ctrl-badge--blocking'   },
  regulatory: { label: 'Regulatory', cls: 'ctrl-badge--regulatory' },
  warning:    { label: 'Warning',    cls: 'ctrl-badge--warning'    },
}

/* ── Page ───────────────────────────────────────────────────────── */
export default function ControlsPage({ style, onNavigateHome }) {
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
    <main className="controls-page" style={style}>

      {/* Breadcrumb */}
      <div className="controls-page__breadcrumb">
        <button className="controls-page__bc-link" onClick={() => onNavigateHome?.()}>Home</button>
        <ChevronRight size={14} strokeWidth={2} className="controls-page__bc-sep" />
        <span className="controls-page__bc-current">Controls</span>
      </div>

      <div className="controls-page__content">

        {/* Header */}
        <div className="controls-page__header">
          <div>
            <h1 className="controls-page__title">Controls</h1>
            <p className="controls-page__subtitle">
              {CONTROLS.length} controls detected across your active deals.
            </p>
          </div>
          <div className="controls-page__header-right">
            <div className="controls-page__kpis">
              <div className="ctrl-kpi ctrl-kpi--blocking">
                <span className="ctrl-kpi__value">{counts.blocking}</span>
                <span className="ctrl-kpi__label">Blocking</span>
              </div>
              <div className="ctrl-kpi ctrl-kpi--regulatory">
                <span className="ctrl-kpi__value">{counts.regulatory}</span>
                <span className="ctrl-kpi__label">Regulatory</span>
              </div>
              <div className="ctrl-kpi ctrl-kpi--warning">
                <span className="ctrl-kpi__value">{counts.warning}</span>
                <span className="ctrl-kpi__label">Warning</span>
              </div>
            </div>
            <button className="controls-page__export-btn">
              <Download size={15} strokeWidth={1.8} />
              Export to Excel
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="controls-page__filters">
          {SEVERITY_FILTERS.map(f => (
            <button
              key={f.id}
              className={`chip${activeFilter === f.id ? ' chip--active' : ''}`}
              onClick={() => setActiveFilter(f.id)}
            >
              {f.label}{f.id !== 'all' ? ` (${counts[f.id]})` : ` (${CONTROLS.length})`}
            </button>
          ))}
        </div>

        {/* Controls list */}
        <div className="controls-list">
          {filtered.map(ctrl => {
            const meta = SEVERITY_META[ctrl.severity]
            return (
              <div key={ctrl.id} className={`ctrl-card ctrl-card--${ctrl.severity}`}>
                {/* Left: badge + deal + object */}
                <div className="ctrl-card__left">
                  <span className={`ctrl-badge ${meta.cls}`}>{meta.label}</span>
                  <p className="ctrl-card__deal">{ctrl.deal}</p>
                  <p className="ctrl-card__object">{ctrl.object}</p>
                </div>

                {/* Center: problem + impact */}
                <div className="ctrl-card__body">
                  <p className="ctrl-card__problem">{ctrl.problem}</p>
                  <p className="ctrl-card__impact">{ctrl.impact}</p>
                </div>

                {/* Right: suggested action + owner */}
                <div className="ctrl-card__right">
                  <p className="ctrl-card__action-label">Suggested action</p>
                  <p className="ctrl-card__action">{ctrl.action}</p>
                  <p className="ctrl-card__owner">{ctrl.owner}</p>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <p className="controls-page__empty">No controls for this filter.</p>
          )}
        </div>

      </div>
    </main>
  )
}
