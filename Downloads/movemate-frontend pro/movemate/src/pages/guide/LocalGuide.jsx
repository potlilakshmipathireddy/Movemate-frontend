import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSearch, FiStar, FiMapPin, FiDollarSign, FiPlus } from 'react-icons/fi'
import { guideService } from '../../api/axiosConfig'
import { useAuth } from '../../context/AuthContext'
import { SkeletonCard } from '../../components/common/Loaders'

export default function LocalGuide() {
  const [city, setCity] = useState('')
  const [guides, setGuides] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const { isAdmin } = useAuth()
  const navigate = useNavigate()

  const search = async (e) => {
    e?.preventDefault()
    if (!city.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const res = await guideService.searchByCity(city)
      setGuides(res.data || [])
    } catch { setGuides([]) } finally { setLoading(false) }
  }

  const getRecommended = async () => {
    if (!city.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const res = await guideService.getRecommended(city)
      setGuides(res.data || [])
    } catch { setGuides([]) } finally { setLoading(false) }
  }

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--dark)' }}>
      <div style={{ background: 'linear-gradient(135deg, var(--dark2), #0d1a0e)', padding: '80px 0 60px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="section-eyebrow" style={{ justifyContent: 'center' }}>Local Experts</div>
            
            {/* Header row with Title and Conditional Admin Add Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3.5rem)', margin: 0 }}>
                Find Your <span className="gradient-text">Local Guide</span>
              </h2>

              {isAdmin && (
                <button onClick={() => navigate('/local-guides/add')} className="btn-primary-mm" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', fontSize: '0.9rem' }}>
                  <FiPlus size={16} /> Add Local Guide
                </button>
              )}
            </div>

            <p style={{ color: 'var(--text-muted)', maxWidth: 460, margin: '0 auto 36px', fontSize: '1rem', textAlign: 'left' }}>
              Connect with expert local guides who know every corner of the city.
            </p>

            <form onSubmit={search} style={{ display: 'flex', gap: 10, maxWidth: 500, margin: '0 auto', justifyContent: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
                <FiSearch size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="mm-input" style={{ paddingLeft: 40 }} placeholder="Enter city name..." value={city} onChange={e => setCity(e.target.value)} />
              </div>
              <button type="submit" className="btn-primary-mm">Search Guides</button>
              <button type="button" className="btn-success-mm" onClick={getRecommended}>⚡ AI Picks</button>
            </form>
          </motion.div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 48, paddingBottom: 60 }}>
        {!searched ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>🗺️</div>
            <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-secondary)' }}>Search for guides in your city</h4>
            <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>Enter a city name above to find available local guides.</p>
          </div>
        ) : loading ? (
          <div className="row g-4">{Array.from({length:6}).map((_,i)=><div key={i} className="col-12 col-md-6 col-lg-4"><SkeletonCard /></div>)}</div>
        ) : guides.length ? (
          <>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '0.85rem' }}>{guides.length} guides found in {city}</p>
            <div className="row g-4">
              {guides.map((guide, i) => (
                <motion.div key={guide.id} className="col-12 col-md-6 col-lg-4"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <div className="mm-card" style={{ padding: 24, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16 }}>
                      <div className="mm-avatar" style={{ width: 54, height: 54, fontSize: '1.2rem', flexShrink: 0 }}>
                        {guide.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <h5 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 4 }}>{guide.name}</h5>
                        <span className="mm-badge mm-badge-primary" style={{ fontSize: '0.7rem' }}>{guide.guideType?.replace(/_/g,' ')}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                      {guide.city && <div style={{ display: 'flex', gap: 6, fontSize: '0.82rem', color: 'var(--text-muted)' }}><FiMapPin size={13} /> {guide.city}</div>}
                      {guide.ratePerDay && <div style={{ display: 'flex', gap: 6, fontSize: '0.82rem', color: 'var(--text-muted)' }}><FiDollarSign size={13} /> ₹{guide.ratePerDay}/day</div>}
                      {guide.rating && <div style={{ display: 'flex', gap: 6, fontSize: '0.82rem', color: '#FFC107' }}><FiStar size={13} /> {guide.rating} / 5</div>}
                      {guide.languages && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>🗣️ {guide.languages}</div>}
                      {guide.experience && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>📅 {guide.experience} years experience</div>}
                    </div>

                    {guide.bio && <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 12, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{guide.bio}</p>}

                    <button onClick={() => navigate(`/guides/${guide.id}`)} className="btn-primary-mm" style={{ width: '100%', justifyContent: 'center', marginTop: 16, padding: '10px' }}>
                      View & Book
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🗺️</div>
            <h4>No guides found in {city}</h4>
            <p>Try a different city or use AI recommendations.</p>
          </div>
        )}
      </div>
    </div>
  )
}