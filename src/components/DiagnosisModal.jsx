import React, { useState } from 'react';
import * as api from '../services/api';

const DiagnosisModal = ({ appointment, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        diagnosisSummary: '',
        prescription: '',
        medicines: '',
        notesForReceptionist: '',
        followUpSuggestion: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!appointment) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.submitDiagnosis(appointment.appointmentId || appointment.id, formData);
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit diagnosis');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">Submit Diagnosis - {appointment.patientName}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            
                            <div className="mb-3">
                                <label className="form-label fw-bold">Diagnosis Summary</label>
                                <textarea 
                                    className="form-control" 
                                    name="diagnosisSummary" 
                                    value={formData.diagnosisSummary}
                                    onChange={handleChange}
                                    rows="3"
                                    required
                                    placeholder="Enter diagnosis summary..."
                                ></textarea>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Prescription</label>
                                <textarea 
                                    className="form-control" 
                                    name="prescription" 
                                    value={formData.prescription}
                                    onChange={handleChange}
                                    rows="3"
                                    required
                                    placeholder="Enter prescription details..."
                                ></textarea>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Medicines</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    name="medicines" 
                                    value={formData.medicines}
                                    onChange={handleChange}
                                    placeholder="e.g. Paracetamol 500mg, Amoxicillin 250mg"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Notes for Receptionist</label>
                                <textarea 
                                    className="form-control" 
                                    name="notesForReceptionist" 
                                    value={formData.notesForReceptionist}
                                    onChange={handleChange}
                                    rows="2"
                                    placeholder="Any specific instructions for the receptionist..."
                                ></textarea>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Follow-up Suggestion</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    name="followUpSuggestion" 
                                    value={formData.followUpSuggestion}
                                    onChange={handleChange}
                                    placeholder="e.g. After 2 weeks"
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit Diagnosis'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DiagnosisModal;
