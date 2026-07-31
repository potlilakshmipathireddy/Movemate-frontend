import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { authService } from '../../api/axiosConfig'
import { toast } from 'react-toastify'
import { Spinner } from '../../components/common/Loaders'

export default function ResetPassword() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const [form, setForm] = useState({ token, newPassword: '', confirmPassword: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.newPassword !== form.confirmPassword) return toast.error('Passwords do not match')
    if (form.newPassword.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      await authService.resetPassword({ token: form.token, newPassword: form.newPassword })
      setDone(true)
      toast.success('Password reset successfully!')
    } catch {
      toast.error('Reset link is invalid or expired.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gradient-hero)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 20px 40px' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 420, zIndex: 1 }}>
        <div className="glass" style={{ borderRadius: 24, padding: 40 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔐</div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 8 }}>Reset Password</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Enter your new password</p>
          </div>

          {!done ? (
            <form onSubmit={handleSubmit}>
              {!token && (
                <div className="mm-form-group">
                  <label className="mm-label">Reset Token</label>
                  <input className="mm-input" placeholder="Paste token from email" value={form.token} onChange={e => setForm(f => ({ ...f, token: e.target.value }))} required />
                </div>
              )}
              <div className="mm-form-group">
                <label className="mm-label"><FiLock size={13} /> New Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPass ? 'text' : 'password'} className="mm-input" placeholder="Min 6 characters"
                    value={form.newPassword} onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))} style={{ paddingRight: 44 }} required />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>
              <div className="mm-form-group">
                <label className="mm-label"><FiLock size={13} /> Confirm Password</label>
                <input type="password" className="mm-input" placeholder="Repeat password"
                  value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} required />
              </div>
              <button type="submit" className="btn-primary-mm" style={{ width: '100%', justifyContent: 'center', padding: '14px' }} disabled={loading}>
                {loading ? <Spinner size={18} color="#fff" /> : 'Reset Password'}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>✅</div>
              <h4>Password Updated!</h4>
              <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '0.9rem' }}>You can now log in with your new password.</p>
              <Link to="/login" className="btn-primary-mm" style={{ display: 'inline-flex' }}>Go to Login</Link>
            </div>
          )}

          {!done && <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>← Back to Login</Link>
          </p>}
        </div>
      </motion.div>
    </div>
  )
}
