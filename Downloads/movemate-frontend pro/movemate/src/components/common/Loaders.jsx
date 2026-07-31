import { motion } from 'framer-motion'

export function PageLoader() {
  return (
    <div className="page-loader">
      <motion.div
        style={{ display: 'flex', alignItems: 'center', gap: 12 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div style={{
          width: 44, height: 44,
          background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
          borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 900, fontSize: '1.2rem', color: '#fff', fontFamily: 'Space Grotesk, sans-serif'
        }}>M</div>
        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '1.4rem',
          background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MOVEMATE</span>
      </motion.div>
      <div className="loader-spinner" />
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="mm-card" style={{ padding: 20 }}>
      <div className="skeleton" style={{ height: 180, borderRadius: 10, marginBottom: 16 }} />
      <div className="skeleton" style={{ height: 20, width: '70%', marginBottom: 10 }} />
      <div className="skeleton" style={{ height: 16, width: '50%', marginBottom: 10 }} />
      <div className="skeleton" style={{ height: 14, marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 14, width: '80%' }} />
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0' }}>
      <div className="skeleton" style={{ width: 50, height: 50, borderRadius: '50%', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div className="skeleton" style={{ height: 16, width: '60%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 13, width: '40%' }} />
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="row g-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="col-12 col-md-6 col-lg-4">
          <SkeletonCard />
        </div>
      ))}
    </div>
  )
}

export function Spinner({ size = 24, color = 'var(--primary)' }) {
  return (
    <div style={{
      width: size, height: size,
      border: `2px solid rgba(108,99,255,0.2)`,
      borderTop: `2px solid ${color}`,
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
      display: 'inline-block'
    }} />
  )
}
