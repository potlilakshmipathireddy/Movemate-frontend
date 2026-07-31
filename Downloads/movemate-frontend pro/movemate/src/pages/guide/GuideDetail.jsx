import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiStar, FiCalendar, FiDollarSign, FiTrash2 } from 'react-icons/fi'
import { guideService } from '../../api/axiosConfig'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import { SkeletonCard, Spinner } from '../../components/common/Loaders'

export default function GuideDetail() {
  const { id } = useParams()
  const { isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [guide, setGuide] = useState(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState({ startDate: '', endDate: '', specialRequests: '' })
  const [bookingLoading, setBookingLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    guideService.getById(id).then(r => setGuide(r.data)).catch(() => toast.error('Could not load guide')).finally(() => setLoading(false))
  }, [id])

  const handleBook = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) return toast.error('Please login to book a guide')
    if (!booking.startDate || !booking.endDate) return toast.error('Please select dates')
    setBookingLoading(true)
    try {
      await guideService.createBooking({ guideId: parseInt(id), ...booking })
      toast.success('Booking request sent!')
      setBooking({ startDate: '', endDate: '', specialRequests: '' })
    } catch { toast.error('Booking failed. Please try again.') }
    finally { setBookingLoading(false) }
  }

  const handleDeleteGuide = async () => {
    if (!window.confirm('Are you sure you want to delete this local guide?')) return
    setDeleteLoading(true)
    try {
      await guideService.delete(id) // Ensure your guideService or axios config has a delete method matching your endpoint
      toast.success('Local guide deleted successfully')
      navigate('/local-guides')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete guide')
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) return <div style={{ paddingTop: 100 }}><div className="container"><SkeletonCard /></div></div>
  if (!guide) return <div style={{ paddingTop: 100, textAlign: 'center' }}><h4>Guide not found</h4></div>

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh', background: 'var(--dark)' }}>
      <div className="container" style={{ paddingTop: 30, paddingBottom: 60 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <button onClick={() => navigate(-1)} className="btn-ghost-mm" style={{ fontSize: '0.85rem' }}>
            <FiArrowLeft size={14} /> Back
          </button>

          {/* Admin Delete Action Button */}
          {isAdmin && (
            <button 
              onClick={handleDeleteGuide} 
              disabled={deleteLoading} 
              className="btn-danger-mm" 
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}>
              {deleteLoading ? <Spinner size={14} color="#ef4444" /> : <><FiTrash2 size={14} /> Delete Guide</>}
            </button>
          )}
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mm-card" style={{ padding: 32 }}>
              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap' }}>
                <div className="mm-avatar" style={{ width: 80, height: 80, fontSize: '2rem', flexShrink: 0 }}>
                  {guide.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, marginBottom: 8 }}>{guide.name}</h2>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span className="mm-badge mm-badge-primary">{guide.guideType?.replace(/_/g,' ')}</span>
                    {guide.rating && <span className="mm-badge mm-badge-warning"><FiStar size={11} /> {guide.rating}</span>}
                  </div>
                </div>
              </div>

              <div className="row g-3 mb-4">
                {[
                  { label: 'City', val: guide.city, icon: '📍' },
                  { label: 'Rate/Day', val: guide.ratePerDay ? `₹${guide.ratePerDay}` : '—', icon: '💰' },
                  { label: 'Languages', val: guide.languages || '—', icon: '🗣️' },
                  { label: 'Experience', val: guide.experience ? `${guide.experience} years` : '—', icon: '📅' },
                  { label: 'Gender', val: guide.gender || '—', icon: '👤' },
                  { label: 'Total Bookings', val: guide.totalBookings || '—', icon: '✅' },
                ].map(({ label, val, icon }) => (
                  <div key={label} className="col-6 col-md-4">
                    <div style={{ background: 'var(--surface)', borderRadius: 10, padding: '14px 16px' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>{icon} {label}</div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{val}</div>
                    </div>
                  </div>
                ))}
              </div>

              {guide.bio && <>
                <h5 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 12 }}>About</h5>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{guide.bio}</p>
              </>}

              {guide.specialties?.length > 0 && (
                <>
                  <h5 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 12, marginTop: 24 }}>Specialties</h5>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {guide.specialties.map(s => <span key={s} className="mm-badge mm-badge-success">{s}</span>)}
                  </div>
                </>
              )}
            </motion.div>
          </div>

          <div className="col-lg-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="mm-card" style={{ padding: 28, position: 'sticky', top: 100 }}>
              <h5 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 20 }}>Book This Guide</h5>
              {guide.ratePerDay && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    ₹{guide.ratePerDay}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>per day</div>
                </div>
              )}
              <form onSubmit={handleBook}>
                <div className="mm-form-group">
                  <label className="mm-label"><FiCalendar size={13} /> Start Date</label>
                  <input type="date" className="mm-input" value={booking.startDate} onChange={e => setBooking(b => ({ ...b, startDate: e.target.value }))} min={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="mm-form-group">
                  <label className="mm-label"><FiCalendar size={13} /> End Date</label>
                  <input type="date" className="mm-input" value={booking.endDate} onChange={e => setBooking(b => ({ ...b, endDate: e.target.value }))} min={booking.startDate} />
                </div>
                <div className="mm-form-group">
                  <label className="mm-label">Special Requests</label>
                  <textarea className="mm-input" rows={3} placeholder="Any special requirements..." value={booking.specialRequests} onChange={e => setBooking(b => ({ ...b, specialRequests: e.target.value }))} style={{ resize: 'vertical' }} />
                </div>
                <button type="submit" className="btn-primary-mm" style={{ width: '100%', justifyContent: 'center' }} disabled={bookingLoading}>
                  {bookingLoading ? <Spinner size={18} color="#fff" /> : 'Request Booking'}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}