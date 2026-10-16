import { ExternalLink, CreditCard } from 'lucide-react'

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
    <div className="relative min-w-0 flex-1 pt-[11px]">
      {/* Top badge */}
      {tag && (
        <div
          className={[
            'absolute left-1/2 top-0 z-[1] flex h-[22px] -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-2xl px-2 text-sm font-semibold text-reverse',
            tagVariant === 'danger' ? 'bg-danger' : '',
          ].join(' ')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{tag}</span>
        </div>
      )}

      {/* Card */}
      <div
        className={[
          'flex h-[156px] flex-col gap-4 overflow-hidden rounded-lg border bg-surface p-4',
          hasDanger && tag ? 'border-line-danger' : 'border-line',
        ].join(' ')}
      >
        {/* Title row */}
        <div className="flex items-center gap-2">
          <h3 className="line-clamp-1 flex-1 overflow-hidden text-lg font-bold text-major">{title}</h3>
          <button className="flex shrink-0 items-center gap-1 whitespace-nowrap text-base font-semibold text-primary underline hover:text-primary-hover">
            <span>{linkLabel}</span>
            <ExternalLink size={14} strokeWidth={2} />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px shrink-0 bg-line" />

        {/* Description */}
        <p className="line-clamp-2 overflow-hidden text-base font-normal text-minor">{description}</p>

        {/* Clients */}
        {clients.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <CreditCard size={20} strokeWidth={1.5} className="shrink-0 text-minor" />
            {clients.map((c, i) => (
              <span key={c.name} className="flex items-center gap-2">
                {i > 0 && <span className="text-base text-major">/</span>}
                <a className="whitespace-nowrap text-base font-semibold text-primary underline hover:text-primary-hover" href="#">{c.name}</a>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
