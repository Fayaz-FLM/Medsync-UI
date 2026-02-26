import React, { useState } from 'react'
import * as api from '../services/api'
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
  // Forgot password states
  const [showForgot, setShowForgot] = useState(false)
  const [forgotStep, setForgotStep] = useState(1) // 1: email, 2: otp, 3: reset
  const [forgotEmail, setForgotEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')

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
                {!showForgot ? (
                  <>
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
                      <div className="d-grid mb-2">
                        <button className="btn btn-primary" type="submit" disabled={loading || !username || !password}>
                          {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                      </div>
                    </form>
                    <div className="text-center mt-2">
                      <button className="btn btn-link p-0" style={{fontSize: '0.95em'}} onClick={() => setShowForgot(true)}>
                        Forgot password?
                      </button>
                    </div>
                  </>
                ) : (
                  <ForgotPasswordFlow
                    step={forgotStep}
                    email={forgotEmail}
                    setEmail={setForgotEmail}
                    otp={otp}
                    setOtp={setOtp}
                    newPassword={newPassword}
                    setNewPassword={setNewPassword}
                    setStep={setForgotStep}
                    setShowForgot={setShowForgot}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )


// Forgot Password Flow Component
function ForgotPasswordFlow({ step, email, setEmail, otp, setOtp, newPassword, setNewPassword, setStep, setShowForgot }) {
  // Use local state for all fields to avoid focus loss
  const [loading, setLoading] = useState(false)
  const [localEmail, setLocalEmail] = useState(email || '')
  const [localOtp, setLocalOtp] = useState(otp || '')
  const [localPassword, setLocalPassword] = useState(newPassword || '')
  const [otpVerified, setOtpVerified] = useState(false)

  // Sync parent state on submit only
  function syncEmail() { setEmail && setEmail(localEmail) }
  function syncOtp() { setOtp && setOtp(localOtp) }
  function syncPassword() { setNewPassword && setNewPassword(localPassword) }

  // Step 1: Send OTP
  async function handleSendOtp(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await apiSendOtp(localEmail)
      alert(res)
      syncEmail()
      setStep(2)
    } catch (err) {
      alert(err.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify OTP
  async function handleVerifyOtp(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await apiVerifyOtp(localEmail, localOtp)
      // Only proceed if backend confirms OTP is valid
      if (typeof res === 'string' && res.toLowerCase().includes('success')) {
        alert(res)
        setOtpVerified(true)
        syncOtp()
        setStep(3)
      } else {
        throw new Error(res?.message || 'Invalid OTP')
      }
    } catch (err) {
      alert(err.message || 'Failed to verify OTP')
    } finally {
      setLoading(false)
    }
  }

  // Step 3: Reset Password
  async function handleResetPassword(e) {
    e.preventDefault()
    setLoading(true)
    try {
      syncPassword()
        const res = await apiResetPassword(localEmail, localPassword)
        alert(res)
        setShowForgot(false)
        setStep(1)
      } catch (err) {
        alert(err.message || 'Failed to reset password')
      } finally {
        setLoading(false)
      }
    }
  
    return (
      <div>
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div className="mb-3">
              <label className="form-label">Enter your registered email</label>
              <input
                type="email"
                className="form-control"
                value={localEmail}
                onChange={e => setLocalEmail(e.target.value)}
                required
                disabled={loading}
                autoFocus
              />
            </div>
            <div className="d-grid mb-2">
              <button className="btn btn-primary" type="submit" disabled={loading || !localEmail}>
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </div>
            <div className="text-center mt-2">
              <button className="btn btn-link p-0" type="button" onClick={() => setShowForgot(false)}>
                Back to login
              </button>
            </div>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <div className="mb-3">
              <label className="form-label">Enter OTP sent to your email</label>
              <input
                type="text"
                className="form-control"
                value={localOtp}
                onChange={e => setLocalOtp(e.target.value)}
                required
                disabled={loading}
                autoFocus
              />
            </div>
            <div className="d-grid mb-2">
              <button className="btn btn-primary" type="submit" disabled={loading || !localOtp}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="mb-3">
              <label className="form-label">Enter new password</label>
              <input
                type="password"
                className="form-control"
                value={localPassword}
                onChange={e => setLocalPassword(e.target.value)}
                required
                disabled={loading}
                autoFocus
                minLength={6}
              />
              <div className="form-text">Password must be at least 6 characters.</div>
            </div>
            <div className="d-grid mb-2">
              <button className="btn btn-primary" type="submit" disabled={loading || !localPassword || localPassword.length < 6}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    )
}

// API helpers for forgot password
async function apiSendOtp(email) {
  // POST /staff/forgot-password { email }
  const res = await apiPost('/staff/forgot-password', { email })
  return res
}
async function apiVerifyOtp(email, otp) {
  // POST /staff/verify-otp { email, otp }
  const res = await apiPost('/staff/verify-otp', { email, otp })
  return res
}
async function apiResetPassword(email, newPassword) {
  // POST /staff/reset-password { email, newPassword }
  const res = await apiPost('/staff/reset-password', { email, newPassword })
  return res
}

// Generic POST helper
async function apiPost(path, body) {
  try {
    const resp = await apiCall(path, body)
    return typeof resp === 'string' ? resp : (resp?.message || 'Success')
  } catch (err) {
    throw new Error(err?.response?.data || err.message || 'Request failed')
  }
}

// Use axios directly for custom calls
async function apiCall(path, body) {
  const url = `http://localhost:8000${path}`
  const resp = await api && api.default && api.default.post ? api.default.post(url, body) : (window.axios ? window.axios.post(url, body) : fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.text()))
  if (resp && resp.data) return resp.data
  if (typeof resp === 'string') return resp
  return resp
}
}