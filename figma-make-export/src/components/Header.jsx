import { useState, useRef, useEffect } from 'react'
import { HelpCircle, Bell, Search, X, SlidersHorizontal, Settings, Moon, Power } from 'lucide-react'
import SearchSuggestions from './SearchSuggestions'
import { searchResults } from '../data/searchData'
import logoCockpit from '../assets/logo-cockpit.svg?url'

const AVATAR = 'flex shrink-0 items-center justify-center rounded-full bg-[#116f6a] font-bold tracking-[0.5px] text-white'

export default function Header({ onSearch, showSearch = false, searchQuery = '', onNotifClick, unreadCount = 0, darkMode = false, onToggleDark, onNavigateSettings, onLogout }) {
  const [value,       setValue]       = useState(searchQuery)
  const [focused,     setFocused]     = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const inputRef   = useRef(null)
  const profileRef = useRef(null)

  useEffect(() => {
    if (!profileOpen) return
    function handleClick(e) {
      if (!profileRef.current?.contains(e.target)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [profileOpen])

  /* Keep input in sync when searchQuery prop changes (e.g. from sidebar nav) */
  useEffect(() => { setValue(searchQuery) }, [searchQuery])

  const suggestions  = focused ? searchResults(value) : []
  const showDropdown = focused && value.length >= 2

  function handleSubmit(e) {
    e.preventDefault()
    if (value.trim() && onSearch) {
      onSearch(value.trim())
      setFocused(false)
      inputRef.current?.blur()
    }
  }

  function handleSelectItem(item) {
    setValue(item.title)
    onSearch?.(item.title)
    setFocused(false)
  }

  function handleSeeAll(q) {
    onSearch?.(q)
    setFocused(false)
  }

  function handleClear() {
    setValue('')
    inputRef.current?.focus()
  }

  const dropdownItem = 'flex w-full cursor-pointer items-center gap-[14px] px-5 py-2.5 text-left transition-colors duration-100 hover:bg-page'

  return (
    <header className="fixed inset-x-0 top-0 z-[202] flex h-16 items-center justify-between gap-2 border-b border-line bg-surface px-3 py-2 shadow-header md:gap-4 md:px-4">
      {/* Left – logo */}
      <div className="flex items-center">
        <div className="flex h-10 items-center gap-2">
          <img src={logoCockpit} alt="Cockpit logo" width="32" height="32" />
          <span className="hidden text-xl font-bold leading-[1.3] text-major md:block md:w-[120px]">Cockpit</span>
        </div>
      </div>

      {/* Center – search bar */}
      {showSearch && (
        <div className="flex min-w-0 flex-1 items-center justify-center">
          <form
            className="relative flex h-9 w-full items-center gap-2 rounded-full border-[1.5px] border-line bg-page px-3 transition-[border-color,background-color] duration-150 focus-within:border-primary focus-within:bg-surface md:max-w-[520px]"
            onSubmit={handleSubmit}
          >
            <Search size={15} strokeWidth={1.5} className="shrink-0 text-minor" />
            <input
              ref={inputRef}
              className="flex-1 border-none bg-transparent text-sm text-major outline-none placeholder:text-minor"
              type="text"
              value={value}
              onChange={e => setValue(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Rechercher deals, contrats, assets…"
              aria-label="Recherche globale"
            />
            {value && (
              <button
                type="button"
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-line text-minor transition-colors duration-150 hover:bg-minor hover:text-surface"
                onClick={handleClear}
                aria-label="Effacer la recherche"
              >
                <X size={14} strokeWidth={2} />
              </button>
            )}
            {showDropdown && (
              <SearchSuggestions
                query={value}
                results={suggestions}
                onSelect={handleSelectItem}
                onSeeAll={handleSeeAll}
              />
            )}
          </form>
        </div>
      )}

      {/* Right – actions + profile */}
      <div className="flex shrink-0 items-center gap-2">
        <div className="flex items-center gap-0.5">
          {/* Help is desktop-only */}
          <button className="hidden h-10 w-10 items-center justify-center rounded text-major transition-colors duration-150 hover:bg-page md:flex" aria-label="Help">
            <HelpCircle size={20} strokeWidth={1.5} />
          </button>
          <button
            className="relative flex h-10 w-10 items-center justify-center rounded text-major transition-colors duration-150 hover:bg-page"
            aria-label="Notifications"
            onClick={onNotifClick}
          >
            <Bell size={20} strokeWidth={1.5} />
            {unreadCount > 0 && (
              <span className="absolute left-[22px] top-[10px] flex h-4 min-w-[16px] items-center justify-center rounded-2xl bg-danger px-1.5 text-[10px] font-semibold leading-none text-reverse">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        <div className="relative" ref={profileRef}>
          <button
            className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors duration-150 hover:bg-page"
            onClick={() => setProfileOpen(o => !o)}
            aria-haspopup="true"
            aria-expanded={profileOpen}
          >
            {/* Name/role collapse to the avatar alone on mobile */}
            <div className="hidden flex-col items-end text-right text-major md:flex">
              <span className="text-base font-bold">Hancock Pitt</span>
              <span className="text-sm font-normal text-minor">Transaction manager</span>
            </div>
            <div className={`${AVATAR} h-9 w-9 text-[13px]`} aria-hidden="true">HP</div>
          </button>

          <div
            className={[
              'absolute left-0 right-0 top-[calc(100%+8px)] z-[300] w-[calc(100vw-32px)] max-w-[360px] origin-top-right overflow-hidden rounded-lg border border-line bg-surface p-0 shadow-[0_8px_24px_rgba(19,21,23,0.14),0_2px_6px_rgba(19,21,23,0.08)]',
              'md:left-auto md:w-auto md:min-w-[280px] md:max-w-none',
              'transition-[opacity,transform] duration-[180ms] ease-out',
              profileOpen
                ? 'visible translate-y-0 scale-100 opacity-100'
                : 'invisible pointer-events-none -translate-y-1.5 scale-[0.97] opacity-0',
            ].join(' ')}
          >
            {/* Profile header */}
            <div className="flex items-center gap-[14px] px-5 py-4">
              <div className={`${AVATAR} h-12 w-12 text-base`}>HP</div>
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="overflow-hidden text-ellipsis whitespace-nowrap text-base font-bold text-major">Hancock Pitt</span>
                <span className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-minor">h.pitt@emea.cib</span>
                <span className="text-xs font-semibold text-primary">HPITT10</span>
              </div>
            </div>
            <div className="my-1 h-px bg-line" />

            {/* Menu items */}
            <button className={`${dropdownItem} text-major`} onClick={() => { onNavigateSettings?.(); setProfileOpen(false) }}>
              <SlidersHorizontal size={18} strokeWidth={1.5} className="shrink-0 text-minor" />
              <div className="flex min-w-0 flex-1 flex-col gap-px">
                <span className="text-base font-semibold leading-[1.3]">Preferences</span>
                <span className="text-xs font-normal leading-[1.3] text-minor">Customize your experience</span>
              </div>
            </button>
            <button className={`${dropdownItem} text-major`} onClick={() => { onToggleDark?.(); setProfileOpen(false) }}>
              <Moon size={18} strokeWidth={1.5} className="shrink-0 text-minor" />
              <div className="flex min-w-0 flex-1 flex-col gap-px">
                <span className="text-base font-semibold leading-[1.3]">Dark mode</span>
                <span className="text-xs font-normal leading-[1.3] text-minor">Switch interface theme</span>
              </div>
              <span
                className={[
                  'ml-auto shrink-0 rounded-full px-2 py-px text-[11px] font-semibold',
                  darkMode ? 'bg-primary text-white' : 'bg-line text-minor',
                ].join(' ')}
              >
                {darkMode ? 'On' : 'Off'}
              </span>
            </button>
            <button className={`${dropdownItem} text-major`} onClick={() => setProfileOpen(false)}>
              <Settings size={18} strokeWidth={1.5} className="shrink-0 text-minor" />
              <div className="flex min-w-0 flex-1 flex-col gap-px">
                <span className="text-base font-semibold leading-[1.3]">Administration</span>
                <span className="text-xs font-normal leading-[1.3] text-minor">Manage profiles</span>
              </div>
            </button>
            <div className="my-1 h-px bg-line" />

            <button className={`${dropdownItem} text-danger`} onClick={() => { setProfileOpen(false); onLogout?.() }}>
              <Power size={18} strokeWidth={1.5} className="shrink-0 text-current" />
              <div className="flex min-w-0 flex-1 flex-col gap-px">
                <span className="text-base font-semibold leading-[1.3]">Logout</span>
                <span className="text-xs font-normal leading-[1.3] text-current opacity-70">Sign out of your account</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
