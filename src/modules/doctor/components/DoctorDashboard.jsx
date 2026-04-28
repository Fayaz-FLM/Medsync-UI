import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import * as api from '../../../services/api'
import { formatDateWithDay, getTodayISO } from '../../../utils/dateUtils'
import DoctorAppointmentsTable from './DoctorAppointmentsTable'
import { DOCTOR_TEXT, DOCTOR_STYLES, DOCTOR_INLINE, DIAGNOSIS_FIELDS } from '../constants/doctorConstants'

// ── Helpers ───────────────────────────────────────────────────────────────────
const EMPTY_DIAGNOSIS = { diagnosisSummary: '', prescription: '', medicines: '', notesForReceptionist: '', followUpSuggestion: '' }

function getApptId(a) { return a.appointmentId || a.id }

// ── Backdrop ──────────────────────────────────────────────────────────────────
function Backdrop({ style }) {
  return <div style={style} />
}

// ── ReasonForVisitModal ───────────────────────────────────────────────────────
function ReasonModal({ appointment, onClose }) {
  if (!appointment) return null
  return (
    <div className={DOCTOR_STYLES.modalBackdrop} tabIndex="-1" style={DOCTOR_INLINE.cancelBackdrop}>
      <div className={DOCTOR_STYLES.modalDialogCentered}>
        <div className={DOCTOR_STYLES.modalContent}>
          <div className={DOCTOR_STYLES.modalHeaderPrimary}>
            <h5 className={DOCTOR_STYLES.modalTitle}>{DOCTOR_TEXT.MODAL_REASON_TITLE}</h5>
            <button className={DOCTOR_STYLES.btnCloseWhite} onClick={onClose} />
          </div>
          <div className={DOCTOR_STYLES.modalBody}>
            <div className={DOCTOR_STYLES.row}>
              <div className={DOCTOR_STYLES.col6}><strong>{DOCTOR_TEXT.LABEL_PATIENT}</strong> {appointment.patientName || DOCTOR_TEXT.MSG_PATIENT_FALLBACK}</div>
              <div className={DOCTOR_STYLES.col6}><strong>{DOCTOR_TEXT.LABEL_DATE}</strong> {appointment.appointmentDate || DOCTOR_TEXT.MSG_PATIENT_FALLBACK}</div>
            </div>
            <div className={`${DOCTOR_STYLES.row} mt-2`}>
              <div className={DOCTOR_STYLES.col12}><strong>{DOCTOR_TEXT.LABEL_TIME}</strong> {appointment.startTime} - {appointment.endTime}</div>
            </div>
            <hr />
            <h6>{DOCTOR_TEXT.LABEL_REASON}</h6>
            <p className="border p-3 bg-light rounded">{appointment.reasonForVisit || DOCTOR_TEXT.MSG_NO_REASON}</p>
            {appointment.notes && (
              <>
                <h6>{DOCTOR_TEXT.LABEL_NOTES}</h6>
                <p className="border p-3 bg-light rounded small">{appointment.notes}</p>
              </>
            )}
          </div>
          <div className={DOCTOR_STYLES.modalFooter}>
            <button className={DOCTOR_STYLES.btnSecondary} onClick={onClose}>{DOCTOR_TEXT.BTN_CLOSE}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── PatientDetailsModal ───────────────────────────────────────────────────────
function PatientModal({ appointment, onClose }) {
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const patientId = appointment?.patientId
        if (patientId && typeof api.getPatientById === 'function') {
          const resp = await api.getPatientById(patientId)
          if (resp?.data) { setDetails(resp.data); setLoading(false); return }
        }
        setDetails(buildFallback(appointment))
      } catch { setDetails(buildFallback(appointment)) }
      finally { setLoading(false) }
    }
    load()
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [appointment, onClose])

  function buildFallback(a) {
    return {
      patientId: a?.patientId, patientName: a?.patientName,
      email: a?.email || DOCTOR_TEXT.MSG_PATIENT_FALLBACK,
      phone: a?.phone || DOCTOR_TEXT.MSG_PATIENT_FALLBACK,
      dateOfBirth: a?.dateOfBirth || DOCTOR_TEXT.MSG_PATIENT_FALLBACK,
      gender: a?.gender || DOCTOR_TEXT.MSG_PATIENT_FALLBACK,
      patientAddress: a?.patientAddress,
    }
  }

  const name = details?.patientName || details?.name || 'Patient'
  const initials = name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div style={DOCTOR_INLINE.fixedContainer}>
      <div role="dialog" aria-modal="true" onClick={e => e.stopPropagation()} style={DOCTOR_INLINE.modalCardWide}>
        <div style={DOCTOR_INLINE.patientHeader}>
          <div style={DOCTOR_INLINE.patientAvatar}>{initials}</div>
          <div style={{ flex: 1 }}>
            <div style={DOCTOR_INLINE.patientName}>{name}</div>
            <div style={DOCTOR_INLINE.patientMeta}>
              {details?.patientId || ''} • {details?.gender || ''} • {details?.patientPhoneNumber || details?.phone || ''}
            </div>
          </div>
          <button className={DOCTOR_STYLES.btnSecondary + ' btn-sm'} onClick={onClose}>{DOCTOR_TEXT.BTN_CLOSE}</button>
        </div>
        <div style={DOCTOR_INLINE.modalBody}>
          {loading && <div className={DOCTOR_STYLES.alertInfo}>{DOCTOR_TEXT.MSG_LOADING_PATIENT}</div>}
          {error   && <div className={DOCTOR_STYLES.alertDanger}>{error}</div>}
          {details && (
            <>
              <div style={DOCTOR_INLINE.fieldRow}>
                <div style={DOCTOR_INLINE.fieldFlex}><div style={DOCTOR_INLINE.fieldLabel}>{DOCTOR_TEXT.LABEL_PATIENT_ID}</div><div style={DOCTOR_INLINE.fieldValue}>{details.patientId || '—'}</div></div>
                <div style={DOCTOR_INLINE.fieldFlex}><div style={DOCTOR_INLINE.fieldLabel}>{DOCTOR_TEXT.LABEL_DOB}</div><div>{details.dateOfBirth || details.dob || '—'}</div></div>
              </div>
              <div style={DOCTOR_INLINE.fieldMb}><div style={DOCTOR_INLINE.fieldLabel}>{DOCTOR_TEXT.LABEL_EMAIL}</div><div>{details.email || details.patientEmail || '—'}</div></div>
              <div style={DOCTOR_INLINE.fieldMb}><div style={DOCTOR_INLINE.fieldLabel}>{DOCTOR_TEXT.LABEL_PHONE}</div><div>{details.phone || details.patientPhoneNumber || '—'}</div></div>
              <div style={DOCTOR_INLINE.fieldMb}><div style={DOCTOR_INLINE.fieldLabel}>{DOCTOR_TEXT.LABEL_GENDER}</div><div>{details.gender || '—'}</div></div>
              <div style={DOCTOR_INLINE.sectionDivider}>
                <div style={DOCTOR_INLINE.sectionTitle}>{DOCTOR_TEXT.LABEL_APPT_DETAILS}</div>
                <div style={DOCTOR_INLINE.fieldMb}><div style={DOCTOR_INLINE.fieldLabel}>{DOCTOR_TEXT.LABEL_APPT_DATE_TIME}</div><div>{appointment?.appointmentDate || '—'} • {appointment?.startTime || '—'} - {appointment?.endTime || '—'}</div></div>
                {appointment?.reasonForVisit && <div style={DOCTOR_INLINE.fieldMb}><div style={DOCTOR_INLINE.fieldLabel}>{DOCTOR_TEXT.LABEL_REASON_FOR_VISIT}</div><div style={DOCTOR_INLINE.reasonValue}>{appointment.reasonForVisit}</div></div>}
                {appointment?.notes && <div style={DOCTOR_INLINE.fieldMb}><div style={DOCTOR_INLINE.fieldLabel}>{DOCTOR_TEXT.LABEL_ADDITIONAL_NOTES}</div><div>{appointment.notes}</div></div>}
              </div>
              <div style={DOCTOR_INLINE.sectionDivider}>
                <div style={DOCTOR_INLINE.sectionTitle}>{DOCTOR_TEXT.LABEL_ADDRESS}</div>
                <div style={{ fontSize: 14 }}>
                  <div>{details.patientAddress ? `${details.patientAddress.doorNumber || ''}${details.patientAddress.landmark ? ', ' + details.patientAddress.landmark : ''}` : details.address || '—'}</div>
                  <div>{details.patientAddress?.city    || details.city    || '—'}</div>
                  <div>{details.patientAddress?.state   || details.state   || '—'}</div>
                  <div>{details.patientAddress?.country || details.country || '—'}</div>
                  <div>{details.patientAddress?.pinCode || details.pinCode || '—'}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── DiagnosisModal ────────────────────────────────────────────────────────────
function DiagnosisModal({ appointment, onClose, onSuccess }) {
  const [form, setForm]       = useState(EMPTY_DIAGNOSIS)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  if (!appointment) return null

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await api.submitDiagnosis(getApptId(appointment), form)
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || DOCTOR_TEXT.ERR_DIAGNOSIS_FAILED)
    } finally { setLoading(false) }
  }

  return (
    <div className={DOCTOR_STYLES.modalBackdrop} style={DOCTOR_INLINE.diagnosisBackdrop}>
      <div className={DOCTOR_STYLES.modalDialogLg}>
        <div className={DOCTOR_STYLES.modalContent}>
          <div className={DOCTOR_STYLES.modalHeaderPrimary}>
            <h5 className={DOCTOR_STYLES.modalTitle}>{DOCTOR_TEXT.MODAL_DIAGNOSIS_TITLE} {appointment.patientName}</h5>
            <button className={DOCTOR_STYLES.btnCloseWhite} onClick={onClose} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className={DOCTOR_STYLES.modalBody}>
              {error && <div className={DOCTOR_STYLES.alertDanger}>{error}</div>}
              {DIAGNOSIS_FIELDS.map(field => (
                <div key={field.name} className={DOCTOR_STYLES.mb3}>
                  <label className={DOCTOR_STYLES.formLabelBold}>{DOCTOR_TEXT[field.label]}</label>
                  {field.type === 'textarea' ? (
                    <textarea className={DOCTOR_STYLES.formControl} name={field.name} value={form[field.name]} onChange={handleChange} rows={field.rows} required={field.required} placeholder={DOCTOR_TEXT[field.placeholder]} />
                  ) : (
                    <input type="text" className={DOCTOR_STYLES.formControl} name={field.name} value={form[field.name]} onChange={handleChange} required={field.required} placeholder={DOCTOR_TEXT[field.placeholder]} />
                  )}
                </div>
              ))}
            </div>
            <div className={DOCTOR_STYLES.modalFooter}>
              <button type="button" className={DOCTOR_STYLES.btnSecondary} onClick={onClose}>{DOCTOR_TEXT.BTN_CANCEL}</button>
              <button type="submit" className={DOCTOR_STYLES.btnPrimary} disabled={loading}>
                {loading ? DOCTOR_TEXT.BTN_SUBMITTING : DOCTOR_TEXT.BTN_SUBMIT_DIAGNOSIS}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// ── RescheduleModal ───────────────────────────────────────────────────────────
function RescheduleModal({ appointment, onClose, onSuccess }) {
  const [form, setForm]                   = useState({ appointmentDate: appointment?.appointmentDate || '', startTime: appointment?.startTime || '', endTime: appointment?.endTime || '', notes: appointment?.notes || '' })
  const [loading, setLoading]             = useState(false)
  const [error, setError]                 = useState('')
  const [unavailableDates, setUnavailable] = useState([])
  const [loadingAvail, setLoadingAvail]   = useState(false)
  const [checkingAvail, setCheckingAvail] = useState(false)
  const [availMsg, setAvailMsg]           = useState('')

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    if (appointment?.doctorId) loadUnavail(appointment.doctorId)
  }, [appointment?.doctorId])

  useEffect(() => {
    if (appointment?.doctorId && form.appointmentDate) checkAvail(appointment.doctorId, form.appointmentDate)
    else setAvailMsg('')
  }, [form.appointmentDate, appointment?.doctorId])

  async function loadUnavail(doctorId) {
    setLoadingAvail(true)
    try {
      const r = await api.getDoctorUnavailableDates(doctorId)
      setUnavailable(r.success && Array.isArray(r.data) ? r.data : [])
    } catch { setUnavailable([]) }
    finally { setLoadingAvail(false) }
  }

  async function checkAvail(doctorId, date) {
    setCheckingAvail(true); setAvailMsg('')
    try {
      const r = await api.isDoctorAvailable(doctorId, date)
      if (r.success) {
        if (r.data === true) setAvailMsg(DOCTOR_TEXT.MSG_DOCTOR_AVAILABLE)
        else { setAvailMsg(DOCTOR_TEXT.MSG_DOCTOR_UNAVAILABLE); setError(DOCTOR_TEXT.ERR_DOCTOR_UNAVAILABLE) }
      }
    } catch { /* silent */ }
    finally { setCheckingAvail(false) }
  }

  const isUnavailable = date => unavailableDates.includes(date)

  const handleChange = e => { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })); setError('') }

  const validate = () => {
    if (!form.appointmentDate) { setError(DOCTOR_TEXT.ERR_SELECT_DATE);  return false }
    if (!form.startTime)       { setError(DOCTOR_TEXT.ERR_SELECT_START); return false }
    if (!form.endTime)         { setError(DOCTOR_TEXT.ERR_SELECT_END);   return false }
    if (form.startTime >= form.endTime) { setError(DOCTOR_TEXT.ERR_TIME_ORDER); return false }
    return true
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validate()) return
    if (isUnavailable(form.appointmentDate)) { setError(DOCTOR_TEXT.ERR_DOCTOR_UNAVAIL_FINAL); return }
    setLoading(true)
    try {
      const r = await api.rescheduleAppointment(getApptId(appointment), form)
      setLoading(false)
      if (r?.success) { onSuccess?.(r.data); onClose?.() }
      else setError(r?.message || DOCTOR_TEXT.ERR_RESCHEDULE_FAILED)
    } catch (err) { setLoading(false); setError(err.message || DOCTOR_TEXT.ERR_RESCHEDULE_FAILED) }
  }

  return (
    <div style={DOCTOR_INLINE.fixedContainer}>
      <div role="dialog" aria-modal="false" onClick={e => e.stopPropagation()} style={DOCTOR_INLINE.modalCard}>
        <div style={DOCTOR_INLINE.modalHeaderSm}>
          <h5 className={DOCTOR_STYLES.mb0}>{DOCTOR_TEXT.MODAL_RESCHEDULE_TITLE}</h5>
          <button className={DOCTOR_STYLES.btnClose} onClick={onClose} disabled={loading} />
        </div>
        <div style={DOCTOR_INLINE.modalBodySm}>
          {error && <div className={DOCTOR_STYLES.alertDanger}>{error}</div>}
          <div className={`${DOCTOR_STYLES.mb3} p-3 bg-light rounded`}>
            <p className="mb-1"><strong>{DOCTOR_TEXT.LABEL_PATIENT}</strong> {appointment?.patientName || DOCTOR_TEXT.MSG_PATIENT_FALLBACK}</p>
            <p className="mb-1"><strong>{DOCTOR_TEXT.LABEL_DOCTOR}</strong>  {appointment?.doctorName  || DOCTOR_TEXT.MSG_PATIENT_FALLBACK}</p>
            <p className="mb-0"><strong>{DOCTOR_TEXT.LABEL_CURRENT_APPT}</strong> {formatDateWithDay(appointment?.appointmentDate)} at {appointment?.startTime} - {appointment?.endTime}</p>
          </div>
          {loadingAvail && <div className={DOCTOR_STYLES.alertInfo}><span className={DOCTOR_STYLES.spinnerSm} />{DOCTOR_TEXT.MSG_LOADING_AVAILABILITY}</div>}
          {!loadingAvail && unavailableDates.length > 0 && (
            <div className={`${DOCTOR_STYLES.alertWarning} mb-3`}>
              <strong>{DOCTOR_TEXT.MSG_DOCTOR_UNAVAIL_DATES}</strong>
              <div className={`${DOCTOR_STYLES.flexWrapGap} mt-2`}>
                {unavailableDates.slice(0, 10).map(d => <span key={d} className={DOCTOR_STYLES.badgeDanger}>{formatDateWithDay(d)}</span>)}
                {unavailableDates.length > 10 && <span className={DOCTOR_STYLES.badgeSecondary}>{DOCTOR_TEXT.MSG_MORE_DATES.replace('{n}', unavailableDates.length - 10)}</span>}
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className={DOCTOR_STYLES.mb3}>
              <label className={DOCTOR_STYLES.formLabel}>{DOCTOR_TEXT.LABEL_NEW_APPT_DATE}</label>
              <input type="date" className={isUnavailable(form.appointmentDate) ? DOCTOR_STYLES.inputInvalid : DOCTOR_STYLES.formControl} name="appointmentDate" value={form.appointmentDate} onChange={handleChange} disabled={loading} min={getTodayISO()} />
              {checkingAvail && <small className={DOCTOR_STYLES.formText}><span className={DOCTOR_STYLES.spinnerSm} />{DOCTOR_TEXT.MSG_CHECKING_AVAILABILITY}</small>}
              {availMsg && !checkingAvail && <small className={availMsg.startsWith('✓') ? DOCTOR_STYLES.formTextSuccess : DOCTOR_STYLES.formTextDanger}>{availMsg}</small>}
              {isUnavailable(form.appointmentDate) && <div className={DOCTOR_STYLES.invalidFeedback}>{DOCTOR_TEXT.ERR_DOCTOR_UNAVAIL_FINAL}</div>}
            </div>
            <div className={DOCTOR_STYLES.row}>
              <div className={DOCTOR_STYLES.colMd6}>
                <label className={DOCTOR_STYLES.formLabel}>{DOCTOR_TEXT.LABEL_START_TIME}</label>
                <input type="time" className={DOCTOR_STYLES.formControl} name="startTime" value={form.startTime} onChange={handleChange} disabled={loading} />
              </div>
              <div className={DOCTOR_STYLES.colMd6}>
                <label className={DOCTOR_STYLES.formLabel}>{DOCTOR_TEXT.LABEL_END_TIME}</label>
                <input type="time" className={DOCTOR_STYLES.formControl} name="endTime" value={form.endTime} onChange={handleChange} disabled={loading} />
              </div>
            </div>
            <div className={DOCTOR_STYLES.mb3}>
              <label className={DOCTOR_STYLES.formLabel}>{DOCTOR_TEXT.LABEL_NOTES_OPTIONAL}</label>
              <textarea className={DOCTOR_STYLES.formControl} name="notes" value={form.notes} onChange={handleChange} rows="3" placeholder={DOCTOR_TEXT.PH_RESCHEDULE_NOTES} disabled />
            </div>
          </form>
        </div>
        <div style={DOCTOR_INLINE.modalFooter}>
          <button className={DOCTOR_STYLES.btnSecondary} onClick={onClose} disabled={loading}>{DOCTOR_TEXT.BTN_CANCEL}</button>
          <button className={DOCTOR_STYLES.btnPrimary}   onClick={handleSubmit} disabled={loading}>
            {loading ? DOCTOR_TEXT.BTN_RESCHEDULING : DOCTOR_TEXT.BTN_RESCHEDULE_CONFIRM}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── AvailabilityModal ─────────────────────────────────────────────────────────
function AvailabilityModal({ doctorId, doctorName, onClose, onSuccess }) {
  const [activeTab,       setActiveTab]       = useState('unavailable')
  const [selectedDates,   setSelectedDates]   = useState([])
  const [unavailableDates,setUnavailableDates] = useState([])
  const [loading,         setLoading]         = useState(false)
  const [loadingDates,    setLoadingDates]     = useState(true)
  const [error,           setError]           = useState('')
  const [success,         setSuccess]         = useState('')

  useEffect(() => { loadUnavailDates() }, [doctorId])
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function loadUnavailDates() {
    if (!doctorId) return
    setLoadingDates(true)
    try {
      const r = await api.getDoctorUnavailableDates(doctorId)
      setUnavailableDates(r.success && Array.isArray(r.data) ? r.data : [])
    } catch { setUnavailableDates([]) }
    finally { setLoadingDates(false) }
  }

  const handleDateSelect = e => {
    const date = e.target.value
    // Validate date format (yyyy-mm-dd) and ensure it's complete
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!date || !dateRegex.test(date)) {
      console.warn('Invalid date format:', date)
      return
    }
    
    // Validate year is reasonable
    const year = parseInt(date.split('-')[0], 10)
    if (year < 2000 || year > 2100) {
      setError('Please enter a valid year (2000-2100)')
      return
    }
    
    // Check if date is valid
    const dateObj = new Date(date + 'T00:00:00')
    if (isNaN(dateObj.getTime())) {
      setError('Invalid date selected')
      return
    }
    
    if (!selectedDates.includes(date)) { 
      setSelectedDates(prev => [...prev, date])
      setError('')
      setSuccess('')
      e.target.value = '' 
    }
  }

  const handleClickUnavail = date => {
    if (!selectedDates.includes(date)) { setSelectedDates(prev => [...prev, date]); setError(''); setSuccess('') }
  }

  const removeDate = date => setSelectedDates(prev => prev.filter(d => d !== date))

  const handleTabChange = tab => { setActiveTab(tab); setSelectedDates([]); setError(''); setSuccess('') }

  const handleSubmit = async e => {
    e.preventDefault()
    if (selectedDates.length === 0) { setError(DOCTOR_TEXT.MSG_SELECT_DATE); return }
    setLoading(true); setError(''); setSuccess('')
    try {
      const r = activeTab === 'available'
        ? await api.markDoctorAvailable(doctorId, selectedDates)
        : await api.markDoctorUnavailable(doctorId, selectedDates)
      if (r.success) {
        setSuccess(DOCTOR_TEXT.MSG_AVAIL_SUCCESS.replace('{action}', activeTab).replace('{count}', selectedDates.length))
        setSelectedDates([])
        await loadUnavailDates()
        onSuccess?.()
        setTimeout(() => onClose?.(), 1500)
      } else {
        setError(r.message || DOCTOR_TEXT.ERR_MARK_FAILED)
      }
    } catch (err) { setError(err.message || DOCTOR_TEXT.ERR_MARK_FAILED) }
    finally { setLoading(false) }
  }

  const isAvailTab = activeTab === 'available'

  return (
    <div style={DOCTOR_INLINE.fixedContainer}>
      <div role="dialog" aria-modal="true" onClick={e => e.stopPropagation()} style={DOCTOR_INLINE.modalCard}>
        <div style={DOCTOR_INLINE.modalHeader}>
          <h5 className={DOCTOR_STYLES.mb0}>{DOCTOR_TEXT.MODAL_AVAILABILITY_TITLE}</h5>
          <button className={DOCTOR_STYLES.btnClose} onClick={onClose} disabled={loading} aria-label={DOCTOR_TEXT.BTN_CLOSE} />
        </div>
        <div style={DOCTOR_INLINE.modalBody}>
          {error   && <div className={`${DOCTOR_STYLES.alertDanger}  alert-dismissible fade show`}>{error}   <button className={DOCTOR_STYLES.btnClose} onClick={() => setError('')}   /></div>}
          {success && <div className={`${DOCTOR_STYLES.alertSuccess} alert-dismissible fade show`}>{success} <button className={DOCTOR_STYLES.btnClose} onClick={() => setSuccess('')} /></div>}

          <div className={`${DOCTOR_STYLES.mb3} ${DOCTOR_STYLES.bgLightBorder}`}>
            <div className="d-flex justify-content-between align-items-center">
              <div><strong>{DOCTOR_TEXT.LABEL_DOCTOR_INFO}</strong> {doctorName}</div>
              {!loadingDates && <div className={DOCTOR_STYLES.badgeInfo}>{unavailableDates.length} {DOCTOR_TEXT.LABEL_UNAVAILABLE_COUNT}</div>}
            </div>
          </div>

          <ul className={DOCTOR_STYLES.navTabs}>
            <li className={DOCTOR_STYLES.navItem}>
              <button className={activeTab === 'unavailable' ? DOCTOR_STYLES.navLinkActive : DOCTOR_STYLES.navLink} onClick={() => handleTabChange('unavailable')} disabled={loading}>{DOCTOR_TEXT.TAB_MARK_UNAVAILABLE}</button>
            </li>
            <li className={DOCTOR_STYLES.navItem}>
              <button className={activeTab === 'available' ? DOCTOR_STYLES.navLinkActive : DOCTOR_STYLES.navLink} onClick={() => handleTabChange('available')} disabled={loading}>{DOCTOR_TEXT.TAB_MARK_AVAILABLE}</button>
            </li>
          </ul>

          <form onSubmit={handleSubmit}>
            <div className={DOCTOR_STYLES.mb3}>
              <label className={DOCTOR_STYLES.formLabelBold}>{isAvailTab ? DOCTOR_TEXT.LABEL_SELECT_AVAILABLE : DOCTOR_TEXT.LABEL_SELECT_UNAVAILABLE}</label>
              <input type="date" className={DOCTOR_STYLES.formControl} onChange={handleDateSelect} disabled={loading} min={getTodayISO()} />
              <small className={DOCTOR_STYLES.formText}>{isAvailTab ? DOCTOR_TEXT.MSG_REMOVE_HINT : DOCTOR_TEXT.MSG_BLOCK_HINT}</small>
            </div>

            {selectedDates.length > 0 && (
              <div className={DOCTOR_STYLES.mb3}>
                <label className={DOCTOR_STYLES.formLabelBold}>{DOCTOR_TEXT.LABEL_SELECTED_DATES} ({selectedDates.length})</label>
                <div className={DOCTOR_STYLES.flexWrapGap}>
                  {selectedDates.map(date => (
                    <div key={date} className={`badge ${isAvailTab ? 'bg-success' : 'bg-danger'} d-flex align-items-center gap-2`} style={DOCTOR_INLINE.dateBadge}>
                      <span>{formatDateWithDay(date)}</span>
                      <button type="button" className={DOCTOR_STYLES.btnCloseWhite} onClick={() => removeDate(date)} disabled={loading} style={DOCTOR_INLINE.removeBtnStyle} aria-label={DOCTOR_TEXT.BTN_CLOSE} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isAvailTab && (
              <div className={DOCTOR_STYLES.mb3}>
                <label className={DOCTOR_STYLES.formLabelBold}>
                  {DOCTOR_TEXT.LABEL_UNAVAILABLE_DATES}
                  {loadingDates && <span className={`${DOCTOR_STYLES.spinnerSm} ms-2`} />}
                </label>
                {!loadingDates && unavailableDates.length === 0
                  ? <div className={`${DOCTOR_STYLES.alertInfo} mb-0`}>{DOCTOR_TEXT.MSG_NO_UNAVAILABLE}</div>
                  : (
                    <>
                      <div className={DOCTOR_STYLES.flexWrapGap}>
                        {unavailableDates.map(date => {
                          const isSel = selectedDates.includes(date)
                          return (
                            <div key={date} className={`badge ${isSel ? 'bg-success' : 'bg-secondary'}`} style={DOCTOR_INLINE.dateBadgeSm} onClick={() => handleClickUnavail(date)} title={isSel ? DOCTOR_TEXT.MSG_PATIENT_FALLBACK : DOCTOR_TEXT.MSG_CLICK_TO_MARK}>
                              {formatDateWithDay(date)}
                            </div>
                          )
                        })}
                      </div>
                      <small className={DOCTOR_STYLES.mt2}>{DOCTOR_TEXT.MSG_CLICK_TO_MARK}</small>
                    </>
                  )
                }
              </div>
            )}

            <div className="d-flex gap-2 mt-4">
              <button type="submit" className={isAvailTab ? DOCTOR_STYLES.btnSuccess : DOCTOR_STYLES.btnDanger} disabled={loading || selectedDates.length === 0}>
                {loading ? <><span className={DOCTOR_STYLES.spinnerSm} />{DOCTOR_TEXT.BTN_UPDATING}</> : (isAvailTab ? DOCTOR_TEXT.BTN_MARK_AVAILABLE : DOCTOR_TEXT.BTN_MARK_UNAVAILABLE)}
              </button>
              <button type="button" className={DOCTOR_STYLES.btnSecondary} onClick={onClose} disabled={loading}>{DOCTOR_TEXT.BTN_CANCEL}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// ── Main DoctorDashboard ──────────────────────────────────────────────────────
export default function DoctorDashboard() {
  const { user } = useAuth()

  const [appointments,    setAppointments]    = useState([])
  const [loading,         setLoading]         = useState(true)
  const [error,           setError]           = useState('')
  const [selectedDate,    setSelectedDate]    = useState(getTodayISO())
  const [successMessage,  setSuccessMessage]  = useState('')
  const [cancelConfirm,   setCancelConfirm]   = useState(null)
  const [selectedAppt,    setSelectedAppt]    = useState(null)

  const [showReschedule,  setShowReschedule]  = useState(false)
  const [showPatient,     setShowPatient]     = useState(false)
  const [showAvailability,setShowAvailability]= useState(false)
  const [showDiagnosis,   setShowDiagnosis]   = useState(false)
  const [showReason,      setShowReason]      = useState(false)

  useEffect(() => { loadAppointments() }, [selectedDate, user])

  async function loadAppointments() {
    if (!user?.username) { setLoading(false); return }
    try {
      setLoading(true); setError('')
      const resp = await api.getAppointmentsForDoctor(user.username, selectedDate)
      if (resp?.success && Array.isArray(resp.data)) setAppointments(resp.data)
      else if (Array.isArray(resp)) setAppointments(resp)
      else setAppointments([])
    } catch (err) {
      if (err.response?.status !== 404) setError(err.message || DOCTOR_TEXT.ERR_LOAD_APPTS)
      setAppointments([])
    } finally { setLoading(false) }
  }

  function flash(msg) { setSuccessMessage(msg); setTimeout(() => setSuccessMessage(''), 3000) }

  function openReason(a)     { setSelectedAppt(a); setShowReason(true)      }
  function openPatient(a)    { setSelectedAppt(a); setShowPatient(true)     }
  function openReschedule(a) { setSelectedAppt(a); setShowReschedule(true)  }
  function openDiagnosis(a)  { setSelectedAppt(a); setShowDiagnosis(true)   }

  function closeReason()     { setShowReason(false);     setSelectedAppt(null) }
  function closePatient()    { setShowPatient(false);    setSelectedAppt(null) }
  function closeReschedule() { setShowReschedule(false); setSelectedAppt(null) }
  function closeDiagnosis()  { setShowDiagnosis(false);  setSelectedAppt(null) }

  async function cancelAppointment(id) {
    try {
      const resp = await api.cancelAppointment(id)
      if (resp?.success) {
        setAppointments(prev => prev.filter(a => getApptId(a) !== id))
        setCancelConfirm(null)
        flash(DOCTOR_TEXT.MSG_CANCEL_SUCCESS)
        loadAppointments()
      }
    } catch (err) { setError(err.message || DOCTOR_TEXT.ERR_CANCEL_FAILED) }
  }

  function handleRescheduleSuccess() {
    loadAppointments(); closeReschedule(); flash(DOCTOR_TEXT.MSG_RESCHEDULE_SUCCESS)
  }

  function handleDiagnosisSuccess() {
    closeDiagnosis(); flash(DOCTOR_TEXT.MSG_DIAGNOSIS_SUCCESS); loadAppointments()
  }

  function handleAvailabilitySuccess() {
    flash(DOCTOR_TEXT.MSG_AVAIL_UPDATE_SUCCESS)
  }

  return (
    <div className={DOCTOR_STYLES.page}>

      {/* Header */}
      <div className={DOCTOR_STYLES.headerBar}>
        <div className={DOCTOR_STYLES.headerInner}>
          <div>
            <h3 className={DOCTOR_STYLES.mb0}>{DOCTOR_TEXT.TITLE}</h3>
            {user && <small className="text-muted">{DOCTOR_TEXT.SIGNED_IN_AS} {user.username}</small>}
          </div>
          <div className={DOCTOR_STYLES.headerActions}>
            <button className={DOCTOR_STYLES.btnOutlinePrimary}   onClick={() => setSelectedDate(getTodayISO())}>{DOCTOR_TEXT.BTN_TODAY}</button>
            <button className={DOCTOR_STYLES.btnPrimary}          onClick={() => setShowAvailability(true)}>{DOCTOR_TEXT.BTN_MANAGE_AVAILABILITY}</button>
            <button className={DOCTOR_STYLES.btnOutlineSecondary} onClick={loadAppointments}>{DOCTOR_TEXT.BTN_REFRESH}</button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={DOCTOR_STYLES.content}>
        {error          && <div className={DOCTOR_STYLES.alertDanger}>{error}</div>}
        {successMessage && <div className={DOCTOR_STYLES.alertSuccess}>{successMessage}</div>}

        <div className={DOCTOR_STYLES.dateRow}>
          <label className={DOCTOR_STYLES.dateLabel}>{DOCTOR_TEXT.LABEL_SELECT_DATE}</label>
          <input type="date" className={DOCTOR_STYLES.dateInput} style={DOCTOR_INLINE.dateMaxWidth} value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
          <span className="text-muted">{formatDateWithDay(selectedDate)}</span>
        </div>

        <div className={DOCTOR_STYLES.card}>
          <div className={DOCTOR_STYLES.cardBody}>
            <h5>{DOCTOR_TEXT.LABEL_APPOINTMENTS_FOR} {formatDateWithDay(selectedDate)}</h5>
            <DoctorAppointmentsTable
              appointments={appointments}
              loading={loading}
              selectedDate={selectedDate}
              onViewReason={openReason}
              onViewPatient={openPatient}
              onReschedule={openReschedule}
              onCancelConfirm={setCancelConfirm}
              onDiagnose={openDiagnosis}
              formatDate={formatDateWithDay}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showReason      && <ReasonModal      appointment={selectedAppt} onClose={closeReason} />}
      {showPatient     && <PatientModal     appointment={selectedAppt} onClose={closePatient} />}
      {showReschedule  && <RescheduleModal  appointment={selectedAppt} onClose={closeReschedule} onSuccess={handleRescheduleSuccess} />}
      {showDiagnosis   && <DiagnosisModal   appointment={selectedAppt} onClose={closeDiagnosis}  onSuccess={handleDiagnosisSuccess} />}
      {showAvailability && (
        <AvailabilityModal
          doctorId={user?.staffId || user?.username}
          doctorName={user?.username || 'Doctor'}
          onClose={() => setShowAvailability(false)}
          onSuccess={handleAvailabilitySuccess}
        />
      )}

      {/* Cancel Confirmation */}
      {cancelConfirm && (
        <div className={DOCTOR_STYLES.modalBackdrop} style={DOCTOR_INLINE.cancelBackdrop}>
          <div className={DOCTOR_STYLES.modalDialog}>
            <div className={DOCTOR_STYLES.modalContent}>
              <div className={DOCTOR_STYLES.modalHeader}>
                <h5 className={DOCTOR_STYLES.modalTitle}>{DOCTOR_TEXT.MODAL_CANCEL_TITLE}</h5>
                <button className={DOCTOR_STYLES.btnClose} onClick={() => setCancelConfirm(null)} />
              </div>
              <div className={DOCTOR_STYLES.modalBody}>{DOCTOR_TEXT.MODAL_CANCEL_BODY}</div>
              <div className={DOCTOR_STYLES.modalFooter}>
                <button className={DOCTOR_STYLES.btnSecondary} onClick={() => setCancelConfirm(null)}>{DOCTOR_TEXT.BTN_NO_KEEP}</button>
                <button className={DOCTOR_STYLES.btnDanger}    onClick={() => cancelAppointment(cancelConfirm)}>{DOCTOR_TEXT.BTN_YES_CANCEL}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
