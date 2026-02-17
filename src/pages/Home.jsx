import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Home() {
  const { user } = useAuth()

  const roles = user ? (Array.isArray(user.roles) ? user.roles : user.role ? [user.role] : []) : []

  // mock data — replace with API calls
  const mockAppointments = [
    { id: 1, time: '09:00', patientId: 101, patient: 'John Doe', status: 'Scheduled' },
    { id: 2, time: '10:30', patientId: 102, patient: 'Jane Smith', status: 'Scheduled' },
  ]

  const mockPatients = [
    { id: 101, name: 'John Doe', bed: 'A-12' },
    { id: 102, name: 'Jane Smith', bed: 'B-05' },
  ]
//LOG IN CHECK

  let userLoggedIn = false; // Change to true to simulate logged-in state
  if (!userLoggedIn) {
    return (
      <Navigate to="/login" replace />
    )
  }

  return (
    <div>
      <h2>Welcome to MedSync</h2>

      <p>
        Signed in as <strong>{user.username}</strong>{' '}
        <small className="text-muted">({roles.join(', ') || 'no role'})</small>
      </p>

      {/* Quick role-based overview */}
      {roles.includes('receptionist') && (
        <>
          <div className="mb-3">
            <h5>Receptionist — Upcoming appointments</h5>
            <div className="list-group mb-2">
              {mockAppointments.map((a) => (
                <div key={a.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{a.time}</strong> — {a.patient} <span className="small text-muted">(# {a.patientId})</span>
                    <div className="small text-muted">{a.status}</div>
                  </div>
                  <div>
                    <Link to="/receptionist" className="btn btn-sm btn-outline-primary">
                      Open
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <h6>Quick patients</h6>
            <div className="list-group mb-2">
              {mockPatients.map((p) => (
                <div key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    {p.name} <div className="small text-muted">Patient ID: {p.id} • Bed: {p.bed}</div>
                  </div>
                  <div>
                    <Link to="/receptionist" className="btn btn-sm btn-outline-secondary">
                      Manage
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link to="/receptionist" className="btn btn-primary">
            Go to Receptionist Dashboard
          </Link>
        </>
      )}

      {roles.includes('doctor') && (
        <>
          <div className="mb-3">
            <h5>Doctor — Today's appointments</h5>
            <div className="list-group mb-2">
              {mockAppointments.map((a) => (
                <div key={a.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{a.time}</strong> — {a.patient} <span className="small text-muted">(# {a.patientId})</span>
                    <div className="small text-muted">{a.status}</div>
                  </div>
                  <div>
                    <Link to="/doctor" className="btn btn-sm btn-outline-primary">
                      Open
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link to="/doctor" className="btn btn-outline-primary">
            Go to Doctor Dashboard
          </Link>
        </>
      )}

      {/* If user has no recognized roles */}
      {!roles.length && (
        <div className="alert alert-warning mt-3">No roles assigned. Contact admin to assign roles.</div>
      )}
    </div>
  )
}