import React, { useState } from 'react'
import * as api from '../services/api'
import { formatDateWithDay, getTodayISO } from '../utils/dateUtils'

export default function DoctorAvailability({ doctorId, doctorName, onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState('unavailable') // Start with 'unavailable' tab
  const [selectedDates, setSelectedDates] = useState([])
  const [unavailableDates, setUnavailableDates] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingDates, setLoadingDates] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load current unavailable dates
  React.useEffect(() => {
    loadUnavailableDates()
  }, [doctorId])

  async function loadUnavailableDates() {
    if (!doctorId) return
    setLoadingDates(true)
    try {
      const result = await api.getDoctorUnavailableDates(doctorId)
      if (result.success && Array.isArray(result.data)) {
        setUnavailableDates(result.data) // Backend sends YYYY-MM-DD format
      } else {
        setUnavailableDates([])
      }
    } catch (err) {
      console.warn('Failed to load unavailable dates', err)
      setUnavailableDates([])
    } finally {
      setLoadingDates(false)
    }
  }

  // Close on ESC
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleDateSelect = (e) => {
    const date = e.target.value // Already in YYYY-MM-DD format from date input
    if (date && !selectedDates.includes(date)) {
      setSelectedDates([...selectedDates, date])
      setError('')
      setSuccess('')
      // Reset the input to allow selecting another date easily
      e.target.value = ''
    }
  }

  const handleClickUnavailableDate = (date) => {
    // Date from backend is already in YYYY-MM-DD format
    if (!selectedDates.includes(date)) {
      setSelectedDates([...selectedDates, date])
      setError('')
      setSuccess('')
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
        const action = activeTab === 'available' ? 'available' : 'unavailable'
        setSuccess(`Successfully marked ${action} for ${selectedDates.length} date(s)`)
        setSelectedDates([])
        
        // Reload unavailable dates to reflect changes
        await loadUnavailableDates()
        
        // Notify parent component
        onSuccess?.()
        
        // Close modal after showing success message
        setTimeout(() => {
          onClose?.()
        }, 1500)
      } else {
        setError(result.message || `Failed to mark doctor as ${activeTab}`)
      }
    } catch (err) {
      setError(err.message || `Failed to update doctor availability`)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setSelectedDates([])
    setError('')
    setSuccess('')
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1050, pointerEvents: 'none' }}>
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: '680px', 
          maxWidth: '95%', 
          maxHeight: '85vh', 
          backgroundColor: '#fff', 
          borderRadius: 8, 
          boxShadow: '0 8px 30px rgba(0,0,0,0.22)', 
          zIndex: 1060, 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden', 
          pointerEvents: 'auto' 
        }}
      >
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '16px 20px', 
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#f8f9fa'
        }}>
          <h5 className="mb-0">Manage Doctor Availability</h5>
          <button 
            type="button" 
            className="btn-close" 
            onClick={onClose} 
            disabled={loading}
            aria-label="Close"
          ></button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button type="button" className="btn-close" onClick={() => setError('')}></button>
            </div>
          )}
          
          {success && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {success}
              <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
            </div>
          )}

          {/* Doctor Info */}
          <div className="mb-3 p-3 bg-light rounded border">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>Doctor:</strong> {doctorName}
              </div>
              {!loadingDates && (
                <div className="badge bg-info">
                  {unavailableDates.length} Unavailable Date(s)
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'unavailable' ? 'active' : ''}`}
                onClick={() => handleTabChange('unavailable')}
                disabled={loading}
              >
                Mark Unavailable
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'available' ? 'active' : ''}`}
                onClick={() => handleTabChange('available')}
                disabled={loading}
              >
                Mark Available
              </button>
            </li>
          </ul>

          <form onSubmit={handleSubmit}>
            {/* Date Picker */}
            <div className="mb-3">
              <label className="form-label fw-bold">
                {activeTab === 'available' 
                  ? 'Select dates to mark as available' 
                  : 'Select dates to mark as unavailable'}
              </label>
              <input
                type="date"
                className="form-control"
                onChange={handleDateSelect}
                disabled={loading}
                min={getTodayISO()}
              />
              <small className="form-text text-muted">
                {activeTab === 'available' 
                  ? 'Remove unavailability to accept appointments on these dates' 
                  : 'Block these dates from accepting appointments'}
              </small>
            </div>

            {/* Selected Dates */}
            {selectedDates.length > 0 && (
              <div className="mb-3">
                <label className="form-label fw-bold">
                  Selected Dates ({selectedDates.length})
                </label>
                <div className="d-flex flex-wrap gap-2">
                  {selectedDates.map((date) => (
                    <div
                      key={date}
                      className={`badge ${activeTab === 'available' ? 'bg-success' : 'bg-danger'} d-flex align-items-center gap-2`}
                      style={{ fontSize: '0.95rem', padding: '0.6rem 0.8rem' }}
                    >
                      <span>{formatDateWithDay(date)}</span>
                      <button
                        type="button"
                        className="btn-close btn-close-white"
                        onClick={() => handleRemoveDate(date)}
                        disabled={loading}
                        style={{ fontSize: '0.6rem', padding: '0.2rem' }}
                        aria-label="Remove date"
                      ></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Show unavailable dates when in "Mark Available" tab */}
            {activeTab === 'available' && (
              <div className="mb-3">
                <label className="form-label fw-bold">
                  Currently Unavailable Dates
                  {loadingDates && <span className="spinner-border spinner-border-sm ms-2"></span>}
                </label>
                {!loadingDates && unavailableDates.length === 0 ? (
                  <div className="alert alert-info mb-0">
                    No unavailable dates. You are available for all dates.
                  </div>
                ) : (
                  <>
                    <div className="d-flex flex-wrap gap-2">
                      {unavailableDates.map((date) => {
                        const isSelected = selectedDates.includes(date)
                        return (
                          <div
                            key={date}
                            className={`badge ${isSelected ? 'bg-success' : 'bg-secondary'}`}
                            style={{ 
                              fontSize: '0.9rem', 
                              padding: '0.5rem 0.7rem', 
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onClick={() => handleClickUnavailableDate(date)}
                            title={isSelected ? 'Already selected' : 'Click to mark as available'}
                          >
                            {formatDateWithDay(date)}
                          </div>
                        )
                      })}
                    </div>
                    <small className="form-text text-muted d-block mt-2">
                      Click on a date to select it for marking as available
                    </small>
                  </>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="d-flex gap-2 mt-4">
              <button
                type="submit"
                className={`btn ${activeTab === 'available' ? 'btn-success' : 'btn-danger'}`}
                disabled={loading || selectedDates.length === 0}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Updating...
                  </>
                ) : (
                  `Mark ${activeTab === 'available' ? 'Available' : 'Unavailable'}`
                )}
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
