import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiUser, FiMapPin, FiDollarSign, FiAward, FiImage, FiPlusCircle } from 'react-icons/fi'
import { guideService } from '../../api/axiosConfig'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import { Spinner } from '../../components/common/Loaders'

const GUIDE_TYPES = ['LOCAL_RESIDENT', 'PROFESSIONAL_GUIDE', 'STUDENT_GUIDE', 'TRAVEL_EXPERT']
const GENDERS = ['ANY', 'FEMALE', 'MALE']

export default function GuideAdd() {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  
  const [form, setForm] = useState({
    name: '',
    city: '',
    about: '',
    guideType: 'LOCAL_RESIDENT',
    gender: 'ANY',
    hourlyRate: '',
    experienceYears: '',
    age: '',
    specialization: '',
    profileImageUrl: '',
    isAvailable: true,
    verified: false
  })

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f => ({ ...f, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isAdmin) {
      toast.error('Unauthorized action')
      return
    }
    if (!form.name || !form.city) {
      toast.error('Please fill in required fields (Name and City)')
      return
    }

    setLoading(true)
    try {
      // Map payload types to match backend expectations
      const payload = {
        ...form,
        hourlyRate: form.hourlyRate ? parseFloat(form.hourlyRate) : 0,
        experienceYears: form.experienceYears ? parseInt(form.experienceYears, 10) : 0,
        age: form.age ? parseInt(form.age, 10) : 0,
      }

      // Ensure your guideService has a create or add method mapped appropriately, e.g., guideService.create(payload)
      await guideService.create ? await guideService.create(payload) : await guideService.add(payload)
      
      toast.success('Local guide added successfully!')
      navigate('/local-guides')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add guide')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh', background: 'var(--dark)' }}>
      <div className="container" style={{ paddingTop: 30, paddingBottom: 60, maxWidth: 800 }}>
        <button onClick={() => navigate(-1)} className="btn-ghost-mm" style={{ marginBottom: 24, fontSize: '0.85rem' }}>
          <FiArrowLeft size={14} /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mm-card" style={{ padding: 40 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, marginBottom: 8 }}>Add New Local Guide</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Fill in the expert details to register them in the system</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* Name */}
              <div className="col-12 col-md-6">
                <div className="mm-form-group">
                  <label className="mm-label"><FiUser size={13} /> Full Name *</label>
                  <input className="mm-input" placeholder="Guide name" value={form.name} onChange={handleChange('name')} required />
                </div>
              </div>

              {/* City */}
              <div className="col-12 col-md-6">
                <div className="mm-form-group">
                  <label className="mm-label"><FiMapPin size={13} /> City *</label>
                  <input className="mm-input" placeholder="Operating city" value={form.city} onChange={handleChange('city')} required />
                </div>
              </div>

              {/* Guide Type */}
              <div className="col-12 col-md-6">
                <div className="mm-form-group">
                  <label className="mm-label">Guide Type</label>
                  <select className="mm-input" value={form.guideType} onChange={handleChange('guideType')} style={{ background: 'var(--surface)', color: 'var(--text)' }}>
                    {GUIDE_TYPES.map(type => (
                      <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Gender */}
              <div className="col-12 col-md-6">
                <div className="mm-form-group">
                  <label className="mm-label">Gender Preference</label>
                  <select className="mm-input" value={form.gender} onChange={handleChange('gender')} style={{ background: 'var(--surface)', color: 'var(--text)' }}>
                    {GENDERS.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Hourly Rate */}
              <div className="col-12 col-md-4">
                <div className="mm-form-group">
                  <label className="mm-label"><FiDollarSign size={13} /> Hourly Rate (₹)</label>
                  <input type="number" step="0.01" className="mm-input" placeholder="e.g. 500" value={form.hourlyRate} onChange={handleChange('hourlyRate')} />
                </div>
              </div>

              {/* Experience Years */}
              <div className="col-12 col-md-4">
                <div className="mm-form-group">
                  <label className="mm-label"><FiAward size={13} /> Experience (Years)</label>
                  <input type="number" className="mm-input" placeholder="e.g. 3" value={form.experienceYears} onChange={handleChange('experienceYears')} />
                </div>
              </div>

              {/* Age */}
              <div className="col-12 col-md-4">
                <div className="mm-form-group">
                  <label className="mm-label">Age</label>
                  <input type="number" className="mm-input" placeholder="e.g. 28" value={form.age} onChange={handleChange('age')} />
                </div>
              </div>

              {/* Specialization */}
              <div className="col-12">
                <div className="mm-form-group">
                  <label className="mm-label">Specialization</label>
                  <input className="mm-input" placeholder="e.g. Historical sites, Food trails, Adventure" value={form.specialization} onChange={handleChange('specialization')} />
                </div>
              </div>

              {/* Profile Image URL */}
              <div className="col-12">
                <div className="mm-form-group">
                  <label className="mm-label"><FiImage size={13} /> Profile Image URL</label>
                  <input className="mm-input" placeholder="https://example.com/image.jpg" value={form.profileImageUrl} onChange={handleChange('profileImageUrl')} />
                </div>
              </div>

              {/* About / Bio */}
              <div className="col-12">
                <div className="mm-form-group">
                  <label className="mm-label">About Bio</label>
                  <textarea className="mm-input" rows={4} placeholder="Write a short description about the guide..." value={form.about} onChange={handleChange('about')} style={{ resize: 'vertical' }} />
                </div>
              </div>

              {/* Checkboxes: isAvailable & verified */}
              <div className="col-12" style={{ display: 'flex', gap: 24, marginTop: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="checkbox" checked={form.isAvailable} onChange={handleChange('isAvailable')} style={{ width: 16, height: 16, accentColor: 'var(--primary)' }} />
                  Is Available
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="checkbox" checked={form.verified} onChange={handleChange('verified')} style={{ width: 16, height: 16, accentColor: 'var(--primary)' }} />
                  Verified Guide
                </label>
              </div>

              {/* Submit Button */}
              <div className="col-12" style={{ marginTop: 24 }}>
                <button type="submit" className="btn-primary-mm" style={{ width: '100%', justifyContent: 'center', padding: '14px' }} disabled={loading}>
                  {loading ? <Spinner size={18} color="#fff" /> : <><FiPlusCircle size={16} /> Save Guide</>}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}