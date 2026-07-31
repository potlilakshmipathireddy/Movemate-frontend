import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { authService } from '../../api/axiosConfig'
import { Spinner } from '../../components/common/Loaders'

export default function VerifyEmail() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const [status, setStatus] = useState('loading') // loading | success | error

  useEffect(() => {
    if (!token) { setStatus('error'); return }
    authService.verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [token])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gradient-hero)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 20px 40px' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 400, zIndex: 1 }}>
        <div className="glass" style={{ borderRadius: 24, padding: 40, textAlign: 'center' }}>
          {status === 'loading' && (
            <>
              <Spinner size={44} />
              <h3 style={{ marginTop: 20, fontFamily: 'Space Grotesk, sans-serif' }}>Verifying Email...</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>Please wait a moment</p>
            </>
          )}
          {status === 'success' && (
            <>
              <div style={{ fontSize: '4rem', marginBottom: 16 }}>✅</div>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', marginBottom: 8 }}>Email Verified!</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Your account is now active. You can log in.</p>
              <Link to="/login" className="btn-primary-mm" style={{ display: 'inline-flex' }}>Go to Login</Link>
            </>
          )}
          {status === 'error' && (
            <>
              <div style={{ fontSize: '4rem', marginBottom: 16 }}>❌</div>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', marginBottom: 8 }}>Verification Failed</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>The token is invalid or expired. Please register again.</p>
              <Link to="/register" className="btn-primary-mm" style={{ display: 'inline-flex' }}>Register Again</Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
