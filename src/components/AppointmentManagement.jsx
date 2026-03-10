import React, { useState, useEffect, useRef } from 'react'
import * as api from '../services/api'
import AppointmentBooking from './AppointmentBooking'
import AppointmentReschedule from './AppointmentReschedule'
import AppointmentList from './AppointmentList'
import PatientDetails from './PatientDetails'

export default function AppointmentManagement({ doctors = [] }) {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [cancelConfirm, setCancelConfirm] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showPatientModal, setShowPatientModal] = useState(false)
  const [doctorIdForPatients, setDoctorIdForPatients] = useState('')
  const [patientsVisited, setPatientsVisited] = useState([])
  const [pvStartDate, setPvStartDate] = useState(new Date().toISOString().split('T')[0])
  const [pvEndDate, setPvEndDate] = useState(new Date().toISOString().split('T')[0])
  const [lastRefresh, setLastRefresh] = useState(null)
  const mainRef = useRef(null)

  useEffect(() => {
    loadAppointments()
  }, [selectedDate])

  // Auto-refresh appointments every 30 seconds to catch updates from doctors
  useEffect(() => {
    const intervalId = setInterval(() => {
      loadAppointments()
    }, 30000) // 30 seconds

    return () => clearInterval(intervalId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate])

  async function loadAppointments() {
    try {
      setLoading(true)
      setError('')
      const resp = await api.getAppointmentsForAllDoctors(selectedDate)
      if (resp && resp.status === 200 && Array.isArray(resp.data)) {
        setAppointments(resp.data)
      } else if (Array.isArray(resp)) {
        setAppointments(resp)
      } else {
        setAppointments([])
      }
      setLastRefresh(new Date())
    } catch (err) {
      setError(err.message || 'Failed to load appointments')
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }

  // Scroll to booking/patient sections when modals or panels open
  useEffect(() => {
    if (showBookingModal) {
      setTimeout(() => mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
    }
  }, [showBookingModal])

  useEffect(() => {
    if (showPatientModal) {
      setTimeout(() => mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
    }
  }, [showPatientModal])

  function handleBookingSuccess(newAppointment) {
    setAppointments((prev) => [newAppointment, ...prev])
    setShowBookingModal(false)
    alert('Appointment booked successfully!')
    loadAppointments()
  }

  function handleRescheduleClick(appointment) {
    setSelectedAppointment(appointment)
    setShowRescheduleModal(true)
  }

  function handleRescheduleSuccess(updatedAppointment) {
    setAppointments((prev) =>
      prev.map((a) =>
        (a.appointmentId || a.id) === (updatedAppointment.appointmentId || updatedAppointment.id)
          ? updatedAppointment
          : a
      )
    )
    setShowRescheduleModal(false)
    setSelectedAppointment(null)
    alert('Appointment rescheduled successfully!')
  }

  async function handleCancelAppointment(appointmentId) {
    try {
      setError('')
      const resp = await api.cancelAppointment(appointmentId)
      if (resp && resp.status === 404) {
        alert('Error: ' + (resp.message || 'Appointment not found'))
        return
      }
      if (resp && resp.success === false) {
        alert('Unable to cancel appointment: ' + (resp.message || 'Unknown error'))
        return
      }
      setAppointments((prev) => prev.filter((a) => (a.appointmentId || a.id) !== appointmentId))
      setCancelConfirm(null)
      alert('Appointment cancelled successfully')
    } catch (err) {
      setError(err.message || 'Failed to cancel appointment')
    }
  }

  // View appointment details - calls backend to get full appointment/patient info
  async function handleViewAppointment(a) {
    console.log('Viewing appointment');
    try {
      setError('')
      const appointmentId = a.appointmentId || a.id;
      const resp = await api.getAppointmentDetails(appointmentId)
      if (resp && resp.status === 200 && resp.data) {
        setSelectedAppointment(resp.data)
        setShowRescheduleModal(false)
        // show patient modal instead
        setShowPatientModal(true)
      } else if (resp && resp.status === 404) {
        alert('Error: ' + (resp.message || 'Appointment not found'))
      } else {
        alert('Unable to fetch appointment details')
      }
    } catch (err) {
      console.warn('viewAppointment failed', err)
      alert('Unable to fetch appointment details')
    }
  }

  // Patients visited by doctor

  async function fetchPatientsVisited() {
    if (!doctorIdForPatients) return alert('Please enter doctor/staff ID')
    try {
      const resp = await api.getPatientsVisitedByDoctor(doctorIdForPatients, pvStartDate, pvEndDate)
      if (resp && resp.status === 200 && Array.isArray(resp.data)) {
        setPatientsVisited(resp.data)
      } else if (Array.isArray(resp)) {
        setPatientsVisited(resp)
      } else if (resp && resp.success === false) {
        alert('Error: ' + (resp.message || 'Unable to fetch patients'))
      } else {
        setPatientsVisited([])
      }
    } catch (err) {
      console.warn('fetchPatientsVisited failed', err)
      alert('Unable to fetch patients visited by doctor')
    }
  }

  const filteredAppointments = appointments.filter((a) => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      (a.patientName || '').toLowerCase().includes(searchLower) ||
      (a.doctorName || '').toLowerCase().includes(searchLower) ||
      (a.patientId || '').toString().includes(searchLower) ||
      (a.doctorId || '').toString().includes(searchLower)
    )
  })

  return (
    <div ref={mainRef}>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h5 className="card-title mb-3">Appointment Management</h5>
              <div className="d-flex gap-2 align-items-center">
                <label className="form-label mb-0 me-2">Select Date:</label>
                <input
                  type="date"
                  className="form-control"
                  style={{ maxWidth: '200px' }}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
                <button className="btn btn-outline-secondary" onClick={loadAppointments}>
                  Refresh
                </button>
                {lastRefresh && (
                  <small className="text-muted ms-2">
                    Last updated: {lastRefresh.toLocaleTimeString()}
                  </small>
                )}
              </div>
            </div>
            <div className="col-md-6 text-md-end">
              <button
                className="btn btn-success me-2"
                onClick={() => setShowBookingModal(true)}
              >
                Book New Appointment
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label mb-1">Doctor patients</label>
            <div className="d-flex gap-2 align-items-end">
              <input className="form-control" placeholder="Doctor/staff ID" value={doctorIdForPatients} onChange={(e) => setDoctorIdForPatients(e.target.value)} style={{ maxWidth: 200 }} />
              <input type="date" className="form-control" value={pvStartDate} onChange={(e) => setPvStartDate(e.target.value)} style={{ maxWidth: 160 }} />
              <input type="date" className="form-control" value={pvEndDate} onChange={(e) => setPvEndDate(e.target.value)} style={{ maxWidth: 160 }} />
              <button className="btn btn-outline-primary" onClick={fetchPatientsVisited}>Fetch Patients</button>
            </div>
            {patientsVisited.length > 0 && (
              <div className="mt-2">
                <strong>Patients visited:</strong>
                <ul>
                  {patientsVisited.map((p, idx) => (<li key={idx}>{p}</li>))}
                </ul>
              </div>
            )}
          </div>
          <div className="mb-3">
            <input 
              type="text"
              className="form-control"
              placeholder="Search by patient/doctor name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
              name="appointment-search"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                }
              }}
            />
          </div>

          <AppointmentList
            appointments={filteredAppointments}
            loading={loading}
            onReschedule={handleRescheduleClick}
            onCancel={(id) => setCancelConfirm(id)}
            onView={handleViewAppointment}
            emptyMessage={searchTerm ? 'No appointments matching your search.' : 'No appointments for this date.'}
          />
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <AppointmentBooking
          onClose={() => setShowBookingModal(false)}
          onSuccess={handleBookingSuccess}
          doctors={doctors}
        />
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedAppointment && (
        <AppointmentReschedule
          appointment={selectedAppointment}
          onClose={() => {
            setShowRescheduleModal(false)
            setSelectedAppointment(null)
          }}
          onSuccess={handleRescheduleSuccess}
        />
      )}

      {/* Patient details modal when viewing appointment */}
      {showPatientModal && selectedAppointment && (
        <PatientDetails
          appointment={selectedAppointment}
          onClose={() => { setShowPatientModal(false); setSelectedAppointment(null) }}
        />
      )}

      {/* Cancel Confirmation Modal */}
      {cancelConfirm && (
        <div className="modal-backdrop show" style={{ display: 'block' }}>
          <div className="modal show" style={{ display: 'block' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Cancellation</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setCancelConfirm(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  Are you sure you want to cancel this appointment?
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setCancelConfirm(null)}
                  >
                    No, Keep It
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleCancelAppointment(cancelConfirm)}
                  >
                    Yes, Cancel It
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
