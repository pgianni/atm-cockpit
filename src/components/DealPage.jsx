import { useEffect, useState } from 'react'
import { ChevronDown, ChevronRight, Download, ExternalLink, Calendar, ShieldCheck, Box, ArrowRight } from 'lucide-react'
import iconDeal     from '../assets/icon-deal.svg'
import iconContract from '../assets/icon-contract.svg'
import iconTranche  from '../assets/icon-tranche.svg'
import './DealPage.css'

const LEVEL_ICON = [iconDeal, iconContract, iconTranche]

/* ── Mock data per deal ─────────────────────────────────────────── */
const DEALS = {
  1: {
    name: 'Silverpath Infra – Senior Secured',
    currency: 'EUR',
    sti: '1234567890',
    bookingEntities: '1234 - CA-CIB Paris, 5678 - New York',
    productLine: '12345 - INF - INFRASTRUCTURE & ARCHI',
    metrics: [
      { label: 'Commitment',          value: '150 M EUR' },
      { label: 'Utilisation',         value: '150 M EUR (100%)' },
      { label: 'RWA Economic / EAD',  value: '3.1 M / 6 M EUR' },
      { label: 'Expected Credit Loss',value: '4.2 M EUR' },
      { label: 'Trade date',          value: '2025-10-28' },
      { label: 'Maturity date',       value: '2032-10-28' },
    ],
    structure: [
      { id: 's1', level: 0, name: 'Silverpath Infra 2032', status: 'Effective', code: '9000001801', expandable: true },
      { id: 's2', level: 1, name: 'Senior Secured Facility Agreement', status: 'Effective', code: '9000001802', expandable: true },
      { id: 's3', level: 2, name: 'Tranche A', status: 'Effective', code: '9000001803' },
      { id: 's4', level: 2, name: 'Tranche B', status: 'Effective', code: '9000001804' },
      { id: 's5', level: 1, name: 'Hedging Agreement', status: 'Signed', code: '9000001805', expandable: true },
      { id: 's6', level: 2, name: 'Tranche RCF', status: 'Effective', code: '9000001806' },
    ],
    linkedObjects: [
      { icon: Calendar,      label: 'Covenant',  count: 8 },
      { icon: ShieldCheck,   label: 'Mitigant',  count: 3 },
      { icon: Box,           label: 'Assets',    count: 5 },
    ],
    client: {
      cpyName: 'Silverpath Holdings SA',    cpyId: '1234567890',
      cphName: 'Silverpath Group',          cphId: '123456',
      internalRating: 'BBB+',              lastReview: '2025-09-15',
      kyc: 'Verified',
      subClient: 'Silverpath Infra SPV',   subClientId: '654321',
      rootClient: 'Silverpath Group',      rootClientId: '123456',
    },
    activity: [
      { date: 'Today',     event: 'KYC remediation closed for Belgian opco' },
      { date: 'Yesterday', event: 'ICA draft circulated by Clifford Chance' },
      { date: '31 Oct',    event: 'Agency comments received on utilization' },
      { date: '29 Oct',    event: 'Security checklist updated for Dutch entities' },
    ],
    keyDates: [
      { date: '04 Nov 2025', label: 'First utilisation request deadline' },
      { date: '07 Nov 2025', label: 'CP satisfaction committee' },
      { date: '14 Nov 2025', label: 'Security package closing call' },
      { date: '19 Nov 2025', label: 'Agency onboarding complete' },
    ],
    contacts: {
      counterparty: [
        { initials: 'PM', name: 'P. Maximoff', role: 'Job Title', color: '#7c3aed' },
      ],
      dealTeam: [
        { initials: 'AC', name: 'A. Chase',      role: 'Portfolio Manager',     color: '#1a56db' },
        { initials: 'PJ', name: 'P. Jackson',    role: 'Lead Originator',       color: '#1a56db' },
        { initials: 'GU', name: 'G. Underwood',  role: 'Originator',            color: '#b45309', avatar: true },
        { initials: 'CB', name: 'C. Beckendorf', role: 'Primary Coverage Officer', color: '#1a56db' },
      ],
      kycTeam: [
        { initials: 'MH', name: 'M. Hecate', role: 'Job Title', color: '#b45309', avatar: true },
      ],
    },
  },
  2: {
    name: 'Energy Project – Refinancement',
    currency: 'EUR',
    sti: '9876543210',
    bookingEntities: '5678 - CA-CIB London',
    productLine: '67890 - ENE - ENERGY & NATURAL RESOURCES',
    metrics: [
      { label: 'Commitment',          value: '75 M EUR' },
      { label: 'Utilisation',         value: '60 M EUR (80%)' },
      { label: 'RWA Economic / EAD',  value: '1.8 M / 4 M EUR' },
      { label: 'Expected Credit Loss',value: '2.1 M EUR' },
      { label: 'Trade date',          value: '2025-06-15' },
      { label: 'Maturity date',       value: '2030-06-15' },
    ],
    structure: [
      { id: 'e1', level: 0, name: 'Energy Project 2030', status: 'Effective', code: '9000002001', expandable: true },
      { id: 'e2', level: 1, name: 'Refinancing Facility Agreement', status: 'Effective', code: '9000002002', expandable: true },
      { id: 'e3', level: 2, name: 'Tranche A', status: 'Effective', code: '9000002003' },
      { id: 'e4', level: 2, name: 'Tranche B', status: 'Signed', code: '9000002004' },
    ],
    linkedObjects: [
      { icon: Calendar,    label: 'Covenant',  count: 5 },
      { icon: ShieldCheck, label: 'Mitigant',  count: 2 },
      { icon: Box,         label: 'Assets',    count: 3 },
    ],
    client: {
      cpyName: 'Helios Aviation Partners',  cpyId: '9876543210',
      cphName: 'Helios Group',              cphId: '654321',
      internalRating: 'A',                 lastReview: '2025-07-20',
      kyc: 'Verified',
      subClient: 'Helios Energy SPV',      subClientId: '111222',
      rootClient: 'Helios Group',          rootClientId: '654321',
    },
    activity: [
      { date: 'Today',     event: 'Covenant test results submitted' },
      { date: '2 days ago', event: 'Drawdown notice received for Tranche B' },
      { date: '28 Oct',    event: 'Lender consent obtained for amendment' },
      { date: '25 Oct',    event: 'Q3 monitoring report uploaded' },
    ],
    keyDates: [
      { date: '10 Nov 2025', label: 'DSCR test deadline' },
      { date: '15 Nov 2025', label: 'Tranche B drawdown date' },
      { date: '30 Nov 2025', label: 'Annual review committee' },
      { date: '01 Dec 2025', label: 'Insurance renewal deadline' },
    ],
    contacts: {
      counterparty: [
        { initials: 'JD', name: 'J. Dubois', role: 'CFO', color: '#1a56db' },
      ],
      dealTeam: [
        { initials: 'SR', name: 'S. Ramos',   role: 'Portfolio Manager',  color: '#007d57' },
        { initials: 'KL', name: 'K. Lambert', role: 'Lead Originator',    color: '#1a56db' },
      ],
      kycTeam: [
        { initials: 'NT', name: 'N. Thomas', role: 'KYC Analyst', color: '#007d57' },
      ],
    },
  },
}

