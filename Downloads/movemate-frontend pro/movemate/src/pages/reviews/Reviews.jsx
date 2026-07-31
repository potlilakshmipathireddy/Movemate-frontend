import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiStar } from 'react-icons/fi'
import { reviewService } from '../../api/axiosConfig'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import { Spinner } from '../../components/common/Loaders'

const testimonials = [
  { name: 'Priya Sharma', city: 'Bangalore', rating: 5, text: 'Found my perfect PG through MOVEMATE in just 2 days! The filters made it super easy to find exactly what I wanted.', avatar: 'P' },
  { name: 'Rahul Mehta', city: 'Mumbai', rating: 5, text: 'Connected with an amazing roommate who shares the same schedule and lifestyle. MOVEMATE\'s matching is spot on!', avatar: 'R' },
  { name: 'Anjali Singh', city: 'Delhi', rating: 4, text: 'The travel planner feature is incredible. It planned my entire Goa trip with itineraries and budget breakdown!', avatar: 'A' },
  { name: 'Karthik Nair', city: 'Chennai', rating: 5, text: 'The local guide feature helped me explore Hyderabad like a local. Worth every rupee!', avatar: 'K' },
  { name: 'Deepa Patel', city: 'Pune', rating: 5, text: 'As an owner, listing my property was straightforward and I got inquiries within hours. Great platform!', avatar: 'D' },
  { name: 'Vikram Rao', city: 'Hyderabad', rating: 4, text: 'Smooth experience from start to finish. The city explorer helped me find great restaurants in a new city.', avatar: 'V' },
]

function Stars({ count }) {
  return <div style={{ display: 'flex', gap: 2 }}>{Array.from({ length: 5 }).map((_, i) => <FiStar key={i} size={14} fill={i < count ? '#FFC107' : 'none'} color={i < count ? '#FFC107' : 'var(--text-muted)'} />)}</div>
}

export default function Reviews() {
  const { isAuthenticated } = useAuth()
  const [form, setForm] = useState({ bookingId: '', rating: 5, comment: '', targetId: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) return toast.error('Please login to submit a review')
    setLoading(true)
    try {
      await reviewService.add({ bookingId: parseInt(form.bookingId), rating: form.rating, comment: form.comment, targetId: parseInt(form.targetId) })
      toast.success('Review submitted!')
      setForm({ bookingId: '', rating: 5, comment: '', targetId: '' })
    } catch (err) {
      toast.error(err.response?.data || 'Could not submit review')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--dark)' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, var(--dark2), #1a1040)', padding: '70px 0 50px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="section-eyebrow" style={{ justifyContent: 'center' }}>Community</div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: 12 }}>
              What <span className="gradient-text">Movers Say</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: 460, margin: '0 auto' }}>Real experiences from our community of smart movers.</p>
          </motion.div>
        </div>
      </div>

      {/* Testimonials */}
      <section className="mm-section">
        <div className="container">
          <div className="row g-4">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} className="col-12 col-md-6 col-lg-4"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="mm-card" style={{ padding: 28, height: '100%' }}>
                  <div style={{ marginBottom: 16 }}><Stars count={t.rating} /></div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 20 }}>"{t.text}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="mm-avatar" style={{ width: 42, height: 42, fontSize: '1rem' }}>{t.avatar}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.city}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Submit Review */}
      {isAuthenticated && (
        <section className="mm-section" style={{ background: 'var(--dark2)' }}>
          <div className="container" style={{ maxWidth: 600 }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div className="section-eyebrow" style={{ justifyContent: 'center' }}>Share Your Experience</div>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>Write a Review</h3>
            </div>
            <div className="mm-card" style={{ padding: 32 }}>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="mm-form-group">
                      <label className="mm-label">Booking ID</label>
                      <input type="number" className="mm-input" placeholder="Your booking ID" value={form.bookingId} onChange={e => setForm(f => ({ ...f, bookingId: e.target.value }))} required />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mm-form-group">
                      <label className="mm-label">Guide/Attraction ID</label>
                      <input type="number" className="mm-input" placeholder="Target ID" value={form.targetId} onChange={e => setForm(f => ({ ...f, targetId: e.target.value }))} required />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="mm-form-group">
                      <label className="mm-label">Rating</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {[1,2,3,4,5].map(n => (
                          <button key={n} type="button" onClick={() => setForm(f => ({ ...f, rating: n }))}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                            <FiStar size={28} fill={n <= form.rating ? '#FFC107' : 'none'} color={n <= form.rating ? '#FFC107' : 'var(--text-muted)'} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="mm-form-group">
                      <label className="mm-label">Comment (optional)</label>
                      <textarea className="mm-input" rows={4} placeholder="Share your experience..." value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))} style={{ resize: 'vertical' }} />
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn-primary-mm" disabled={loading}>
                  {loading ? <Spinner size={18} color="#fff" /> : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
