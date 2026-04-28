import { useState, useEffect } from 'react';
import * as api from '../../../services/api';
import { APPOINTMENTS, COLORS, STYLES } from '../constants/receptionistConstants';

// ============= MAIN COMPONENT =============
export default function AppointmentsSection({ doctors, showToast }) {
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // State Management
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [searchTerm, setSearchTerm] = useState('');
  const [lastRefresh, setLastRefresh] = useState(null);
  
  // Modal States
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [showDietModal, setShowDietModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [cancelConfirm, setCancelConfirm] = useState(null);
  
  // Selected Data
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  // Booking Form
  const [bookingForm, setBookingForm] = useState({
    patientId: '', doctorId: '', appointmentDate: getTodayDate(),
    startTime: '', endTime: '', notes: '', reasonForVisit: ''
  });
  
  // Reschedule Form
  const [rescheduleForm, setRescheduleForm] = useState({
    appointmentDate: '', startTime: '', endTime: '', notes: ''
  });

  // Load appointments on mount and date change
  useEffect(() => {
    loadAppointments();
    loadPatients();
  }, [selectedDate]);

  // Check for preselected patient from Book button - MUST run independently
  useEffect(() => {
    const preselectedPatient = sessionStorage.getItem('preselectedPatient');
    if (preselectedPatient) {
      try {
        const patient = JSON.parse(preselectedPatient);
        console.log('Opening booking modal with preselected patient:', patient);
        setBookingForm(prev => ({
          ...prev,
          patientId: patient.patientId
        }));
        // Open modal immediately - don't wait for any API calls
        setShowBookingModal(true);
        sessionStorage.removeItem('preselectedPatient');
      } catch (error) {
        console.error('Error parsing preselected patient:', error);
      }
    }
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(loadAppointments, 30000);
    return () => clearInterval(intervalId);
  }, [selectedDate]);

  // ============= DATA LOADING =============
  async function loadAppointments() {
    try {
      setLoading(true);
      // Ensure date is in correct format (YYYY-MM-DD)
      const dateToFetch = selectedDate || getTodayDate();
      
      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(dateToFetch)) {
        console.error('Invalid date format:', dateToFetch);
        showToast('Invalid date format. Please use YYYY-MM-DD', 'error');
        setAppointments([]);
        return;
      }
      
      console.log('Loading appointments for date:', dateToFetch);
      const resp = await api.getAppointmentsForAllDoctors(dateToFetch);
      
      // Handle response
      if (resp.success === false) {
        // API call failed - log but don't show error toast (might just be no appointments)
        console.warn('Failed to load appointments:', resp.message);
        setAppointments([]);
      } else {
        const data = resp?.data || resp || [];
        setAppointments(Array.isArray(data) ? data : []);
      }
      
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Failed to load appointments:', err);
      // Only show error toast for actual errors, not 404
      if (err.response?.status !== 404) {
        showToast(APPOINTMENTS.messages.loadFailed, 'error');
      }
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadPatients() {
    try {
      const data = await api.getPatients();
      setPatients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  }

  // ============= BOOKING HANDLERS =============
  function openBookingModal() {
    setBookingForm({
      patientId: '', doctorId: '', appointmentDate: getTodayDate(),
      startTime: '', endTime: '', notes: '', reasonForVisit: ''
    });
    setShowBookingModal(true);
  }

  async function handleBookAppointment(e) {
    e.preventDefault();
    if (!bookingForm.patientId || !bookingForm.doctorId || !bookingForm.startTime || !bookingForm.endTime) {
      showToast(APPOINTMENTS.booking.messages.fillRequired, 'error');
      return;
    }
    
    try {
      const result = await api.bookAppointment(bookingForm);
      if (result.success) {
        setAppointments(prev => [result.data, ...prev]);
        setShowBookingModal(false);
        showToast(APPOINTMENTS.booking.messages.success, 'success');
        loadAppointments();
      } else {
        showToast(result.message || APPOINTMENTS.booking.messages.failed, 'error');
      }
    } catch (error) {
      showToast(APPOINTMENTS.booking.messages.failed, 'error');
    }
  }

  // ============= RESCHEDULE HANDLERS =============
  function openRescheduleModal(appointment) {
    setSelectedAppointment(appointment);
    setRescheduleForm({
      appointmentDate: appointment.appointmentDate || '',
      startTime: appointment.startTime || '',
      endTime: appointment.endTime || '',
      notes: appointment.notes || ''
    });
    setShowRescheduleModal(true);
  }

  async function handleReschedule(e) {
    e.preventDefault();
    if (!rescheduleForm.appointmentDate || !rescheduleForm.startTime || !rescheduleForm.endTime) {
      showToast(APPOINTMENTS.reschedule.messages.fillRequired, 'error');
      return;
    }
    
    try {
      const result = await api.rescheduleAppointment(selectedAppointment.appointmentId, rescheduleForm);
      if (result.success) {
        setAppointments(prev => prev.map(a => 
          a.appointmentId === selectedAppointment.appointmentId ? result.data : a
        ));
        setShowRescheduleModal(false);
        setSelectedAppointment(null);
        showToast(APPOINTMENTS.reschedule.messages.success, 'success');
      } else {
        showToast(result.message || APPOINTMENTS.reschedule.messages.failed, 'error');
      }
    } catch (error) {
      showToast(APPOINTMENTS.reschedule.messages.failed, 'error');
    }
  }

  // ============= OTHER HANDLERS =============
  async function handleCancelAppointment(appointmentId) {
    try {
      const resp = await api.cancelAppointment(appointmentId);
      if (resp?.success === false) {
        showToast(resp.message || APPOINTMENTS.cancel.messages.unable, 'error');
        return;
      }
      setAppointments(prev => prev.filter(a => a.appointmentId !== appointmentId));
      setCancelConfirm(null);
      showToast(APPOINTMENTS.cancel.messages.success, 'success');
    } catch (err) {
      showToast(APPOINTMENTS.cancel.messages.failed, 'error');
    }
  }

  async function handleViewPatient(appointment) {
    try {
      const result = await api.getPatientById(appointment.patientId);
      if (result.success && result.data) {
        setSelectedPatient(result.data);
        setShowPatientModal(true);
      } else {
        showToast(APPOINTMENTS.patient.messages.notFound, 'error');
      }
    } catch (error) {
      showToast(APPOINTMENTS.patient.messages.loadFailed, 'error');
    }
  }

  async function handleGenerateDietPlan(appointment) {
    try {
      const response = await api.generateDietPlanApi(appointment.appointmentId);
      // Handle both string response and object response
      const dietPlan = typeof response === 'string' ? response : response.dietPlan || response.data || response;
      setSelectedAppointment({ ...appointment, dietPlan });
      setShowDietModal(true);
    } catch (error) {
      console.error('Diet plan generation error:', error);
      showToast(APPOINTMENTS.diet.messages.failed, 'error');
    }
  }

  // ============= FILTERING =============
  const filteredAppointments = appointments.filter(a => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (a.patientName || '').toLowerCase().includes(s) ||
           (a.doctorName || '').toLowerCase().includes(s) ||
           (a.patientId || '').toString().includes(s) ||
           (a.doctorId || '').toString().includes(s);
  });

  // ============= RENDER =============
  return (
    <div>
      {/* Header Card */}
      <div className="card border-0 mb-4" style={STYLES.glassContainer}>
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h5 className="mb-3" style={STYLES.typography.heading}>{APPOINTMENTS.title}</h5>
              <div className="d-flex gap-2 align-items-center">
                <label className="form-label mb-0 me-2">{APPOINTMENTS.labels.selectDate}</label>
                <input type="date" className="form-control" style={{ maxWidth: '200px' }}
                  value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                <button className="btn btn-outline-secondary" onClick={loadAppointments}>{APPOINTMENTS.labels.refresh}</button>
                {lastRefresh && <small className="text-muted ms-2">{APPOINTMENTS.labels.lastRefresh} {lastRefresh.toLocaleTimeString()}</small>}
              </div>
            </div>
            <div className="col-md-6 text-md-end">
              <button className="btn" onClick={openBookingModal}
                style={{ backgroundColor: COLORS.emeraldGreen, color: 'white', fontFamily: STYLES.typography.fontFamily }}>
                <i className="bi bi-plus-circle me-2"></i>{APPOINTMENTS.labels.bookNew}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="card border-0" style={STYLES.glassContainer}>
        <div className="card-body">
          <div className="mb-3">
            <input type="text" className="form-control" placeholder={APPOINTMENTS.labels.searchPlaceholder}
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} autoComplete="off" />
          </div>

          {/* Appointments Table */}
          <AppointmentTable 
            appointments={filteredAppointments}
            loading={loading}
            onReschedule={openRescheduleModal}
            onCancel={(id) => setCancelConfirm(id)}
            onViewPatient={handleViewPatient}
            onViewReason={(a) => { setSelectedAppointment(a); setShowReasonModal(true); }}
            onGenerateDietPlan={handleGenerateDietPlan}
            emptyMessage={searchTerm ? APPOINTMENTS.labels.noSearchResults : APPOINTMENTS.labels.noAppointments}
          />
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal 
          form={bookingForm}
          setForm={setBookingForm}
          patients={patients}
          doctors={doctors}
          onSubmit={handleBookAppointment}
          onClose={() => setShowBookingModal(false)}
          styles={STYLES}
        />
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedAppointment && (
        <RescheduleModal 
          appointment={selectedAppointment}
          form={rescheduleForm}
          setForm={setRescheduleForm}
          onSubmit={handleReschedule}
          onClose={() => { setShowRescheduleModal(false); setSelectedAppointment(null); }}
          styles={STYLES}
        />
      )}

      {/* Reason Modal */}
      {showReasonModal && selectedAppointment && (
        <ReasonModal 
          appointment={selectedAppointment}
          onClose={() => { setShowReasonModal(false); setSelectedAppointment(null); }}
          styles={STYLES}
        />
      )}

      {/* External Modals */}
      {showDietModal && selectedAppointment && (
        <DietPlanModalInternal 
          show={showDietModal} 
          onHide={() => { setShowDietModal(false); setSelectedAppointment(null); }}
          dietPlan={selectedAppointment.dietPlan} 
        />
      )}
      {showPatientModal && selectedPatient && (
        <PatientDetailsInternal 
          show={showPatientModal} 
          patient={selectedPatient}
          onClose={() => { setShowPatientModal(false); setSelectedPatient(null); }} 
        />
      )}

      {/* Cancel Confirmation */}
      {cancelConfirm && (
        <div className="modal show d-block" style={STYLES.modalOverlay}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{APPOINTMENTS.cancel.title}</h5>
                <button className="btn-close" onClick={() => setCancelConfirm(null)}></button>
              </div>
              <div className="modal-body">{APPOINTMENTS.cancel.message}</div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setCancelConfirm(null)}>{APPOINTMENTS.cancel.buttons.no}</button>
                <button className="btn btn-danger" onClick={() => handleCancelAppointment(cancelConfirm)}>{APPOINTMENTS.cancel.buttons.yes}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ============= SUB-COMPONENTS =============

// Appointments Table Component
function AppointmentTable({ appointments, loading, onReschedule, onCancel, onViewPatient, onViewReason, onGenerateDietPlan, emptyMessage }) {
  if (loading) return <div className="alert alert-info">{APPOINTMENTS.labels.loading}</div>;
  if (!Array.isArray(appointments) || appointments.length === 0) return <div className="alert alert-warning">{emptyMessage}</div>;

  return (
    <>
      {/* Desktop Table View */}
      <div className="table-responsive d-none d-md-block">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>{APPOINTMENTS.table.headers.time}</th>
              <th>{APPOINTMENTS.table.headers.patient}</th>
              <th>{APPOINTMENTS.table.headers.patientId}</th>
              <th>{APPOINTMENTS.table.headers.doctor}</th>
              <th>{APPOINTMENTS.table.headers.doctorId}</th>
              <th>{APPOINTMENTS.table.headers.notes}</th>
              <th>{APPOINTMENTS.table.headers.status}</th>
              <th className="text-end">{APPOINTMENTS.table.headers.actions}</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(a => {
              const isCancelled = a.status === 'Cancelled' || a.status === 'CANCELLED';
              return (
                <tr key={a.appointmentId} className={isCancelled ? 'table-secondary' : ''} style={isCancelled ? { opacity: 0.7 } : {}}>
                  <td>
                    <div>{a.appointmentDate}</div>
                    <div className="text-muted" style={{ fontSize: 12 }}>{a.startTime} - {a.endTime}</div>
                  </td>
                  <td>{a.patientName || 'N/A'}</td>
                  <td>{a.patientId || 'N/A'}</td>
                  <td>{a.doctorName || 'N/A'}</td>
                  <td>{a.doctorId || 'N/A'}</td>
                  <td>{a.notes || '-'}</td>
                  <td>
                    <span className={`badge ${
                      a.status === 'Scheduled' || a.status === 'Booked' ? 'bg-success' :
                      a.status === 'Cancelled' || a.status === 'CANCELLED' ? 'bg-danger' :
                      a.status === 'Completed' ? 'bg-info' :
                      a.status === 'DIAGNOSED' ? 'bg-primary' : 'bg-warning'
                    }`}>{a.status || 'Scheduled'}</span>
                  </td>
                  <td className="text-end">
                    <div className="d-flex gap-2 justify-content-end flex-wrap">
                      <button className="btn btn-sm" style={{ backgroundColor: COLORS.clinicalBlue, color: 'white' }}
                        onClick={() => onViewReason(a)}>{APPOINTMENTS.actions.viewReason}</button>
                      <button className={`btn btn-sm ${a.dietPlan ? 'btn-success' : 'btn-outline-success'}`}
                        onClick={() => onGenerateDietPlan(a)}>
                        <i className={`bi ${a.dietPlan ? 'bi-eye' : 'bi-magic'} me-1`}></i>
                        {a.dietPlan ? APPOINTMENTS.actions.viewDiet : APPOINTMENTS.actions.aiDiet}
                      </button>
                      <button className="btn btn-sm btn-info" onClick={() => onViewPatient(a)} disabled={isCancelled}>{APPOINTMENTS.actions.viewPatient}</button>
                      <button className="btn btn-sm btn-warning" onClick={() => onReschedule(a)} disabled={isCancelled}>{APPOINTMENTS.actions.reschedule}</button>
                      <button className="btn btn-sm btn-danger" onClick={() => onCancel(a.appointmentId)} disabled={isCancelled}>
                        {isCancelled ? APPOINTMENTS.actions.cancelled : APPOINTMENTS.actions.cancel}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="d-md-none">
        {appointments.map(a => {
          const isCancelled = a.status === 'Cancelled' || a.status === 'CANCELLED';
          const initials = (a.patientName || 'P').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
          return (
            <div key={a.appointmentId} style={{
              background: COLORS.white,
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1rem',
              border: `1px solid ${COLORS.slate200}`,
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
              opacity: isCancelled ? 0.6 : 1
            }}>
              {/* Header with initials and patient info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: COLORS.primaryLight,
                  color: COLORS.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  flexShrink: 0
                }}>
                  {initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '600', fontSize: '0.9375rem', color: COLORS.slate900 }}>
                    {a.patientName || 'N/A'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: COLORS.slate500 }}>
                    Patient ID: {a.patientId || 'N/A'}
                  </div>
                </div>
                <span className={`badge ${
                  a.status === 'Scheduled' || a.status === 'Booked' ? 'bg-success' :
                  a.status === 'Cancelled' || a.status === 'CANCELLED' ? 'bg-danger' :
                  a.status === 'Completed' ? 'bg-info' :
                  a.status === 'DIAGNOSED' ? 'bg-primary' : 'bg-warning'
                }`} style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}>
                  {a.status || 'Scheduled'}
                </span>
              </div>

              {/* Body with appointment details */}
              <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: COLORS.slate600, fontWeight: '500' }}>Date:</span>
                  <span style={{ color: COLORS.slate900 }}>{a.appointmentDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: COLORS.slate600, fontWeight: '500' }}>Time:</span>
                  <span style={{ color: COLORS.slate900 }}>{a.startTime} - {a.endTime}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: COLORS.slate600, fontWeight: '500' }}>Doctor:</span>
                  <span style={{ color: COLORS.slate900 }}>{a.doctorName || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: COLORS.slate600, fontWeight: '500' }}>Doctor ID:</span>
                  <span style={{ color: COLORS.slate900 }}>{a.doctorId || 'N/A'}</span>
                </div>
                {a.notes && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: COLORS.slate600, fontWeight: '500' }}>Notes:</span>
                    <span style={{ color: COLORS.slate900, textAlign: 'right', maxWidth: '60%' }}>{a.notes}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-sm" 
                    style={{ backgroundColor: COLORS.clinicalBlue, color: 'white', fontSize: '0.75rem', padding: '0.375rem 0.5rem' }}
                    onClick={() => onViewReason(a)}
                    disabled={isCancelled}
                  >
                    View Reason
                  </button>
                  <button 
                    className="btn btn-sm btn-info" 
                    style={{ fontSize: '0.75rem', padding: '0.375rem 0.5rem' }}
                    onClick={() => onViewPatient(a)}
                    disabled={isCancelled}
                  >
                    View Patient
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button 
                    className={`btn btn-sm ${a.dietPlan ? 'btn-success' : 'btn-outline-success'}`}
                    style={{ fontSize: '0.75rem', padding: '0.375rem 0.5rem' }}
                    onClick={() => onGenerateDietPlan(a)}
                  >
                    <i className={`bi ${a.dietPlan ? 'bi-eye' : 'bi-magic'} me-1`}></i>
                    {a.dietPlan ? 'View Diet' : 'AI Diet'}
                  </button>
                  <button 
                    className="btn btn-sm btn-warning" 
                    style={{ fontSize: '0.75rem', padding: '0.375rem 0.5rem' }}
                    onClick={() => onReschedule(a)}
                    disabled={isCancelled}
                  >
                    Reschedule
                  </button>
                </div>
                <button 
                  className="btn btn-sm btn-danger w-100" 
                  style={{ fontSize: '0.75rem', padding: '0.375rem 0.5rem' }}
                  onClick={() => onCancel(a.appointmentId)}
                  disabled={isCancelled}
                >
                  {isCancelled ? APPOINTMENTS.actions.cancelled : APPOINTMENTS.actions.cancel}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// Booking Modal Component
function BookingModal({ form, setForm, patients, doctors, onSubmit, onClose }) {
  const isDoctorsLoading = !Array.isArray(doctors);
  const hasDoctors = Array.isArray(doctors) && doctors.length > 0;
  
  return (
    <div className="modal show d-block" style={STYLES.modalOverlay}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{APPOINTMENTS.booking.title}</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={onSubmit}>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">{APPOINTMENTS.booking.labels.patient} *</label>
                  <select className="form-select" value={form.patientId} 
                    onChange={(e) => setForm({...form, patientId: e.target.value})} required>
                    <option value="">{APPOINTMENTS.booking.placeholders.selectPatient}</option>
                    {Array.isArray(patients) && patients.map(p => 
                      <option key={p.patientId} value={p.patientId}>{p.patientName} (ID: {p.patientId})</option>
                    )}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">{APPOINTMENTS.booking.labels.doctor} *</label>
                  <select 
                    className="form-select" 
                    value={form.doctorId}
                    onChange={(e) => setForm({...form, doctorId: e.target.value})} 
                    required
                    disabled={isDoctorsLoading || !hasDoctors}
                  >
                    <option value="">
                      {isDoctorsLoading ? 'Loading doctors...' : 
                       !hasDoctors ? 'No doctors available' : 
                       APPOINTMENTS.booking.placeholders.selectDoctor}
                    </option>
                    {hasDoctors && doctors.map(d => 
                      <option key={d.staffId} value={d.staffId}>
                        Dr. {d.firstName} {d.lastName} (ID: {d.staffId})
                      </option>
                    )}
                  </select>
                  {!hasDoctors && !isDoctorsLoading && (
                    <small className="text-muted d-block mt-1">
                      No active doctors found in the system
                    </small>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label">{APPOINTMENTS.booking.labels.date} *</label>
                  <input type="date" className="form-control" value={form.appointmentDate}
                    onChange={(e) => setForm({...form, appointmentDate: e.target.value})} required />
                </div>
                <div className="col-md-3">
                  <label className="form-label">{APPOINTMENTS.booking.labels.startTime} *</label>
                  <input type="time" className="form-control" value={form.startTime}
                    onChange={(e) => setForm({...form, startTime: e.target.value})} required />
                </div>
                <div className="col-md-3">
                  <label className="form-label">{APPOINTMENTS.booking.labels.endTime} *</label>
                  <input type="time" className="form-control" value={form.endTime}
                    onChange={(e) => setForm({...form, endTime: e.target.value})} required />
                </div>
                <div className="col-12">
                  <label className="form-label">{APPOINTMENTS.booking.labels.reasonForVisit}</label>
                  <textarea className="form-control" rows="2" value={form.reasonForVisit}
                    onChange={(e) => setForm({...form, reasonForVisit: e.target.value})} />
                </div>
                <div className="col-12">
                  <label className="form-label">{APPOINTMENTS.booking.labels.notes}</label>
                  <textarea className="form-control" rows="2" value={form.notes}
                    onChange={(e) => setForm({...form, notes: e.target.value})} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>{APPOINTMENTS.booking.buttons.cancel}</button>
              <button type="submit" className="btn" style={{ backgroundColor: COLORS.emeraldGreen, color: 'white' }}>{APPOINTMENTS.booking.buttons.book}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Reschedule Modal Component
function RescheduleModal({ appointment, form, setForm, onSubmit, onClose }) {
  return (
    <div className="modal show d-block" style={STYLES.modalOverlay}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{APPOINTMENTS.reschedule.title}</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={onSubmit}>
            <div className="modal-body">
              <div className="mb-3 p-3 bg-light rounded">
                <p className="mb-1"><strong>{APPOINTMENTS.reschedule.labels.patient}</strong> {appointment.patientName}</p>
                <p className="mb-1"><strong>{APPOINTMENTS.reschedule.labels.doctor}</strong> {appointment.doctorName}</p>
                <p className="mb-0"><strong>{APPOINTMENTS.reschedule.labels.current}</strong> {appointment.appointmentDate} at {appointment.startTime} - {appointment.endTime}</p>
              </div>
              <div className="mb-3">
                <label className="form-label">{APPOINTMENTS.reschedule.labels.newDate} *</label>
                <input type="date" className="form-control" value={form.appointmentDate}
                  onChange={(e) => setForm({...form, appointmentDate: e.target.value})} required />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">{APPOINTMENTS.reschedule.labels.startTime} *</label>
                  <input type="time" className="form-control" value={form.startTime}
                    onChange={(e) => setForm({...form, startTime: e.target.value})} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">{APPOINTMENTS.reschedule.labels.endTime} *</label>
                  <input type="time" className="form-control" value={form.endTime}
                    onChange={(e) => setForm({...form, endTime: e.target.value})} required />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>{APPOINTMENTS.reschedule.buttons.cancel}</button>
              <button type="submit" className="btn" style={{ backgroundColor: COLORS.clinicalBlue, color: 'white' }}>{APPOINTMENTS.reschedule.buttons.reschedule}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Reason for Visit Modal Component
function ReasonModal({ appointment, onClose }) {
  return (
    <div className="modal show d-block" style={STYLES.modalOverlay}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header" style={{ backgroundColor: COLORS.clinicalBlue, color: 'white' }}>
            <h5 className="modal-title">{APPOINTMENTS.reason.title}</h5>
            <button className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row mb-3">
              <div className="col-6"><strong>{APPOINTMENTS.reason.labels.patient}</strong> {appointment.patientName || 'N/A'}</div>
              <div className="col-6"><strong>{APPOINTMENTS.reason.labels.date}</strong> {appointment.appointmentDate || 'N/A'}</div>
            </div>
            <div className="row mb-3">
              <div className="col-12"><strong>{APPOINTMENTS.reason.labels.time}</strong> {appointment.startTime} - {appointment.endTime}</div>
            </div>
            <hr />
            <h6>{APPOINTMENTS.reason.labels.reason}</h6>
            <p className="border p-3 bg-light rounded">{appointment.reasonForVisit || APPOINTMENTS.reason.labels.noReason}</p>
            {appointment.notes && (
              <>
                <h6>{APPOINTMENTS.reason.labels.notes}</h6>
                <p className="border p-3 bg-light rounded small">{appointment.notes}</p>
              </>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>{APPOINTMENTS.reason.buttons.close}</button>
          </div>
        </div>
      </div>
    </div>
  );
}


// Patient Details Modal (Internal)
function PatientDetailsInternal({ show, onClose, patient }) {
  if (!show || !patient) return null;
  return (
    <div className="modal show d-block" style={STYLES.modalOverlay}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{APPOINTMENTS.patient.title}</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-md-6"><strong>{APPOINTMENTS.patient.labels.patientId}</strong> {patient.patientId}</div>
              <div className="col-md-6"><strong>{APPOINTMENTS.patient.labels.name}</strong> {patient.patientName}</div>
              <div className="col-md-6"><strong>{APPOINTMENTS.patient.labels.email}</strong> {patient.patientEmail}</div>
              <div className="col-md-6"><strong>{APPOINTMENTS.patient.labels.phone}</strong> {patient.patientPhoneNumber}</div>
              <div className="col-md-6"><strong>{APPOINTMENTS.patient.labels.dob}</strong> {patient.dateOfBirth}</div>
              <div className="col-md-6"><strong>{APPOINTMENTS.patient.labels.gender}</strong> {patient.gender}</div>
              <div className="col-12">
                <strong>{APPOINTMENTS.patient.labels.address}</strong>
                <p className="mb-0">
                  {patient.patientAddress?.street}<br />
                  {patient.patientAddress?.city}, {patient.patientAddress?.state} {patient.patientAddress?.zipCode}
                </p>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>{APPOINTMENTS.patient.buttons.close}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Diet Plan Modal (Internal - Simplified)
function DietPlanModalInternal({ show, onHide, dietPlan }) {
  if (!show) return null;
  return (
    <div className="modal show d-block" style={STYLES.modalOverlay}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">
              <i className="bi bi-journal-medical me-2"></i>{APPOINTMENTS.diet.title}
            </h5>
            <button className="btn-close btn-close-white" onClick={onHide}></button>
          </div>
          <div className="modal-body" style={{ minHeight: '200px' }}>
            {dietPlan ? (
              <div className="p-4 border rounded bg-white shadow-sm">
                <div className="mb-4 pb-2 border-bottom">
                  <h3 className="text-success mb-0">{APPOINTMENTS.diet.heading}</h3>
                  <p className="text-muted small">{APPOINTMENTS.diet.generatedOn} {new Date().toLocaleDateString()}</p>
                </div>
                <div style={{ lineHeight: '1.6', fontSize: '1.1rem', whiteSpace: 'pre-wrap' }}>
                  {dietPlan}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted">{APPOINTMENTS.diet.noData}</p>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onHide}>{APPOINTMENTS.diet.buttons.close}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
