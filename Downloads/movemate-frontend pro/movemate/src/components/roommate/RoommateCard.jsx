import { Link } from 'react-router-dom'
import { FiMapPin, FiBriefcase, FiDollarSign, FiPhone } from 'react-icons/fi'

const genderColor = { MALE: '#6C63FF', FEMALE: '#FF6584', ANY: '#43E97B' }

export default function RoommateCard({ item }) {
  if (!item) return null
  const {
    id, fullName, age, gender, occupation, city, area, budget,
    foodPreference, smoking, drinking, pets, cleanliness, profileImage,
    companyOrCollege
  } = item

  const initial = fullName?.[0]?.toUpperCase() || 'R'

  return (
    <Link to={`/roommates/${id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <div className="mm-card" style={{ padding: 24, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ flexShrink: 0 }}>
            {profileImage ? (
              <img src={profileImage} alt={fullName}
                style={{ width: 54, height: 54, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(108,99,255,0.3)' }}
                onError={e => e.target.style.display='none'} />
            ) : (
              <div className="mm-avatar" style={{ width: 54, height: 54, fontSize: '1.2rem',
                background: `linear-gradient(135deg, ${genderColor[gender] || '#6C63FF'}, #FF6584)` }}>
                {initial}
              </div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <h6 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 4, fontSize: '0.95rem' }}>{fullName}</h6>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span className="mm-badge mm-badge-primary" style={{ fontSize: '0.68rem' }}>{age}y</span>
              <span className="mm-badge" style={{ fontSize: '0.68rem',
                background: `${genderColor[gender] || '#6C63FF'}20`,
                color: genderColor[gender] || '#6C63FF',
                border: `1px solid ${genderColor[gender] || '#6C63FF'}35` }}>{gender}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <FiBriefcase size={13} style={{ flexShrink: 0 }} />
            <span>{occupation}{companyOrCollege ? ` · ${companyOrCollege}` : ''}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <FiMapPin size={13} style={{ flexShrink: 0 }} />
            <span>{area}, {city}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <FiDollarSign size={13} style={{ flexShrink: 0 }} />
            <span>Budget: ₹{budget?.toLocaleString()}/mo</span>
          </div>
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {foodPreference && <span className="mm-badge mm-badge-success" style={{ fontSize: '0.68rem' }}>{foodPreference}</span>}
          {smoking && <span className="mm-badge mm-badge-warning" style={{ fontSize: '0.68rem' }}>Smoker</span>}
          {drinking && <span className="mm-badge mm-badge-info" style={{ fontSize: '0.68rem' }}>Drinker</span>}
          {pets && <span className="mm-badge mm-badge-info" style={{ fontSize: '0.68rem' }}>🐾 Pets</span>}
        </div>

        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cleanliness}</span>
          <span className="btn-ghost-mm" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
            <FiPhone size={12} /> View
          </span>
        </div>
      </div>
    </Link>
  )
}
