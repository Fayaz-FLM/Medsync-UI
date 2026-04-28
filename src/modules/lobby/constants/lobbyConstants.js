// ── LOBBY MODULE CONSTANTS ────────────────────────────────────────────────

export const LOBBY_TEXT = {
  HERO_TITLE:         'Welcome to MedSync',
  SIGNED_IN_AS:       'Signed in as',
  NO_ROLE:            'no role',
  MSG_NO_ROLES:       'No roles assigned. Contact admin to assign roles.',

  // Dashboard link labels
  LINK_RECEPTIONIST:  'Go to Receptionist Dashboard',
  LINK_DOCTOR:        'Go to Doctor Dashboard',
  LINK_ADMIN:         'Go to Admin Dashboard',
}

export const LOBBY_STYLES = {
  wrapper:            '',
  signedInText:       'text-muted',
  alertNoRoles:       'alert alert-warning mt-3',
  btnReceptionist:    'btn btn-primary',
  btnDoctor:          'btn btn-outline-primary',
  btnAdmin:           'btn btn-outline-secondary',
  mt3:                'mt-3',
}

// Role keys used for matching against user.roles
export const LOBBY_ROLES = {
  RECEPTIONIST: 'receptionist',
  DOCTOR:       'doctor',
  ADMIN:        'admin',
}

// Route map per role
export const LOBBY_ROUTES = {
  receptionist: '/receptionist',
  doctor:       '/doctor',
  admin:        '/admin',
}

// Legacy alias
export const LOBBY_TEXTS = LOBBY_TEXT
