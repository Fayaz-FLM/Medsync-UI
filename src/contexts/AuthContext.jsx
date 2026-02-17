import React, { createContext, useContext, useState, useEffect } from 'react'

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
      // Example backend flow (commented):
      // const res = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials),
      // })
      // const data = await res.json()
      // // expected data: { token, user: { username, roles: [...] } }
      // const { user } = data
      // localStorage.setItem('ms_auth', JSON.stringify({ token: data.token, user }))
      // setUser(user)
      // setLoading(false)
      // return user

      // Placeholder behavior while API not wired:
      const mockUser = {
        username: credentials.username,
        // normalize roles to lowercase and trim to prevent mismatch (backend will provide real roles)
        roles: credentials.role ? [credentials.role.trim().toLowerCase()] : ['receptionist'],
      }
      localStorage.setItem('ms_auth', JSON.stringify({ user: mockUser }))
      setUser(mockUser)
      setLoading(false)
      return mockUser
    } catch (err) {
      setLoading(false)
      throw err
    }
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('ms_auth')
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