import React from 'react'

export default function AppointmentList({
  appointments = [],
  loading = false,
  onReschedule,
  onCancel,
  onView,
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
          {appointments.map((a) => (
            <tr key={a.appointmentId || a.id}>
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
                  a.status === 'Scheduled' ? 'bg-success' : a.status === 'Cancelled' ? 'bg-danger' : 'bg-warning'
                }`}>
                  {a.status || 'Scheduled'}
                </span>
              </td>
              <td className="text-end">
                {typeof onView === 'function' && (
                  <button className="btn btn-sm btn-info me-2" onClick={() => onView(a)}>View</button>
                )}
                {typeof onReschedule === 'function' && (
                  <button className="btn btn-sm btn-warning me-2" onClick={() => onReschedule(a)}>Reschedule</button>
                )}
                {typeof onCancel === 'function' && (
                  <button className="btn btn-sm btn-danger" onClick={() => onCancel(a.appointmentId || a.id)}>Cancel</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
