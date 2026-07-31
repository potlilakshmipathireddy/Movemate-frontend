import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiStar, FiMapPin } from 'react-icons/fi'
import { cityService } from '../../api/axiosConfig'
import { SkeletonCard } from '../../components/common/Loaders'

const CATEGORIES = ['RESTAURANT','HOSPITAL','METRO','BUS_STOP','MARKET','POLICE','BANK','TOURIST_SPOT','PARK','TEMPLE','MALL','HOTEL']
const catEmoji = { RESTAURANT:'🍽️', HOSPITAL:'🏥', METRO:'🚇', BUS_STOP:'🚌', MARKET:'🛒', POLICE:'🚔', BANK:'🏦', TOURIST_SPOT:'🗺️', PARK:'🌳', TEMPLE:'🛕', MALL:'🏬', HOTEL:'🏨' }

export default function CityDetail() {
  const { city } = useParams()
  const navigate = useNavigate()
  const [overview, setOverview] = useState(null)
  const [attractions, setAttractions] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('')

  useEffect(() => {
    Promise.all([
      cityService.getOverview(city).catch(() => null),
      cityService.getAttractions(city).catch(() => ({ data: [] })),
    ]).then(([ov, att]) => {
      setOverview(ov?.data)
      const data = att.data || []
      setAttractions(data)
      setFiltered(data)
    }).finally(() => setLoading(false))
  }, [city])

  const filterCategory = async (cat) => {
    setActiveCategory(cat)
    if (!cat) { setFiltered(attractions); return }
    try {
      const res = await cityService.getByCategory(city, cat)
      setFiltered(res.data || [])
    } catch { setFiltered(attractions.filter(a => a.category === cat)) }
  }

  const presentCategories = [...new Set(attractions.map(a => a.category))].filter(Boolean)

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--dark)' }}>
      <div style={{ background: 'linear-gradient(135deg, var(--dark2), #1a1040)', padding: '60px 0 40px', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <button onClick={() => navigate(-1)} className="btn-ghost-mm" style={{ marginBottom: 20, fontSize: '0.85rem' }}>
            <FiArrowLeft size={14} /> Back
          </button>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="section-eyebrow"><FiMapPin size={12} /> City Explorer</div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 900, fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 12 }}>
              <span className="gradient-text">{city}</span>
            </h2>
            {overview && <p style={{ color: 'var(--text-muted)', maxWidth: 600, fontSize: '0.95rem', lineHeight: 1.7 }}>{overview.description || overview.about}</p>}
            {overview && (
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginTop: 16 }}>
                {overview.population && <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>👥 {overview.population}</span>}
                {overview.bestTimeToVisit && <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>📅 Best: {overview.bestTimeToVisit}</span>}
                {overview.language && <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>🗣️ {overview.language}</span>}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
        {/* Category filter */}
        {presentCategories.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
            <button onClick={() => filterCategory('')}
              className={!activeCategory ? 'btn-primary-mm' : 'btn-ghost-mm'}
              style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
              All
            </button>
            {presentCategories.map(cat => (
              <button key={cat} onClick={() => filterCategory(cat)}
                className={activeCategory === cat ? 'btn-primary-mm' : 'btn-ghost-mm'}
                style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
                {catEmoji[cat] || '📍'} {cat.replace(/_/g,' ')}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="row g-4">{Array.from({length:8}).map((_,i)=><div key={i} className="col-12 col-md-6 col-lg-4"><SkeletonCard /></div>)}</div>
        ) : filtered.length ? (
          <div className="row g-4">
            {filtered.map((att, i) => (
              <motion.div key={att.id || i} className="col-12 col-md-6 col-lg-4"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="mm-card" style={{ padding: 24, height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
                    <div style={{ fontSize: '2rem', flexShrink: 0 }}>{catEmoji[att.category] || '📍'}</div>
                    <div>
                      <h5 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1rem', marginBottom: 6 }}>{att.name}</h5>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {att.category && <span className="mm-badge mm-badge-primary" style={{ fontSize: '0.68rem' }}>{att.category.replace(/_/g,' ')}</span>}
                        {att.rating && <span className="mm-badge mm-badge-warning" style={{ fontSize: '0.68rem' }}><FiStar size={10} /> {att.rating}</span>}
                        {att.expenseTier && <span className="mm-badge mm-badge-info" style={{ fontSize: '0.68rem' }}>{att.expenseTier}</span>}
                      </div>
                    </div>
                  </div>
                  {att.description && <p style={{ color: 'var(--text-muted)', fontSize: '0.83rem', lineHeight: 1.6, marginBottom: 12 }}>{att.description}</p>}
                  {att.address && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <FiMapPin size={11} /> {att.address}
                    </div>
                  )}
                  {att.openingHours && (
                    <div style={{ marginTop: 8, fontSize: '0.78rem', color: 'var(--text-muted)' }}>⏰ {att.openingHours}</div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🏙️</div>
            <h4>No attractions found for {city}</h4>
            <p>This city hasn't been added to our database yet, or no attractions match your filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}
