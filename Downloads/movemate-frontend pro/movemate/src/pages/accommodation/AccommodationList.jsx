import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSearch, FiFilter, FiPlus, FiX } from 'react-icons/fi'
import { accommodationService } from '../../api/axiosConfig'
import AccommodationCard from '../../components/accommodation/AccommodationCard'
import { SkeletonGrid } from '../../components/common/Loaders'
import { useAuth } from '../../context/AuthContext'

const GENDERS = ['MALE', 'FEMALE', 'ANY']
const ROOM_TYPES = ['SINGLE', 'DOUBLE', 'TRIPLE', 'DORMITORY']
const AC_TYPES = ['AC', 'NON_AC']

export default function AccommodationList() {
  const [params] = useSearchParams()
  const { isAuthenticated, isOwner } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(params.get('search') || '')
  const [city, setCity] = useState(params.get('city') || '')
  const [area, setArea] = useState('')
  const [gender, setGender] = useState('')
  const [roomType, setRoomType] = useState('')
  const [acType, setAcType] = useState('')
  const [minRent, setMinRent] = useState('')
  const [maxRent, setMaxRent] = useState('')
  const [showFilter, setShowFilter] = useState(false)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const load = async () => {
    setLoading(true)
    try {
      let res
      if (city && area) res = await accommodationService.searchByCityAndArea(city, area)
      else if (city) res = await accommodationService.getByCity(city)
      else if (area) res = await accommodationService.searchByArea(area)
      else if (gender) res = await accommodationService.getByGender(gender)
      else if (roomType) res = await accommodationService.getByRoomType(roomType)
      else if (acType) res = await accommodationService.getByType(acType)
      else if (minRent && maxRent) res = await accommodationService.getByRentRange(minRent, maxRent)
      else {
        const paged = await accommodationService.getPaged(page, 12, 'createdAt', 'desc')
        setItems(paged.data.content || [])
        setTotalPages(paged.data.totalPages || 1)
        return
      }
      let data = res.data || []
      if (search) data = data.filter(i => i.title?.toLowerCase().includes(search.toLowerCase()) || i.city?.toLowerCase().includes(search.toLowerCase()))
      setItems(data)
      setTotalPages(1)
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [city, area, gender, roomType, acType, minRent, maxRent, page])

  const handleSearch = (e) => { e.preventDefault(); load() }

  const clearFilters = () => { setCity(''); setArea(''); setGender(''); setRoomType(''); setAcType(''); setMinRent(''); setMaxRent(''); setPage(0) }

  const activeFilters = [city, area, gender, roomType, acType, (minRent || maxRent) ? `₹${minRent}-${maxRent}` : ''].filter(Boolean)

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--dark)' }}>
      {/* Header */}
      <div style={{ background: 'var(--dark2)', borderBottom: '1px solid var(--border)', padding: '40px 0 30px' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
              <div>
                <div className="section-eyebrow">Housing</div>
                <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
                  Find <span className="gradient-text">Accommodation</span>
                </h2>
              </div>
              
              {/* RESTRICTED: Only authenticated users who are owners can see the Add Listing button */}
              {isAuthenticated && isOwner && (
                <Link to="/accommodation/add" className="btn-primary-mm"><FiPlus size={16} /> Add Listing</Link>
              )}
            </div>

            {/* Search bar */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
                <FiSearch size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="mm-input" style={{ paddingLeft: 40 }} placeholder="Search by title, city..."
                  value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <input className="mm-input" style={{ width: 160 }} placeholder="City" value={city} onChange={e => setCity(e.target.value)} />
              <input className="mm-input" style={{ width: 160 }} placeholder="Area" value={area} onChange={e => setArea(e.target.value)} />
              <button type="submit" className="btn-primary-mm"><FiSearch size={16} /> Search</button>
              <button type="button" className="btn-ghost-mm" onClick={() => setShowFilter(!showFilter)}>
                <FiFilter size={16} /> Filters {activeFilters.length > 0 && `(${activeFilters.length})`}
              </button>
            </form>

            {/* Filter panel */}
            {showFilter && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                style={{ marginTop: 16, padding: 20, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)' }}>
                <div className="row g-3">
                  <div className="col-6 col-md-3">
                    <label className="mm-label">Gender</label>
                    <select className="mm-input" value={gender} onChange={e => setGender(e.target.value)}>
                      <option value="">All</option>
                      {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="col-6 col-md-3">
                    <label className="mm-label">Room Type</label>
                    <select className="mm-input" value={roomType} onChange={e => setRoomType(e.target.value)}>
                      <option value="">All</option>
                      {ROOM_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="col-6 col-md-2">
                    <label className="mm-label">AC Type</label>
                    <select className="mm-input" value={acType} onChange={e => setAcType(e.target.value)}>
                      <option value="">All</option>
                      {AC_TYPES.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div className="col-6 col-md-2">
                    <label className="mm-label">Min Rent ₹</label>
                    <input type="number" className="mm-input" placeholder="0" value={minRent} onChange={e => setMinRent(e.target.value)} />
                  </div>
                  <div className="col-6 col-md-2">
                    <label className="mm-label">Max Rent ₹</label>
                    <input type="number" className="mm-input" placeholder="50000" value={maxRent} onChange={e => setMaxRent(e.target.value)} />
                  </div>
                </div>
                <button onClick={clearFilters} className="btn-ghost-mm" style={{ marginTop: 12, fontSize: '0.82rem' }}>
                  <FiX size={14} /> Clear All
                </button>
              </motion.div>
            )}

            {/* Active filter chips */}
            {activeFilters.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                {activeFilters.map(f => (
                  <span key={f} className="mm-badge mm-badge-primary">{f}</span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Results */}
      <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
        {loading ? <SkeletonGrid count={12} /> : items.length ? (
          <>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '0.85rem' }}>{items.length} result{items.length !== 1 ? 's' : ''} found</p>
            <div className="row g-4">
              {items.map((item, i) => (
                <motion.div key={item.id} className="col-12 col-md-6 col-lg-4"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <AccommodationCard item={item} />
                </motion.div>
              ))}
            </div>
            {/* Pagination */}
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
            <div className="empty-icon">🏠</div>
            <h4>No accommodations found</h4>
            <p>Try different search criteria or clear filters.</p>
            <button onClick={clearFilters} className="btn-primary-mm" style={{ marginTop: 16 }}>Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  )
}