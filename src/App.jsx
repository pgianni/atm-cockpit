import { useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import NotificationsPage from './components/NotificationsPage'
import MyApplicationsPage from './components/MyApplicationsPage'
import PortfolioPage from './components/PortfolioPage'
import SearchResultsPage from './components/SearchResultsPage'
import NotificationPanel from './components/NotificationPanel'
import DealPage from './components/DealPage'
import ClientsPage from './components/ClientsPage'
import SettingsPage from './components/SettingsPage'
import ControlsPage from './components/ControlsPage'
import './App.css'

const INITIAL_NOTIFICATIONS = [
  { id: 1, unread: true,  type: 'information', title: 'KYC approved: Northwind Mobility',             description: 'Compliance cleared the borrower onboarding package for Germany.',                        time: '12 min ago' },
  { id: 2, unread: true,  type: 'action',      title: 'Credit committee scheduled: Silverpath Infra', description: 'Committee memo locked for review on 2025-11-03 at 09:30 CET.',                          time: '38 min ago' },
  { id: 3, unread: true,  type: 'information', title: 'New document uploaded: BlueHarbor Grid',        description: 'Sponsor delivered the final term sheet markup and debt sizing note.',                    time: '1 hour ago' },
  { id: 4, unread: true,  type: 'action',      title: 'Condition precedent pending: Aster Data Parks', description: 'Insurance certificate still missing before first utilization can be released.',         time: '2 hours ago' },
  { id: 5, unread: false, type: 'action',      title: 'Covenant alert: Baltic Renewables HoldCo',      description: 'Projected DSCR moved below warning threshold in the latest monitoring pack.',            time: '3 hours ago' },
  { id: 6, unread: false, type: 'information', title: 'Signature completed: Meridian Logistics',        description: 'All financing documents were executed by borrower, sponsors and lenders.',               time: 'Yesterday' },
  { id: 7, unread: false, type: 'action',      title: 'Waiver request received: Orion Fiber',           description: 'Borrower requested an extension for the reporting deadline to 2025-11-07.',              time: 'Yesterday' },
  { id: 8, unread: false, type: 'information', title: 'Utilization booked: GreenPort Infrastructure',   description: 'First drawdown of 45 M EUR was posted and settlement was confirmed.',                   time: '2 days ago' },
]

function PageContent({ page, dealId, clientId, collapsed, searchQuery, onSearch, notifications, onToggle, onMarkAllRead, onNavigateDeal, onNavigatePortfolio, onNavigateClient, onNavigateHome, onNavigate, onBack, onSearchBarHidden }) {
  const style = { marginLeft: collapsed ? 64 : 226 }
  switch (page) {
    case 'notifs':       return <NotificationsPage  style={style} notifications={notifications} onToggle={onToggle} onMarkAllRead={onMarkAllRead} onNavigateHome={onNavigateHome} />
    case 'portfolio':    return <PortfolioPage      style={style} onNavigateDeal={onNavigateDeal} onNavigateClient={onNavigateClient} onNavigateHome={onNavigateHome} />
    case 'applications': return <MyApplicationsPage style={style} onNavigateHome={onNavigateHome} />
    case 'search':       return <SearchResultsPage  style={style} query={searchQuery} onSearch={onSearch} onNavigateDeal={onNavigateDeal} onNavigateHome={onNavigateHome} />
    case 'deal':         return <DealPage           style={style} dealId={dealId} onBack={onBack} onNavigateHome={onNavigateHome} onNavigateClient={onNavigateClient} />
    case 'clients':      return <ClientsPage        style={style} clientId={clientId} onBack={onBack} onNavigateHome={onNavigateHome} onNavigatePortfolio={onNavigatePortfolio} onNavigateDeal={onNavigateDeal} />
    case 'settings':     return <SettingsPage       style={style} onNavigateHome={onNavigateHome} />
    case 'controls':     return <ControlsPage       style={style} onNavigateHome={onNavigateHome} />
    default:             return <Dashboard           style={style} onSearch={onSearch} onNavigateDeal={onNavigateDeal} onNavigatePortfolio={onNavigatePortfolio} onNavigateClient={onNavigateClient} onNavigateApplications={() => onNavigate('applications')} onSearchBarHidden={onSearchBarHidden} />
  }
}

export default function App() {
  const [activePage,     setActivePage]     = useState('home')
  const [collapsed,      setCollapsed]      = useState(false)
  const [darkMode,       setDarkMode]       = useState(() => {
    const saved = localStorage.getItem('cockpit_dark')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const enabled = saved !== null ? saved === 'true' : prefersDark
    document.documentElement.classList.toggle('dark', enabled)
    return enabled
  })
  const [searchQuery,    setSearchQuery]    = useState('')
  const [notifOpen,      setNotifOpen]      = useState(false)
  const [notifications,  setNotifications]  = useState(INITIAL_NOTIFICATIONS)
  const [dealId,         setDealId]         = useState(null)
  const [prevPage,       setPrevPage]       = useState('home')
  const [clientId,       setClientId]       = useState(null)
  const [homeSearchHidden, setHomeSearchHidden] = useState(false)

  const unreadCount = notifications.filter(n => n.unread).length

  const toggleNotif   = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: !n.unread } : n))
  const markAllRead   = ()   => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))

  function handleSearch(query) {
    setSearchQuery(query)
    setActivePage('search')
  }

  function handleNavigateDeal(id) {
    setPrevPage(activePage)
    setDealId(id)
    setActivePage('deal')
  }

  function handleNavigatePortfolio() {
    setActivePage('portfolio')
  }

  function handleNavigateClient(id) {
    setPrevPage(activePage)
    setClientId(id)
    setActivePage('clients')
  }

  function handleBack() {
    setActivePage(prevPage)
  }

  function handleNavigateSettings() {
    setPrevPage(activePage)
    setActivePage('settings')
  }

  function handleToggleDark() {
    setDarkMode(prev => {
      const next = !prev
      document.documentElement.classList.toggle('dark', next)
      localStorage.setItem('cockpit_dark', String(next))
      return next
    })
  }

  return (
    <div className="app">
      <Header
        onSearch={handleSearch}
        showSearch={activePage !== 'home' || homeSearchHidden}
        searchQuery={searchQuery}
        onNotifClick={() => setNotifOpen(o => !o)}
        unreadCount={unreadCount}
        darkMode={darkMode}
        onToggleDark={handleToggleDark}
        onNavigateSettings={handleNavigateSettings}
      />
      <NotificationPanel
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        onNavigateNotifs={() => setActivePage('notifs')}
        notifications={notifications.filter(n => n.unread)}
      />
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        collapsed={collapsed}
        onCollapse={() => setCollapsed(c => !c)}
        unreadCount={unreadCount}
      />
      <div key={activePage} className="page-transition">
        <PageContent
          page={activePage}
          dealId={dealId}
          clientId={clientId}
          collapsed={collapsed}
          searchQuery={searchQuery}
          onSearch={handleSearch}
          notifications={notifications}
          onToggle={toggleNotif}
          onMarkAllRead={markAllRead}
          onNavigateDeal={handleNavigateDeal}
          onNavigatePortfolio={handleNavigatePortfolio}
          onNavigateClient={handleNavigateClient}
          onNavigateHome={() => setActivePage('home')}
          onNavigate={setActivePage}
          onBack={handleBack}
          onSearchBarHidden={setHomeSearchHidden}
        />
      </div>
    </div>
  )
}
