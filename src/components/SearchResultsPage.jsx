import { useState } from 'react'
import {
  Search, SlidersHorizontal, ArrowUpDown,
  FileText, Handshake, Layers, Building2, ShieldCheck, Lock, File,
  ChevronDown, ChevronUp, ExternalLink, Filter, X
} from 'lucide-react'
import { RESULTS, TYPE_ICON, TYPE_LABEL } from '../data/searchData'
import './SearchResultsPage.css'

const TYPE_FILTERS = [
  { key: 'all',      label: 'Tout',       icon: Search },
  { key: 'deal',     label: 'Deals',      icon: Handshake },
  { key: 'contrat',  label: 'Contrats',   icon: FileText },
  { key: 'tranche',  label: 'Tranches',   icon: Layers },
  { key: 'asset',    label: 'Assets',     icon: Building2 },
  { key: 'covenant', label: 'Covenants',  icon: ShieldCheck },
  { key: 'surete',   label: 'Sûretés',   icon: Lock },
  { key: 'document', label: 'Documents',  icon: File },
]

const SORT_OPTIONS = [
  { key: 'relevance', label: 'Pertinence' },
  { key: 'date_desc', label: "Date (récent d'abord)" },
  { key: 'date_asc',  label: "Date (ancien d'abord)" },
  { key: 'az',        label: 'A → Z' },
]

/* ── Sub-components ─────────────────────────────────────────────── */
function ResultCard({ item, onNavigateDeal }) {
  const Icon = TYPE_ICON[item.type] || File
  return (
    <div className="sr-card" onClick={item.type === 'deal' && item.dealId ? () => onNavigateDeal?.(item.dealId) : undefined} style={item.type === 'deal' && item.dealId ? { cursor: 'pointer' } : undefined}>
      <div className="sr-card__icon-wrap">
        <Icon size={18} strokeWidth={1.5} className="sr-card__icon" />
      </div>
      <div className="sr-card__body">
        <div className="sr-card__top">
          <span className={`sr-card__type-badge sr-card__type-badge--${item.type}`}>
            {TYPE_LABEL[item.type]}
          </span>
          {item.tags.map(t => (
            <span key={t} className="sr-card__tag">{t}</span>
          ))}
        </div>
        <h3 className="sr-card__title">{item.title}</h3>
        <p className="sr-card__meta">{item.meta.join(' · ')}</p>
        {item.clients.length > 0 && (
          <div className="sr-card__clients">
            {item.clients.map((c, i) => (
              <span key={c}>
                {i > 0 && <span className="sr-card__clients-sep"> / </span>}
                <a className="sr-card__client-link" href="#">{c}</a>
              </span>
            ))}
          </div>
        )}
      </div>
      <a href="#" className="sr-card__link" aria-label={`Ouvrir ${item.title}`}>
        <ExternalLink size={15} strokeWidth={1.5} />
      </a>
    </div>
  )
}

