// ============= RECEPTIONIST MODULE CONSTANTS =============

// ============= MODERN COLOR PALETTE =============
// Inspired by Linear, Stripe, and modern healthcare apps
export const COLORS = {
  // Primary Colors - Soft Indigo/Deep Blue
  primary: '#4F46E5',           // Indigo-600
  primaryHover: '#4338CA',      // Indigo-700
  primaryLight: '#EEF2FF',      // Indigo-50
  primaryBorder: '#C7D2FE',     // Indigo-200
  
  // Success Colors - Muted Sage/Emerald
  success: '#059669',           // Emerald-600
  successHover: '#047857',      // Emerald-700
  successLight: '#ECFDF5',      // Emerald-50
  successBorder: '#A7F3D0',     // Emerald-200
  
  // Danger Colors - Soft Coral/Rose
  danger: '#E11D48',            // Rose-600
  dangerHover: '#BE123C',       // Rose-700
  dangerLight: '#FFF1F2',       // Rose-50
  dangerBorder: '#FECDD3',      // Rose-200
  
  // Warning Colors - Soft Amber
  warning: '#D97706',           // Amber-600
  warningHover: '#B45309',      // Amber-700
  warningLight: '#FFFBEB',      // Amber-50
  warningBorder: '#FDE68A',     // Amber-200
  
  // Info Colors - Soft Sky Blue
  info: '#0284C7',              // Sky-600
  infoHover: '#0369A1',         // Sky-700
  infoLight: '#F0F9FF',         // Sky-50
  infoBorder: '#BAE6FD',        // Sky-200
  
  // Neutral Colors - Professional Grays
  slate900: '#0F172A',          // Headings
  slate800: '#1E293B',          // Dark text
  slate700: '#334155',          // Body text
  slate600: '#475569',          // Secondary text
  slate500: '#64748B',          // Muted text
  slate400: '#94A3B8',          // Borders
  slate300: '#CBD5E1',          // Light borders
  slate200: '#E2E8F0',          // Dividers
  slate100: '#F1F5F9',          // Light backgrounds
  slate50: '#F8FAFC',           // Page background
  
  // Semantic Colors
  white: '#FFFFFF',
  black: '#000000',
  
  // Legacy support (mapped to new palette)
  clinicalBlue: '#4F46E5',
  emeraldGreen: '#059669',
  primaryBlue: '#4F46E5',
  amber: '#D97706',
  secondary: '#64748B',
  lightGray: '#F8FAFC',
  darkGray: '#1E293B',
  mediumGray: '#64748B'
};

