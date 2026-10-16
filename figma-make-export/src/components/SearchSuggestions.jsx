import { ArrowRight, Search } from 'lucide-react'
import { TYPE_ICON, TYPE_LABEL } from '../data/searchData'

/* Per-type accents stay inline: they are data-driven, not theme tokens. */
const TYPE_COLOR = {
  deal:     { bg: '#e8f5f1', color: '#006644' },
  contrat:  { bg: '#e8f0fb', color: '#1a56db' },
  tranche:  { bg: '#fdf0e8', color: '#b45309' },
  asset:    { bg: '#f0ebfb', color: '#7c3aed' },
  covenant: { bg: '#fef3c7', color: '#92400e' },
  surete:   { bg: '#fde8e8', color: '#9b1c1c' },
  document: { bg: '#f3f4f6', color: '#374151' },
}

export default function SearchSuggestions({ query, results, onSelect, onSeeAll }) {
  if (!query || query.length < 2) return null

  return (
    <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-[300] animate-suggestions-in overflow-hidden rounded-lg border border-line bg-surface shadow-[0_8px_24px_rgba(19,21,23,0.14)]">
      {results.length === 0 ? (
        <div className="flex items-center gap-2 px-4 py-3 text-sm text-minor">
          <Search size={16} strokeWidth={1.5} />
          <span>Aucun résultat pour <strong>"{query}"</strong></span>
        </div>
      ) : (
        <>
          {results.slice(0, 6).map(item => {
            const Icon = TYPE_ICON[item.type] || Search
            const colors = TYPE_COLOR[item.type] || TYPE_COLOR.document
            return (
              <button
                key={item.id}
                className="group flex w-full cursor-pointer items-center gap-3 px-3 py-2 text-left transition-colors duration-100 hover:bg-page"
                onMouseDown={e => { e.preventDefault(); onSelect(item) }}
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded"
                  style={{ background: colors.bg, color: colors.color }}
                >
                  <Icon size={16} strokeWidth={1.5} />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-major">{item.title}</span>
                  <span className="flex items-center gap-1.5 text-xs text-minor">
                    <span
                      className="inline-flex h-4 shrink-0 items-center rounded-[3px] px-[5px] text-[10px] font-semibold uppercase tracking-[.03em]"
                      style={{ background: colors.bg, color: colors.color }}
                    >
                      {TYPE_LABEL[item.type]}
                    </span>
                    {item.meta[0]}
                  </span>
                </span>
                <ArrowRight
                  size={14}
                  strokeWidth={1.5}
                  className="shrink-0 text-minor opacity-0 transition-[opacity,transform] duration-100 group-hover:translate-x-0.5 group-hover:opacity-100"
                />
              </button>
            )
          })}
          <button
            className="flex w-full cursor-pointer items-center gap-1.5 border-t border-line px-3 py-2 text-left text-sm font-semibold text-primary transition-colors duration-100 hover:bg-primary-subtle"
            onMouseDown={e => { e.preventDefault(); onSeeAll(query) }}
          >
            <Search size={14} strokeWidth={1.5} />
            Voir tous les résultats pour <strong>"{query}"</strong>
          </button>
        </>
      )}
    </div>
  )
}
