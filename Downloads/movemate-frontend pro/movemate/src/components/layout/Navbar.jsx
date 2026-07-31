import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiHome, FiGrid, FiMapPin, FiUsers, FiNavigation, FiCompass,
  FiMap, FiStar, FiBookmark, FiSettings, FiUser, FiLogIn,
  FiLogOut, FiBell, FiSearch, FiMenu, FiX, FiChevronDown, FiShield, FiPlus
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import './Navbar.css'

const navLinks = [
  { to: '/', label: 'Home', icon: FiHome, auth: true },
  { to: '/dashboard', label: 'Dashboard', icon: FiGrid, auth: true },
  { to: '/accommodation', label: 'Accommodation', icon: FiMapPin, auth: true },
  { to: '/roommates', label: 'Roommates', icon: FiUsers, auth: true },
  { to: '/travel', label: 'Travel', icon: FiNavigation, auth: true },
  { to: '/explore', label: 'Explore', icon: FiCompass, auth: true },
  { to: '/guides', label: 'Guides', icon: FiMap, auth: true },
  { to: '/reviews', label: 'Reviews', icon: FiStar, auth: true },
  { to: '/saved', label: 'Saved', icon: FiBookmark, auth: true },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const { user, isAuthenticated, isOwner, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const profileRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false); setProfileOpen(false) }, [location])

  useEffect(() => {
    const handler = (e) => { if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false) }
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
      setSearchOpen(false)
      setSearchVal('')
    }
  }

  const initial = user?.name?.[0]?.toUpperCase() || 'U'

  return (
    <motion.nav
      className={`mm-navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">M</span>
          <span className="brand-text">MOVEMATE</span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar-links">
          {navLinks.filter(l => !l.auth || isAuthenticated).map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link ${location.pathname === to ? 'active' : ''}`}
            >
              <Icon size={14} />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="navbar-actions">
          {/* Search */}
          <button className="icon-btn" onClick={() => setSearchOpen(!searchOpen)} title="Search">
            <FiSearch size={18} />
          </button>

          {isAuthenticated ? (
            <>
              <Link to="/settings" className="icon-btn" title="Settings">
                <FiSettings size={18} />
              </Link>

              {/* Profile dropdown */}
              <div ref={profileRef} className="profile-dropdown-wrap">
                <button className="avatar-btn" onClick={() => setProfileOpen(!profileOpen)}>
                  <div className="mm-avatar" style={{ width: 36, height: 36, fontSize: '0.9rem' }}>{initial}</div>
                  <FiChevronDown size={14} className={`chevron ${profileOpen ? 'open' : ''}`} />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      className="profile-dropdown"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="dropdown-header">
                        <div className="mm-avatar" style={{ width: 44, height: 44 }}>{initial}</div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user?.name}</span>
                            {isOwner && <span style={{ fontSize: '0.6rem', background: 'rgba(255,159,67,0.15)', color: '#FF9F43', padding: '1px 6px', borderRadius: 8, fontWeight: 700 }}>Owner</span>}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</div>
                        </div>
                      </div>
                      <hr className="mm-divider" />
                      
                      {/* Conditional Owner Dropdown Links */}
                      {isOwner && (
                        <>
                          <div style={{ padding: '4px 12px', fontSize: '0.7rem', textTransform: 'uppercase', color: '#FF9F43', fontWeight: 700, letterSpacing: '0.5px' }}>
                            Host Tools
                          </div>
                          <Link to="/accommodation/my" className="dropdown-item" style={{ color: '#FF9F43' }}>
                            <FiHome size={15} /> My Rooms & Listings
                          </Link>
                          <Link to="/accommodation/add" className="dropdown-item">
                            <FiPlus size={15} /> Add Property
                          </Link>
                          <hr className="mm-divider" />
                        </>
                      )}

                      <Link to="/profile" className="dropdown-item"><FiUser size={15} /> Profile</Link>
                      <Link to="/account" className="dropdown-item"><FiUser size={15} /> Account</Link>
                      <Link to="/settings" className="dropdown-item"><FiSettings size={15} /> Settings</Link>
                      <Link to="/saved" className="dropdown-item"><FiBookmark size={15} /> Saved Places</Link>
                      <hr className="mm-divider" />
                      <button className="dropdown-item danger" onClick={handleLogout}>
                        <FiLogOut size={15} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: 10 }}>
              <Link to="/login" className="btn-ghost-mm" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                <FiLogIn size={14} /> Login
              </Link>
              <Link to="/register" className="btn-primary-mm" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                Register
              </Link>
            </div>
          )}

          {/* Hamburger */}
          <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Search bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="search-bar-container"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <form onSubmit={handleSearch} className="search-form">
              <FiSearch size={18} />
              <input
                autoFocus
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search accommodations, cities, areas..."
                className="search-input"
              />
              <button type="submit" className="btn-primary-mm" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                Search
              </button>
              <button type="button" className="icon-btn" onClick={() => setSearchOpen(false)}>
                <FiX size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            {navLinks.filter(l => !l.auth || isAuthenticated).map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} className={`mobile-nav-link ${location.pathname === to ? 'active' : ''}`}>
                <Icon size={16} /> {label}
              </Link>
            ))}
            <hr className="mm-divider" />
            
            {isAuthenticated ? (
              <>
                {isOwner && (
                  <>
                    <div style={{ padding: '6px 16px', fontSize: '0.7rem', textTransform: 'uppercase', color: '#FF9F43', fontWeight: 700 }}>
                      Host Tools
                    </div>
                    <Link to="/accommodation/my" className="mobile-nav-link" style={{ color: '#FF9F43' }}>
                      <FiHome size={16} /> My Rooms & Listings
                    </Link>
                    <Link to="/accommodation/add" className="mobile-nav-link">
                      <FiPlus size={16} /> Add Property
                    </Link>
                    <hr className="mm-divider" />
                  </>
                )}
                <Link to="/profile" className="mobile-nav-link"><FiUser size={16} /> Profile</Link>
                <Link to="/account" className="mobile-nav-link"><FiUser size={16} /> Account</Link>
                <Link to="/settings" className="mobile-nav-link"><FiSettings size={16} /> Settings</Link>
                <button className="mobile-nav-link danger" onClick={handleLogout}>
                  <FiLogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-nav-link"><FiLogIn size={16} /> Login</Link>
                <Link to="/register" className="mobile-nav-link"><FiUser size={16} /> Register</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}