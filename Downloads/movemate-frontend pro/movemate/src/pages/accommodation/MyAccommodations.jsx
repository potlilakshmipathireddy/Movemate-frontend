import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPlus } from 'react-icons/fi'
import { accommodationService } from '../../api/axiosConfig'
import AccommodationCard from '../../components/accommodation/AccommodationCard'
import { SkeletonGrid } from '../../components/common/Loaders'
import { toast } from 'react-toastify'

export default function MyAccommodations() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    accommodationService.getMy().then(res => setItems(res.data || [])).catch(() => toast.error('Could not load listings')).finally(() => setLoading(false))
  }

  useEffect(load, [])

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh', background: 'var(--dark)' }}>
      <div className="container" style={{ paddingTop: 30, paddingBottom: 60 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="section-eyebrow">My Listings</div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800 }}>My <span className="gradient-text">Accommodations</span></h2>
            </div>
            <Link to="/accommodation/add" className="btn-primary-mm"><FiPlus size={16} /> Add New</Link>
          </div>
        </motion.div>

        {loading ? <SkeletonGrid /> : items.length ? (
          <div className="row g-4">
            {items.map((item, i) => (
              <motion.div key={item.id} className="col-12 col-md-6 col-lg-4"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <AccommodationCard item={item} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🏠</div>
            <h4>No listings yet</h4>
            <p>You haven't posted any accommodations. Start listing your property!</p>
            <Link to="/accommodation/add" className="btn-primary-mm" style={{ display: 'inline-flex', marginTop: 16 }}>
              <FiPlus size={16} /> Add First Listing
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
