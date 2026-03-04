import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading } = useAuth()
  const nav = useNavigate()
  const [error, setError] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      // login should return user object: { username, roles: [...] } or { username, role }
      const user = await login({ email: email.trim(), password })
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
                    <label className="form-label">Email</label>
                    <input
                      className="form-control"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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

                  <div className="mb-3 text-end">
                    <button
                      type="button"
                      className="btn btn-link p-0"
                      disabled={loading}
                      onClick={() => nav('/forgot-password')}
                    >
                      Forgot password?
                    </button>
                  </div>

                  {error && <div className="alert alert-danger">{error}</div>}

                  <div className="d-grid">
                    <button className="btn btn-primary" type="submit" disabled={loading || !email || !password}>
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