import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMapPin, FiUsers, FiNavigation, FiCompass, FiArrowRight, FiSearch, FiStar, FiHome, FiMap } from 'react-icons/fi'
import { accommodationService, roommateService } from '../api/axiosConfig'
import AccommodationCard from '../components/accommodation/AccommodationCard'
import RoommateCard from '../components/roommate/RoommateCard'
import { SkeletonCard } from '../components/common/Loaders'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } })
}

const features = [
  { icon: FiHome, title: 'Find Accommodation', desc: 'Browse PGs, flats, and rooms with detailed amenity info.', to: '/accommodation', color: '#6C63FF' },
  { icon: FiUsers, title: 'Find Roommates', desc: 'Connect with compatible roommates by lifestyle and budget.', to: '/roommates', color: '#FF6584' },
  { icon: FiNavigation, title: 'Plan Your Trip', desc: 'AI-powered travel planning with budgets and itineraries.', to: '/travel', color: '#43E97B' },
  { icon: FiCompass, title: 'Explore the City', desc: 'Discover top attractions, hidden gems, and local culture.', to: '/explore', color: '#38F9D7' },
  { icon: FiMap, title: 'Local Guides', desc: 'Book expert local guides for an authentic experience.', to: '/guides', color: '#FFC107' },
  { icon: FiStar, title: 'Reviews', desc: 'Read genuine reviews from the MOVEMATE community.', to: '/reviews', color: '#A89CFF' },
]

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad']

