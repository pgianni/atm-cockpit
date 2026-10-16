import { useEffect, useState } from 'react'
import { ChevronDown, ChevronRight, Download, ExternalLink, Calendar, ShieldCheck, Box, ArrowRight, FolderOpen, Eye } from 'lucide-react'
import iconDeal     from '../assets/icon-deal.svg'
import iconContract from '../assets/icon-contract.svg'
import iconTranche  from '../assets/icon-tranche.svg'
import { CELL, ROW, PRIMARY_BTN, TABLE_WRAP, TABLE, TH, SortableTh, SearchRow, TableFooter } from './DataTable'

const LEVEL_ICON = [iconDeal, iconContract, iconTranche]

/* ── Shared class fragments ──────────────────────────────────────── */
const CARD        = 'flex flex-col gap-4 rounded-2xl border border-[#e1e6e8] bg-surface p-4 md:p-5'
const CARD_DIV    = '-mx-4 h-px bg-[#e1e6e8] md:-mx-5'
const SECTION_T   = 'm-0 text-lg font-bold leading-[1.3] text-major'
const SECTION_SUB = '-mt-2 mb-0 text-xs leading-[1.4] text-minor'
const SEE_MORE    = 'cursor-pointer p-0 text-sm font-semibold text-primary underline hover:opacity-75'
const BTN_OUTLINE = 'flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded border border-white/55 bg-transparent px-3.5 text-sm font-semibold text-white transition-[background-color,border-color] duration-150 hover:border-white/80 hover:bg-white/15'
const CARD_ICON   = 'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'
const CLIENT_LBL  = 'text-[11px] font-semibold uppercase tracking-[0.4px] text-minor'
const CLIENT_VAL  = 'text-[13px] font-bold leading-[1.4] text-major'
const CLIENT_SUB  = 'text-[11px] text-minor'
const CLIENT_LNK  = 'mt-px inline-flex items-center gap-[3px] text-[11px] text-primary underline hover:opacity-75'
const TREE_ROW    = 'flex items-stretch'
const TREE_BODY   = 'flex flex-1 cursor-pointer items-center gap-2.5 rounded px-2.5 py-1 transition-colors duration-100 hover:bg-primary/[0.06]'
const TREE_NAME   = 'overflow-hidden text-ellipsis whitespace-nowrap text-xs font-semibold text-major md:text-[13px]'
const TREE_CODE   = 'whitespace-nowrap text-[11px] text-minor'

/* Tree guide columns: a vertical rule for ancestors that still have
   siblings below, and an L-shaped branch into the current row's icon. */
const GUIDE_BASE = 'relative w-[30px] shrink-0 self-stretch'
const GUIDE_LINE = "before:absolute before:left-[19.5px] before:top-0 before:bottom-0 before:w-px before:bg-[#d0d5d8] before:content-['']"
const GUIDE_BRANCH =
  "before:absolute before:left-[19.5px] before:top-0 before:bottom-1/2 before:w-px before:bg-[#d0d5d8] before:content-[''] " +
  "after:absolute after:left-5 after:right-0 after:top-1/2 after:h-px after:-translate-y-[0.5px] after:bg-[#d0d5d8] after:content-['']"
const GUIDE_CONTINUES = 'before:bottom-0'

