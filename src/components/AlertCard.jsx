import { ExternalLink, CreditCard } from 'lucide-react'
import './AlertCard.css'

/**
 * @param {{
 *   tag?: string,           // label of the top badge (e.g. "Critical alert")
 *   tagVariant?: 'danger',  // colour variant for the badge
 *   title: string,
 *   linkLabel: string,
 *   description: string,
 *   clients: Array<{name: string}>
 * }} props
 */
export default function AlertCard({ tag, tagVariant = 'danger', title, linkLabel, description, clients = [], onNavigate }) {
  const hasDanger = tagVariant === 'danger'

  return (
    <div className={`alert-card__wrapper`}>
      {/* Top badge */}
      {tag && (
        <div className={`alert-card__tag alert-card__tag--${tagVariant}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{tag}</span>
        </div>
      )}

      {/* Card */}
      <div className={`alert-card${hasDanger && tag ? ' alert-card--danger' : ''}`}>
        {/* Title row */}
        <div className="alert-card__title-row">
          <h3 className="alert-card__title">{title}</h3>
          <button className="alert-card__link" onClick={onNavigate}>
            <span>{linkLabel}</span>
            <ExternalLink size={14} strokeWidth={2} />
          </button>
        </div>

        {/* Divider */}
        <div className="alert-card__divider" />

        {/* Description */}
        <p className="alert-card__desc">{description}</p>

        {/* Clients */}
        {clients.length > 0 && (
          <div className="alert-card__clients">
            <CreditCard size={20} strokeWidth={1.5} className="alert-card__clients-icon" />
            {clients.map((c, i) => (
              <span key={c.name} className="alert-card__clients-group">
                {i > 0 && <span className="alert-card__clients-sep">/</span>}
                <a className="alert-card__client-link" href="#">{c.name}</a>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
