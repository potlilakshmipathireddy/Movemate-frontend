import { Link } from 'react-router-dom'
import { FiMapPin, FiWifi, FiTruck, FiHome, FiUser } from 'react-icons/fi'
import { MdOutlineBathroom } from 'react-icons/md'
import { GiMeal } from 'react-icons/gi'

const roomTypeColor = { SINGLE: '#6C63FF', DOUBLE: '#FF6584', TRIPLE: '#43E97B', DORMITORY: '#FFC107' }

export default function AccommodationCard({ item }) {
  if (!item) return null
  const {
    id, title, city, area, rent, gender, roomType, accommodationType,
    availableBeds, ownerName, wifiAvailable, parkingAvailable, foodAvailable, attachedBathroom,
    imageUrl
  } = item

  return (
    <Link to={`/accommodation/${id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <div className="mm-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Image */}
        <div style={{ position: 'relative', height: 190, overflow: 'hidden', flexShrink: 0 }}>
          {imageUrl ? (
            <img src={imageUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }} />
          ) : null}
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, var(--surface), var(--surface2))',
            display: imageUrl ? 'none' : 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '3rem'
          }}>🏠</div>

          {/* Badges */}
          <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
            <span className="mm-badge mm-badge-primary" style={{ fontSize: '0.7rem' }}>{accommodationType}</span>
          </div>
          <div style={{ position: 'absolute', top: 10, right: 10 }}>
            <span className="mm-badge" style={{
              background: `${roomTypeColor[roomType] || '#6C63FF'}25`,
              color: roomTypeColor[roomType] || '#6C63FF',
              border: `1px solid ${roomTypeColor[roomType] || '#6C63FF'}40`,
              fontSize: '0.7rem'
            }}>{roomType}</span>
          </div>
        </div>

        <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h6 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 8, fontSize: '1rem', lineHeight: 1.3 }}>{title}</h6>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: 12 }}>
            <FiMapPin size={12} />
            <span>{area}, {city}</span>
          </div>

          {/* Amenities */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            {wifiAvailable && <span title="WiFi" style={{ fontSize: '0.75rem', color: '#43E97B' }}><FiWifi size={14} /></span>}
            {parkingAvailable && <span title="Parking" style={{ fontSize: '0.75rem', color: '#38F9D7' }}><FiTruck size={14} /></span>}
            {foodAvailable && <span title="Food" style={{ fontSize: '0.75rem', color: '#FFC107' }}><GiMeal size={14} /></span>}
            {attachedBathroom && <span title="Bathroom" style={{ fontSize: '0.75rem', color: '#FF6584' }}><MdOutlineBathroom size={14} /></span>}
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif',
                background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ₹{rent?.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>/ month</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <FiUser size={12} />
              <span>{gender}</span>
              <span>•</span>
              <span>{availableBeds} bed{availableBeds > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