function guideClass(level, col, hasMore) {
  const isBranch = col === level - 1
  if (isBranch) return [GUIDE_BASE, GUIDE_BRANCH, hasMore ? GUIDE_CONTINUES : ''].join(' ')
  return [GUIDE_BASE, hasMore ? GUIDE_LINE : ''].join(' ')
}


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
      {
        icon: Calendar, label: 'Covenant', count: 8,
        items: [
          { id: 'cv1', name: 'DSCR Test',              type: 'Financial',     covenantId: 'CVT-00004441', status: 'Effective'  },
          { id: 'cv2', name: 'LTV Ratio',               type: 'Financial',     covenantId: 'CVT-00004442', status: 'Effective'  },
          { id: 'cv3', name: 'Insurance Renewal',       type: 'Informational', covenantId: 'CVT-00004443', status: 'Effective'  },
          { id: 'cv4', name: 'Minimum Liquidity',       type: 'Financial',     covenantId: 'CVT-00004444', status: 'Effective'  },
          { id: 'cv5', name: 'Debt Service Coverage',   type: 'Financial',     covenantId: 'CVT-00004445', status: 'Draft'      },
          { id: 'cv6', name: 'Environmental Report',    type: 'Informational', covenantId: 'CVT-00004446', status: 'Effective'  },
          { id: 'cv7', name: 'Security Package Review', type: 'Informational', covenantId: 'CVT-00004447', status: 'Terminated' },
          { id: 'cv8', name: 'Operating Budget',        type: 'Financial',     covenantId: 'CVT-00004448', status: 'Effective'  },
        ],
      },
      {
        icon: ShieldCheck, label: 'Mitigant', count: 3,
        items: [
          { id: 'mg1', name: 'First Ranking Mortgage',  type: 'Real Estate',  value: '120 M EUR', mitigantId: 'MMT-00001371', status: 'Confirmed' },
          { id: 'mg2', name: 'Share Pledge – SPV',      type: 'Share Pledge', value: '150 M EUR', mitigantId: 'MMT-00001372', status: 'Confirmed' },
          { id: 'mg3', name: 'Revenue Account Pledge',  type: 'Account',      value: '15 M EUR',  mitigantId: 'MMT-00001373', status: 'Draft'     },
        ],
      },
      {
        icon: Box, label: 'Assets', count: 5,
        items: [
          { id: 'as1', name: 'Silverpath Solar Farm A',   type: 'Solar', assetId: 'AST-00000001', status: 'Financed and pledged' },
          { id: 'as2', name: 'Silverpath Solar Farm B',   type: 'Solar', assetId: 'AST-00000002', status: 'Financed and pledged' },
          { id: 'as3', name: 'Wind Turbine Cluster Nord', type: 'Wind',  assetId: 'AST-00000003', status: 'Financed and pledged' },
          { id: 'as4', name: 'Grid Connection Equipment', type: 'Infra', assetId: 'AST-00000004', status: 'Financed and pledged' },
          { id: 'as5', name: 'Land Lease Portfolio',      type: 'Land',  assetId: 'AST-00000005', status: 'Financed and pledged' },
        ],
      },
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
    documents: [
      { name: 'SPI_2025_FacilityAgreement_v4...', type: 'Facility agreement', owner: 'P. Jackson',    updated: '2025-10-28' },
      { name: 'SPI_2025_TermSheet_Final...',       type: 'Term sheet',        owner: 'A. Chase',      updated: '2025-10-15' },
      { name: 'SPI_2025_CreditCommitteeMemo...',   type: 'Credit committee',  owner: 'C. Beckendorf', updated: '2025-10-03' },
      { name: 'SPI_2025_InsuranceCertificate...',  type: 'Insurance',         owner: 'G. Underwood',  updated: '2025-09-18' },
      { name: 'SPI_2025_SecurityPackage...',        type: 'Security package',  owner: 'P. Jackson',    updated: '2025-09-05' },
    ],
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
      {
        icon: Calendar, label: 'Covenant', count: 5,
        items: [
          { id: 'cv1', name: 'DSCR Test',            type: 'Financial',     covenantId: 'CVT-00004449', status: 'Effective' },
          { id: 'cv2', name: 'Insurance Renewal',     type: 'Informational', covenantId: 'CVT-00004450', status: 'Effective' },
          { id: 'cv3', name: 'Debt Service Coverage', type: 'Financial',     covenantId: 'CVT-00004451', status: 'Effective' },
          { id: 'cv4', name: 'Operating Budget',      type: 'Financial',     covenantId: 'CVT-00004452', status: 'Draft'     },
          { id: 'cv5', name: 'Environmental Report',  type: 'Informational', covenantId: 'CVT-00004453', status: 'Effective' },
        ],
      },
      {
        icon: ShieldCheck, label: 'Mitigant', count: 2,
        items: [
          { id: 'mg1', name: 'First Ranking Mortgage', type: 'Real Estate', value: '60 M EUR', mitigantId: 'MMT-00001374', status: 'Confirmed' },
          { id: 'mg2', name: 'Revenue Account Pledge', type: 'Account',     value: '8 M EUR',  mitigantId: 'MMT-00001375', status: 'Confirmed' },
        ],
      },
      {
        icon: Box, label: 'Assets', count: 3,
        items: [
          { id: 'as1', name: 'Helios Solar Park I',  type: 'Solar', assetId: 'AST-00000006', status: 'Financed and pledged' },
          { id: 'as2', name: 'Helios Solar Park II', type: 'Solar', assetId: 'AST-00000007', status: 'Financed and pledged' },
          { id: 'as3', name: 'Grid Infrastructure',  type: 'Infra', assetId: 'AST-00000008', status: 'Financed and pledged' },
        ],
      },
    ],
    documents: [
      { name: 'EP_2025_RefinancingAgreement_v2...', type: 'Facility agreement', owner: 'S. Ramos',   updated: '2025-11-01' },
      { name: 'EP_2025_TermSheet_Final...',          type: 'Term sheet',        owner: 'K. Lambert',  updated: '2025-10-20' },
      { name: 'EP_2025_BOM_Committee...',            type: 'BOM',               owner: 'S. Ramos',   updated: '2025-10-08' },
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

// Filled badges: bg + text color
const STATUS_COLOR = {
  'Pre-closing':          { bg: '#176ec4', text: '#fff'    },
  'Legal doc draft':      { bg: '#176ec4', text: '#fff'    },
  'Draft':                { bg: '#176ec4', text: '#fff'    },
  'Effective':            { bg: '#14851d', text: '#fff'    },
  'Signed':               { bg: '#14851d', text: '#fff'    },
  'Confirmed':            { bg: '#14851d', text: '#fff'    },
  'Financed and pledged': { bg: '#14851d', text: '#fff'    },
  'Terminated':           { bg: '#176ec4', text: '#fff'    },
  'Not effective anymore':{ bg: '#ee9d2b', text: '#262a2d' },
  'Matured':              { bg: '#ee9d2b', text: '#262a2d' },
  'Archived':             { bg: '#e7e9ea', text: '#262a2d' },
  'Cancelled':            { bg: '#e7e9ea', text: '#262a2d' },
  'Default':              { bg: '#5e6a71', text: '#fff'    },
}

const TREE_BADGE = 'inline-flex h-[18px] items-center whitespace-nowrap rounded-full px-2 text-[10px] font-semibold tracking-[0.3px] text-white'

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

function TreeToggle({ collapsed, onClick }) {
  return (
    <button
      className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded text-minor transition-colors duration-100 hover:bg-black/[0.06] hover:text-major"
      onClick={onClick}
      aria-label={collapsed ? 'Expand' : 'Collapse'}
    >
      <ChevronDown
        size={13}
        strokeWidth={2}
        className={`transition-transform duration-200 ${collapsed ? '-rotate-90' : ''}`}
      />
    </button>
  )
}

/* ── Tree row ────────────────────────────────────────────────────── */
function TreeRow({ node, index, structure, hasChildren, isCollapsed, onToggle }) {
  const level = node.level
  const status = STATUS_COLOR[node.status] || STATUS_COLOR['Default']
  const guides = Array.from({ length: level }, (_, col) => hasGuideAt(structure, index, col))

  return (
    <div className={TREE_ROW}>
      {guides.map((hasMore, col) => (
        <div key={col} className={guideClass(level, col, hasMore)} />
      ))}

      <div className={TREE_BODY}>
        {hasChildren
          ? <TreeToggle collapsed={isCollapsed} onClick={onToggle} />
          : <span className="w-[18px] shrink-0" />}
        <div className="flex h-6 w-6 shrink-0 items-center justify-center">
          <img src={LEVEL_ICON[level] ?? LEVEL_ICON[2]} alt="" className="h-[22px] w-auto" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
          <span className={TREE_NAME}>{node.name}</span>
          <div className="flex items-center gap-2">
            <span className={TREE_BADGE} style={{ background: status.bg, color: status.text }}>{node.status}</span>
            <span className={TREE_CODE}>{node.code}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Linked objects tree (same guide-line pattern as Deal Structure) ── */
function LinkedObjectTree({ objects }) {
  // Build flat node list: level-0 = category, level-1 = item
  const allNodes = []
  const catIds = objects.map(o => `cat-${o.label}`)
  for (const obj of objects) {
    const catId = `cat-${obj.label}`
    allNodes.push({ id: catId, level: 0, nodeType: 'category', label: obj.label, count: obj.count, Icon: obj.icon })
    for (const item of obj.items) {
      allNodes.push({ id: item.id, level: 1, nodeType: 'item', name: item.name, itemType: item.type, value: item.value, assetId: item.assetId, covenantId: item.covenantId, mitigantId: item.mitigantId, status: item.status })
    }
  }

  // Start with all categories expanded
  const [collapsed, setCollapsed] = useState(() => new Set())
  const allExpanded = catIds.every(id => !collapsed.has(id))

  function toggle(id) {
    setCollapsed(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleAll() {
    setCollapsed(allExpanded ? new Set(catIds) : new Set())
  }

  const visibleIndices = getVisibleIndices(allNodes, collapsed)

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className={SECTION_T}>Linked objects</h2>
        <button className={SEE_MORE} onClick={toggleAll}>
          {allExpanded ? 'Collapse all' : 'Expand all'}
        </button>
      </div>
      <div className="flex flex-col">
        {visibleIndices.map(i => {
          const node = allNodes[i]
          const hasChildren = allNodes[i + 1]?.level > node.level
          const isCollapsed = collapsed.has(node.id)
          const guides = Array.from({ length: node.level }, (_, col) => hasGuideAt(allNodes, i, col))

          return (
            <div key={node.id} className={TREE_ROW}>
              {guides.map((hasMore, col) => (
                <div key={col} className={guideClass(node.level, col, hasMore)} />
              ))}

              <div
                className={`${TREE_BODY} ${hasChildren ? 'cursor-pointer' : 'cursor-default'}`}
                onClick={() => hasChildren && toggle(node.id)}
              >
                {hasChildren
                  ? <TreeToggle collapsed={isCollapsed} onClick={e => { e.stopPropagation(); toggle(node.id) }} />
                  : <span className="w-[18px] shrink-0" />}

                {node.nodeType === 'category' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center text-primary">
                    <node.Icon size={22} strokeWidth={1.5} />
                  </div>
                )}

                <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                  {node.nodeType === 'category' ? (
                    <div className="flex items-center gap-2">
                      <span className={TREE_NAME}>{node.label}</span>
                      <span className="shrink-0 rounded-full bg-line px-[7px] py-px text-[11px] font-semibold leading-[18px] text-minor">
                        {node.count}
                      </span>
                    </div>
                  ) : (
                    <>
                      <span className={TREE_NAME}>{node.name}</span>
                      <div className="flex items-center gap-2">
                        {node.status && (() => {
                          const s = STATUS_COLOR[node.status] || STATUS_COLOR['Default']
                          return (
                            <span className={TREE_BADGE} style={{ background: s.bg, color: s.text }}>
                              {node.status}
                            </span>
                          )
                        })()}
                        {node.covenantId && <span className={TREE_CODE}>{node.covenantId}</span>}
                        {node.mitigantId && <span className={TREE_CODE}>{node.mitigantId}</span>}
                        {node.assetId && <span className={TREE_CODE}>{node.assetId}</span>}
                        {node.itemType && <span className={TREE_CODE}>{node.itemType}</span>}
                        {node.value && <span className={TREE_CODE}>{node.value}</span>}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

/* ── Contact card ─────────────────────────────────────────────────── */
function ContactCard({ contact }) {
  return (
    <div className="flex min-w-[130px] flex-col items-center gap-[5px] rounded-lg bg-[#f7f9f9] px-4 py-3.5 text-center">
      <div
        className="mb-1 flex h-[42px] w-[42px] items-center justify-center rounded-full text-sm font-bold text-white"
        style={{ background: contact.color }}
      >
        {contact.initials}
      </div>
      <p className="m-0 whitespace-nowrap text-[13px] font-semibold text-major">{contact.name}</p>
      <p className="m-0 text-[11px] text-minor">{contact.role}</p>
      <div className="mt-1 flex flex-col gap-0.5">
        <a className="text-[11px] text-primary underline hover:opacity-75" href="#">Chat on Teams</a>
        <a className="text-[11px] text-primary underline hover:opacity-75" href="#">Send an email</a>
      </div>
    </div>
  )
}

/* ── Main page ───────────────────────────────────────────────────── */
export default function DealPage({ offsetClass = '', dealId = 1, onBack, onNavigateHome, onNavigateClient }) {
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
  const crumb = 'cursor-pointer whitespace-nowrap p-0 text-base font-semibold text-reverse underline hover:opacity-80'

  return (
    <main className={`mt-16 min-h-[calc(100vh-64px)] bg-page transition-[margin-left] duration-200 ease-out ${offsetClass}`}>

      {/* Breadcrumb */}
      <div className="flex h-10 items-center bg-[linear-gradient(90deg,#005740_0%,#007d57_60%,#009a6a_100%)] px-4 md:px-8">
        <nav className="flex items-center gap-0.5 overflow-x-auto" aria-label="Breadcrumb">
          <button className={crumb} onClick={() => onNavigateHome?.()}>Home</button>
          <ChevronRight size={16} strokeWidth={1.5} className="shrink-0 text-reverse" />
          <button className={crumb} onClick={onBack}>Portfolio</button>
          <ChevronRight size={16} strokeWidth={1.5} className="shrink-0 text-reverse" />
          <button className={crumb} onClick={() => onNavigateClient?.(deal.client.cpyId)}>
            {deal.client.cpyName}
          </button>
          <ChevronRight size={16} strokeWidth={1.5} className="shrink-0 text-reverse" />
          <span className="whitespace-nowrap text-base font-semibold text-reverse">{deal.name}</span>
        </nav>
      </div>

      {/* ── Hero ── */}
      <div className="bg-[linear-gradient(135deg,#005740_0%,#007d57_50%,#009a6a_100%)] px-4 pb-7 pt-5 md:px-10 md:pb-10 md:pt-8">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-7">

          {/* Header row */}
          <div className="flex items-start gap-3 md:gap-6">
            {/* Illustration */}
            <div className="flex h-[72px] w-12 shrink-0 items-center justify-center md:h-[112px] md:w-[74px]" aria-hidden="true">
              <svg viewBox="0 0 74 112" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
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
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div className="flex flex-col items-start justify-between gap-2.5 md:flex-row md:gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex gap-1.5">
                    <span className="inline-flex h-[22px] items-center rounded-full bg-white/20 px-2.5 text-[11px] font-semibold uppercase tracking-[0.5px] text-white/90">
                      {deal.currency}
                    </span>
                  </div>
                  <h1 className="text-lg font-bold leading-[1.25] text-white md:text-[22px]">{deal.name}</h1>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2 md:gap-2.5">
                  <button className={BTN_OUTLINE}>
                    <Download size={18} strokeWidth={1.5} />
                    Export to excel
                  </button>
                  <button className={BTN_OUTLINE}>
                    Open in Glass
                    <ArrowRight size={18} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-white/75">
                <span><span className="font-normal">STI1: </span><strong className="font-semibold text-white/95">{deal.sti}</strong></span>
                <span><span className="font-normal">Booking entities: </span><strong className="font-semibold text-white/95">{deal.bookingEntities}</strong></span>
                <span><span className="font-normal">Product line: </span><strong className="font-semibold text-white/95">{deal.productLine}</strong></span>
              </div>
            </div>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {deal.metrics.map(m => (
              <div key={m.label} className="flex flex-col gap-1 rounded-lg bg-white/[0.12] px-3.5 py-3">
                <span className="text-[11px] font-semibold uppercase leading-[1.3] tracking-[0.4px] text-white/65">{m.label}</span>
                <span className="text-[15px] font-bold leading-[1.3] text-white">{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-4 p-4 md:grid-cols-2 md:gap-5 md:px-10 md:py-8">

        {/* Left column */}
        <div className="flex flex-col gap-4 md:gap-5">

          {/* Deal Structure */}
          <div className={CARD}>
            <h2 className={SECTION_T}>Deal Structure</h2>
            <div className="flex flex-col">
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
          <div className={CARD}>
            <LinkedObjectTree objects={deal.linkedObjects} />
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4 md:gap-5">

          {/* Client */}
          <div className={CARD}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={CARD_ICON}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
                  </svg>
                </div>
                <h2 className={SECTION_T}>Client</h2>
              </div>
              <button className={SEE_MORE} onClick={() => onNavigateClient?.(deal.client.cpyId)}>See more</button>
            </div>
            <div className={CARD_DIV} />
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="flex flex-col gap-0.5">
                <span className={CLIENT_LBL}>CPY name</span>
                <span className={CLIENT_VAL}>{deal.client.cpyName}</span>
                <span className={CLIENT_SUB}>ID: {deal.client.cpyId}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className={CLIENT_LBL}>CPH name</span>
                <span className={CLIENT_VAL}>{deal.client.cphName}</span>
                <span className={CLIENT_SUB}>ID: {deal.client.cphId}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className={CLIENT_LBL}>Internal rating</span>
                <span className={CLIENT_VAL}>{deal.client.internalRating}</span>
                <span className={CLIENT_SUB}>Last review: {deal.client.lastReview}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className={CLIENT_LBL}>KYC</span>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-[#14851d]" />
                  <span className={CLIENT_VAL}>{deal.client.kyc}</span>
                </div>
                <a className={CLIENT_LNK} href="#">Open in Kiwis <ExternalLink size={12} strokeWidth={1.5} /></a>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className={CLIENT_LBL}>Sub client name</span>
                <span className={CLIENT_VAL}>{deal.client.subClient}</span>
                <span className={CLIENT_SUB}>ID: {deal.client.subClientId}</span>
                <a className={CLIENT_LNK} href="#">Open in ClientLive <ExternalLink size={12} strokeWidth={1.5} /></a>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className={CLIENT_LBL}>Root client name</span>
                <span className={CLIENT_VAL}>{deal.client.rootClient}</span>
                <span className={CLIENT_SUB}>ID: {deal.client.rootClientId}</span>
                <a className={CLIENT_LNK} href="#">Open in ClientLive <ExternalLink size={12} strokeWidth={1.5} /></a>
              </div>
            </div>
          </div>

          {/* Recent activity */}
          <div className={CARD}>
            <h2 className={SECTION_T}>Recent activity</h2>
            <p className={SECTION_SUB}>Latest events across execution and monitoring.</p>
            <div className="flex flex-col">
              {deal.activity.map((item, i) => (
                <div key={i} className="grid grid-cols-[80px_1fr] items-start gap-3 py-2">
                  <span className="whitespace-nowrap pt-px text-[11px] font-semibold text-minor">{item.date}</span>
                  <span className="text-[13px] leading-[1.4] text-major">{item.event}</span>
                  {i < deal.activity.length - 1 && <div className="col-span-full h-px bg-[#f0f2f3]" />}
                </div>
              ))}
            </div>
          </div>

          {/* Key dates */}
          <div className={CARD}>
            <h2 className={SECTION_T}>Key dates</h2>
            <p className={SECTION_SUB}>Upcoming milestones for this transaction.</p>
            <div className="flex flex-col gap-2.5">
              {deal.keyDates.map((d, i) => (
                <div key={i} className="flex items-center gap-3 rounded border-l-[3px] border-l-primary bg-[#f7f9f9] px-3 py-2.5">
                  <span className="min-w-[90px] whitespace-nowrap text-xs font-bold text-primary">{d.date}</span>
                  <span className="text-[13px] leading-[1.3] text-major">{d.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Documents ── */}
      <div className="mx-auto max-w-[1200px] px-4 pb-10 md:px-10">
        <div className={`${CARD} w-full`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={CARD_ICON}>
                <FolderOpen size={20} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className={SECTION_T}>Documents</h2>
                <p className="mb-0 mt-0.5 text-xs text-minor [&_a]:text-primary [&_a]:no-underline hover:[&_a]:underline">
                  Last updated today at 12:33 · Source: <a href="#" onClick={e => e.preventDefault()}>DMS</a>
                </p>
              </div>
            </div>
            <button className={`${BTN_OUTLINE} h-[30px] gap-1.5 border-line px-3 text-xs text-primary hover:bg-primary-subtle`}>
              <Download size={14} strokeWidth={1.5} />
              Export
            </button>
          </div>
          <div className={CARD_DIV} />
          <div className={TABLE_WRAP}>
            <table className={TABLE}>
              <thead>
                <tr>
                  <SortableTh>Document name</SortableTh>
                  <SortableTh>Document type</SortableTh>
                  <SortableTh>Owner</SortableTh>
                  <SortableTh>Last update</SortableTh>
                  <th className={TH} style={{ width: 72 }} />
                </tr>
                <SearchRow cols={[1, 2, 3, 4, 5]} />
              </thead>
              <tbody>
                {deal.documents.map((doc, idx) => (
                  <tr key={idx} className={ROW}>
                    <td className={CELL}>{doc.name}</td>
                    <td className={CELL}>{doc.type}</td>
                    <td className={CELL}>{doc.owner}</td>
                    <td className={CELL}>{doc.updated}</td>
                    <td className={`${CELL} w-[72px] text-right text-minor [&_svg]:ml-2 [&_svg]:inline [&_svg]:cursor-pointer hover:[&_svg]:text-primary`}>
                      <Eye size={14} strokeWidth={1.75} />
                      <Download size={14} strokeWidth={1.75} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <TableFooter><span>Rows: {deal.documents.length}</span></TableFooter>
          </div>
          <button className={PRIMARY_BTN}>
            <FolderOpen size={14} strokeWidth={2} />
            Explore repository
          </button>
        </div>
      </div>

      {/* ── Key contacts ── */}
      <div className="mx-auto max-w-[1200px] px-4 pb-10 md:px-10">
        <div className={`${CARD} w-full`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={CARD_ICON}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h2 className={SECTION_T}>Key contacts</h2>
            </div>
          </div>
          <div className={CARD_DIV} />

          <h3 className="m-0 text-xs font-semibold uppercase tracking-[0.5px] text-minor">Counterparty</h3>
          <div className="flex flex-wrap gap-4">
            {deal.contacts.counterparty.map(c => <ContactCard key={c.name} contact={c} />)}
          </div>

          <div className={CARD_DIV} />

          <h3 className="m-0 text-xs font-semibold uppercase tracking-[0.5px] text-minor">Deal team</h3>
          <div className="flex flex-wrap gap-4">
            {deal.contacts.dealTeam.map(c => <ContactCard key={c.name} contact={c} />)}
          </div>

          <div className={CARD_DIV} />

          <h3 className="m-0 text-xs font-semibold uppercase tracking-[0.5px] text-minor">KYC team</h3>
          <div className="flex flex-wrap gap-4">
            {deal.contacts.kycTeam.map(c => <ContactCard key={c.name} contact={c} />)}
          </div>
        </div>
      </div>

    </main>
  )
}
