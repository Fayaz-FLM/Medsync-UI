# Appointment Management - Quick Implementation Guide

## Files Created/Modified

### New Components Created:
1. **src/components/AppointmentBooking.jsx** - Modal for booking appointments
2. **src/components/AppointmentReschedule.jsx** - Modal for rescheduling appointments
3. **src/components/PatientDetails.jsx** - Modal for viewing patient details
4. **src/components/AppointmentManagement.jsx** - Comprehensive appointment management panel

### Updated Files:
1. **src/services/api.js** - Added 6 new appointment API functions
2. **src/pages/DoctorDashboard.jsx** - Fully implemented with appointment features

## Doctor Features

### DoctorDashboard Features:
✅ View appointments for any selected date
✅ View patient details before appointment
✅ Reschedule appointments
✅ Cancel appointments with confirmation
✅ Real-time appointment list with status indicators

### How Doctors Use It:
1. Doctor logs in and sees their appointments
2. Select a date to view appointments for that day
3. Click "View Patient" to see medical history and details
4. Click "Reschedule" to change appointment time
5. Click "Cancel" to cancel appointment (requires confirmation)
6. Click "Refresh" to reload appointments

## Receptionist Features

### AppointmentManagement Component Features:
✅ Book new appointments
✅ View all appointments for selected date
✅ Search appointments by patient/doctor name or ID
✅ Reschedule appointments
✅ Cancel appointments
✅ Filter by date
✅ Real-time status indicators

### How to Integrate into ReceptionistDashboard:

Open `src/pages/ReceptionistDashboard.jsx` and add:

```jsx
// At the top of the file, add import:
import AppointmentManagement from '../components/AppointmentManagement'

// Then in your JSX, add the component where appropriate:
<AppointmentManagement
  doctors={staffList.filter(s => s.role === 'Doctor')}
  patients={patients}
/>
```

## API Endpoints Used

The implementation uses these backend endpoints:

```
POST   /appointments/bookAppointment
POST   /appointments/{appointmentId}/reschedule
DELETE /appointments/{appointmentId}
GET    /appointments/{appointmentId}/getAppointmentDetails
GET    /appointments/{doctorId}/{date}
GET    /appointments/{date}
GET    /appointments/getDoctorPatients/{staffId}
```

Base URL: `http://localhost:9000`

## Data Flow

### Booking Appointment:
```
AppointmentBooking Component
    ↓
bookAppointment(payload)
    ↓
POST /appointments/bookAppointment
    ↓
Backend creates appointment
    ↓
AppointmentResponseDTO returned
    ↓
Component updates local state
```

### Rescheduling Appointment:
```
AppointmentReschedule Component
    ↓
rescheduleAppointment(id, updates)
    ↓
POST /appointments/{id}/reschedule
    ↓
Backend updates appointment
    ↓
Updated appointment returned
    ↓
Component updates local state
```

### Cancelling Appointment:
```
Cancel Button Clicked
    ↓
Show Confirmation Modal
    ↓
confirmAppointment()
    ↓
cancelAppointment(id)
    ↓
DELETE /appointments/{id}
    ↓
Component removes from list
```

## State Management

Each component manages its own state:

### AppointmentBooking:
- formData (patientId, doctorId, appointmentDate, startTime, endTime, notes)
- loading (boolean)
- error (string)

### AppointmentReschedule:
- formData (appointmentDate, startTime, endTime, notes)
- loading (boolean)
- error (string)

### PatientDetails:
- patientDetails (object)
- loading (boolean)
- error (string)

### AppointmentManagement:
- appointments (array)
- loading (boolean)
- error (string)
- selectedDate (string)
- selectedAppointment (object or null)
- searchTerm (string)
- showBookingModal (boolean)
- showRescheduleModal (boolean)
- cancelConfirm (id or null)

### DoctorDashboard:
- appointments (array)
- loading (boolean)
- error (string)
- selectedDate (string)
- selectedAppointment (object or null)
- showRescheduleModal (boolean)
- showPatientModal (boolean)
- cancelConfirm (id or null)

## Validation

### Form Validation:
- ✅ All required fields must be filled
- ✅ Appointment date must be today or in the future
- ✅ End time must be after start time
- ✅ Patient/Doctor IDs must be valid

### Error Handling:
- ✅ Try-catch blocks for all API calls
- ✅ User-friendly error messages
- ✅ Fallback to mock data if API fails
- ✅ Loading states during API calls

## Bootstrap Classes Used

The components use Bootstrap 5 classes:
- `modal` / `modal-backdrop` - For modal dialogs
- `btn` / `btn-primary` / `btn-danger` - For buttons
- `form-control` / `form-label` - For form elements
- `table` / `table-hover` - For appointment tables
- `badge` - For status indicators
- `alert` - For error/success messages
- `card` / `card-body` - For card containers

## Testing Checklist

### Doctor Dashboard Testing:
- [ ] Navigate to doctor dashboard
- [ ] View appointments for today
- [ ] Select a different date and verify appointments load
- [ ] Click "View Patient" and verify patient details modal appears
- [ ] Click "Reschedule" and verify reschedule modal appears
- [ ] Successfully reschedule an appointment
- [ ] Click "Cancel" and verify confirmation modal appears
- [ ] Cancel an appointment and verify it's removed

### Receptionist Dashboard Testing:
- [ ] Navigate to receptionist dashboard
- [ ] Click "Book New Appointment" and verify booking modal appears
- [ ] Successfully book an appointment
- [ ] View appointments for selected date
- [ ] Search appointments by patient name
- [ ] Search appointments by doctor name
- [ ] Click "Reschedule" on an appointment
- [ ] Successfully reschedule an appointment
- [ ] Click "Cancel" on an appointment
- [ ] Successfully cancel an appointment

## Common Issues & Solutions

### Issue: Appointments not loading
**Solution**: 
- Check if backend is running on port 9000
- Check browser console for error messages
- Verify database has appointment data

### Issue: Cannot book appointment
**Solution**:
- Ensure all required fields are filled
- Check that patient/doctor IDs exist
- Verify end time is after start time
- Check backend logs for validation errors

### Issue: Reschedule fails
**Solution**:
- Verify appointment ID exists
- Check that new date is in the future
- Ensure new times don't conflict
- Check backend logs

### Issue: Patient details not showing
**Solution**:
- Verify appointment has patientId
- Check that patient data is populated
- Verify backend is returning patient details

## Next Steps

1. **Integrate AppointmentManagement into ReceptionistDashboard**
   - Add import statement
   - Add component to JSX
   - Pass doctors and patients data

2. **Test all functionality**
   - Follow testing checklist above
   - Verify backend integration
   - Check error handling

3. **Customize styling** (optional)
   - Modify modal styles
   - Customize button colors
   - Adjust table layout

4. **Add additional features** (future)
   - Appointment reminders
   - Conflict detection
   - Availability checking
   - Analytics dashboard

---

## Contact & Support

For questions or issues with the appointment management system, refer to APPOINTMENT_FEATURES.md for detailed documentation.
