import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import * as api from '../services/api'
import AppointmentReschedule from '../components/AppointmentReschedule'
import PatientDetails from '../components/PatientDetails'
import DoctorAvailability from '../components/DoctorAvailability'

export default function DoctorDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [showPatientModal, setShowPatientModal] = useState(false)
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [cancelConfirm, setCancelConfirm] = useState(null)

  // Load appointments for selected date
  useEffect(() => {
    loadAppointments()
  }, [selectedDate, user])

  async function loadAppointments() {
    try {
      setLoading(true)
      setError('')
      if (user?.username) {
        const resp = await api.getAppointmentsForDoctor(user.username, selectedDate)
        if (resp && resp.status === 200 && Array.isArray(resp.data)) {
          setAppointments(resp.data)
        } else if (Array.isArray(resp)) {
          setAppointments(resp)
        } else {
          setAppointments([])
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load appointments')
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }

  function onViewPatient(appointment) {
    setSelectedAppointment(appointment)
    setShowPatientModal(true)
  }

  function onRescheduleAppointment(appointment) {
    setSelectedAppointment(appointment)
    setShowRescheduleModal(true)
  }

  async function onCancelAppointment(appointmentId) {
    try {
      setError('')
      const resp = await api.cancelAppointment(appointmentId)
      if (resp && resp.status === 404) {
        setError(resp.message || 'Appointment not found')
        return
      }
      setAppointments((prev) => prev.filter((a) => (a.appointmentId || a.id) !== appointmentId))
      setCancelConfirm(null)
      alert('Appointment cancelled successfully')
    } catch (err) {
      setError(err.message || 'Failed to cancel appointment')
    }
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
    alert('Appointment rescheduled successfully')
  }


  return (
    <div className="h-100 d-flex flex-column bg-light">
      <div className="py-3 border-bottom bg-white">
        <div className="container d-flex align-items-center justify-content-between">
          <div>
            <h3 className="mb-0">Doctor Dashboard</h3>
            {user && <small className="text-muted">Signed in as {user.username}</small>}
          </div>

          <div>
            <button className="btn btn-primary me-2" onClick={() => setShowAvailabilityModal(true)}>
              Manage Availability
            </button>
            <button className="btn btn-outline-secondary me-2" onClick={loadAppointments}>
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="container flex-grow-1 d-flex flex-column py-4 overflow-auto min-h-0">
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-4">
          <div className="d-flex align-items-center gap-2">
            <label className="form-label mb-0 me-2">Select Date:</label>
            <input
              type="date"
              className="form-control"
              style={{ maxWidth: '200px' }}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        <div className="card flex-grow-1">
          <div className="card-body p-3 d-flex flex-column" style={{ minHeight: 0 }}>
            <h5 className="card-title">Appointments for {selectedDate}</h5>
            
            {loading ? (
              <div className="alert alert-info">Loading appointments...</div>
            ) : appointments.length === 0 ? (
              <div className="alert alert-warning">No appointments for this date.</div>
            ) : (
              <div className="table-responsive overflow-auto flex-grow-1" style={{ minHeight: 0 }}>
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Patient Name</th>
                      <th>Patient ID</th>
                      <th>Notes</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((a) => (
                      <tr key={a.appointmentId || a.id}>
                        <td>
                          {a.startTime} - {a.endTime}
                        </td>
                        <td>{a.patientName || 'N/A'}</td>
                        <td>{a.patientId || 'N/A'}</td>
                        <td>{a.notes || '-'}</td>
                        <td>
                          <span
                            className={`badge ${
                              a.status === 'Scheduled'
                                ? 'bg-success'
                                : a.status === 'Cancelled'
                                ? 'bg-danger'
                                : 'bg-warning'
                            }`}
                          >
                            {a.status || 'Scheduled'}
                          </span>
                        </td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-info me-2"
                            onClick={() => onViewPatient(a)}
                            title="View patient details"
                          >
                            View Patient
                          </button>
                          <button
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => onRescheduleAppointment(a)}
                            title="Reschedule appointment"
                          >
                            Reschedule
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => setCancelConfirm(a.appointmentId || a.id)}
                            title="Cancel appointment"
                          >
                            Cancel
                          </button>
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
                    onClick={() => onCancelAppointment(cancelConfirm)}
                  >
                    Yes, Cancel It
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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

      {/* Patient Details Modal */}
      {showPatientModal && selectedAppointment && (
        <PatientDetails
          appointment={selectedAppointment}
          onClose={() => {
            setShowPatientModal(false)
            setSelectedAppointment(null)
          }}
        />
      )}

      {/* Doctor Availability Modal */}
      {showAvailabilityModal && (
        <DoctorAvailability
          doctorId={user?.username}
          doctorName={user?.username}
          onClose={() => setShowAvailabilityModal(false)}
          onSuccess={() => {
            loadAppointments()
          }}
        />
      )}
    </div>
  )
}