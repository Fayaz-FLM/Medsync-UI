import axiosInstance from './axiosConfig';

const sleep = (ms = 150) => new Promise((r) => setTimeout(r, ms));

// ============= PATIENT MANAGEMENT =============
export async function addPatient(payload) {
  await sleep();
  const response = await axiosInstance.post('/patients/register', payload);
  return response.data;
}

export async function getPatients() {
  await sleep();
  const response = await axiosInstance.get('/patients');
  return response.data;
}

export async function getPatientById(patientId) {
  try {
    const response = await axiosInstance.get(`/patients/${patientId}`);
    return {
      data: response.data,
      status: 200,
      success: true
    };
  } catch (err) {
    console.warn('getPatientById failed', err);
    const status = err.response?.status;
    const errorMsg = err.response?.data || err.message;
    return {
      data: null,
      status: status || 500,
      success: false,
      message: errorMsg || 'Failed to fetch patient details'
    };
  }
}

export async function updatePatient(id, payload) {
  await sleep();
  const response = await axiosInstance.put(`/patients/update/${id}`, payload);
  return response.data;
}

// ============= APPOINTMENT MANAGEMENT =============
export async function getAppointments() {
  await sleep();
  try {
    const response = await axiosInstance.get('/appointments');
    return response.data;
  } catch (err) {
    console.warn('getAppointments failed', err);
    return [];
  }
}

export async function bookAppointment(payload) {
  try {
    const response = await axiosInstance.post('/appointments/bookAppointment', {
      patientId: payload.patientId,
      doctorId: payload.doctorId,
      appointmentDate: payload.appointmentDate,
      startTime: payload.startTime,
      endTime: payload.endTime,
      notes: payload.notes || '',
      reasonForVisit: payload.reasonForVisit
    });
    return {
      data: response.data,
      status: 201,
      success: true
    };
  } catch (err) {
    console.warn('bookAppointment failed', err);
    const status = err.response?.status;
    const errorMsg = err.response?.data || err.message;
    
    if (status === 404) {
      return {
        data: null,
        status: 404,
        success: false,
        message: 'Patient or Doctor not found'
      };
    } else if (status === 409) {
      return {
        data: null,
        status: 409,
        success: false,
        message: errorMsg || 'Appointment already exists or doctor is unavailable'
      };
    } else {
      return {
        data: null,
        status: status || 500,
        success: false,
        message: errorMsg || 'Failed to book appointment'
      };
    }
  }
}

export async function rescheduleAppointment(appointmentId, updates) {
  try {
    const body = {
      newDate: updates.appointmentDate,
      newStartTime: updates.startTime,
      newEndTime: updates.endTime
    };
    const response = await axiosInstance.put(`/appointments/reScheduleAppointment/${appointmentId}`, body);
    return {
      data: response.data,
      status: 200,
      success: true
    };
  } catch (err) {
    console.warn('rescheduleAppointment failed', err);
    const status = err.response?.status;
    const errorMsg = err.response?.data || err.message;
    if (status === 404) {
      return { data: null, status: 404, success: false, message: 'Appointment not found' };
    } else if (status === 409) {
      return { data: null, status: 409, success: false, message: errorMsg || 'Doctor unavailable or invalid time slot' };
    } else {
      return { data: null, status: status || 500, success: false, message: errorMsg || 'Failed to reschedule appointment' };
    }
  }
}

export async function cancelAppointment(appointmentId) {
  try {
    const response = await axiosInstance.delete(`/appointments/${appointmentId}`);
    return {
      data: response.data,
      status: 200,
      success: true
    };
  } catch (err) {
    console.warn('cancelAppointment failed', err);
    const status = err.response?.status;
    const errorMsg = err.response?.data || err.message;
    
    if (status === 404) {
      return {
        data: null,
        status: 404,
        success: false,
        message: 'Appointment not found'
      };
    } else {
      return {
        data: null,
        status: status || 500,
        success: false,
        message: errorMsg || 'Failed to cancel appointment'
      };
    }
  }
}

export async function getAppointmentDetails(appointmentId) {
  try {
    const response = await axiosInstance.get(`/appointments/getAppointmentDetails/${appointmentId}`);
    return {
      data: response.data,
      status: 200,
      success: true
    };
  } catch (err) {
    console.warn('getAppointmentDetails failed', err);
    const status = err.response?.status;
    
    if (status === 404) {
      return {
        data: null,
        status: 404,
        success: false,
        message: 'Appointment not found'
      };
    } else {
      return {
        data: null,
        status: status || 500,
        success: false,
        message: err.response?.data || err.message || 'Failed to get appointment details'
      };
    }
  }
}

