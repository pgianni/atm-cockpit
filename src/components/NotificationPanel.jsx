import { Handshake, X, ArrowRight } from 'lucide-react'
import './NotificationPanel.css'

export default function NotificationPanel({ open, onClose, onNavigateNotifs, notifications = [] }) {
  return (
    <>
      <aside className={`notif-panel${open ? ' notif-panel--open' : ''}`} aria-label="Notifications">
        {/* Header */}
        <div className="notif-panel__header">
          <h2 className="notif-panel__title">Notifications</h2>
          <button className="notif-panel__close" onClick={onClose} aria-label="Close notifications">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div className="notif-panel__content">
          {notifications.map(n => (
            <div key={n.id} className="notif-panel__item">
              <div className="notif-panel__item-icon">
                <Handshake size={24} strokeWidth={1.5} />
              </div>
              <div className="notif-panel__item-body">
                <div className="notif-panel__item-row">
                  <p className="notif-panel__item-title">{n.title}</p>
                  <span className="notif-panel__item-time">{n.time}</span>
                  {n.unread && <span className="notif-panel__item-dot" />}
                </div>
                <p className="notif-panel__item-desc">{n.description}</p>
                <button className="notif-panel__cta">
                  Consult in Glass
                  <ArrowRight size={16} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="notif-panel__footer">
          <button className="notif-panel__footer-btn" onClick={() => { onClose(); onNavigateNotifs?.(); }}>
            Consult all notifications
          </button>
        </div>
      </aside>
    </>
  )
}
