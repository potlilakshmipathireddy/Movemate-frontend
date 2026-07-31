import { Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Sidebar from './Sidebar'
import OwnerSidebar from './OwnerSidebar' 
import TopHeader from './TopHeader'
import Navbar from './Navbar'
import Footer from './Footer'
import FloatingScrollTop from '../common/FloatingScrollTop'

export default function Layout() {
  // 2. Extract isOwner from useAuth
  const { isAuthenticated, isOwner } = useAuth()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#090d16' }}>
      {isAuthenticated ? (
        <div style={{ display: 'flex', flex: 1 }}>
          
          {/* 3. Conditionally render the correct sidebar */}
          {isOwner ? <OwnerSidebar /> : <Sidebar />}
          
          <div style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <TopHeader />
            <main style={{ flex: 1, padding: '0', boxSizing: 'border-box' }}>
              <Outlet />
            </main>
          </div>
        </div>
      ) : (
        <>
          <Navbar />
          <main style={{ flex: 1, padding: '0' }}>
            <Outlet />
          </main>
          <Footer />
        </>
      )}
      <FloatingScrollTop />
    </div>
  )
}