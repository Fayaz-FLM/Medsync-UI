import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { NAVBAR, ROLE_LABELS, NAVBAR_STYLES, COLORS } from '../../constants/uiConstants'

// Role → dashboard route map
const ROLE_ROUTES = {
  admin:        '/admin',
  doctor:       '/doctor',
  receptionist: '/receptionist',
}

// Role → display label map
const ROLE_LABEL_MAP = {
  admin:        ROLE_LABELS.ADMIN,
  doctor:       ROLE_LABELS.DOCTOR,
  receptionist: ROLE_LABELS.RECEPTIONIST,
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function onLogout() {
    logout()
    nav('/login')
  }

  const rawRoles = user ? (user.roles || (user.role ? [user.role] : [])) : []
  const roles = Array.isArray(rawRoles)
    ? rawRoles.map(r => (typeof r === 'string' ? r.trim().toLowerCase() : r))
    : []

  const activeRole    = Object.keys(ROLE_ROUTES).find(r => roles.includes(r)) || null
  const roleLabel     = activeRole ? ROLE_LABEL_MAP[activeRole]  : ''
  const dashboardRoute = activeRole ? ROLE_ROUTES[activeRole]    : '/'

  return (
    <nav
      className="navbar navbar-expand-lg fixed-top"
      style={scrolled ? NAVBAR_STYLES.scrolled : NAVBAR_STYLES.container}
    >
      <div className="container-fluid" style={{ paddingLeft: '28px', paddingRight: '28px' }}>

        <Link className="navbar-brand fw-bold" to={dashboardRoute} style={NAVBAR_STYLES.brand}>
          {NAVBAR.APP_NAME}
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          style={NAVBAR_STYLES.togglerBtn}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">

          {/* Centre — role badge */}
          <ul className="navbar-nav mx-auto">
            {roleLabel && (
              <li className="nav-item">
                <span className="badge" style={NAVBAR_STYLES.roleBadge}>{roleLabel}</span>
              </li>
            )}
          </ul>

          {/* Right — login / user + logout */}
          <ul className="navbar-nav ms-auto align-items-center">
            {!user ? (
              <li className="nav-item">
                <Link className="btn btn-outline-primary" to="/login" style={NAVBAR_STYLES.navBtn}>
                  {NAVBAR.LOGIN}
                </Link>
              </li>
            ) : (
              <>
                <li className="nav-item me-3">
                  <div className="d-flex align-items-center" style={NAVBAR_STYLES.userAvatar}>
                    <div
                      className="d-flex align-items-center justify-content-center me-2"
                      style={NAVBAR_STYLES.avatarCircle}
                    >
                      {NAVBAR.AVATAR_LETTER}
                    </div>
                    <span style={{ ...NAVBAR_STYLES.username, color: COLORS.TEXT_PRIMARY }}>
                      {user.staffId || NAVBAR.USER_FALLBACK}
                    </span>
                  </div>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={onLogout}
                    style={NAVBAR_STYLES.navBtn}
                  >
                    {NAVBAR.LOGOUT}
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
