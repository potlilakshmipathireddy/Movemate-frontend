import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  FiGrid, FiMapPin, FiUsers, FiNavigation, FiCompass,
  FiMap, FiStar, FiBookmark, FiSettings, FiUser, FiLogOut, FiPlusCircle
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import './Sidebar.css'

const baseSidebarLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: FiGrid },
  { to: '/accommodation', label: 'Accommodation', icon: FiMapPin },
  { to: '/roommates', label: 'Roommates', icon: FiUsers },
  { to: '/travel', label: 'Travel Planner', icon: FiNavigation },
  { to: '/explore', label: 'Explore City', icon: FiCompass },
  { to: '/guides', label: 'Local Guides', icon: FiMap },
  { to: '/reviews', label: 'Reviews', icon: FiStar },
  { to: '/saved', label: 'Saved Places', icon: FiBookmark },
  { to: '/settings', label: 'Settings', icon: FiSettings },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  // Robust check to see if user is an owner regardless of how roles are structured
  const isOwner = 
    user?.roles === 'ROLE_OWNER' || 
    user?.role === 'ROLE_OWNER' || 
    (Array.isArray(user?.roles) && user.roles.includes('ROLE_OWNER')) ||
    (Array.isArray(user?.authorities) && user.authorities.some(a => a.authority === 'ROLE_OWNER'))

  const sidebarLinks = [
    ...baseSidebarLinks,
    ...(isOwner
      ? [{ to: '/accommodation/add', label: 'Add Accommodation', icon: FiPlusCircle }]
      : [])
  ]

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <aside className="mm-sidebar">
      <div className="sidebar-brand">
        <span className="brand-badge">M</span>
        <span className="brand-name">MOVEMATE</span>
      </div>

      <div className="sidebar-menu">
        <div className="menu-category">Main Menu</div>
        {sidebarLinks.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} className="link-icon" />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>

      <div className="sidebar-footer">
        <Link to="/profile" className="sidebar-link">
          <FiUser size={18} className="link-icon" />
          <span>Profile</span>
        </Link>
        <button onClick={handleLogout} className="sidebar-link logout-btn">
          <FiLogOut size={18} className="link-icon" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}