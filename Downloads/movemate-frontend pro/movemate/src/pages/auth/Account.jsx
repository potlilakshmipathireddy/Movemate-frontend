import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiMail, FiPhone, FiShield, FiEdit, FiLogOut, FiSettings } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'

export default function Account() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const initial = user?.name?.[0]?.toUpperCase() || 'U'

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out!')
    navigate('/')
  }

  const infoItems = [
    { icon: FiUser, label: 'Name', val: user?.name },
    { icon: FiMail, label: 'Email', val: user?.email },
    { icon: FiPhone, label: 'Mobile', val: user?.mobileNumber || '—' },
    { icon: FiShield, label: 'Email Verified', val: 'Yes' },
  ]

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh', background: 'var(--dark)' }}>
      <div className="container" style={{ maxWidth: 600, paddingTop: 30, paddingBottom: 60 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ marginBottom: 32 }}>
            <div className="section-eyebrow">Account</div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800 }}>My Account</h2>
          </div>

          {/* Avatar card */}
          <div className="mm-card" style={{ padding: 32, marginBottom: 20, textAlign: 'center' }}>
            <div className="mm-avatar" style={{ width: 80, height: 80, fontSize: '2rem', margin: '0 auto 16px' }}>{initial}</div>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, marginBottom: 4 }}>{user?.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 20 }}>{user?.email}</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <Link to="/profile" className="btn-primary-mm"><FiEdit size={14} /> Edit Profile</Link>
              <Link to="/settings" className="btn-ghost-mm"><FiSettings size={14} /> Settings</Link>
            </div>
          </div>

          {/* Account info */}
          <div className="mm-card" style={{ padding: 24, marginBottom: 20 }}>
            <h5 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 20 }}>Account Information</h5>
            {infoItems.map(({ icon: Icon, label, val }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  <Icon size={15} /> {label}
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Danger zone */}
          <div className="mm-card" style={{ padding: 24, border: '1px solid rgba(255,101,132,0.2)' }}>
            <h5 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 16, color: '#FF6584' }}>Danger Zone</h5>
            <button onClick={handleLogout} className="btn-danger-mm" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiLogOut size={15} /> Logout from All Devices
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
