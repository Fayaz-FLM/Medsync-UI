import { useState } from "react";
import * as api from "../../../services/api";
import { 
  PATIENTS, 
  COLORS, 
  CARD_STYLES, 
  SEARCH_STYLES, 
  TABLE_STYLES,
  AVATAR_STYLES,
  GENDER_BADGE_STYLES,
  ACTION_BUTTON_STYLES,
  MODAL_STYLES,
  FORM_STYLES,
  DIMENSIONS,
  APPOINTMENTS
} from '../constants/receptionistConstants';

export default function PatientsSection({ 
  patients, 
  onRefresh, 
  showToast, 
  onBookAppointment,
  doctors = []
}) {
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  // Selected data
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedPatientForBooking, setSelectedPatientForBooking] = useState(null);
  
  // Form states
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    patientName: "",
    patientEmail: "",
    patientPhoneNumber: "",
    dateOfBirth: "",
    gender: "",
    patientAddress: { street: "", city: "", state: "", zipCode: "" },
  });

  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    patientId: "",
    doctorId: "",
    appointmentDate: new Date().toISOString().split('T')[0],
    startTime: "",
    endTime: "",
    reasonForVisit: "",
    notes: ""
  });

  // Add patient handler
  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      await api.addPatient({ ...formData, gender: formData.gender.toUpperCase() });
      showToast("Patient added successfully!", "success");
      setShowAddModal(false);
      resetForm();
      onRefresh();
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to add patient", "error");
    }
  };

  // Edit patient handler
  const handleEditPatient = async (e) => {
    e.preventDefault();
    try {
      await api.updatePatient(selectedPatient.patientId, {
        ...formData,
        gender: formData.gender.toUpperCase(),
      });
      showToast("Patient updated successfully!", "success");
      setShowEditModal(false);
      setSelectedPatient(null);
      resetForm();
      onRefresh();
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to update patient", "error");
    }
  };

  // Book appointment handler - THIS IS THE KEY FUNCTION
  const handleBookClick = (patient) => {
    console.log('Book button clicked for patient:', patient);
    setSelectedPatientForBooking(patient);
    setBookingForm({
      patientId: patient.patientId,
      doctorId: "",
      appointmentDate: new Date().toISOString().split('T')[0],
      startTime: "",
      endTime: "",
      reasonForVisit: "",
      notes: ""
    });
    setShowBookingModal(true);
  };

  // Submit booking
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    try {
      const result = await api.bookAppointment(bookingForm);
      if (result.success) {
        showToast("Appointment booked successfully!", "success");
        setShowBookingModal(false);
        setSelectedPatientForBooking(null);
      } else {
        showToast(result.message || "Failed to book appointment", "error");
      }
    } catch (error) {
      showToast("Failed to book appointment", "error");
    }
  };

  // Open edit modal
  const openEditModal = (patient) => {
    setSelectedPatient(patient);
    setFormData({
      patientName: patient.patientName || "",
      patientEmail: patient.patientEmail || "",
      patientPhoneNumber: patient.patientPhoneNumber || "",
      dateOfBirth: patient.dateOfBirth || "",
      gender: patient.gender || "",
      patientAddress: {
        street: patient.patientAddress?.street || "",
        city: patient.patientAddress?.city || "",
        state: patient.patientAddress?.state || "",
        zipCode: patient.patientAddress?.zipCode || "",
      },
    });
    setShowEditModal(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      patientName: "",
      patientEmail: "",
      patientPhoneNumber: "",
      dateOfBirth: "",
      gender: "",
      patientAddress: { street: "", city: "", state: "", zipCode: "" },
    });
  };

  // Filter patients
  const filteredPatients = patients.filter((p) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (
      (p.patientName || "").toLowerCase().includes(s) ||
      (p.patientEmail || "").toLowerCase().includes(s) ||
      (p.patientId || "").toString().includes(s)
    );
  });

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return parts[0].charAt(0).toUpperCase() + parts[parts.length - 1].charAt(0).toUpperCase();
  };

  // Get color for avatar
  const getInitialColor = (index) => {
    return AVATAR_STYLES.colors[index % AVATAR_STYLES.colors.length];
  };

  return (
    <div>
      {/* Header Card */}
      <div className="card border-0 mb-4" style={CARD_STYLES.header}>
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h5 className="mb-0" style={{ fontFamily: "'Inter', sans-serif", fontWeight: "600" }}>
                {PATIENTS.title}
              </h5>
            </div>
            <div className="col-md-6 text-md-end">
              <button className="btn btn-success" onClick={() => setShowAddModal(true)}>
                {PATIENTS.labels.addNew}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="card border-0" style={CARD_STYLES.main}>
        <div className="card-body">
          {/* Search Bar */}
          <div className="mb-3 position-relative">
            <input
              type="text"
              className="form-control"
              placeholder={PATIENTS.labels.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
              style={SEARCH_STYLES.input}
            />
          </div>

          {/* Desktop Table View */}
          <div className="table-responsive d-none d-md-block">
            <table className="table table-hover">
              <thead>
                <tr style={TABLE_STYLES.header}>
                  <th style={TABLE_STYLES.header}>{PATIENTS.table.headers.name}</th>
                  <th style={TABLE_STYLES.header}>{PATIENTS.table.headers.gender}</th>
                  <th style={TABLE_STYLES.header}>{PATIENTS.table.headers.phone}</th>
                  <th style={TABLE_STYLES.header}>{PATIENTS.table.headers.email}</th>
                  <th style={TABLE_STYLES.header}>{PATIENTS.table.headers.city}</th>
                  <th className="text-end" style={TABLE_STYLES.header}>{PATIENTS.table.headers.actions}</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      {searchTerm ? PATIENTS.labels.noSearchResults : PATIENTS.labels.noPatients}
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient, index) => (
                    <tr key={patient.patientId}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div style={{
                            ...AVATAR_STYLES.container,
                            backgroundColor: getInitialColor(index),
                            color: COLORS.white,
                            marginRight: DIMENSIONS.spacing.md,
                          }}>
                            {getInitials(patient.patientName)}
                          </div>
                          <div>
                            <div style={{ fontWeight: "500", color: COLORS.slate900 }}>
                              {patient.patientName}
                            </div>
                            <div style={{ fontSize: DIMENSIONS.fontSize.base, color: COLORS.slate600 }}>
                              ID: {patient.patientId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge" style={GENDER_BADGE_STYLES[patient.gender] || GENDER_BADGE_STYLES.OTHER}>
                          {patient.gender}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: COLORS.slate700 }}>{patient.patientPhoneNumber}</span>
                      </td>
                      <td style={{ color: COLORS.slate700 }}>{patient.patientEmail}</td>
                      <td style={{ color: COLORS.slate700 }}>{patient.patientAddress?.city || "N/A"}</td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm me-2"
                          onClick={() => openEditModal(patient)}
                          style={ACTION_BUTTON_STYLES.edit}
                        >
                          {PATIENTS.actions.edit}
                        </button>
                        <button
                          className="btn btn-sm"
                          onClick={() => handleBookClick(patient)}
                          style={ACTION_BUTTON_STYLES.book}
                        >
                          {PATIENTS.actions.book}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Patient Count */}
          {filteredPatients.length > 0 && (
            <div className="mt-3 text-center" style={{ fontSize: DIMENSIONS.fontSize.base, color: COLORS.slate600 }}>
              Showing {filteredPatients.length} patient{filteredPatients.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal - THIS IS THE NEW MODAL */}
      {showBookingModal && selectedPatientForBooking && (
        <div className="modal show d-block" style={MODAL_STYLES.overlay}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content" style={MODAL_STYLES.content}>
              <div className="modal-header" style={MODAL_STYLES.header}>
                <h5 className="modal-title" style={{ fontWeight: "600" }}>{APPOINTMENTS.booking.title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowBookingModal(false);
                    setSelectedPatientForBooking(null);
                  }}
                ></button>
              </div>
              <form onSubmit={handleSubmitBooking}>
                <div className="modal-body">
                  <div className="row g-3">
                    {/* Patient Field - Pre-filled and disabled */}
                    <div className="col-md-6">
                      <label className="form-label">{APPOINTMENTS.booking.labels.patient} *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={`${selectedPatientForBooking.patientName} (ID: ${selectedPatientForBooking.patientId})`}
                        disabled
                        style={FORM_STYLES.disabled}
                      />
                    </div>

                    {/* Doctor Dropdown */}
                    <div className="col-md-6">
                      <label className="form-label">{APPOINTMENTS.booking.labels.doctor} *</label>
                      <select
                        className="form-select"
                        value={bookingForm.doctorId}
                        onChange={(e) => setBookingForm({ ...bookingForm, doctorId: e.target.value })}
                        required
                      >
                        <option value="">{APPOINTMENTS.booking.placeholders.selectDoctor}</option>
                        {doctors.map(d => (
                          <option key={d.staffId} value={d.staffId}>
                            Dr. {d.firstName} {d.lastName} (ID: {d.staffId})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Date */}
                    <div className="col-md-6">
                      <label className="form-label">{APPOINTMENTS.booking.labels.date} *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={bookingForm.appointmentDate}
                        onChange={(e) => setBookingForm({ ...bookingForm, appointmentDate: e.target.value })}
                        required
                      />
                    </div>

                    {/* Start Time */}
                    <div className="col-md-3">
                      <label className="form-label">{APPOINTMENTS.booking.labels.startTime} *</label>
                      <input
                        type="time"
                        className="form-control"
                        value={bookingForm.startTime}
                        onChange={(e) => setBookingForm({ ...bookingForm, startTime: e.target.value })}
                        required
                      />
                    </div>

                    {/* End Time */}
                    <div className="col-md-3">
                      <label className="form-label">{APPOINTMENTS.booking.labels.endTime} *</label>
                      <input
                        type="time"
                        className="form-control"
                        value={bookingForm.endTime}
                        onChange={(e) => setBookingForm({ ...bookingForm, endTime: e.target.value })}
                        required
                      />
                    </div>

                    {/* Reason for Visit */}
                    <div className="col-12">
                      <label className="form-label">{APPOINTMENTS.booking.labels.reasonForVisit}</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={bookingForm.reasonForVisit}
                        onChange={(e) => setBookingForm({ ...bookingForm, reasonForVisit: e.target.value })}
                      />
                    </div>

                    {/* Notes */}
                    <div className="col-12">
                      <label className="form-label">{APPOINTMENTS.booking.labels.notes}</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={bookingForm.notes}
                        onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer" style={MODAL_STYLES.footer}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowBookingModal(false);
                      setSelectedPatientForBooking(null);
                    }}
                  >
                    {APPOINTMENTS.booking.buttons.cancel}
                  </button>
                  <button type="submit" className="btn btn-success">
                    {APPOINTMENTS.booking.buttons.book}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="modal show d-block" style={MODAL_STYLES.overlay}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content" style={MODAL_STYLES.content}>
              <div className="modal-header" style={MODAL_STYLES.header}>
                <h5 className="modal-title" style={{ fontWeight: "600" }}>{PATIENTS.form.addTitle}</h5>
                <button type="button" className="btn-close" onClick={() => { setShowAddModal(false); resetForm(); }}></button>
              </div>
              <form onSubmit={handleAddPatient}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">{PATIENTS.form.labels.fullName} *</label>
                      <input type="text" className="form-control" value={formData.patientName}
                        onChange={(e) => setFormData({ ...formData, patientName: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">{PATIENTS.form.labels.email} *</label>
                      <input type="email" className="form-control" value={formData.patientEmail}
                        onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">{PATIENTS.form.labels.phone} *</label>
                      <input type="tel" className="form-control" value={formData.patientPhoneNumber}
                        onChange={(e) => setFormData({ ...formData, patientPhoneNumber: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">{PATIENTS.form.labels.dob} *</label>
                      <input type="date" className="form-control" value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">{PATIENTS.form.labels.gender} *</label>
                      <select className="form-select" value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })} required>
                        <option value="">{PATIENTS.form.placeholders.selectGender}</option>
                        <option value="MALE">{PATIENTS.form.genderOptions.male}</option>
                        <option value="FEMALE">{PATIENTS.form.genderOptions.female}</option>
                        <option value="OTHER">{PATIENTS.form.genderOptions.other}</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label">{PATIENTS.form.labels.street}</label>
                      <input type="text" className="form-control" value={formData.patientAddress.street}
                        onChange={(e) => setFormData({ ...formData, patientAddress: { ...formData.patientAddress, street: e.target.value } })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">{PATIENTS.form.labels.city}</label>
                      <input type="text" className="form-control" value={formData.patientAddress.city}
                        onChange={(e) => setFormData({ ...formData, patientAddress: { ...formData.patientAddress, city: e.target.value } })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">{PATIENTS.form.labels.state}</label>
                      <input type="text" className="form-control" value={formData.patientAddress.state}
                        onChange={(e) => setFormData({ ...formData, patientAddress: { ...formData.patientAddress, state: e.target.value } })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">{PATIENTS.form.labels.zip}</label>
                      <input type="text" className="form-control" value={formData.patientAddress.zipCode}
                        onChange={(e) => setFormData({ ...formData, patientAddress: { ...formData.patientAddress, zipCode: e.target.value } })} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer" style={MODAL_STYLES.footer}>
                  <button type="button" className="btn btn-secondary" onClick={() => { setShowAddModal(false); resetForm(); }}>{PATIENTS.form.buttons.cancel}</button>
                  <button type="submit" className="btn btn-primary">{PATIENTS.form.buttons.add}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Patient Modal */}
      {showEditModal && selectedPatient && (
        <div className="modal show d-block" style={MODAL_STYLES.overlay}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content" style={MODAL_STYLES.content}>
              <div className="modal-header" style={MODAL_STYLES.header}>
                <h5 className="modal-title" style={{ fontWeight: "600" }}>{PATIENTS.form.editTitle}</h5>
                <button type="button" className="btn-close" onClick={() => { setShowEditModal(false); setSelectedPatient(null); resetForm(); }}></button>
              </div>
              <form onSubmit={handleEditPatient}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">{PATIENTS.form.labels.fullName} *</label>
                      <input type="text" className="form-control" value={formData.patientName}
                        onChange={(e) => setFormData({ ...formData, patientName: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">{PATIENTS.form.labels.email} *</label>
                      <input type="email" className="form-control" value={formData.patientEmail}
                        onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">{PATIENTS.form.labels.phone} *</label>
                      <input type="tel" className="form-control" value={formData.patientPhoneNumber}
                        onChange={(e) => setFormData({ ...formData, patientPhoneNumber: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">{PATIENTS.form.labels.dob} *</label>
                      <input type="date" className="form-control" value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">{PATIENTS.form.labels.gender} *</label>
                      <select className="form-select" value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })} required>
                        <option value="">{PATIENTS.form.placeholders.selectGender}</option>
                        <option value="MALE">{PATIENTS.form.genderOptions.male}</option>
                        <option value="FEMALE">{PATIENTS.form.genderOptions.female}</option>
                        <option value="OTHER">{PATIENTS.form.genderOptions.other}</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label">{PATIENTS.form.labels.street}</label>
                      <input type="text" className="form-control" value={formData.patientAddress.street}
                        onChange={(e) => setFormData({ ...formData, patientAddress: { ...formData.patientAddress, street: e.target.value } })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">{PATIENTS.form.labels.city}</label>
                      <input type="text" className="form-control" value={formData.patientAddress.city}
                        onChange={(e) => setFormData({ ...formData, patientAddress: { ...formData.patientAddress, city: e.target.value } })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">{PATIENTS.form.labels.state}</label>
                      <input type="text" className="form-control" value={formData.patientAddress.state}
                        onChange={(e) => setFormData({ ...formData, patientAddress: { ...formData.patientAddress, state: e.target.value } })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">{PATIENTS.form.labels.zip}</label>
                      <input type="text" className="form-control" value={formData.patientAddress.zipCode}
                        onChange={(e) => setFormData({ ...formData, patientAddress: { ...formData.patientAddress, zipCode: e.target.value } })} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer" style={MODAL_STYLES.footer}>
                  <button type="button" className="btn btn-secondary" onClick={() => { setShowEditModal(false); setSelectedPatient(null); resetForm(); }}>{PATIENTS.form.buttons.cancel}</button>
                  <button type="submit" className="btn btn-primary">{PATIENTS.form.buttons.update}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