// ============= MODERN STYLES =============
export const STYLES = {
  // Modern Card Style - Soft shadows, subtle borders
  card: {
    background: COLORS.white,
    borderRadius: '12px',
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    border: `1px solid ${COLORS.slate200}`,
    transition: 'all 0.2s ease'
  },
  
  cardHover: {
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    transform: 'translateY(-2px)'
  },
  
  // Glassmorphism (kept for specific use cases)
  glassContainer: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '12px',
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    border: `1px solid ${COLORS.slate200}`
  },
  
  // Modal Overlay
  modalOverlay: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(4px)',
    zIndex: 1050
  },
  
  // Typography - Inter font stack
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    heading: {
      fontWeight: '700',
      fontSize: '1.5rem',
      color: COLORS.slate900,
      letterSpacing: '-0.025em'
    },
    subheading: {
      fontWeight: '600',
      fontSize: '1.125rem',
      color: COLORS.slate800,
      letterSpacing: '-0.0125em'
    },
    body: {
      fontWeight: '400',
      fontSize: '0.875rem',
      color: COLORS.slate700,
      lineHeight: '1.5'
    },
    label: {
      fontWeight: '500',
      fontSize: '0.875rem',
      color: COLORS.slate600
    },
    caption: {
      fontWeight: '400',
      fontSize: '0.75rem',
      color: COLORS.slate500
    }
  },
  
  // Button Styles
  button: {
    primary: {
      background: COLORS.primary,
      color: COLORS.white,
      border: 'none',
      borderRadius: '8px',
      padding: '0.625rem 1.25rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      transition: 'all 0.15s ease',
      boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
    },
    secondary: {
      background: COLORS.white,
      color: COLORS.slate700,
      border: `1px solid ${COLORS.slate300}`,
      borderRadius: '8px',
      padding: '0.625rem 1.25rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      transition: 'all 0.15s ease'
    },
    ghost: {
      background: 'transparent',
      color: COLORS.slate600,
      border: 'none',
      borderRadius: '8px',
      padding: '0.5rem 0.75rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      transition: 'all 0.15s ease'
    },
    danger: {
      background: COLORS.danger,
      color: COLORS.white,
      border: 'none',
      borderRadius: '8px',
      padding: '0.625rem 1.25rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      transition: 'all 0.15s ease',
      boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
    },
    success: {
      background: COLORS.success,
      color: COLORS.white,
      border: 'none',
      borderRadius: '8px',
      padding: '0.625rem 1.25rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      transition: 'all 0.15s ease',
      boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
    }
  },
  
  // Input Styles
  input: {
    borderRadius: '8px',
    border: `1px solid ${COLORS.slate300}`,
    padding: '0.625rem 0.875rem',
    fontSize: '0.875rem',
    color: COLORS.slate700,
    transition: 'all 0.15s ease'
  },
  
  // Badge Styles
  badge: {
    success: {
      background: COLORS.successLight,
      color: COLORS.success,
      border: `1px solid ${COLORS.successBorder}`,
      borderRadius: '6px',
      padding: '0.25rem 0.625rem',
      fontSize: '0.75rem',
      fontWeight: '500'
    },
    danger: {
      background: COLORS.dangerLight,
      color: COLORS.danger,
      border: `1px solid ${COLORS.dangerBorder}`,
      borderRadius: '6px',
      padding: '0.25rem 0.625rem',
      fontSize: '0.75rem',
      fontWeight: '500'
    },
    warning: {
      background: COLORS.warningLight,
      color: COLORS.warning,
      border: `1px solid ${COLORS.warningBorder}`,
      borderRadius: '6px',
      padding: '0.25rem 0.625rem',
      fontSize: '0.75rem',
      fontWeight: '500'
    },
    info: {
      background: COLORS.infoLight,
      color: COLORS.info,
      border: `1px solid ${COLORS.infoBorder}`,
      borderRadius: '6px',
      padding: '0.25rem 0.625rem',
      fontSize: '0.75rem',
      fontWeight: '500'
    }
  },
  
  // Sidebar Styles
  sidebar: {
    width: '260px',
    background: COLORS.white,
    borderRight: `1px solid ${COLORS.slate200}`,
    padding: '1.5rem 1rem'
  },
  
  sidebarItem: {
    inactive: {
      background: 'transparent',
      color: COLORS.slate600,
      borderRadius: '8px',
      padding: '0.75rem 1rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      transition: 'all 0.15s ease',
      borderTop: 'none',
      borderRight: 'none',
      borderBottom: 'none',
      borderLeft: 'none',
      position: 'relative'
    },
    active: {
      background: COLORS.primaryLight,
      color: COLORS.primary,
      borderRadius: '8px',
      padding: '0.75rem 1rem',
      fontSize: '0.875rem',
      fontWeight: '600',
      transition: 'all 0.15s ease',
      borderTop: 'none',
      borderRight: 'none',
      borderBottom: 'none',
      borderLeft: `3px solid ${COLORS.primary}`,
      position: 'relative'
    }
  }
};

