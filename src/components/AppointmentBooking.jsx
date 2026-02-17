import React, { useState, useEffect } from 'react'
import * as api from '../services/api'

export default function AppointmentBooking({ onClose, onSuccess, doctors = [] }) {
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    startTime: '',
    endTime: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
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
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const result = await api.bookAppointment(formData)
      setLoading(false)
      if (result) {
        onSuccess?.(result)
        setFormData({
          patientId: '',
          doctorId: '',
          appointmentDate: '',
          startTime: '',
          endTime: '',
          notes: '',
        })
        onClose?.()
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
                        {d.firstName || d.name} {d.lastName || ''} (ID: {d.staffId || d.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Appointment Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleInputChange}
                    disabled={loading}
                    min={new Date().toISOString().split('T')[0]}
                  />
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
