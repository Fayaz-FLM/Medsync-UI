import React from 'react';

const ViewDiagnosisModal = ({ appointment, onClose }) => {
    if (!appointment) return null;

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header bg-info text-white">
                        <h5 className="modal-title">Diagnosis Details - {appointment.patientName}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <strong>Patient ID:</strong> {appointment.patientId}
                            </div>
                            <div className="col-md-6">
                                <strong>Doctor ID:</strong> {appointment.doctorId}
                            </div>
                        </div>
                        <hr />
                        <div className="mb-3">
                            <h6 className="fw-bold">Diagnosis Summary</h6>
                            <p className="p-2 bg-light border rounded">{appointment.diagnosisSummary || 'N/A'}</p>
                        </div>
                        <div className="mb-3">
                            <h6 className="fw-bold">Prescription</h6>
                            <p className="p-2 bg-light border rounded" style={{ whiteSpace: 'pre-wrap' }}>{appointment.prescription || 'N/A'}</p>
                        </div>
                        <div className="mb-3">
                            <h6 className="fw-bold">Medicines</h6>
                            <p className="p-2 bg-light border rounded">{appointment.medicines || 'N/A'}</p>
                        </div>
                        <div className="mb-3">
                            <h6 className="fw-bold">Notes for Receptionist</h6>
                            <p className="p-2 bg-light border rounded">{appointment.notesForReceptionist || 'N/A'}</p>
                        </div>
                        <div className="mb-3">
                            <h6 className="fw-bold">Follow-up Suggestion</h6>
                            <p className="p-2 bg-light border rounded">{appointment.followUpSuggestion || 'N/A'}</p>
                        </div>
                        {appointment.dietPlan && (
                          <div className="mb-3">
                              <h6 className="fw-bold text-success">
                                <i className="bi bi-magic me-2"></i>
                                AI Diet Plan
                              </h6>
                              <div className="p-3 bg-light border border-success rounded shadow-sm" style={{ whiteSpace: 'pre-wrap' }}>
                                {appointment.dietPlan}
                              </div>
                          </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewDiagnosisModal;
