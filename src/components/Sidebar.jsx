import { PanelLeftClose, PanelLeftOpen, Home, Wallet, Bell, LayoutGrid, ShieldAlert } from 'lucide-react'
import './Sidebar.css'

const NAV_ITEMS = [
  { id: 'home',         label: 'Home',          icon: Home },
  { id: 'portfolio',    label: 'My portfolio',  icon: Wallet },
  { id: 'controls',     label: 'Controls',      icon: ShieldAlert },
  { id: 'notifs',       label: 'Notifications', icon: Bell },
  { id: 'applications', label: 'My apps',       icon: LayoutGrid },
]

export default function Sidebar({ activePage, onNavigate, collapsed, onCollapse, unreadCount = 0 }) {
  return (
    <aside className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`}>
      <button
        className="sidebar__toggle"
        onClick={onCollapse}
        aria-label={collapsed ? 'Open menu' : 'Close menu'}
      >
        {collapsed
          ? <PanelLeftOpen  size={20} strokeWidth={1.5} />
          : <PanelLeftClose size={20} strokeWidth={1.5} />
        }
      </button>

      <div className="sidebar__divider" />

      <nav className="sidebar__nav">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`sidebar__item${activePage === id ? ' sidebar__item--active' : ''}`}
            onClick={() => onNavigate(id)}
            aria-current={activePage === id ? 'page' : undefined}
            title={collapsed ? label : undefined}
          >
            <span className="sidebar__item-icon-wrap">
              <Icon size={24} strokeWidth={1.5} className="sidebar__item-icon" />
              {id === 'notifs' && unreadCount > 0 && (
                <span className="sidebar__badge">{unreadCount}</span>
              )}
            </span>
            {!collapsed && <span className="sidebar__item-label">{label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  )
}
