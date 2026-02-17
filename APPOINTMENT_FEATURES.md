# Appointment Management Features - MedSync UI

This document describes the appointment management features implemented for both Doctors and Receptionists in the MedSync-UI application.

## Overview

The appointment management system provides complete CRUD operations for managing hospital appointments. It includes:
- **Receptionists**: Book, reschedule, and cancel appointments
- **Doctors**: View appointments, view patient details, reschedule, and cancel appointments

## Components Created

### 1. AppointmentBooking Component
**File**: `src/components/AppointmentBooking.jsx`

A modal component for booking new appointments.

**Features**:
- Select patient from dropdown
- Select doctor from dropdown
- Choose appointment date (with minimum date validation)
- Set start and end times
- Optional notes field
- Form validation before submission
- Error handling and user feedback

**Props**:
```javascript
{
  onClose: function,        // Called when modal is closed
  onSuccess: function,      // Called with new appointment data after successful booking
  doctors: array,           // List of available doctors
  patients: array           // List of available patients
}
```

**Usage**:
```jsx
import AppointmentBooking from '../components/AppointmentBooking'

<AppointmentBooking
  onClose={() => setShowModal(false)}
  onSuccess={(appointment) => handleSuccess(appointment)}
  doctors={doctorsList}
  patients={patientsList}
/>
```

---

### 2. AppointmentReschedule Component
**File**: `src/components/AppointmentReschedule.jsx`

A modal component for rescheduling existing appointments.

**Features**:
- Displays current appointment details
- Change appointment date
- Change start and end times
- Update notes
- Form validation
- Error handling

**Props**:
```javascript
{
  appointment: object,      // Current appointment data
  onClose: function,        // Called when modal is closed
  onSuccess: function       // Called with updated appointment data
}
```

**Appointment Object Structure**:
```javascript
{
  appointmentId: string,
  patientId: string,
  patientName: string,
  doctorId: string,
  doctorName: string,
  appointmentDate: string (YYYY-MM-DD),
  startTime: string (HH:mm),
  endTime: string (HH:mm),
  notes: string,
  status: string
}
```

**Usage**:
```jsx
import AppointmentReschedule from '../components/AppointmentReschedule'

<AppointmentReschedule
  appointment={selectedAppointment}
  onClose={() => setShowModal(false)}
  onSuccess={(updated) => handleSuccess(updated)}
/>
```

---

### 3. PatientDetails Component
**File**: `src/components/PatientDetails.jsx`

A modal component for viewing patient details for a specific appointment.

**Features**:
- Display patient personal information
- Show contact details
- Display address information
- Show medical history
- List allergies
- Display current medications
- Read-only view (for doctors reviewing before appointment)

**Props**:
```javascript
{
  appointment: object,      // Appointment containing patient data
  onClose: function         // Called when modal is closed
}
```

**Usage**:
```jsx
import PatientDetails from '../components/PatientDetails'

<PatientDetails
  appointment={selectedAppointment}
  onClose={() => setShowModal(false)}
/>
```

---

### 4. AppointmentManagement Component
**File**: `src/components/AppointmentManagement.jsx`

A comprehensive appointment management panel for receptionists.

**Features**:
- View all appointments for a selected date
- Book new appointments
- Reschedule appointments
- Cancel appointments
- Search appointments by patient/doctor name or ID
- Filter by date
- Status indicators (Scheduled, Cancelled, etc.)
- Real-time updates

**Props**:
```javascript
{
  doctors: array,           // List of available doctors
  patients: array           // List of available patients
}
```

**Usage**:
```jsx
import AppointmentManagement from '../components/AppointmentManagement'

<AppointmentManagement
  doctors={doctorsList}
  patients={patientsList}
/>
```

---

### 5. Updated DoctorDashboard
**File**: `src/pages/DoctorDashboard.jsx`

Enhanced doctor dashboard with appointment management.

**Features**:
- View appointments for selected date
- Filter appointments by date
- View patient details before appointment
- Reschedule appointments
- Cancel appointments with confirmation
- Refresh appointments
- Status indicators

**User Flow**:
1. Doctor logs in
2. Dashboard displays today's appointments
3. Doctor can:
   - Select a different date to view appointments
   - Click "View Patient" to see patient details
   - Click "Reschedule" to change appointment time
   - Click "Cancel" to cancel the appointment (with confirmation)

---

## API Integration

### Updated API Functions (src/services/api.js)

All appointment functions communicate with the backend at `http://localhost:9000`.

#### bookAppointment(payload)
Books a new appointment.

**Parameters**:
```javascript
{
  patientId: string,
  doctorId: string,
  appointmentDate: string,    // YYYY-MM-DD
  startTime: string,          // HH:mm
  endTime: string,            // HH:mm
  notes: string (optional)
}
```

**Returns**: Appointment object with appointmentId

---

