import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import * as api from '../services/api'

export default function ForceResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const email = location.state?.email || sessionStorage.getItem('resetEmail')
  const message = location.state?.message || 'For security reasons, you must reset your temporary password before continuing.'

  useEffect(() => {
    // If no email is available, redirect to login
    if (!email) {
      navigate('/login', { replace: true })
    }
  }, [email, navigate])

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long'
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter'
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter'
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number'
    }
    return null
  }

  async function handleResetPassword(e) {
    e.preventDefault()
    setError(null)

    // Validation
    const passwordError = validatePassword(newPassword)
    if (passwordError) {
      setError(passwordError)
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const resp = await api.resetPassword(email.trim().toLowerCase(), newPassword)
      
      if (resp.success || resp) {
        setSuccess(true)
        
        // Clear session storage
        sessionStorage.removeItem('resetEmail')
        sessionStorage.removeItem('tempToken')
        
        // Clear any stored tokens
        localStorage.removeItem('token')
        localStorage.removeItem('ms_auth')
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login', { 
            replace: true,
            state: { message: 'Password reset successfully! Please login with your new password.' }
          })
        }, 2000)
      } else {
        setError(resp.message || 'Failed to reset password. Please try again.')
      }
    } catch (err) {
      console.error('Password reset error:', err)
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="login-hero d-flex align-items-center justify-content-center">
        <div className="login-overlay w-100 h-100 position-absolute" />
        <div className="container position-relative">
          <div className="row w-100 justify-content-center">
            <div className="col-11 col-sm-10 col-md-8 col-lg-5">
              <div className="card shadow-sm">
                <div className="card-body p-4 text-center">
                  <div className="mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-check-circle-fill text-success" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </svg>
                  </div>
                  <h4 className="text-success mb-3">Password Reset Successful!</h4>
                  <p className="text-muted">Your password has been updated successfully.</p>
                  <p className="text-muted">Redirecting to login page...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="login-hero d-flex align-items-center justify-content-center">
      <div className="login-overlay w-100 h-100 position-absolute" />
      <div className="container position-relative">
        <div className="row w-100 justify-content-center">
          <div className="col-11 col-sm-10 col-md-8 col-lg-5">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-shield-lock text-warning mb-2" viewBox="0 0 16 16">
                    <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z"/>
                    <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415z"/>
                  </svg>
                  <h4 className="mb-2">Reset Your Password</h4>
                </div>

                <div className="alert alert-warning mb-4">
                  <small><strong>⚠️ Security Notice:</strong> {message}</small>
                </div>

                <form onSubmit={handleResetPassword}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      value={email} 
                      disabled 
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      disabled={loading}
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={loading}
                      placeholder="Confirm new password"
                    />
                  </div>

                  {error && (
                    <div className="alert alert-danger">
                      {error}
                    </div>
                  )}

                  <div className="card bg-light mb-3">
                    <div className="card-body py-2">
                      <small className="text-muted">
                        <strong>Password Requirements:</strong>
                        <ul className="mb-0 mt-1" style={{ fontSize: '0.85rem' }}>
                          <li>At least 8 characters long</li>
                          <li>Include uppercase and lowercase letters</li>
                          <li>Include at least one number</li>
                        </ul>
                      </small>
                    </div>
                  </div>

                  <div className="d-grid">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={loading || !newPassword || !confirmPassword}
                    >
                      {loading ? 'Resetting Password...' : 'Reset Password'}
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