export async function getAppointmentsForDoctor(doctorId, date) {
  try {
    const response = await axiosInstance.get(`/appointments/${doctorId}/${date}`);
    return {
      data: response.data,
      status: 200,
      success: true
    };
  } catch (err) {
    console.warn('getAppointmentsForDoctor failed', err);
    const status = err.response?.status;
    const errorMsg = err.response?.data || err.message;
    
    // 404 means no appointments found - not an error
    if (status === 404) {
      return {
        data: [],
        status: 404,
        success: true,
        message: 'No appointments found for this date'
      };
    }
    
    return {
      data: [],
      status: status || 500,
      success: false,
      message: errorMsg || 'Failed to fetch appointments for doctor'
    };
  }
}

export async function getAppointmentsForAllDoctors(date) {
  try {
    // Validate date format (YYYY-MM-DD)
    if (!date || typeof date !== 'string') {
      throw new Error('Invalid date parameter');
    }
    
    // Ensure date is in YYYY-MM-DD format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      console.error('Invalid date format:', date);
      throw new Error(`Invalid date format: ${date}. Expected YYYY-MM-DD`);
    }
    
    console.log('Fetching appointments for date:', date);
    const response = await axiosInstance.get(`/appointments/${date}`);
    return {
      data: response.data,
      status: 200,
      success: true
    };
  } catch (err) {
    console.error('getAppointmentsForAllDoctors failed:', err);
    const status = err.response?.status;
    const errorMsg = err.response?.data || err.message;
    
    // 404 means no appointments found - return empty array, not an error
    if (status === 404) {
      return {
        data: [],
        status: 404,
        success: true,
        message: 'No appointments found for this date'
      };
    }
    
    return {
      data: [],
      status: status || 500,
      success: false,
      message: errorMsg || 'Failed to fetch appointments for date'
    };
  }
}

// Alias for backward compatibility
export const getAllAppointmentsForAllDoctors = getAppointmentsForAllDoctors;

export async function generateDietPlanApi(appointmentId) {
  try {
    const response = await axiosInstance.post(`/appointments/generateDietPlan/${appointmentId}`);
    // Return the diet plan string directly
    return response.data;
  } catch (err) {
    console.error('generateDietPlanApi failed:', err);
    const errorMsg = err.response?.data?.message || err.response?.data || err.message || 'Failed to generate diet plan';
    throw new Error(errorMsg);
  }
}

export async function getPatientsVisitedByDoctor(doctorId, startDate, endDate) {
  try {
    const response = await axiosInstance.get(
      `/appointments/getDoctorPatients/${doctorId}?startDate=${startDate}&endDate=${endDate}`
    );
    return {
      data: response.data,
      status: 200,
      success: true
    };
  } catch (err) {
    console.warn('getPatientsVisitedByDoctor failed', err);
    const status = err.response?.status;
    const errorMsg = err.response?.data || err.message;
    return {
      data: null,
      status: status || 500,
      success: false,
      message: errorMsg || 'Failed to fetch patients visited by doctor'
    };
  }
}

export async function submitDiagnosis(appointmentId, formData) {
  try {
    const response = await axiosInstance.post(`/appointments/submitDiagnosis/${appointmentId}`, formData);
    return {
      data: response.data,
      status: 200,
      success: true
    };
  } catch (err) {
    console.warn('submitDiagnosis failed', err);
    const status = err.response?.status;
    const errorMsg = err.response?.data?.message || err.message;
    throw { response: { data: { message: errorMsg } } }; // Throwing in a format DiagnosisModal expects
  }
}

// ============= DOCTOR SCHEDULE MANAGEMENT =============
export async function markDoctorAvailable(staffId, dates) {
  try {
    const response = await axiosInstance.post(`/doctorSchedule/markavailable?staffId=${staffId}`, dates);
    return {
      data: response.data,
      status: response.status,
      success: true,
      message: response.data
    };
  } catch (err) {
    console.warn('markDoctorAvailable failed', err);
    const status = err.response?.status;
    const errorMsg = typeof err.response?.data === 'string' 
      ? err.response.data 
      : err.response?.data?.message || err.message;
    return {
      data: null,
      status: status || 500,
      success: false,
      message: errorMsg || 'Failed to mark doctor as available'
    };
  }
}