#### rescheduleAppointment(appointmentId, updates)
Reschedules an existing appointment.

**Parameters**:
- `appointmentId`: string
- `updates`: {
    appointmentDate: string,
    startTime: string,
    endTime: string,
    notes: string
  }

**Returns**: Updated appointment object

---

#### cancelAppointment(appointmentId)
Cancels an appointment.

**Parameters**:
- `appointmentId`: string

**Returns**: { success: true }

---

#### getAppointmentDetails(appointmentId)
Fetches detailed information about a specific appointment.

**Parameters**:
- `appointmentId`: string

**Returns**: Appointment object with full details

---

#### getAppointmentsForDoctor(doctorId, date)
Fetches all appointments for a specific doctor on a given date.

**Parameters**:
- `doctorId`: string
- `date`: string (YYYY-MM-DD)

**Returns**: Array of appointment objects

---

#### getAppointmentsForAllDoctors(date)
Fetches all appointments for all doctors on a given date.

**Parameters**:
- `date`: string (YYYY-MM-DD)

**Returns**: Array of appointment objects

---

#### getPatientsVisitedByDoctor(doctorId, startDate, endDate)
Fetches list of patients visited by a doctor in a date range.

**Parameters**:
- `doctorId`: string
- `startDate`: string (YYYY-MM-DD)
- `endDate`: string (YYYY-MM-DD)

**Returns**: Array of patient IDs or patient objects

---

## Integration with ReceptionistDashboard

To integrate the AppointmentManagement component into the ReceptionistDashboard, add:

```jsx
import AppointmentManagement from '../components/AppointmentManagement'

// In your ReceptionistDashboard component:
<AppointmentManagement
  doctors={staffList.filter(s => s.role === 'Doctor')}
  patients={patients}
/>
```

---

## Validation Rules

### Appointment Booking
- Patient ID is required
- Doctor ID is required
- Appointment date must be today or in the future
- Start time is required
- End time is required
- End time must be after start time

### Appointment Rescheduling
- New appointment date must be today or in the future
- New start time is required
- New end time is required
- End time must be after start time

---

## Error Handling

All components include:
- Try-catch blocks for API calls
- User-friendly error messages
- Loading states
- Fallback behavior (mock data when API fails)
- Form validation before submission

---

## Database Mapping

The DTOs used by the backend are:

### AppointmentRequestDTO
```
- patientId: String
- doctorId: String
- appointmentDate: LocalDate
- startTime: LocalTime
- endTime: LocalTime
- notes: String
```

### AppointmentResponseDTO
```
- appointmentId: String
- patientName: String
- doctorName: String
- appointmentDate: LocalDate
- startTime: LocalTime
- endTime: LocalTime
- status: String
- notes: String
```

---

## Backend Controller Reference

The backend provides the following endpoints:

```
POST   /appointments/bookAppointment          - Book new appointment
POST   /appointments/{appointmentId}/reschedule - Reschedule appointment
DELETE /appointments/{appointmentId}          - Cancel appointment
GET    /appointments/{appointmentId}/details  - Get appointment details
GET    /appointments/{doctorId}/{date}        - Get doctor's appointments
GET    /appointments/{date}                   - Get all appointments for date
GET    /appointments/getDoctorPatients/{staffId} - Get patients visited by doctor
```

---

## Future Enhancements

1. **Appointment Reminders**: Send email/SMS reminders to patients
2. **Doctor Availability**: Check doctor availability before booking
3. **Conflict Detection**: Prevent double-booking
4. **Appointment Notes**: Add notes to appointments after completion
5. **Appointment History**: View past appointments
6. **Patient History**: Show patient appointment history
7. **Analytics Dashboard**: View appointment statistics
8. **Bulk Operations**: Reschedule multiple appointments
9. **Appointment Templates**: Create recurring appointments
10. **Calendar View**: Visual calendar for appointments

---

## Troubleshooting

### Appointments not loading
- Check if backend service is running on port 9000
- Verify network connectivity
- Check browser console for error messages

### Cannot book appointment
- Ensure all required fields are filled
- Check that end time is after start time
- Verify doctor and patient IDs exist

### Reschedule fails
- Ensure new date is in the future
- Check that new times don't conflict with other appointments
- Verify the appointment ID is valid

---

## Testing

To test the appointment features:

1. **Book Appointment**:
   - Click "Book New Appointment"
   - Select a patient and doctor
   - Choose a future date and time
   - Submit and verify confirmation

2. **Reschedule Appointment**:
   - Click "Reschedule" on an existing appointment
   - Change the date/time
   - Submit and verify update

3. **Cancel Appointment**:
   - Click "Cancel" on an appointment
   - Confirm cancellation
   - Verify appointment is removed from list

4. **View Patient Details**:
   - Click "View Patient" on a doctor's appointment
   - Verify patient information is displayed correctly

---

## Support

For issues or questions regarding the appointment management system, please contact the development team.
