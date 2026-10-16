import { useState } from 'react'
import { FileText, MailOpen, Mail, ArrowRight, ChevronRight, Settings } from 'lucide-react'
import { ghostButton, breadcrumbLink, breadcrumbCurrent } from '../ui'

const TYPE_FILTERS = [
  { id: 'all',         label: 'All notifications' },
  { id: 'information', label: 'For information'   },
  { id: 'action',      label: 'For action'        },
]

/* ── Single notification row ──────────────────────────────────────── */
function NotificationItem({ notif, onToggle }) {
  const unread = notif.unread
  return (
    <div
      className={[
        'flex flex-wrap items-center gap-2 border-b border-line p-3 transition-[background-color,border-color] duration-300 last:border-b-0',
        'md:flex-nowrap md:gap-3 md:px-6 md:py-4',
        unread ? 'border-l-4 border-l-primary bg-primary/[0.07]' : 'bg-surface',
      ].join(' ')}
    >
      {/* Icon */}
      <div
        className={[
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300 md:h-[42px] md:w-[42px]',
          unread ? 'bg-primary-subtle text-primary' : 'bg-line text-minor',
        ].join(' ')}
      >
        <FileText size={28} strokeWidth={1.5} />
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <p
          className={[
            'overflow-hidden text-ellipsis whitespace-nowrap text-base leading-[1.3] transition-colors duration-300',
            unread ? 'font-bold text-primary' : 'font-normal text-major',
          ].join(' ')}
        >
          {notif.title}
        </p>
        <p className="overflow-hidden text-ellipsis whitespace-nowrap text-xs leading-[1.4] text-minor">{notif.description}</p>
        <div className="mt-0.5 flex items-center gap-2">
          {/* Fades rather than unmounts, so the row never jumps */}
          <span
            className={[
              'h-2 shrink-0 rounded-full bg-danger transition-[opacity,transform] duration-300',
              unread ? 'w-2 scale-100 opacity-100' : 'w-0 scale-0 opacity-0',
            ].join(' ')}
            aria-hidden="true"
          />
          <span className="whitespace-nowrap text-xs italic text-minor">{notif.time}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex w-full shrink-0 items-center justify-end gap-1.5 pl-[42px] md:w-auto md:justify-start md:gap-2 md:pl-0">
        <button
          className={[
            'flex h-7 items-center gap-1.5 whitespace-nowrap rounded border px-2 text-xs font-semibold transition-colors duration-150',
            'md:h-8 md:text-sm',
            'hover:border-transparent hover:bg-primary/[0.08] hover:text-primary',
            unread ? 'border-transparent text-primary' : 'border-line text-minor',
          ].join(' ')}
          onClick={() => onToggle(notif.id)}
        >
          {notif.unread
            ? <><span>Mark as read</span><MailOpen size={15} strokeWidth={1.5} /></>
            : <><span>Mark as unread</span><Mail size={15} strokeWidth={1.5} /></>
          }
        </button>

        <button className="flex h-7 items-center gap-1.5 whitespace-nowrap rounded border border-primary bg-primary px-2 text-xs font-semibold text-reverse transition-colors duration-150 hover:border-primary-hover hover:bg-primary-hover md:h-8 md:px-3 md:text-sm">
          <span>Consult in Glass</span>
          <ArrowRight size={15} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────────────── */
export default function NotificationsPage({ offsetClass = '', notifications, onToggle, onMarkAllRead, onNavigateHome }) {
  const [activeType, setActiveType] = useState('all')

  const unreadCount = notifications.filter(n => n.unread).length

  const visible = activeType === 'all'
    ? notifications
    : notifications.filter(n => n.type === activeType)

  return (
    <main className={`mt-16 min-h-[calc(100vh-64px)] bg-page transition-[margin-left] duration-200 ease-out ${offsetClass}`}>

      {/* Breadcrumb */}
      <div className="flex h-10 items-center bg-[linear-gradient(90deg,#005740_0%,#007d57_60%,#009a6a_100%)] px-4 md:px-8">
        <nav className="flex items-center gap-0.5" aria-label="Breadcrumb">
          <button className={breadcrumbLink} onClick={() => onNavigateHome?.()}>Home</button>
          <ChevronRight size={16} strokeWidth={1.5} className="shrink-0 text-reverse" />
          <span className={breadcrumbCurrent}>Notifications</span>
        </nav>
      </div>

      <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-10">

        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-2 md:flex-nowrap md:gap-4">
          <h1 className="flex items-center gap-2 text-2xl font-bold leading-[1.3] text-major">
            Notifications
            {unreadCount > 0 && (
              <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-2xl bg-danger px-1.5 text-[13px] font-semibold leading-none text-reverse">
                {unreadCount}
              </span>
            )}
          </h1>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                className="flex h-8 items-center gap-1.5 whitespace-nowrap rounded border border-primary px-3 text-sm font-semibold text-primary transition-colors duration-150 hover:bg-primary hover:text-reverse"
                onClick={onMarkAllRead}
              >
                <MailOpen size={15} strokeWidth={1.5} />
                <span>Mark all as read</span>
              </button>
            )}
            <button className={ghostButton}>
              <Settings size={18} strokeWidth={1.5} />
              Edit notification settings
            </button>
          </div>
        </div>

        {/* Type filter tabs */}
        <div className="flex gap-1 overflow-x-auto border-b-2 border-line">
          {TYPE_FILTERS.map(f => {
            const count = f.id === 'all'
              ? notifications.length
              : notifications.filter(n => n.type === f.id).length
            const active = activeType === f.id
            return (
              <button
                key={f.id}
                className={[
                  'relative inline-flex h-[38px] cursor-pointer items-center gap-1.5 whitespace-nowrap px-3 text-sm font-semibold transition-colors duration-150 md:px-4 md:text-base',
                  // underline sits on top of the container's bottom border
                  'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-t-sm after:transition-colors',
                  active ? 'text-primary after:bg-primary' : 'text-minor after:bg-transparent hover:text-major',
                ].join(' ')}
                onClick={() => setActiveType(f.id)}
              >
                {f.label}
                <span
                  className={[
                    'inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-[5px] text-[11px] font-semibold leading-none transition-colors duration-150',
                    active ? 'bg-primary-subtle text-primary' : 'bg-line text-minor',
                  ].join(' ')}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* List */}
        <div className="flex flex-col overflow-hidden rounded-lg border border-line bg-surface">
          {visible.map(n => (
            <NotificationItem key={n.id} notif={n} onToggle={onToggle} />
          ))}
          {visible.length === 0 && (
            <p className="p-8 text-center text-sm text-minor">No notifications in this category.</p>
          )}
        </div>

      </div>
    </main>
  )
}
