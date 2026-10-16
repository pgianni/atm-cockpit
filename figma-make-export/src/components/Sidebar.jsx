import { PanelLeftClose, PanelLeftOpen, Home, Wallet, Bell, LayoutGrid, ShieldAlert } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'home',         label: 'Home',          icon: Home },
  { id: 'portfolio',    label: 'My portfolio',  icon: Wallet },
  { id: 'controls',     label: 'Controls',      icon: ShieldAlert },
  { id: 'notifs',       label: 'Notifications', icon: Bell },
  { id: 'applications', label: 'My apps',       icon: LayoutGrid },
]

/* Mobile (< md): bottom navigation bar.
   Desktop (md+):  fixed left sidebar, collapsible to 64px. */
export default function Sidebar({ activePage, onNavigate, collapsed, onCollapse, unreadCount = 0 }) {
  return (
    <aside
      className={[
        'fixed inset-x-0 bottom-0 z-[200] flex h-[60px] w-full flex-row items-stretch gap-0 overflow-visible border-t border-line bg-surface p-0',
        'md:inset-x-auto md:bottom-0 md:left-0 md:top-16 md:z-[90] md:h-auto md:flex-col md:items-stretch md:gap-4 md:overflow-hidden md:border-r md:border-t-0 md:p-3 md:transition-[width] md:duration-200 md:ease-out',
        collapsed ? 'md:w-16' : 'md:w-[226px]',
      ].join(' ')}
    >
      <button
        className="hidden shrink-0 self-start rounded text-major transition-colors duration-150 hover:bg-page md:flex md:h-10 md:w-10 md:items-center md:justify-center"
        onClick={onCollapse}
        aria-label={collapsed ? 'Open menu' : 'Close menu'}
      >
        {collapsed
          ? <PanelLeftOpen  size={20} strokeWidth={1.5} />
          : <PanelLeftClose size={20} strokeWidth={1.5} />
        }
      </button>

      <div className="hidden shrink-0 bg-line md:block md:h-px" />

      <nav className="flex w-full flex-row items-stretch gap-0 md:w-auto md:flex-col md:gap-0.5">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = activePage === id
          return (
            <button
              key={id}
              className={[
                'flex flex-1 flex-col items-center justify-center gap-[3px] whitespace-normal rounded-none px-1 pb-1 pt-1.5 text-major transition-[background-color,color,transform] duration-150 active:scale-[0.98]',
                'md:h-12 md:w-full md:flex-none md:flex-row md:justify-start md:gap-3 md:whitespace-nowrap md:rounded md:px-3 md:py-0 md:text-left',
                'hover:bg-primary-subtle',
                active ? 'bg-primary-subtle font-bold text-primary' : '',
              ].join(' ')}
              onClick={() => onNavigate(id)}
              aria-current={active ? 'page' : undefined}
              title={collapsed ? label : undefined}
            >
              <span className="relative flex shrink-0">
                <Icon size={24} strokeWidth={1.5} className="shrink-0" />
                {id === 'notifs' && unreadCount > 0 && (
                  <span className="pointer-events-none absolute -right-[5px] -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-2xl bg-danger px-1.5 text-[10px] font-semibold leading-none text-reverse md:-right-1.5 md:-top-1">
                    {unreadCount}
                  </span>
                )}
              </span>
              {/* Label is hidden on desktop only while the sidebar is collapsed */}
              <span
                className={[
                  'block text-center text-[10px] font-semibold leading-[1.2]',
                  'md:text-left md:text-sm md:font-normal',
                  collapsed ? 'md:hidden' : '',
                ].join(' ')}
              >
                {label}
              </span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
