import { useState } from 'react'
import { Wallet, ChevronUp, ChevronDown } from 'lucide-react'

const METRICS = [
  { label: 'Booked deals',        value: '28' },
  { label: 'Year-to-Date NBI',    value: '500.9 M EUR' },
  { label: 'RWA',                 value: '197.5 M EUR' },
  { label: 'Current commitment',  value: '499 M EUR' },
]

export default function ScopeOverview({ onNavigatePortfolio }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <section className="flex flex-col gap-8 overflow-hidden rounded-2xl border border-white/75 bg-surface p-6 backdrop-blur-[16px]">
      {/* Section header */}
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-major">Scope overview</h2>
          <p className="text-sm font-normal text-minor">A summary of my portfolio activity.</p>
        </div>
        <button
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-major transition-colors duration-150 hover:bg-page"
          onClick={() => setExpanded(e => !e)}
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          {expanded ? <ChevronUp size={16} strokeWidth={2} /> : <ChevronDown size={16} strokeWidth={2} />}
        </button>
      </div>

      {/* Portfolio card (shown when expanded) */}
      {expanded && (
        <div className="flex min-h-[216px] flex-col gap-4 rounded-lg border border-line bg-surface p-4">
          {/* Card header */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary-subtle text-primary">
              <Wallet size={20} strokeWidth={1.5} />
            </div>
            <h3 className="flex-1 text-lg font-bold text-major">My portfolio</h3>
            <button
              className="shrink-0 whitespace-nowrap p-0 text-base font-semibold text-primary underline hover:text-primary-hover"
              onClick={() => onNavigatePortfolio?.()}
            >
              See portfolio
            </button>
          </div>

          {/* Divider */}
          <div className="h-px shrink-0 bg-line" />

          {/* Metrics list */}
          <ul className="flex flex-col gap-2">
            {METRICS.map(m => (
              <li key={m.label} className="flex items-center gap-1 text-base text-major">
                <span className="flex-1 font-normal">{m.label}</span>
                <span className="whitespace-nowrap font-bold">{m.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
