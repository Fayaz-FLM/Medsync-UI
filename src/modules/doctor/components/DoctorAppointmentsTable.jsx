import { DOCTOR_TEXT, DOCTOR_STYLES, DOCTOR_INLINE } from '../constants/doctorConstants'

export default function DoctorAppointmentsTable({ appointments, loading, selectedDate, onViewReason, onViewPatient, onReschedule, onCancelConfirm, onDiagnose, formatDate }) {
  if (loading) return <div className={DOCTOR_STYLES.alertInfo}>{DOCTOR_TEXT.MSG_LOADING_APPTS}</div>
  if (appointments.length === 0) return <div className={DOCTOR_STYLES.alertWarning}>{DOCTOR_TEXT.MSG_NO_APPTS}</div>

  return (
    <>
      {/* Desktop Table View */}
      <div className="d-none d-md-block">
        <div className={DOCTOR_STYLES.tableWrapper}>
          <table className={DOCTOR_STYLES.table}>
            <thead>
              <tr>
                <th>{DOCTOR_TEXT.TH_TIME}</th>
                <th>{DOCTOR_TEXT.TH_PATIENT}</th>
                <th>{DOCTOR_TEXT.TH_ID}</th>
                <th>{DOCTOR_TEXT.TH_NOTES}</th>
                <th>{DOCTOR_TEXT.TH_STATUS}</th>
                <th className={DOCTOR_STYLES.thEnd}>{DOCTOR_TEXT.TH_ACTIONS}</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(a => (
                <tr key={a.appointmentId || a.id}>
                  <td>{a.startTime} - {a.endTime}</td>
                  <td>{a.patientName || DOCTOR_TEXT.MSG_PATIENT_FALLBACK}</td>
                  <td>{a.patientId  || DOCTOR_TEXT.MSG_PATIENT_FALLBACK}</td>
                  <td>{a.notes      || '-'}</td>
                  <td><span className={DOCTOR_STYLES.badgeSuccess}>{a.status}</span></td>
                  <td className={DOCTOR_STYLES.tdEnd}>
                    <button className={DOCTOR_STYLES.btnSmPrimary}  onClick={() => onViewReason(a)}>
                      {DOCTOR_TEXT.BTN_VIEW_REASON}
                    </button>
                    <button className={DOCTOR_STYLES.btnSmInfo}     onClick={() => onViewPatient(a)}>
                      {DOCTOR_TEXT.BTN_VIEW_PATIENT}
                    </button>
                    <button className={DOCTOR_STYLES.btnSmWarning}  onClick={() => onReschedule(a)}>
                      {DOCTOR_TEXT.BTN_RESCHEDULE}
                    </button>
                    <button className={DOCTOR_STYLES.btnSmDanger}   onClick={() => onCancelConfirm(a.appointmentId || a.id)}>
                      {DOCTOR_TEXT.BTN_CANCEL_APPT}
                    </button>
                    {a.status !== 'DIAGNOSED' && (
                      <button className={DOCTOR_STYLES.btnSmSuccess} onClick={() => onDiagnose(a)}>
                        {DOCTOR_TEXT.BTN_DIAGNOSE}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="d-md-none">
        {appointments.map(a => {
          const initials = (a.patientName || 'P').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
          return (
            <div key={a.appointmentId || a.id} style={DOCTOR_INLINE.mobileCard}>
              {/* Header */}
              <div style={DOCTOR_INLINE.mobileCardHeader}>
                <div style={DOCTOR_INLINE.mobileInitials}>{initials}</div>
                <div style={DOCTOR_INLINE.mobileCardTitle}>
                  <div style={DOCTOR_INLINE.mobilePatientName}>{a.patientName || DOCTOR_TEXT.MSG_PATIENT_FALLBACK}</div>
                  <div style={DOCTOR_INLINE.mobilePatientId}>Patient ID: {a.patientId || DOCTOR_TEXT.MSG_PATIENT_FALLBACK}</div>
                </div>
              </div>

              {/* Body */}
              <div style={DOCTOR_INLINE.mobileCardBody}>
                <div style={DOCTOR_INLINE.mobileField}>
                  <span style={DOCTOR_INLINE.mobileLabel}>Time:</span> {a.startTime} - {a.endTime}
                </div>
                <div style={DOCTOR_INLINE.mobileField}>
                  <span style={DOCTOR_INLINE.mobileLabel}>Notes:</span> {a.notes || '-'}
                </div>
              </div>

              {/* Actions */}
              <div style={DOCTOR_INLINE.mobileActionsFull}>
                <button style={DOCTOR_INLINE.mobileBtnPrimary} onClick={() => onDiagnose(a)}>
                  {DOCTOR_TEXT.BTN_DIAGNOSE}
                </button>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <button style={DOCTOR_INLINE.mobileBtnInfo} onClick={() => onViewPatient(a)}>
                    View Details
                  </button>
                  <button style={DOCTOR_INLINE.mobileBtnDanger} onClick={() => onCancelConfirm(a.appointmentId || a.id)}>
                    Reason
                  </button>
                </div>
                <button style={DOCTOR_INLINE.mobileManageBtn} onClick={() => onReschedule(a)}>
                  <span>Manage</span>
                  <span style={{ fontSize: '1.2rem' }}>⌄</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
