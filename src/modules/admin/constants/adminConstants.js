// ── ADMIN MODULE CONSTANTS ────────────────────────────────────────────────

// ── UI TEXT ──────────────────────────────────────────────────────────────────
export const ADMIN_TEXT = {
  TITLE:                'Admin — Staff Management',
  SUBTITLE:             'Add, edit, resign and search staff (Doctors & Receptionists)',

  BTN_REFRESH:          'Refresh',
  BTN_REFRESHING:       'Refreshing...',
  BTN_ADD_STAFF:        'Add Staff',
  BTN_EDIT:             'Edit',
  BTN_RESIGN:           'Resign',
  BTN_CREATE:           'Create',
  BTN_UPDATE:           'Update',
  BTN_CANCEL:           'Cancel',
  BTN_CONFIRM_RESIGN:   'Confirm Resign',

  SEARCH_PLACEHOLDER:   'Search by name or id',
  FILTER_ALL_TYPES:     'All types',
  FILTER_DOCTOR:        'Doctor',
  FILTER_NON_DOCTOR:    'Non Doctor',

  TH_ACTIONS:           'Actions',
  EMPTY_STAFF:          'No staff found',
  ACTIVE_YES:           'Yes',
  ACTIVE_NO:            'No',

  FORM_ADD_TITLE:       'Add Staff',
  FORM_EDIT_TITLE:      'Edit Staff',
  FORM_ADDRESS_TITLE:   'Address',

  LABEL_TYPE:           'Type',
  LABEL_ROLE:           'Role',
  LABEL_SPECIALIZATION: 'Specialization',
  LABEL_EXPERIENCE:     'Experience (yrs)',
  LABEL_DATE_JOINING:   'Date of Joining',
  LABEL_CAN_LOGIN:      'Can Login',
  LABEL_ACTIVE:         'Active',

  OPT_SELECT_TYPE:      'Select type',
  OPT_SELECT_SPEC:      'Select specialization',
  OPT_YES:              'Yes',
  OPT_NO:               'No',
  OPT_ROLE_ADMIN:       'ADMIN',
  OPT_ROLE_STAFF:       'STAFF',

  ALERT_FILL_REQUIRED:  'Please fill required fields: ',
  ALERT_EMAIL_EXISTS:   'Email already exists! Please use a different email.',
  ALERT_STAFF_ADDED:    'Staff added successfully',
  ALERT_STAFF_UPDATED:  'Staff updated successfully',
  ALERT_STAFF_RESIGNED: 'Staff resigned successfully',
  ALERT_SAVE_FAILED:    'Unable to save staff',
  ALERT_RESIGN_FAILED:  'Unable to resign staff',
  ALERT_LOAD_FAILED:    'Unable to load staff data',

  CONFIRM_RESIGN_TITLE: 'Confirm Resignation',
  CONFIRM_RESIGN_MSG:   'Are you sure you want to mark {name} as resigned?',
  CONFIRM_RESIGN_NOTE:  "This action will deactivate the staff member's account.",
  CONFIRM_RESIGN_ICON:  '⚠️',
}

// ── TABLE COLUMNS ─────────────────────────────────────────────────────────────
export const STAFF_COLUMNS = [
  { key: 'id',     header: 'ID'     },
  { key: 'name',   header: 'Name'   },
  { key: 'type',   header: 'Type'   },
  { key: 'role',   header: 'Role'   },
  { key: 'phone',  header: 'Phone'  },
  { key: 'active', header: 'Active' },
]

