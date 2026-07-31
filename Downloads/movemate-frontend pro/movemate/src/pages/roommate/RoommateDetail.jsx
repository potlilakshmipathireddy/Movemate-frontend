import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMapPin, FiBriefcase, FiPhone, FiCalendar, FiEdit, FiTrash2, FiArrowLeft, FiBookmark } from 'react-icons/fi'
import { roommateService, savedPlaceService } from '../../api/axiosConfig'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import { SkeletonCard } from '../../components/common/Loaders'

export default function RoommateDetail() {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    roommateService.getById(id).then(res => setItem(res.data)).catch(() => toast.error('Could not load profile')).finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Delete this roommate profile?')) return
    try { await roommateService.delete(id); toast.success('Profile deleted'); navigate('/roommates/my') }
    catch { toast.error('Could not delete') }
  }

  const handleSave = async () => {
    if (!isAuthenticated) return toast.error('Please login')
    try { await savedPlaceService.save({ placeId: id, placeType: 'ROOMMATE', placeName: item.fullName, placeCity: item.city }); toast.success('Saved!') }
    catch { toast.error('Could not save') }
  }

  if (loading) return <div style={{ paddingTop: 100 }}><div className="container"><SkeletonCard /></div></div>
  if (!item) return <div style={{ paddingTop: 100 }}><div className="container empty-state"><div className="empty-icon">👤</div><h4>Profile not found</h4></div></div>

  const { fullName, age, gender, occupation, companyOrCollege, city, area, budget, moveInDate, phoneNumber, about, foodPreference, smoking, drinking, pets, sleepSchedule, cleanliness, profileImage } = item
  const initial = fullName?.[0]?.toUpperCase()

  const tags = [
    foodPreference, sleepSchedule, cleanliness,
    smoking && 'Smoker', drinking && 'Drinker', pets && '🐾 Pets'
  ].filter(Boolean)

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh', background: 'var(--dark)' }}>
      <div className="container" style={{ paddingTop: 30, paddingBottom: 60 }}>
        <button onClick={() => navigate(-1)} className="btn-ghost-mm" style={{ marginBottom: 24, fontSize: '0.85rem' }}>
          <FiArrowLeft size={14} /> Back
        </button>
        <div className="row g-4">
          <div className="col-lg-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mm-card" style={{ padding: 32 }}>
              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap' }}>
                {profileImage
                  ? <img src={profileImage} alt={fullName} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(108,99,255,0.4)', flexShrink: 0 }} />
                  : <div className="mm-avatar" style={{ width: 80, height: 80, fontSize: '2rem', flexShrink: 0 }}>{initial}</div>
                }
                <div>
                  <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, marginBottom: 8 }}>{fullName}</h2>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span className="mm-badge mm-badge-primary">{age} years</span>
                    <span className="mm-badge mm-badge-success">{gender}</span>
                  </div>
                </div>
              </div>

              <div className="row g-3 mb-4">
                {[
                  { icon: FiBriefcase, label: 'Occupation', val: `${occupation}${companyOrCollege ? ' · ' + companyOrCollege : ''}` },
                  { icon: FiMapPin, label: 'Location', val: `${area}, ${city}` },
                  { icon: FiCalendar, label: 'Move-in Date', val: moveInDate },
                  { icon: null, label: 'Budget', val: `₹${budget?.toLocaleString()}/month` },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} className="col-sm-6">
                    <div style={{ background: 'var(--surface)', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                      {Icon && <Icon size={16} color="var(--primary-light)" />}
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{val}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {about && (
                <>
                  <h5 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 12 }}>About Me</h5>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 24 }}>{about}</p>
                </>
              )}

              <h5 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 12 }}>Lifestyle</h5>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {tags.map(t => <span key={t} className="mm-badge mm-badge-info">{t}</span>)}
              </div>
            </motion.div>
          </div>

          <div className="col-lg-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="mm-card" style={{ padding: 28, position: 'sticky', top: 100 }}>
              <h5 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 16 }}>Contact</h5>
              {phoneNumber && (
                <a href={`tel:${phoneNumber}`} className="btn-primary-mm" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', marginBottom: 10 }}>
                  <FiPhone size={15} /> {phoneNumber}
                </a>
              )}
              <button onClick={handleSave} className="btn-ghost-mm" style={{ width: '100%', justifyContent: 'center', marginBottom: 16 }}>
                <FiBookmark size={15} /> Save Profile
              </button>
              {isAuthenticated && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link to={`/roommates/edit/${id}`} className="btn-outline-mm" style={{ flex: 1, justifyContent: 'center' }}>
                    <FiEdit size={14} /> Edit
                  </Link>
                  <button onClick={handleDelete} className="btn-danger-mm" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <FiTrash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
