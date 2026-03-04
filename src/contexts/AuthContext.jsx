import React, { createContext, useContext, useState } from 'react'
import * as api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // initialize user synchronously from localStorage so a full page reload doesn't
  // briefly set `user` to null and cause ProtectedRoute to redirect to /login
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('ms_auth')
      if (raw) {
        const parsed = JSON.parse(raw)
        return parsed?.user || null
      }
    } catch (e) {
      // ignore
    }
    return null
  }) // { username, roles: ['receptionist','doctor'] } or { username, role }
  const [loading, setLoading] = useState(false)

  async function login(credentials) {
    setLoading(true)
    try {
      // Expect credentials: { email, password }
      const payload = {
        email: credentials.email?.trim().toLowerCase(),
        password: credentials.password,
      }

      // 1) Login to get JWT + basic role/staffId
      const loginResponse = await api.login(payload)
      if (!loginResponse?.token || !loginResponse?.staffId) {
        throw new Error('Invalid login response')
      }

      // Store token for axios interceptors
      localStorage.setItem('token', loginResponse.token)

      // 2) Fetch staff details to derive UI roles (admin / doctor / receptionist)
      let staffDetails = null
      try {
        staffDetails = await api.getStaffById(loginResponse.staffId)
      } catch (e) {
        // If this fails, fall back to role from login response only
        // but still allow user to proceed.
      }

      const normalizedRoles = []

      const backendRole = (staffDetails?.role || loginResponse.role || '').toString().trim().toUpperCase()
      if (backendRole === 'ADMIN') {
        normalizedRoles.push('admin')
      }

      const staffType = staffDetails?.staffType || ''
      const specialization = staffDetails?.specialization || ''
      const staffTypeUpper = staffType.toString().trim().toUpperCase()
      const specUpper = specialization.toString().trim().toUpperCase()

      if (staffTypeUpper === 'DOCTOR') {
        normalizedRoles.push('doctor')
      }
      if (staffTypeUpper === 'NON_DOCTOR' && specUpper === 'RECEPTIONIST') {
        normalizedRoles.push('receptionist')
      }

      if (!normalizedRoles.length && backendRole) {
        normalizedRoles.push(backendRole.toLowerCase())
      }

      const displayName =
        (staffDetails?.firstName || '') || loginResponse.staffId || payload.email

      const authUser = {
        username: loginResponse.staffId, // used as doctorId/staffId in APIs
        staffId: loginResponse.staffId,
        roles: normalizedRoles,
        role: normalizedRoles[0] || null,
        displayName,
      }

      // Persist compact auth snapshot for ProtectedRoute / NavBar
      localStorage.setItem('ms_auth', JSON.stringify({ user: authUser }))

      setUser(authUser)
      setLoading(false)
      return authUser
    } catch (err) {
      setLoading(false)
      throw err
    }
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('ms_auth')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}