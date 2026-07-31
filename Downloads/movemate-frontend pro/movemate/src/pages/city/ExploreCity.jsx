import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSearch, FiMapPin } from 'react-icons/fi'

const popularCities = [
  { name: 'Mumbai', emoji: '🏙️', desc: 'City of Dreams', color: '#6C63FF' },
  { name: 'Delhi', emoji: '🕌', desc: 'Capital City', color: '#FF6584' },
  { name: 'Bangalore', emoji: '💻', desc: 'Silicon Valley of India', color: '#43E97B' },
  { name: 'Chennai', emoji: '🌊', desc: 'Gateway to South India', color: '#38F9D7' },
  { name: 'Hyderabad', emoji: '🍗', desc: 'City of Pearls', color: '#FFC107' },
  { name: 'Pune', emoji: '🎓', desc: 'Oxford of the East', color: '#A89CFF' },
  { name: 'Kolkata', emoji: '🎭', desc: 'Cultural Capital', color: '#FF9F43' },
  { name: 'Jaipur', emoji: '🏯', desc: 'Pink City', color: '#FF6584' },
  { name: 'Goa', emoji: '🏖️', desc: 'Beach Paradise', color: '#43E97B' },
  { name: 'Ahmedabad', emoji: '🕍', desc: 'Textile Capital', color: '#FFC107' },
  { name: 'Mysore', emoji: '👑', desc: 'City of Palaces', color: '#38F9D7' },
  { name: 'Chandigarh', emoji: '🌿', desc: 'City Beautiful', color: '#6C63FF' },
]

export default function ExploreCity() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const filtered = popularCities.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/explore/${encodeURIComponent(search.trim())}`)
  }

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--dark)' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--dark2), #1a1040)', padding: '80px 0 60px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="section-eyebrow" style={{ justifyContent: 'center' }}>City Explorer</div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: 16 }}>
              Explore <span className="gradient-text">India's Cities</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto 36px', fontSize: '1rem' }}>
              Discover attractions, top spots, and hidden gems in cities across India.
            </p>

            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, maxWidth: 500, margin: '0 auto', justifyContent: 'center' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <FiSearch size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="mm-input" style={{ paddingLeft: 40 }} placeholder="Search a city..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <button type="submit" className="btn-primary-mm">Explore</button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Cities Grid */}
      <div className="container mm-section">
        <div className="section-eyebrow">Popular Destinations</div>
        <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 32 }}>Choose Your City</h3>
        <div className="row g-4">
          {filtered.map(({ name, emoji, desc, color }, i) => (
            <motion.div key={name} className="col-6 col-md-4 col-lg-3"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}>
              <motion.div whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/explore/${name}`)}
                style={{
                  background: `${color}12`, border: `1px solid ${color}30`,
                  borderRadius: 16, padding: '28px 20px', cursor: 'pointer',
                  textAlign: 'center', transition: 'var(--transition)',
                  height: '100%'
                }}
                onMouseOver={e => e.currentTarget.style.borderColor = `${color}60`}
                onMouseOut={e => e.currentTarget.style.borderColor = `${color}30`}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{emoji}</div>
                <h5 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 6, color: 'var(--text-primary)' }}>{name}</h5>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{desc}</p>
                <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: '0.8rem', color, fontWeight: 600 }}>
                  <FiMapPin size={12} /> Explore
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🏙️</div>
            <h4>City not in list</h4>
            <p>Press Explore to search for "{search}"</p>
            <button onClick={() => navigate(`/explore/${search}`)} className="btn-primary-mm" style={{ marginTop: 16 }}>
              Explore {search}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
