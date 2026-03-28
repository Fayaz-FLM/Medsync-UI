import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as api from '../services/api'

export default function ForgotPassword() {
  const [step, setStep] = useState(1) // 1: email, 2: otp, 3: reset
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const nav = useNavigate()

  async function handleSendOtp(e) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    if (!email) {
      setError('Please enter your registered email.')
      return
    }
    try {
      setLoading(true)
      const resp = await api.forgotPassword(email.trim().toLowerCase())
      if (!resp.success) {
        setError(resp.message || 'Unable to send OTP.')
      } else {
        setMessage(resp.message || 'If the email exists, an OTP has been sent.')
        setStep(2)
      }
    } catch (err) {
      setError('Unable to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    if (!otp) {
      setError('Please enter the OTP sent to your email.')
      return
    }
    try {
      setLoading(true)
      const resp = await api.verifyOtp(email.trim().toLowerCase(), otp.trim())
      if (!resp.success) {
        setError(resp.message || 'Invalid or expired OTP.')
      } else {
        setMessage(resp.message || 'OTP verified successfully.')
        setStep(3)
      }
    } catch (err) {
      setError('Unable to verify OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    if (!newPassword || !confirmPassword) {
      setError('Please enter and confirm the new password.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    try {
      setLoading(true)
      const resp = await api.resetPassword(email.trim().toLowerCase(), newPassword)
      if (!resp.success) {
        setError(resp.message || 'Unable to reset password.')
      } else {
        setMessage(resp.message || 'Password reset successfully. You can now sign in.')
        // small delay then go back to login
        setTimeout(() => nav('/login'), 1500)
      }
    } catch (err) {
      setError('Unable to reset password. Please try again.')
    } finally {
      setLoading(false)
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
                <h4 className="mb-3 text-center">Reset your password</h4>
                <p className="text-muted text-center mb-4">
                  Follow the steps to receive an OTP and set a new password for your MedSync account.
                </p>

                <div className="mb-3 text-center">
                  <span className="badge bg-primary me-1">{step === 1 ? '1' : '✓'}</span>
                  <span className={`me-3 ${step === 1 ? '' : 'text-muted'}`}>Enter email</span>
                  <span className={`badge me-1 ${step >= 2 ? 'bg-primary' : 'bg-secondary'}`}>{step > 2 ? '✓' : '2'}</span>
                  <span className={`me-3 ${step === 2 ? '' : 'text-muted'}`}>Verify OTP</span>
                  <span className={`badge me-1 ${step === 3 ? 'bg-primary' : 'bg-secondary'}`}>3</span>
                  <span className={step === 3 ? '' : 'text-muted'}>Set new password</span>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}
                {message && <div className="alert alert-success">{message}</div>}

                {step === 1 && (
                  <form onSubmit={handleSendOtp}>
                    <div className="mb-3">
                      <label className="form-label">Registered email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="d-grid mb-2">
                      <button className="btn btn-primary" type="submit" disabled={loading || !email}>
                        {loading ? 'Sending OTP...' : 'Send OTP'}
                      </button>
                    </div>
                  </form>
                )}

                {step === 2 && (
                  <form onSubmit={handleVerifyOtp}>
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
                      <label className="form-label">OTP from email</label>
                      <input
                        className="form-control"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="d-grid mb-2">
                      <button className="btn btn-primary" type="submit" disabled={loading || !otp}>
                        {loading ? 'Verifying...' : 'Verify OTP'}
                      </button>
                    </div>
                    <div className="text-muted small">
                      Didn&apos;t receive the email? Check your spam folder or{' '}
                      <button
                        type="button"
                        className="btn btn-link btn-sm p-0 align-baseline"
                        disabled={loading}
                        onClick={handleSendOtp}
                      >
                        resend OTP
                      </button>
                      .
                    </div>
                  </form>
                )}

                {step === 3 && (
                  <form onSubmit={handleResetPassword}>
                    <div className="mb-3">
                      <label className="form-label">New password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Confirm new password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="d-grid mb-2">
                      <button className="btn btn-primary" type="submit" disabled={loading || !newPassword || !confirmPassword}>
                        {loading ? 'Saving...' : 'Reset password'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="mt-3 text-center">
                  <Link to="/login">Back to sign in</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

