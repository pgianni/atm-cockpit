import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronUp, ChevronDown, Trash2 } from 'lucide-react'

const ALL_WIDGETS = [
  { id: 'alerts',         name: 'Coming up soon',          description: 'Alertes, rappels et jalons à venir sur les 30 prochains jours.' },
  { id: 'scope',          name: 'Scope overview',           description: "Synthèse de l'activité de votre portefeuille avec les métriques clés." },
  { id: 'deals',          name: 'Recent deals',             description: 'Derniers deals ajoutés à votre portefeuille.' },
  { id: 'controls',       name: 'Deals controls',           description: 'Alertes de contrôle sur vos deals actifs et actions requises.' },
  { id: 'favorites',      name: 'My favorites',             description: 'Accès rapide à vos applications favorites.' },
  { id: 'recent-objects', name: 'Recently opened objects',  description: 'Les 10 derniers objets ouverts : deals, documents, assets, covenants et mitigants.' },
]

const PANEL_TITLE  = 'm-0 mb-2.5 text-[13px] font-bold uppercase tracking-[0.06em] text-minor'
const PANEL_HEADER = 'shrink-0 border-b border-line px-5 pb-3 pt-4'
const SQUARE_BTN   = 'flex h-7 w-7 cursor-pointer items-center justify-center rounded border-[1.5px] bg-transparent transition-colors duration-100'

