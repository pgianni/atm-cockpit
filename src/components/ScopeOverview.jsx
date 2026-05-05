import { useState } from 'react'
import { Wallet, ChevronUp, ChevronDown } from 'lucide-react'
import './ScopeOverview.css'

const METRICS = [
  { label: 'Booked deals',        value: '28' },
  { label: 'Year-to-Date NBI',    value: '500.9 M EUR' },
  { label: 'RWA',                 value: '197.5 M EUR' },
  { label: 'Current commitment',  value: '499 M EUR' },
]

export default function ScopeOverview({ onNavigatePortfolio }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <section className="scope">
      {/* Section header */}
      <div className="scope__header">
        <div className="scope__header-text">
          <h2 className="scope__title">Scope overview</h2>
          <p className="scope__subtitle">A summary of my portfolio activity.</p>
        </div>
        <button
          className="scope__toggle-btn"
          onClick={() => setExpanded(e => !e)}
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          {expanded ? <ChevronUp size={16} strokeWidth={2} /> : <ChevronDown size={16} strokeWidth={2} />}
        </button>
      </div>

      {/* Portfolio card (shown when expanded) */}
      {expanded && (
        <div className="scope__card">
          {/* Card header */}
          <div className="scope__card-header">
            <div className="scope__card-icon-wrap">
              <Wallet size={20} strokeWidth={1.5} />
            </div>
            <h3 className="scope__card-title">My portfolio</h3>
            <button className="scope__card-link" onClick={() => onNavigatePortfolio?.()}>See portfolio</button>
          </div>

          {/* Divider */}
          <div className="scope__card-divider" />

          {/* Metrics list */}
          <ul className="scope__metrics">
            {METRICS.map(m => (
              <li key={m.label} className="scope__metric-row">
                <span className="scope__metric-label">{m.label}</span>
                <span className="scope__metric-value">{m.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
