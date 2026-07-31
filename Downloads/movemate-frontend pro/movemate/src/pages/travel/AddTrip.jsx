import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSave, FiArrowLeft, FiZap } from 'react-icons/fi'
import { tripService } from '../../api/axiosConfig'
import { toast } from 'react-toastify'
import { Spinner } from '../../components/common/Loaders'

const init = {
  destination: '', startDate: '', endDate: '', numberOfTravelers: 1,
  totalBudget: '', budgetRange: 'MODERATE', category: 'LEISURE',
  transportationPreference: 'TRAIN', accommodationPreference: 'HOTEL',
  foodPreference: 'VEG', interests: []
}

const interests = ['History','Culture','Food','Adventure','Nature','Shopping','Nightlife','Art','Religion','Sports']

export default function AddTrip() {
  const [form, setForm] = useState(init)
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const set = (f) => (e) => setForm(prev => ({ ...prev, [f]: e.target.value }))

  const toggleInterest = (interest) => {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const validate = () => {
    const e = {}
    if (!form.destination) e.destination = 'Destination is required'
    if (!form.startDate) e.startDate = 'Start date is required'
    if (!form.endDate) e.endDate = 'End date is required'
    if (!form.totalBudget || form.totalBudget <= 0) e.totalBudget = 'Valid budget is required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (ev, ai = false) => {
    ev.preventDefault()
    if (!validate()) return toast.error('Please fill all required fields')
    const payload = { ...form, numberOfTravelers: parseInt(form.numberOfTravelers), totalBudget: parseFloat(form.totalBudget) }
    if (ai) {
      setAiLoading(true)
      try { const r = await tripService.aiGenerate(payload); toast.success('AI trip generated!'); navigate(`/travel/${r.data.id}`) }
      catch { toast.error('AI generation failed') } finally { setAiLoading(false) }
    } else {
      setLoading(true)
      try { const r = await tripService.create(payload); toast.success('Trip created!'); navigate(`/travel/${r.data.id}`) }
      catch { toast.error('Could not create trip') } finally { setLoading(false) }
    }
  }

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh', background: 'var(--dark)' }}>
      <div className="container" style={{ maxWidth: 760, paddingTop: 30, paddingBottom: 60 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => navigate(-1)} className="btn-ghost-mm" style={{ marginBottom: 24, fontSize: '0.85rem' }}>
            <FiArrowLeft size={14} /> Back
          </button>
          <div style={{ marginBottom: 32 }}>
            <div className="section-eyebrow">Plan Trip</div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800 }}>Create <span className="gradient-text">New Trip</span></h2>
          </div>

          <form onSubmit={e => handleSubmit(e, false)}>
            <div className="mm-card" style={{ padding: 32, marginBottom: 20 }}>
              <h5 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 24 }}>Destination & Dates</h5>
              <div className="row g-3">
                <div className="col-12">
                  <div className="mm-form-group">
                    <label className="mm-label">Destination *</label>
                    <input className="mm-input" placeholder="e.g. Goa, Rajasthan, Ooty" value={form.destination} onChange={set('destination')} />
                    {errors.destination && <span className="mm-error">{errors.destination}</span>}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mm-form-group">
                    <label className="mm-label">Start Date *</label>
                    <input type="date" className="mm-input" value={form.startDate} onChange={set('startDate')} min={new Date().toISOString().split('T')[0]} />
                    {errors.startDate && <span className="mm-error">{errors.startDate}</span>}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mm-form-group">
                    <label className="mm-label">End Date *</label>
                    <input type="date" className="mm-input" value={form.endDate} onChange={set('endDate')} min={form.startDate} />
                    {errors.endDate && <span className="mm-error">{errors.endDate}</span>}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mm-form-group">
                    <label className="mm-label">Number of Travelers</label>
                    <input type="number" className="mm-input" value={form.numberOfTravelers} onChange={set('numberOfTravelers')} min="1" max="50" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mm-form-group">
                    <label className="mm-label">Total Budget ₹ *</label>
                    <input type="number" className="mm-input" placeholder="25000" value={form.totalBudget} onChange={set('totalBudget')} min="0" />
                    {errors.totalBudget && <span className="mm-error">{errors.totalBudget}</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="mm-card" style={{ padding: 32, marginBottom: 20 }}>
              <h5 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 24 }}>Preferences</h5>
              <div className="row g-3">
                {[
                  { label: 'Category', field: 'category', opts: ['ADVENTURE', 'LEISURE', 'BUSINESS', 'CULTURAL', 'ROMANTIC', 'FAMILY', 'SOLO', 'WILDLIFE'] },
                  { label: 'Budget Range', field: 'budgetRange', opts: ['BUDGET', 'MODERATE', 'LUXURY', 'ULTRA_LUXURY'] },
                  { label: 'Transportation', field: 'transportationPreference', opts: ['FLIGHT', 'TRAIN', 'BUS', 'CAR_RENTAL', 'PUBLIC_TRANSIT', 'CRUISE'] },
                  { label: 'Accommodation', field: 'accommodationPreference', opts: ['HOTEL', 'HOSTEL', 'RESORT', 'VILLA', 'APARTMENT', 'CAMPING'] },
                  { label: 'Food Preference', field: 'foodPreference', opts: ['VEG', 'NON_VEG', 'VEGAN', 'NO_PREFERENCE'] },
                ].map(({ label, field, opts }) => (
                  <div key={field} className="col-md-4">
                    <label className="mm-label">{label}</label>
                    <select className="mm-input" value={form[field]} onChange={set(field)}>
                      {opts.map(o => <option key={o} value={o}>{o.replace(/_/g,' ')}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 20 }}>
                <label className="mm-label">Interests (optional)</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                  {interests.map(interest => (
                    <button key={interest} type="button"
                      onClick={() => toggleInterest(interest)}
                      className={form.interests.includes(interest) ? 'btn-primary-mm' : 'btn-ghost-mm'}
                      style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button type="submit" className="btn-primary-mm" disabled={loading}>
                {loading ? <Spinner size={18} color="#fff" /> : <><FiSave size={16} /> Create Trip</>}
              </button>
              <button type="button" className="btn-success-mm" onClick={e => handleSubmit(e, true)} disabled={aiLoading}>
                {aiLoading ? <Spinner size={18} color="var(--dark)" /> : <><FiZap size={16} /> AI Generate</>}
              </button>
              <button type="button" className="btn-ghost-mm" onClick={() => navigate(-1)}>Cancel</button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}