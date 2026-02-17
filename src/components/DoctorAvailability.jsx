import React, { useState } from 'react'
import * as api from '../services/api'

export default function DoctorAvailability({ doctorId, doctorName, onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState('available') // 'available' or 'unavailable'
  const [selectedDates, setSelectedDates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Close on ESC
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleDateSelect = (e) => {
    const date = e.target.value
    if (date && !selectedDates.includes(date)) {
      setSelectedDates([...selectedDates, date])
      setError('')
    }
  }

  const handleRemoveDate = (dateToRemove) => {
    setSelectedDates(selectedDates.filter(d => d !== dateToRemove))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (selectedDates.length === 0) {
      setError('Please select at least one date')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      let result
      if (activeTab === 'available') {
        result = await api.markDoctorAvailable(doctorId, selectedDates)
      } else {
        result = await api.markDoctorUnavailable(doctorId, selectedDates)
      }

      if (result.success) {
        setSuccess(`Doctor marked as ${activeTab} for ${selectedDates.length} date(s)`)
        setSelectedDates([])
        onSuccess?.()
        onClose?.()
      } else {
        setError(result.message || `Failed to mark doctor as ${activeTab}`)
      }
    } catch (err) {
      setError(err.message || `Failed to update doctor availability`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1050, pointerEvents: 'none' }}>
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '680px', maxWidth: '95%', maxHeight: '80vh', backgroundColor: '#fff', borderRadius: 8, boxShadow: '0 8px 30px rgba(0,0,0,0.22)', zIndex: 1060, display: 'flex', flexDirection: 'column', overflow: 'hidden', pointerEvents: 'auto' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #f1f1f1' }}>
          <h5 className="mb-0">Manage Availability</h5>
          <button type="button" className="btn-close" onClick={onClose} disabled={loading}></button>
        </div>

        <div style={{ padding: 16, overflowY: 'auto', flex: 1 }}>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="mb-3 p-3 bg-light rounded">
            <p className="mb-0"><strong>Doctor:</strong> {doctorName}</p>
          </div>

          {/* Tabs */}
          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'available' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('available')
                  setSelectedDates([])
                  setError('')
                  setSuccess('')
                }}
              >
                Mark Available
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'unavailable' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('unavailable')
                  setSelectedDates([])
                  setError('')
                  setSuccess('')
                }}
              >
                Mark Unavailable
              </button>
            </li>
          </ul>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">
                {activeTab === 'available' ? 'Select dates to mark available' : 'Select dates to mark unavailable'}
              </label>
              <input
                type="date"
                className="form-control"
                onChange={handleDateSelect}
                disabled={loading}
                min={new Date().toISOString().split('T')[0]}
              />
              <small className="form-text text-muted">
                {activeTab === 'available' 
                  ? 'Select dates when you are available for appointments' 
                  : 'Select dates when you are not available for appointments'}
              </small>
            </div>

            {/* Selected Dates List */}
            {selectedDates.length > 0 && (
              <div className="mb-3">
                <label className="form-label">Selected Dates ({selectedDates.length})</label>
                <div className="d-flex flex-wrap gap-2">
                  {selectedDates.map((date) => (
                    <div
                      key={date}
                      className={`badge ${activeTab === 'available' ? 'bg-success' : 'bg-danger'} d-flex align-items-center gap-1`}
                      style={{ fontSize: '0.9rem', padding: '0.5rem 0.6rem', cursor: 'pointer' }}
                    >
                      {new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                      <button
                        type="button"
                        className="btn-close btn-sm"
                        onClick={() => handleRemoveDate(date)}
                        disabled={loading}
                        style={{ width: 'auto', height: 'auto', fontSize: '0.7rem' }}
                      ></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="d-flex gap-2">
              <button
                type="submit"
                className={`btn ${activeTab === 'available' ? 'btn-success' : 'btn-danger'}`}
                disabled={loading || selectedDates.length === 0}
              >
                {loading ? 'Updating...' : `Mark ${activeTab === 'available' ? 'Available' : 'Unavailable'}`}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