function AdvancedFilterPanel({ open, onClose }) {
  const [statusOpen, setStatusOpen]   = useState(true)
  const [amountOpen, setAmountOpen]   = useState(true)
  const [clientOpen, setClientOpen]   = useState(false)
  const [dateOpen,   setDateOpen]     = useState(false)
  const [tagOpen,    setTagOpen]      = useState(false)

  const [statuses, setStatuses] = useState({ signed: false, ongoing: false, closed: false })
  const [clients,  setClients]  = useState({ atlas: false, gaia: false, helios: false })
  const [tags,     setTags]     = useState({ infra: false, energy: false, senior: false })
  const [minAmt,   setMinAmt]   = useState('')
  const [maxAmt,   setMaxAmt]   = useState('')

  function toggle(setter, key) {
    setter(prev => ({ ...prev, [key]: !prev[key] }))
  }

  function Section({ label, open: o, onToggle, children }) {
    return (
      <div className="afp__section">
        <button className="afp__section-hd" onClick={onToggle}>
          <span>{label}</span>
          {o ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {o && <div className="afp__section-body">{children}</div>}
      </div>
    )
  }

  function Checkbox({ label, checked, onChange }) {
    return (
      <label className="afp__checkbox">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="afp__checkbox-mark" />
        <span className="afp__checkbox-label">{label}</span>
      </label>
    )
  }

  const activeCount = [
    ...Object.values(statuses),
    ...Object.values(clients),
    ...Object.values(tags),
    minAmt !== '',
    maxAmt !== '',
  ].filter(Boolean).length

  return (
    <div className={`afp${open ? ' afp--open' : ''}`}>
      {/* Overlay */}
      {open && <div className="afp__overlay" onClick={onClose} />}

      <div className="afp__panel">
        {/* Header */}
        <div className="afp__header">
          <div className="afp__header-left">
            <Filter size={16} strokeWidth={1.5} />
            <span>Filtres avancés</span>
            {activeCount > 0 && <span className="afp__badge">{activeCount}</span>}
          </div>
          <button className="afp__close" onClick={onClose} aria-label="Fermer">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Sections */}
        <div className="afp__sections">

          <Section label="Statut" open={statusOpen} onToggle={() => setStatusOpen(v => !v)}>
            <Checkbox label="Signé"    checked={statuses.signed}  onChange={() => toggle(setStatuses, 'signed')} />
            <Checkbox label="En cours" checked={statuses.ongoing} onChange={() => toggle(setStatuses, 'ongoing')} />
            <Checkbox label="Clôturé"  checked={statuses.closed}  onChange={() => toggle(setStatuses, 'closed')} />
          </Section>

          <Section label="Montant (M EUR)" open={amountOpen} onToggle={() => setAmountOpen(v => !v)}>
            <div className="afp__range">
              <input
                className="afp__input"
                type="number"
                placeholder="Min"
                value={minAmt}
                onChange={e => setMinAmt(e.target.value)}
              />
              <span className="afp__range-sep">–</span>
              <input
                className="afp__input"
                type="number"
                placeholder="Max"
                value={maxAmt}
                onChange={e => setMaxAmt(e.target.value)}
              />
            </div>
          </Section>

          <Section label="Client" open={clientOpen} onToggle={() => setClientOpen(v => !v)}>
            <Checkbox label="Atlas Energy"           checked={clients.atlas}  onChange={() => toggle(setClients, 'atlas')} />
            <Checkbox label="Gaia Infrastructure"   checked={clients.gaia}   onChange={() => toggle(setClients, 'gaia')} />
            <Checkbox label="Helios Aviation Partners" checked={clients.helios} onChange={() => toggle(setClients, 'helios')} />
          </Section>

          <Section label="Secteur / Tag" open={tagOpen} onToggle={() => setTagOpen(v => !v)}>
            <Checkbox label="Infrastructure"        checked={tags.infra}   onChange={() => toggle(setTags, 'infra')} />
            <Checkbox label="Énergie"               checked={tags.energy}  onChange={() => toggle(setTags, 'energy')} />
            <Checkbox label="Senior"                checked={tags.senior}  onChange={() => toggle(setTags, 'senior')} />
          </Section>

          <Section label="Date" open={dateOpen} onToggle={() => setDateOpen(v => !v)}>
            <div className="afp__date-row">
              <label className="afp__date-label">Du</label>
              <input className="afp__input afp__input--date" type="date" />
            </div>
            <div className="afp__date-row">
              <label className="afp__date-label">Au</label>
              <input className="afp__input afp__input--date" type="date" />
            </div>
          </Section>

        </div>

        {/* Footer */}
        <div className="afp__footer">
          <button
            className="afp__btn-reset"
            onClick={() => {
              setStatuses({ signed: false, ongoing: false, closed: false })
              setClients({ atlas: false, gaia: false, helios: false })
              setTags({ infra: false, energy: false, senior: false })
              setMinAmt(''); setMaxAmt('')
            }}
          >
            Réinitialiser
          </button>
          <button className="afp__btn-apply" onClick={onClose}>
            Appliquer
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Main page ──────────────────────────────────────────────────── */
export default function SearchResultsPage({ style, query = '', onNavigateDeal }) {
  const [activeType,  setActiveType]  = useState('all')
  const [sortKey,     setSortKey]     = useState('relevance')
  const [sortOpen,    setSortOpen]    = useState(false)
  const [filterOpen,  setFilterOpen]  = useState(false)

  /* Filter results */
  const filtered = RESULTS.filter(r => {
    const matchType  = activeType === 'all' || r.type === activeType
    const matchQuery = !query || [r.title, ...r.meta, ...r.tags, ...r.clients]
      .some(s => s.toLowerCase().includes(query.toLowerCase()))
    return matchType && matchQuery
  })

  /* Count per type */
  function countFor(key) {
    if (key === 'all') return RESULTS.length
    return RESULTS.filter(r => r.type === key).length
  }

  const sortLabel = SORT_OPTIONS.find(o => o.key === sortKey)?.label ?? 'Pertinence'

  return (
    <main className="sr-page" style={style}>

      {/* ── Quick type filters – full width ── */}
      <div className="sr-type-filters-bar">
        <div className="sr-type-filters">
          {TYPE_FILTERS.map(({ key, label, icon: Icon }) => {
            const count = countFor(key)
            return (
              <button
                key={key}
                className={`sr-type-btn${activeType === key ? ' sr-type-btn--active' : ''}`}
                onClick={() => setActiveType(key)}
              >
                <Icon size={14} strokeWidth={1.5} />
                <span>{label}</span>
                <span className="sr-type-btn__count">{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Body (results) ── */}
      <div className="sr-body">

        {/* ── Results header ── */}
        <div className="sr-results-header">
          <p className="sr-results-count">
            <strong>{filtered.length}</strong> résultat{filtered.length !== 1 ? 's' : ''}
            {query && <> pour <em>"{query}"</em></>}
          </p>

          <div className="sr-results-actions">
            {/* Sort */}
            <div className="sr-sort">
              <button
                className="sr-sort__btn"
                onClick={() => setSortOpen(v => !v)}
                aria-expanded={sortOpen}
              >
                <ArrowUpDown size={14} strokeWidth={1.5} />
                <span>{sortLabel}</span>
                <ChevronDown size={13} strokeWidth={2} className={sortOpen ? 'rotated' : ''} />
              </button>
              {sortOpen && (
                <div className="sr-sort__dropdown">
                  {SORT_OPTIONS.map(o => (
                    <button
                      key={o.key}
                      className={`sr-sort__option${sortKey === o.key ? ' sr-sort__option--active' : ''}`}
                      onClick={() => { setSortKey(o.key); setSortOpen(false) }}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Advanced filter toggle */}
            <button
              className={`sr-filter-btn${filterOpen ? ' sr-filter-btn--active' : ''}`}
              onClick={() => setFilterOpen(v => !v)}
              aria-expanded={filterOpen}
            >
              <SlidersHorizontal size={14} strokeWidth={1.5} />
              <span>Filtres avancés</span>
            </button>
          </div>
        </div>

        {/* ── Results list ── */}
        <div className="sr-results">
          {filtered.length === 0 ? (
            <div className="sr-empty">
              <Search size={36} strokeWidth={1} className="sr-empty__icon" />
              <p className="sr-empty__title">Aucun résultat</p>
              <p className="sr-empty__sub">Essayez de modifier votre recherche ou vos filtres.</p>
            </div>
          ) : (
            filtered.map(item => <ResultCard key={item.id} item={item} onNavigateDeal={onNavigateDeal} />)
          )}
        </div>
      </div>

      {/* ── Advanced filter right panel ── */}
      <AdvancedFilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} />
    </main>
  )
}
