import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import NavBar from './components/NavBar'
import Login from './pages/Login'
import Home from './pages/Home'
import ForgotPassword from './pages/ForgotPassword'
import ReceptionistDashboard from './pages/ReceptionistDashboard'
import DoctorDashboard from './pages/DoctorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <AuthProvider>
      {/* Make app a column that fills viewport so children can stretch */}
      <div className="d-flex flex-column min-vh-100">
        <BrowserRouter>
          <NavBar />
          {/* main fills remaining space and scrolls if content overflows */}
          <main className="flex-grow-1 overflow-auto">
            <div className="container py-4 h-100">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/receptionist"
                  element={
                    <ProtectedRoute allowedRoles={["receptionist"]}>
                      <ReceptionistDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/doctor"
                  element={
                    <ProtectedRoute allowedRoles={["doctor"]}>
                      <DoctorDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>
        </BrowserRouter>
      </div>
    </AuthProvider>
  )
}

