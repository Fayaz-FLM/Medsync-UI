import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
// import * as api from '../services/api' // uncomment to call backend

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('receptionist') // demo selector; backend will provide real roles
  const { login, loading } = useAuth()
  const nav = useNavigate()
  const location = useLocation()
  const [error, setError] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      // login should return user object: { username, roles: [...] } or { username, role }
      const user = await login({ username: username.trim(), role, password })
      const roles = user?.roles || (user?.role ? [user.role] : [])
      const rolesNorm = Array.isArray(roles) ? roles.map((r) => (typeof r === 'string' ? r.trim().toLowerCase() : r)) : []

     

      // role-based routing priority: admin -> receptionist -> doctor -> home
      if (rolesNorm.includes('admin')) {
        console.log('Login: navigating to /admin')
        nav('/admin', { replace: true })
      } else if (rolesNorm.includes('receptionist')) {
        console.log('Login: navigating to /receptionist')
        nav('/receptionist', { replace: true })
      } else if (rolesNorm.includes('doctor')) {
        console.log('Login: navigating to /doctor')
        nav('/doctor', { replace: true })
      } else {
        console.log('Login: navigating to / (no matching role)')
        nav('/', { replace: true })
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    }
  }

  return (
    <div className="login-hero d-flex align-items-center justify-content-center">
      <div className="login-overlay w-100 h-100 position-absolute" />
      <div className="container position-relative">
        <div className="row w-100 justify-content-center">
          <div className="col-11 col-sm-10 col-md-8 col-lg-5">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <h4 className="mb-4 text-center">MedSync — Sign in</h4>
                <form onSubmit={onSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                      className="form-control"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Role (for demo)</label>
                    <select
                      className="form-select"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      disabled={loading}
                    >
                      <option value="receptionist">Receptionist</option>
                      <option value="admin">Admin</option>
                      <option value="doctor">Doctor</option>
                    </select>
                  </div>

                  {error && <div className="alert alert-danger">{error}</div>}

                  <div className="d-grid">
                    <button className="btn btn-primary" type="submit" disabled={loading || !username || !password}>
                      {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}