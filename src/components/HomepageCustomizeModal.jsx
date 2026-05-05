import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronUp, ChevronDown, Trash2 } from 'lucide-react'
import './HomepageCustomizeModal.css'

const MAX_WIDGETS = 5

const ALL_WIDGETS = [
  { id: 'alerts',    name: 'Coming up soon',  description: 'Alertes, rappels et jalons à venir sur les 30 prochains jours.' },
  { id: 'scope',     name: 'Scope overview',  description: "Synthèse de l'activité de votre portefeuille avec les métriques clés." },
  { id: 'deals',     name: 'Recent deals',    description: 'Derniers deals ajoutés à votre portefeuille.' },
  { id: 'controls',  name: 'Deals controls',  description: 'Alertes de contrôle sur vos deals actifs et actions requises.' },
  { id: 'favorites', name: 'My favorites',    description: 'Accès rapide à vos applications favorites.' },
]

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
    if (localOrder.includes(id) || localOrder.length >= MAX_WIDGETS) return
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
    <div className="hcm-overlay" onClick={handleOverlayClick}>
      <div className="hcm-dialog" role="dialog" aria-modal="true" aria-label="Customize homepage">
        {/* Header */}
        <div className="hcm-header">
          <h2 className="hcm-title">Customize homepage</h2>
          <button className="hcm-close" onClick={onClose} aria-label="Close">
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Body: two panels */}
        <div className="hcm-body">
          {/* Left panel: catalog */}
          <div className="hcm-panel hcm-panel--catalog">
            <div className="hcm-panel-header">
              <h3 className="hcm-panel-title">Catalog</h3>
              <input
                className="hcm-search"
                type="text"
                placeholder="Search widgets…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="hcm-catalog-grid">
              {filteredWidgets.map(widget => {
                return (
                  <div key={widget.id} className="hcm-widget-card">
                    <p className="hcm-widget-name">{widget.name}</p>
                    <p className="hcm-widget-desc">{widget.description}</p>
                    <button
                      className="hcm-add-btn"
                      disabled={localOrder.length >= MAX_WIDGETS}
                      onClick={() => handleAdd(widget.id)}
                    >
                      + Add
                    </button>
                  </div>
                )
              })}
              {filteredWidgets.length === 0 && (
                <p className="hcm-no-results">No widgets match your search.</p>
              )}
            </div>
          </div>

          {/* Right panel: current selection */}
          <div className="hcm-panel hcm-panel--selection">
            <div className="hcm-panel-header">
              <h3 className="hcm-panel-title">
                Current selection ({localOrder.length}/{MAX_WIDGETS})
              </h3>
              <p className="hcm-panel-hint">
                Move items up or down using drag-and-drop or the arrow buttons.
              </p>
            </div>
            <div className="hcm-selection-list">
              {selectedWidgets.map((widget, index) => (
                <div
                  key={widget.id}
                  className="hcm-sel-row"
                  draggable
                  onDragStart={e => handleDragStart(e, index)}
                  onDragOver={e => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  <span className="hcm-drag-handle" aria-hidden="true">⠿</span>
                  <div className="hcm-sel-info">
                    <p className="hcm-sel-name">{widget.name}</p>
                    <p className="hcm-sel-desc">{widget.description}</p>
                  </div>
                  <div className="hcm-sel-actions">
                    <button
                      className="hcm-arrow-btn"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      aria-label={`Move ${widget.name} up`}
                    >
                      <ChevronUp size={14} strokeWidth={2} />
                    </button>
                    <button
                      className="hcm-arrow-btn"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === selectedWidgets.length - 1}
                      aria-label={`Move ${widget.name} down`}
                    >
                      <ChevronDown size={14} strokeWidth={2} />
                    </button>
                    <button
                      className="hcm-delete-btn"
                      onClick={() => handleDelete(widget.id)}
                      aria-label={`Remove ${widget.name}`}
                    >
                      <Trash2 size={14} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              ))}
              {selectedWidgets.length === 0 && (
                <p className="hcm-empty">No widgets selected. Add some from the catalog.</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="hcm-footer">
          <button className="hcm-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="hcm-save-btn" onClick={handleSave}>Save selection</button>
        </div>
      </div>
    </div>,
    document.body
  )
}