// ============= APPOINTMENTS SECTION =============
export const APPOINTMENTS = {
  title: 'Appointment Management',
  labels: {
    selectDate: 'Select Date:',
    refresh: 'Refresh',
    lastRefresh: 'Last:',
    bookNew: 'Book New Appointment',
    searchPlaceholder: 'Search by patient/doctor name or ID...',
    loading: 'Loading appointments...',
    noAppointments: 'No appointments for this date.',
    noSearchResults: 'No appointments matching your search.'
  },
  table: {
    headers: {
      time: 'Time',
      patient: 'Patient',
      patientId: 'Patient ID',
      doctor: 'Doctor',
      doctorId: 'Doctor ID',
      notes: 'Notes',
      status: 'Status',
      actions: 'Actions'
    }
  },
  actions: {
    viewReason: 'View Reason',
    viewDiet: 'View Diet',
    aiDiet: 'AI Diet',
    viewPatient: 'View Patient',
    reschedule: 'Reschedule',
    cancel: 'Cancel',
    cancelled: 'Cancelled'
  },
  booking: {
    title: 'Book Appointment',
    labels: {
      patient: 'Patient',
      doctor: 'Doctor',
      date: 'Date',
      startTime: 'Start Time',
      endTime: 'End Time',
      reasonForVisit: 'Reason for Visit',
      notes: 'Notes'
    },
    placeholders: {
      selectPatient: 'Select Patient',
      selectDoctor: 'Select Doctor'
    },
    buttons: {
      cancel: 'Cancel',
      book: 'Book Appointment'
    },
    messages: {
      fillRequired: 'Please fill all required fields',
      success: 'Appointment booked successfully!',
      failed: 'Failed to book appointment'
    }
  },
  reschedule: {
    title: 'Reschedule Appointment',
    labels: {
      patient: 'Patient:',
      doctor: 'Doctor:',
      current: 'Current:',
      newDate: 'New Date',
      startTime: 'Start Time',
      endTime: 'End Time'
    },
    buttons: {
      cancel: 'Cancel',
      reschedule: 'Reschedule'
    },
    messages: {
      fillRequired: 'Please fill all required fields',
      success: 'Appointment rescheduled successfully!',
      failed: 'Failed to reschedule appointment'
    }
  },
  reason: {
    title: 'Reason for Visit',
    labels: {
      patient: 'Patient:',
      date: 'Date:',
      time: 'Time:',
      reason: 'Reason:',
      notes: 'Notes:',
      noReason: 'No reason provided.'
    },
    buttons: {
      close: 'Close'
    }
  },
  cancel: {
    title: 'Confirm Cancellation',
    message: 'Are you sure you want to cancel this appointment?',
    buttons: {
      no: 'No, Keep It',
      yes: 'Yes, Cancel It'
    },
    messages: {
      success: 'Appointment cancelled successfully',
      failed: 'Failed to cancel appointment',
      unable: 'Unable to cancel appointment'
    }
  },
  patient: {
    title: 'Patient Details',
    labels: {
      patientId: 'Patient ID:',
      name: 'Name:',
      email: 'Email:',
      phone: 'Phone:',
      dob: 'Date of Birth:',
      gender: 'Gender:',
      address: 'Address:'
    },
    buttons: {
      close: 'Close'
    },
    messages: {
      notFound: 'Patient not found',
      loadFailed: 'Failed to load patient details'
    }
  },
  diet: {
    title: 'AI-Generated Diet Plan',
    heading: 'MedSync AI Diet Plan',
    generatedOn: 'Generated on:',
    noData: 'No diet plan available.',
    buttons: {
      close: 'Close'
    },
    messages: {
      failed: 'Failed to generate diet plan'
    }
  },
  messages: {
    loadFailed: 'Failed to load appointments'
  }
};

// ============= PATIENTS SECTION =============
export const PATIENTS = {
  title: 'Patient Management',
  labels: {
    addNew: 'Add New Patient',
    searchPlaceholder: 'Search by name, email, or patient ID...',
    noPatients: 'No patients found.',
    noSearchResults: 'No patients matching your search.'
  },
  table: {
    headers: {
      patientId: 'Patient ID',
      name: 'Name',
      gender: 'Gender',
      phone: 'Phone',
      email: 'Email',
      city: 'City',
      actions: 'Actions'
    }
  },
  actions: {
    edit: 'Edit',
    book: 'Book'
  },
  form: {
    addTitle: 'Add New Patient',
    editTitle: 'Edit Patient',
    labels: {
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      dob: 'Date of Birth',
      gender: 'Gender',
      street: 'Street',
      city: 'City',
      state: 'State',
      zip: 'Zip'
    },
    placeholders: {
      selectGender: 'Select Gender'
    },
    genderOptions: {
      male: 'Male',
      female: 'Female',
      other: 'Other'
    },
    buttons: {
      cancel: 'Cancel',
      add: 'Add Patient',
      update: 'Update Patient'
    },
    messages: {
      addSuccess: 'Patient added successfully!',
      addFailed: 'Failed to add patient',
      updateSuccess: 'Patient updated successfully!',
      updateFailed: 'Failed to update patient'
    }
  }
};