// ── FORM FIELDS ───────────────────────────────────────────────────────────────
export const FORM_FIELDS = {
  basic: [
    { name: 'firstName',   label: 'First name', col: 'col-md-3', required: true  },
    { name: 'lastName',    label: 'Last name',  col: 'col-md-3', required: false },
    { name: 'email',       label: 'Email',      col: 'col-md-3', type: 'email', required: true },
    { name: 'phoneNumber', label: 'Phone',      col: 'col-md-3', required: true  },
  ],
  specializations: [
    { value: 'GENERAL_PHYSICIAN',   label: 'General Physician'   },
    { value: 'CARDIOLOGIST',        label: 'Cardiologist'        },
    { value: 'NEUROLOGIST',         label: 'Neurologist'         },
    { value: 'ENT_SPECIALIST',      label: 'ENT Specialist'      },
    { value: 'DENTIST',             label: 'Dentist'             },
    { value: 'PULMONOLOGIST',       label: 'Pulmonologist'       },
    { value: 'GASTROENTEROLOGIST',  label: 'Gastroenterologist'  },
    { value: 'PEDIATRICIAN',        label: 'Pediatrician'        },
    { value: 'GYNECOLOGIST',        label: 'Gynecologist'        },
    { value: 'RECEPTIONIST',        label: 'Receptionist'        },
    { value: 'OTHERS',              label: 'Others'              },
  ],
  address: [
    { name: 'landmark', placeholder: 'Landmark', col: 'col-md-4' },
    { name: 'city',     placeholder: 'City',     col: 'col-md-3' },
    { name: 'state',    placeholder: 'State',    col: 'col-md-2' },
    { name: 'country',  placeholder: 'Country',  col: 'col-md-2' },
    { name: 'pinCode',  placeholder: 'Pin code', col: 'col-md-2' },
  ],
}

// ── STAFF TYPE VALUES ─────────────────────────────────────────────────────────
export const STAFF_TYPE = {
  DOCTOR:     'DOCTOR',
  NON_DOCTOR: 'NON_DOCTOR',
}

// ── REQUIRED VALIDATION FIELDS ────────────────────────────────────────────────
export const REQUIRED_STAFF_FIELDS    = ['firstName', 'email', 'phoneNumber', 'staffType', 'role', 'specialization', 'dateOfJoining']
export const REQUIRED_ADDRESS_FIELDS  = ['landmark', 'city', 'state', 'country', 'pinCode']

// ── EMPTY FORM DEFAULT ────────────────────────────────────────────────────────
export const EMPTY_STAFF_FORM = {
  firstName: '', lastName: '', email: '', gender: 'MALE', phoneNumber: '',
  staffType: STAFF_TYPE.DOCTOR, role: 'ADMIN', specialization: '',
  dateOfJoining: '', experienceInYears: 0, canLogin: true, isEmployeeActive: true,
  staffAddressDto: { landmark: '', city: '', state: '', country: '', pinCode: '' },
}

