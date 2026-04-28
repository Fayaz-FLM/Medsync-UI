// ── DOCTOR MODULE CONSTANTS ───────────────────────────────────────────────────

// ── TEXT ──────────────────────────────────────────────────────────────────────
export const DOCTOR_TEXT = {
  // Header
  TITLE:                      'Doctor Dashboard',
  SIGNED_IN_AS:               'Signed in as',

  // Buttons
  BTN_TODAY:                  'Today',
  BTN_MANAGE_AVAILABILITY:    'Manage Availability',
  BTN_REFRESH:                'Refresh',
  BTN_CANCEL:                 'Cancel',
  BTN_CLOSE:                  'Close',
  BTN_VIEW_REASON:            'View Reason',
  BTN_VIEW_PATIENT:           'View Patient',
  BTN_RESCHEDULE:             'Reschedule',
  BTN_CANCEL_APPT:            'Cancel',
  BTN_DIAGNOSE:               'Diagnose',
  BTN_SUBMIT_DIAGNOSIS:       'Submit Diagnosis',
  BTN_SUBMITTING:             'Submitting...',
  BTN_RESCHEDULE_CONFIRM:     'Reschedule Appointment',
  BTN_RESCHEDULING:           'Rescheduling...',
  BTN_NO_KEEP:                'No, Keep it',
  BTN_YES_CANCEL:             'Yes, Cancel Appointment',
  BTN_MARK_AVAILABLE:         'Mark Available',
  BTN_MARK_UNAVAILABLE:       'Mark Unavailable',
  BTN_UPDATING:               'Updating...',

  // Labels
  LABEL_SELECT_DATE:          'Select Date:',
  LABEL_APPOINTMENTS_FOR:     'Appointments for',
  LABEL_NEW_APPT_DATE:        'New Appointment Date',
  LABEL_START_TIME:           'Start Time',
  LABEL_END_TIME:             'End Time',
  LABEL_NOTES_OPTIONAL:       'Notes (Optional)',
  LABEL_DIAGNOSIS_SUMMARY:    'Diagnosis Summary',
  LABEL_PRESCRIPTION:         'Prescription',
  LABEL_MEDICINES:            'Medicines',
  LABEL_NOTES_RECEPTIONIST:   'Notes for Receptionist',
  LABEL_FOLLOW_UP:            'Follow-up Suggestion',
  LABEL_PATIENT:              'Patient:',
  LABEL_DOCTOR:               'Doctor:',
  LABEL_CURRENT_APPT:         'Current Appointment:',
  LABEL_PATIENT_ID:           'Patient ID',
  LABEL_DOB:                  'DOB',
  LABEL_EMAIL:                'Email',
  LABEL_PHONE:                'Phone',
  LABEL_GENDER:               'Gender',
  LABEL_APPT_DETAILS:         'Appointment Details',
  LABEL_APPT_DATE_TIME:       'Appointment Date & Time',
  LABEL_REASON_FOR_VISIT:     'Reason for Visit',
  LABEL_ADDITIONAL_NOTES:     'Additional Notes',
  LABEL_ADDRESS:              'Address',
  LABEL_DATE:                 'Date:',
  LABEL_TIME:                 'Time:',
  LABEL_REASON:               'Reason:',
  LABEL_NOTES:                'Notes:',
  LABEL_SELECTED_DATES:       'Selected Dates',
  LABEL_UNAVAILABLE_DATES:    'Currently Unavailable Dates',
  LABEL_SELECT_UNAVAILABLE:   'Select dates to mark as unavailable',
  LABEL_SELECT_AVAILABLE:     'Select dates to mark as available',
  LABEL_DOCTOR_INFO:          'Doctor:',
  LABEL_UNAVAILABLE_COUNT:    'Unavailable Date(s)',

  // Table headers
  TH_TIME:                    'Time',
  TH_PATIENT:                 'Patient',
  TH_ID:                      'ID',
  TH_NOTES:                   'Notes',
  TH_STATUS:                  'Status',
  TH_ACTIONS:                 'Actions',

  // Modal titles
  MODAL_CANCEL_TITLE:         'Confirm Cancellation',
  MODAL_CANCEL_BODY:          'Are you sure you want to cancel this appointment?',
  MODAL_RESCHEDULE_TITLE:     'Reschedule Appointment',
  MODAL_DIAGNOSIS_TITLE:      'Submit Diagnosis -',
  MODAL_REASON_TITLE:         'Reason for Visit',
  MODAL_PATIENT_TITLE:        'Patient Details',
  MODAL_AVAILABILITY_TITLE:   'Manage Doctor Availability',

  // Tabs
  TAB_MARK_UNAVAILABLE:       'Mark Unavailable',
  TAB_MARK_AVAILABLE:         'Mark Available',

  // Placeholders
  PH_DIAGNOSIS_SUMMARY:       'Enter diagnosis summary...',
  PH_PRESCRIPTION:            'Enter prescription details...',
  PH_MEDICINES:               'e.g. Paracetamol 500mg, Amoxicillin 250mg',
  PH_NOTES_RECEPTIONIST:      'Any specific instructions for the receptionist...',
  PH_FOLLOW_UP:               'e.g. After 2 weeks',
  PH_RESCHEDULE_NOTES:        'e.g., Follow-up consultation',

  // Status / info messages
  MSG_LOADING_APPTS:          'Loading appointments...',
  MSG_NO_APPTS:               'No appointments for this date.',
  MSG_LOADING_PATIENT:        'Loading patient details...',
  MSG_LOADING_AVAILABILITY:   'Loading doctor availability...',
  MSG_CHECKING_AVAILABILITY:  'Checking availability...',
  MSG_NO_UNAVAILABLE:         'No unavailable dates. You are available for all dates.',
  MSG_CLICK_TO_MARK:          'Click on a date to select it for marking as available',
  MSG_BLOCK_HINT:             'Block these dates from accepting appointments',
  MSG_REMOVE_HINT:            'Remove unavailability to accept appointments on these dates',
  MSG_NO_REASON:              'No reason provided.',
  MSG_AVAIL_SUCCESS:          'Successfully marked {action} for {count} date(s)',
  MSG_CANCEL_SUCCESS:         'Appointment cancelled successfully',
  MSG_RESCHEDULE_SUCCESS:     'Appointment rescheduled successfully',
  MSG_DIAGNOSIS_SUCCESS:      'Diagnosis submitted successfully',
  MSG_AVAIL_UPDATE_SUCCESS:   'Availability updated successfully',
  MSG_DOCTOR_AVAILABLE:       '✓ Doctor is available on this date',
  MSG_DOCTOR_UNAVAILABLE:     '✗ Doctor is not available on this date',
  MSG_DOCTOR_UNAVAIL_DATES:   'Doctor Unavailable Dates:',
  MSG_MORE_DATES:             '+{n} more',
  MSG_SELECT_DATE:            'Please select at least one date',
  MSG_PATIENT_FALLBACK:       'N/A',

  // Errors
  ERR_SELECT_DATE:            'Please select appointment date',
  ERR_SELECT_START:           'Please select start time',
  ERR_SELECT_END:             'Please select end time',
  ERR_TIME_ORDER:             'End time must be after start time',
  ERR_DOCTOR_UNAVAILABLE:     'Doctor is not available on the selected date. Please choose another date.',
  ERR_DOCTOR_UNAVAIL_FINAL:   'Doctor is not available on the selected date',
  ERR_RESCHEDULE_FAILED:      'Failed to reschedule appointment',
  ERR_CANCEL_FAILED:          'Failed to cancel appointment',
  ERR_DIAGNOSIS_FAILED:       'Failed to submit diagnosis',
  ERR_LOAD_APPTS:             'Failed to load appointments',
  ERR_MARK_FAILED:            'Failed to update doctor availability',
}

