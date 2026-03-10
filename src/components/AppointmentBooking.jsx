import React, { useState, useEffect } from 'react'
import * as api from '../services/api'
import { formatDateWithDay, getTodayISO } from '../utils/dateUtils'

export default function AppointmentBooking({ onClose, onSuccess, doctors = [] }) {
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    startTime: '',
    endTime: '',
    notes: '',
    reasonForVisit: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [unavailableDates, setUnavailableDates] = useState([])
  const [loadingAvailability, setLoadingAvailability] = useState(false)
  const [checkingAvailability, setCheckingAvailability] = useState(false)
  const [availabilityMessage, setAvailabilityMessage] = useState('')

  // Load unavailable dates when doctor is selected
  useEffect(() => {
    if (formData.doctorId) {
      loadDoctorUnavailability(formData.doctorId)
    } else {
      setUnavailableDates([])
      setAvailabilityMessage('')
    }
  }, [formData.doctorId])

  // Check availability when date is selected
  useEffect(() => {
    if (formData.doctorId && formData.appointmentDate) {
      checkDateAvailability(formData.doctorId, formData.appointmentDate)
    } else {
      setAvailabilityMessage('')
    }
  }, [formData.doctorId, formData.appointmentDate])

  async function loadDoctorUnavailability(doctorId) {
    setLoadingAvailability(true)
    try {
      const result = await api.getDoctorUnavailableDates(doctorId)
      if (result.success && Array.isArray(result.data)) {
        setUnavailableDates(result.data)
      } else {
        setUnavailableDates([])
      }
    } catch (err) {
      console.warn('Failed to load doctor unavailability', err)
      setUnavailableDates([])
    } finally {
      setLoadingAvailability(false)
    }
  }

  async function checkDateAvailability(doctorId, date) {
    setCheckingAvailability(true)
    setAvailabilityMessage('')
    try {
      const result = await api.isDoctorAvailable(doctorId, date)
      if (result.success) {
        if (result.data === true) {
          setAvailabilityMessage('✓ Doctor is available on this date')
        } else {
          setAvailabilityMessage('✗ Doctor is not available on this date')
          setError('Doctor is not available on the selected date. Please choose another date.')
        }
      }
    } catch (err) {
      console.warn('Failed to check availability', err)
    } finally {
      setCheckingAvailability(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const isDateUnavailable = (date) => {
    return unavailableDates.includes(date)
  }

  const validateForm = () => {
    if (!formData.patientId) {
      setError('Please select a patient')
      return false
    }
    if (!formData.doctorId) {
      setError('Please select a doctor')
      return false
    }
    if (!formData.appointmentDate) {
      setError('Please select appointment date')
      return false
    }
    if (!formData.startTime) {
      setError('Please select start time')
      return false
    }
    if (!formData.endTime) {
      setError('Please select end time')
      return false
    }
    if (formData.startTime >= formData.endTime) {
      setError('End time must be after start time')
      return false
    }
    if (!formData.reasonForVisit || formData.reasonForVisit.trim() === '') {
      setError('Please provide a reason for visit')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    // Final availability check
    if (isDateUnavailable(formData.appointmentDate)) {
      setError('Doctor is not available on the selected date')
      return
    }

    setLoading(true)
    try {
      const result = await api.bookAppointment(formData)
      setLoading(false)
      if (result.success) {
        onSuccess?.(result.data)
        setFormData({
          patientId: '',
          doctorId: '',
          appointmentDate: '',
          startTime: '',
          endTime: '',
          notes: '',
          reasonForVisit: '',
        })
        onClose?.()
      } else {
        setError(result.message || 'Failed to book appointment')
      }
    } catch (err) {
      setLoading(false)
      setError(err.message || 'Failed to book appointment')
    }
  }

  return (
    <div className="modal-backdrop show" style={{ display: 'block' }}>
      <div className="modal show" style={{ display: 'block' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Book Appointment</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                disabled={loading}
              ></button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Patient ID</label>
                  <input
                    type="text"
                    className="form-control"
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder="Enter patient ID"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Doctor</label>
                  <select
                    className="form-select"
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleInputChange}
                    disabled={loading}
                  >
                    <option value="">Select a doctor</option>
                    {doctors.map((d) => (
                      <option key={d.staffId || d.id} value={d.staffId || d.id}>
                        {d.firstName || d.name} {d.lastName || ''} - {d.specialization || 'General'} (ID: {d.staffId || d.id})
                      </option>
                    ))}
                  </select>
                  {loadingAvailability && (
                    <small className="form-text text-muted">
                      <span className="spinner-border spinner-border-sm me-1"></span>
                      Loading doctor availability...
                    </small>
                  )}
                </div>

                {/* Show unavailable dates for selected doctor */}
                {formData.doctorId && unavailableDates.length > 0 && (
                  <div className="alert alert-warning mb-3">
                    <strong>Doctor Unavailable Dates:</strong>
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      {unavailableDates.slice(0, 10).map((date) => (
                        <span key={date} className="badge bg-danger">
                          {formatDateWithDay(date)}
                        </span>
                      ))}
                      {unavailableDates.length > 10 && (
                        <span className="badge bg-secondary">
                          +{unavailableDates.length - 10} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">Appointment Date</label>
                  <input
                    type="date"
                    className={`form-control ${isDateUnavailable(formData.appointmentDate) ? 'is-invalid' : ''}`}
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleInputChange}
                    disabled={loading || !formData.doctorId}
                    min={getTodayISO()}
                  />
                  {!formData.doctorId && (
                    <small className="form-text text-muted">
                      Please select a doctor first
                    </small>
                  )}
                  {checkingAvailability && (
                    <small className="form-text text-muted">
                      <span className="spinner-border spinner-border-sm me-1"></span>
                      Checking availability...
                    </small>
                  )}
                  {availabilityMessage && !checkingAvailability && (
                    <small className={`form-text ${availabilityMessage.startsWith('✓') ? 'text-success' : 'text-danger'}`}>
                      {availabilityMessage}
                    </small>
                  )}
                  {isDateUnavailable(formData.appointmentDate) && (
                    <div className="invalid-feedback d-block">
                      Doctor is not available on this date
                    </div>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Start Time</label>
                    <input
                      type="time"
                      className="form-control"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">End Time</label>
                    <input
                      type="time"
                      className="form-control"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Reason for Visit <span className="text-danger">*</span></label>
                  <textarea
                    className="form-control"
                    name="reasonForVisit"
                    value={formData.reasonForVisit}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="e.g., Fever and cough, Follow-up consultation, Routine checkup, etc."
                    disabled={loading}
                    required
                  ></textarea>
                  <small className="form-text text-muted">
                    This helps the doctor prepare for your consultation
                  </small>
                </div>

                <div className="mb-3">
                  <label className="form-label">Notes (Optional)</label>
                  <textarea
                    className="form-control"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="e.g., Follow-up consultation, Check blood pressure, etc."
                    disabled={loading}
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Booking...' : 'Book Appointment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
