import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import ScrollToTop from './components/common/ScrollToTop'

// Pages
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import VerifyEmail from './pages/auth/VerifyEmail'
import Dashboard from './pages/dashboard/Dashboard'
import OwnerDashboard from './pages/dashboard/OwnerDashboard'
import Profile from './pages/auth/Profile'
import Account from './pages/auth/Account'

// Admin Pages & Guards
import AdminLogin from './pages/auth/Admin'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import AdminRoute from './context/AdminRoute'

import AccommodationList from './pages/accommodation/AccommodationList'
import AccommodationDetail from './pages/accommodation/AccommodationDetail'
import AddAccommodation from './pages/accommodation/AddAccommodation'
import EditAccommodation from './pages/accommodation/EditAccommodation'
import MyAccommodations from './pages/accommodation/MyAccommodations'

import RoommateList from './pages/roommate/RoommateList'
import RoommateDetail from './pages/roommate/RoommateDetail'
import AddRoommate from './pages/roommate/AddRoommate'
import EditRoommate from './pages/roommate/EditRoommate'
import MyRoommates from './pages/roommate/MyRoommates'

import TravelPlanner from './pages/travel/TravelPlanner'
import TripDetail from './pages/travel/TripDetail'
import AddTrip from './pages/travel/AddTrip'

import ExploreCity from './pages/city/ExploreCity'
import CityDetail from './pages/city/CityDetail'

import LocalGuide from './pages/guide/LocalGuide'
import GuideDetail from './pages/guide/GuideDetail'
import GuideAdd from './pages/guide/GuideAdd'

import Reviews from './pages/reviews/Reviews'
import SavedPlaces from './pages/saved/SavedPlaces'
import Settings from './pages/settings/Settings'

import NotFound from './pages/NotFound'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        <Routes>
          {/* Admin Login Route (Isolated outside main website layout) */}
          <Route path="/admin/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />

          {/* Protected Admin Dashboard Route */}
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />

          {/* Standard Main Layout Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify" element={<VerifyEmail />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/owner-dashboard" element={<ProtectedRoute><OwnerDashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />

            {/* Protected Accommodation Routes */}
            <Route path="/accommodation" element={<ProtectedRoute><AccommodationList /></ProtectedRoute>} />
            <Route path="/accommodation/:id" element={<ProtectedRoute><AccommodationDetail /></ProtectedRoute>} />
            <Route path="/accommodation/add" element={<ProtectedRoute><AddAccommodation /></ProtectedRoute>} />
            <Route path="/accommodation/edit/:id" element={<ProtectedRoute><EditAccommodation /></ProtectedRoute>} />
            <Route path="/accommodation/my" element={<ProtectedRoute><MyAccommodations /></ProtectedRoute>} />

            {/* Protected Roommate Routes */}
            <Route path="/roommates" element={<ProtectedRoute><RoommateList /></ProtectedRoute>} />
            <Route path="/roommates/:id" element={<ProtectedRoute><RoommateDetail /></ProtectedRoute>} />
            <Route path="/roommates/add" element={<ProtectedRoute><AddRoommate /></ProtectedRoute>} />
            <Route path="/roommates/edit/:id" element={<ProtectedRoute><EditRoommate /></ProtectedRoute>} />
            <Route path="/roommates/my" element={<ProtectedRoute><MyRoommates /></ProtectedRoute>} />

            {/* Protected Travel Routes */}
            <Route path="/travel" element={<ProtectedRoute><TravelPlanner /></ProtectedRoute>} />
            <Route path="/travel/:id" element={<ProtectedRoute><TripDetail /></ProtectedRoute>} />
            <Route path="/travel/add" element={<ProtectedRoute><AddTrip /></ProtectedRoute>} />

            {/* Protected City Explore Routes */}
            <Route path="/explore" element={<ProtectedRoute><ExploreCity /></ProtectedRoute>} />
            <Route path="/explore/:city" element={<ProtectedRoute><CityDetail /></ProtectedRoute>} />

            {/* Protected Guide Routes */}
            <Route path="/guides" element={<ProtectedRoute><LocalGuide /></ProtectedRoute>} />
            <Route path="/guides/:id" element={<ProtectedRoute><GuideDetail /></ProtectedRoute>} />
            <Route path="/local-guides" element={<ProtectedRoute><LocalGuide /></ProtectedRoute>} />
            <Route path="/local-guides/add" element={<AdminRoute><GuideAdd /></AdminRoute>} />
            <Route path="/local-guides/edit/:id" element={<AdminRoute><GuideAdd /></AdminRoute>} />

            {/* Protected Reviews & Utility Routes */}
            <Route path="/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
            <Route path="/saved" element={<ProtectedRoute><SavedPlaces /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}