import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api, { accommodationService } from '../../api/axiosConfig'
import { toast } from 'react-toastify'
import { FiUsers, FiHome, FiPlusCircle, FiShield, FiLogOut, FiTrash2, FiLayout, FiEdit } from 'react-icons/fi'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState([])
  const [accommodations, setAccommodations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllAdminData()
  }, [])

  const fetchAllAdminData = async () => {
    setLoading(true)
    try {
      const usersRes = await api.get('/admin/users')
      setUsers(usersRes.data)

      try {
        // Fetching all accommodations/listings across the system using prebuilt service
        const accRes = await accommodationService.getAll()
        setAccommodations(accRes.data)
      } catch (err) {
        console.log('Could not fetch accommodations list')
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
      toast.error('Failed to load admin data. Check backend permissions.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    try {
      await api.delete(`/admin/users/${userId}`)
      toast.success('User deleted successfully')
      setUsers(users.filter(u => u.id !== userId))
    } catch (error) {
      toast.error('Failed to delete user')
    }
  }

  // Admin delete capability for accommodations/listings
  const handleDeleteAccommodation = async (accId) => {
    if (!window.confirm('Are you sure you want to delete this accommodation listing?')) return
    try {
      await accommodationService.delete(accId)
      toast.success('Accommodation deleted successfully')
      setAccommodations(accommodations.filter(a => a.id !== accId))
    } catch (error) {
      toast.error('Failed to delete accommodation')
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f6f9', fontFamily: 'sans-serif' }}>
      
      {/* Sidebar */}
      <div style={{ width: '260px', background: '#1e293b', color: '#fff', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', fontSize: '1.2rem', fontWeight: 'bold' }}>
            <FiShield color="#38bdf8" size={24} />
            <span>Admin Portal</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              onClick={() => setActiveTab('users')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 15px', background: activeTab === 'users' ? '#334155' : 'transparent', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', width: '100%' }}
            >
              <FiUsers /> Manage Users
            </button>
            <button 
              onClick={() => setActiveTab('accommodations')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 15px', background: activeTab === 'accommodations' ? '#334155' : 'transparent', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', width: '100%' }}
            >
              <FiHome /> Manage Listings
            </button>
            
            <div style={{ borderTop: '1px solid #334155', margin: '10px 0' }} />

            <button 
              onClick={() => navigate('/accommodation/add')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 15px', background: 'transparent', color: '#38bdf8', border: 'none', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', width: '100%' }}
            >
              <FiPlusCircle /> Add Accommodation
            </button>

            <button 
              onClick={() => navigate('/dashboard')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 15px', background: 'transparent', color: '#94a3b8', border: 'none', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', width: '100%' }}
            >
              <FiLayout /> Go to App Dashboard
            </button>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #334155', paddingTop: '15px' }}>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '10px' }}>Logged in as:<br/><strong>{user?.email}</strong></p>
          <button 
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: '#0f172a', textTransform: 'capitalize' }}>{activeTab} Overview</h1>
            <p style={{ color: '#64748b' }}>Global system control and database insights</p>
          </div>
          <button 
            onClick={fetchAllAdminData}
            style={{ padding: '8px 16px', background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            Refresh Data
          </button>
        </header>

        {loading ? (
          <p>Loading system records...</p>
        ) : (
          <div>
            {/* USERS TAB */}
            {activeTab === 'users' && (
              <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                      <th style={{ padding: '15px' }}>ID</th>
                      <th style={{ padding: '15px' }}>Name</th>
                      <th style={{ padding: '15px' }}>Email</th>
                      <th style={{ padding: '15px' }}>Role</th>
                      <th style={{ padding: '15px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '15px' }}>{u.id}</td>
                        <td style={{ padding: '15px' }}>{u.name}</td>
                        <td style={{ padding: '15px' }}>{u.email}</td>
                        <td style={{ padding: '15px' }}>
                          <span style={{ padding: '4px 8px', background: u.roles?.includes('ADMIN') ? '#dbeafe' : '#f1f5f9', color: u.roles?.includes('ADMIN') ? '#1e40af' : '#334155', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                            {u.roles}
                          </span>
                        </td>
                        <td style={{ padding: '15px' }}>
                          <button 
                            onClick={() => handleDeleteUser(u.id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                            title="Delete User"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ACCOMMODATIONS / LISTINGS TAB */}
            {activeTab === 'accommodations' && (
              <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                      <th style={{ padding: '15px' }}>ID</th>
                      <th style={{ padding: '15px' }}>Title</th>
                      <th style={{ padding: '15px' }}>City</th>
                      <th style={{ padding: '15px' }}>Price</th>
                      <th style={{ padding: '15px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accommodations.length === 0 ? (
                      <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No accommodations found.</td></tr>
                    ) : (
                      accommodations.map((acc) => (
                        <tr key={acc.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '15px' }}>{acc.id}</td>
                          <td style={{ padding: '15px' }}>{acc.title || acc.name}</td>
                          <td style={{ padding: '15px' }}>{acc.city}</td>
                          <td style={{ padding: '15px' }}>₹{acc.price || acc.rent}</td>
                          <td style={{ padding: '15px', display: 'flex', gap: '12px' }}>
                            <button 
                              onClick={() => navigate(`/accommodation/edit/${acc.id}`)}
                              style={{ background: 'none', border: 'none', color: '#0ea5e9', cursor: 'pointer' }}
                              title="Edit Listing"
                            >
                              <FiEdit size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteAccommodation(acc.id)}
                              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                              title="Delete Listing"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}