import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiLock, FiLogOut, FiBell, FiShield, FiGlobe, FiEye, FiEyeOff } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../api/axiosConfig'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { Spinner } from '../../components/common/Loaders'

export default function Settings() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('security')
  const [passForm, setPassForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
  const [showPass, setShowPass] = useState({})
  const [passLoading, setPassLoading] = useState(false)

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (passForm.newPassword !== passForm.confirmPassword) return toast.error('Passwords do not match')
    if (passForm.newPassword.length < 6) return toast.error('Password must be at least 6 characters')
    setPassLoading(true)
    try {
      await authService.changePassword({ username: user?.email, oldPassword: passForm.oldPassword, newPassword: passForm.newPassword })
      toast.success('Password changed successfully!')
      setPassForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch { toast.error('Failed to change password. Check your current password.') }
    finally { setPassLoading(false) }
  }

  const sections = [
    { id: 'security', label: 'Security', icon: FiShield },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'privacy', label: 'Privacy', icon: FiLock },
    { id: 'language', label: 'Language', icon: FiGlobe },
  ]

  const ToggleRow = ({ label, desc, defaultOn = false }) => {
    const [on, setOn] = useState(defaultOn)
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
        <div>
          <div style={{ fontWeight: 600, marginBottom: 2 }}>{label}</div>
          {desc && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{desc}</div>}
        </div>
        <div onClick={() => setOn(!on)} style={{ width: 48, height: 26, background: on ? 'var(--primary)' : 'var(--surface2)', borderRadius: 13, position: 'relative', cursor: 'pointer', transition: 'var(--transition)', border: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ position: 'absolute', top: 3, left: on ? 24 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'var(--transition)' }} />
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh', background: 'var(--dark)' }}>
      <div className="container" style={{ paddingTop: 30, paddingBottom: 60 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ marginBottom: 40 }}>
            <div className="section-eyebrow">Preferences</div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800 }}>Settings</h2>
          </div>
        </motion.div>

        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-lg-3">
            <div className="mm-card" style={{ padding: 8 }}>
              {sections.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setActiveSection(id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                    padding: '12px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: activeSection === id ? 'rgba(108,99,255,0.15)' : 'transparent',
                    color: activeSection === id ? 'var(--primary-light)' : 'var(--text-secondary)',
                    fontFamily: 'inherit', fontWeight: 600, fontSize: '0.88rem',
                    transition: 'var(--transition)', marginBottom: 2,
                  }}>
                  <Icon size={16} /> {label}
                </button>
              ))}
              <hr className="mm-divider" />
              <button onClick={handleLogout}
                style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: '#FF6584', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.88rem' }}>
                <FiLogOut size={16} /> Logout
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="col-lg-9">
            {activeSection === 'security' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mm-card" style={{ padding: 32 }}>
                <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 24 }}>Change Password</h4>
                <form onSubmit={handleChangePassword}>
                  {[
                    { field: 'oldPassword', label: 'Current Password', placeholder: 'Your current password' },
                    { field: 'newPassword', label: 'New Password', placeholder: 'Min 6 characters' },
                    { field: 'confirmPassword', label: 'Confirm New Password', placeholder: 'Repeat new password' },
                  ].map(({ field, label, placeholder }) => (
                    <div key={field} className="mm-form-group">
                      <label className="mm-label">{label}</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPass[field] ? 'text' : 'password'}
                          className="mm-input" placeholder={placeholder}
                          value={passForm[field]}
                          onChange={e => setPassForm(f => ({ ...f, [field]: e.target.value }))}
                          style={{ paddingRight: 44 }}
                        />
                        <button type="button" onClick={() => setShowPass(s => ({ ...s, [field]: !s[field] }))}
                          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                          {showPass[field] ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                        </button>
                      </div>
                    </div>
                  ))}
                  <button type="submit" className="btn-primary-mm" disabled={passLoading}>
                    {passLoading ? <Spinner size={18} color="#fff" /> : <><FiLock size={15} /> Update Password</>}
                  </button>
                </form>
              </motion.div>
            )}

            {activeSection === 'notifications' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mm-card" style={{ padding: 32 }}>
                <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 24 }}>Notification Preferences</h4>
                <ToggleRow label="New Matches" desc="Get notified about new roommate matches" defaultOn={true} />
                <ToggleRow label="New Listings" desc="Alerts for new accommodations in your area" defaultOn={true} />
                <ToggleRow label="Booking Updates" desc="Status changes for your bookings" defaultOn={true} />
                <ToggleRow label="Review Reminders" desc="Reminders to rate your experiences" />
                <ToggleRow label="Newsletter" desc="Monthly newsletter with tips and updates" />
                <button className="btn-primary-mm" style={{ marginTop: 24 }}>Save Preferences</button>
              </motion.div>
            )}

            {activeSection === 'privacy' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mm-card" style={{ padding: 32 }}>
                <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 24 }}>Privacy Settings</h4>
                <ToggleRow label="Public Profile" desc="Allow others to find your profile" defaultOn={true} />
                <ToggleRow label="Show Phone Number" desc="Display phone to verified users" />
                <ToggleRow label="Show Email" desc="Display email in your profile" />
                <ToggleRow label="Data Analytics" desc="Help us improve with usage analytics" defaultOn={true} />
                <button className="btn-primary-mm" style={{ marginTop: 24 }}>Save Settings</button>
              </motion.div>
            )}

            {activeSection === 'language' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mm-card" style={{ padding: 32 }}>
                <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 24 }}>Language & Region</h4>
                <div className="mm-form-group">
                  <label className="mm-label">Display Language</label>
                  <select className="mm-input">
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Tamil</option>
                    <option>Telugu</option>
                    <option>Kannada</option>
                    <option>Marathi</option>
                    <option>Bengali</option>
                  </select>
                </div>
                <div className="mm-form-group">
                  <label className="mm-label">Currency</label>
                  <select className="mm-input">
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                  </select>
                </div>
                <button className="btn-primary-mm">Save</button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
