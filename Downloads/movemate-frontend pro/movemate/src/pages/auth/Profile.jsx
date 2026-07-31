import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSave, FiArrowLeft } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../api/axiosConfig'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import { Spinner } from '../../components/common/Loaders'

export default function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  
  const [form, setForm] = useState({ 
    fullName: '', 
    email: '',
    age: '', 
    gender: '', 
    currentCity: '', 
    preferredCity: '', 
    foodPreference: '', 
    preferredLanguage: '', 
    budgetRange: '', 
    purposeOfStay: '', 
    profileImage: '',
    phone: '' 
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasProfile, setHasProfile] = useState(false)

  useEffect(() => {
    Promise.all([
      authService.getBasicInfo().catch(() => null),
      authService.getProfile().catch(() => null)
    ])
      .then(([basicRes, profileRes]) => {
        const basicData = basicRes?.data || {}
        const profileData = profileRes?.data || {}

        if (profileRes?.data) {
          setProfile(profileRes.data)
          setHasProfile(true)
        }

        setForm(f => ({
          ...f,
          ...profileData,
          fullName: profileData.fullName || basicData.name || user?.name || '',
          email: basicData.email || user?.email || '',
          phone: basicData.mobileNumber || ''
        }))
      })
      .finally(() => setLoading(false))
  }, [user])

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      let res;
      if (hasProfile) {
        res = await authService.updateProfile(form)
        toast.success('Profile updated!')
      } else {
        res = await authService.createProfile(form)
        toast.success('Profile created!')
        setHasProfile(true)
      }
      
      if (res?.data) {
        setProfile(res.data)
        setForm(f => ({
          ...f,
          ...res.data,
          fullName: res.data.fullName || f.fullName,
          email: f.email,
          phone: f.phone
        }))
      }
    } catch (err) {
      toast.error('Failed to save profile')
    } finally { 
      setSaving(false) 
    }
  }

  if (loading) {
    return (
      <div style={{ paddingTop: 150, minHeight: '100vh', background: 'var(--dark)', display: 'flex', justifyContent: 'center' }}>
        <Spinner size={40} color="#6C63FF" />
      </div>
    )
  }

  const initial = form.fullName?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || 'U'
  const completion = Object.values(form).filter(v => v && v.toString().length > 0).length
  const pct = Math.round((completion / Object.keys(form).length) * 100)

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh', background: 'var(--dark)' }}>
      <div className="container" style={{ maxWidth: 800, paddingTop: 30, paddingBottom: 60 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ marginBottom: 32 }}>
            <div className="section-eyebrow">My Account</div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800 }}>My Profile</h2>
          </div>

          <div className="mm-card" style={{ padding: 32, marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
              {form.profileImage
                ? <img src={form.profileImage} alt="Avatar" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(108,99,255,0.4)' }} />
                : <div className="mm-avatar" style={{ width: 80, height: 80, fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-light)', borderRadius: '50%', color: '#fff' }}>{initial}</div>
              }
              <div>
                <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 4 }}>{form.fullName || user?.name || 'User'}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>{form.email || user?.email}</p>
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>Profile {pct}% complete</div>
                  <div style={{ width: 150, height: 6, background: 'var(--surface)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'var(--gradient-primary)', borderRadius: 3, transition: 'width 0.5s' }} />
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="mm-form-group">
                    <label className="mm-label">Full Name (Account)</label>
                    <input className="mm-input" value={form.fullName || ''} readOnly style={{ opacity: 0.7, cursor: 'not-allowed', backgroundColor: 'rgba(255,255,255,0.03)' }} />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mm-form-group">
                    <label className="mm-label">Email (Account)</label>
                    <input className="mm-input" value={form.email || ''} readOnly style={{ opacity: 0.7, cursor: 'not-allowed', backgroundColor: 'rgba(255,255,255,0.03)' }} />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mm-form-group">
                    <label className="mm-label">Phone (Account)</label>
                    <input className="mm-input" value={form.phone || ''} readOnly style={{ opacity: 0.7, cursor: 'not-allowed', backgroundColor: 'rgba(255,255,255,0.03)' }} />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mm-form-group">
                    <label className="mm-label">Age</label>
                    <input type="number" className="mm-input" placeholder="Your age" value={form.age || ''} onChange={set('age')} />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mm-form-group">
                    <label className="mm-label">Gender</label>
                    <input className="mm-input" placeholder="Gender" value={form.gender || ''} onChange={set('gender')} />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mm-form-group">
                    <label className="mm-label">Current City</label>
                    <input className="mm-input" placeholder="Current city" value={form.currentCity || ''} onChange={set('currentCity')} />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mm-form-group">
                    <label className="mm-label">Preferred City</label>
                    <input className="mm-input" placeholder="Preferred city" value={form.preferredCity || ''} onChange={set('preferredCity')} />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mm-form-group">
                    <label className="mm-label">Food Preference</label>
                    <input className="mm-input" placeholder="e.g., Veg, Non-Veg" value={form.foodPreference || ''} onChange={set('foodPreference')} />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mm-form-group">
                    <label className="mm-label">Preferred Language</label>
                    <input className="mm-input" placeholder="Preferred language" value={form.preferredLanguage || ''} onChange={set('preferredLanguage')} />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mm-form-group">
                    <label className="mm-label">Budget Range</label>
                    <input className="mm-input" placeholder="Budget range" value={form.budgetRange || ''} onChange={set('budgetRange')} />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mm-form-group">
                    <label className="mm-label">Purpose of Stay</label>
                    <input className="mm-input" placeholder="Purpose of stay" value={form.purposeOfStay || ''} onChange={set('purposeOfStay')} />
                  </div>
                </div>

                <div className="col-12">
                  <div className="mm-form-group">
                    <label className="mm-label">Profile Image URL</label>
                    <input className="mm-input" placeholder="https://..." value={form.profileImage || ''} onChange={set('profileImage')} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: 20 }}>
                <button type="submit" className="btn-primary-mm" disabled={saving} style={{ flex: 1 }}>
                  {saving ? <Spinner size={18} color="#fff" /> : <><FiSave size={15} /> {hasProfile ? 'Update' : 'Create'} Profile</>}
                </button>
                <button 
                  type="button" 
                  onClick={() => navigate(-1)} 
                  className="btn-secondary-mm" 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '6px', 
                    padding: '0 20px', 
                    background: 'var(--surface-light)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    color: '#fff', 
                    borderRadius: '8px',
                    cursor: 'pointer' 
                  }}
                >
                  <FiArrowLeft size={15} /> Back
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}