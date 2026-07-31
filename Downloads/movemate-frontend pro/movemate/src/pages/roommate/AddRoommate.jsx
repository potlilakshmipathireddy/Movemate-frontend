import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSave, FiArrowLeft } from 'react-icons/fi'
import { roommateService } from '../../api/axiosConfig'
import { toast } from 'react-toastify'
import { Spinner } from '../../components/common/Loaders'

const init = {
  fullName: '', age: '', gender: 'MALE', occupation: 'STUDENT', companyOrCollege: '',
  city: '', area: '', budget: '', moveInDate: '', phoneNumber: '', about: '',
  foodPreference: 'VEG', smoking: false, drinking: false, pets: false,
  sleepSchedule: 'NIGHT_OWL', cleanliness: 'AVERAGE', profileImage: ''
}

const GENDERS = ['MALE','FEMALE','ANY']
const OCCUPATIONS = ['STUDENT', 'EMPLOYEE', 'FREELANCER', 'BUSINESS', 'SELF_EMPLOYED', 'OTHER']
const FOODS = ['VEG','NON_VEG','VEGAN','EGGETARIAN']
const SLEEP = ['EARLY_BIRD','NIGHT_OWL','FLEXIBLE']
const CLEAN = ['VERY_CLEAN', 'CLEAN', 'AVERAGE', 'MESSY']

