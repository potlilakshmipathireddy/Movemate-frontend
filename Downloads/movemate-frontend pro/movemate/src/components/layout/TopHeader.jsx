import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiSearch, FiBell, FiUser, FiSettings, FiLogOut, FiChevronDown } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import './TopHeader.css'

export default function TopHeader() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const profileRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchVal.trim()) {
      navigate(`/accommodation?search=${encodeURIComponent(searchVal.trim())}`)
      setSearchVal('')
    }
  }

  const initial = user?.name?.[0]?.toUpperCase() || 'U'

  return (
    <header className="mm-top-header">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="top-search-form">
        <FiSearch size={16} className="search-icon" />
        <input
          type="text"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="Search accommodations, cities..."
          className="top-search-input"
        />
      </form>

      {/* Right Actions: Notification & Profile */}
      <div className="top-header-actions">
        {/* Notification Icon */}
        <button className="top-action-btn" title="Notifications">
          <FiBell size={18} />
          <span className="notification-badge"></span>
        </button>

        {/* Profile Dropdown */}
        <div ref={profileRef} className="top-profile-wrap">
          <button onClick={() => setProfileOpen(!profileOpen)} className="top-profile-trigger">
            <div className="top-avatar">{initial}</div>
            <span className="top-username">{user?.name || 'User'}</span>
            <FiChevronDown size={14} className={`chevron ${profileOpen ? 'open' : ''}`} />
          </button>

          {profileOpen && (
            <div className="top-profile-dropdown">
              <div className="dropdown-user-info">
                <div className="dropdown-name">{user?.name}</div>
                <div className="dropdown-email">{user?.email}</div>
              </div>
              <div className="dropdown-divider"></div>
              <Link to="/profile" className="dropdown-link" onClick={() => setProfileOpen(false)}>
                <FiUser size={15} /> Profile
              </Link>
              <Link to="/settings" className="dropdown-link" onClick={() => setProfileOpen(false)}>
                <FiSettings size={15} /> Settings
              </Link>
              <div className="dropdown-divider"></div>
              <button onClick={handleLogout} className="dropdown-link logout">
                <FiLogOut size={15} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}