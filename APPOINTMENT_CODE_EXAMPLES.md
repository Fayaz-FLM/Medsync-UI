# Appointment Management - Code Examples

## 1. Using AppointmentBooking Component

### Basic Usage:
```jsx
import React, { useState } from 'react'
import AppointmentBooking from '../components/AppointmentBooking'

function MyComponent() {
  const [showModal, setShowModal] = useState(false)
  const [doctors, setDoctors] = useState([
    { staffId: 'D001', firstName: 'John', lastName: 'Smith', specialization: 'Cardiology' },
    { staffId: 'D002', firstName: 'Jane', lastName: 'Doe', specialization: 'Neurology' }
  ])
  const [patients, setPatients] = useState([
    { patientId: 'P001', patientName: 'Alice Johnson' },
    { patientId: 'P002', patientName: 'Bob Williams' }
  ])

  function handleBookingSuccess(newAppointment) {
    console.log('New appointment created:', newAppointment)
    setShowModal(false)
    // Add to appointments list, refresh data, etc.
  }

  return (
    <div>
      <button 
        className="btn btn-success"
        onClick={() => setShowModal(true)}
      >
        Book Appointment
      </button>

      {showModal && (
        <AppointmentBooking
          onClose={() => setShowModal(false)}
          onSuccess={handleBookingSuccess}
          doctors={doctors}
          patients={patients}
        />
      )}
    </div>
  )
}

export default MyComponent
```

---

## 2. Using AppointmentReschedule Component

### Basic Usage:
```jsx
import React, { useState } from 'react'
import AppointmentReschedule from '../components/AppointmentReschedule'

function MyComponent() {
  const [showModal, setShowModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  const appointment = {
    appointmentId: 'APT001',
    patientId: 'P001',
    patientName: 'Alice Johnson',
    doctorId: 'D001',
    doctorName: 'John Smith',
    appointmentDate: '2026-02-20',
    startTime: '09:00',
    endTime: '09:30',
    notes: 'Regular checkup',
    status: 'Scheduled'
  }

  function handleReschedule(appointment) {
    setSelectedAppointment(appointment)
    setShowModal(true)
  }

  function handleRescheduleSuccess(updatedAppointment) {
    console.log('Appointment rescheduled:', updatedAppointment)
    setShowModal(false)
    // Update appointments list
  }

  return (
    <div>
      <button 
        className="btn btn-warning"
        onClick={() => handleReschedule(appointment)}
      >
        Reschedule
      </button>

      {showModal && selectedAppointment && (
        <AppointmentReschedule
          appointment={selectedAppointment}
          onClose={() => setShowModal(false)}
          onSuccess={handleRescheduleSuccess}
        />
      )}
    </div>
  )
}

export default MyComponent
```

---

## 3. Using PatientDetails Component

### Basic Usage:
```jsx
import React, { useState } from 'react'
import PatientDetails from '../components/PatientDetails'

function MyComponent() {
  const [showModal, setShowModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  const appointment = {
    appointmentId: 'APT001',
    patientId: 'P001',
    patientName: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '555-1234',
    dateOfBirth: '1990-05-15',
    gender: 'Female',
    address: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    country: 'USA',
    pinCode: '62701',
    medicalHistory: 'Hypertension, Diabetes',
    allergies: 'Penicillin',
    currentMedications: 'Lisinopril 10mg',
    doctorName: 'John Smith'
  }

  function handleViewPatient(appointment) {
    setSelectedAppointment(appointment)
    setShowModal(true)
  }

  return (
    <div>
      <button 
        className="btn btn-info"
        onClick={() => handleViewPatient(appointment)}
      >
        View Patient
      </button>

      {showModal && selectedAppointment && (
        <PatientDetails
          appointment={selectedAppointment}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

export default MyComponent
```

---

## 4. Using AppointmentManagement Component

