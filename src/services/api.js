import axios from 'axios';

const sleep = (ms = 150) => new Promise((r) => setTimeout(r, ms))

// demo DB
const _db = {
  patients: [],
  appointments: [
    { id: 1, time: '09:00', patientId: 101, patient: 'John Doe', doctorId: 201, status: 'Scheduled' },
    { id: 2, time: '10:30', patientId: 102, patient: 'Jane Smith', doctorId: 202, status: 'Scheduled' },
  ],
  rooms: [
    { id: 1, roomNumber: 101, roomType: 'General', roomCapacity: 20, beds: [] },
    { id: 2, roomNumber: 102, roomType: 'ICU', roomCapacity: 4, beds: [] },
  ],
  beds: [
    { id: 1, number: 'A-1', roomId: 1, available: true, history: [] },
    { id: 2, number: 'A-2', roomId: 1, available: true, history: [] },
  ],
  staffs: [],
}

export async function addPatient(payload) {
  await sleep()
  const patient = await postFecthCall('http://localhost:8000/patients/register', payload);
  return patient
}

// Fetch patients
export async function getPatients() {
  await sleep()
  return getFecthCall('http://localhost:8000/patients');
}

// Get patient by id (external patient service)
export async function getPatientById(patientId) {
  try {
    const response = await getFecthCall(`http://localhost:8000/patients/${patientId}`)
    return {
      data: response,
      status: 200,
      success: true
    }
  } catch (err) {
    console.warn('getPatientById remote failed', err)
    const status = err.response?.status
    const errorMsg = err.response?.data || err.message
    return {
      data: null,
      status: status || 500,
      success: false,
      message: errorMsg || 'Failed to fetch patient details'
    }
  }
}

export async function updatePatient(id, payload) {
  await sleep()
  const resp = putFecthCall(`http://localhost:8000/patients/update/${id}`, payload);
  return resp;
}

/* Appointments */
const BASE_URL = 'http://localhost:8000'

export async function getAppointments() {
  await sleep()
  return [..._db.appointments]
}

// Book appointment - creates new appointment
export async function bookAppointment(payload) {
  try {
    const response = await postFecthCall(`${BASE_URL}/appointments/bookAppointment`, {
      patientId: payload.patientId,
      doctorId: payload.doctorId,
      appointmentDate: payload.appointmentDate,
      startTime: payload.startTime,
      endTime: payload.endTime,
      notes: payload.notes || '',
    })
    // Return response with status code
    return {
      data: response,
      status: 201,
      success: true
    }
  } catch (err) {
    console.warn('bookAppointment remote failed', err)
    
    // Check error response status
    const status = err.response?.status
    const errorMsg = err.response?.data || err.message
    
    if (status === 404) {
      return {
        data: null,
        status: 404,
        success: false,
        message: 'Appointment not found'
      }
    } else if (status === 409) {
      return {
        data: null,
        status: 409,
        success: false,
        message: errorMsg || 'Appointment already exists or doctor is unavailable'
      }
    } else {
      // Do not fallback to local DB; surface error to caller so UI can show correct info
      return {
        data: null,
        status: status || 500,
        success: false,
        message: errorMsg || 'Failed to book appointment'
      }
    }
  }
}

// Reschedule appointment - updates time slot
export async function rescheduleAppointment(appointmentId, updates) {
  try {
    // Backend expects RescheduleAppointmentDTO with fields: newDate, newStartTime, newEndTime
    const body = {
      newDate: updates.appointmentDate,
      newStartTime: updates.startTime,
      newEndTime: updates.endTime,
    }
    const response = await putFecthCall(`${BASE_URL}/appointments/reScheduleAppointment${appointmentId}/`, body)
    return {
      data: response,
      status: 200,
      success: true
    }
  } catch (err) {
    console.warn('rescheduleAppointment remote failed', err)
    const status = err.response?.status
    const errorMsg = err.response?.data || err.message
    if (status === 404) {
      return { data: null, status: 404, success: false, message: 'Appointment not found' }
    } else if (status === 409) {
      return { data: null, status: 409, success: false, message: errorMsg || 'Doctor unavailable or invalid time slot' }
    } else {
      return { data: null, status: status || 500, success: false, message: errorMsg || 'Failed to reschedule appointment' }
    }
  }
}

