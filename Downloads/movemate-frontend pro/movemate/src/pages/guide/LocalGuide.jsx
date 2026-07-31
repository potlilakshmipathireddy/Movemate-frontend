import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSearch, FiStar, FiMapPin, FiDollarSign, FiPlus, FiGlobe, FiClock } from 'react-icons/fi'
import { guideService } from '../../api/axiosConfig'
import { useAuth } from '../../context/AuthContext'
import { SkeletonCard } from '../../components/common/Loaders'

export default function LocalGuide() {
  const [city, setCity] = useState('')
  const [guides, setGuides] = useState([])
  const [loading, setLoading] = useState(true)
  const { isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchGuides()
  }, [])

  const fetchGuides = async () => {
    setLoading(true)
    try {
      const res = await guideService.getAll()
      const data = Array.isArray(res.data) ? res.data : (res.data?.content || [])
      setGuides(data)
    } catch {
      setGuides([])
    } finally {
      setLoading(false)
    }
  }

  const search = async (e) => {
    e?.preventDefault()
    if (!city.trim()) {
      fetchGuides()
      return
    }
    setLoading(true)
    try {
      const res = await guideService.searchByCity(city)
      const data = Array.isArray(res.data) ? res.data : (res.data?.content || [])
      setGuides(data)
    } catch { 
      setGuides([]) 
    } finally { 
      setLoading(false) 
    }
  }

  const getRecommended = async () => {
    if (!city.trim()) {
      fetchGuides()
      return
    }
    setLoading(true)
    try {
      const res = await guideService.getRecommended(city)
      const data = Array.isArray(res.data) ? res.data : (res.data?.content || [])
      setGuides(data)
    } catch { 
      setGuides([]) 
    } finally { 
      setLoading(false) 
    }
  }

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--dark)' }}>
      <div style={{ background: 'linear-gradient(135deg, var(--dark2), #0d1a0e)', padding: '80px 0 60px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="section-eyebrow" style={{ justifyContent: 'center' }}>Local Experts</div>
            
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
        {loading ? (
          <div className="row g-4">{Array.from({length:6}).map((_,i)=><div key={i} className="col-12 col-md-6 col-lg-4"><SkeletonCard /></div>)}</div>
        ) : Array.isArray(guides) && guides.length > 0 ? (
          <>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '0.85rem' }}>
              {city ? `${guides.length} guides found in ${city}` : `All available guides (${guides.length})`}
            </p>
            <div className="row g-4">
              {guides.map((guide, i) => (
                <motion.div key={guide.id} className="col-12 col-md-6 col-lg-4"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  
                  {/* Card Container mimicking Accommodation style */}
                  <div style={{ 
                    background: 'var(--dark2, #161b22)', 
                    border: '1px solid var(--border, #30363d)', 
                    borderRadius: 16, 
                    overflow: 'hidden', 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease'
                  }}>
                    
                    {/* Image Header with Floating Badges */}
                    <div style={{ position: 'relative', height: 200, background: '#21262d', overflow: 'hidden' }}>
                      {guide.profileImageUrl ? (
                        <img src={guide.profileImageUrl} alt={guide.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: 'var(--text-muted)' }}>
                          👤
                        </div>
                      )}

                      {/* Floating Badge top-left */}
                      {guide.guideType && (
                        <span style={{ 
                          position: 'absolute', top: 12, left: 12, 
                          background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', 
                          color: '#fff', fontSize: '0.7rem', padding: '4px 10px', 
                          borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', textTransform: 'uppercase', letterSpacing: '0.5px' 
                        }}>
                          {guide.guideType.replace(/_/g,' ')}
                        </span>
                      )}

                      {/* Floating Rating Badge top-right */}
                      {guide.rating && (
                        <span style={{ 
                          position: 'absolute', top: 12, right: 12, 
                          background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', 
                          color: '#FFC107', fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', 
                          borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 4 
                        }}>
                          <FiStar size={12} /> {guide.rating} ({guide.totalReviews || 0})
                        </span>
                      )}
                    </div>

                    {/* Card Content Body */}
                    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h5 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.15rem', color: '#fff', marginBottom: 6 }}>
                        {guide.name}
                      </h5>

                      {guide.city && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 14 }}>
                          <FiMapPin size={14} color="var(--primary)" /> {guide.city}
                        </div>
                      )}

                      {/* Meta Information / Icons row */}
                      <div style={{ display: 'flex', gap: 12, fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 16, flexWrap: 'wrap' }}>
                        {guide.experienceYears && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <FiClock size={13} /> {guide.experienceYears} yrs exp
                          </span>
                        )}
                        {guide.languages && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <FiGlobe size={13} /> {Array.isArray(guide.languages) ? guide.languages.join(', ') : guide.languages}
                          </span>
                        )}
                      </div>

                      {/* Bottom Pricing & Action Section */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <div>
                          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
                            ₹{guide.hourlyRate || '0'}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> /hr</span>
                        </div>

                        <button onClick={() => navigate(`/guides/${guide.id}`)} className="btn-primary-mm" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                          View & Book
                        </button>
                      </div>

                    </div>

                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state" style={{ textAlign: 'center', padding: '40px 0' }}>
            <div className="empty-icon" style={{ fontSize: '3rem', marginBottom: 16 }}>🗺️</div>
            <h4>No local guides found</h4>
            <p style={{ color: 'var(--text-muted)' }}>Try adding a guide or searching a different city.</p>
          </div>
        )}
      </div>
    </div>
  )
}