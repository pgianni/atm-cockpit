import { useState, useMemo } from 'react'
import { Settings, ExternalLink, ChevronRight, Star } from 'lucide-react'
import { chip as chipClass, ghostButton, breadcrumbBanner, breadcrumbLink, breadcrumbCurrent, APP_ICON_COLOR, appIconBase } from '../ui'

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
  return <img alt="" src={LOGO_ICONS[iconId]} className="block h-8 w-8 shrink-0 object-contain" />
}

/* ─── Letter icon (fallback for sections without Figma assets) ──────── */
function AppIcon({ letter, color = 'green' }) {
  return (
    <div className={`${appIconBase} ${APP_ICON_COLOR[color] ?? APP_ICON_COLOR.green}`}>
      {letter}
    </div>
  )
}

/* ─── Single app card ─────────────────────────────────────────────── */
function AppCard({ app, isFavorite, onToggleFavorite, compact = false }) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-4 transition-[box-shadow,border-color] duration-150 hover:border-[#b5bec3] hover:shadow-[0_2px_10px_rgba(19,21,23,0.08)]">
      <div className="flex items-center gap-2">
        {app.figmaIcon
          ? <LogoIcon iconId={app.figmaIcon} />
          : <AppIcon letter={app.letter} color={app.iconColor} />
        }
        <span className="min-w-0 flex-1 shrink-0 overflow-hidden text-ellipsis whitespace-nowrap text-lg font-bold text-major">{app.name}</span>
        <button
          className={[
            'ml-auto flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded transition-[color,background-color] duration-150',
            'hover:bg-[#f5a623]/[0.08] hover:text-[#f5a623]',
            isFavorite ? 'text-[#f5a623] [&_svg]:fill-[#f5a623]' : 'text-[#c4cdd2]',
          ].join(' ')}
          onClick={() => onToggleFavorite(app.id)}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star size={16} strokeWidth={1.5} />
        </button>
      </div>
      {!compact && (
        <div className="flex flex-col gap-1">
          <p className="line-clamp-3 overflow-hidden text-sm font-normal text-minor">{app.description}</p>
          <a
            href="#"
            className="inline-flex cursor-pointer items-center gap-1 self-start text-sm font-semibold text-primary underline underline-offset-2 transition-colors duration-150 hover:text-primary-hover"
            onClick={e => e.preventDefault()}
          >
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
    <div className="flex flex-col gap-4 rounded-lg bg-surface p-4 md:gap-8 md:p-6">
      <div className="flex flex-col gap-0.5">
        <h2 className="flex items-center gap-2 text-xl font-bold text-major">{section.title}</h2>
        {section.subtitle && (
          <p className="text-sm font-normal text-minor">{section.subtitle}</p>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
export default function MyApplicationsPage({ offsetClass = '', onNavigateHome }) {
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
    <main className={`relative mt-16 min-h-[calc(100vh-64px)] bg-page transition-[margin-left] duration-200 ease-out ${offsetClass}`}>

      {/* ── Breadcrumb banner ── */}
      <div className={breadcrumbBanner}>
        <button className={breadcrumbLink} onClick={() => onNavigateHome?.()}>Home</button>
        <ChevronRight size={14} strokeWidth={2} className="shrink-0 text-white/70" />
        <span className={breadcrumbCurrent}>My apps</span>
      </div>

      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 p-4 md:gap-8 md:p-8">

        {/* ── Header ── */}
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-major">My apps</h1>
          <button className={ghostButton}>
            <Settings size={18} strokeWidth={1.5} />
            Edit modules
          </button>
        </div>

        {/* ── My favorites ── */}
        {favoriteApps.length > 0 && (
          <div className="flex flex-col gap-4 rounded-lg border-none bg-surface p-4 md:gap-8 md:p-6">
            <div className="flex flex-col gap-0.5">
              <h2 className="flex items-center gap-2 text-xl font-bold text-major">
                <Star size={18} strokeWidth={1.75} className="shrink-0 fill-[#f5a623] text-[#f5a623]" />
                My favorites
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
        <div className="flex flex-wrap items-center gap-2">
          {CHIPS.map(c => (
            <button
              key={c}
              className={chipClass(activeChip === c)}
              onClick={() => setActiveChip(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* ── Sections ── */}
        <div className="flex flex-col gap-6 md:gap-8">
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
