import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../api/axiosConfig'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) { setLoading(false); return }
    try {
      const res = await api.get('/auth/user/basicinfo')
      setUser(res.data)
    } catch {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadUser() }, [loadUser])

  const login = async (email, password) => {
    const res = await api.post('/auth/generateToken', { username: email, password })
    localStorage.setItem('accessToken', res.data.accessToken)
    localStorage.setItem('refreshToken', res.data.refreshToken)
    const userRes = await api.get('/auth/user/basicinfo')
    setUser(userRes.data)
    return userRes.data
  }

  const register = async (data) => {
    return await api.post('/auth/addNewUser', data)
  }

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    try { await api.post('/auth/logout', { refreshToken }) } catch {}
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
  }

  const isAuthenticated = !!localStorage.getItem('accessToken')

  // Helper checks supporting single role string, arrays, or authorities object
  const hasRole = (role) => {
    if (!user) return false
    if (user.roles === role || user.role === role) return true
    if (Array.isArray(user.roles)) return user.roles.includes(role)
    if (Array.isArray(user.authorities)) return user.authorities.some(auth => auth.authority === role || auth === role)
    return user.authority === role
  }

  const isOwner = hasRole('ROLE_OWNER') || hasRole('OWNER')
  const isAdmin = hasRole('ROLE_ADMIN') || hasRole('ADMIN')

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated, loadUser, isOwner, isAdmin, hasRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)