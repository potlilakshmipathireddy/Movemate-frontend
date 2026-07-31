import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUsers, FiNavigation, FiMap, FiBookmark, FiSettings, FiUser, FiArrowRight, FiShield } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { dashboardService } from '../../api/axiosConfig'
import AccommodationCard from '../../components/accommodation/AccommodationCard'
import RoommateCard from '../../components/roommate/RoommateCard'
import { SkeletonCard } from '../../components/common/Loaders'
import OwnerDashboard from './OwnerDashboard' // Import your newly created owner dashboard

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' } })
}

const allQuickActions = [
  { label: 'Add Roommate', icon: FiUsers, to: '/roommates/add', color: '#FF6584', ownerOnly: false },
  { label: 'Plan a Trip', icon: FiNavigation, to: '/travel/add', color: '#43E97B', ownerOnly: false },
  { label: 'Explore City', icon: FiMap, to: '/explore', color: '#38F9D7', ownerOnly: false },
  { label: 'Saved Places', icon: FiBookmark, to: '/saved', color: '#FFC107', ownerOnly: false },
  { label: 'My Profile', icon: FiUser, to: '/profile', color: '#A89CFF', ownerOnly: false },
  { label: 'Settings', icon: FiSettings, to: '/settings', color: '#6C63FF', ownerOnly: false },
  { label: 'Manage Guides', icon: FiShield, to: '/admin/guides', color: '#00F2FE', adminOnly: true },
]

export default function Dashboard() {
  const { user, isOwner, isAdmin, loading: authLoading } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  console.log("LOGGED IN USER OBJECT:", user)

  useEffect(() => {
    // Only fetch dashboard data if the user is not an owner (or you can fetch shared data as needed)
    if (!isOwner) {
      dashboardService.get()
        .then(res => setData(res.data))
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [isOwner])

  // If authentication is still loading, show a clean loader
  if (authLoading) {
    return (
      <div style={{ paddingTop: 90, minHeight: '100vh', background: '#0b0f19', color: '#fff', textAlign: 'center' }}>
        Loading dashboard...
      </div>
    )
  }

  // Automatically render the OwnerDashboard if the user has the owner role
  if (isOwner) {
    return <OwnerDashboard />
  }

  const initial = user?.name?.[0]?.toUpperCase() || 'U'

  const quickActions = allQuickActions.filter(action => {
    if (action.adminOnly && !isAdmin) return false
    return true
  })

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh', background: 'var(--dark, #0b0f19)' }}>
      <div className="container" style={{ maxWidth: 1200, paddingTop: 30, paddingBottom: 60 }}>
        
        {/* Welcome Banner */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
          style={{ 
            background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.08) 0%, rgba(25, 33, 56, 0.4) 100%)',
            border: '1px solid rgba(108, 99, 255, 0.15)',
            borderRadius: 20,
            padding: '32px 28px',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 20,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div className="mm-avatar" style={{ width: 72, height: 72, fontSize: '1.8rem', background: 'var(--gradient-primary, linear-gradient(135deg, #6C63FF, #4834DF))', boxShadow: '0 4px 20px rgba(108,99,255,0.4)' }}>
              {initial}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.85rem', fontWeight: 500 }}>Welcome back</span>
                {isAdmin && <span style={{ fontSize: '0.65rem', background: 'rgba(0,242,254,0.15)', color: '#00F2FE', padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>Admin</span>}
              </div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '1.85rem', color: '#fff', margin: 0 }}>
                {user?.name || 'User'} <span style={{ fontSize: '1.4rem' }}>👋</span>
              </h2>
              <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>{user?.email}</p>
            </div>
          </div>
          <Link to="/profile" style={{ textDecoration: 'none' }}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 18px', borderRadius: 10, color: '#fff', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              Manage Profile <FiArrowRight size={14} />
            </motion.div>
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <div className="row g-4 mb-5">
          {[
            { icon: '👥', label: 'My Profiles', val: data?.totalRoommates ?? '—', color: '#FF6584', bg: 'rgba(255,101,132,0.06)' },
            { icon: '✈️', label: 'My Trips', val: data?.totalTrips ?? '—', color: '#43E97B', bg: 'rgba(67,233,123,0.06)' },
            { icon: '⭐', label: 'Saved Places', val: data?.savedPlaces ?? '—', color: '#FFC107', bg: 'rgba(255,193,7,0.06)' },
          ].map(({ icon, label, val, color, bg }, i) => (
            <motion.div key={label} className="col-6 col-md-4" variants={fadeUp} initial="hidden" animate="visible" custom={i * 0.08 + 2}>
              <div style={{ background: bg, border: `1px solid ${color}25`, borderRadius: 16, padding: '24px 20px', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ fontSize: '1.8rem' }}>{icon}</div>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 10px ${color}` }} />
                </div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: 4, letterSpacing: '-0.5px' }}>
                  {val}
                </div>
                <div style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.85rem', fontWeight: 500 }}>{label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4} style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.25rem', color: '#fff', margin: 0 }}>Quick Actions</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #94a3b8)' }}>Shortcuts for fast navigation</span>
          </div>
          <div className="row g-3">
            {quickActions.map(({ label, icon: Icon, to, color }) => (
              <div key={to} className="col-6 col-md-3">
                <Link to={to} style={{ textDecoration: 'none' }}>
                  <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                    style={{
                      background: 'rgba(25, 33, 56, 0.4)',
                      border: `1px solid rgba(255, 255, 255, 0.06)`,
                      borderRadius: 14, padding: '16px',
                      display: 'flex', alignItems: 'center', gap: 14,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      transition: 'border-color 0.2s ease'
                    }}>
                    <div style={{ width: 42, height: 42, background: `${color}18`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={19} color={color} />
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff', lineHeight: 1.2 }}>{label}</span>
                  </motion.div>
                </Link>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Accommodations */}
        {(data?.recentAccommodations?.length > 0 || loading) && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5} style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.25rem', color: '#fff', margin: 0 }}>Recent Accommodations</h4>
              <Link to="/accommodation" style={{ color: 'var(--primary-light, #8c85ff)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>View All</Link>
            </div>
            {loading ? (
              <div className="row g-4">{Array.from({length:3}).map((_,i)=><div key={i} className="col-12 col-md-4"><SkeletonCard /></div>)}</div>
            ) : (
              <div className="row g-4">
                {data.recentAccommodations.slice(0,3).map(item => (
                  <div key={item.id} className="col-12 col-md-4"><AccommodationCard item={item} /></div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Recent Roommates */}
        {(data?.recentRoommates?.length > 0 || loading) && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6} style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.25rem', color: '#fff', margin: 0 }}>Recent Roommates</h4>
              <Link to="/roommates" style={{ color: 'var(--primary-light, #8c85ff)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>View All</Link>
            </div>
            {loading ? (
              <div className="row g-4">{Array.from({length:3}).map((_,i)=><div key={i} className="col-12 col-md-4"><SkeletonCard /></div>)}</div>
            ) : (
              <div className="row g-4">
                {data.recentRoommates.slice(0,3).map(item => (
                  <div key={item.id} className="col-12 col-md-4"><RoommateCard item={item} /></div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Empty State Fallback */}
        {!loading && !data && (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(25, 33, 56, 0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16 }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>📊</div>
            <h4 style={{ color: '#fff', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 8 }}>No dashboard data yet</h4>
            <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.9rem' }}>Start exploring MOVEMATE features to populate your personal metrics and activity stream!</p>
          </div>
        )}
      </div>
    </div>
  )
}