// ── STYLES ────────────────────────────────────────────────────────────────────
export const ADMIN_STYLES = {
  // Page
  page:           { backgroundColor: '#f0f4f8', minHeight: '100vh', padding: '12px 28px 28px' },
  card:           { backgroundColor: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },

  // Header text
  pageTitle:      { color: '#1a2332', fontWeight: '700', fontSize: '1.35rem', marginBottom: '4px' },
  pageSubtitle:   { color: '#6c757d' },

  // Buttons
  btnRefresh:     { backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 18px', fontWeight: '500', cursor: 'pointer' },
  btnAdd:         { backgroundColor: '#0d6efd', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 18px', fontWeight: '500', cursor: 'pointer' },
  btnEdit:        { backgroundColor: 'transparent', color: '#0d6efd', border: '1.5px solid #0d6efd', borderRadius: '6px', padding: '5px 14px', fontSize: '0.83rem', fontWeight: '500', marginRight: '8px', cursor: 'pointer' },
  btnResignActive:{ backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '6px', padding: '5px 14px', fontSize: '0.83rem', fontWeight: '500', cursor: 'pointer' },
  btnResignOff:   { backgroundColor: 'transparent', color: '#adb5bd', border: '1.5px solid #adb5bd', borderRadius: '6px', padding: '5px 14px', fontSize: '0.83rem', fontWeight: '500', cursor: 'not-allowed', opacity: 0.6 },
  btnCancel:      { backgroundColor: '#f1f3f5', color: '#495057', border: 'none', borderRadius: '8px', padding: '9px 22px', fontWeight: '500', cursor: 'pointer' },
  btnSubmit:      { backgroundColor: '#198754', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 22px', fontWeight: '600', cursor: 'pointer' },
  btnConfirmResign: { backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 22px', fontWeight: '600', cursor: 'pointer' },
  btnClose:       { background: 'none', border: 'none', fontSize: '1.4rem', color: '#6c757d', cursor: 'pointer', lineHeight: 1 },

  // Filters
  filterInput:    { borderRadius: '8px', border: '1px solid #dee2e6', padding: '10px 14px' },

  // Table
  tableWrapper:   { borderRadius: '10px', overflow: 'hidden', border: '1px solid #e9ecef' },
  thead:          { backgroundColor: '#0d6efd', color: '#fff' },
  th:             { padding: '14px 16px', fontWeight: '600', fontSize: '0.82rem', letterSpacing: '0.4px', textTransform: 'uppercase', whiteSpace: 'nowrap' },
  tdId:           { padding: '13px 16px', color: '#0d6efd', fontWeight: '600', fontSize: '0.9rem' },
  tdName:         { padding: '13px 16px', color: '#1a2332', fontWeight: '500' },
  tdCell:         { padding: '13px 16px', color: '#495057' },
  tdActions:      { padding: '13px 16px' },
  trRow:          { borderBottom: '1px solid #f1f3f5', backgroundColor: '#fff' },
  tdEmpty:        { padding: '32px' },

  // Initials badge
  initials:       { backgroundColor: 'transparent', color: '#1d4ed8', padding: '3px 8px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: '700', marginRight: '8px', display: 'inline-block', minWidth: '32px', textAlign: 'center' },

  // Active badge
  badgeActive:    { backgroundColor: 'transparent', color: '#065f46', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' },
  badgeInactive:  { backgroundColor: 'transparent', color: '#991b1b', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' },

  // Modal overlay
  backdrop:       { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', zIndex: 1040 },
  modalOuter:     { position: 'fixed', inset: 0, zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', pointerEvents: 'none' },
  modalCard:      { background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '16px', boxShadow: '0 24px 60px rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.6)', width: '100%', maxWidth: '860px', maxHeight: '90vh', overflowY: 'auto', pointerEvents: 'all' },
  modalCardSm:    { background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '16px', boxShadow: '0 24px 60px rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.6)', width: '100%', maxWidth: '440px', pointerEvents: 'all' },
  modalHeader:    { padding: '20px 28px', borderBottom: '1px solid rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  modalHeaderSm:  { padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle:     { margin: 0, fontWeight: '700', color: '#1a2332', fontSize: '1.1rem' },
  modalTitleSm:   { margin: 0, fontWeight: '700', color: '#1a2332', fontSize: '1.05rem' },
  modalBody:      { padding: '24px 28px' },
  modalBodySm:    { padding: '24px' },
  modalFooter:    { padding: '16px 28px', borderTop: '1px solid rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'flex-end', gap: '10px' },
  modalFooterSm:  { padding: '16px 24px', borderTop: '1px solid rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'flex-end', gap: '10px' },

  // Form fields
  formLabel:      { fontSize: '0.82rem', fontWeight: '600', color: '#495057', marginBottom: '6px', display: 'block' },
  formInput:      { borderRadius: '8px', border: '1px solid #dee2e6', padding: '9px 12px', fontSize: '0.9rem' },
  addressSection: { backgroundColor: '#f8f9fa', borderRadius: '10px', padding: '16px 20px' },
  addressTitle:   { fontSize: '0.82rem', fontWeight: '700', color: '#495057', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' },

  // Resign modal body
  resignIconWrap: { backgroundColor: '#fee2e2', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.2rem' },
  resignMsg:      { margin: '0 0 6px', fontWeight: '600', color: '#1a2332', fontSize: '0.95rem' },
  resignNote:     { margin: 0, color: '#6c757d', fontSize: '0.85rem' },

  // Mobile card styles
  mobileCard:     { backgroundColor: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #e9ecef' },
  mobileCardHeader: { display: 'flex', alignItems: 'center', marginBottom: '12px', gap: '12px' },
  mobileInitials: { backgroundColor: 'transparent', color: '#1d4ed8', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: '700', border: '2px solid #dbeafe', flexShrink: 0 },
  mobileCardTitle: { flex: 1 },
  mobileName:     { fontSize: '1rem', fontWeight: '600', color: '#1a2332', marginBottom: '2px' },
  mobileId:       { fontSize: '0.8rem', color: '#0d6efd', fontWeight: '500' },
  mobileCardBody: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px', paddingTop: '12px', borderTop: '1px solid #f1f3f5' },
  mobileField:    { fontSize: '0.82rem' },
  mobileLabel:    { color: '#6c757d', fontWeight: '500', marginBottom: '2px' },
  mobileValue:    { color: '#1a2332', fontWeight: '500' },
  mobileActions:  { display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid #f1f3f5' },
}

// Legacy alias
export const TEXTS = ADMIN_TEXT
