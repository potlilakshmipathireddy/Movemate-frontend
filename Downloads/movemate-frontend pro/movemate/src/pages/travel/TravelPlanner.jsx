import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPlus, FiMapPin, FiCalendar, FiUsers, FiDollarSign } from 'react-icons/fi'
import { tripService } from '../../api/axiosConfig'
import { SkeletonCard } from '../../components/common/Loaders'
import { toast } from 'react-toastify'

const categoryColor = { LEISURE: '#6C63FF', ADVENTURE: '#FF6584', BUSINESS: '#43E97B', CULTURAL: '#FFC107', WELLNESS: '#38F9D7' }

export default function TravelPlanner() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    tripService.getMy().then(r => setTrips(r.data||[])).catch(()=>toast.error('Could not load trips')).finally(()=>setLoading(false))
  }, [])

  const deleteTrip = async (id) => {
    if (!window.confirm('Delete this trip?')) return
    try { await tripService.delete(id); setTrips(t => t.filter(x => x.id !== id)); toast.success('Trip deleted') }
    catch { toast.error('Could not delete') }
  }

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--dark)' }}>
      <div style={{ background: 'var(--dark2)', borderBottom: '1px solid var(--border)', padding: '40px 0 30px' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div className="section-eyebrow">Travel Planner</div>
                <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800 }}>My <span className="gradient-text">Trips</span></h2>
              </div>
              <Link to="/travel/add" className="btn-primary-mm"><FiPlus size={16} /> Plan New Trip</Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
        {loading ? (
          <div className="row g-4">{Array.from({length:4}).map((_,i)=><div key={i} className="col-12 col-md-6"><SkeletonCard /></div>)}</div>
        ) : trips.length ? (
          <div className="row g-4">
            {trips.map((trip, i) => {
              const color = categoryColor[trip.category] || '#6C63FF'
              return (
                <motion.div key={trip.id} className="col-12 col-md-6"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <div className="mm-card" style={{ padding: 28 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                      <div>
                        <span className="mm-badge" style={{ background: `${color}20`, color, border: `1px solid ${color}40`, fontSize: '0.7rem', marginBottom: 8 }}>
                          {trip.category}
                        </span>
                        <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.2rem' }}>{trip.destination}</h4>
                      </div>
                      <span style={{ fontSize: '2rem' }}>✈️</span>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
                      {[
                        { icon: FiCalendar, val: `${trip.startDate} → ${trip.endDate}` },
                        { icon: FiUsers, val: `${trip.numberOfTravelers} traveler${trip.numberOfTravelers > 1 ? 's' : ''}` },
                        { icon: FiDollarSign, val: `₹${trip.totalBudget?.toLocaleString()}` },
                        { icon: FiMapPin, val: trip.transportationPreference },
                      ].map(({ icon: Icon, val }) => (
                        <div key={val} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          <Icon size={13} color="var(--primary-light)" /> {val}
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                      <Link to={`/travel/${trip.id}`} className="btn-primary-mm" style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem', padding: '10px' }}>
                        View Details
                      </Link>
                      <button onClick={() => deleteTrip(trip.id)} className="btn-danger-mm" style={{ fontSize: '0.85rem' }}>Delete</button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">✈️</div>
            <h4>No trips planned yet</h4>
            <p>Start planning your next adventure!</p>
            <Link to="/travel/add" className="btn-primary-mm" style={{ display: 'inline-flex', marginTop: 16 }}>
              <FiPlus size={16} /> Plan First Trip
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