### Basic Usage:
```jsx
import React, { useState, useEffect } from 'react'
import AppointmentManagement from '../components/AppointmentManagement'
import * as api from '../services/api'

function ReceptionistPanel() {
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        // Load doctors from your API
        const doctorsList = await api.getStaff() // adjust based on your API
        setDoctors(doctorsList.filter(s => s.role === 'Doctor'))

        // Load patients from your API
        const patientsList = await api.getPatients()
        setPatients(patientsList)
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <AppointmentManagement
        doctors={doctors}
        patients={patients}
      />
    </div>
  )
}

export default ReceptionistPanel
```

---

## 5. Complete Doctor Dashboard Example

### Full Implementation:
```jsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import * as api from '../services/api'
import AppointmentReschedule from '../components/AppointmentReschedule'
import PatientDetails from '../components/PatientDetails'

export default function DoctorDashboardFull() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [showPatientModal, setShowPatientModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  useEffect(() => {
    loadAppointments()
  }, [selectedDate, user])

  async function loadAppointments() {
    try {
      setLoading(true)
      setError('')
      const data = await api.getAppointmentsForDoctor(user.username, selectedDate)
      setAppointments(data || [])
    } catch (err) {
      setError(err.message || 'Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  function handleViewPatient(appointment) {
    setSelectedAppointment(appointment)
    setShowPatientModal(true)
  }

  function handleRescheduleClick(appointment) {
    setSelectedAppointment(appointment)
    setShowRescheduleModal(true)
  }

  function handleRescheduleSuccess(updated) {
    setAppointments(prev =>
      prev.map(a =>
        a.appointmentId === updated.appointmentId ? updated : a
      )
    )
    setShowRescheduleModal(false)
  }

  async function handleCancelAppointment(appointmentId) {
    try {
      await api.cancelAppointment(appointmentId)
      setAppointments(prev =>
        prev.filter(a => a.appointmentId !== appointmentId)
      )
      alert('Appointment cancelled')
    } catch (err) {
      alert('Failed to cancel: ' + err.message)
    }
  }

  return (
    <div className="p-4">
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <label className="form-label">Select Date:</label>
        <input
          type="date"
          className="form-control"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : appointments.length === 0 ? (
        <div className="alert alert-info">No appointments for this date</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Patient</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(a => (
              <tr key={a.appointmentId}>
                <td>{a.startTime} - {a.endTime}</td>
                <td>{a.patientName}</td>
                <td>{a.notes || '-'}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info me-2"
                    onClick={() => handleViewPatient(a)}
                  >
                    View Patient
                  </button>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleRescheduleClick(a)}
                  >
                    Reschedule
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleCancelAppointment(a.appointmentId)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showRescheduleModal && selectedAppointment && (
        <AppointmentReschedule
          appointment={selectedAppointment}
          onClose={() => setShowRescheduleModal(false)}
          onSuccess={handleRescheduleSuccess}
        />
      )}

      {showPatientModal && selectedAppointment && (
        <PatientDetails
          appointment={selectedAppointment}
          onClose={() => setShowPatientModal(false)}
        />
      )}
    </div>
  )
}
```

---

## 6. API Function Usage Examples

### Book Appointment:
```javascript
import * as api from '../services/api'

async function bookNewAppointment() {
  try {
    const appointment = await api.bookAppointment({
      patientId: 'P001',
      doctorId: 'D001',
      appointmentDate: '2026-02-20',
      startTime: '09:00',
      endTime: '09:30',
      notes: 'Regular checkup'
    })
    console.log('Booked:', appointment)
  } catch (error) {
    console.error('Failed to book:', error)
  }
}
```

### Reschedule Appointment:
```javascript
async function rescheduleAppointment() {
  try {
    const updated = await api.rescheduleAppointment('APT001', {
      appointmentDate: '2026-02-21',
      startTime: '10:00',
      endTime: '10:30',
      notes: 'Rescheduled checkup'
    })
    console.log('Rescheduled:', updated)
  } catch (error) {
    console.error('Failed to reschedule:', error)
  }
}
```