export default function AddRoommate({ editId = null, initialData = null }) {
  const [form, setForm] = useState(initialData ? { ...init, ...initialData } : init)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))
  const toggle = (field) => () => setForm(f => ({ ...f, [field]: !f[field] }))

  const validate = () => {
    const e = {}
    if (!form.fullName) e.fullName = 'Name is required'
    if (!form.age || form.age < 18) e.age = 'Age must be 18+'
    if (!form.city) e.city = 'City is required'
    if (!form.area) e.area = 'Area is required'
    if (!form.budget || form.budget <= 0) e.budget = 'Valid budget is required'
    if (!form.moveInDate) e.moveInDate = 'Move-in date is required'
    if (!form.phoneNumber) e.phoneNumber = 'Phone is required'
    else if (!/^[6-9][0-9]{9}$/.test(form.phoneNumber)) e.phoneNumber = 'Invalid mobile number'
    if (!form.companyOrCollege) e.companyOrCollege = 'Company/College is required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return toast.error('Please fix the errors')
    setLoading(true)
    const payload = { ...form, age: parseInt(form.age), budget: parseFloat(form.budget) }
    try {
      if (editId) { await roommateService.update(editId, payload); toast.success('Profile updated!') }
      else { await roommateService.add(payload); toast.success('Roommate profile added!') }
      navigate('/roommates/my')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  const BoolToggle = ({ field, label }) => (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
      <div onClick={toggle(field)} style={{
        width: 44, height: 24, background: form[field] ? 'var(--primary)' : 'var(--surface2)',
        borderRadius: 12, position: 'relative', transition: 'var(--transition)', border: '1px solid var(--border)',
      }}>
        <div style={{ position: 'absolute', top: 2, left: form[field] ? 22 : 2, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'var(--transition)' }} />
      </div>
      <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{label}</span>
    </label>
  )

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh', background: 'var(--dark)' }}>
      <div className="container" style={{ maxWidth: 800, paddingTop: 30, paddingBottom: 60 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => navigate(-1)} className="btn-ghost-mm" style={{ marginBottom: 24, fontSize: '0.85rem' }}>
            <FiArrowLeft size={14} /> Back
          </button>
          <div style={{ marginBottom: 32 }}>
            <div className="section-eyebrow">{editId ? 'Update' : 'New Profile'}</div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800 }}>{editId ? 'Edit Roommate Profile' : 'Add Roommate Profile'}</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mm-card" style={{ padding: 32, marginBottom: 20 }}>
              <h5 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 24 }}>Personal Info</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="mm-form-group">
                    <label className="mm-label">Full Name *</label>
                    <input className="mm-input" placeholder="Your full name" value={form.fullName} onChange={set('fullName')} />
                    {errors.fullName && <span className="mm-error">{errors.fullName}</span>}
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="mm-form-group">
                    <label className="mm-label">Age *</label>
                    <input type="number" className="mm-input" placeholder="25" value={form.age} onChange={set('age')} min="18" max="100" />
                    {errors.age && <span className="mm-error">{errors.age}</span>}
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="mm-form-group">
                    <label className="mm-label">Gender *</label>
                    <select className="mm-input" value={form.gender} onChange={set('gender')}>
                      {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mm-form-group">
                    <label className="mm-label">Occupation *</label>
                    <select className="mm-input" value={form.occupation} onChange={set('occupation')}>
                      {OCCUPATIONS.map(o => <option key={o} value={o}>{o.replace(/_/g,' ')}</option>)}
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mm-form-group">
                    <label className="mm-label">Company / College *</label>
                    <input className="mm-input" placeholder="Your company or college" value={form.companyOrCollege} onChange={set('companyOrCollege')} />
                    {errors.companyOrCollege && <span className="mm-error">{errors.companyOrCollege}</span>}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mm-form-group">
                    <label className="mm-label">Phone Number *</label>
                    <input className="mm-input" placeholder="10-digit mobile" value={form.phoneNumber} onChange={set('phoneNumber')} maxLength={10} />
                    {errors.phoneNumber && <span className="mm-error">{errors.phoneNumber}</span>}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mm-form-group">
                    <label className="mm-label">Profile Image URL</label>
                    <input className="mm-input" placeholder="https://..." value={form.profileImage} onChange={set('profileImage')} />
                  </div>
                </div>
                <div className="col-12">
                  <div className="mm-form-group">
                    <label className="mm-label">About Me</label>
                    <textarea className="mm-input" rows={3} placeholder="Tell potential roommates about yourself..." value={form.about} onChange={set('about')} style={{ resize: 'vertical' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mm-card" style={{ padding: 32, marginBottom: 20 }}>
              <h5 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 24 }}>Location & Budget</h5>
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="mm-form-group">
                    <label className="mm-label">City *</label>
                    <input className="mm-input" placeholder="e.g. Bangalore" value={form.city} onChange={set('city')} />
                    {errors.city && <span className="mm-error">{errors.city}</span>}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mm-form-group">
                    <label className="mm-label">Area *</label>
                    <input className="mm-input" placeholder="e.g. Koramangala" value={form.area} onChange={set('area')} />
                    {errors.area && <span className="mm-error">{errors.area}</span>}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mm-form-group">
                    <label className="mm-label">Budget ₹/month *</label>
                    <input type="number" className="mm-input" placeholder="8000" value={form.budget} onChange={set('budget')} min="0" />
                    {errors.budget && <span className="mm-error">{errors.budget}</span>}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mm-form-group">
                    <label className="mm-label">Move-in Date *</label>
                    <input type="date" className="mm-input" value={form.moveInDate} onChange={set('moveInDate')} />
                    {errors.moveInDate && <span className="mm-error">{errors.moveInDate}</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="mm-card" style={{ padding: 32, marginBottom: 20 }}>
              <h5 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 24 }}>Lifestyle Preferences</h5>
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <label className="mm-label">Food Preference</label>
                  <select className="mm-input" value={form.foodPreference} onChange={set('foodPreference')}>
                    {FOODS.map(f => <option key={f} value={f}>{f.replace(/_/g,' ')}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="mm-label">Sleep Schedule</label>
                  <select className="mm-input" value={form.sleepSchedule} onChange={set('sleepSchedule')}>
                    {SLEEP.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="mm-label">Cleanliness</label>
                  <select className="mm-input" value={form.cleanliness} onChange={set('cleanliness')}>
                    {CLEAN.map(c => <option key={c} value={c}>{c.replace(/_/g,' ')}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap' }}>
                <BoolToggle field="smoking" label="I smoke" />
                <BoolToggle field="drinking" label="I drink" />
                <BoolToggle field="pets" label="I have pets" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" className="btn-primary-mm" disabled={loading}>
                {loading ? <Spinner size={18} color="#fff" /> : <><FiSave size={16} /> {editId ? 'Update' : 'Add Profile'}</>}
              </button>
              <button type="button" className="btn-ghost-mm" onClick={() => navigate(-1)}>Cancel</button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}