export default function Home() {
  const [searchCity, setSearchCity] = useState('')
  const [latestAccommodations, setLatestAccommodations] = useState([])
  const [latestRoommates, setLatestRoommates] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      accommodationService.getLatest(),
      roommateService.getLatest(),
      roommateService.getCount()
    ]).then(([acc, rm, cnt]) => {
      setLatestAccommodations(acc.data?.slice(0, 6) || [])
      setLatestRoommates(rm.data?.slice(0, 6) || [])
      setCount(cnt.data || 0)
    }).finally(() => setLoading(false))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchCity.trim()) navigate(`/accommodation?city=${encodeURIComponent(searchCity.trim())}`)
  }

  return (
    <div>
      {/* Hero */}
      <section style={{
        minHeight: '100vh',
        background: 'var(--gradient-hero)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 100,
      }}>
        {/* Orbs */}
        <div style={{ position: 'absolute', top: '15%', left: '10%', width: 400, height: 400, background: 'rgba(108,99,255,0.12)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 350, height: 350, background: 'rgba(255,101,132,0.1)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, background: 'rgba(67,233,123,0.04)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />

        <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="mm-badge mm-badge-primary" style={{ marginBottom: 24, fontSize: '0.8rem' }}>
              🏠 Your Smart Moving Companion
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
            style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 24 }}>
            Find Homes.<br />
            <span className="gradient-text">Find Roommates.</span><br />
            Move Smarter.
          </motion.h1>

          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.7 }}>
            MOVEMATE brings together accommodation listings, roommate matching, travel planning, and city exploration in one seamless platform.
          </motion.p>

          {/* Search */}
          <motion.form variants={fadeUp} initial="hidden" animate="visible" custom={3}
            onSubmit={handleSearch}
            style={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--border)',
              borderRadius: 60,
              padding: '8px 8px 8px 24px',
              display: 'flex',
              alignItems: 'center',
              maxWidth: 520,
              margin: '0 auto 40px',
              gap: 8,
            }}>
            <FiSearch size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <input
              value={searchCity}
              onChange={e => setSearchCity(e.target.value)}
              placeholder="Search by city, area..."
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.95rem', fontFamily: 'inherit' }}
            />
            <button type="submit" className="btn-primary-mm" style={{ padding: '12px 24px' }}>
              Search
            </button>
          </motion.form>

          {/* Popular cities */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 60 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: 4, alignSelf: 'center' }}>Popular:</span>
            {cities.slice(0, 6).map(city => (
              <button key={city} onClick={() => navigate(`/accommodation?city=${city}`)}
                className="btn-ghost-mm" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                <FiMapPin size={12} /> {city}
              </button>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}
            style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
            {[
              { val: '500+', label: 'Listings' },
              { val: count || '200+', label: 'Roommates' },
              { val: '50+', label: 'Cities' },
              { val: '4.9★', label: 'Rating' },
            ].map(({ val, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.8rem', fontWeight: 800,
                  background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{val}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="mm-section" style={{ background: 'var(--dark2)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-eyebrow" style={{ justifyContent: 'center' }}>Everything You Need</div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>One Platform, <span className="gradient-text">Endless Possibilities</span></h2>
            <p style={{ color: 'var(--text-muted)', marginTop: 12, maxWidth: 500, margin: '12px auto 0' }}>From finding a room to planning your entire move, MOVEMATE has every tool you need.</p>
          </div>
          <div className="row g-4">
            {features.map(({ icon: Icon, title, desc, to, color }, i) => (
              <motion.div key={title} className="col-12 col-md-6 col-lg-4"
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.1}>
                <Link to={to} style={{ display: 'block', height: '100%', textDecoration: 'none' }}>
                  <div className="mm-card" style={{ padding: 28, height: '100%' }}>
                    <div style={{
                      width: 52, height: 52,
                      background: `${color}20`,
                      borderRadius: 14,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: 20,
                    }}>
                      <Icon size={24} color={color} />
                    </div>
                    <h5 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 8 }}>{title}</h5>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>{desc}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 20, color, fontSize: '0.85rem', fontWeight: 600 }}>
                      Explore <FiArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Accommodations */}
      <section className="mm-section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="section-eyebrow">Fresh Listings</div>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>Latest <span className="gradient-text">Accommodations</span></h2>
            </div>
            <Link to="/accommodation" className="btn-outline-mm">View All <FiArrowRight size={16} /></Link>
          </div>
          {loading ? (
            <div className="row g-4">{Array.from({length:6}).map((_,i)=><div key={i} className="col-12 col-md-6 col-lg-4"><SkeletonCard /></div>)}</div>
          ) : latestAccommodations.length ? (
            <div className="row g-4">
              {latestAccommodations.map((item, i) => (
                <motion.div key={item.id} className="col-12 col-md-6 col-lg-4"
                  variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.1}>
                  <AccommodationCard item={item} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🏠</div>
              <h4>No accommodations yet</h4>
              <p>Check back soon for new listings.</p>
            </div>
          )}
        </div>
      </section>

      {/* Latest Roommates */}
      <section className="mm-section" style={{ background: 'var(--dark2)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="section-eyebrow">New Profiles</div>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>Latest <span className="gradient-text">Roommates</span></h2>
            </div>
            <Link to="/roommates" className="btn-outline-mm">View All <FiArrowRight size={16} /></Link>
          </div>
          {loading ? (
            <div className="row g-4">{Array.from({length:6}).map((_,i)=><div key={i} className="col-12 col-md-6 col-lg-4"><SkeletonCard /></div>)}</div>
          ) : latestRoommates.length ? (
            <div className="row g-4">
              {latestRoommates.map((item, i) => (
                <motion.div key={item.id} className="col-12 col-md-6 col-lg-4"
                  variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.1}>
                  <RoommateCard item={item} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h4>No roommates yet</h4>
              <p>Be the first to post your profile!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="mm-section">
        <div className="container text-center">
          <div style={{
            background: 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(255,101,132,0.1))',
            border: '1px solid rgba(108,99,255,0.3)',
            borderRadius: 24, padding: '60px 40px',
          }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: 16 }}>
              Ready to <span className="gradient-text">Move Smarter?</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
              Join thousands of happy movers who found their perfect home through MOVEMATE.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn-primary-mm">Get Started Free</Link>
              <Link to="/accommodation" className="btn-outline-mm">Browse Listings</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
