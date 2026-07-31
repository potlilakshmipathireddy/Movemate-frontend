import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMapPin, FiUser, FiPhone, FiWifi, FiArrowLeft, FiEdit, FiTrash2, FiBookmark } from 'react-icons/fi'
import { MdBed, MdOutlineBathroom } from 'react-icons/md'
import { GiMeal } from 'react-icons/gi'
import { FaCar } from 'react-icons/fa'
import { accommodationService, savedPlaceService } from '../../api/axiosConfig'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import { SkeletonCard } from '../../components/common/Loaders'

export default function AccommodationDetail() {
  const { id } = useParams()
  const { isAuthenticated, isOwner } = useAuth() // 1. Destructure isOwner along with isAuthenticated
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    accommodationService.getById(id)
      .then(res => setItem(res.data))
      .catch(() => toast.error('Could not load accommodation'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Delete this accommodation?')) return
    setDeleting(true)
    try {
      await accommodationService.delete(id)
      toast.success('Accommodation deleted')
      navigate('/accommodation/my')
    } catch {
      toast.error('Could not delete')
    } finally {
      setDeleting(false)
    }
  }

  const handleSave = async () => {
    if (!isAuthenticated) return toast.error('Please login to save places')
    setSaving(true)
    try {
      await savedPlaceService.save({ placeId: id, placeType: 'ACCOMMODATION', placeName: item.title, placeCity: item.city })
      toast.success('Saved to your list!')
    } catch {
      toast.error('Could not save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div style={{ paddingTop: 90, minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: 30 }}>
        <div className="row g-4"><div className="col-12 col-lg-8"><SkeletonCard /></div></div>
      </div>
    </div>
  )

  if (!item) return (
    <div style={{ paddingTop: 90, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="empty-state"><div className="empty-icon">🏠</div><h4>Accommodation not found</h4><Link to="/accommodation" className="btn-primary-mm" style={{ marginTop: 16, display: 'inline-flex' }}>Back to List</Link></div>
    </div>
  )

  const amenities = [
    { icon: FiWifi, label: 'WiFi', active: item.wifiAvailable, color: '#43E97B' },
    { icon: FaCar, label: 'Parking', active: item.parkingAvailable, color: '#38F9D7' },
    { icon: GiMeal, label: 'Food', active: item.foodAvailable, color: '#FFC107' },
    { icon: MdOutlineBathroom, label: 'Bathroom', active: item.attachedBathroom, color: '#FF6584' },
  ]

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--dark)' }}>
      {/* Hero */}
      <div style={{ height: 350, background: item.imageUrl ? `url(${item.imageUrl}) center/cover` : 'linear-gradient(135deg, var(--surface), var(--surface2))', position: 'relative' }}>
        {!item.imageUrl && <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem' }}>🏠</div>}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(13,14,26,0.3), rgba(13,14,26,0.8))' }} />
        <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'flex-end', paddingBottom: 30, position: 'relative' }}>
          <div>
            <button onClick={() => navigate(-1)} className="btn-ghost-mm" style={{ marginBottom: 16, fontSize: '0.85rem' }}>
              <FiArrowLeft size={14} /> Back
            </button>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
              <span className="mm-badge mm-badge-primary">{item.accommodationType}</span>
              <span className="mm-badge mm-badge-success">{item.roomType}</span>
              <span className="mm-badge mm-badge-info">{item.gender}</span>
            </div>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>{item.title}</h1>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div className="row g-4">
          {/* Main content */}
          <div className="col-lg-8">
            <div className="mm-card" style={{ padding: 32, marginBottom: 24 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <FiMapPin size={15} /> {item.address}, {item.area}, {item.city}
                </div>
              </div>

              <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 12 }}>About This Place</h4>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 24 }}>{item.description}</p>

              {/* Details grid */}
              <div className="row g-3 mb-4">
                {[
                  { label: 'Available Beds', val: item.availableBeds, icon: MdBed },
                  { label: 'Gender Preference', val: item.gender },
                  { label: 'Room Type', val: item.roomType },
                  { label: 'AC/Non-AC', val: item.accommodationType },
                ].map(({ label, val, icon: Icon }) => (
                  <div key={label} className="col-6">
                    <div style={{ background: 'var(--surface)', borderRadius: 10, padding: '14px 16px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
                      <div style={{ fontWeight: 700 }}>{val}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Amenities */}
              <h5 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 16 }}>Amenities</h5>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {amenities.map(({ icon: Icon, label, active, color }) => (
                  <div key={label} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px',
                    background: active ? `${color}15` : 'var(--surface)',
                    border: `1px solid ${active ? color + '40' : 'var(--border)'}`,
                    borderRadius: 8, opacity: active ? 1 : 0.4,
                    fontSize: '0.85rem', color: active ? color : 'var(--text-muted)'
                  }}>
                    <Icon size={16} color={active ? color : 'currentColor'} />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="mm-card" style={{ padding: 28, position: 'sticky', top: 100 }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif',
                  background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  ₹{item.rent?.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>per month</div>
              </div>

              <hr className="mm-divider" />

              <div style={{ marginBottom: 20 }}>
                <h6 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 12 }}>Owner Details</h6>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div className="mm-avatar" style={{ width: 42, height: 42 }}>{item.ownerName?.[0]?.toUpperCase()}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.ownerName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Property Owner</div>
                  </div>
                </div>
                {item.ownerContactNumber && (
                  <a href={`tel:${item.ownerContactNumber}`} className="btn-primary-mm" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>
                    <FiPhone size={15} /> {item.ownerContactNumber}
                  </a>
                )}
              </div>

              <button onClick={handleSave} disabled={saving} className="btn-ghost-mm" style={{ width: '100%', justifyContent: 'center' }}>
                <FiBookmark size={15} /> {saving ? 'Saving...' : 'Save Place'}
              </button>

              {/* 2. Changed isAuthenticated to isOwner so Edit/Delete only show for owners */}
              {isOwner && (
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <Link to={`/accommodation/edit/${id}`} className="btn-outline-mm" style={{ flex: 1, justifyContent: 'center' }}>
                    <FiEdit size={14} /> Edit
                  </Link>
                  <button onClick={handleDelete} disabled={deleting} className="btn-danger-mm" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <FiTrash2 size={14} /> {deleting ? '...' : 'Delete'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}