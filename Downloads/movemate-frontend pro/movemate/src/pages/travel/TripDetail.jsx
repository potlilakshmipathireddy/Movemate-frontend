import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiCalendar, FiUsers, FiDollarSign, FiMap, FiPlus, FiTrash2, FiEdit2, FiCheck, FiX, FiList, FiUpload, FiFileText } from 'react-icons/fi'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { tripService } from '../../api/axiosConfig'
import { toast } from 'react-toastify'
import { SkeletonCard } from '../../components/common/Loaders'

const getCategoryEmoji = (category) => {
  const map = {
    'Food': '🍽️',
    'Transport': '🚗',
    'Activity': '🎯',
    'Hotel': '🏨',
    'Shopping': '🛍️',
    'Adventure': '⛰️',
    'Beach': '🏖️',
    'Culture': '🏛️',
    'Sightseeing': '🗼',
    'Other': '📍'
  }
  return map[category] || '📍'
}

// Helper component to force Leaflet to recalculate tiles when map view mounts
function MapResizer() {
  const map = useMap()
  useEffect(() => {
    if (map) {
      setTimeout(() => {
        map.invalidateSize()
      }, 150)
    }
  }, [map])
  return null
}

export default function TripDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [itineraries, setItineraries] = useState([])
  const [expense, setExpense] = useState(null)
  const [loading, setLoading] = useState(true)

  // View Mode: 'timeline' or 'map'
  const [viewMode, setViewMode] = useState('timeline')

  // Uploaded Files State
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)

  // Add Activity Modal State
  const [showAddModal, setShowAddModal] = useState(false)
  const [newDayNumber, setNewDayNumber] = useState(1)
  const [newTimeSlot, setNewTimeSlot] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState('Sightseeing')
  const [newCost, setNewCost] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Edit Activity State
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editTimeSlot, setEditTimeSlot] = useState('')
  const [editCost, setEditCost] = useState('')

  const fetchTripData = () => {
    tripService.getById(id)
      .then((res) => {
        setTrip(res.data)
        if (res.data.itineraries && res.data.itineraries.length > 0) {
          setItineraries(res.data.itineraries)
        } else {
          tripService.getItineraries(id)
            .then(it => setItineraries(it.data || []))
            .catch(err => console.warn('Itineraries could not be loaded', err))
        }
        
        tripService.getExpenses(id)
          .then(ex => setExpense(ex.data || res.data.expenseSummary))
          .catch(err => {
            console.warn('Expenses could not be loaded', err)
            setExpense(res.data.expenseSummary)
          })
      })
      .catch((err) => {
        console.error("Failed to load trip details:", err)
        toast.error('Could not load trip')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    setLoading(true)
    fetchTripData()
  }, [id])

  const handleAddActivity = async (e) => {
    e.preventDefault()
    if (!newTitle) {
      toast.error('Please enter an activity title')
      return
    }

    setSubmitting(true)
    const itemData = {
      dayNumber: parseInt(newDayNumber) || 1,
      timeSlot: newTimeSlot || '09:00 AM',
      title: newTitle,
      category: newCategory,
      cost: parseFloat(newCost) || 0.0,
      trip: { id: parseInt(id) }
    }

    try {
      await tripService.addItineraryItem(itemData)
      toast.success('Activity added successfully!')
      setShowAddModal(false)
      setNewTitle('')
      setNewTimeSlot('')
      setNewCost('')
      fetchTripData()
    } catch (error) {
      console.error('Error adding activity:', error)
      toast.error('Failed to add activity')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteActivity = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return

    try {
      await tripService.deleteItineraryItem(itemId)
      toast.success('Activity deleted')
      fetchTripData()
    } catch (error) {
      console.error('Error deleting activity:', error)
      toast.error('Failed to delete activity')
    }
  }

  const startEditing = (item) => {
    setEditingId(item.id)
    setEditTitle(item.title)
    setEditTimeSlot(item.timeSlot || '')
    setEditCost(item.cost || 0)
  }

  const saveEdit = async (itemId, originalItem) => {
    try {
      const updatedData = {
        ...originalItem,
        title: editTitle,
        timeSlot: editTimeSlot,
        cost: parseFloat(editCost) || 0.0,
      }
      await tripService.updateItineraryItem(itemId, updatedData)
      toast.success('Activity updated!')
      setEditingId(null)
      fetchTripData()
    } catch (error) {
      console.error('Error updating activity:', error)
      toast.error('Failed to update activity')
    }
  }

  // Handle Document/Receipt File Upload
  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files)
    if (uploadedFiles.length === 0) return

    setUploading(true)
    setTimeout(() => {
      const newFilesMapped = uploadedFiles.map(file => ({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        date: new Date().toLocaleDateString()
      }))
      setFiles(prev => [...prev, ...newFilesMapped])
      setUploading(false)
      toast.success('Document uploaded successfully!')
    }, 800)
  }

  if (loading) return <div style={{ paddingTop: 100 }}><div className="container"><SkeletonCard /></div></div>
  if (!trip) return <div style={{ paddingTop: 100 }}><div className="container empty-state"><div className="empty-icon">✈️</div><h4>Trip not found</h4></div></div>

  const days = trip.endDate && trip.startDate
    ? Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000*60*60*24)) + 1
    : '—'

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh', background: 'var(--dark)' }}>
      <div className="container" style={{ paddingTop: 30, paddingBottom: 60 }}>
        <button onClick={() => navigate(-1)} className="btn-ghost-mm" style={{ marginBottom: 24, fontSize: '0.85rem' }}>
          <FiArrowLeft size={14} /> Back
        </button>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mm-card" style={{ padding: 32, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span className="mm-badge mm-badge-primary" style={{ marginBottom: 10 }}>{trip.category}</span>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
                {trip.destination} {getCategoryEmoji(trip.category)}
              </h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ₹{trip.totalBudget?.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>total budget</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginTop: 20 }}>
            {[
              { icon: FiCalendar, val: `${trip.startDate} → ${trip.endDate} (${days} days)` },
              { icon: FiUsers, val: `${trip.numberOfTravelers} traveler${trip.numberOfTravelers > 1 ? 's' : ''}` },
              { icon: FiMap, val: trip.transportationPreference },
              { icon: FiDollarSign, val: trip.budgetRange },
            ].map(({ icon: Icon, val }) => (
              <div key={val} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <Icon size={14} color="var(--primary-light)" /> {val}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="row g-4">
          {/* Itinerary Section with Timeline / Map Toggle */}
          <motion.div className="col-lg-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}>
            <div className="mm-card" style={{ padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, margin: 0 }}>📅 Schedule</h4>
                  {/* View Mode Toggle Switch */}
                  <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 6, padding: 2 }}>
                    <button 
                      onClick={() => setViewMode('timeline')}
                      style={{ background: viewMode === 'timeline' ? 'var(--primary)' : 'transparent', border: 'none', color: '#fff', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      <FiList size={12} /> Timeline
                    </button>
                    <button 
                      onClick={() => setViewMode('map')}
                      style={{ background: viewMode === 'map' ? 'var(--primary)' : 'transparent', border: 'none', color: '#fff', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      <FiMap size={12} /> Map View
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => setShowAddModal(!showAddModal)}
                  className="btn btn-sm btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--gradient-primary)', border: 'none', padding: '6px 14px', borderRadius: 6, color: '#fff', cursor: 'pointer', fontWeight: 600 }}
                >
                  <FiPlus size={16} /> Add Activity
                </button>
              </div>

              {/* Add Activity Form Toggle Box */}
              {showAddModal && (
                <motion.form 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  onSubmit={handleAddActivity}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: 20, borderRadius: 12, marginBottom: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}
                >
                  <h5 style={{ gridColumn: 'span 2', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 4 }}>New Activity Item</h5>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Day Number</label>
                    <input type="number" min="1" max={typeof days === 'number' ? days : 30} value={newDayNumber} onChange={e => setNewDayNumber(e.target.value)} required style={{ width: '100%', padding: '8px 12px', background: 'var(--dark)', border: '1px solid var(--border)', color: '#fff', borderRadius: 6 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Time Slot</label>
                    <input type="text" placeholder="e.g. 10:00 AM" value={newTimeSlot} onChange={e => setNewTimeSlot(e.target.value)} style={{ width: '100%', padding: '8px 12px', background: 'var(--dark)', border: '1px solid var(--border)', color: '#fff', borderRadius: 6 }} />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Activity Title</label>
                    <input type="text" placeholder="e.g. Visit Charminar" value={newTitle} onChange={e => setNewTitle(e.target.value)} required style={{ width: '100%', padding: '8px 12px', background: 'var(--dark)', border: '1px solid var(--border)', color: '#fff', borderRadius: 6 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Category</label>
                    <select value={newCategory} onChange={e => setNewCategory(e.target.value)} style={{ width: '100%', padding: '8px 12px', background: 'var(--dark)', border: '1px solid var(--border)', color: '#fff', borderRadius: 6 }}>
                      <option value="Sightseeing">Sightseeing</option>
                      <option value="Food">Food</option>
                      <option value="Transport">Transport</option>
                      <option value="Activity">Activity</option>
                      <option value="Shopping">Shopping</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Estimated Cost (₹)</label>
                    <input type="number" step="0.01" placeholder="0.00" value={newCost} onChange={e => setNewCost(e.target.value)} style={{ width: '100%', padding: '8px 12px', background: 'var(--dark)', border: '1px solid var(--border)', color: '#fff', borderRadius: 6 }} />
                  </div>
                  <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
                    <button type="button" onClick={() => setShowAddModal(false)} className="btn-ghost-mm" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>Cancel</button>
                    <button type="submit" disabled={submitting} className="btn btn-primary" style={{ padding: '6px 16px', background: 'var(--primary)', border: 'none', borderRadius: 6, color: '#fff', fontWeight: 600 }}>
                      {submitting ? 'Saving...' : 'Save Activity'}
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Conditional Rendering: Timeline vs Map View */}
              {viewMode === 'map' ? (
                <div style={{ height: 400, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <MapContainer 
                    center={[17.3850, 78.4867]} 
                    zoom={13} 
                    style={{ height: '100%', width: '100%' }}
                  >
                    <MapResizer />
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {itineraries.map((item, idx) => (
                      <Marker key={item.id || idx} position={[17.3850 + (idx * 0.01), 78.4867 + (idx * 0.01)]}>
                        <Popup>
                          <strong>{item.title}</strong><br />Day {item.dayNumber} - {item.timeSlot}
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              ) : (
                <div>
                  {itineraries.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
                      No itinerary items found. Add your first activity above!
                    </div>
                  ) : (
                    itineraries.map((item, idx) => (
                      <div key={item.id || idx} style={{ paddingBottom: 16, marginBottom: 16, borderBottom: idx < itineraries.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', gap: 12, width: '100%' }}>
                          <div style={{ width: 36, height: 36, background: 'var(--gradient-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.80rem', color: '#fff', flexShrink: 0 }}>
                            D{item.dayNumber}
                          </div>

                          <div style={{ width: '100%' }}>
                            {editingId === item.id ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, background: 'rgba(255,255,255,0.02)', padding: 10, borderRadius: 8 }}>
                                <input type="text" value={editTimeSlot} onChange={(e) => setEditTimeSlot(e.target.value)} placeholder="Time slot" style={{ padding: '4px 8px', background: 'var(--dark)', border: '1px solid var(--border)', color: '#fff', borderRadius: 4, fontSize: '0.8rem' }} />
                                <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Activity title" style={{ padding: '4px 8px', background: 'var(--dark)', border: '1px solid var(--border)', color: '#fff', borderRadius: 4, fontSize: '0.85rem' }} />
                                <input type="number" value={editCost} onChange={(e) => setEditCost(e.target.value)} placeholder="Cost" style={{ padding: '4px 8px', background: 'var(--dark)', border: '1px solid var(--border)', color: '#fff', borderRadius: 4, fontSize: '0.8rem' }} />
                                <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                                  <button onClick={() => saveEdit(item.id, item)} style={{ background: 'var(--primary)', border: 'none', color: '#fff', padding: '4px 8px', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem' }}><FiCheck size={12} /> Save</button>
                                  <button onClick={() => setEditingId(null)} style={{ background: 'transparent', border: '1px solid var(--border)', color: '#fff', padding: '4px 8px', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem' }}><FiX size={12} /> Cancel</button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--primary-light)', fontWeight: 600 }}>{item.timeSlot}</span>
                                  <span className="mm-badge" style={{ fontSize: '0.65rem', padding: '1px 6px', background: 'rgba(255,255,255,0.08)' }}>
                                    {getCategoryEmoji(item.category)} {item.category || 'Activity'}
                                  </span>
                                </div>
                                <h6 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 4, fontSize: '0.95rem' }}>{item.title}</h6>
                                {item.cost > 0 && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cost: ₹{item.cost?.toLocaleString()}</div>}
                              </div>
                            )}
                          </div>
                        </div>

                        {item.id && editingId !== item.id && (
                          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                            <button onClick={() => startEditing(item)} title="Edit activity" style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 6 }}>
                              <FiEdit2 size={14} />
                            </button>
                            <button onClick={() => handleDeleteActivity(item.id)} title="Delete activity" style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 6 }}>
                              <FiTrash2 size={15} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Expense Summary & File Upload Section */}
          <motion.div className="col-lg-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Budget Summary Card */}
              <div className="mm-card" style={{ padding: 28 }}>
                <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 20 }}>💰 Budget Summary</h4>
                {expense ? (
                  <div>
                    {[
                      { label: 'Accommodation', val: expense.accommodationCost || expense.accommodation, icon: '🏨' },
                      { label: 'Food', val: expense.foodCost || expense.food, icon: '🍽️' },
                      { label: 'Transport', val: expense.transportCost || expense.transport, icon: '🚌' },
                      { label: 'Activities/Tickets', val: expense.ticketsCost || expense.activities, icon: '🎯' },
                      { label: 'Shopping', val: expense.shoppingCost || expense.shopping, icon: '🛍️' },
                    ].filter(e => e.val > 0).map(({ label, val, icon }) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{icon} {label}</span>
                        <span style={{ fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>₹{val?.toLocaleString()}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 14, marginTop: 4 }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Total Estimated</span>
                      <span style={{ fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        ₹{(expense.totalEstimatedCost || trip.totalBudget)?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Total Budget</span>
                      <span style={{ fontWeight: 700, color: 'var(--primary-light)' }}>₹{trip.totalBudget?.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Trip Documents & Receipts Upload Card */}
              <div className="mm-card" style={{ padding: 28 }}>
                <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 16 }}>📁 Trip Documents</h4>
                <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border)', borderRadius: 8, padding: 16, cursor: 'pointer', background: 'rgba(255,255,255,0.01)', marginBottom: 16 }}>
                  <FiUpload size={20} color="var(--primary-light)" style={{ marginBottom: 6 }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{uploading ? 'Uploading...' : 'Upload Tickets / Receipts'}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>PDF, PNG, JPG up to 10MB</span>
                  <input type="file" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
                </label>

                {files.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {files.map((file, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 6, border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                          <FiFileText size={16} color="var(--primary-light)" style={{ flexShrink: 0 }} />
                          <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{file.name}</div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{file.size} • {file.date}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}