// ── TABLE COLUMNS ─────────────────────────────────────────────────────────────
export const DOCTOR_TABLE_COLUMNS = [
  { key: 'time',    label: 'TH_TIME'    },
  { key: 'patient', label: 'TH_PATIENT' },
  { key: 'id',      label: 'TH_ID'      },
  { key: 'notes',   label: 'TH_NOTES'   },
  { key: 'status',  label: 'TH_STATUS'  },
]

// ── DIAGNOSIS FORM FIELDS ─────────────────────────────────────────────────────
export const DIAGNOSIS_FIELDS = [
  { name: 'diagnosisSummary',     label: 'LABEL_DIAGNOSIS_SUMMARY',   type: 'textarea', rows: 3, required: true,  placeholder: 'PH_DIAGNOSIS_SUMMARY'   },
  { name: 'prescription',         label: 'LABEL_PRESCRIPTION',        type: 'textarea', rows: 3, required: true,  placeholder: 'PH_PRESCRIPTION'        },
  { name: 'medicines',            label: 'LABEL_MEDICINES',           type: 'input',    required: false, placeholder: 'PH_MEDICINES'           },
  { name: 'notesForReceptionist', label: 'LABEL_NOTES_RECEPTIONIST',  type: 'textarea', rows: 2, required: false, placeholder: 'PH_NOTES_RECEPTIONIST'  },
  { name: 'followUpSuggestion',   label: 'LABEL_FOLLOW_UP',           type: 'input',    required: false, placeholder: 'PH_FOLLOW_UP'           },
]

