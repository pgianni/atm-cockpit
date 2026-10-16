import { Handshake, X, ArrowRight } from 'lucide-react'

export default function NotificationPanel({ open, onClose, onNavigateNotifs, notifications = [] }) {
  return (
    <aside
      className={[
        'fixed bottom-0 right-0 top-16 z-[201] flex w-[400px] flex-col border-l border-line bg-surface',
        'transition-[transform,box-shadow] duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
        open ? 'translate-x-0 shadow-[-4px_0_16px_rgba(19,21,23,0.12)]' : 'translate-x-full',
      ].join(' ')}
      aria-label="Notifications"
    >
      {/* Header */}
      <div className="flex shrink-0 items-start gap-1 px-6 pt-6">
        <h2 className="m-0 flex-1 pt-1 text-xl font-bold text-major">Notifications</h2>
        <button
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded text-major transition-colors duration-150 hover:bg-page"
          onClick={onClose}
          aria-label="Close notifications"
        >
          <X size={20} strokeWidth={1.5} />
        </button>
      </div>

      {/* Items */}
      <div className="flex flex-1 flex-col overflow-y-auto px-4 pb-6 pt-2">
        {notifications.map(n => (
          /* -mt-px collapses the shared border between consecutive items */
          <div key={n.id} className="-mt-px flex items-start gap-2 border-y border-line py-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-primary">
              <Handshake size={24} strokeWidth={1.5} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-3 pt-0.5">
              <div className="flex items-start gap-2">
                <p className="m-0 flex-1 text-lg font-bold text-major">{n.title}</p>
                <span className="shrink-0 whitespace-nowrap py-[3px] text-sm font-normal text-minor">{n.time}</span>
                {n.unread && <span className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-danger" />}
              </div>
              <p className="m-0 text-xs font-normal leading-[18px] text-major">{n.description}</p>
              <button className="inline-flex h-8 items-center gap-2 self-start rounded bg-primary px-2 text-sm font-semibold text-reverse transition-colors duration-150 hover:bg-primary-hover">
                Consult in Glass
                <ArrowRight size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-line px-4 py-3">
        <button
          className="h-10 w-full rounded border border-primary bg-surface text-base font-semibold text-primary transition-colors duration-150 hover:bg-primary-subtle"
          onClick={() => { onClose(); onNavigateNotifs?.(); }}
        >
          Consult all notifications
        </button>
      </div>
    </aside>
  )
}
