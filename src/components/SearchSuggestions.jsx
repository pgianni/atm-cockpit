import { ArrowRight, Search } from 'lucide-react'
import { TYPE_ICON, TYPE_LABEL } from '../data/searchData'
import './SearchSuggestions.css'

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
    <div className="search-suggestions">
      {results.length === 0 ? (
        <div className="search-suggestions__empty">
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
                className="search-suggestions__item"
                onMouseDown={e => { e.preventDefault(); onSelect(item) }}
              >
                <span
                  className="search-suggestions__icon"
                  style={{ background: colors.bg, color: colors.color }}
                >
                  <Icon size={16} strokeWidth={1.5} />
                </span>
                <span className="search-suggestions__body">
                  <span className="search-suggestions__title">{item.title}</span>
                  <span className="search-suggestions__meta">
                    <span
                      className="search-suggestions__badge"
                      style={{ background: colors.bg, color: colors.color }}
                    >
                      {TYPE_LABEL[item.type]}
                    </span>
                    {item.meta[0]}
                  </span>
                </span>
                <ArrowRight size={14} strokeWidth={1.5} className="search-suggestions__arrow" />
              </button>
            )
          })}
          <button className="search-suggestions__see-all" onMouseDown={e => { e.preventDefault(); onSeeAll(query) }}>
            <Search size={14} strokeWidth={1.5} />
            Voir tous les résultats pour <strong>"{query}"</strong>
          </button>
        </>
      )}
    </div>
  )
}
