import React from 'react';

export default function ReasonForVisitModal({ appointment, onClose }) {
  if (!appointment) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Reason for Visit</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row mb-3">
              <div className="col-6">
                <strong>Patient:</strong> {appointment.patientName || 'N/A'}
              </div>
              <div className="col-6">
                <strong>Date:</strong> {appointment.appointmentDate || 'N/A'}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-12">
                <strong>Time:</strong> {appointment.startTime} - {appointment.endTime}
              </div>
            </div>
            <hr />
            <h6>Reason:</h6>
            <p className="border p-3 bg-light rounded">
              {appointment.reasonForVisit || 'No reason provided.'}
            </p>
            {appointment.notes && (
              <>
                <h6>Notes:</h6>
                <p className="border p-3 bg-light rounded small">
                  {appointment.notes}
                </p>
              </>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
