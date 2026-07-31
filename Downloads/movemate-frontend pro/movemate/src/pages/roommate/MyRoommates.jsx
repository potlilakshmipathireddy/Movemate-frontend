import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import { roommateService } from '../../api/axiosConfig'
import RoommateCard from '../../components/roommate/RoommateCard'
import { SkeletonGrid } from '../../components/common/Loaders'
import { toast } from 'react-toastify'

export default function MyRoommates() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => { setLoading(true); roommateService.getMy().then(r => setItems(r.data||[])).catch(()=>toast.error('Could not load')).finally(()=>setLoading(false)) }
  useEffect(load, [])

  const deleteAll = async () => {
    if (!window.confirm('Delete all your roommate profiles?')) return
    try { await roommateService.deleteAll(); toast.success('All profiles deleted'); load() } catch { toast.error('Could not delete') }
  }

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh', background: 'var(--dark)' }}>
      <div className="container" style={{ paddingTop: 30, paddingBottom: 60 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="section-eyebrow">My Profiles</div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800 }}>My <span className="gradient-text">Roommate</span> Profiles</h2>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {items.length > 0 && <button onClick={deleteAll} className="btn-danger-mm" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}><FiTrash2 size={14} /> Delete All</button>}
              <Link to="/roommates/add" className="btn-primary-mm"><FiPlus size={16} /> Add Profile</Link>
            </div>
          </div>
        </motion.div>
        {loading ? <SkeletonGrid /> : items.length ? (
          <div className="row g-4">
            {items.map((item, i) => (
              <motion.div key={item.id} className="col-12 col-md-6 col-lg-4"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <RoommateCard item={item} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h4>No profiles yet</h4>
            <p>Create your first roommate profile to get started!</p>
            <Link to="/roommates/add" className="btn-primary-mm" style={{ display: 'inline-flex', marginTop: 16 }}>
              <FiPlus size={16} /> Add Profile
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