// ============= ROOMS & BEDS SECTION =============
export const ROOMS_BEDS = {
  title: 'Rooms & Beds',
  labels: {
    addRoom: 'Add Room',
    totalRooms: 'Total Rooms',
    bedsOccupied: 'Beds Occupied',
    bedsAvailable: 'Beds Available',
    beds: 'Beds:'
  },
  card: {
    labels: {
      type: 'Type:',
      capacity: 'Capacity:',
      occupied: 'Occupied:',
      free: 'Free:'
    },
    actions: {
      edit: 'Edit',
      delete: 'Delete',
      vacate: 'Vacate'
    }
  },
  form: {
    addTitle: 'Add Room',
    editTitle: 'Edit Room',
    labels: {
      roomNumber: 'Room Number',
      roomType: 'Room Type',
      roomCapacity: 'Room Capacity'
    },
    roomTypes: {
      general: 'General',
      icu: 'ICU',
      private: 'Private'
    },
    buttons: {
      close: 'Close',
      add: 'Add',
      update: 'Update'
    }
  },
  messages: {
    addSuccess: 'Room added successfully',
    addFailed: 'Failed to add room',
    updateSuccess: 'Room updated successfully',
    updateFailed: 'Failed to update room',
    deleteConfirm: 'Are you sure you want to delete this room?',
    deleteSuccess: 'Room deleted successfully',
    deleteFailed: 'Failed to delete room',
    vacateConfirm: 'Are you sure you want to vacate this bed?',
    vacateSuccess: 'Bed vacated successfully',
    vacateFailed: 'Failed to vacate bed'
  }
};

// ============= DASHBOARD SECTION =============
export const DASHBOARD = {
  title: 'Receptionist Dashboard',
  subtitle: 'Manage bookings, patients, rooms & beds',
  stats: {
    patients: {
      label: 'Total Patients',
      sublabel: 'Today',
      icon: 'bi-people-fill',
      color: 'primary'
    },
    appointments: {
      label: 'Appointments',
      sublabel: 'Today',
      icon: 'bi-calendar-check-fill',
      color: 'success'
    },
    rooms: {
      label: 'Total Rooms',
      sublabel: 'Available',
      icon: 'bi-hospital-fill',
      color: 'info'
    },
    beds: {
      label: 'Beds Occupied',
      sublabel: 'Available',
      icon: 'bi-bed-fill',
      color: 'warning'
    }
  }
};

// ============= SIDEBAR =============
export const SIDEBAR = {
  sections: [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-grid-fill' },
    { id: 'appointments', label: 'Appointments', icon: 'bi-calendar-check-fill' },
    { id: 'patients', label: 'Patients', icon: 'bi-people-fill' },
    { id: 'rooms', label: 'Rooms & Beds', icon: 'bi-hospital-fill' }
  ]
};

// ============= DIAGNOSIS MODAL =============
export const DIAGNOSIS = {
  view: {
    title: 'Diagnosis Details',
    labels: {
      patientId: 'Patient ID:',
      doctorId: 'Doctor ID:',
      summary: 'Diagnosis Summary',
      prescription: 'Prescription',
      medicines: 'Medicines',
      notes: 'Notes for Receptionist',
      followUp: 'Follow-up Suggestion',
      dietPlan: 'AI Diet Plan',
      na: 'N/A'
    },
    buttons: {
      close: 'Close'
    }
  },
  submit: {
    title: 'Submit Diagnosis',
    labels: {
      summary: 'Diagnosis Summary',
      prescription: 'Prescription',
      medicines: 'Medicines',
      notes: 'Notes for Receptionist',
      followUp: 'Follow-up Suggestion'
    },
    placeholders: {
      summary: 'Enter diagnosis summary...',
      prescription: 'Enter prescription details...',
      medicines: 'e.g. Paracetamol 500mg, Amoxicillin 250mg',
      notes: 'Any specific instructions for the receptionist...',
      followUp: 'e.g. After 2 weeks'
    },
    buttons: {
      cancel: 'Cancel',
      submit: 'Submit Diagnosis',
      submitting: 'Submitting...'
    },
    messages: {
      failed: 'Failed to submit diagnosis'
    }
  }
};