export async function markDoctorUnavailable(doctorId, listOfUnavailableDates) {
  try {
    const response = await axiosInstance.post(`/doctorSchedule/${doctorId}/unavailable`, listOfUnavailableDates);
    return {
      data: response.data,
      status: response.status,
      success: true,
      message: `Marked unavailable for ${response.data?.length || listOfUnavailableDates.length} date(s)`
    };
  } catch (err) {
    console.warn('markDoctorUnavailable failed', err);
    const status = err.response?.status;
    const errorMsg = typeof err.response?.data === 'string' 
      ? err.response.data 
      : err.response?.data?.message || err.message;
    return {
      data: null,
      status: status || 500,
      success: false,
      message: errorMsg || 'Failed to mark doctor as unavailable'
    };
  }
}

export async function getDoctorUnavailableDates(staffId) {
  try {
    const response = await axiosInstance.get(`/doctorSchedule/${staffId}/unavailable-dates`);
    return {
      data: Array.isArray(response.data) ? response.data : [],
      status: response.status,
      success: true
    };
  } catch (err) {
    console.warn('getDoctorUnavailableDates failed', err);
    // Return empty array instead of error - doctor might not have any unavailable dates
    return {
      data: [],
      status: err.response?.status || 500,
      success: true, // Changed to true so it doesn't show as error
      message: err.response?.data || err.message
    };
  }
}

export async function isDoctorAvailable(staffId, date) {
  try {
    const formattedDate = typeof date === 'string' ? date : date.toISOString().split('T')[0];
    const response = await axiosInstance.get(`/doctorSchedule/isDoctorAvailable?staffId=${staffId}&date=${formattedDate}`);
    return {
      data: response.data,
      status: 200,
      success: true
    };
  } catch (err) {
    console.warn('isDoctorAvailable failed', err);
    const status = err.response?.status;
    const errorMsg = err.response?.data || err.message;
    return {
      data: null,
      status: status || 500,
      success: false,
      message: errorMsg || 'Failed to check doctor availability'
    };
  }
}

// ============= ROOM MANAGEMENT =============
export async function getRooms() {
  await sleep();
  try {
    const response = await axiosInstance.get('/rooms/getRooms');
    return response.data;
  } catch (err) {
    console.warn('getRooms failed', err);
    return [];
  }
}

export async function getAllRooms() {
  await sleep();
  try {
    const response = await axiosInstance.get('/rooms/getRooms');
    return response.data;
  } catch (err) {
    console.warn('getAllRooms failed', err);
    return [];
  }
}

export async function addRoom(payload) {
  await sleep();
  console.log("addRoom received payload:", payload);
  try {
    const body = {
      roomNumber: Number(payload.roomNumber),
      roomType: payload.roomType,
      roomCapacity: Number(payload.roomCapacity),
      beds: Array.isArray(payload.beds) ? payload.beds.map((b) => ({
        bedNumber: b.bedNumber !== undefined ? Number(b.bedNumber) : (b.number !== undefined ? Number(b.number) : null),
        roomNumber: Number(payload.roomNumber),
        occupied: Boolean(b.isOccupied || b.occupied)
      })) : []
    };
    console.log("addRoom sending body:", body);
    const response = await axiosInstance.post('/rooms/addroom', body);
    return response.data;
  } catch (err) {
    console.warn('addRoom failed', err);
    throw err;
  }
}

export async function updateRoomByNumber(roomNumber, updates) {
  await sleep();
  try {
    const response = await axiosInstance.put(`/rooms/update-rooms/${roomNumber}`, updates);
    return response.data;
  } catch (err) {
    console.warn('updateRoomByNumber failed', err);
    throw err;
  }
}

export async function deleteRoomByNumber(roomNumber) {
  await sleep();
  try {
    const response = await axiosInstance.delete(`/rooms/delete-rooms/${roomNumber}`);
    return response.data;
  } catch (err) {
    console.warn('deleteRoomByNumber failed', err);
    throw err;
  }
}

// ============= BED MANAGEMENT =============
export async function getBeds() {
  await sleep();
  try {
    const response = await axiosInstance.get('/bed/getBeds');
    return response.data;
  } catch (err) {
    console.warn('getBeds failed', err);
    return [];
  }
}

export async function addBed(payload) {
  await sleep();
  const response = await axiosInstance.post('/bed/addBed', payload);
  return response.data;
}

export async function updateBed(roomNumber, bedNumber, updates) {
  await sleep();
  const response = await axiosInstance.put(`/bed/update-bed/${roomNumber}/${bedNumber}`, updates);
  return response.data;
}

