import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading } = useAuth()
  const nav = useNavigate()
  const location = useLocation()
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(location.state?.message || null)

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
    try {
      const user = await login({ email: email.trim(), password })
      
      if (user?.requirePasswordReset) {
        nav('/force-reset-password', { 
          replace: true,
          state: { 
            email: user.email,
            message: 'For security reasons, you must reset your temporary password before continuing.'
          }
        })
        return
      }

      const roles = user?.roles || (user?.role ? [user.role] : [])
      const rolesNorm = Array.isArray(roles) ? roles.map((r) => (typeof r === 'string' ? r.trim().toLowerCase() : r)) : []

      if (rolesNorm.includes('admin')) {
        nav('/admin', { replace: true })
      } else if (rolesNorm.includes('receptionist')) {
        nav('/receptionist', { replace: true })
      } else if (rolesNorm.includes('doctor')) {
        nav('/doctor', { replace: true })
      } else {
        nav('/', { replace: true })
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#e8f4f8' }}>
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-11 col-lg-10 col-xl-8">
            <div className="card border-0 shadow-lg" style={{ borderRadius: '24px', overflow: 'hidden' }}>
              <div className="row g-0">
                {/* Left side - Image */}
                <div className="col-md-6 d-flex align-items-center justify-content-center p-5" style={{ backgroundColor: '#d4e9f7' }}>
                  <div className="text-center">
                    <img 
                      src="/loginimg.png" 
                      alt="Healthcare Professional" 
                      style={{ 
                        maxWidth: '85%', 
                        height: 'auto',
                        filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.1))'
                      }}
                    />
                  </div>
                </div>

                {/* Right side - Form */}
                <div className="col-md-6 bg-white">
                  <div className="p-5">
                    {/* Title */}
                    <div className="text-center mb-4">
                      <h1 className="fw-bold mb-2" style={{ 
                        color: '#2196F3',
                        fontSize: '32px',
                        letterSpacing: '0.5px'
                      }}>
                        MedSync
                      </h1>
                      <p className="text-muted mb-0" style={{ fontSize: '13px' }}>
                        Healthcare Management System
                      </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={onSubmit}>
                      {/* Email */}
                      <div className="mb-3">
                        <label className="form-label mb-2" style={{ 
                          fontSize: '13px',
                          fontWeight: '500',
                          color: '#424242'
                        }}>
                          Email Address
                        </label>
                        <input
                          className="form-control"
                          type="email"
                          placeholder="receptionist@flmhospitals.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading}
                          style={{ 
                            padding: '14px 18px',
                            backgroundColor: '#b0bec5',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '14px',
                            color: '#fff'
                          }}
                        />
                      </div>

                      {/* Password */}
                      <div className="mb-2">
                        <label className="form-label mb-2" style={{ 
                          fontSize: '13px',
                          fontWeight: '500',
                          color: '#424242'
                        }}>
                          Password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="••••••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={loading}
                          style={{ 
                            padding: '14px 18px',
                            backgroundColor: '#b0bec5',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '14px',
                            color: '#fff'
                          }}
                        />
                      </div>

                      {/* Forgot password */}
                      <div className="mb-4 text-end">
                        <button
                          type="button"
                          className="btn btn-link p-0"
                          disabled={loading}
                          onClick={() => nav('/forgot-password')}
                          style={{ 
                            textDecoration: 'none',
                            color: '#2196F3',
                            fontSize: '13px',
                            fontWeight: '400'
                          }}
                        >
                          Forgot password?
                        </button>
                      </div>

                      {/* Alerts */}
                      {successMessage && (
                        <div className="alert alert-success mb-3" style={{ fontSize: '13px' }}>
                          {successMessage}
                        </div>
                      )}
                      {error && (
                        <div className="alert alert-danger mb-3" style={{ fontSize: '13px' }}>
                          {error}
                        </div>
                      )}

                      {/* Sign In button */}
                      <div className="d-grid mb-4">
                        <button 
                          className="btn" 
                          type="submit" 
                          disabled={loading || !email || !password}
                          style={{
                            padding: '14px',
                            backgroundColor: '#2196F3',
                            border: 'none',
                            borderRadius: '10px',
                            fontWeight: '500',
                            fontSize: '15px',
                            color: '#fff',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = '#1976D2'}
                          onMouseOut={(e) => e.target.style.backgroundColor = '#2196F3'}
                        >
                          {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                      </div>

                      {/* Footer text */}
                      <p className="text-center text-muted mb-0" style={{ 
                        fontSize: '11px',
                        color: '#9e9e9e'
                      }}>
                        Secure healthcare management platform
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}