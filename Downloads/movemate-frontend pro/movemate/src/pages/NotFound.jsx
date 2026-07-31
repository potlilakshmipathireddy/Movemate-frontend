import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHome, FiArrowLeft } from 'react-icons/fi'

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--gradient-hero)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ position: 'absolute', top: '20%', left: '20%', width: 300, height: 300, background: 'rgba(108,99,255,0.1)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 'clamp(5rem, 15vw, 10rem)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 900, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>
          404
        </div>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 12, fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 40, maxWidth: 380, fontSize: '1rem', lineHeight: 1.6 }}>
          Looks like you took a wrong turn. This page doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn-primary-mm"><FiHome size={16} /> Go Home</Link>
          <button onClick={() => history.back()} className="btn-outline-mm"><FiArrowLeft size={16} /> Go Back</button>
        </div>
      </motion.div>
    </div>
  )
}
