import { FileText, MailOpen, Mail, ArrowRight, ChevronRight, Settings } from 'lucide-react'
import './NotificationsPage.css'

/* ── Single notification row ──────────────────────────────────────── */
function NotificationItem({ notif, onToggle }) {
  return (
    <div className={`notif-item${notif.unread ? ' notif-item--unread' : ' notif-item--read'}`}>

      {/* Icon */}
      <div className="notif-item__icon-wrap">
        <FileText size={28} strokeWidth={1.5} />
      </div>

      {/* Content */}
      <div className="notif-item__content">
        <p className="notif-item__title">{notif.title}</p>
        <p className="notif-item__desc">{notif.description}</p>
        <div className="notif-item__meta">
          <span className="notif-item__dot" aria-hidden="true" />
          <span className="notif-item__time">{notif.time}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="notif-item__actions">
        <button
          className="notif-item__toggle-btn"
          onClick={() => onToggle(notif.id)}
        >
          {notif.unread
            ? <><span>Mark as read</span><MailOpen size={15} strokeWidth={1.5} /></>
            : <><span>Mark as unread</span><Mail size={15} strokeWidth={1.5} /></>
          }
        </button>

        <button className="notif-item__consult">
          <span>Consult in Glass</span>
          <ArrowRight size={15} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────────────── */
export default function NotificationsPage({ style, notifications, onToggle, onMarkAllRead, onNavigateHome }) {
  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <main className="notif-page" style={style}>

      {/* Breadcrumb */}
      <div className="notif-page__breadcrumb">
        <nav className="notif-page__breadcrumb-nav" aria-label="Breadcrumb">
          <button className="notif-page__crumb notif-page__crumb--link" onClick={() => onNavigateHome?.()}>Home</button>
          <ChevronRight size={16} strokeWidth={1.5} className="notif-page__crumb-sep" />
          <span className="notif-page__crumb">Notifications</span>
        </nav>
      </div>

      <div className="notif-page__content">

        {/* Header row */}
        <div className="notif-page__header">
          <h1 className="notif-page__title">
            Notifications
            {unreadCount > 0 && (
              <span className="notif-page__badge">{unreadCount}</span>
            )}
          </h1>
          <div className="notif-page__header-actions">
            {unreadCount > 0 && (
              <button className="notif-page__mark-all" onClick={onMarkAllRead}>
                <MailOpen size={15} strokeWidth={1.5} />
                <span>Mark all as read</span>
              </button>
            )}
            <button className="apps-page__edit-btn">
              <Settings size={18} strokeWidth={1.5} />
              Edit notification settings
            </button>
          </div>
        </div>

        {/* List */}
        <div className="notif-page__list">
          {notifications.map(n => (
            <NotificationItem key={n.id} notif={n} onToggle={onToggle} />
          ))}
        </div>

      </div>
    </main>
  )
}
