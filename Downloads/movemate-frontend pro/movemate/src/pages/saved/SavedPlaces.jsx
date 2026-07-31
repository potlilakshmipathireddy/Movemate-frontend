import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiTrash2, FiMapPin } from 'react-icons/fi'
import { savedPlaceService } from '../../api/axiosConfig'
import { SkeletonCard } from '../../components/common/Loaders'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

const typeIcon = { ACCOMMODATION: '🏠', ROOMMATE: '👤', TRIP: '✈️', GUIDE: '🗺️' }

export default function SavedPlaces() {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => { setLoading(true); savedPlaceService.getAll().then(r => setPlaces(r.data||[])).catch(()=>toast.error('Could not load')).finally(()=>setLoading(false)) }
  useEffect(load, [])

  const remove = async (id) => {
    try { await savedPlaceService.remove(id); setPlaces(p => p.filter(x => x.id !== id)); toast.success('Removed') }
    catch { toast.error('Could not remove') }
  }

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh', background: 'var(--dark)' }}>
      <div className="container" style={{ paddingTop: 30, paddingBottom: 60 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ marginBottom: 40 }}>
            <div className="section-eyebrow">My Collection</div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800 }}>Saved <span className="gradient-text">Places</span></h2>
          </div>
        </motion.div>

        {loading ? (
          <div className="row g-4">{Array.from({length:6}).map((_,i)=><div key={i} className="col-12 col-md-6 col-lg-4"><SkeletonCard /></div>)}</div>
        ) : places.length ? (
          <div className="row g-4">
            {places.map((p, i) => (
              <motion.div key={p.id} className="col-12 col-md-6 col-lg-4"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <div className="mm-card" style={{ padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <span style={{ fontSize: '2rem' }}>{typeIcon[p.placeType] || '📍'}</span>
                    <span className="mm-badge mm-badge-primary" style={{ fontSize: '0.7rem' }}>{p.placeType}</span>
                  </div>
                  <h5 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 8 }}>{p.placeName || `${p.placeType} #${p.placeId}`}</h5>
                  {p.placeCity && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 16 }}><FiMapPin size={12} /> {p.placeCity}</div>}
                  <div style={{ display: 'flex', gap: 10 }}>
                    {p.placeType === 'ACCOMMODATION' && (
                      <Link to={`/accommodation/${p.placeId}`} className="btn-ghost-mm" style={{ flex: 1, justifyContent: 'center', fontSize: '0.82rem' }}>View</Link>
                    )}
                    {p.placeType === 'ROOMMATE' && (
                      <Link to={`/roommates/${p.placeId}`} className="btn-ghost-mm" style={{ flex: 1, justifyContent: 'center', fontSize: '0.82rem' }}>View</Link>
                    )}
                    <button onClick={() => remove(p.id)} className="btn-danger-mm" style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🔖</div>
            <h4>No saved places yet</h4>
            <p>Start saving accommodations, roommates, and guides you like!</p>
            <Link to="/accommodation" className="btn-primary-mm" style={{ display: 'inline-flex', marginTop: 16 }}>Browse Listings</Link>
          </div>
        )}
      </div>
    </div>
  )
}