// Cancel appointment - marks as cancelled
export async function cancelAppointment(appointmentId) {
  try {
    const response = await deleteFecthCall(`${BASE_URL}/appointments/${appointmentId}`)
    return {
      data: response,
      status: 200,
      success: true
    }
  } catch (err) {
    console.warn('cancelAppointment remote failed', err)
    
    const status = err.response?.status
    const errorMsg = err.response?.data || err.message
    
    if (status === 404) {
      return {
        data: null,
        status: 404,
        success: false,
        message: 'Appointment not found'
      }
    } else {
      // Do not modify local DB on errors; return error to caller
      return {
        data: null,
        status: status || 500,
        success: false,
        message: errorMsg || 'Failed to cancel appointment'
      }
    }
  }
}

// Get appointment details by patient ID
export async function getAppointmentDetails(patientId) {
  try {
    const response = await getFecthCall(`http://localhost:8000/patients/${patientId}`)
    return {
      data: response,
      status: 200,
      success: true
    }
  } catch (err) {
    console.warn('getAppointmentDetails remote failed', err)
    const status = err.response?.status
    
    if (status === 404) {
      return {
        data: null,
        status: 404,
        success: false,
        message: 'Appointment not found'
      }
    } else {
      // Do not return local DB on errors; surface the error to the caller
      return {
        data: null,
        status: status || 500,
        success: false,
        message: err.response?.data || err.message || 'Failed to get appointment details'
      }
    }
  }
}

// Get all appointments for a specific doctor on a date
export async function getAppointmentsForDoctor(doctorId, date) {
  try {
    const response = await getFecthCall(`${BASE_URL}/appointments/${doctorId}/${date}`)
    return {
      data: response,
      status: 200,
      success: true
    }
  } catch (err) {
    console.warn('getAppointmentsForDoctor remote failed', err)
    const status = err.response?.status
    const errorMsg = err.response?.data || err.message
    return {
      data: null,
      status: status || 500,
      success: false,
      message: errorMsg || 'Failed to fetch appointments for doctor'
    }
  }
}

// Get all appointments for all doctors on a date
export async function getAppointmentsForAllDoctors(date) {
  try {
    const response = await getFecthCall(`${BASE_URL}/appointments/${date}`)
    return {
      data: response,
      status: 200,
      success: true
    }
  } catch (err) {
    console.warn('getAppointmentsForAllDoctors remote failed', err)
    const status = err.response?.status
    const errorMsg = err.response?.data || err.message
    return {
      data: null,
      status: status || 500,
      success: false,
      message: errorMsg || 'Failed to fetch appointments for date'
    }
  }
}

// Get patients visited by a doctor in date range
export async function getPatientsVisitedByDoctor(doctorId, startDate, endDate) {
  try {
    const response = await getFecthCall(
      `${BASE_URL}/appointments/getDoctorPatients/${doctorId}?startDate=${startDate}&endDate=${endDate}`
    )
    return {
      data: response,
      status: 200,
      success: true
    }
  } catch (err) {
    console.warn('getPatientsVisitedByDoctor remote failed', err)
    const status = err.response?.status
    const errorMsg = err.response?.data || err.message
    return {
      data: null,
      status: status || 500,
      success: false,
      message: errorMsg || 'Failed to fetch patients visited by doctor'
    }
  }
}

// cancel by doctor & patient ids (deprecated - use cancelAppointment instead)
export async function cancelAppointmentByDoctorAndPatient(doctorId, patientId) {
  await sleep()
  _db.appointments = _db.appointments.filter((a) => !(a.doctorId === doctorId && a.patientId === patientId))
  return { success: true }
}