// ── STYLES (Bootstrap class names only) ───────────────────────────────────────
export const DOCTOR_STYLES = {
  // Page layout
  page:               'h-100 d-flex flex-column bg-light',
  headerBar:          'py-3 border-bottom bg-white',
  headerInner:        'container d-flex justify-content-between align-items-center',
  headerActions:      'd-flex gap-2',
  content:            'container py-4',

  // Date picker row
  dateRow:            'mb-3 d-flex align-items-center gap-3',
  dateLabel:          'fw-bold',
  dateInput:          'form-control',

  // Card
  card:               'card',
  cardBody:           'card-body',
  cardTitle:          'h5',

  // Alerts
  alertDanger:        'alert alert-danger',
  alertSuccess:       'alert alert-success',
  alertInfo:          'alert alert-info',
  alertWarning:       'alert alert-warning',

  // Table
  tableWrapper:       'table-responsive',
  table:              'table table-hover',
  thEnd:              'text-end',
  tdEnd:              'text-end',

  // Buttons
  btnOutlinePrimary:  'btn btn-outline-primary',
  btnPrimary:         'btn btn-primary',
  btnOutlineSecondary:'btn btn-outline-secondary',
  btnSmPrimary:       'btn btn-sm btn-primary me-2',
  btnSmInfo:          'btn btn-sm btn-info me-2',
  btnSmWarning:       'btn btn-sm btn-warning me-2',
  btnSmDanger:        'btn btn-sm btn-danger',
  btnSmSuccess:       'btn btn-sm btn-success ms-2',
  btnSecondary:       'btn btn-secondary',
  btnDanger:          'btn btn-danger',
  btnSuccess:         'btn btn-success',
  btnClose:           'btn-close',
  btnCloseWhite:      'btn-close btn-close-white',

  // Badges
  badgeSuccess:       'badge bg-success',
  badgeDanger:        'badge bg-danger',
  badgeSecondary:     'badge bg-secondary',
  badgeInfo:          'badge bg-info',

  // Modal (Bootstrap classes)
  modalBackdrop:      'modal fade show d-block',
  modalDialog:        'modal-dialog',
  modalDialogCentered:'modal-dialog modal-dialog-centered',
  modalDialogLg:      'modal-dialog modal-lg',
  modalContent:       'modal-content',
  modalHeader:        'modal-header',
  modalHeaderPrimary: 'modal-header bg-primary text-white',
  modalTitle:         'modal-title',
  modalBody:          'modal-body',
  modalFooter:        'modal-footer',

  // Form
  formLabel:          'form-label',
  formLabelBold:      'form-label fw-bold',
  formControl:        'form-control',
  formSelect:         'form-select',
  formText:           'form-text text-muted',
  formTextSuccess:    'form-text text-success',
  formTextDanger:     'form-text text-danger',
  invalidFeedback:    'invalid-feedback d-block',
  inputInvalid:       'form-control is-invalid',

  // Misc
  bgLight:            'bg-light rounded',
  bgLightBorder:      'p-3 bg-light rounded border',
  dFlex:              'd-flex',
  flexWrapGap:        'd-flex flex-wrap gap-2',
  spinnerSm:          'spinner-border spinner-border-sm me-2',
  navTabs:            'nav nav-tabs mb-3',
  navItem:            'nav-item',
  navLinkActive:      'nav-link active',
  navLink:            'nav-link',
  mb3:                'mb-3',
  mb0:                'mb-0',
  mt2:                'form-text text-muted d-block mt-2',
  row:                'row',
  col6:               'col-6',
  col12:              'col-12',
  colMd6:             'col-md-6 mb-3',
}

