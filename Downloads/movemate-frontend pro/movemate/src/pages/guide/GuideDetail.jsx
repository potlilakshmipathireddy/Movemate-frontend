import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiStar, FiCalendar, FiDollarSign, FiTrash2, FiMapPin, FiClock } from 'react-icons/fi'
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
  
  // Mapped to match BookingRequest DTO
  const [booking, setBooking] = useState({ 
    bookingDate: '', 
    startTime: '10:00', 
    durationHours: 2, 
    meetingLocation: '', 
    specialNotes: '' 
  })
  const [bookingLoading, setBookingLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    guideService.getById(id)
      .then(r => setGuide(r.data))
      .catch(() => toast.error('Could not load guide'))
      .finally(() => setLoading(false))
  }, [id])

  const handleBook = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) return toast.error('Please login to book a guide')
    if (!booking.bookingDate || !booking.startTime || !booking.meetingLocation) {
      return toast.error('Please fill in all required booking fields')
    }

    setBookingLoading(true)
    try {
      const payload = {
        guideId: parseInt(id, 10),
        bookingDate: booking.bookingDate,
        startTime: booking.startTime.length === 5 ? `${booking.startTime}:00` : booking.startTime,
        durationHours: parseInt(booking.durationHours, 10),
        meetingLocation: booking.meetingLocation,
        specialNotes: booking.specialNotes
      }

      await guideService.createBooking(payload)
      toast.success('Booking request sent successfully!')
      setBooking({ bookingDate: '', startTime: '10:00', durationHours: 2, meetingLocation: '', specialNotes: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.')
    } finally {
      setBookingLoading(false)
    }
  }

  const handleDeleteGuide = async () => {
    if (!window.confirm('Are you sure you want to delete this local guide?')) return
    setDeleteLoading(true)
    try {
      await guideService.delete(id)
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
                <div className="mm-avatar" style={{ width: 80, height: 80, fontSize: '2rem', flexShrink: 0, overflow: 'hidden' }}>
                  {guide.profileImageUrl ? (
                    <img src={guide.profileImageUrl} alt={guide.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    guide.name?.[0]?.toUpperCase()
                  )}
                </div>
                <div>
                  <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, marginBottom: 8 }}>{guide.name}</h2>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span className="mm-badge mm-badge-primary">{guide.guideType?.replace(/_/g,' ')}</span>
                    {guide.rating && <span className="mm-badge mm-badge-warning"><FiStar size={11} /> {guide.rating} ({guide.totalReviews || 0})</span>}
                  </div>
                </div>
              </div>

              <div className="row g-3 mb-4">
                {[
                  { label: 'City', val: guide.city, icon: '📍' },
                  { label: 'Hourly Rate', val: guide.hourlyRate ? `₹${guide.hourlyRate}` : '—', icon: '💰' },
                  { label: 'Languages', val: guide.languages?.join(', ') || '—', icon: '🗣️' },
                  { label: 'Experience', val: guide.experienceYears ? `${guide.experienceYears} years` : '—', icon: '📅' },
                  { label: 'Gender', val: guide.gender || '—', icon: '👤' },
                  { label: 'Services', val: guide.servicesOffered?.join(', ') || '—', icon: '🛠️' },
                ].map(({ label, val, icon }) => (
                  <div key={label} className="col-6 col-md-4">
                    <div style={{ background: 'var(--surface)', borderRadius: 10, padding: '14px 16px' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>{icon} {label}</div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{val}</div>
                    </div>
                  </div>
                ))}
              </div>

              {guide.about && <>
                <h5 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 12 }}>About</h5>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{guide.about}</p>
              </>}

              {guide.specialization && (
                <>
                  <h5 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 12, marginTop: 24 }}>Specialization</h5>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span className="mm-badge mm-badge-success">{guide.specialization}</span>
                  </div>
                </>
              )}
            </motion.div>
          </div>

          <div className="col-lg-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="mm-card" style={{ padding: 28, position: 'sticky', top: 100 }}>
              <h5 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 20 }}>Book This Guide</h5>
              {guide.hourlyRate && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    ₹{guide.hourlyRate}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>per hour</div>
                </div>
              )}
              <form onSubmit={handleBook}>
                <div className="mm-form-group">
                  <label className="mm-label"><FiCalendar size={13} /> Booking Date *</label>
                  <input type="date" className="mm-input" value={booking.bookingDate} onChange={e => setBooking(b => ({ ...b, bookingDate: e.target.value }))} min={new Date().toISOString().split('T')[0]} required />
                </div>
                <div className="row g-2">
                  <div className="col-6">
                    <div className="mm-form-group">
                      <label className="mm-label"><FiClock size={13} /> Start Time *</label>
                      <input type="time" className="mm-input" value={booking.startTime} onChange={e => setBooking(b => ({ ...b, startTime: e.target.value }))} required />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="mm-form-group">
                      <label className="mm-label">Duration (Hrs) *</label>
                      <input type="number" min="1" max="12" className="mm-input" value={booking.durationHours} onChange={e => setBooking(b => ({ ...b, durationHours: e.target.value }))} required />
                    </div>
                  </div>
                </div>
                <div className="mm-form-group">
                  <label className="mm-label"><FiMapPin size={13} /> Meeting Location *</label>
                  <input type="text" className="mm-input" placeholder="e.g. City Center Monument" value={booking.meetingLocation} onChange={e => setBooking(b => ({ ...b, meetingLocation: e.target.value }))} required />
                </div>
                <div className="mm-form-group">
                  <label className="mm-label">Special Notes</label>
                  <textarea className="mm-input" rows={3} placeholder="Any special requirements..." value={booking.specialNotes} onChange={e => setBooking(b => ({ ...b, specialNotes: e.target.value }))} style={{ resize: 'vertical' }} />
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