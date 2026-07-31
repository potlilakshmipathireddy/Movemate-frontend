import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSave, FiArrowLeft } from 'react-icons/fi'
import { accommodationService } from '../../api/axiosConfig'
import { toast } from 'react-toastify'
import { Spinner } from '../../components/common/Loaders'

const initForm = {
  title: '', description: '', city: '', area: '', address: '', rent: '',
  gender: 'ANY', roomType: 'SINGLE', accommodationType: 'NON_AC',
  availableBeds: 1, ownerName: '', ownerContactNumber: '', imageUrl: '',
  wifiAvailable: false, parkingAvailable: false, foodAvailable: false, attachedBathroom: false,
}

export default function AccommodationForm({ editId = null, initialData = null }) {
  const [form, setForm] = useState(initForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (initialData) setForm({ ...initForm, ...initialData })
  }, [initialData])

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))
  const toggle = (field) => () => setForm(f => ({ ...f, [field]: !f[field] }))

  const validate = () => {
    const e = {}
    if (!form.title) e.title = 'Title is required'
    if (!form.description) e.description = 'Description is required'
    if (!form.city) e.city = 'City is required'
    if (!form.area) e.area = 'Area is required'
    if (!form.address) e.address = 'Address is required'
    if (!form.rent || form.rent <= 0) e.rent = 'Valid rent is required'
    if (!form.ownerName) e.ownerName = 'Owner name is required'
    if (form.ownerContactNumber && !/^[6-9][0-9]{9}$/.test(form.ownerContactNumber)) e.ownerContactNumber = 'Invalid mobile number'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return toast.error('Please fix the errors')
    setLoading(true)
    const payload = { ...form, rent: parseFloat(form.rent), availableBeds: parseInt(form.availableBeds) }
    try {
      if (editId) {
        await accommodationService.update(editId, payload)
        toast.success('Accommodation updated!')
      } else {
        await accommodationService.create(payload)
        toast.success('Accommodation added!')
      }
      navigate('/accommodation/my')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save accommodation')
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
        <div style={{
          position: 'absolute', top: 2, left: form[field] ? 22 : 2,
          width: 18, height: 18, borderRadius: '50%',
          background: '#fff', transition: 'var(--transition)'
        }} />
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
            <div className="section-eyebrow">{editId ? 'Edit' : 'Add New'}</div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800 }}>
              {editId ? 'Update Accommodation' : 'List Your Property'}
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mm-card" style={{ padding: 32, marginBottom: 20 }}>
              <h5 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 24 }}>Basic Information</h5>
              <div className="row g-3">
                <div className="col-12">
                  <div className="mm-form-group">
                    <label className="mm-label">Title *</label>
                    <input className="mm-input" placeholder="e.g. Spacious 2BHK in Koramangala" value={form.title} onChange={set('title')} />
                    {errors.title && <span className="mm-error">{errors.title}</span>}
                  </div>
                </div>
                <div className="col-12">
                  <div className="mm-form-group">
                    <label className="mm-label">Description *</label>
                    <textarea className="mm-input" rows={4} placeholder="Describe the property in detail..." value={form.description} onChange={set('description')} style={{ resize: 'vertical' }} />
                    {errors.description && <span className="mm-error">{errors.description}</span>}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mm-form-group">
                    <label className="mm-label">City *</label>
                    <input className="mm-input" placeholder="e.g. Bangalore" value={form.city} onChange={set('city')} />
                    {errors.city && <span className="mm-error">{errors.city}</span>}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mm-form-group">
                    <label className="mm-label">Area *</label>
                    <input className="mm-input" placeholder="e.g. Koramangala" value={form.area} onChange={set('area')} />
                    {errors.area && <span className="mm-error">{errors.area}</span>}
                  </div>
                </div>
                <div className="col-12">
                  <div className="mm-form-group">
                    <label className="mm-label">Full Address *</label>
                    <input className="mm-input" placeholder="Street address" value={form.address} onChange={set('address')} />
                    {errors.address && <span className="mm-error">{errors.address}</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="mm-card" style={{ padding: 32, marginBottom: 20 }}>
              <h5 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 24 }}>Property Details</h5>
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="mm-form-group">
                    <label className="mm-label">Monthly Rent (₹) *</label>
                    <input type="number" className="mm-input" placeholder="e.g. 8000" value={form.rent} onChange={set('rent')} min="0" />
                    {errors.rent && <span className="mm-error">{errors.rent}</span>}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mm-form-group">
                    <label className="mm-label">Available Beds *</label>
                    <input type="number" className="mm-input" placeholder="1" value={form.availableBeds} onChange={set('availableBeds')} min="1" />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mm-form-group">
                    <label className="mm-label">Gender Preference</label>
                    <select className="mm-input" value={form.gender} onChange={set('gender')}>
                     <option value="">Select Gender</option>
                    {[

                      {value:'ANY', label: 'Any'},
                      {value:'MALE', label: 'Male'},
                      {value:'FEMALE', label: 'Female'},
                      {value:'OTHER', label: 'Other'},
                    ].map(g=><option key={g.value} value={g.value}>{g.label}</option>)
                    }
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mm-form-group">
                    <label className="mm-label">Room Type</label>
                    <select className="mm-input" value={form.roomType} onChange={set('roomType')}>
                    <option value="">Select Room Type</option>
                    {[
                      {value:'SINGLE', label: 'Single Room'},
                      {value:'PRIVATE', label: 'Private Room'},
                      {value:'TWO_SHARING', label: 'Two Sharing'},
                      {value:'THREE_SHARING', label: 'Three Sharing'},
                      {value:'SHARED', label: 'Shared Room'},
                    ].map(rt => <option key={rt.value} value={rt.value}>{rt.label}</option>)
                    }
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mm-form-group">
                    <label className="mm-label">AC Type</label>
                    <select className="mm-input" value={form.accommodationType} onChange={set('accommodationType')}>
                    <option value="">Select AC Type</option>
                    {[
                      {value:'AC', label: 'AC'},
                      {value:'NON_AC', label: 'Non-AC'},
                    ].map(at => <option key={at.value} value={at.value}>{at.label}</option>)
                    }
                    </select>
                  </div>
                </div>
                <div className="col-12">
                  <div className="mm-form-group">
                    <label className="mm-label">Image URL</label>
                    <input className="mm-input" placeholder="https://..." value={form.imageUrl} onChange={set('imageUrl')} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mm-card" style={{ padding: 32, marginBottom: 20 }}>
              <h5 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 24 }}>Amenities</h5>
              <div className="row g-3">
                {[
                  ['wifiAvailable', 'WiFi Available'],
                  ['parkingAvailable', 'Parking Available'],
                  ['foodAvailable', 'Food Available'],
                  ['attachedBathroom', 'Attached Bathroom'],
                ].map(([field, label]) => (
                  <div key={field} className="col-6 col-md-3">
                    <BoolToggle field={field} label={label} />
                  </div>
                ))}
              </div>
            </div>

            <div className="mm-card" style={{ padding: 32, marginBottom: 24 }}>
              <h5 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 24 }}>Owner Contact</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="mm-form-group">
                    <label className="mm-label">Owner Name *</label>
                    <input className="mm-input" placeholder="Owner's name" value={form.ownerName} onChange={set('ownerName')} />
                    {errors.ownerName && <span className="mm-error">{errors.ownerName}</span>}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mm-form-group">
                    <label className="mm-label">Contact Number</label>
                    <input className="mm-input" placeholder="10-digit mobile" value={form.ownerContactNumber} onChange={set('ownerContactNumber')} maxLength={10} />
                    {errors.ownerContactNumber && <span className="mm-error">{errors.ownerContactNumber}</span>}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" className="btn-primary-mm" disabled={loading}>
                {loading ? <Spinner size={18} color="#fff" /> : <><FiSave size={16} /> {editId ? 'Update' : 'Add Listing'}</>}
              </button>
              <button type="button" className="btn-ghost-mm" onClick={() => navigate(-1)}>Cancel</button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