export async function assignBed(bedNumber, patientId) {
  await sleep();
  try {
    const response = await axiosInstance.post(`/bed/assign/${bedNumber}/${patientId}`);
    const resp = response.data;
    return {
      id: resp.bedNumber,
      number: resp.bedNumber,
      bedNumber: resp.bedNumber,
      roomNumber: resp.roomNumber,
      roomId: resp.roomNumber,
      available: !resp.isOccupied,
      occupied: resp.isOccupied,
      isOccupied: resp.isOccupied,
      patientId: patientId,
      history: []
    };
  } catch (err) {
    console.warn('assignBed failed', err);
    throw err;
  }
}

export async function vacateBed(roomNumber, bedNumber) {
  await sleep();
  try {
    const response = await axiosInstance.put(`/bed/vacate-bed/${roomNumber}/${bedNumber}`);
    const resp = response.data;
    return {
      id: resp.bedNumber,
      number: resp.bedNumber,
      bedNumber: resp.bedNumber,
      roomNumber: resp.roomNumber,
      roomId: resp.roomNumber,
      available: !resp.isOccupied,
      occupied: resp.isOccupied,
      isOccupied: resp.isOccupied,
      patientId: 0,
      history: []
    };
  } catch (err) {
    console.warn('vacateBed failed', err);
    throw err;
  }
}

export async function getBedHistory(bedNumber) {
  await sleep();
  try {
    const response = await axiosInstance.get(`/bed/bed-history/${bedNumber}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (err) {
    console.warn('getBedHistory failed', err);
    return [];
  }
}

export async function deleteBed(bedNumber, roomNumber) {
  await sleep();
  try {
    const response = await axiosInstance.delete(`/bed/delete-bed/${bedNumber}/${roomNumber}`);
    return response.data;
  } catch (err) {
    console.warn('deleteBed failed', err);
    throw err;
  }
}

// ============= STAFF MANAGEMENT =============
export async function getStaffs() {
  await sleep();
  try {
    const response = await axiosInstance.get('/staff');
    return Array.isArray(response.data) ? response.data : [];
  } catch (err) {
    console.warn('getStaffs failed', err);
    return [];
  }
}

export async function addStaff(payload) {
  await sleep();
  try {
    const response = await axiosInstance.post('/staff/register', payload);
    return response.data;
  } catch (err) {
    console.warn('addStaff failed', err);
    throw err;
  }
}

export async function updateStaff(staffId, updates) {
  await sleep();
  try {
    const response = await axiosInstance.put(`/staff/update/${staffId}`, updates);
    return response.data;
  } catch (err) {
    console.warn('updateStaff failed', err);
    throw err;
  }
}

export async function resignStaff(staffId) {
  await sleep();
  try {
    const response = await axiosInstance.delete(`/staff/resign/${staffId}`);
    return response.data;
  } catch (err) {
    console.warn('resignStaff failed', err);
    throw err;
  }
}

// ============= AUTHENTICATION & STAFF =============

export async function login(credentials) {
  // Expects: { email, password }
  try {
    const response = await axiosInstance.post('/staff/auth/login', credentials);
    return response.data; // { token, expiresInMillis, role, staffId }
  } catch (err) {
    console.warn('login failed', err);
    throw err;
  }
}

export async function getStaffById(staffId) {
  try {
    const response = await axiosInstance.get(`/staff/${staffId}`);
    return response.data;
  } catch (err) {
    console.warn('getStaffById failed', err);
    throw err;
  }
}

export async function forgotPassword(email) {
  try {
    const response = await axiosInstance.post('/staff/forgot-password', { email });
    return {
      success: true,
      message: response.data || 'If the email exists, an OTP has been sent.',
    };
  } catch (err) {
    console.warn('forgotPassword failed', err);
    const message = err.response?.data || err.message || 'Unable to start password reset';
    return { success: false, message };
  }
}

export async function verifyOtp(email, otp) {
  try {
    const response = await axiosInstance.post('/staff/verify-otp', { email, otp });
    return {
      success: true,
      message: response.data || 'OTP verified successfully.',
    };
  } catch (err) {
    console.warn('verifyOtp failed', err);
    const message = err.response?.data || err.message || 'Invalid or expired OTP';
    return { success: false, message };
  }
}

export async function resetPassword(email, newPassword) {
  try {
    const response = await axiosInstance.post('/staff/reset-password', { email, newPassword });
    return {
      success: true,
      message: response.data || 'Password reset successfully.',
    };
  } catch (err) {
    console.warn('resetPassword failed', err);
    const message = err.response?.data || err.message || 'Unable to reset password';
    return { success: false, message };
  }
}
