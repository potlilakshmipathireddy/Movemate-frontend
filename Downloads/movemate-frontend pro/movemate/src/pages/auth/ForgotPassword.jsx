import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiSend } from 'react-icons/fi'
import { authService } from '../../api/axiosConfig'
import { toast } from 'react-toastify'
import { Spinner } from '../../components/common/Loaders'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return toast.error('Please enter your email')
    setLoading(true)
    try {
      await authService.forgotPassword({ email })
      setSent(true)
      toast.success('Reset link sent to your email!')
    } catch {
      toast.error('Could not send reset link. Check the email address.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gradient-hero)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 20px 40px' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        <div className="glass" style={{ borderRadius: 24, padding: 40 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔑</div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 8 }}>Forgot Password?</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Enter your email and we'll send a reset link</p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit}>
              <div className="mm-form-group">
                <label className="mm-label"><FiMail size={13} /> Email Address</label>
                <input type="email" className="mm-input" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <button type="submit" className="btn-primary-mm" style={{ width: '100%', justifyContent: 'center', padding: '14px' }} disabled={loading}>
                {loading ? <Spinner size={18} color="#fff" /> : <><FiSend size={16} /> Send Reset Link</>}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>📧</div>
              <h4 style={{ marginBottom: 8 }}>Email Sent!</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Check your inbox for the password reset link.</p>
            </div>
          )}

          <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>← Back to Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