### Cancel Appointment:
```javascript
async function cancelAppointment() {
  try {
    const result = await api.cancelAppointment('APT001')
    console.log('Cancelled:', result)
  } catch (error) {
    console.error('Failed to cancel:', error)
  }
}
```

### Get Appointments for Doctor:
```javascript
async function getDoctorAppointments() {
  try {
    const appointments = await api.getAppointmentsForDoctor('D001', '2026-02-20')
    console.log('Doctor appointments:', appointments)
  } catch (error) {
    console.error('Failed to load:', error)
  }
}
```

### Get All Appointments for Date:
```javascript
async function getAllAppointments() {
  try {
    const appointments = await api.getAppointmentsForAllDoctors('2026-02-20')
    console.log('All appointments:', appointments)
  } catch (error) {
    console.error('Failed to load:', error)
  }
}
```

### Get Appointment Details:
```javascript
async function getDetails() {
  try {
    const details = await api.getAppointmentDetails('APT001')
    console.log('Appointment details:', details)
  } catch (error) {
    console.error('Failed to load:', error)
  }
}
```

### Get Patients Visited by Doctor:
```javascript
async function getPatientsVisited() {
  try {
    const patients = await api.getPatientsVisitedByDoctor(
      'D001',
      '2026-01-01',
      '2026-02-28'
    )
    console.log('Patients visited:', patients)
  } catch (error) {
    console.error('Failed to load:', error)
  }
}
```

---

## 7. Integrating into ReceptionistDashboard

Add this to your ReceptionistDashboard.jsx:

```jsx
// At the top with other imports:
import AppointmentManagement from '../components/AppointmentManagement'

// In your component, add a state for active tab/panel:
const [activePanel, setActivePanel] = useState('patients') // or 'appointments'

// In your JSX, add conditional rendering:
{activePanel === 'appointments' && (
  <AppointmentManagement
    doctors={doctors}
    patients={patients}
  />
)}

// Add button to switch tabs:
<button
  className={`btn ${activePanel === 'appointments' ? 'btn-primary' : 'btn-outline-primary'}`}
  onClick={() => setActivePanel('appointments')}
>
  Manage Appointments
</button>
```

---

## 8. Error Handling Best Practices

```jsx
async function handleAppointmentAction() {
  try {
    setLoading(true)
    setError('')

    // Perform action
    const result = await api.bookAppointment(formData)

    // Success
    setSuccess(true)
    resetForm()
    onSuccess?.(result)

  } catch (error) {
    // Error handling
    const errorMsg = error.response?.data?.message || 
                     error.message || 
                     'An error occurred'
    setError(errorMsg)
    console.error('Action failed:', error)

  } finally {
    setLoading(false)
  }
}
```

---

## 9. Form Validation Example

```jsx
function validateAppointmentForm(formData) {
  const errors = {}

  if (!formData.patientId?.trim()) {
    errors.patientId = 'Patient is required'
  }

  if (!formData.doctorId?.trim()) {
    errors.doctorId = 'Doctor is required'
  }

  if (!formData.appointmentDate) {
    errors.appointmentDate = 'Date is required'
  } else if (new Date(formData.appointmentDate) < new Date()) {
    errors.appointmentDate = 'Date must be in the future'
  }

  if (!formData.startTime) {
    errors.startTime = 'Start time is required'
  }

  if (!formData.endTime) {
    errors.endTime = 'End time is required'
  }

  if (formData.startTime && formData.endTime && 
      formData.startTime >= formData.endTime) {
    errors.endTime = 'End time must be after start time'
  }

  return errors
}

// Usage:
const errors = validateAppointmentForm(formData)
if (Object.keys(errors).length > 0) {
  setErrors(errors)
  return
}
```

---

These code examples should help you implement and use the appointment management features in your application.
