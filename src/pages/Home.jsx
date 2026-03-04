import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Home() {
  const { user } = useAuth()

  const roles = user ? (Array.isArray(user.roles) ? user.roles : user.role ? [user.role] : []) : []

  return (
    <div>
      <h2>Welcome to MedSync</h2>

      {user && (
        <p>
          Signed in as <strong>{user.displayName || user.username}</strong>{' '}
          <small className="text-muted">({roles.join(', ') || 'no role'})</small>
        </p>
      )}

      {roles.includes('receptionist') && (
        <>
          <Link to="/receptionist" className="btn btn-primary">
            Go to Receptionist Dashboard
          </Link>
        </>
      )}

      {roles.includes('doctor') && (
        <>
          <Link to="/doctor" className="btn btn-outline-primary">
            Go to Doctor Dashboard
          </Link>
        </>
      )}

      {roles.includes('admin') && (
        <>
          <div className="mt-3">
            <Link to="/admin" className="btn btn-outline-secondary">
              Go to Admin Dashboard
            </Link>
          </div>
        </>
      )}

      {/* If user has no recognized roles */}
      {!roles.length && (
        <div className="alert alert-warning mt-3">No roles assigned. Contact admin to assign roles.</div>
      )}
    </div>
  )
}