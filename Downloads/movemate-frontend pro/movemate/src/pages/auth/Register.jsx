import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiUserPlus } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import { Spinner } from '../../components/common/Loaders'

const ROLES = ['ROLE_USER', 'ROLE_OWNER']

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', mobileNumber: '', roles: 'ROLE_USER' })
  const [showPass, setShowPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { register } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    
    // Confirm password validation
    if (!form.confirmPassword) e.confirmPassword = 'Confirm password is required'
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'

    if (!form.mobileNumber) e.mobileNumber = 'Mobile number is required'
    else if (!/^[6-9][0-9]{9}$/.test(form.mobileNumber)) e.mobileNumber = 'Invalid mobile number'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      // Exclude confirmPassword from the payload sent to the backend API
      const { confirmPassword, ...payload } = form
      await register(payload)
      toast.success('Registration successful! Please sign in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data || err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gradient-hero)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 20px 40px' }}>
      <div style={{ position: 'absolute', top: '15%', right: '15%', width: 300, height: 300, background: 'rgba(108,99,255,0.1)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        <div className="glass" style={{ borderRadius: 24, padding: 40 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, background: 'var(--gradient-primary)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontFamily: 'Space Grotesk' }}>M</div>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '1.2rem', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MOVEMATE</span>
            </Link>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 6 }}>Create Account</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Join MOVEMATE today</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mm-form-group">
              <label className="mm-label"><FiUser size={13} /> Full Name</label>
              <input className="mm-input" placeholder="Your name" value={form.name} onChange={set('name')} />
              {errors.name && <span className="mm-error">{errors.name}</span>}
            </div>

            <div className="mm-form-group">
              <label className="mm-label"><FiMail size={13} /> Email</label>
              <input type="email" className="mm-input" placeholder="your@email.com" value={form.email} onChange={set('email')} />
              {errors.email && <span className="mm-error">{errors.email}</span>}
            </div>

            <div className="mm-form-group">
              <label className="mm-label"><FiPhone size={13} /> Mobile Number</label>
              <input className="mm-input" placeholder="10-digit mobile number" value={form.mobileNumber} onChange={set('mobileNumber')} maxLength={10} />
              {errors.mobileNumber && <span className="mm-error">{errors.mobileNumber}</span>}
            </div>

            <div className="mm-form-group">
              <label className="mm-label"><FiLock size={13} /> Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  className="mm-input" placeholder="Min 6 characters"
                  value={form.password} onChange={set('password')} style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password && <span className="mm-error">{errors.password}</span>}
            </div>

            {/* Confirm Password Field */}
            <div className="mm-form-group">
              <label className="mm-label"><FiLock size={13} /> Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  className="mm-input" placeholder="Re-enter password"
                  value={form.confirmPassword} onChange={set('confirmPassword')} style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showConfirmPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <span className="mm-error">{errors.confirmPassword}</span>}
            </div>

            <div className="mm-form-group">
              <label className="mm-label">Account Type</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {ROLES.map(r => (
                  <label key={r} style={{
                    flex: 1, padding: 12, border: `1.5px solid ${form.roles === r ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: 10, cursor: 'pointer', textAlign: 'center',
                    background: form.roles === r ? 'rgba(108,99,255,0.12)' : 'var(--surface)',
                    transition: 'var(--transition)', fontSize: '0.85rem', fontWeight: 600,
                    color: form.roles === r ? 'var(--primary-light)' : 'var(--text-muted)'
                  }}>
                    <input type="radio" style={{ display: 'none' }} value={r} checked={form.roles === r} onChange={set('roles')} />
                    {r === 'ROLE_USER' ? '👤 Tenant' : '🏠 Owner'}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary-mm" style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: 8 }} disabled={loading}>
              {loading ? <Spinner size={18} color="#fff" /> : <><FiUserPlus size={16} /> Create Account</>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}