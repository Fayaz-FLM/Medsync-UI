// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL UI CONSTANTS - Single Source of Truth
// ═══════════════════════════════════════════════════════════════════════════

// ── NAVBAR CONSTANTS ──────────────────────────────────────────────────────
export const NAVBAR = {
  APP_NAME: 'MedSync',
  LOGOUT:   'Logout',
  LOGIN:    'Login',
  USER_FALLBACK: 'USER001',
  AVATAR_LETTER: 'A',
}

// ── ROLE LABELS ───────────────────────────────────────────────────────────
export const ROLE_LABELS = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  RECEPTIONIST: 'RECEPTIONIST',
}

// ── COLORS ────────────────────────────────────────────────────────────────
export const COLORS = {
  // Primary
  PRIMARY: '#0288d1',
  PRIMARY_LIGHT: '#e8f4f8',
  PRIMARY_DARK: '#01579b',
  
  // Status
  SUCCESS: '#22c55e',
  SUCCESS_LIGHT: '#d4edda',
  SUCCESS_DARK: '#155724',
  DANGER: '#ef4444',
  DANGER_LIGHT: '#f8d7da',
  DANGER_DARK: '#721c24',
  WARNING: '#f59e0b',
  INFO: '#3b82f6',
  
  // Neutral
  WHITE: '#ffffff',
  BLACK: '#000000',
  GRAY_50: '#f9fafb',
  GRAY_100: '#f3f4f6',
  GRAY_200: '#e5e7eb',
  GRAY_300: '#d1d5db',
  GRAY_400: '#9ca3af',
  GRAY_500: '#6b7280',
  GRAY_600: '#4b5563',
  GRAY_700: '#374151',
  GRAY_800: '#1f2937',
  GRAY_900: '#111827',
  
  // Background
  BG_LIGHT: '#f5f5f5',
  BG_WHITE: '#ffffff',
  
  // Text
  TEXT_PRIMARY: '#2c3e50',
  TEXT_SECONDARY: '#495057',
  TEXT_MUTED: '#6c757d',
  
  // Border
  BORDER_LIGHT: '#dee2e6',
  BORDER_DEFAULT: '#e9ecef',
}

// ── COMMON BUTTON TEXTS ───────────────────────────────────────────────────
export const BUTTONS = {
  ADD: 'Add',
  EDIT: 'Edit',
  DELETE: 'Delete',
  SAVE: 'Save',
  CANCEL: 'Cancel',
  SUBMIT: 'Submit',
  CLOSE: 'Close',
  CONFIRM: 'Confirm',
  REFRESH: 'Refresh',
  REFRESHING: 'Refreshing...',
  SEARCH: 'Search',
  FILTER: 'Filter',
  RESET: 'Reset',
  UPDATE: 'Update',
  CREATE: 'Create',
  RESIGN: 'Resign',
}

// ── TABLE COMMON TEXTS ────────────────────────────────────────────────────
export const TABLE = {
  NO_DATA: 'No data found',
  LOADING: 'Loading...',
  ACTIONS: 'Actions',
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  YES: 'Yes',
  NO: 'No',
}

// ── FORM COMMON TEXTS ─────────────────────────────────────────────────────
export const FORM = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Invalid email address',
  INVALID_PHONE: 'Invalid phone number',
  SELECT_OPTION: 'Select an option',
}

// ── STAFF TABLE COLUMNS ───────────────────────────────────────────────────
export const STAFF_TABLE_COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'NAME' },
  { key: 'type', label: 'TYPE' },
  { key: 'role', label: 'ROLE' },
  { key: 'phone', label: 'PHONE' },
  { key: 'active', label: 'ACTIVE' },
  { key: 'actions', label: 'ACTIONS' },
]

// ── NAVBAR STYLES ─────────────────────────────────────────────────────────
export const NAVBAR_STYLES = {
  container: {
    backgroundColor: 'white',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    borderBottom: '1px solid #e9ecef',
  },
  scrolled: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
  },
  brand: {
    fontSize: '1.4rem',
    color: '#2c3e50',
    letterSpacing: '0.3px',
  },
  roleBadge: {
    backgroundColor: '#e8f4f8',
    color: '#0288d1',
    padding: '6px 16px',
    fontSize: '0.8rem',
    fontWeight: '600',
    borderRadius: '4px',
  },
  userAvatar: {
    backgroundColor: '#e8f4f8',
    borderRadius: '50px',
    padding: '6px 16px 6px 6px',
  },
  avatarCircle: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#0288d1',
    color: 'white',
    fontWeight: '600',
    fontSize: '0.85rem',
  },
  navBtn: {
    borderRadius: '6px',
    padding: '8px 20px',
    fontWeight: '500',
  },
  username: {
    fontWeight: '500',
    fontSize: '0.9rem',
  },
  togglerBtn: {
    border: 'none',
  },
}

// ── TABLE STYLES ──────────────────────────────────────────────────────────
export const TABLE_STYLES = {
  container: {
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #dee2e6',
  },
  header: {
    backgroundColor: '#0288d1',
    color: 'white',
  },
  headerCell: {
    padding: '14px 16px',
    fontWeight: '600',
    fontSize: '0.8rem',
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
    border: 'none',
  },
  bodyCell: {
    padding: '12px 16px',
    color: '#2c3e50',
  },
  row: {
    borderBottom: '1px solid #f0f0f0',
  },
}

// ── BUTTON STYLES ─────────────────────────────────────────────────────────
export const BUTTON_STYLES = {
  primary: {
    backgroundColor: '#0288d1',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 24px',
    fontWeight: '500',
    color: 'white',
    fontSize: '0.9rem',
  },
  secondary: {
    backgroundColor: 'white',
    border: '1px solid #dee2e6',
    borderRadius: '6px',
    padding: '8px 20px',
    fontWeight: '500',
    color: '#495057',
    fontSize: '0.9rem',
  },
  outline: {
    backgroundColor: 'white',
    border: '1px solid #0288d1',
    color: '#0288d1',
    borderRadius: '4px',
    padding: '5px 14px',
    fontWeight: '500',
    fontSize: '0.8rem',
  },
  danger: {
    backgroundColor: 'white',
    border: '1px solid #dc3545',
    color: '#dc3545',
    borderRadius: '4px',
    padding: '5px 14px',
    fontWeight: '500',
    fontSize: '0.8rem',
  },
}

// ── BADGE STYLES ──────────────────────────────────────────────────────────
export const BADGE_STYLES = {
  success: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  danger: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  info: {
    backgroundColor: '#e8f4f8',
    color: '#0288d1',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '700',
  },
}
