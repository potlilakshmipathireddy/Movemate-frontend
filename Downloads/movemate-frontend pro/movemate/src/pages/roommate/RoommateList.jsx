import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSearch, FiFilter, FiPlus, FiX } from 'react-icons/fi'
import { roommateService } from '../../api/axiosConfig'
import RoommateCard from '../../components/roommate/RoommateCard'
import { SkeletonGrid } from '../../components/common/Loaders'
import { useAuth } from '../../context/AuthContext'

const GENDERS = ['MALE', 'FEMALE', 'ANY']
const OCCUPATIONS = ['STUDENT', 'PROFESSIONAL', 'FREELANCER', 'ENTREPRENEUR', 'OTHER']
const FOODS = ['VEG', 'NON_VEG', 'VEGAN', 'EGGETARIAN']

export default function RoommateList() {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('')
  const [area, setArea] = useState('')
  const [gender, setGender] = useState('')
  const [occupation, setOccupation] = useState('')
  const [food, setFood] = useState('')
  const [minBudget, setMinBudget] = useState('')
  const [maxBudget, setMaxBudget] = useState('')
  const [showFilter, setShowFilter] = useState(false)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [count, setCount] = useState(0)

  const load = async () => {
    setLoading(true)
    try {
      let res
      if (city) res = await roommateService.searchByCity(city)
      else if (area) res = await roommateService.searchByArea(area)
      else if (gender) res = await roommateService.searchByGender(gender)
      else if (occupation) res = await roommateService.searchByOccupation(occupation)
      else if (food) res = await roommateService.searchByFood(food)
      else if (minBudget && maxBudget) res = await roommateService.searchByBudget(minBudget, maxBudget)
      else {
        const paged = await roommateService.getAll(page, 12)
        setItems(paged.data.content || [])
        setTotalPages(paged.data.totalPages || 1)
        const cntRes = await roommateService.getCount()
        setCount(cntRes.data)
        return
      }
      let data = res.data || []
      if (search) data = data.filter(i => i.fullName?.toLowerCase().includes(search.toLowerCase()) || i.city?.toLowerCase().includes(search.toLowerCase()))
      setItems(data)
      setTotalPages(1)
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [city, area, gender, occupation, food, minBudget, maxBudget, page])

  const clearFilters = () => { setCity(''); setArea(''); setGender(''); setOccupation(''); setFood(''); setMinBudget(''); setMaxBudget('') }

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--dark)' }}>
      <div style={{ background: 'var(--dark2)', borderBottom: '1px solid var(--border)', padding: '40px 0 30px' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
              <div>
                <div className="section-eyebrow">Roommate Matching</div>
                <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800 }}>
                  Find <span className="gradient-text">Roommates</span>
                  {count > 0 && <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: 10 }}>({count} profiles)</span>}
                </h2>
              </div>
              {isAuthenticated && (
                <Link to="/roommates/add" className="btn-primary-mm"><FiPlus size={16} /> Add Profile</Link>
              )}
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
                <FiSearch size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="mm-input" style={{ paddingLeft: 40 }} placeholder="Search by name, city..."
                  value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && load()} />
              </div>
              <input className="mm-input" style={{ width: 150 }} placeholder="City" value={city} onChange={e => setCity(e.target.value)} />
              <input className="mm-input" style={{ width: 150 }} placeholder="Area" value={area} onChange={e => setArea(e.target.value)} />
              <button className="btn-primary-mm" onClick={load}><FiSearch size={16} /> Search</button>
              <button className="btn-ghost-mm" onClick={() => setShowFilter(!showFilter)}>
                <FiFilter size={16} /> Filters
              </button>
            </div>

            {showFilter && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                style={{ marginTop: 16, padding: 20, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)' }}>
                <div className="row g-3">
                  {[
                    { label: 'Gender', val: gender, set: setGender, opts: GENDERS },
                    { label: 'Occupation', val: occupation, set: setOccupation, opts: OCCUPATIONS },
                    { label: 'Food Preference', val: food, set: setFood, opts: FOODS },
                  ].map(({ label, val, set: setter, opts }) => (
                    <div key={label} className="col-6 col-md-3">
                      <label className="mm-label">{label}</label>
                      <select className="mm-input" value={val} onChange={e => setter(e.target.value)}>
                        <option value="">All</option>
                        {opts.map(o => <option key={o} value={o}>{o.replace(/_/g,' ')}</option>)}
                      </select>
                    </div>
                  ))}
                  <div className="col-6 col-md-2">
                    <label className="mm-label">Min Budget ₹</label>
                    <input type="number" className="mm-input" value={minBudget} onChange={e => setMinBudget(e.target.value)} placeholder="0" />
                  </div>
                  <div className="col-6 col-md-2">
                    <label className="mm-label">Max Budget ₹</label>
                    <input type="number" className="mm-input" value={maxBudget} onChange={e => setMaxBudget(e.target.value)} placeholder="50000" />
                  </div>
                </div>
                <button onClick={clearFilters} className="btn-ghost-mm" style={{ marginTop: 12, fontSize: '0.82rem' }}>
                  <FiX size={14} /> Clear All
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
        {loading ? <SkeletonGrid count={12} /> : items.length ? (
          <>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '0.85rem' }}>{items.length} profile{items.length !== 1 ? 's' : ''} found</p>
            <div className="row g-4">
              {items.map((item, i) => (
                <motion.div key={item.id} className="col-12 col-md-6 col-lg-4"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <RoommateCard item={item} />
                </motion.div>
              ))}
            </div>
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
                <button className="btn-ghost-mm" onClick={() => setPage(p => Math.max(0, p-1))} disabled={page === 0}>Prev</button>
                <span style={{ alignSelf: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Page {page+1} of {totalPages}</span>
                <button className="btn-ghost-mm" onClick={() => setPage(p => Math.min(totalPages-1, p+1))} disabled={page >= totalPages-1}>Next</button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h4>No roommates found</h4>
            <p>Try different search criteria.</p>
            <button onClick={clearFilters} className="btn-primary-mm" style={{ marginTop: 16 }}>Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  )
}
