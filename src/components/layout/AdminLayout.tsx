import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import {
    Bell,
    BookOpenCheck,
    ChartNoAxesCombined,
    ChevronDown,
    ClipboardList,
    GraduationCap,
    LayoutDashboard,
    Menu,
    Search,
    Settings,
    Users,
    X,
} from 'lucide-react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { authApi } from '../../features/auth/services/auth-api'

const organizationNavigation = [
    { label: 'Dashboard', to: '/', icon: LayoutDashboard, end: true },
    { label: 'Training', to: '/training', icon: BookOpenCheck },
    { label: 'Programs', to: '/programs', icon: GraduationCap },
    { label: 'Employees', to: '/employees', icon: Users },
    { label: 'Exams', to: '/exams', icon: ClipboardList },
    { label: 'Reports', to: '/reports', icon: ChartNoAxesCombined },
    { label: 'Settings', to: '/settings', icon: Settings },
]

const platformNavigation = [
    { label: 'Platform Dashboard', to: '/platform', icon: LayoutDashboard, end: true },
    { label: 'Organizations', to: '/platform/organizations', icon: Users },
]

export function AdminLayout({ scope = 'organization' }: { scope?: 'organization' | 'platform' }) {
    const [menuOpen, setMenuOpen] = useState(false)
    const [notificationsOpen, setNotificationsOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const [globalSearch, setGlobalSearch] = useState('')
    const searchRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const navigation = scope === 'platform' ? platformNavigation : organizationNavigation

    useEffect(() => {
        function focusSearch(event: KeyboardEvent) {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault()
                searchRef.current?.focus()
            }
        }
        window.addEventListener('keydown', focusSearch)
        return () => window.removeEventListener('keydown', focusSearch)
    }, [])

    function submitGlobalSearch(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter' && globalSearch.trim()) {
            const target = scope === 'platform' ? '/platform/organizations' : '/programs'
            navigate(`${target}?search=${encodeURIComponent(globalSearch.trim())}`)
            setGlobalSearch('')
            searchRef.current?.blur()
        }
    }

    return (
        <div className="admin-layout">
            <aside className={`sidebar${menuOpen ? ' sidebar-open' : ''}`}>
                <Link className="brand-lockup" to={scope === 'platform' ? '/platform' : '/'} aria-label={scope === 'platform' ? 'Stackly platform dashboard' : 'Stackly dashboard'}>
                    <span className="brand-mark">S</span>
                    <span>{scope === 'platform' ? 'STACKLY PLATFORM' : 'STACKLY'}</span>
                </Link>
                <nav className="sidebar-nav" aria-label="Main navigation">
                    {navigation.map(({ label, to, icon: Icon, ...props }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={'end' in props ? props.end : false}
                            className={({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`}
                            onClick={() => setMenuOpen(false)}
                        >
                            <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>
            {menuOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
            <div className="admin-main">
                <header className="topbar">
                    <button className="icon-button mobile-menu-button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X size={19} /> : <Menu size={19} />}
                    </button>
                    <label className="global-search">
                        <Search size={15} aria-hidden="true" />
                        <input ref={searchRef} value={globalSearch} onChange={(event) => setGlobalSearch(event.target.value)} onKeyDown={submitGlobalSearch} aria-label="Search employees, programs, or learning plans" placeholder="Search employees, programs or learning plans..." />
                        <kbd>Ctrl K</kbd>
                    </label>
                    <div className="topbar-actions">
                        <button className="icon-button notification-button" aria-label="Notifications" aria-expanded={notificationsOpen} onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false) }}>
                            <Bell size={17} />
                            <span className="notification-dot" />
                        </button>
                        {notificationsOpen && <div className="topbar-popover notification-popover"><strong>Notifications</strong>{scope === 'platform' ? <><Link to="/platform/organizations?status=Pending" onClick={() => setNotificationsOpen(false)}>Pending organization approvals</Link><Link to="/platform" onClick={() => setNotificationsOpen(false)}>Recent platform activity</Link><Link to="/platform/organizations?status=Suspended" onClick={() => setNotificationsOpen(false)}>Suspended organizations</Link></> : <><Link to="/training" onClick={() => setNotificationsOpen(false)}>24 assignments need review</Link><Link to="/training" onClick={() => setNotificationsOpen(false)}>3 training sessions today</Link><Link to="/training" onClick={() => setNotificationsOpen(false)}>8 skill gap alerts</Link></>}</div>}
                        <button className="profile-menu" aria-label={scope === 'platform' ? 'Platform Super Admin account menu' : 'HR Admin account menu'} aria-expanded={profileOpen} onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false) }}>
                            <span className="avatar avatar-small">HR</span>
                            <span>{scope === 'platform' ? 'Platform Admin' : 'HR Admin'}</span>
                            <ChevronDown size={14} />
                        </button>
                        {profileOpen && <div className="topbar-popover profile-popover"><strong>{scope === 'platform' ? 'Platform Super Admin' : 'HR Administrator'}</strong><small>{scope === 'platform' ? 'platform.admin@stackly.com' : 'hr.admin@company.com'}</small><Link to={scope === 'platform' ? '/platform' : '/settings'} onClick={() => setProfileOpen(false)}>Account settings</Link><button className="link-button" type="button" onClick={async () => { setProfileOpen(false); await authApi.signOut(); queryClient.clear(); navigate('/login', { replace: true }) }}>Sign out</button></div>}
                    </div>
                </header>
                <main className="main-content"><Outlet /></main>
            </div>
        </div>
    )
}