import React from 'react'

export default function AppointmentList({
  appointments = [],
  loading = false,
  onReschedule,
  onCancel,
  onView,
  onViewReason,
  onGenerateDietPlan,
  emptyMessage = 'No appointments for this date.'
}) {
  if (loading) {
    return <div className="alert alert-info">Loading appointments...</div>
  }

  if (!Array.isArray(appointments) || appointments.length === 0) {
    return <div className="alert alert-warning">{emptyMessage}</div>
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Time</th>
            <th>Patient</th>
            <th>Patient ID</th>
            <th>Doctor</th>
            <th>Doctor ID</th>
            <th>Notes</th>
            <th>Status</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => {
            const isCancelled = a.status === 'Cancelled' || a.status === 'CANCELLED'
            return (
            <tr key={a.appointmentId || a.id} className={isCancelled ? 'table-secondary' : ''} style={isCancelled ? { opacity: 0.7 } : {}}>
              <td>
                {a.appointmentDate ? (
                  <div>
                    <div>{a.appointmentDate}</div>
                    <div className="text-muted" style={{ fontSize: 12 }}>{a.startTime ? `${a.startTime} - ${a.endTime}` : ''}</div>
                  </div>
                ) : (a.time || (a.from || ''))}
              </td>
              <td>{a.patientName || a.patient || 'N/A'}</td>
              <td>{a.patientId || a.patientId === 0 ? a.patientId : 'N/A'}</td>
              <td>{a.doctorName || a.doctor || 'N/A'}</td>
              <td>{a.doctorId || 'N/A'}</td>
              <td>{a.notes || a.reason || '-'}</td>
              <td>
                <span className={`badge ${
                  a.status === 'Scheduled' || a.status === 'Booked' ? 'bg-success' : 
                  a.status === 'Cancelled' || a.status === 'CANCELLED' ? 'bg-danger' : 
                  a.status === 'Completed' ? 'bg-info' : 
                  a.status === 'DIAGNOSED' ? 'bg-primary' :
                  'bg-warning'
                }`}>
                  {a.status || 'Scheduled'}
                </span>
              </td>
              <td className="text-end">
                <div className="d-flex gap-2 justify-content-end flex-wrap">
                  {typeof onViewReason === 'function' && (
                    <button 
                      className="btn btn-sm btn-primary" 
                      onClick={() => onViewReason(a)}
                      title="View reason for visit"
                    >
                      View Reason
                    </button>
                  )}
                  {typeof onGenerateDietPlan === 'function' && (
                    <button 
                      className={`btn btn-sm ${a.dietPlan ? 'btn-success' : 'btn-outline-success'}`}
                      onClick={() => onGenerateDietPlan(a)}
                      disabled={a.status !== 'DIAGNOSED'}
                      title={a.status !== 'DIAGNOSED' ? "Diagnosis needed" : "Generate AI Diet Plan"}
                    >
                      <i className={`bi ${a.dietPlan ? 'bi-eye' : 'bi-magic'} me-1`}></i>
                      {a.dietPlan ? 'View Diet' : 'AI Diet'}
                    </button>
                  )}
                  {typeof onView === 'function' && (
                    <button 
                      className="btn btn-sm btn-info" 
                      onClick={() => onView(a)}
                      disabled={isCancelled}
                    >
                      View Patient
                    </button>
                  )}
                  {typeof onReschedule === 'function' && (
                    <button 
                      className="btn btn-sm btn-warning" 
                      onClick={() => onReschedule(a)}
                      disabled={isCancelled}
                    >
                      Reschedule
                    </button>
                  )}
                  {typeof onCancel === 'function' && (
                    <button 
                      className="btn btn-sm btn-danger" 
                      onClick={() => onCancel(a.appointmentId || a.id)}
                      disabled={isCancelled}
                    >
                      {isCancelled ? 'Cancelled' : 'Cancel'}
                    </button>
                  )}
                </div>
              </td>
            </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
