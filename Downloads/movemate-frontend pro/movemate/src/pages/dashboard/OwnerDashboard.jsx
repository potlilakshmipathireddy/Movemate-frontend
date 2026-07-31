import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHome, FiPlus, FiSettings, FiUser, FiArrowRight } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { dashboardService } from '../../api/axiosConfig'
import { SkeletonCard } from '../../components/common/Loaders'

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' } })
}

const ownerQuickActions = [
  { label: 'Add Property', icon: FiPlus, to: '/accommodation/add', color: '#6C63FF', desc: 'Publish a new real estate listing or room' },
  { label: 'Manage My Rooms', icon: FiHome, to: '/accommodation/my', color: '#FF9F43', desc: 'View and update your existing properties' },
  { label: 'Settings', icon: FiSettings, to: '/settings', color: '#43E97B', desc: 'Manage your account preferences and security' },
  { label: 'My Profile', icon: FiUser, to: '/profile', color: '#A89CFF', desc: 'View and edit your personal information' }
]

export default function OwnerDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardService.get()
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const initial = user?.name?.[0]?.toUpperCase() || 'O'

  const statsCards = [
    { icon: '🏠', label: 'My Listings', val: data?.totalAccommodations ?? '—', color: '#6C63FF', bg: 'rgba(108,99,255,0.06)' },
    { icon: '📊', label: 'Total Inquiries', val: data?.totalInquiries ?? '0', color: '#FF9F43', bg: 'rgba(255,159,67,0.06)' },
  ]

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh', background: 'var(--dark, #0b0f19)' }}>
      <div className="container" style={{ maxWidth: 1200, paddingTop: 30, paddingBottom: 60 }}>
        
        {/* Owner Welcome Banner */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
          style={{ 
            background: 'linear-gradient(135deg, rgba(255, 159, 67, 0.08) 0%, rgba(25, 33, 56, 0.4) 100%)',
            border: '1px solid rgba(255, 159, 67, 0.2)',
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
            <div className="mm-avatar" style={{ width: 72, height: 72, fontSize: '1.8rem', background: 'linear-gradient(135deg, #FF9F43, #FF6B6B)', boxShadow: '0 4px 20px rgba(255,159,67,0.4)' }}>
              {initial}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.85rem', fontWeight: 500 }}>Owner Portal</span>
                <span style={{ fontSize: '0.65rem', background: 'rgba(255,159,67,0.15)', color: '#FF9F43', padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>Host</span>
              </div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '1.85rem', color: '#fff', margin: 0 }}>
                {user?.name || 'Owner'} <span style={{ fontSize: '1.4rem' }}>👋</span>
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

        {/* Stats Grid for Owner */}
        <div className="row g-4 mb-5">
          {statsCards.map(({ icon, label, val, color, bg }, i) => (
            <motion.div key={label} className="col-6 col-md-6" variants={fadeUp} initial="hidden" animate="visible" custom={i * 0.08 + 1}>
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

        {/* Host Controls & Actions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.25rem', color: '#fff', margin: 0 }}>Host Controls & Settings</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #94a3b8)' }}>Manage your property features</span>
          </div>
          <div className="row g-4">
            {ownerQuickActions.map(({ label, icon: Icon, to, color, desc }) => (
              <div key={to} className="col-12 col-md-6">
                <Link to={to} style={{ textDecoration: 'none' }}>
                  <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                    style={{
                      background: 'rgba(25, 33, 56, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: 16, padding: '24px',
                      display: 'flex', alignItems: 'flex-start', gap: 18,
                      boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                      height: '100%'
                    }}>
                    <div style={{ width: 50, height: 50, background: `${color}18`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={24} color={color} />
                    </div>
                    <div>
                      <h5 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#fff', marginBottom: 6 }}>
                        {label}
                      </h5>
                      <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.85rem', margin: 0, lineHeight: 1.4 }}>
                        {desc}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  )
}