/* Doctor Schedule Management */
const DOCTOR_SCHEDULE_BASE_URL = 'http://localhost:8000/doctorSchedule'

export async function markDoctorAvailable(staffId, dates) {
  try {
    const response = await postFecthCall(`${DOCTOR_SCHEDULE_BASE_URL}/markavailable?staffId=${staffId}`, dates)
    return {
      data: response,
      status: 201,
      success: true
    }
  } catch (err) {
    console.warn('markDoctorAvailable remote failed', err)
    const status = err.response?.status
    const errorMsg = err.response?.data || err.message
    return {
      data: null,
      status: status || 500,
      success: false,
      message: errorMsg || 'Failed to mark doctor as available'
    }
  }
}

export async function markDoctorUnavailable(doctorId, listOfUnavailableDates) {
  try {
    const response = await postFecthCall(`${DOCTOR_SCHEDULE_BASE_URL}/${doctorId}/unavailable`, listOfUnavailableDates)
    return {
      data: response,
      status: 201,
      success: true
    }
  } catch (err) {
    console.warn('markDoctorUnavailable remote failed', err)
    const status = err.response?.status
    const errorMsg = err.response?.data || err.message
    return {
      data: null,
      status: status || 500,
      success: false,
      message: errorMsg || 'Failed to mark doctor as unavailable'
    }
  }
}

export async function isDoctorAvailable(staffId, date) {
  try {
    const formattedDate = typeof date === 'string' ? date : date.toISOString().split('T')[0]
    const response = await getFecthCall(`${DOCTOR_SCHEDULE_BASE_URL}/isDoctorAvailable?staffId=${staffId}&date=${formattedDate}`)
    return {
      data: response,
      status: 200,
      success: true
    }
  } catch (err) {
    console.warn('isDoctorAvailable remote failed', err)
    const status = err.response?.status
    const errorMsg = err.response?.data || err.message
    return {
      data: null,
      status: status || 500,
      success: false,
      message: errorMsg || 'Failed to check doctor availability'
    }
  }
}

/* Rooms and Beds */
export async function getRooms() {
  await sleep()
  return [..._db.rooms]
}
export async function addRoom(payload) {
  await sleep()
  console.log("addRoom received payload:", payload)
  // Transform payload to backend DTO shape and POST to rooms service; fallback to local mock on error
  try {
    const body = {
      roomNumber: Number(payload.roomNumber),
      roomType: payload.roomType,
      roomCapacity: Number(payload.roomCapacity),
      beds: Array.isArray(payload.beds) ? payload.beds.map((b) => ({
        bedNumber: b.bedNumber !== undefined ? Number(b.bedNumber) : (b.number !== undefined ? Number(b.number) : null),
        roomNumber: Number(payload.roomNumber),
        occupied: Boolean(b.isOccupied)
      })) : []
    }
    console.log("addRoom sending body:", body)
    const resp = await postFecthCall('http://localhost:8000/rooms/addroom', body)
    // Expect backend to return created room object; normalize if needed
    return resp
  } catch (err) {
    console.warn('addRoom remote failed ', err)
    const room = { id: Date.now(), roomNumber: payload.roomNumber, roomType: payload.roomType, roomCapacity: payload.roomCapacity, beds: Array.isArray(payload.beds) ? payload.beds : [], ...payload }
    _db.rooms.unshift(room)
    return room
  }
}

export async function updateRoomByNumber(roomNumber, updates) {
  await sleep()
  try {
    const r = await putFecthCall(`http://localhost:8000/rooms/update-rooms/${roomNumber}`, updates);
    return r;
  }catch(err) {
    console.warn('updateRoomByNumber remote failed ', err)
    return {};
  }
}

