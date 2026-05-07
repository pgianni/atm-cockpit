import { useState, useMemo } from 'react'
import { Settings, ExternalLink, ChevronRight, Star } from 'lucide-react'
import './MyApplicationsPage.css'

/* ─── Logo SVG imports ────────────────────────────────────────────── */
import logoGlass from '../assets/logo-glass.svg?url'
import logoComon from '../assets/logo-comon.svg?url'
import logoAsset from '../assets/logo-asset.svg?url'
import logoMitigant from '../assets/logo-mitigant.svg?url'
import logoDocManagement from '../assets/logo-docmanagement.svg?url'
import logoReporting from '../assets/logo-reporting.svg?url'

/* ─── Logo icon mapping ───────────────────────────────────────────── */
const LOGO_ICONS = {
  glass: logoGlass,
  comon: logoComon,
  asset: logoAsset,
  mitigant: logoMitigant,
  docmanagement: logoDocManagement,
  reporting: logoReporting,
}

/* ─── Logo icon component ─────────────────────────────────────────── */
function LogoIcon({ iconId }) {
  const src = LOGO_ICONS[iconId]
  return (
    <img
      alt=""
      src={src}
      style={{
        display: 'block',
        width: 32,
        height: 32,
        flexShrink: 0,
        objectFit: 'contain',
      }}
    />
  )
}

/* ─── Letter icon (fallback for sections without Figma assets) ──────── */
function AppIcon({ letter, color = 'green' }) {
  return <div className={`app-icon app-icon--${color}`}>{letter}</div>
}

/* ─── Single app card ─────────────────────────────────────────────── */
function AppCard({ app, isFavorite, onToggleFavorite, compact = false }) {
  return (
    <div className={`app-card${compact ? ' app-card--compact' : ''}`}>
      <div className="app-card__header">
        {app.figmaIcon
          ? <LogoIcon iconId={app.figmaIcon} />
          : <AppIcon letter={app.letter} color={app.iconColor} />
        }
        <span className="app-card__name">{app.name}</span>
        <button
          className={`app-card__star${isFavorite ? ' app-card__star--active' : ''}`}
          onClick={() => onToggleFavorite(app.id)}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star size={16} strokeWidth={1.5} />
        </button>
      </div>
      {!compact && (
        <div className="app-card__body">
          <p className="app-card__desc">{app.description}</p>
          <a href="#" className="app-card__link" onClick={e => e.preventDefault()}>
            Open app <ExternalLink size={12} strokeWidth={1.5} />
          </a>
        </div>
      )}
    </div>
  )
}

/* ─── Section block ───────────────────────────────────────────────── */
function AppSection({ section, favorites, onToggleFavorite }) {
  return (
    <div className="apps-section">
      <div className="apps-section__header">
        <h2 className="apps-section__title">{section.title}</h2>
        {section.subtitle && (
          <p className="apps-section__subtitle">{section.subtitle}</p>
        )}
      </div>
      <div className="apps-section__grid">
        {section.apps.map(app => (
          <AppCard
            key={app.id}
            app={app}
            isFavorite={favorites.has(app.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  )
}

/* ─── Data ────────────────────────────────────────────────────────── */
import { SECTIONS, ALL_APPS, CHIPS, LS_KEY } from '../data/appsData'

/* ─── Page ────────────────────────────────────────────────────────── */
export default function MyApplicationsPage({ style }) {
  const [activeChip, setActiveChip]   = useState('All')
  const [favorites,  setFavorites]    = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem(LS_KEY)) ?? []) }
    catch { return new Set() }
  })

  const favoriteApps = useMemo(
    () => ALL_APPS.filter(a => favorites.has(a.id)),
    [favorites]
  )

  function toggleFavorite(id) {
    setFavorites(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      localStorage.setItem(LS_KEY, JSON.stringify([...next]))
      return next
    })
  }

  const visibleSections =
    activeChip === 'All'
      ? SECTIONS
      : SECTIONS.filter(s => s.chip === activeChip)

  return (
    <main className="apps-page" style={style}>

      {/* ── Breadcrumb banner ── */}
      <div className="apps-page__breadcrumb">
        <a href="#" className="apps-page__bc-link" onClick={e => e.preventDefault()}>
          Home
        </a>
        <ChevronRight size={14} strokeWidth={2} className="apps-page__bc-sep" />
        <span className="apps-page__bc-current">My apps</span>
      </div>

      <div className="apps-page__content">

        {/* ── Header ── */}
        <div className="apps-page__header">
          <h1 className="apps-page__title">My apps</h1>
          <button className="apps-page__edit-btn">
            <Settings size={18} strokeWidth={1.5} />
            Edit modules
          </button>
        </div>

        {/* ── My favorites ── */}
        {favoriteApps.length > 0 && (
          <div className="apps-section apps-section--favorites">
            <div className="apps-section__header">
              <h2 className="apps-section__title">
                <Star size={18} strokeWidth={1.75} className="apps-section__fav-icon" />
                My favorites
              </h2>
            </div>
            <div className="apps-section__grid">
              {favoriteApps.map(app => (
                <AppCard
                  key={app.id}
                  app={app}
                  isFavorite={true}
                  onToggleFavorite={toggleFavorite}
                  compact
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Filter chips ── */}
        <div className="apps-page__chips">
          {CHIPS.map(chip => (
            <button
              key={chip}
              className={`chip${activeChip === chip ? ' chip--active' : ''}`}
              onClick={() => setActiveChip(chip)}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* ── Sections ── */}
        <div className="apps-page__sections">
          {visibleSections.map(section => (
            <AppSection
              key={section.id}
              section={section}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>

      </div>
    </main>
  )
}
