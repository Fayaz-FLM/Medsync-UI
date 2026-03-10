import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import * as api from '../services/api'
import AppointmentReschedule from '../components/AppointmentReschedule'
import PatientDetails from '../components/PatientDetails'
import ReasonForVisitModal from '../components/ReasonForVisitModal'
import DoctorAvailability from '../components/DoctorAvailability'
import DiagnosisModal from '../components/DiagnosisModal'
import { formatDateWithDay, getTodayISO } from '../utils/dateUtils'

export default function DoctorDashboard() {

  const { user } = useAuth()

  const [appointments, setAppointments] = useState([])
  const [unavailableDates, setUnavailableDates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedDate, setSelectedDate] = useState(getTodayISO())

  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [showPatientModal, setShowPatientModal] = useState(false)
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false)
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false)

  const [selectedAppointment, setSelectedAppointment] = useState(null)

  const [cancelConfirm, setCancelConfirm] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

  const [showReasonModal, setShowReasonModal] = useState(false)
  const [selectedReason, setSelectedReason] = useState(null)

  useEffect(() => {
    loadAppointments()
  }, [selectedDate, user])

  useEffect(() => {
    loadUnavailableDates()
  }, [user])

  async function loadUnavailableDates() {

    if (!user?.staffId && !user?.username) return

    try {

      const staffId = user.staffId || user.username
      const result = await api.getDoctorUnavailableDates(staffId)

      if (result.success && Array.isArray(result.data)) {
        setUnavailableDates(result.data)
      } else {
        setUnavailableDates([])
      }

    } catch {
      setUnavailableDates([])
    }

  }

  async function loadAppointments() {

    if (!user?.username) {
      setLoading(false)
      return
    }

    try {

      setLoading(true)
      setError('')

      const resp = await api.getAppointmentsForDoctor(user.username, selectedDate)

      if (resp && resp.success && Array.isArray(resp.data)) {
        setAppointments(resp.data)
      } else if (Array.isArray(resp)) {
        setAppointments(resp)
      } else {
        setAppointments([])
      }

    } catch (err) {

      if (err.response?.status !== 404) {
        setError(err.message || 'Failed to load appointments')
      }

      setAppointments([])

    } finally {
      setLoading(false)
    }

  }

  function onViewPatient(appointment) {
    setSelectedAppointment(appointment)
    setShowPatientModal(true)
  }

  function onViewReason(appointment) {
    setSelectedReason(appointment)
    setShowReasonModal(true)
  }

  function onRescheduleAppointment(appointment) {
    setSelectedAppointment(appointment)
    setShowRescheduleModal(true)
  }

  async function onCancelAppointment(id) {

    try {

      const resp = await api.cancelAppointment(id)

      if (resp && resp.success) {

        setAppointments(prev =>
          prev.filter(a => (a.appointmentId || a.id) !== id)
        )

        setCancelConfirm(null)

        setSuccessMessage('Appointment cancelled successfully')

        setTimeout(() => setSuccessMessage(''), 3000)

        loadAppointments()

      }

    } catch (err) {
      setError(err.message || 'Failed to cancel appointment')
    }

  }

  function handleRescheduleSuccess() {

    loadAppointments()

    setShowRescheduleModal(false)
    setSelectedAppointment(null)

    setSuccessMessage('Appointment rescheduled successfully')

    setTimeout(() => setSuccessMessage(''), 3000)

  }

  return (

    <div className="h-100 d-flex flex-column bg-light">

      {/* Header */}

      <div className="py-3 border-bottom bg-white">

        <div className="container d-flex justify-content-between align-items-center">

          <div>
            <h3 className="mb-0">Doctor Dashboard</h3>
            {user && <small className="text-muted">Signed in as {user.username}</small>}
          </div>

          <div>

            <button
              className="btn btn-outline-primary me-2"
              onClick={() => setSelectedDate(getTodayISO())}
            >
              Today
            </button>

            <button
              className="btn btn-primary me-2"
              onClick={() => setShowAvailabilityModal(true)}
            >
              Manage Availability
            </button>

            <button
              className="btn btn-outline-secondary"
              onClick={loadAppointments}
            >
              Refresh
            </button>

          </div>

        </div>

      </div>

      {/* Content */}

      <div className="container py-4">

        {error && <div className="alert alert-danger">{error}</div>}

        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <div className="mb-3 d-flex align-items-center gap-3">

          <label className="fw-bold">Select Date:</label>

          <input
            type="date"
            className="form-control"
            style={{ maxWidth: 200 }}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <span className="text-muted">{formatDateWithDay(selectedDate)}</span>

        </div>

        <div className="card">

          <div className="card-body">

            <h5>Appointments for {formatDateWithDay(selectedDate)}</h5>

            {loading ? (

              <div className="alert alert-info">Loading appointments...</div>

            ) : appointments.length === 0 ? (

              <div className="alert alert-warning">No appointments for this date.</div>

            ) : (

              <div className="table-responsive">

                <table className="table table-hover">

                  <thead>

                    <tr>
                      <th>Time</th>
                      <th>Patient</th>
                      <th>ID</th>
                      <th>Notes</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>

                  </thead>

                  <tbody>

                    {appointments.map((a) => (

                      <tr key={a.appointmentId || a.id}>

                        <td>{a.startTime} - {a.endTime}</td>

                        <td>{a.patientName || 'N/A'}</td>

                        <td>{a.patientId || 'N/A'}</td>

                        <td>{a.notes || '-'}</td>

                        <td>
                          <span className="badge bg-success">{a.status}</span>
                        </td>

                        <td className="text-end">

                          <button
                            className="btn btn-sm btn-primary me-2"
                            onClick={() => onViewReason(a)}
                          >
                            View Reason
                          </button>

                          <button
                            className="btn btn-sm btn-info me-2"
                            onClick={() => onViewPatient(a)}
                          >
                            View Patient
                          </button>

                          <button
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => onRescheduleAppointment(a)}
                          >
                            Reschedule
                          </button>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => setCancelConfirm(a.appointmentId || a.id)}
                          >
                            Cancel
                          </button>

                          {a.status !== 'DIAGNOSED' && (
                            <button
                              className="btn btn-sm btn-success ms-2"
                              onClick={() => {
                                setSelectedAppointment(a);
                                setShowDiagnosisModal(true);
                              }}
                            >
                              Diagnose
                            </button>
                          )}

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>

      </div>

      {/* Reason Modal */}
      <ReasonForVisitModal 
        appointment={selectedReason} 
        onClose={() => {
          setShowReasonModal(false);
          setSelectedReason(null);
        }} 
      />

      {/* Patient Details Modal */}
      {showPatientModal && selectedAppointment && (
        <PatientDetails 
          appointment={selectedAppointment} 
          onClose={() => {
            setShowPatientModal(false);
            setSelectedAppointment(null);
          }} 
        />
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedAppointment && (
        <AppointmentReschedule 
          appointment={selectedAppointment} 
          onClose={() => {
            setShowRescheduleModal(false);
            setSelectedAppointment(null);
          }} 
          onSuccess={handleRescheduleSuccess}
        />
      )}

      {/* Cancel Confirmation Modal */}
      {cancelConfirm && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Cancellation</h5>
                <button type="button" className="btn-close" onClick={() => setCancelConfirm(null)}></button>
              </div>
              <div className="modal-body">
                Are you sure you want to cancel this appointment?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setCancelConfirm(null)}>No, Keep it</button>
                <button type="button" className="btn btn-danger" onClick={() => onCancelAppointment(cancelConfirm)}>Yes, Cancel Appointment</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Diagnosis Modal */}
      {showDiagnosisModal && selectedAppointment && (
        <DiagnosisModal
          appointment={selectedAppointment}
          onClose={() => {
            setShowDiagnosisModal(false);
            setSelectedAppointment(null);
          }}
          onSuccess={() => {
            setShowDiagnosisModal(false);
            setSelectedAppointment(null);
            setSuccessMessage('Diagnosis submitted successfully');
            setTimeout(() => setSuccessMessage(''), 3000);
            loadAppointments();
          }}
        />
      )}

    </div>

  )

}