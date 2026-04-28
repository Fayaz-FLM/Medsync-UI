// ── AUTH MODULE CONSTANTS ────────────────────────────────────────────────
// This file contains all UI text strings for the Auth module.

export const AUTH_TEXTS = {
  // Login page
  LOGIN_TITLE:          'MedSync — Sign in',
  LOGIN_SUBTITLE:       'Healthcare Management System',
  LOGIN_DESCRIPTION:    'Secure healthcare management platform',
  
  // Form labels
  LABEL_EMAIL:          'Email Address',
  LABEL_PASSWORD:       'Password',
  LABEL_OTP:            'OTP from email',
  LABEL_NEW_PASSWORD:   'New password',
  LABEL_CONFIRM_PASSWORD: 'Confirm new password',
  
  // Buttons
  BTN_SIGN_IN:          'Sign In',
  BTN_SIGNING_IN:       'Signing in...',
  BTN_SEND_OTP:         'Send OTP',
  BTN_SENDING_OTP:      'Sending OTP...',
  BTN_VERIFY_OTP:       'Verify OTP',
  BTN_VERIFYING:        'Verifying...',
  BTN_RESET_PASSWORD:   'Reset password',
  BTN_SAVING:           'Saving...',
  BTN_BACK_TO_LOGIN:    'Back to sign in',
  BTN_RESEND_OTP:       'resend OTP',
  
  // Links
  LINK_FORGOT_PASSWORD: 'Forgot password?',
  
  // Forgot password page
  FORGOT_PASSWORD_TITLE: 'Reset your password',
  FORGOT_PASSWORD_SUBTITLE: 'Follow the steps to receive an OTP and set a new password for your MedSync account.',
  
  // Steps
  STEP_EMAIL:           'Enter email',
  STEP_VERIFY_OTP:      'Verify OTP',
  STEP_SET_PASSWORD:    'Set new password',
  
  // Messages
  MSG_ENTER_EMAIL:      'Please enter your registered email.',
  MSG_ENTER_OTP:        'Please enter the OTP sent to your email.',
  MSG_ENTER_PASSWORD:   'Please enter and confirm the new password.',
  MSG_PASSWORD_MISMATCH: 'Passwords do not match.',
  MSG_OTP_SENT:         'If the email exists, an OTP has been sent.',
  MSG_OTP_VERIFIED:     'OTP verified successfully.',
  MSG_PASSWORD_RESET:   'Password reset successfully. You can now sign in.',
  MSG_NO_EMAIL:         "Didn't receive the email? Check your spam folder or",
  
  // Error messages
  ERROR_LOGIN_FAILED:   'Login failed. Please try again.',
  ERROR_SEND_OTP:       'Unable to send OTP. Please try again.',
  ERROR_VERIFY_OTP:     'Unable to verify OTP. Please try again.',
  ERROR_RESET_PASSWORD: 'Unable to reset password. Please try again.',
  ERROR_INVALID_OTP:    'Invalid or expired OTP.',
  ERROR_INVALID_EMAIL:  'Unable to send OTP.',
  
  // Force reset password
  FORCE_RESET_TITLE:    'Reset Your Temporary Password',
  FORCE_RESET_SUBTITLE: 'For security reasons, you must reset your temporary password before continuing.',
  FORCE_RESET_MESSAGE:  'Please enter a new password for your account.',
  
  // Success messages
  SUCCESS_LOGIN:        'Login successful',
  SUCCESS_OTP_SENT:     'OTP sent successfully',
  SUCCESS_OTP_VERIFIED: 'OTP verified successfully',
  SUCCESS_PASSWORD_RESET: 'Password reset successfully',
}

// ── AUTH CONFIGURATION ───────────────────────────────────────────────────
export const AUTH_CONFIG = {
  // Password requirements
  minPasswordLength: 8,
  requireUppercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  
  // OTP settings
  otpLength: 6,
  otpExpiryMinutes: 10,
  
  // Session settings
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  rememberMeDuration: 7 * 24 * 60 * 60 * 1000, // 7 days
}

// ── VALIDATION PATTERNS ──────────────────────────────────────────────────
export const AUTH_VALIDATION = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_UPPERCASE: /[A-Z]/,
  PASSWORD_NUMBERS: /[0-9]/,
  PASSWORD_SPECIAL: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
}

// ── ROLE-BASED ROUTING ───────────────────────────────────────────────────
export const ROLE_ROUTES = {
  ADMIN: '/admin',
  RECEPTIONIST: '/receptionist',
  DOCTOR: '/doctor',
  DEFAULT: '/',
}

// ── ROLE PRIORITY ───────────────────────────────────────────────────────
export const ROLE_PRIORITY = ['admin', 'receptionist', 'doctor']
