import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { Spinner } from '../components/common/Loaders'

export default function AdminRoute({ children }) {
  const { isAuthenticated, loading, isAdmin } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: '#0f172a' }}>
        <Spinner size={40} color="#00F2FE" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}