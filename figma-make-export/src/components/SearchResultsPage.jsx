import { useState } from 'react'
import {
  Search, SlidersHorizontal, ArrowUpDown,
  FileText, Handshake, Layers, Building2, ShieldCheck, Lock, File,
  ChevronDown, ChevronUp, ExternalLink, Filter, X
} from 'lucide-react'
import { RESULTS, TYPE_ICON, TYPE_LABEL } from '../data/searchData'

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

/* Per-type badge colours — a data scale, not theme tokens. */
const TYPE_BADGE = {
  deal:     'bg-[#e8f5f1] text-[#006644]',
  contrat:  'bg-[#e8f0fb] text-[#1a56db]',
  tranche:  'bg-[#fdf0e8] text-[#b45309]',
  asset:    'bg-[#f0ebfb] text-[#7c3aed]',
  covenant: 'bg-[#fef3c7] text-[#92400e]',
  surete:   'bg-[#fde8e8] text-[#9b1c1c]',
  document: 'bg-[#f3f4f6] text-[#374151]',
}

const AFP_INPUT = 'h-[34px] flex-1 rounded border-[1.5px] border-line bg-surface px-2 text-sm text-major outline-none transition-colors duration-150 focus:border-primary'
const PILL_BTN  = 'flex h-[34px] cursor-pointer items-center gap-1.5 rounded border-[1.5px] border-line bg-surface px-3 text-sm font-semibold transition-[border-color,background-color,color] duration-150'

/* ── Sub-components ─────────────────────────────────────────────── */
function ResultCard({ item, onNavigateDeal }) {
  const Icon = TYPE_ICON[item.type] || File
  const clickable = item.type === 'deal' && item.dealId
  return (
    <div
      className={[
        'flex items-start gap-3 rounded-lg border border-line bg-surface px-4 py-3 transition-[border-color,box-shadow] duration-150',
        'hover:border-primary hover:shadow-[0_2px_12px_rgba(0,125,87,.10)]',
        clickable ? 'cursor-pointer' : '',
      ].join(' ')}
      onClick={clickable ? () => onNavigateDeal?.(item.dealId) : undefined}
    >
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded bg-primary-subtle">
        <Icon size={18} strokeWidth={1.5} className="text-primary" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`inline-flex h-5 items-center rounded px-1.5 text-[11px] font-semibold uppercase tracking-[.04em] ${TYPE_BADGE[item.type] ?? TYPE_BADGE.document}`}
          >
            {TYPE_LABEL[item.type]}
          </span>
          {item.tags.map(t => (
            <span key={t} className="inline-flex h-5 items-center rounded border border-line px-1.5 text-[11px] text-minor">{t}</span>
          ))}
        </div>
        <h3 className="overflow-hidden text-ellipsis whitespace-nowrap text-base font-semibold text-major">{item.title}</h3>
        <p className="text-sm text-minor">{item.meta.join(' · ')}</p>
        {item.clients.length > 0 && (
          <div className="text-sm text-minor">
            {item.clients.map((c, i) => (
              <span key={c}>
                {i > 0 && <span className="mx-1"> / </span>}
                <a className="font-semibold text-primary transition-opacity duration-100 hover:opacity-75" href="#">{c}</a>
              </span>
            ))}
          </div>
        )}
      </div>
      <a
        href="#"
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded text-minor transition-[color,background-color] duration-150 hover:bg-primary-subtle hover:text-primary"
        aria-label={`Ouvrir ${item.title}`}
      >
        <ExternalLink size={15} strokeWidth={1.5} />
      </a>
    </div>
  )
}

/* Hoisted out of AdvancedFilterPanel: defining them inside the parent's body
   remounted the subtree on every render, so the amount inputs lost focus
   after each keystroke. */
