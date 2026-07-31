import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  FiGrid, FiUser, FiLogOut
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import './Sidebar.css'

const ownerSidebarLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: FiGrid },
]

export default function OwnerSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <aside className="mm-sidebar">
      <div className="sidebar-brand">
        <span className="brand-badge" style={{ background: '#FF9F43' }}>M</span>
        <span className="brand-name">MOVEMATE <span style={{ fontSize: '0.6rem', color: '#FF9F43', display: 'block' }}>Owner Portal</span></span>
      </div>

      <div className="sidebar-menu">
        <div className="menu-category">Owner Menu</div>
        {ownerSidebarLinks.map(({ to, label, icon: Icon }) => {
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