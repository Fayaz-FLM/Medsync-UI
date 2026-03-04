import React, { useState, useEffect, useRef } from 'react'
import * as api from '../services/api' // API helpers
import AppointmentList from '../components/AppointmentList'
import AppointmentReschedule from '../components/AppointmentReschedule'

export default function ReceptionistDashboard() {
  // Booking state
  const [showBooking, setShowBooking] = useState(false)
  const [bookingPatientId, setBookingPatientId] = useState('')
  const [bookingDoctorId, setBookingDoctorId] = useState('')
  const [bookingAppointmentDate, setBookingAppointmentDate] = useState('')
  const [bookingStartTime, setBookingStartTime] = useState('')
  const [bookingEndTime, setBookingEndTime] = useState('')
  const [bookingNotes, setBookingNotes] = useState('')

  // Patient add/edit form state
  const [showAddPatient, setShowAddPatient] = useState(false)
  const [editingPatientId, setEditingPatientId] = useState(null) // null => create, id => edit
  const [patientName, setPatientName] = useState('')
  const [gender, setGender] = useState('male')
  const [patientEmail, setPatientEmail] = useState('')
  const [patientPhoneNumber, setPatientPhoneNumber] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [doorNumber, setDoorNumber] = useState('')
  const [landmark, setLandmark] = useState('')
  const [city, setCity] = useState('')
  const [stateVal, setStateVal] = useState('')
  const [country, setCountry] = useState('')
  const [pinCode, setPinCode] = useState('')

  // Patients list + search/filter
  const initialPatients = []
  const [showPatients, setShowPatients] = useState(true)
  const [patients, setPatients] = useState(initialPatients)
  const [loadingPatients, setLoadingPatients] = useState(false)
  const [searchName, setSearchName] = useState('')
  const [searchPatientId, setSearchPatientId] = useState('')
  const [filterGender, setFilterGender] = useState('')
  const [filterCity, setFilterCity] = useState('')

  // Appointments
  const [appointments, setAppointments] = useState([])
  const [loadingAppointments, setLoadingAppointments] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [filterDoctorId, setFilterDoctorId] = useState('')
  const [cancelDoctorId, setCancelDoctorId] = useState('')
  const [cancelPatientId, setCancelPatientId] = useState('')
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [selectedAppointmentForReschedule, setSelectedAppointmentForReschedule] = useState(null)

  // Rooms & Beds
  const [rooms, setRooms] = useState([])
  const [beds, setBeds] = useState([])
  const [showRoomsPanel, setShowRoomsPanel] = useState(false)
  const [showAddRoom, setShowAddRoom] = useState(false)
  // New room fields: floor, roomNumber, roomType, roomCapacity, beds
  // Floor is left blank until user selects/enters it so we can disable Room input until floor is set
  const [newRoomFloor, setNewRoomFloor] = useState('')
  const [newRoomNumber, setNewRoomNumber] = useState('')
  const [newRoomType, setNewRoomType] = useState('General')
  const [newRoomCapacity, setNewRoomCapacity] = useState(1)
  const [newRoomBeds, setNewRoomBeds] = useState([])
  const [editingRoomNumber, setEditingRoomNumber] = useState(null)
  const [showAddBed, setShowAddBed] = useState(false)
  // UI helper for inline validation messages when room/bed numbers don't match floor/room
  const [roomError, setRoomError] = useState('')

  function handleSelectRoomNumber(num) {
    const roomNum = Number(num)
    setNewRoomNumber(roomNum)
    setRoomError('')
    setNewRoomBeds((prev) => {
      const cap = Number(newRoomCapacity) || 0
      const existing = Array.isArray(prev) ? prev.slice(0, cap) : []
      const arr = existing.slice()
      for (let i = arr.length; i < cap; i++) {
        // numeric bed numbering: roomNumber * 100 + bedIndex (1-based) -> e.g. room 205 => beds 20501, 20502
        arr.push({ number: roomNum * 100 + (i + 1), available: true })
      }
      return arr.map((b, idx) => ({ number: b.number !== undefined ? b.number : roomNum * 100 + (idx + 1), available: !!b.available }))
    })
  }
  const [newBedNumber, setNewBedNumber] = useState('')
  const [newBedRoomId, setNewBedRoomId] = useState('')
  // Search term to filter rooms when selecting a room for a new bed
  const [roomSearch, setRoomSearch] = useState('')
  // Availability for new bed: 'yes' => available, 'no' => not available
  const [newBedAvailable, setNewBedAvailable] = useState('yes')
  const [bedHistory, setBedHistory] = useState([])
  const [showBedHistory, setShowBedHistory] = useState(false)
  const [selectedBed, setSelectedBed] = useState(null)

  // Patient view/edit state
  const [showPatientDetails, setShowPatientDetails] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showEditPatient, setShowEditPatient] = useState(false)
  const [selectedPatientEditable, setSelectedPatientEditable] = useState(true)

  function populateFormFromPatient(patient) {
    setEditingPatientId(patient.id || patient.patientId)
    setPatientName(patient.patientName || patient.name || '')
    setGender(patient.gender || 'male')
    setPatientEmail(patient.patientEmail || patient.email || '')
    setPatientPhoneNumber(patient.patientPhoneNumber || patient.phone || '')
    setDateOfBirth(patient.dateOfBirth || patient.dob || '')
    setDoorNumber((patient.patientAddress && patient.patientAddress.doorNumber) || patient.doorNumber || '')
    setLandmark((patient.patientAddress && patient.patientAddress.landmark) || patient.landmark || '')
    setCity((patient.patientAddress && patient.patientAddress.city) || patient.city || '')
    setStateVal((patient.patientAddress && patient.patientAddress.state) || patient.state || '')
    setCountry((patient.patientAddress && patient.patientAddress.country) || patient.country || '')
    setPinCode((patient.patientAddress && patient.patientAddress.pinCode) || patient.pinCode || '')
  }

  // Scroll refs & handlers for panels
  const patientsRef = useRef(null)
  const roomsRef = useRef(null)
  const newRoomNumberInputRef = useRef(null)
  const bookingRef = useRef(null)
  const patientDetailsRef = useRef(null)

  function handleShowPatientsClick() {
    if (showPatients) {
      setShowPatients(false)
    } else {
      setShowPatients(true)
    }
  }

  function handleShowRoomsClick() {
    if (showRoomsPanel) {
      setShowRoomsPanel(false)
    } else {
      setShowRoomsPanel(true)
    }
  }

  useEffect(() => {
    if (showPatients) {
      setTimeout(() => patientsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
    }
  }, [showPatients])

  useEffect(() => {
    if (showRoomsPanel) {
      setTimeout(() => roomsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
    }
  }, [showRoomsPanel])

  // Scroll to booking form when opened
  useEffect(() => {
    if (showBooking) {
      setTimeout(() => bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
    }
  }, [showBooking])

  // Scroll to patient details when opened
  useEffect(() => {
    if (showPatientDetails) {
      setTimeout(() => patientDetailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
    }
  }, [showPatientDetails])

  // Keep bed numbers in sync with room number and capacity (auto-generated)
  useEffect(() => {
    const cap = Number(newRoomCapacity) || 0
    if (cap <= 0) return
    setNewRoomBeds((prev) => {
      const cur = Array.isArray(prev) ? prev.slice(0, cap) : []
      // base room number: prefer explicit room number, fallback to floor*100 (placeholder)
      const baseRoom = Number(newRoomNumber) || (Number(newRoomFloor) * 100) || 0
      for (let i = cur.length; i < cap; i++) cur.push({ number: baseRoom * 100 + (i + 1), available: true })
      return cur.map((b, idx) => ({ number: b.number !== undefined ? b.number : baseRoom * 100 + (idx + 1), available: b.available !== undefined ? b.available : true }))
    })
  }, [newRoomNumber, newRoomCapacity, newRoomFloor])

  // Utility: load initial data
  useEffect(() => {
    refreshPatients()
    loadAppointments()
    loadRooms()
    loadBeds()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reload appointments when selectedDate changes
  useEffect(() => {
    loadAppointments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate])

  /* ---------- Patients ---------- */
  function onAddPatient() {
    // open create form
    setSelectedPatient(null)
    setShowPatientDetails(false)
    setShowEditPatient(false)
    setEditingPatientId(null)
    setPatientName('')
    setGender('male')
    setPatientEmail('')
    setPatientPhoneNumber('')
    setDateOfBirth('')
    setDoorNumber('')
    setLandmark('')
    setCity('')
    setStateVal('')
    setCountry('')
    setPinCode('')
    setShowAddPatient((s) => !s)
  }

  async function onEditPatientClick(patient) {
    // prepare form and open edit mode
    populateFormFromPatient(patient)
    setSelectedPatient(patient)
    setShowEditPatient(true)
    setShowPatientDetails(false)
    setShowAddPatient(false)
  }

  const onAddPatientSubmit = async (e) => {
    e.preventDefault()
    // validation
    const required = [
      ['Patient name', patientName],
      ['Gender', gender],
      ['Email', patientEmail],
      ['Phone number', patientPhoneNumber],
      ['Date of birth', dateOfBirth],
      ['Door number', doorNumber],
      ['City', city],
      ['State', stateVal],
      ['Country', country],
      ['Pin code', pinCode],
    ]
    for (const [label, val] of required) {
      if (!val || (typeof val === 'string' && val.trim() === '')) {
        return alert(`Please enter ${label}`)
      }
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(patientEmail)) return alert('Please enter a valid email')
    const phoneDigits = patientPhoneNumber.replace(/\D/g, '')
    if (phoneDigits.length != 10) return alert('Please enter a valid phone number')

    const payload = {
      "patientName": patientName,
      "gender": (typeof gender === 'string' ? gender.toUpperCase() : gender),
      "patientEmail": patientEmail,
      "patientPhoneNumber": patientPhoneNumber,
      "dateOfBirth": dateOfBirth,
      "patientAddress": {
        "doorNumber": doorNumber,
        "landmark": landmark,
        "city": city,
        "state": stateVal,
        "country": country,
        "pinCode": pinCode
      }
    }

    if (editingPatientId) {
    }

    try {
      if (editingPatientId) {
        const updated = await api.updatePatient(editingPatientId, payload)
        setPatients((prev) => prev.map((p) => (p.patientId === editingPatientId ? updated : p)))
        console.log('Updated patient:', updated)
        alert('Patient updated successfully')
      } else {
        let newPatient = null
        newPatient = await api.addPatient(payload)
        setPatients((prev) => [newPatient, ...prev])
        alert('Patient added successfully')
      }
    } catch (err) {
      console.warn('Patient save failed', err)
      alert('Unable to save patient')
    } finally {
      // reset form
      setEditingPatientId(null)
      setShowAddPatient(false)
      setShowEditPatient(false)
      setPatientName('')
      setGender('male')
      setPatientEmail('')
      setPatientPhoneNumber('')
      setDateOfBirth('')
      setDoorNumber('')
      setLandmark('')
      setCity('')
      setStateVal('')
      setCountry('')
      setPinCode('')
    }
  }

  function onViewPatientClick(patient) {
    setSelectedPatient(patient)
    setShowPatientDetails(true)
    setShowAddPatient(false)
    setShowEditPatient(false)
    setSelectedPatientEditable(true)
  }

  function startEditingFromDetails() {
    if (!selectedPatient) return
    populateFormFromPatient(selectedPatient)
    setShowEditPatient(true)
    setShowPatientDetails(false)
  }

  function closePatientDetails() {
    setSelectedPatient(null)
    setShowPatientDetails(false)
  }

  async function refreshPatients(silent = false) {
    setLoadingPatients(true)
    try {
      if (typeof api.getPatients === 'function') {
        const list = await api.getPatients()
        if (Array.isArray(list)) setPatients(list)
      } else {
        // fallback: keep initial list (no change)
        await new Promise((r) => setTimeout(r, 200))
      }
    } catch (err) {
      console.warn('refreshPatients failed', err)
      // keep existing patients (or restore initial demo data) so UI is not emptied
      setPatients((prev) => (Array.isArray(prev) && prev.length ? prev : initialPatients))
      if (!silent) alert('Unable to refresh patients')
    } finally {
      setLoadingPatients(false)
    }
  }

  /* ---------- Appointments ---------- */
  async function loadAppointments() {
    setLoadingAppointments(true)
    try {
      // If a doctor filter is provided, fetch appointments for that doctor and date
      if (filterDoctorId && typeof api.getAppointmentsForDoctor === 'function') {
        const resp = await api.getAppointmentsForDoctor(filterDoctorId, selectedDate)
        if (resp && resp.status === 200 && Array.isArray(resp.data)) {
          setAppointments(resp.data)
        } else if (Array.isArray(resp)) {
          setAppointments(resp)
        } else {
          setAppointments([])
        }
      } else if (typeof api.getAppointmentsForAllDoctors === 'function') {
        // No doctor filter: fetch all doctors for selected date
        const resp = await api.getAppointmentsForAllDoctors(selectedDate)
        if (resp && resp.status === 200 && Array.isArray(resp.data)) {
          setAppointments(resp.data)
        } else if (Array.isArray(resp)) {
          // fallback old shape
          setAppointments(resp)
        } else {
          setAppointments([])
        }
      } else if (typeof api.getAppointments === 'function') {
        // fallback to older helper
        const list = await api.getAppointments()
        if (Array.isArray(list)) setAppointments(list)
      } else {
        // demo fallback: small delay
        await new Promise((r) => setTimeout(r, 200))
      }
    } catch (err) {
      console.warn('loadAppointments failed', err)
    } finally {
      setLoadingAppointments(false)
    }
  }

  async function onBookSubmit(e) {
    e.preventDefault()
    if (!bookingPatientId) return alert('Please enter patient ID')
    if (!bookingDoctorId) return alert('Please enter doctor ID')
    if (!bookingAppointmentDate) return alert('Please select appointment date')
    if (!bookingStartTime || !bookingEndTime) return alert('Please select start and end times')
    if (bookingStartTime >= bookingEndTime) return alert('End time must be after start time')

    const payload = {
      patientId: bookingPatientId,
      doctorId: bookingDoctorId,
      appointmentDate: bookingAppointmentDate,
      startTime: bookingStartTime,
      endTime: bookingEndTime,
      notes: bookingNotes
    }
    try {
      let response = null
      if (typeof api.bookAppointment === 'function') {
        response = await api.bookAppointment(payload)
      }
      
      // Check if response has status code (new format)
      if (response && response.status === 201) {
        setAppointments((prev) => [response.data, ...prev])
        alert('Appointment booked successfully')
        // Reset form
        setBookingPatientId('')
        setBookingDoctorId('')
        setBookingAppointmentDate('')
        setBookingStartTime('')
        setBookingEndTime('')
        setBookingNotes('')
      } else if (response && response.status === 404) {
        alert('Error: ' + (response.message || 'Appointment not found'))
      } else if (response && response.status === 409) {
        alert('Error: ' + (response.message || 'Appointment already exists or doctor is unavailable'))
      } else if (response && response.data) {
        // Fallback for old response format
        setAppointments((prev) => [response.data, ...prev])
        alert('Appointment booked')
        setBookingPatientId('')
        setBookingDoctorId('')
        setBookingAppointmentDate('')
        setBookingStartTime('')
        setBookingEndTime('')
        setBookingNotes('')
      } else {
        // Last resort fallback
        const created = { id: Date.now(), ...payload }
        setAppointments((prev) => [created, ...prev])
        alert('Appointment booked')
        setBookingPatientId('')
        setBookingDoctorId('')
        setBookingAppointmentDate('')
        setBookingStartTime('')
        setBookingEndTime('')
        setBookingNotes('')
      }
    } catch (err) {
      console.warn('bookAppointment failed', err)
      alert('Unable to book appointment (demo mode)')
    } finally {
      setBookingPatientId('')
      setBookingDoctorId('')
      setBookingAppointmentDate('')
      setBookingStartTime('')
      setBookingEndTime('')
      setBookingNotes('')
      setShowBooking(false)
    }
  }

  async function handleCancelAppointment(id) {
    if (!confirm('Cancel this appointment?')) return
    try {
      let response = null
      if (typeof api.cancelAppointment === 'function') {
        response = await api.cancelAppointment(id)
      }
      
      // Check if response has status code (new format)
      if (response && response.status === 404) {
        alert('Error: ' + (response.message || 'Appointment not found'))
        return
      }
      
      // Success (status 200 or no status in fallback)
      setAppointments((prev) => prev.filter((a) => (a.appointmentId || a.id) !== id))
      alert('Appointment cancelled successfully')
    } catch (err) {
      console.warn('cancelAppointment failed', err)
      alert('Unable to cancel appointment')
    }
  }


  /* ---------- Rooms & Beds ---------- */
  async function loadRooms() {
    try {
        const r = await api.getAllRooms()
        if (Array.isArray(r)) setRooms(r)
    } catch (err) {
      console.warn('loadRooms failed', err)
    }
  }

  async function loadBeds() {
    try {
      if (typeof api.getBeds === 'function') {
        const b = await api.getBeds()
        if (Array.isArray(b)) {
          // Normalize beds so frontend always sees `number`, `available`, `roomId`, `id`
          const norm = b.map((bed, idx) => ({
            id: bed.id || bed.bedId || `bed-${idx}`,
            number: bed.number || bed.bedNumber,
            available: bed.available !== undefined ? bed.available : (bed.occupied !== undefined ? !bed.occupied : true),
            roomNumber: bed.roomNumber,
            roomId: bed.roomId,
            occupied: bed.occupied,
            history: bed.history || []
          }))
          setBeds(norm)
        }
      }
    } catch (err) {
      console.warn('loadBeds failed', err)
    }
  }


  function handleEditingRoom(r) {
    setShowAddRoom(true)
    setEditingRoomNumber(r.roomNumber)
    setNewRoomFloor(Math.floor((r.roomNumber || r.number) / 100))
    setNewRoomNumber(r.roomNumber)
    setNewRoomType(r.roomType || 'GENERAL')
    setNewRoomCapacity(r.roomCapacity || 1)
    setNewRoomBeds((r.beds || []).map(b => ({ number: b.number, available: !!b.available })))
  }

  async function handleDeleteRoom(r) {
    if (!confirm('Delete room ' + (r.roomNumber || r.number) + '?')) return
    try {
      if (typeof api.deleteRoomByNumber === 'function') await api.deleteRoomByNumber(r.roomNumber || r.number)
      setRooms(prev => prev.filter(x => String(x.roomNumber) !== String(r.roomNumber || r.number)))
      alert('Room deleted')
    } catch (err) {
      console.warn('deleteRoom failed', err)
      alert('Unable to delete room')
    }
  }

  //ADDING AND UPDATING ROOMS AND BEDS
  async function onAddRoomSubmit(e) {
    e.preventDefault()
    if (newRoomFloor === '' || newRoomFloor === null) return alert('Please enter/select floor')
    if (!newRoomNumber && newRoomNumber !== 0) return alert('Please enter room number')
    if (!newRoomType) return alert('Please enter room type')
    if (!newRoomCapacity || isNaN(Number(newRoomCapacity)) || Number(newRoomCapacity) <= 0) return alert('Please enter valid room capacity')

    // ensure room number starts with floor (integer division by 100)
    if (Math.floor(Number(newRoomNumber) / 100) !== Number(newRoomFloor)) return alert('Room does not belong to selected floor')

    // beds validation only for new rooms (not for edits)
    if (!editingRoomNumber) {
      // beds must be present and match capacity; each must have a numeric bed number (long) and belong to the room
      if (!Array.isArray(newRoomBeds) || newRoomBeds.length !== Number(newRoomCapacity)) return alert(`Please ensure bed count equals capacity (${newRoomCapacity})`)
      for (const [idx, b] of newRoomBeds.entries()) {
        if (b.number === undefined || b.number === null || b.number === '' || !Number.isInteger(Number(b.number)) || Number(b.number) <= 0) return alert(`Please enter a valid numeric bed number for bed #${idx + 1}`)
        if (Math.floor(Number(b.number) / 100) !== Number(newRoomNumber)) return alert(`Bed ${b.number} does not belong to room ${newRoomNumber}`)
      }
    }
    console.log("Values in b", newRoomBeds);

    // For adding new rooms, include beds; for updates, exclude beds to avoid Hibernate detached collection issues
    const payload = editingRoomNumber ? {
      "roomNumber": Number(newRoomNumber),
      "roomType": newRoomType,
      "roomCapacity": Number(newRoomCapacity)
    } : {
      "roomNumber": Number(newRoomNumber),
      "roomType": newRoomType,
      "roomCapacity": Number(newRoomCapacity),
      "beds": newRoomBeds.map((b) => ({ "bedNumber": b.number, "isOccupied": b.available, "roomNumber": Number(newRoomNumber) }))
    }
    
    console.log("Payload being sent:", payload);

    try {
      let resp = null
      if (editingRoomNumber) {
        resp = await api.updateRoomByNumber(editingRoomNumber, payload)
        if (!resp) throw new Error('Update failed')
        setRooms((prev) => prev.map((r) => (String(r.roomNumber) === String(editingRoomNumber) ? resp : r)))
        alert('Room updated')
      } else {
        if (typeof api.addRoom === 'function') {
          resp = await api.addRoom(payload)
        }
        if (!resp) resp = { id: Date.now(), ...payload }
        setRooms((prev) => [resp, ...prev])
        alert('Room added')
      }

      // reset form
      setNewRoomNumber('')
      setNewRoomType('General')
      setNewRoomCapacity(1)
      setNewRoomBeds([])
      setEditingRoomNumber(null)
      setShowAddRoom(false)
    } catch (err) {
      console.warn('add/update Room failed', err)
      alert('Unable to add/update room (demo mode)')
    }
  }

  async function onAddBedSubmit(e) {
    e.preventDefault()
    if (!newBedNumber || !newBedRoomId) return alert('Please choose room and bed number')
    // numeric validation
    if (!Number.isInteger(Number(newBedNumber)) || Number(newBedNumber) <= 0) return alert('Please enter a valid numeric bed number')
      const selRoom = rooms.find(r => String(r.roomNumber || r.number) === String(newBedRoomId))
    if (!selRoom) return alert('Selected room not found')
    const selRoomNumber = Number(selRoom.roomNumber || selRoom.number)
    if (Math.floor(Number(newBedNumber) / 100) !== selRoomNumber) return alert('Bed does not belong to selected room')
    try {
      let created = null
      // roomId: prefer actual DB id if available, otherwise use roomNumber
      const payload = { bedNumber: Number(newBedNumber), roomNumber: selRoom.id || Number(newBedRoomId), occupied: false }
      if (typeof api.addBed === 'function') created = await api.addBed(payload)

      // If backend returns an error-shaped response (common patterns), show message and abort
      if (created && (created.success === false || created.status === 400 || created.status === 409 || (created.message && !created.id && !created.number && !created.bedNumber))) {
        const msg = (created && (created.message || created.error)) || 'Unable to add bed: server returned an error'
        alert(msg)
        return
      }

      if (!created) created = { id: Date.now(), history: [], ...payload }

      // Normalize created bed object so UI never receives undefined fields
      const normalized = {
        id: created.id || created.bedId || `bed-${Date.now()}`,
        number: created.number || created.bedNumber || Number(newBedNumber),
        bedNumber: created.bedNumber || created.number || Number(newBedNumber),
        roomNumber: created.roomNumber || selRoom.roomNumber || selRoom.number || Number(newBedRoomId),
        roomId: created.roomId || selRoom.id,
        available: created.available !== undefined ? created.available : (created.occupied !== undefined ? !created.occupied : true),
        occupied: created.occupied !== undefined ? created.occupied : !(created.available !== undefined ? created.available : false),
        history: created.history || []
      }

      setBeds((prev) => [normalized, ...prev])
      // also add to room's beds list in UI state (match by roomNumber)
      setRooms((prev) => prev.map((r) => (String(r.roomNumber || r.number) === String(newBedRoomId)) ? { ...r, beds: [...(r.beds||[]), { id: normalized.id, number: normalized.number, available: normalized.available }] } : r))
      setNewBedNumber('')
      setNewBedRoomId('')
      setShowAddBed(false)
    } catch (err) {
      console.warn('addBed failed', err)
      const msg = err?.response?.data || err?.message || 'Unable to add bed'
      alert(msg)
    }
  }

  async function handleAssignBed(bed) {
    const patientId = prompt('Enter patient ID to assign this bed to:')
    if (!patientId) return
    
    // Validate that patientId exists in patients list
    const patientExists = patients.some(p => String(p.id || p.patientId) === String(patientId))
    if (!patientExists) {
      alert('Patient ID not found. Please enter a valid patient ID.')
      return
    }
    
    try {
      let updated = null
      const bedNumber = bed.number || bed.bedNumber
      if (typeof api.assignBed === 'function') updated = await api.assignBed(Number(bedNumber), Number(patientId), 'receptionist')
      if (!updated) {
        // local fallback - preserve all existing bed properties including roomNumber
        setBeds((prev) => prev.map((b) => (b.id === bed.id ? { ...b, available: false, occupied: true, patientId: Number(patientId), history: [{ action: 'assign', patientId: Number(patientId), by: 'receptionist', at: new Date().toISOString() }, ...(b.history || [])] } : b)))
      } else {
        // Update the bed in the beds list with the response from backend, preserving original bed info if response is incomplete
        const normalizedUpdated = {
          id: updated.id || bed.id,
          number: updated.number || updated.bedNumber || bed.number,
          bedNumber: updated.bedNumber || updated.number || bed.number,
          roomNumber: updated.roomNumber || bed.roomNumber,
          roomId: updated.roomId || bed.roomId,
          available: updated.available !== undefined ? updated.available : (updated.occupied !== undefined ? !updated.occupied : false),
          occupied: updated.occupied !== undefined ? updated.occupied : true,
          patientId: updated.patientId || Number(patientId),
          history: updated.history || []
        }
        setBeds((prev) => prev.map((b) => (b.id === bed.id || (b.number === normalizedUpdated.number && b.roomNumber === normalizedUpdated.roomNumber) ? normalizedUpdated : b)))
      }
      alert('Bed assigned')
    } catch (err) {
      console.warn('assignBed failed', err)
      alert('Unable to assign bed')
    }
  }

  async function handleVacateBed(bed) {
    if (!confirm('Vacate this bed?')) return
    try {
      let updated = null
      const bedNumber = bed.number || bed.bedNumber
      // Determine room number: prefer explicit roomNumber on bed, otherwise try to find via rooms list
      const roomNumber = bed.roomNumber || bed.roomId || (rooms.find(r => Array.isArray(r.beds) && r.beds.some(rb => rb.id === bed.id)) || {}).roomNumber || (bed.roomNumber || bed.roomId)

      if (typeof api.vacateBed === 'function') updated = await api.vacateBed(Number(roomNumber), Number(bedNumber), 'receptionist')
      if (!updated) {
        setBeds((prev) => prev.map((b) => (b.id === bed.id ? { ...b, available: true, occupied: false, history: [{ action: 'vacate', by: 'receptionist', at: new Date().toISOString() }, ...(b.history || [])] } : b)))
      } else {
        const normalized = {
          id: updated.id || bed.id,
          number: updated.number || updated.bedNumber || bed.number,
          bedNumber: updated.bedNumber || updated.number || bed.number,
          roomNumber: updated.roomNumber || roomNumber,
          roomId: updated.roomId || bed.roomId,
          available: updated.available !== undefined ? updated.available : true,
          occupied: updated.occupied !== undefined ? updated.occupied : false,
          history: updated.history || []
        }
        setBeds((prev) => prev.map((b) => (b.id === bed.id || (b.number === normalized.number && b.roomNumber === normalized.roomNumber) ? normalized : b)))
      }
      alert('Bed vacated')
    } catch (err) {
      console.warn('vacateBed failed', err)
      alert('Unable to vacate bed')
    }
  }

  async function handleDeleteBed(bed) {
    if (!confirm(`Delete bed ${bed.number}?`)) return
    try {
      const bedNumber = bed.number || bed.bedNumber
      const roomForBed = rooms.find(r => r.beds && r.beds.some(rb => rb.id === bed.id))
      const roomNumber = roomForBed ? (roomForBed.roomNumber || roomForBed.number) : bed.roomNumber
      
      if (!bedNumber || !roomNumber) {
        alert('Missing bed or room number for deletion')
        return
      }
      
      if (typeof api.deleteBed === 'function') {
        await api.deleteBed(Number(bedNumber), Number(roomNumber))
      }
      
      setBeds((prev) => prev.filter((b) => b.id !== bed.id))
      setRooms((prev) => prev.map((r) => ({
        ...r,
        beds: Array.isArray(r.beds) ? r.beds.filter((rb) => rb.id !== bed.id) : []
      })))
      alert('Bed deleted')
    } catch (err) {
      console.warn('deleteBed failed', err)
      alert('Unable to delete bed')
    }
  }

  async function viewBedHistory(bedNumber) {
    setSelectedBed(bedNumber)
    try {
      if (typeof api.getBedHistory === 'function') {
        const h = await api.getBedHistory(Number(bedNumber))
        setBedHistory(Array.isArray(h) ? h : [])
      } else {
        const b = beds.find((x) => String(x.number) === String(bedNumber) || String(x.bedNumber) === String(bedNumber) || String(x.id) === String(bedNumber))
        setBedHistory(b ? (b.history || []).map((hh, idx) => ({ bedNumber: b.number || b.bedNumber || bedNumber, patientId: hh.patientId || null, assignedAt: hh.at || null, vacatedAt: hh.vacatedAt || null, bedAssignmentHistoryId: idx })) : [])
      }
      setShowBedHistory(true)
    } catch (err) {
      console.warn('getBedHistory failed', err)
      alert('Unable to fetch bed history (demo mode)')
    }
  }

  /* Derived filtered patients */
  const filteredPatients = Array.isArray(patients) ? patients.filter((p) => {
    if (searchName && !String(p.patientName || p.name || '').toLowerCase().includes(searchName.toLowerCase())) return false
    if (searchPatientId && String(p.id || p.patientId) !== String(searchPatientId)) return false
    if (filterGender && (String(p.gender || '')).toLowerCase() !== filterGender.toLowerCase()) return false
    if (filterCity && !String(p.city || (p.patientAddress && p.patientAddress.city) || '').toLowerCase().includes(filterCity.toLowerCase())) return false
    return true
  }) : []

  /* Quick UX: pre-fill booking form from a patient row */
  function startBookingForPatient(p) {
    setBookingPatientId(p.id)
    setShowBooking(true)
  }

  return (
    <div className="h-100 d-flex flex-column bg-light">
      <div className="py-4 border-bottom bg-white">
        <div className="container d-flex align-items-center justify-content-between">
          <div>
            <h3 className="mb-0">Receptionist Dashboard</h3>
            <small className="text-muted">Manage bookings, patients, rooms & beds</small>
          </div>

          <div className="d-flex align-items-center">
            <button className="btn btn-outline-secondary me-2 d-flex align-items-center" onClick={refreshPatients} disabled={loadingPatients}>
              {loadingPatients ? (<><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Refreshing...</>) : 'Refresh'}
            </button>
            <button className="btn btn-outline-primary me-2" onClick={handleShowPatientsClick}>
              {showPatients ? 'Hide Patients' : 'Show Patients'}
            </button>
            <button className="btn btn-outline-info" onClick={handleShowRoomsClick}>
              {showRoomsPanel ? 'Hide Rooms' : 'Manage Rooms & Beds'}
            </button>
          </div>
        </div>
      </div>

      <div className="container flex-grow-1 d-flex flex-column py-4 overflow-auto min-h-0">

        <div className="mb-3 d-flex gap-2">
          <button className="btn btn-primary" onClick={onAddPatient}>Add Patient</button>
          <button className="btn btn-success" onClick={() => setShowBooking((s) => !s)}>{showBooking ? 'Cancel Booking' : 'Book Appointment'}</button>
        </div>

        {/* Patient Details (read-only) */}
        {showPatientDetails && selectedPatient && (
          <div className="card mb-3" ref={patientDetailsRef}>
            <div className="card-body">
              <h5 className="card-title">Patient details</h5>

              <div className="row g-2 mb-2">
                <div className="col-md-2"><small className="text-muted fw-semibold">ID</small><div>{selectedPatient.id || selectedPatient.patientId}</div></div>
                <div className="col-md-4"><small className="text-muted fw-semibold">Name</small><div>{selectedPatient.patientName || selectedPatient.name}</div></div>
                <div className="col-md-2"><small className="text-muted fw-semibold">Gender</small><div>{selectedPatient.gender || ''}</div></div>
                <div className="col-md-4"><small className="text-muted fw-semibold">Phone</small><div>{selectedPatient.patientPhoneNumber || selectedPatient.phone || ''}</div></div>
              </div>

              <div className="row g-2 mb-2">
                <div className="col-md-4"><small className="text-muted fw-semibold">Email</small><div>{selectedPatient.patientEmail || selectedPatient.email || ''}</div></div>
                <div className="col-md-4"><small className="text-muted fw-semibold">DOB</small><div>{selectedPatient.dateOfBirth || selectedPatient.dob || ''}</div></div>
                <div className="col-md-4"><small className="text-muted fw-semibold">City</small><div>{selectedPatient.city || (selectedPatient.patientAddress && selectedPatient.patientAddress.city) || ''}</div></div>
              </div>

              <div className="d-flex gap-2 mt-3">
                {selectedPatientEditable && (
                  <button className="btn btn-primary" onClick={startEditingFromDetails}>Edit</button>
                )}
                <button className="btn btn-secondary" onClick={closePatientDetails}>Close</button>
              </div>

            </div>
          </div>
        )}

        {/* Add / Edit Patient Form (used for both create and edit) */}
        {(showAddPatient || showEditPatient) && (
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{editingPatientId ? 'Edit Patient' : 'Add New Patient'}</h5>
              <form onSubmit={onAddPatientSubmit}>
                <div className="row g-2 mb-3">
                  {editingPatientId && (
                    <div className="mb-3">
                      <label className="form-label">Patient ID</label>
                      <input className="form-control" value={editingPatientId} readOnly />
                    </div>
                  )}
                  <div className="col-md-6">
                    <label className="form-label">Patient name</label>
                    <input className="form-control" value={patientName} onChange={(e) => setPatientName(e.target.value)} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Gender</label>
                    <select className="form-select" value={gender} onChange={(e) => setGender(e.target.value)}>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Date of birth</label>
                    <input type="date" className="form-control" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                  </div>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-md-4">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={patientEmail} onChange={(e) => setPatientEmail(e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Phone number</label>
                    <input className="form-control" value={patientPhoneNumber} onChange={(e) => setPatientPhoneNumber(e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Pin code</label>
                    <input className="form-control" value={pinCode} onChange={(e) => setPinCode(e.target.value)} />
                  </div>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-md-4">
                    <label className="form-label">Door number</label>
                    <input className="form-control" value={doorNumber} onChange={(e) => setDoorNumber(e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Landmark</label>
                    <input className="form-control" value={landmark} onChange={(e) => setLandmark(e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">City</label>
                    <input className="form-control" value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">State</label>
                    <input className="form-control" value={stateVal} onChange={(e) => setStateVal(e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Country</label>
                    <input className="form-control" value={country} onChange={(e) => setCountry(e.target.value)} />
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-success" type="submit">{editingPatientId ? 'Update Patient' : 'Submit Patient'}</button>
                  <button type="button" className="btn btn-secondary" onClick={() => { setShowAddPatient(false); setShowEditPatient(false); setEditingPatientId(null) }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Patients panel */}
        {showPatients && (
          <div className="card mb-3" ref={patientsRef}>
            <div className="card-body">
              <h5 className="card-title">Patients <span className="badge bg-primary ms-2">{filteredPatients.length}</span></h5>
              <small className="text-muted d-block">Showing up to 5 patients — scroll to see more</small>

              <div className="row g-2 mb-3 align-items-center">
                <div className="col-md-7">
                  <div className="input-group shadow-sm rounded-pill overflow-hidden" style={{ border: '1px solid #e9ecef' }}>
                    <span className="input-group-text bg-white border-0" style={{ borderRight: '1px solid #e9ecef' }}>🔍</span>
                    <input className="form-control border-0" placeholder="Search by name" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
                    <input className="form-control border-0" placeholder="Patient ID" value={searchPatientId} onChange={(e) => setSearchPatientId(e.target.value)} style={{ maxWidth: '160px' }} />
                    <button className="btn btn-primary rounded-pill ms-2" type="button" onClick={() => { /* keeps behavior reactive */ }}>Search</button>
                  </div>
                </div>

                <div className="col-md-3 d-flex gap-2">
                  <select className="form-select" value={filterGender} onChange={(e) => setFilterGender(e.target.value)} style={{ maxWidth: '140px' }}>
                    <option value="">All genders</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <input className="form-control" placeholder="City" value={filterCity} onChange={(e) => setFilterCity(e.target.value)} />
                </div>

                <div className="col-md-2 d-flex flex-column align-items-end justify-content-center">
                  <button className="btn btn-outline-secondary" onClick={() => { setSearchName(''); setSearchPatientId(''); setFilterGender(''); setFilterCity('') }}>Clear</button>
                </div>
              </div>

              <div className="table-responsive" style={{ maxHeight: 240, overflowY: 'auto' }}>
                <table className="table table-hover mb-0">
                  <thead>
                    <tr><th>ID</th><th>Name</th><th>Gender</th><th>Phone</th><th>Email</th><th>City</th><th className="text-end">Actions</th></tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map(p => (
                      <tr key={p.id || p.patientId}>
                        <td>{p.id || p.patientId}</td>
                        <td>{p.patientName || p.name}</td>
                        <td>{p.gender || ''}</td>
                        <td>{p.patientPhoneNumber || p.phone || ''}</td>
                        <td>{p.patientEmail || p.email || ''}</td>
                        <td>{p.city || (p.patientAddress && p.patientAddress.city) || ''}</td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => onEditPatientClick(p)}>Edit</button>
                          <button className="btn btn-sm btn-success me-2" onClick={() => startBookingForPatient(p)}>Book</button>
                          <button className="btn btn-sm btn-info" onClick={() => onViewPatientClick(p)}>View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Booking panel */}
        {showBooking && (
          <div className="card mb-3" ref={bookingRef}>
            <div className="card-body">
              <h5 className="card-title">Book Appointment</h5>
              <form onSubmit={onBookSubmit}>
                <div className="row g-2 mb-3">
                  <div className="col">
                    <label className="form-label">Patient ID</label>
                    <input className="form-control" value={bookingPatientId} onChange={(e) => setBookingPatientId(e.target.value)} placeholder="Enter patient ID" />
                  </div>
                  <div className="col" >
                    <label className="form-label">Doctor ID</label>
                    <input className="form-control" value={bookingDoctorId} onChange={(e) => setBookingDoctorId(e.target.value)} />
                  </div>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-md-4">
                    <label className="form-label">Appointment date</label>
                    <input type="date" className="form-control" value={bookingAppointmentDate} onChange={(e) => setBookingAppointmentDate(e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Start time</label>
                    <input type="time" className="form-control" value={bookingStartTime} onChange={(e) => setBookingStartTime(e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">End time</label>
                    <input type="time" className="form-control" value={bookingEndTime} onChange={(e) => setBookingEndTime(e.target.value)} />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Notes</label>
                  <textarea className="form-control" value={bookingNotes} onChange={(e) => setBookingNotes(e.target.value)} rows={3}></textarea>
                </div> 

                <div className="d-flex gap-2">
                  <button className="btn btn-success" type="submit">Confirm Booking</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowBooking(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Appointments list */}
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Upcoming appointments</h5>
            <div className="mb-3 d-flex gap-2 align-items-end">
              <div style={{ maxWidth: 200 }}>
                <label className="form-label mb-1">Select date</label>
                <input type="date" className="form-control" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
              </div>
              <div style={{ maxWidth: 240 }} className="ms-3">
                <label className="form-label mb-1">Doctor ID (optional)</label>
                <input className="form-control" placeholder="Enter doctor id" value={filterDoctorId} onChange={(e) => setFilterDoctorId(e.target.value)} />
              </div>
              <div className="ms-2" style={{ alignSelf: 'flex-end' }}>
                <button className="btn btn-outline-secondary" onClick={loadAppointments}>Refresh</button>
              </div>
            </div>

            <div className="table-responsive overflow-auto" style={{ maxHeight: 320 }}>
                <AppointmentList
                  appointments={appointments}
                  loading={loadingAppointments}
                  onView={async (a) => {
                    try {
                      const appointmentId = a.appointmentId || a.id
                      const resp = await api.getAppointmentDetails(appointmentId)
                      if (resp && resp.status === 200 && resp.data) {
                        setSelectedPatient(resp.data)
                        setSelectedPatientEditable(false)
                        setShowPatientDetails(true)
                      } else if (resp && resp.status === 404) {
                        alert('Error: ' + (resp.message || 'Appointment not found'))
                      } else {
                        alert('Unable to fetch appointment details')
                      }
                    } catch (err) {
                      console.warn('view appointment failed', err)
                      alert('Unable to fetch appointment details')
                    }
                  }}
                  onReschedule={(a) => {
                    setSelectedAppointmentForReschedule(a)
                    setShowRescheduleModal(true)
                  }}
                  onCancel={(id) => handleCancelAppointment(id)}
                  emptyMessage={'No upcoming appointments for this date.'}
                />
            </div>

          </div>
        </div>

        {/* Rooms & Beds management */}
        {showRoomsPanel && (
          <div className="card mb-3" ref={roomsRef}>
            <div className="card-body">
              <h5 className="card-title">Rooms & Beds</h5>

              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="d-flex gap-2 mb-2">
                    <button className="btn btn-outline-primary" onClick={() => setShowAddRoom((s) => !s)}>{showAddRoom ? 'Close Room Form' : 'Add Room'}</button>
                    <button className="btn btn-outline-primary" onClick={() => setShowAddBed((s) => !s)}>{showAddBed ? 'Close Bed Form' : 'Add Bed'}</button>
                  </div>
                  {showAddRoom && (
                    <form className="mb-3" onSubmit={onAddRoomSubmit}>
                      <div className="row g-2">
                        {!editingRoomNumber && (
                          <>
                            <div className="col-md-2">
                              <label className="form-label">Floor</label>
                              <input list="floors" className="form-control" placeholder="Floor" value={newRoomFloor} onChange={(e) => { const val = e.target.value; setNewRoomFloor(val === '' ? '' : Number(val)); /* reset dependent fields when floor changed */ setNewRoomNumber(''); setNewRoomBeds([]); setRoomError('') }} />
                              <datalist id="floors">
                                {Array.from({ length: 10 }).map((_, i) => <option key={i+1} value={i+1} />)}
                              </datalist>
                            </div>

                            <div className="col-md-10">
                              <label className="form-label">Room number <small className="text-muted">(numeric; must start with selected floor — e.g., 205)</small></label>
                              <div className="d-flex gap-2 flex-wrap">

                                <div className="ms-2" style={{ minWidth: 220 }}>
                                  <input list="roomNumbers" ref={newRoomNumberInputRef} className="form-control" placeholder="Select or enter room number" type="number" value={newRoomNumber} onChange={(e) => {
                                    const val = e.target.value
                                    setNewRoomNumber(val === '' ? '' : Number(val))
                                    setRoomError('')
                                    // if user enters a room not matching floor, clear beds and show error
                                    if (val !== '' && Number.isFinite(Number(val)) && newRoomFloor !== '' && Math.floor(Number(val) / 100) !== Number(newRoomFloor)) {
                                      setRoomError('Room number must start with selected floor')
                                      setNewRoomBeds([])
                                    }
                                  }} required min="1" disabled={newRoomFloor === ''} />
                                  <datalist id="roomNumbers">
                                    {Array.from({ length: 10 }).map((_, i) => {
                                      const num = (Number(newRoomFloor) * 100) + (i + 1)
                                      return (<option key={num} value={num} />)
                                    })}
                                  </datalist>
                                  {roomError && <div className="text-danger small mt-1">{roomError}</div>}
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {editingRoomNumber && (
                          <div className="col-md-4">
                            <label className="form-label">Room Number</label>
                            <input type="number" className="form-control" value={newRoomNumber} readOnly disabled style={{ backgroundColor: '#e9ecef' }} />
                          </div>
                        )}

                        <div className={editingRoomNumber ? "col-md-4" : "col-md-3"}>
                          <label className="form-label">Type</label>
                          <select className="form-select" value={newRoomType} onChange={(e) => setNewRoomType(e.target.value)} required>
                            <option value="">Select type</option>
                            <option value="GENERAL">General</option>
                            <option value="ICU">ICU</option>
                            <option value="PRIVATE">Private</option>
                            <option value="DELUXE">Deluxe</option>
                          </select>
                        </div>

                        <div className={editingRoomNumber ? "col-md-4" : "col-md-2"}>
                          <label className="form-label">Capacity</label>
                          <input className="form-control" placeholder="Capacity" type="number" value={newRoomCapacity} onChange={(e) => {
                            const val = Number(e.target.value); setNewRoomCapacity(val);
                            setNewRoomBeds(prev => {
                              const cur = Array.isArray(prev) ? prev.slice(0, val) : []
                              const base = Number(newRoomNumber) || (Number(newRoomFloor) * 100) || 0
                              for (let i = cur.length; i < val; i++) { cur.push({ number: base * 100 + (i + 1), available: true }) }
                              return cur.map((b, idx) => ({ number: b.number !== undefined ? b.number : base * 100 + (idx + 1), available: b.available !== undefined ? b.available : true }))
                            })
                          }} required min="1" />
                        </div>
                      </div> 

                      {!editingRoomNumber && (
                        <div className="mt-2">
                          <label className="form-label">Beds (exactly equal to capacity) <small className="text-muted">(Numeric: roomNumber*100 + index (e.g., 20501))</small></label>
                          {newRoomBeds.map((b, idx) => (
                            <div className="input-group mb-2" key={idx}>
                              <input type="number" className="form-control" placeholder="e.g., 20501" value={b.number || ''} onChange={(e) => { const val = e.target.value === '' ? '' : Number(e.target.value); const arr = [...newRoomBeds]; arr[idx] = { ...arr[idx], number: val }; setNewRoomBeds(arr) }} required min="1" />
                              <select className="form-select" value={b.available ? 'yes' : 'no'} onChange={(e) => { const arr = [...newRoomBeds]; arr[idx] = { ...arr[idx], available: e.target.value === 'yes' }; setNewRoomBeds(arr) }}>
                                <option value="yes">Available</option>
                                <option value="no">Not available</option>
                              </select>
                            </div>
                          ))}

                          <div className="form-text">Bed count is driven by Capacity; to change beds, update Capacity.</div>
                        </div>
                      )}

                      <div className="d-flex gap-2 mt-2">
                        <button className="btn btn-success" type="submit">{editingRoomNumber ? 'Update Room' : 'Add Room'}</button>
                        <button type="button" className="btn btn-secondary" onClick={() => { setShowAddRoom(false); setEditingRoomNumber(null); setNewRoomNumber(''); setNewRoomType('General'); setNewRoomCapacity(1); setNewRoomBeds([]) }}>Cancel</button>
                      </div>
                    </form>
                  )}

                  {showAddBed && (
                    <form className="mb-3" onSubmit={onAddBedSubmit}>
                      <div className="row g-2">
                        <div className="col">
                          <input className="form-control" placeholder="Enter Bed Number" value={newBedNumber} onChange={(e) => setNewBedNumber(e.target.value)} />
                          <div className="form-text">Enter numeric bed number that starts with the room number (e.g., 20501)</div>
                        </div>
                        <div className="col" style={{ maxWidth: 220 }}>
                          <select className="form-select" value={newBedRoomId} onChange={(e) => setNewBedRoomId(e.target.value)}>
                            <option value="">Select room</option>
                            {rooms.map(r => (<option key={r.roomNumber || r.number} value={r.roomNumber || r.number}>{r.roomType || r.name} ({r.roomNumber || r.number})</option>))}
                          </select>
                        </div>
                        <div className="col-auto">
                          <button className="btn btn-success" type="submit">Add Bed</button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <h6>Rooms</h6>
                  <ul className="list-group mb-3">
                    {(() => {
                      const byFloor = rooms.reduce((acc, r) => {
                        const num = r.roomNumber || r.number || 0
                        const floor = Math.floor(num / 100) || 0
                        acc[floor] = acc[floor] || []
                        acc[floor].push(r)
                        return acc
                      }, {})
                      return Object.keys(byFloor).length === 0 ? (
                        <li className="list-group-item text-muted">No rooms yet</li>
                      ) : Object.keys(byFloor).sort((a,b)=>a-b).map((floor) => (
                        <li key={`floor-${floor}`} className="list-group-item">
                          <div className="mb-2"><strong>Floor {floor}</strong>{byFloor[floor].length > 3 && <small className="text-muted">(Scroll right to view more rooms)</small>}</div>
                          <div className="d-flex gap-2 flex-nowrap overflow-auto" style={{whiteSpace:"nowrap"}}>
                            {byFloor[floor].map((r) => (
                              <div key={r.id} className="card p-2 me-2 mb-2" style={{ minWidth: 180 }}>
                                <div><strong>{r.roomType || r.name}</strong> <small className="text-muted">({r.roomNumber || r.number})</small></div>
                                <div className="text-muted" style={{ fontSize: 12 }}>Capacity: {r.roomCapacity || '-'} • Beds: {Array.isArray(r.beds) ? r.beds.length : 0}</div>
                                <div className="mt-2 d-flex gap-2">
                                  <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditingRoom(r)}>Edit</button>
                                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteRoom(r)}>Delete</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </li>
                      ))
                    })()}
                  </ul>
                </div>

                <div className="col-md-6">
                  <h6>Beds</h6>
                  <div className="table-responsive" style={{ maxHeight: 240 }}>
                    <table className="table table-sm table-hover mb-0">
                      <thead>
                        <tr><th>Bed</th><th>Room</th><th>Available</th><th className="text-end">Actions</th></tr>
                      </thead>
                      <tbody>
                        {beds.map(b => {
                          const roomForBed = rooms.find(r => (r.roomNumber || r.number) === b.roomNumber)
                          const roomDisplay = roomForBed ? `${roomForBed.roomType || roomForBed.name} (${roomForBed.roomNumber || roomForBed.number})` : `Room ${b.roomNumber}`
                          return (
                            <tr key={b.id}>
                              <td>{b.number}</td>
                              <td>{roomDisplay}</td>
                              <td>{b.available ? 'Yes' : 'No'}</td>
                              <td className="text-end">
                                <button className="btn btn-sm btn-outline-success me-2" onClick={() => handleAssignBed(b)} disabled={!b.available}>Assign</button>
                                <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleVacateBed(b)} disabled={b.available}>Vacate</button>
                                <button className="btn btn-sm btn-outline-info me-2" onClick={() => viewBedHistory(b.number || b.bedNumber)}>{'History'}</button>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteBed(b)}>Delete</button>
                              </td>
                            </tr>
                          )
                        })}
                        {beds.length === 0 && <tr><td colSpan="4" className="text-muted">No beds yet</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Bed history modal-like area */}
              {showBedHistory && (
                <div className="card mt-3">
                  <div className="card-body">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="mb-0">Bed history for {selectedBed}</h6>
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowBedHistory(false)}>Close</button>
                          </div>
                    <ul className="list-group">
                      {bedHistory.length === 0 && <li className="list-group-item text-muted">No history</li>}
                      {bedHistory.map((h, idx) => (
                        <li className="list-group-item" key={idx}>
                          <div><strong>Patient:</strong> {h.patientId || '—'}</div>
                          <div className="text-muted" style={{ fontSize: 12 }}>
                            <div>Assigned: {h.assignedAt ? new Date(h.assignedAt).toLocaleString() : '—'}</div>
                            <div>Vacated: {h.vacatedAt ? new Date(h.vacatedAt).toLocaleString() : '—'}</div>
                          </div>
                          <div className="text-muted" style={{ fontSize: 12 }}>Record ID: {h.bedAssignmentHistoryId || h.id || idx}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>

      {/* Appointment Reschedule Modal */}
      {showRescheduleModal && selectedAppointmentForReschedule && (
        <AppointmentReschedule
          appointment={selectedAppointmentForReschedule}
          onClose={() => {
            setShowRescheduleModal(false)
            setSelectedAppointmentForReschedule(null)
          }}
          onSuccess={(updatedAppointment) => {
            setAppointments((prev) =>
              prev.map((a) =>
                (a.appointmentId || a.id) === (updatedAppointment.appointmentId || updatedAppointment.id)
                  ? updatedAppointment
                  : a
              )
            )
            setShowRescheduleModal(false)
            setSelectedAppointmentForReschedule(null)
            alert('Appointment rescheduled successfully')
          }}
        />
      )}
    </div>
  )
}