function Section({ label, open, onToggle, children }) {
  return (
    <div className="border-b border-line">
      <button
        className="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left text-sm font-semibold text-major transition-colors duration-100 hover:bg-page"
        onClick={onToggle}
      >
        <span>{label}</span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && <div className="flex flex-col gap-2 px-4 pb-3">{children}</div>}
    </div>
  )
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer select-none items-center gap-2">
      <input type="checkbox" className="peer absolute h-0 w-0 opacity-0" checked={checked} onChange={onChange} />
      <span
        className={[
          'flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border-[1.5px] border-line bg-surface transition-[border-color,background-color] duration-100',
          'peer-checked:border-primary peer-checked:bg-primary',
          // the tick itself
          "peer-checked:after:block peer-checked:after:h-2 peer-checked:after:w-[5px] peer-checked:after:rotate-45 peer-checked:after:border-2 peer-checked:after:border-l-0 peer-checked:after:border-t-0 peer-checked:after:border-white peer-checked:after:content-['']",
          'peer-checked:after:-translate-x-px peer-checked:after:-translate-y-px',
        ].join(' ')}
      />
      <span className="text-sm text-major">{label}</span>
    </label>
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

  const activeCount = [
    ...Object.values(statuses),
    ...Object.values(clients),
    ...Object.values(tags),
    minAmt !== '',
    maxAmt !== '',
  ].filter(Boolean).length

  return (
    <div>
      {/* Overlay */}
      {open && <div className="fixed inset-0 z-[299] animate-fade-in bg-black/25" onClick={onClose} />}

      <div
        className={[
          'fixed bottom-0 right-0 top-0 z-[300] flex w-[320px] flex-col border-l border-line bg-surface shadow-[-4px_0_24px_rgba(19,21,23,.12)]',
          'transition-transform duration-[220ms] ease-[cubic-bezier(.4,0,.2,1)]',
          open ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-line p-4">
          <div className="flex items-center gap-2 text-base font-bold text-major">
            <Filter size={16} strokeWidth={1.5} />
            <span>Filtres avancés</span>
            {activeCount > 0 && (
              <span className="min-w-[20px] rounded-full bg-primary px-1.5 text-center text-[11px] font-bold leading-[18px] text-white">
                {activeCount}
              </span>
            )}
          </div>
          <button
            className="flex h-8 w-8 items-center justify-center rounded text-minor transition-[color,background-color] duration-150 hover:bg-page hover:text-major"
            onClick={onClose}
            aria-label="Fermer"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Sections */}
        <div className="flex-1 overflow-y-auto py-2">

          <Section label="Statut" open={statusOpen} onToggle={() => setStatusOpen(v => !v)}>
            <Checkbox label="Signé"    checked={statuses.signed}  onChange={() => toggle(setStatuses, 'signed')} />
            <Checkbox label="En cours" checked={statuses.ongoing} onChange={() => toggle(setStatuses, 'ongoing')} />
            <Checkbox label="Clôturé"  checked={statuses.closed}  onChange={() => toggle(setStatuses, 'closed')} />
          </Section>

          <Section label="Montant (M EUR)" open={amountOpen} onToggle={() => setAmountOpen(v => !v)}>
            <div className="flex items-center gap-2">
              <input
                className={AFP_INPUT}
                type="number"
                placeholder="Min"
                value={minAmt}
                onChange={e => setMinAmt(e.target.value)}
              />
              <span className="text-sm text-minor">–</span>
              <input
                className={AFP_INPUT}
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
            <div className="flex items-center gap-2">
              <label className="w-5 shrink-0 text-sm text-minor">Du</label>
              <input className={`${AFP_INPUT} w-full`} type="date" />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-5 shrink-0 text-sm text-minor">Au</label>
              <input className={`${AFP_INPUT} w-full`} type="date" />
            </div>
          </Section>

        </div>

        {/* Footer */}
        <div className="flex shrink-0 gap-2 border-t border-line p-4">
          <button
            className="h-9 flex-1 cursor-pointer rounded border-[1.5px] border-line bg-surface text-sm font-semibold text-major transition-[border-color,background-color] duration-150 hover:border-major hover:bg-page"
            onClick={() => {
              setStatuses({ signed: false, ongoing: false, closed: false })
              setClients({ atlas: false, gaia: false, helios: false })
              setTags({ infra: false, energy: false, senior: false })
              setMinAmt(''); setMaxAmt('')
            }}
          >
            Réinitialiser
          </button>
          <button
            className="h-9 flex-1 cursor-pointer rounded bg-primary text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-hover"
            onClick={onClose}
          >
            Appliquer
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Main page ──────────────────────────────────────────────────── */
export default function SearchResultsPage({ offsetClass = '', query = '', onNavigateDeal }) {
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
    <main className={`min-h-screen bg-page pt-16 ${offsetClass}`}>

      {/* ── Quick type filters – full width ── */}
      <div className="border-b border-line bg-surface px-4 py-3 md:px-8">
        <div className="flex flex-wrap gap-2">
          {TYPE_FILTERS.map(({ key, label, icon: Icon }) => {
            const count = countFor(key)
            const active = activeType === key
            return (
              <button
                key={key}
                className={[
                  'flex h-[34px] cursor-pointer items-center gap-1.5 rounded-full border-[1.5px] px-3 text-sm font-semibold transition-[border-color,color,background-color,box-shadow] duration-150',
                  active
                    ? 'border-primary bg-primary text-white shadow-[0_2px_8px_rgba(0,125,87,.25)] hover:border-primary-hover hover:bg-primary-hover'
                    : 'border-line bg-surface text-minor hover:border-primary hover:bg-primary-subtle hover:text-primary',
                ].join(' ')}
                onClick={() => setActiveType(key)}
              >
                <Icon size={14} strokeWidth={1.5} />
                <span>{label}</span>
                <span
                  className={[
                    'min-w-[20px] rounded-full px-1.5 text-center text-[11px] leading-[18px]',
                    active ? 'bg-white/25' : 'bg-page text-minor',
                  ].join(' ')}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Body (results) ── */}
      <div className="mx-auto flex max-w-[960px] flex-col gap-4 px-4 pb-8 pt-6 md:px-8">

        {/* ── Results header ── */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-minor">
            <strong className="font-bold text-major">{filtered.length}</strong> résultat{filtered.length !== 1 ? 's' : ''}
            {query && <> pour <em className="not-italic text-major">"{query}"</em></>}
          </p>

          <div className="flex items-center gap-2">
            {/* Sort */}
            <div className="relative">
              <button
                className={`${PILL_BTN} text-major hover:border-primary`}
                onClick={() => setSortOpen(v => !v)}
                aria-expanded={sortOpen}
              >
                <ArrowUpDown size={14} strokeWidth={1.5} />
                <span>{sortLabel}</span>
                <ChevronDown size={13} strokeWidth={2} className={sortOpen ? 'rotate-180' : ''} />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-[calc(100%+6px)] z-[200] min-w-[220px] overflow-hidden rounded-lg border border-line bg-surface shadow-[0_8px_24px_rgba(19,21,23,.12)]">
                  {SORT_OPTIONS.map(o => (
                    <button
                      key={o.key}
                      className={[
                        'block w-full cursor-pointer px-4 py-2 text-left text-sm transition-colors duration-100',
                        sortKey === o.key
                          ? 'bg-primary-subtle font-semibold text-primary'
                          : 'text-major hover:bg-page',
                      ].join(' ')}
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
              className={[
                PILL_BTN,
                filterOpen
                  ? 'border-primary bg-primary-subtle text-primary'
                  : 'text-major hover:border-primary hover:text-primary',
              ].join(' ')}
              onClick={() => setFilterOpen(v => !v)}
              aria-expanded={filterOpen}
            >
              <SlidersHorizontal size={14} strokeWidth={1.5} />
              <span>Filtres avancés</span>
            </button>
          </div>
        </div>

        {/* ── Results list ── */}
        <div className="flex flex-col gap-2">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
              <Search size={36} strokeWidth={1} className="text-line" />
              <p className="text-lg font-bold text-major">Aucun résultat</p>
              <p className="text-sm text-minor">Essayez de modifier votre recherche ou vos filtres.</p>
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
