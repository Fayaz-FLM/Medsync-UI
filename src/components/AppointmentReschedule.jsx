import React, { useState } from 'react'
import * as api from '../services/api'

export default function AppointmentReschedule({
  appointment,
  onClose,
  onSuccess,
}) {
  // Close on ESC
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  const [formData, setFormData] = useState({
    appointmentDate: appointment?.appointmentDate || '',
    startTime: appointment?.startTime || '',
    endTime: appointment?.endTime || '',
    notes: appointment?.notes || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const validateForm = () => {
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
      const result = await api.rescheduleAppointment(appointment.appointmentId || appointment.id, formData)
      setLoading(false)
      if (result && result.success) {
        onSuccess?.(result.data)
        onClose?.()
      } else {
        setError(result?.message || 'Failed to reschedule appointment')
      }
    } catch (err) {
      setLoading(false)
      setError(err.message || 'Failed to reschedule appointment')
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1050, pointerEvents: 'none' }}>
      <div
        role="dialog"
        aria-modal="false"
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '680px', maxWidth: '95%', maxHeight: '80vh', backgroundColor: '#fff', borderRadius: 8, boxShadow: '0 8px 30px rgba(0,0,0,0.22)', zIndex: 1060, display: 'flex', flexDirection: 'column', overflow: 'hidden', pointerEvents: 'auto' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #f1f1f1' }}>
          <h5 className="mb-0">Reschedule Appointment</h5>
          <button type="button" className="btn-close" onClick={onClose} disabled={loading}></button>
        </div>

        <div style={{ padding: 16, overflowY: 'auto', flex: 1 }}>
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="mb-3 p-3 bg-light rounded">
            <p className="mb-1"><strong>Patient:</strong> {appointment?.patientName || 'N/A'}</p>
            <p className="mb-1"><strong>Doctor:</strong> {appointment?.doctorName || 'N/A'}</p>
            <p className="mb-0"><strong>Current Appointment:</strong> {appointment?.appointmentDate} {appointment?.startTime} - {appointment?.endTime}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">New Appointment Date</label>
              <input type="date" className="form-control" name="appointmentDate" value={formData.appointmentDate} onChange={handleInputChange} disabled={loading} min={new Date().toISOString().split('T')[0]} />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Start Time</label>
                <input type="time" className="form-control" name="startTime" value={formData.startTime} onChange={handleInputChange} disabled={loading} />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">End Time</label>
                <input type="time" className="form-control" name="endTime" value={formData.endTime} onChange={handleInputChange} disabled={loading} />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Notes (Optional)</label>
              <textarea className="form-control" name="notes" value={formData.notes} onChange={handleInputChange} rows="3" placeholder="e.g., Follow-up consultation" disabled></textarea>
            </div>
          </form>
        </div>

        <div style={{ padding: 12, borderTop: '1px solid #f1f1f1', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={loading}>{loading ? 'Rescheduling...' : 'Reschedule Appointment'}</button>
        </div>
      </div>
    </div>
  )
}