export default function HomepageCustomizeModal({ open, onClose, selection, onSave }) {
  const [localOrder, setLocalOrder] = useState(() => [...(selection || [])])
  const [search, setSearch] = useState('')

  // Reset local state when modal opens
  const prevOpen = useRef(open)
  if (open !== prevOpen.current) {
    prevOpen.current = open
    if (open) {
      setLocalOrder([...(selection || [])])
      setSearch('')
    }
  }

  // Drag and drop state
  const dragIndexRef = useRef(null)

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const filteredWidgets = ALL_WIDGETS.filter(w =>
    !localOrder.includes(w.id) &&
    (w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.description.toLowerCase().includes(search.toLowerCase()))
  )

  function handleAdd(id) {
    if (localOrder.includes(id)) return
    setLocalOrder(prev => [...prev, id])
  }

  function handleDelete(id) {
    setLocalOrder(prev => prev.filter(x => x !== id))
  }

  function handleMoveUp(index) {
    if (index === 0) return
    setLocalOrder(prev => {
      const next = [...prev]
      ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
      return next
    })
  }

  function handleMoveDown(index) {
    setLocalOrder(prev => {
      if (index >= prev.length - 1) return prev
      const next = [...prev]
      ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
      return next
    })
  }

  function handleDragStart(e, index) {
    dragIndexRef.current = index
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragOver(e, index) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    const from = dragIndexRef.current
    if (from === null || from === index) return
    setLocalOrder(prev => {
      const next = [...prev]
      const [removed] = next.splice(from, 1)
      next.splice(index, 0, removed)
      return next
    })
    dragIndexRef.current = index
  }

  function handleDragEnd() {
    dragIndexRef.current = null
  }

  function handleSave() {
    onSave(localOrder)
    onClose()
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  const selectedWidgets = localOrder.map(id => ALL_WIDGETS.find(w => w.id === id)).filter(Boolean)

  return createPortal(
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center bg-[rgba(19,21,23,0.55)] p-4"
      onClick={handleOverlayClick}
    >
      <div
        className="flex h-[560px] w-full max-w-[900px] flex-col overflow-hidden rounded-lg bg-surface shadow-[0_8px_40px_rgba(19,21,23,0.22)]"
        role="dialog"
        aria-modal="true"
        aria-label="Customize homepage"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-line px-6 py-[18px]">
          <h2 className="m-0 text-[17px] font-bold text-major">Customize homepage</h2>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-md text-minor transition-colors duration-100 hover:bg-line hover:text-major"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Body: two panels */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Left panel: catalog */}
          <div className="flex flex-col overflow-hidden border-r border-line bg-page md:flex-[0_0_480px]">
            <div className={PANEL_HEADER}>
              <h3 className={PANEL_TITLE}>Catalog</h3>
              <input
                className="h-9 w-full rounded-md border border-line bg-surface px-3 text-[13px] text-major outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-minor focus:border-primary focus:shadow-[0_0_0_2px_rgba(0,125,87,0.15)]"
                type="text"
                placeholder="Search widgets…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-2.5 overflow-y-auto px-5 py-3.5 md:grid-cols-2">
              {filteredWidgets.map(widget => (
                <div
                  key={widget.id}
                  className="flex flex-col gap-1.5 rounded-lg border-[1.5px] border-line bg-surface p-3 transition-colors duration-150"
                >
                  <p className="m-0 text-[13px] font-bold text-major">{widget.name}</p>
                  <p className="m-0 flex-1 text-xs leading-[1.4] text-minor">{widget.description}</p>
                  <button
                    className="mt-1 h-7 cursor-pointer self-start rounded-[5px] bg-primary px-3 text-xs font-bold text-white transition-colors duration-100 hover:bg-[#006246]"
                    onClick={() => handleAdd(widget.id)}
                  >
                    + Add
                  </button>
                </div>
              ))}
              {filteredWidgets.length === 0 && (
                <p className="col-span-full py-5 text-center text-[13px] text-minor">No widgets match your search.</p>
              )}
            </div>
          </div>

          {/* Right panel: current selection */}
          <div className="flex flex-1 flex-col overflow-hidden bg-surface">
            <div className={PANEL_HEADER}>
              <h3 className={PANEL_TITLE}>
                Current selection ({localOrder.length})
              </h3>
              <p className="m-0 text-xs leading-[1.4] text-minor">
                Move items up or down using drag-and-drop or the arrow buttons.
              </p>
            </div>
            <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-3">
              {selectedWidgets.map((widget, index) => (
                <div
                  key={widget.id}
                  className="flex cursor-grab items-center gap-2.5 rounded-[7px] border border-line bg-surface px-3 py-2.5 transition-colors duration-100 hover:bg-primary/[0.04] active:cursor-grabbing"
                  draggable
                  onDragStart={e => handleDragStart(e, index)}
                  onDragOver={e => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  <span className="shrink-0 cursor-grab select-none text-base leading-none text-minor" aria-hidden="true">⠿</span>
                  <div className="min-w-0 flex-1">
                    <p className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-bold text-major">{widget.name}</p>
                    <p className="mb-0 mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-minor">{widget.description}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      className={`${SQUARE_BTN} border-primary text-primary hover:enabled:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-30`}
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      aria-label={`Move ${widget.name} up`}
                    >
                      <ChevronUp size={14} strokeWidth={2} />
                    </button>
                    <button
                      className={`${SQUARE_BTN} border-primary text-primary hover:enabled:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-30`}
                      onClick={() => handleMoveDown(index)}
                      disabled={index === selectedWidgets.length - 1}
                      aria-label={`Move ${widget.name} down`}
                    >
                      <ChevronDown size={14} strokeWidth={2} />
                    </button>
                    <button
                      className={`${SQUARE_BTN} border-[#d92726] text-[#d92726] hover:bg-[#d92726]/[0.08]`}
                      onClick={() => handleDelete(widget.id)}
                      aria-label={`Remove ${widget.name}`}
                    >
                      <Trash2 size={14} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              ))}
              {selectedWidgets.length === 0 && (
                <p className="py-5 text-center text-[13px] text-minor">No widgets selected. Add some from the catalog.</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-line px-6 py-3.5">
          <button
            className="cursor-pointer rounded-[5px] px-2.5 py-1.5 text-sm font-semibold text-minor transition-colors duration-100 hover:bg-line hover:text-major"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="h-9 cursor-pointer rounded-md bg-primary px-5 text-sm font-bold text-white transition-colors duration-100 hover:bg-[#006246]"
            onClick={handleSave}
          >
            Save selection
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