// ============= STATS CARD =============
export const STATS_CARD = {
  colorSchemes: {
    primary: {
      bg: '#EEF2FF',              // Indigo-50
      bgDark: '#E0E7FF',          // Indigo-100
      text: '#4F46E5',            // Indigo-600
      iconColor: '#4F46E5',       // Indigo-600
      border: '#C7D2FE',          // Indigo-200
      shadow: 'rgba(79, 70, 229, 0.15)'
    },
    success: {
      bg: '#ECFDF5',              // Emerald-50
      bgDark: '#D1FAE5',          // Emerald-100
      text: '#059669',            // Emerald-600
      iconColor: '#059669',       // Emerald-600
      border: '#A7F3D0',          // Emerald-200
      shadow: 'rgba(5, 150, 105, 0.15)'
    },
    info: {
      bg: '#F0F9FF',              // Sky-50
      bgDark: '#E0F2FE',          // Sky-100
      text: '#0284C7',            // Sky-600
      iconColor: '#0284C7',       // Sky-600
      border: '#BAE6FD',          // Sky-200
      shadow: 'rgba(2, 132, 199, 0.15)'
    },
    warning: {
      bg: '#FFF7ED',              // Orange-50
      bgDark: '#FFEDD5',          // Orange-100
      text: '#EA580C',            // Orange-600
      iconColor: '#EA580C',       // Orange-600
      border: '#FED7AA',          // Orange-200
      shadow: 'rgba(234, 88, 12, 0.15)'
    }
  }
};

// ============= STATUS BADGES =============
export const STATUS = {
  scheduled: { class: 'bg-success', label: 'Scheduled' },
  booked: { class: 'bg-success', label: 'Booked' },
  cancelled: { class: 'bg-danger', label: 'Cancelled' },
  completed: { class: 'bg-info', label: 'Completed' },
  diagnosed: { class: 'bg-primary', label: 'DIAGNOSED' },
  default: { class: 'bg-warning', label: 'Scheduled' }
};

// ============= LAYOUT DIMENSIONS =============
export const DIMENSIONS = {
  avatarSize: {
    small: '36px',
    medium: '40px',
    large: '48px'
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    xlarge: '16px',
    circle: '50%'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.25rem',
    xxl: '1.5rem'
  },
  fontSize: {
    xs: '0.7rem',
    sm: '0.75rem',
    base: '0.875rem',
    md: '0.9375rem',
    lg: '1rem',
    xl: '1.125rem',
    xxl: '1.25rem',
    xxxl: '1.5rem'
  },
  padding: {
    card: '1rem',
    cardLarge: '1.25rem',
    modal: '1.5rem',
    button: '0.625rem 1.25rem',
    buttonSmall: '0.375rem 0.75rem',
    input: '0.625rem 0.875rem'
  }
};

// ============= MODAL STYLES =============
export const MODAL_STYLES = {
  overlay: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(4px)',
    zIndex: 1050
  },
  content: {
    borderRadius: '16px',
    border: 'none'
  },
  header: {
    borderBottom: '1px solid #E5E7EB',
    padding: '1.25rem 1.5rem'
  },
  body: {
    padding: '1.5rem'
  },
  footer: {
    borderTop: '1px solid #E5E7EB',
    padding: '1rem 1.5rem',
    gap: '0.75rem'
  }
};

// ============= TABLE STYLES =============
export const TABLE_STYLES = {
  header: {
    fontWeight: '600',
    color: COLORS.slate700,
    borderBottom: `2px solid ${COLORS.slate200}`
  },
  cell: {
    color: COLORS.slate700,
    fontSize: '0.875rem'
  },
  row: {
    hover: {
      backgroundColor: COLORS.slate50
    }
  }
};

// ============= CARD STYLES =============
export const CARD_STYLES = {
  header: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
    marginBottom: '1.25rem'
  },
  main: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)'
  },
  body: {
    padding: '1.25rem'
  }
};

// ============= AVATAR STYLES =============
export const AVATAR_STYLES = {
  container: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '0.875rem',
    flexShrink: 0
  },
  colors: ['#4F46E5', '#F59E0B', '#3B82F6', '#EC4899', '#10B981']
};

