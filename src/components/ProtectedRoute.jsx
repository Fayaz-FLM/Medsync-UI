import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  // while auth state is being restored, avoid redirecting immediately
  if (loading) return null // or show a spinner

  // Check if user needs to reset password
  const resetEmail = sessionStorage.getItem('resetEmail')
  if (resetEmail && location.pathname !== '/force-reset-password') {
    return <Navigate to="/force-reset-password" replace />
  }

  if (!user) {
    // not logged in — send to login and preserve attempted location
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  // If allowedRoles provided, ensure user has at least one of the roles
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const userRoles = user?.roles || (user?.role ? [user.role] : [])
    const normUserRoles = Array.isArray(userRoles) ? userRoles.map(r => (typeof r === 'string' ? r.trim().toLowerCase() : r)) : []
    const normAllowed = allowedRoles.map(r => (typeof r === 'string' ? r.trim().toLowerCase() : r))
    const has = normAllowed.some(r => normUserRoles.includes(r))
    if (!has) {
      // not authorized for this route
      return <Navigate to="/" replace />
    }
  }

  return children
}