export async function deleteRoomByNumber(roomNumber) {
  await sleep()
  try {
    const resp = await deleteFecthCall(`http://localhost:8000/rooms/delete-rooms/${roomNumber}`)
    return resp
  } catch (err) {
    console.warn('deleteRoomByNumber remote failed ', err)
    return {}
  }
}

export async function getBeds() {
  await sleep()
  try {
    const beds = await getFecthCall('http://localhost:8000/bed/getBeds');
    return beds;
  } catch (err) {
    console.warn('getBeds remote failed', err)
    return [..._db.beds]
  }
}

export async function getAllRooms(){
  await sleep()
  try {
    const rooms = await getFecthCall('http://localhost:8000/rooms/getRooms');
    return rooms;
  } catch (err) {
    console.warn('getAllRooms remote failed ', err)
    return [];
  }
}

/* Staff management (Admin) */
export async function getStaffs() {
  await sleep()
  try {
    const resp = await getFecthCall('http://localhost:8000/staff')
    return Array.isArray(resp) ? resp : []
  } catch (err) {
    console.warn('getStaffs remote failed', err)
    return [..._db.staffs]
  }
}

export async function addStaff(payload) {
  await sleep()
  try {
    const body = payload
    const resp = await postFecthCall('http://localhost:8000/staff/register', body)
    return resp
  } catch (err) {
    console.warn('addStaff remote failed', err)
    const s = { id: Date.now(), staffId: payload.staffId || `S-${Date.now()}`, ...payload }
    _db.staffs.unshift(s)
    return s
  }
}

export async function updateStaff(staffId, updates) {
  await sleep()
  try {
    const resp = await putFecthCall(`http://localhost:8000/staff/update/${staffId}`, updates)
    return resp
  } catch (err) {
    console.warn('updateStaff remote failed', err)
    const idx = _db.staffs.findIndex(s => String(s.staffId) === String(staffId) || String(s.id) === String(staffId))
    if (idx !== -1) {
      _db.staffs[idx] = { ..._db.staffs[idx], ...updates }
      return _db.staffs[idx]
    }
    return { staffId, ...updates }
  }
}

export async function resignStaff(staffId) {
  await sleep()
  try {
    const resp = await postFecthCall(`http://localhost:8000/staffs/resign/${staffId}`, {})
    return resp
  } catch (err) {
    console.warn('resignStaff remote failed', err)
    const s = _db.staffs.find(s => String(s.staffId) === String(staffId) || String(s.id) === String(staffId))
    if (s) {
      s.isEmployeeActive = false
      return s
    }
    return { staffId, isEmployeeActive: false }
  }
}

