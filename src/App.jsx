import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/layout/NavbarComponent'
import LoginPage from './modules/auth/pages/LoginPage'
import LobbyPage from './modules/lobby/pages/LobbyPage'
import ForgotPasswordPage from './modules/auth/pages/ForgotPasswordPage'
import ForceResetPasswordPage from './modules/auth/pages/ForceResetPasswordPage'
import ReceptionistDashboardPage from './modules/receptionist/pages/ReceptionistDashboardPage'
import DoctorDashboard from './modules/doctor/components/DoctorDashboard'
import AdminStaff from './modules/admin/components/AdminStaff'
import ProtectedRoute from './components/common/ProtectedRoute'
import { COLORS } from './constants/uiConstants'

function AppContent() {
  const location = useLocation()
  const authRoutes = ['/login', '/forgot-password', '/force-reset-password']
  const hideNavbar = authRoutes.includes(location.pathname)

  return (
    <div 
      className="d-flex flex-column min-vh-100" 
      style={{ backgroundColor: hideNavbar ? COLORS.WHITE : COLORS.BG_LIGHT }}
    >
      {!hideNavbar && <Navbar />}
      <main className="flex-grow-1 overflow-auto" style={{ paddingTop: hideNavbar ? '0' : '70px' }}>
        {hideNavbar ? (
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/force-reset-password" element={<ForceResetPasswordPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        ) : (
          <div className="container py-4 h-100">
            <Routes>
              <Route path="/" element={<ProtectedRoute><LobbyPage /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminStaff /></ProtectedRoute>} />
              <Route path="/receptionist" element={<ProtectedRoute allowedRoles={["receptionist"]}><ReceptionistDashboardPage /></ProtectedRoute>} />
              <Route path="/doctor" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorDashboard /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        )}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  )
}