// ── INLINE STYLES (only where Bootstrap classes are insufficient) ─────────────
export const DOCTOR_INLINE = {
  // Modal overlays
  cancelBackdrop:     { backgroundColor: 'rgba(0,0,0,0.5)' },
  diagnosisBackdrop:  { backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 },

  // Fixed-position modal containers
  fixedContainer:     { position: 'fixed', inset: 0, zIndex: 1050, pointerEvents: 'none' },
  modalCard:          { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '680px', maxWidth: '95%', maxHeight: '85vh', backgroundColor: '#fff', borderRadius: 8, boxShadow: '0 8px 30px rgba(0,0,0,0.22)', zIndex: 1060, display: 'flex', flexDirection: 'column', overflow: 'hidden', pointerEvents: 'auto' },
  modalCardWide:      { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '720px', maxWidth: '95%', maxHeight: '80vh', backgroundColor: '#fff', borderRadius: 8, boxShadow: '0 8px 30px rgba(0,0,0,0.35)', zIndex: 1060, display: 'flex', flexDirection: 'column', overflow: 'hidden', pointerEvents: 'auto' },
  modalHeader:        { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #e0e0e0', backgroundColor: '#f8f9fa' },
  modalHeaderSm:      { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #f1f1f1' },
  modalBody:          { padding: '20px', overflowY: 'auto', flex: 1 },
  modalBodySm:        { padding: 16, overflowY: 'auto', flex: 1 },
  modalFooter:        { padding: 12, borderTop: '1px solid #f1f1f1', display: 'flex', gap: 8, justifyContent: 'flex-end' },

  // Patient modal
  patientAvatar:      { width: 56, height: 56, borderRadius: 28, backgroundColor: '#0d6efd', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 },
  patientName:        { fontSize: 18, fontWeight: 700 },
  patientMeta:        { fontSize: 13, color: '#6c757d' },
  patientHeader:      { display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px', borderBottom: '1px solid #f1f1f1' },
  fieldRow:           { display: 'flex', gap: 24, marginBottom: 12 },
  fieldFlex:          { flex: 1 },
  fieldLabel:         { fontSize: 12, color: '#6c757d' },
  fieldValue:         { fontWeight: 600 },
  fieldMb:            { marginBottom: 12 },
  sectionDivider:     { marginTop: 12, paddingTop: 12, borderTop: '1px solid #f1f1f1' },
  sectionTitle:       { fontSize: 14, fontWeight: 600, marginBottom: 8 },
  reasonValue:        { fontWeight: 600, color: '#0d6efd' },

  // Availability badge
  dateBadge:          { fontSize: '0.95rem', padding: '0.6rem 0.8rem' },
  dateBadgeSm:        { fontSize: '0.9rem', padding: '0.5rem 0.7rem', cursor: 'pointer', transition: 'all 0.2s' },
  removeBtnStyle:     { fontSize: '0.6rem', padding: '0.2rem' },

  // Date input max width
  dateMaxWidth:       { maxWidth: 200 },

  // Mobile card styles
  mobileCard:         { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #e9ecef' },
  mobileCardHeader:   { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 },
  mobileInitials:     { width: 48, height: 48, borderRadius: 24, backgroundColor: '#e3f2fd', color: '#1976d2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 700, flexShrink: 0 },
  mobileCardTitle:    { flex: 1 },
  mobilePatientName:  { fontSize: '1rem', fontWeight: 600, color: '#1a2332', marginBottom: 2 },
  mobilePatientId:    { fontSize: '0.8rem', color: '#6c757d' },
  mobileCardBody:     { paddingTop: 12, borderTop: '1px solid #f1f3f5', marginBottom: 12 },
  mobileField:        { fontSize: '0.85rem', marginBottom: 8 },
  mobileLabel:        { color: '#6c757d', fontWeight: 500, display: 'inline-block', minWidth: 60 },
  mobileValue:        { color: '#1a2332', fontWeight: 500 },
  mobileActions:      { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, paddingTop: 12, borderTop: '1px solid #f1f3f5' },
  mobileActionsFull:  { display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 12, borderTop: '1px solid #f1f3f5' },
  mobileBtnPrimary:   { padding: '10px 16px', borderRadius: 8, border: 'none', backgroundColor: '#10b981', color: '#fff', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' },
  mobileBtnInfo:      { padding: '10px 16px', borderRadius: 8, border: 'none', backgroundColor: '#0ea5e9', color: '#fff', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' },
  mobileBtnWarning:   { padding: '10px 16px', borderRadius: 8, border: 'none', backgroundColor: '#f59e0b', color: '#fff', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' },
  mobileBtnDanger:    { padding: '10px 16px', borderRadius: 8, border: 'none', backgroundColor: '#ef4444', color: '#fff', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' },
  mobileManageBtn:    { padding: '10px 16px', borderRadius: 8, border: 'none', backgroundColor: '#f59e0b', color: '#fff', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 },
}

// Legacy alias
export const DOCTOR_TEXTS = DOCTOR_TEXT