export async function addBed(payload) {
  await sleep()
  const resp = await postFecthCall('http://localhost:8000/bed/addBed', payload);
  return resp;
}
export async function updateBed(id, updates) {
  await sleep()
  const b = _db.beds.find((x) => x.id === id)
  if (!b) throw new Error('Bed not found')
  Object.assign(b, updates)
  return b
}
export async function assignBed(bedNumber, patientId, by = 'receptionist') {
  await sleep()
  try {
    const resp = await postFecthCall(`http://localhost:8000/bed/assign/${bedNumber}/${patientId}`)
    // Normalize response to ensure all necessary fields exist
    if (resp) {
      return {
        id: resp.id || `bed-${resp.bedNumber}`,
        number: resp.number || resp.bedNumber,
        bedNumber: resp.bedNumber,
        roomNumber: resp.roomNumber,
        roomId: resp.roomId,
        available: resp.available !== undefined ? resp.available : (resp.occupied !== undefined ? !resp.occupied : false),
        occupied: resp.occupied !== undefined ? resp.occupied : true,
        patientId: resp.patientId || patientId,
        history: resp.history || []
      }
    }
    return resp
  } catch (err) {
    console.warn('assignBed remote failed', err)
    // Fallback: update local bed - need to find it first to preserve roomNumber
    const b = _db.beds.find((x) => x.number === bedNumber)
    if (b) {
      const updatedBed = {
        id: b.id,
        number: b.number,
        bedNumber: b.number,
        roomNumber: b.roomNumber,
        roomId: b.roomId,
        available: false,
        occupied: true,
        patientId: patientId,
        history: [{ action: 'assign', patientId, by, at: new Date().toISOString() }, ...(b.history || [])]
      }
      b.available = false
      b.occupied = true
      b.patientId = patientId
      b.history = updatedBed.history
      return updatedBed
    }
    throw err
  }
}
export async function vacateBed(roomNumber, bedNumber, by = 'receptionist') {
  await sleep()
  try {
    // Call remote endpoint expecting path variables: roomNumber and bedNumber
    const resp = await putFecthCall(`http://localhost:8000/bed/vacate-bed/${roomNumber}/${bedNumber}`)
    if (resp) {
      return {
        id: resp.id || `bed-${resp.bedNumber}`,
        number: resp.number || resp.bedNumber || bedNumber,
        bedNumber: resp.bedNumber || resp.number || bedNumber,
        roomNumber: resp.roomNumber || roomNumber,
        roomId: resp.roomId,
        available: resp.available !== undefined ? resp.available : (resp.occupied !== undefined ? !resp.occupied : true),
        occupied: resp.occupied !== undefined ? resp.occupied : false,
        history: resp.history || []
      }
    }
    return resp
  } catch (err) {
    console.warn('vacateBed remote failed', err)
    // Fallback: update local bed - find by bed number and roomNumber
    const b = _db.beds.find((x) => String(x.number) === String(bedNumber) || String(x.bedNumber) === String(bedNumber))
    if (b) {
      const updatedBed = {
        id: b.id,
        number: b.number || bedNumber,
        bedNumber: b.number || bedNumber,
        roomNumber: b.roomNumber || roomNumber,
        roomId: b.roomId,
        available: true,
        occupied: false,
        history: [{ action: 'vacate', by, at: new Date().toISOString() }, ...(b.history || [])]
      }
      b.available = true
      b.occupied = false
      b.history = updatedBed.history
      return updatedBed
    }
    throw err
  }
}
export async function getBedHistory(bedId) {
  await sleep()
  try {
    const history = await getFecthCall(`http://localhost:8000/bed/bed-history/${bedId}`)
    return Array.isArray(history) ? history : []
  } catch (err) {
    console.warn('getBedHistory remote failed', err)
    const b = _db.beds.find((x) => String(x.id) === String(bedId) || String(x.number) === String(bedId) || String(x.bedNumber) === String(bedId))
    if (!b) return []
    return (b.history || []).map((h, idx) => ({ bedNumber: b.number || b.bedNumber || bedId, patientId: h.patientId || null, assignedAt: h.at || null, vacatedAt: h.vacatedAt || null, bedAssignmentHistoryId: idx }))
  }
}

export async function deleteBed(bedNumber, roomNumber) {
  await sleep()
  try {
    const resp = await deleteFecthCall(`http://localhost:8000/bed/delete-bed/${bedNumber}/${roomNumber}`)
    return resp
  } catch (err) {
    console.warn('deleteBed remote failed', err)
    _db.beds = _db.beds.filter((b) => !(b.number === bedNumber))
    return { success: true }
  }
}

/* Keep auth placeholders unchanged */
export async function login() {
  throw new Error('API not implemented')
}
export async function getProfile() {
  throw new Error('API not implemented')
}

async function getFecthCall(URL, options={}) {
  let fectchedData = await axios.get(URL,options);
  return fectchedData.data;
}

async function putFecthCall(URL, options={}) { 
  let fectchedData = await axios.put(URL,options);
  return fectchedData.data;
}

async function postFecthCall(URL, options={}) { 
  let fectchedData = await axios.post(URL,options);
  return fectchedData.data;
}

async function deleteFecthCall(URL, options={method: "DELETE"}) {
  let fectchedData = await axios.delete(URL, options);
  return fectchedData.data;
}