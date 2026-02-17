import React, { useState, useEffect } from 'react'
import * as api from '../services/api'

export default function PatientDetails({ appointment, onClose }) {
  const [patientDetails, setPatientDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        setLoading(true)
        // Try to load patient details from patients service
        const patientId = appointment?.patientId || appointment?.patientId
        if (patientId && typeof api.getPatientById === 'function') {
          const resp = await api.getPatientById(patientId)
          if (resp && resp.status === 200 && resp.data) {
            setPatientDetails(resp.data)
            setLoading(false)
            return
          }
        }
        // Fallback to appointment data if patient API not available or failed
        setPatientDetails({
          patientId: appointment?.patientId,
          patientName: appointment?.patientName,
          email: appointment?.email || 'N/A',
          phone: appointment?.phone || 'N/A',
          dateOfBirth: appointment?.dateOfBirth || 'N/A',
          gender: appointment?.gender || 'N/A',
          address: appointment?.address || 'N/A',
          city: appointment?.patientAddress?.city || 'N/A',
          state: appointment?.patientAddress?.state || 'N/A',
          country: appointment?.patientAddress?.country || 'N/A',
          pinCode: appointment?.patientAddress?.pinCode || 'N/A',
        })
        setLoading(false)
      } catch (err) {
        setLoading(false)
        setError(err.message || 'Failed to load patient details')
      }
    }

    fetchPatientDetails()
  }, [appointment])

  // Close on ESC key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="patient-modal-root" style={{ position: 'fixed', inset: 0, zIndex: 1050, pointerEvents: 'none' }}>
      <div
        className="patient-modal" 
        role="dialog" 
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '720px', maxWidth: '95%', maxHeight: '80vh', backgroundColor: '#fff', borderRadius: 8, boxShadow: '0 8px 30px rgba(0,0,0,0.35)', zIndex: 1060, display: 'flex', flexDirection: 'column', overflow: 'hidden', pointerEvents: 'auto' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px', borderBottom: '1px solid #f1f1f1' }}>
          <div style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#0d6efd', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 }}>
            {((patientDetails && (patientDetails.patientName || patientDetails.name)) || 'P').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{patientDetails?.patientName || patientDetails?.name || 'Patient'}</div>
            <div style={{ fontSize: 13, color: '#6c757d' }}>{patientDetails?.patientId || patientDetails?.id || ''} • {patientDetails?.gender || ''} • {patientDetails?.patientPhoneNumber || patientDetails?.phone || ''}</div>
          </div>
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose} aria-label="Close">Close</button>
        </div>

        <div style={{ padding: 18, overflowY: 'auto', flex: 1 }}>
          {loading && <div className="alert alert-info">Loading patient details...</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          {patientDetails && (
            <div>
              <div style={{ display: 'flex', gap: 24, marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: '#6c757d' }}>Patient ID</div>
                  <div style={{ fontWeight: 600 }}>{patientDetails.patientId || patientDetails.id || patientDetails._id || '—'}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: '#6c757d' }}>DOB</div>
                  <div>{patientDetails.dateOfBirth || patientDetails.dob || '—'}</div>
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: '#6c757d' }}>Email</div>
                <div>{patientDetails.email || patientDetails.patientEmail || '—'}</div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: '#6c757d' }}>Phone</div>
                <div>{patientDetails.phone || patientDetails.patientPhoneNumber || '—'}</div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: '#6c757d' }}>Gender</div>
                <div>{patientDetails.gender || (patientDetails.sex ? String(patientDetails.sex) : '—')}</div>
              </div>

              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f1f1f1' }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Address</div>
                <div style={{ fontSize: 14 }}>
                  <div>{
                    patientDetails.patientAddress
                      ? `${patientDetails.patientAddress.doorNumber || ''}${patientDetails.patientAddress.landmark ? ', ' + patientDetails.patientAddress.landmark : ''}`
                      : (patientDetails.address && (patientDetails.address.line1 || patientDetails.address.street || JSON.stringify(patientDetails.address))) || patientDetails.address || '—'
                  }</div>
                  <div>{patientDetails.patientAddress?.city || patientDetails.city || '—'}</div>
                  <div>{patientDetails.patientAddress?.state || patientDetails.state || '—'}</div>
                  <div>{patientDetails.patientAddress?.country || patientDetails.country || '—'}</div>
                  <div>{patientDetails.patientAddress?.pinCode || patientDetails.pinCode || '—'}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
