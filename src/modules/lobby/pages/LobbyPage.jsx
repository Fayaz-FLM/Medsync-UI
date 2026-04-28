import { Link } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { LOBBY_TEXT, LOBBY_STYLES, LOBBY_ROLES, LOBBY_ROUTES } from '../constants/lobbyConstants'

export default function LobbyPage() {
  const { user } = useAuth()

  const roles = user
    ? (Array.isArray(user.roles) ? user.roles : user.role ? [user.role] : [])
    : []

  return (
    <div className={LOBBY_STYLES.wrapper}>
      <h2>{LOBBY_TEXT.HERO_TITLE}</h2>

      {user && (
        <p>
          {LOBBY_TEXT.SIGNED_IN_AS} <strong>{user.displayName || user.username}</strong>{' '}
          <small className={LOBBY_STYLES.signedInText}>({roles.join(', ') || LOBBY_TEXT.NO_ROLE})</small>
        </p>
      )}

      {roles.includes(LOBBY_ROLES.RECEPTIONIST) && (
        <Link to={LOBBY_ROUTES.receptionist} className={LOBBY_STYLES.btnReceptionist}>
          {LOBBY_TEXT.LINK_RECEPTIONIST}
        </Link>
      )}

      {roles.includes(LOBBY_ROLES.DOCTOR) && (
        <Link to={LOBBY_ROUTES.doctor} className={LOBBY_STYLES.btnDoctor}>
          {LOBBY_TEXT.LINK_DOCTOR}
        </Link>
      )}

      {roles.includes(LOBBY_ROLES.ADMIN) && (
        <div className={LOBBY_STYLES.mt3}>
          <Link to={LOBBY_ROUTES.admin} className={LOBBY_STYLES.btnAdmin}>
            {LOBBY_TEXT.LINK_ADMIN}
          </Link>
        </div>
      )}

      {!roles.length && (
        <div className={LOBBY_STYLES.alertNoRoles}>
          {LOBBY_TEXT.MSG_NO_ROLES}
        </div>
      )}
    </div>
  )
}
