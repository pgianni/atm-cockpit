import { useState, useRef, useEffect } from 'react'
import { HelpCircle, Bell, Search, X, SlidersHorizontal, Settings, Moon, Power } from 'lucide-react'
import SearchSuggestions from './SearchSuggestions'
import { searchResults } from '../data/searchData'
import logoCockpit from '../assets/logo-cockpit.svg?url'
import './Header.css'

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

  return (
    <header className="header">
      {/* Left – logo */}
      <div className="header__left">
        <div className="header__logo">
          <img src={logoCockpit} alt="Cockpit logo" width="32" height="32" />
          <span className="header__logo-name">Cockpit</span>
        </div>
      </div>

      {/* Center – search bar */}
      {showSearch && (
        <div className="header__search-zone">
          <form className="header__search" onSubmit={handleSubmit}>
            <Search size={15} strokeWidth={1.5} className="header__search-icon" />
            <input
              ref={inputRef}
              className="header__search-input"
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
                className="header__search-clear"
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
      <div className="header__right">
        <div className="header__actions">
          <button className="header__icon-btn" aria-label="Help">
            <HelpCircle size={20} strokeWidth={1.5} />
          </button>
          <button className="header__icon-btn header__icon-btn--relative" aria-label="Notifications" onClick={onNotifClick}>
            <Bell size={20} strokeWidth={1.5} />
            {unreadCount > 0 && <span className="header__badge">{unreadCount}</span>}
          </button>
        </div>

        <div className="header__profile-wrap" ref={profileRef}>
          <button
            className="header__profile-btn"
            onClick={() => setProfileOpen(o => !o)}
            aria-haspopup="true"
            aria-expanded={profileOpen}
          >
            <div className="header__profile-text">
              <span className="header__profile-name">Hancock Pitt</span>
              <span className="header__profile-role">Transaction manager</span>
            </div>
            <div className="header__avatar" aria-hidden="true">HP</div>
          </button>
          <div className={`header__profile-dropdown${profileOpen ? ' header__profile-dropdown--open' : ''}`}>
            {/* Profile header */}
            <div className="header__dropdown-profile">
              <div className="header__dropdown-avatar">HP</div>
              <div className="header__dropdown-profile-text">
                <span className="header__dropdown-profile-name">Hancock Pitt</span>
                <span className="header__dropdown-profile-email">h.pitt@emea.cib</span>
                <span className="header__dropdown-profile-id">HPITT10</span>
              </div>
            </div>
            <div className="header__dropdown-divider" />

            {/* Menu items */}
            <button className="header__dropdown-item" onClick={() => { onNavigateSettings?.(); setProfileOpen(false) }}>
              <SlidersHorizontal size={18} strokeWidth={1.5} className="header__dropdown-item-icon" />
              <div className="header__dropdown-item-text">
                <span className="header__dropdown-item-label">Preferences</span>
                <span className="header__dropdown-item-sub">Customize your experience</span>
              </div>
            </button>
            <button className="header__dropdown-item" onClick={() => { onToggleDark?.(); setProfileOpen(false) }}>
              <Moon size={18} strokeWidth={1.5} className="header__dropdown-item-icon" />
              <div className="header__dropdown-item-text">
                <span className="header__dropdown-item-label">Dark mode</span>
                <span className="header__dropdown-item-sub">Switch interface theme</span>
              </div>
              <span className={`header__dark-badge${darkMode ? ' header__dark-badge--on' : ''}`}>
                {darkMode ? 'On' : 'Off'}
              </span>
            </button>
            <button className="header__dropdown-item" onClick={() => setProfileOpen(false)}>
              <Settings size={18} strokeWidth={1.5} className="header__dropdown-item-icon" />
              <div className="header__dropdown-item-text">
                <span className="header__dropdown-item-label">Administration</span>
                <span className="header__dropdown-item-sub">Manage profiles</span>
              </div>
            </button>
            <div className="header__dropdown-divider" />

            <button className="header__dropdown-item header__dropdown-item--danger" onClick={() => { setProfileOpen(false); onLogout?.() }}>
              <Power size={18} strokeWidth={1.5} className="header__dropdown-item-icon" />
              <div className="header__dropdown-item-text">
                <span className="header__dropdown-item-label">Logout</span>
                <span className="header__dropdown-item-sub">Sign out of your account</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