const STATUS_COLOR = {
  Effective: { bg: '#14851d', label: 'Effective' },
  Signed:    { bg: '#007d57', label: 'Signed' },
  Default:   { bg: '#5e6a71', label: 'Unknown' },
}

/* Returns true if col c has a continuing vertical line for row at index i */
function hasGuideAt(structure, i, col) {
  for (let j = i + 1; j < structure.length; j++) {
    if (structure[j].level === col + 1) return true
    if (structure[j].level <= col) return false
  }
  return false
}

/* Returns visible node indices given a collapsed set */
function getVisibleIndices(structure, collapsed) {
  const visible = []
  let skipAboveLevel = Infinity
  for (let i = 0; i < structure.length; i++) {
    const node = structure[i]
    if (node.level <= skipAboveLevel) {
      skipAboveLevel = collapsed.has(node.id) ? node.level : Infinity
      visible.push(i)
    }
  }
  return visible
}

/* ── Tree row ────────────────────────────────────────────────────── */
function TreeRow({ node, index, structure, hasChildren, isCollapsed, onToggle }) {
  const level = node.level
  const status = STATUS_COLOR[node.status] || STATUS_COLOR.Default
  const guides = Array.from({ length: level }, (_, col) => hasGuideAt(structure, index, col))

  return (
    <div className="deal-tree__row">
      {guides.map((hasMore, col) => {
        const isBranch = col === level - 1
        let cls = 'deal-tree__guide'
        if (isBranch) {
          cls += ' deal-tree__guide--branch'
          if (hasMore) cls += ' deal-tree__guide--continues'
        } else if (hasMore) {
          cls += ' deal-tree__guide--line'
        }
        return <div key={col} className={cls} />
      })}

      <div className="deal-tree__body">
        {hasChildren ? (
          <button
            className={`deal-tree__toggle${isCollapsed ? ' deal-tree__toggle--collapsed' : ''}`}
            onClick={onToggle}
            aria-label={isCollapsed ? 'Expand' : 'Collapse'}
          >
            <ChevronDown size={13} strokeWidth={2} />
          </button>
        ) : (
          <span className="deal-tree__toggle-placeholder" />
        )}
        <div className="deal-tree__icon">
          <img src={LEVEL_ICON[level] ?? LEVEL_ICON[2]} alt="" />
        </div>
        <div className="deal-tree__content">
          <span className="deal-tree__name">{node.name}</span>
          <div className="deal-tree__meta">
            <span className="deal-tree__badge" style={{ background: status.bg }}>{status.label}</span>
            <span className="deal-tree__code">{node.code}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Contact card ─────────────────────────────────────────────────── */
function ContactCard({ contact }) {
  return (
    <div className="deal-contact">
      <div className="deal-contact__avatar" style={{ background: contact.color }}>
        {contact.initials}
      </div>
      <p className="deal-contact__name">{contact.name}</p>
      <p className="deal-contact__role">{contact.role}</p>
      <div className="deal-contact__actions">
        <a className="deal-contact__action" href="#">Chat on Teams</a>
        <a className="deal-contact__action" href="#">Send an email</a>
      </div>
    </div>
  )
}

/* ── Main page ───────────────────────────────────────────────────── */
export default function DealPage({ style, dealId = 1, onBack, onNavigateClient }) {
  const deal = DEALS[dealId] || DEALS[1]
  const [collapsed, setCollapsed] = useState(new Set())

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    setCollapsed(new Set())
  }, [dealId])

  function toggleCollapse(id) {
    setCollapsed(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const visibleIndices = getVisibleIndices(deal.structure, collapsed)

  return (
    <main className="deal-page" style={style}>

      {/* Breadcrumb */}
      <div className="deal-page__breadcrumb">
        <nav className="deal-page__breadcrumb-nav" aria-label="Breadcrumb">
          <button className="deal-page__crumb deal-page__crumb--link" onClick={onBack}>Home</button>
          <ChevronRight size={16} strokeWidth={1.5} className="deal-page__crumb-sep" />
          <button className="deal-page__crumb deal-page__crumb--link" onClick={onBack}>Portfolio</button>
          <ChevronRight size={16} strokeWidth={1.5} className="deal-page__crumb-sep" />
          <button className="deal-page__crumb deal-page__crumb--link" onClick={() => onNavigateClient?.(deal.client.cpyId)}>
            {deal.client.cpyName}
          </button>
          <ChevronRight size={16} strokeWidth={1.5} className="deal-page__crumb-sep" />
          <span className="deal-page__crumb">{deal.name}</span>
        </nav>
      </div>

      {/* ── Hero ── */}
      <div className="deal-page__hero">
        <div className="deal-page__hero-inner">

          {/* Header row */}
          <div className="deal-page__hero-header">
            {/* Illustration */}
            <div className="deal-page__illu" aria-hidden="true">
              <svg viewBox="0 0 74 112" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="30" width="58" height="72" rx="4" fill="rgba(255,255,255,0.15)" />
                <rect x="16" y="42" width="42" height="4" rx="2" fill="rgba(255,255,255,0.5)" />
                <rect x="16" y="52" width="30" height="4" rx="2" fill="rgba(255,255,255,0.35)" />
                <rect x="16" y="62" width="36" height="4" rx="2" fill="rgba(255,255,255,0.35)" />
                <rect x="16" y="72" width="24" height="4" rx="2" fill="rgba(255,255,255,0.25)" />
                <circle cx="37" cy="18" r="12" fill="rgba(255,255,255,0.2)" />
                <circle cx="37" cy="15" r="5" fill="rgba(255,255,255,0.5)" />
                <path d="M25 30 Q37 22 49 30" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" />
              </svg>
            </div>

            {/* Title + codes */}
            <div className="deal-page__hero-title-block">
              <div className="deal-page__hero-title-row">
                <div className="deal-page__hero-name-col">
                  <div className="deal-page__tags">
                    <span className="deal-page__currency-tag">{deal.currency}</span>
                  </div>
                  <h1 className="deal-page__name">{deal.name}</h1>
                </div>
                <div className="deal-page__hero-actions">
                  <button className="deal-page__btn-outline">
                    <Download size={18} strokeWidth={1.5} />
                    Export to excel
                  </button>
                  <button className="deal-page__btn-outline">
                    Open in Glass
                    <ArrowRight size={18} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
              <div className="deal-page__codes">
                <span><span className="deal-page__codes-label">STI1: </span><strong>{deal.sti}</strong></span>
                <span><span className="deal-page__codes-label">Booking entities: </span><strong>{deal.bookingEntities}</strong></span>
                <span><span className="deal-page__codes-label">Product line: </span><strong>{deal.productLine}</strong></span>
              </div>
            </div>
          </div>

          {/* Metrics grid */}
          <div className="deal-page__metrics">
            {deal.metrics.map(m => (
              <div key={m.label} className="deal-page__metric-card">
                <span className="deal-page__metric-label">{m.label}</span>
                <span className="deal-page__metric-value">{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="deal-page__body">

        {/* Left column */}
        <div className="deal-page__col">

          {/* Deal Structure */}
          <div className="deal-page__card">
            <h2 className="deal-page__section-title">Deal Structure</h2>
            <div className="deal-tree">
              {visibleIndices.map(i => {
                const node = deal.structure[i]
                const hasChildren = deal.structure[i + 1]?.level > node.level
                return (
                  <TreeRow
                    key={node.id}
                    node={node}
                    index={i}
                    structure={deal.structure}
                    hasChildren={hasChildren}
                    isCollapsed={collapsed.has(node.id)}
                    onToggle={() => toggleCollapse(node.id)}
                  />
                )
              })}
            </div>
          </div>

          {/* Linked objects */}
          <div className="deal-page__card">
            <h2 className="deal-page__section-title">Linked objects</h2>
            <div className="deal-linked">
              {deal.linkedObjects.map(obj => {
                const Icon = obj.icon
                return (
                  <div key={obj.label} className="deal-linked__row">
                    <Icon size={20} strokeWidth={1.5} className="deal-linked__icon" />
                    <span className="deal-linked__label">{obj.label}</span>
                    <span className="deal-linked__count">{obj.count}</span>
                    <ArrowRight size={16} strokeWidth={1.5} className="deal-linked__arrow" />
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="deal-page__col">

          {/* Client */}
          <div className="deal-page__card">
            <div className="deal-page__card-header">
              <div className="deal-page__card-header-left">
                <div className="deal-page__card-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
                  </svg>
                </div>
                <h2 className="deal-page__section-title">Client</h2>
              </div>
              <button className="deal-page__see-more" onClick={() => onNavigateClient?.(deal.client.cpyId)}>See more</button>
            </div>
            <div className="deal-page__divider" />
            <div className="deal-client__grid">
              <div className="deal-client__metric">
                <span className="deal-client__metric-label">CPY name</span>
                <span className="deal-client__metric-value">{deal.client.cpyName}</span>
                <span className="deal-client__metric-sub">ID: {deal.client.cpyId}</span>
              </div>
              <div className="deal-client__metric">
                <span className="deal-client__metric-label">CPH name</span>
                <span className="deal-client__metric-value">{deal.client.cphName}</span>
                <span className="deal-client__metric-sub">ID: {deal.client.cphId}</span>
              </div>
              <div className="deal-client__metric">
                <span className="deal-client__metric-label">Internal rating</span>
                <span className="deal-client__metric-value">{deal.client.internalRating}</span>
                <span className="deal-client__metric-sub">Last review: {deal.client.lastReview}</span>
              </div>
              <div className="deal-client__metric">
                <span className="deal-client__metric-label">KYC</span>
                <div className="deal-client__kyc-status">
                  <span className="deal-client__kyc-dot" />
                  <span className="deal-client__metric-value">{deal.client.kyc}</span>
                </div>
                <a className="deal-client__link" href="#">Open in Kiwis <ExternalLink size={12} strokeWidth={1.5} /></a>
              </div>
              <div className="deal-client__metric">
                <span className="deal-client__metric-label">Sub client name</span>
                <span className="deal-client__metric-value">{deal.client.subClient}</span>
                <span className="deal-client__metric-sub">ID: {deal.client.subClientId}</span>
                <a className="deal-client__link" href="#">Open in ClientLive <ExternalLink size={12} strokeWidth={1.5} /></a>
              </div>
              <div className="deal-client__metric">
                <span className="deal-client__metric-label">Root client name</span>
                <span className="deal-client__metric-value">{deal.client.rootClient}</span>
                <span className="deal-client__metric-sub">ID: {deal.client.rootClientId}</span>
                <a className="deal-client__link" href="#">Open in ClientLive <ExternalLink size={12} strokeWidth={1.5} /></a>
              </div>
            </div>
          </div>

          {/* Recent activity */}
          <div className="deal-page__card">
            <h2 className="deal-page__section-title">Recent activity</h2>
            <p className="deal-page__section-sub">Latest events across execution and monitoring.</p>
            <div className="deal-activity">
              {deal.activity.map((item, i) => (
                <div key={i} className="deal-activity__item">
                  <span className="deal-activity__date">{item.date}</span>
                  <span className="deal-activity__event">{item.event}</span>
                  {i < deal.activity.length - 1 && <div className="deal-activity__divider" />}
                </div>
              ))}
            </div>
          </div>

          {/* Key dates */}
          <div className="deal-page__card">
            <h2 className="deal-page__section-title">Key dates</h2>
            <p className="deal-page__section-sub">Upcoming milestones for this transaction.</p>
            <div className="deal-dates">
              {deal.keyDates.map((d, i) => (
                <div key={i} className="deal-dates__row">
                  <span className="deal-dates__date">{d.date}</span>
                  <span className="deal-dates__label">{d.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Key contacts ── */}
      <div className="deal-page__contacts-section">
        <div className="deal-page__card deal-page__card--full">
          <div className="deal-page__card-header">
            <div className="deal-page__card-header-left">
              <div className="deal-page__card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h2 className="deal-page__section-title">Key contacts</h2>
            </div>
          </div>
          <div className="deal-page__divider" />

          <h3 className="deal-page__contacts-group-title">Counterparty</h3>
          <div className="deal-page__contacts-row">
            {deal.contacts.counterparty.map(c => <ContactCard key={c.name} contact={c} />)}
          </div>

          <div className="deal-page__divider" />

          <h3 className="deal-page__contacts-group-title">Deal team</h3>
          <div className="deal-page__contacts-row">
            {deal.contacts.dealTeam.map(c => <ContactCard key={c.name} contact={c} />)}
          </div>

          <div className="deal-page__divider" />

          <h3 className="deal-page__contacts-group-title">KYC team</h3>
          <div className="deal-page__contacts-row">
            {deal.contacts.kycTeam.map(c => <ContactCard key={c.name} contact={c} />)}
          </div>
        </div>
      </div>

    </main>
  )
}
