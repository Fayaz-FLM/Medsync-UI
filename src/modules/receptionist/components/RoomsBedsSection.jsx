import { useState } from 'react';
import * as api from '../../../services/api';
import { ROOMS_BEDS, STYLES, COLORS } from '../constants/receptionistConstants';

export default function RoomsBedsSection({ rooms, beds, stats, onRefresh, showToast }) {
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showBedModal, setShowBedModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomForm, setRoomForm] = useState({ roomNumber: '', roomType: 'GENERAL', roomCapacity: '', beds: [] });
  const [bedForm, setBedForm] = useState({ bedNumber: '', roomNumber: '' });

  const resetForm = () => {
    setRoomForm({ roomNumber: '', roomType: 'GENERAL', roomCapacity: '', beds: [] });
  };

  const resetBedForm = () => {
    setBedForm({ bedNumber: '', roomNumber: '' });
  };

  const handleAddBed = (roomNumber) => {
    setBedForm({ bedNumber: '', roomNumber: roomNumber });
    setShowBedModal(true);
  };

  const handleSubmitBed = async () => {
    try {
      await api.addBed({
        bedNumber: parseInt(bedForm.bedNumber),
        roomNumber: parseInt(bedForm.roomNumber),
        isOccupied: false
      });
      showToast('Bed added successfully', 'success');
      setShowBedModal(false);
      resetBedForm();
      onRefresh();
    } catch (error) {
      showToast('Failed to add bed', 'error');
    }
  };

  const handleAdd = () => {
    resetForm();
    setSelectedRoom(null);
    setShowRoomModal(true);
  };

  const handleEdit = (room) => {
    setSelectedRoom(room);
    setRoomForm({
      roomNumber: room.roomNumber || '',
      roomType: room.roomType || 'GENERAL',
      roomCapacity: room.roomCapacity || '',
      beds: room.beds || []
    });
    setShowRoomModal(true);
  };

  const handleSubmit = async () => {
    try {
      if (selectedRoom) {
        await api.updateRoomByNumber(selectedRoom.roomNumber, roomForm);
        showToast(ROOMS_BEDS.messages.updateSuccess, 'success');
      } else {
        await api.addRoom(roomForm);
        showToast(ROOMS_BEDS.messages.addSuccess, 'success');
      }
      setShowRoomModal(false);
      setSelectedRoom(null);
      resetForm();
      onRefresh();
    } catch (error) {
      showToast(selectedRoom ? ROOMS_BEDS.messages.updateFailed : ROOMS_BEDS.messages.addFailed, 'error');
    }
  };

  const handleDelete = async (roomNumber) => {
    if (!window.confirm(ROOMS_BEDS.messages.deleteConfirm)) return;
    try {
      await api.deleteRoomByNumber(roomNumber);
      showToast(ROOMS_BEDS.messages.deleteSuccess, 'success');
      onRefresh();
    } catch (error) {
      showToast(ROOMS_BEDS.messages.deleteFailed, 'error');
    }
  };

  const handleVacateBed = async (roomNumber, bedNumber) => {
    if (!window.confirm(ROOMS_BEDS.messages.vacateConfirm)) return;
    try {
      await api.vacateBed(roomNumber, bedNumber);
      showToast(ROOMS_BEDS.messages.vacateSuccess, 'success');
      onRefresh();
    } catch (error) {
      showToast(ROOMS_BEDS.messages.vacateFailed, 'error');
    }
  };

  return (
    <div style={{ background: COLORS.slate50, minHeight: '100vh', padding: '1.5rem' }}>
      {/* Header Card */}
      <div style={{ ...STYLES.card, marginBottom: '1.25rem' }}>
        <div style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ ...STYLES.typography.heading, margin: 0, marginBottom: '0.375rem' }}>
              {ROOMS_BEDS.title}
            </h2>
            <div style={{ display: 'flex', gap: '1.5rem', ...STYLES.typography.body }}>
              <span style={{ color: COLORS.slate700 }}>
                <strong>{stats.totalRooms}</strong> {ROOMS_BEDS.labels.totalRooms}
              </span>
              <span style={{ color: COLORS.danger }}>
                <strong>{stats.bedsOccupied}</strong> {ROOMS_BEDS.labels.bedsOccupied}
              </span>
              <span style={{ color: COLORS.success }}>
                <strong>{stats.bedsAvailable}</strong> {ROOMS_BEDS.labels.bedsAvailable}
              </span>
            </div>
          </div>
          <button 
            style={STYLES.button.primary}
            onClick={handleAdd}
            onMouseEnter={(e) => e.currentTarget.style.background = COLORS.primaryHover}
            onMouseLeave={(e) => e.currentTarget.style.background = COLORS.primary}
          >
            <i className="bi bi-plus-circle me-2"></i>{ROOMS_BEDS.labels.addRoom}
          </button>
        </div>
      </div>

      {/* Rooms Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {rooms.map(room => {
          const roomBeds = beds.filter(b => b.roomNumber === room.roomNumber);
          const occupiedCount = roomBeds.filter(b => b.isOccupied || b.occupied).length;
          const freeCount = roomBeds.filter(b => !b.isOccupied && !b.occupied).length;
          
          return (
            <div 
              key={room.roomNumber}
              style={{
                ...STYLES.card,
                overflow: 'hidden',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = STYLES.cardHover.boxShadow;
                e.currentTarget.style.transform = STYLES.cardHover.transform;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = STYLES.card.boxShadow;
                e.currentTarget.style.transform = 'none';
              }}
            >
              {/* Room Header */}
              <div style={{ 
                background: `linear-gradient(135deg, ${COLORS.primaryLight} 0%, ${COLORS.white} 100%)`,
                padding: '1rem',
                borderBottom: `1px solid ${COLORS.slate200}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: COLORS.white,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `2px solid ${COLORS.primaryBorder}`,
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: COLORS.primary
                    }}>
                      {room.roomNumber}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: COLORS.slate500, lineHeight: '1', marginBottom: '0.25rem' }}>
                        Room
                      </div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: '600', color: COLORS.slate800, lineHeight: '1' }}>
                        {room.roomType}
                      </div>
                    </div>
                  </div>
                  <i className="bi bi-hospital-fill" style={{ fontSize: '1.5rem', color: COLORS.primary, opacity: 0.3 }}></i>
                </div>
              </div>

              {/* Room Details */}
              <div style={{ padding: '1rem' }}>
                {/* Stats in single row */}
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: COLORS.slate500, marginBottom: '0.125rem' }}>
                      {ROOMS_BEDS.card.labels.capacity}
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: COLORS.slate800 }}>
                      {room.roomCapacity}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: COLORS.slate500, marginBottom: '0.125rem' }}>
                      {ROOMS_BEDS.card.labels.occupied}
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: COLORS.danger }}>
                      {occupiedCount}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: COLORS.slate500, marginBottom: '0.125rem' }}>
                      {ROOMS_BEDS.card.labels.free}
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: COLORS.success }}>
                      {freeCount}
                    </div>
                  </div>
                </div>

                {/* Beds */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <div style={{ fontSize: '0.7rem', color: COLORS.slate500, lineHeight: '1' }}>
                      {ROOMS_BEDS.labels.beds}
                    </div>
                    <button
                      onClick={() => handleAddBed(room.roomNumber)}
                      style={{
                        background: 'transparent',
                        border: `1px solid ${COLORS.primary}`,
                        color: COLORS.primary,
                        borderRadius: '4px',
                        padding: '0.125rem 0.375rem',
                        fontSize: '0.7rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        lineHeight: '1'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = COLORS.primaryLight;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <i className="bi bi-plus" style={{ fontSize: '0.7rem', lineHeight: '1' }}></i>
                      Add Bed
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                    {roomBeds.map(bed => {
                      const isOccupied = bed.isOccupied || bed.occupied;
                      return (
                        <div 
                          key={bed.bedNumber}
                          style={{
                            backgroundColor: isOccupied ? COLORS.dangerLight : COLORS.successLight,
                            color: isOccupied ? COLORS.danger : COLORS.success,
                            border: `1px solid ${isOccupied ? COLORS.dangerBorder : COLORS.successBorder}`,
                            borderRadius: '6px',
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.7rem',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          <span>Bed {bed.bedNumber}</span>
                          {isOccupied && (
                            <button 
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: COLORS.danger,
                                cursor: 'pointer',
                                padding: '0',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                lineHeight: '1'
                              }}
                              onClick={() => handleVacateBed(room.roomNumber, bed.bedNumber)}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: `1px solid ${COLORS.slate200}` }}>
                  <button 
                    style={{ ...STYLES.button.ghost, flex: 1, color: COLORS.primary, padding: '0.5rem 0.75rem', fontSize: '0.8125rem' }}
                    onClick={() => handleEdit(room)}
                    onMouseEnter={(e) => e.currentTarget.style.background = COLORS.primaryLight}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <i className="bi bi-pencil me-1"></i>{ROOMS_BEDS.card.actions.edit}
                  </button>
                  <button 
                    style={{ ...STYLES.button.ghost, flex: 1, color: COLORS.danger, padding: '0.5rem 0.75rem', fontSize: '0.8125rem' }}
                    onClick={() => handleDelete(room.roomNumber)}
                    onMouseEnter={(e) => e.currentTarget.style.background = COLORS.dangerLight}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <i className="bi bi-trash me-1"></i>{ROOMS_BEDS.card.actions.delete}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Room Modal */}
      {showRoomModal && (
        <div className="modal show d-block" style={STYLES.modalOverlay}>
          <div className="modal-dialog">
            <div className="modal-content" style={{ borderRadius: '12px', border: 'none' }}>
              <div className="modal-header" style={{ borderBottom: `1px solid ${COLORS.slate200}`, padding: '1.25rem 1.5rem' }}>
                <h5 className="modal-title" style={STYLES.typography.subheading}>
                  {selectedRoom ? ROOMS_BEDS.form.editTitle : ROOMS_BEDS.form.addTitle}
                </h5>
                <button type="button" className="btn-close" onClick={() => { setShowRoomModal(false); setSelectedRoom(null); }}></button>
              </div>
              <div className="modal-body" style={{ padding: '1.5rem' }}>
                <div className="mb-3">
                  <label className="form-label" style={STYLES.typography.label}>{ROOMS_BEDS.form.labels.roomNumber}</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    style={STYLES.input}
                    value={roomForm.roomNumber} 
                    onChange={(e) => setRoomForm({...roomForm, roomNumber: e.target.value})} 
                    disabled={!!selectedRoom} 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={STYLES.typography.label}>{ROOMS_BEDS.form.labels.roomType}</label>
                  <select 
                    className="form-select" 
                    style={STYLES.input}
                    value={roomForm.roomType} 
                    onChange={(e) => setRoomForm({...roomForm, roomType: e.target.value})}
                  >
                    <option value="GENERAL">{ROOMS_BEDS.form.roomTypes.general}</option>
                    <option value="ICU">{ROOMS_BEDS.form.roomTypes.icu}</option>
                    <option value="PRIVATE">{ROOMS_BEDS.form.roomTypes.private}</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label" style={STYLES.typography.label}>{ROOMS_BEDS.form.labels.roomCapacity}</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    style={STYLES.input}
                    value={roomForm.roomCapacity} 
                    onChange={(e) => setRoomForm({...roomForm, roomCapacity: e.target.value})} 
                  />
                </div>
              </div>
              <div className="modal-footer" style={{ borderTop: `1px solid ${COLORS.slate200}`, padding: '1rem 1.5rem', gap: '0.75rem' }}>
                <button 
                  type="button" 
                  style={STYLES.button.secondary}
                  onClick={() => { setShowRoomModal(false); setSelectedRoom(null); }}
                  onMouseEnter={(e) => e.currentTarget.style.background = COLORS.slate100}
                  onMouseLeave={(e) => e.currentTarget.style.background = COLORS.white}
                >
                  {ROOMS_BEDS.form.buttons.close}
                </button>
                <button 
                  type="button" 
                  style={STYLES.button.primary}
                  onClick={handleSubmit}
                  onMouseEnter={(e) => e.currentTarget.style.background = COLORS.primaryHover}
                  onMouseLeave={(e) => e.currentTarget.style.background = COLORS.primary}
                >
                  {selectedRoom ? ROOMS_BEDS.form.buttons.update : ROOMS_BEDS.form.buttons.add}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Bed Modal */}
      {showBedModal && (
        <div className="modal show d-block" style={STYLES.modalOverlay}>
          <div className="modal-dialog modal-sm">
            <div className="modal-content" style={{ borderRadius: '12px', border: 'none' }}>
              <div className="modal-header" style={{ borderBottom: `1px solid ${COLORS.slate200}`, padding: '1.25rem 1.5rem' }}>
                <h5 className="modal-title" style={STYLES.typography.subheading}>
                  Add Bed
                </h5>
                <button type="button" className="btn-close" onClick={() => { setShowBedModal(false); resetBedForm(); }}></button>
              </div>
              <div className="modal-body" style={{ padding: '1.5rem' }}>
                <div className="mb-3">
                  <label className="form-label" style={STYLES.typography.label}>Room Number</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    style={STYLES.input}
                    value={bedForm.roomNumber} 
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={STYLES.typography.label}>Bed Number</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    style={STYLES.input}
                    value={bedForm.bedNumber} 
                    onChange={(e) => setBedForm({...bedForm, bedNumber: e.target.value})} 
                    placeholder="Enter bed number"
                  />
                </div>
              </div>
              <div className="modal-footer" style={{ borderTop: `1px solid ${COLORS.slate200}`, padding: '1rem 1.5rem', gap: '0.75rem' }}>
                <button 
                  type="button" 
                  style={STYLES.button.secondary}
                  onClick={() => { setShowBedModal(false); resetBedForm(); }}
                  onMouseEnter={(e) => e.currentTarget.style.background = COLORS.slate100}
                  onMouseLeave={(e) => e.currentTarget.style.background = COLORS.white}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  style={STYLES.button.primary}
                  onClick={handleSubmitBed}
                  onMouseEnter={(e) => e.currentTarget.style.background = COLORS.primaryHover}
                  onMouseLeave={(e) => e.currentTarget.style.background = COLORS.primary}
                >
                  Add Bed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
