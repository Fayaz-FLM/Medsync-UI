import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function NavBar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()

  function onLogout() {
    logout()
    nav('/login')
  }

  // normalize roles to lowercase for consistent checks
  const rawRoles = user ? user.roles || (user.role ? [user.role] : []) : []
  const roles = Array.isArray(rawRoles) ? rawRoles.map(r => (typeof r === 'string' ? r.trim().toLowerCase() : r)) : []

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          MedSync
        </Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            {roles.includes('receptionist') && (
              <li className="nav-item">
                <Link className="nav-link" to="/receptionist">
                  Receptionist
                </Link>
              </li>
            )}

            {roles.includes('doctor') && (
              <li className="nav-item">
                <Link className="nav-link" to="/doctor">
                  Doctor
                </Link>
              </li>
            )}
            {roles.includes('admin') && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">
                  Admin
                </Link>
              </li>
            )}
          </ul>

          <ul className="navbar-nav ms-auto">
            {!user ? (
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
            ) : (
              <>
                <li className="nav-item nav-link">Hello, {user.username}</li>
                <li className="nav-item">
                  <button className="btn btn-outline-secondary" onClick={onLogout}>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}