// ============= GENDER BADGE STYLES =============
export const GENDER_BADGE_STYLES = {
  MALE: {
    backgroundColor: '#DBEAFE',
    color: '#1E40AF',
    fontWeight: '500',
    padding: '0.375rem 0.75rem',
    borderRadius: '6px'
  },
  FEMALE: {
    backgroundColor: '#FCE7F3',
    color: '#BE185D',
    fontWeight: '500',
    padding: '0.375rem 0.75rem',
    borderRadius: '6px'
  },
  OTHER: {
    backgroundColor: '#F3F4F6',
    color: '#374151',
    fontWeight: '500',
    padding: '0.375rem 0.75rem',
    borderRadius: '6px'
  }
};

// ============= MOBILE CARD STYLES =============
export const MOBILE_CARD_STYLES = {
  container: {
    background: COLORS.white,
    borderRadius: '12px',
    padding: '1rem',
    marginBottom: '1rem',
    border: `1px solid ${COLORS.slate200}`,
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.75rem'
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '0.875rem',
    flexShrink: 0
  },
  title: {
    fontWeight: '600',
    fontSize: '0.9375rem',
    color: COLORS.slate900
  },
  subtitle: {
    fontSize: '0.75rem',
    color: COLORS.slate500
  },
  body: {
    display: 'grid',
    gap: '0.5rem',
    marginBottom: '0.75rem',
    fontSize: '0.8125rem'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  label: {
    color: COLORS.slate600,
    fontWeight: '500'
  },
  value: {
    color: COLORS.slate900
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.5rem'
  },
  button: {
    fontSize: '0.75rem',
    padding: '0.375rem 0.5rem'
  }
};

// ============= FORM STYLES =============
export const FORM_STYLES = {
  label: {
    fontWeight: '500',
    fontSize: '0.875rem',
    color: COLORS.slate600,
    marginBottom: '0.5rem'
  },
  input: {
    borderRadius: '8px',
    border: `1px solid ${COLORS.slate300}`,
    padding: '0.625rem 0.875rem',
    fontSize: '0.875rem',
    color: COLORS.slate700
  },
  select: {
    borderRadius: '8px',
    border: `1px solid ${COLORS.slate300}`,
    padding: '0.625rem 0.875rem',
    fontSize: '0.875rem',
    color: COLORS.slate700
  },
  textarea: {
    borderRadius: '8px',
    border: `1px solid ${COLORS.slate300}`,
    padding: '0.625rem 0.875rem',
    fontSize: '0.875rem',
    color: COLORS.slate700
  },
  disabled: {
    backgroundColor: '#f3f4f6'
  }
};

// ============= SEARCH STYLES =============
export const SEARCH_STYLES = {
  container: {
    position: 'relative',
    marginBottom: '1rem'
  },
  input: {
    borderRadius: '10px',
    border: `1px solid ${COLORS.slate300}`,
    padding: '0.625rem 0.875rem',
    fontSize: '0.875rem',
    width: '100%'
  }
};

// ============= ACTION BUTTON STYLES =============
export const ACTION_BUTTON_STYLES = {
  edit: {
    border: `1px solid ${COLORS.primary}`,
    color: COLORS.primary,
    borderRadius: '8px',
    padding: '0.375rem 0.75rem',
    fontWeight: '500',
    backgroundColor: 'transparent'
  },
  book: {
    backgroundColor: COLORS.success,
    color: COLORS.white,
    border: 'none',
    borderRadius: '8px',
    padding: '0.375rem 0.75rem',
    fontWeight: '500'
  },
  delete: {
    backgroundColor: 'transparent',
    color: COLORS.danger,
    border: 'none',
    padding: '0',
    fontSize: '0.75rem',
    fontWeight: '600',
    lineHeight: '1'
  }
};

// ============= LOADING STYLES =============
export const LOADING_STYLES = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px'
  },
  spinner: {
    width: '3rem',
    height: '3rem'
  }
};

// ============= EMPTY STATE STYLES =============
export const EMPTY_STATE_STYLES = {
  container: {
    textAlign: 'center',
    padding: '2rem',
    color: COLORS.slate500
  },
  message: {
    fontSize: '0.875rem',
    color: COLORS.slate500
  }
};
