import { useEffect, useState } from 'react'
import * as api from '../../../services/api'
import Toast from '../../../components/common/Toast'
import {
  ADMIN_TEXT, ADMIN_STYLES, STAFF_COLUMNS, FORM_FIELDS,
  EMPTY_STAFF_FORM, REQUIRED_STAFF_FIELDS, REQUIRED_ADDRESS_FIELDS,
} from '../constants/adminConstants'

// ── Helpers ───────────────────────────────────────────────────────────────────

function getStaffId(s) { return s.staffId || s.id }

function isStaffActive(s) {
  return s.employeeActive !== undefined ? s.employeeActive : s.isEmployeeActive
}

function buildEditForm(s) {
  return {
    staffId:          getStaffId(s),
    firstName:        s.firstName        || '',
    lastName:         s.lastName         || '',
    email:            s.email            || '',
    gender:           s.gender           || 'MALE',
    phoneNumber:      s.phoneNumber      || '',
    staffType:        s.staffType        || 'DOCTOR',
    role:             (s.role && String(s.role).trim()) ? String(s.role).trim().toUpperCase() : 'ADMIN',
    specialization:   s.specialization   || '',
    dateOfJoining:    s.dateOfJoining    ? s.dateOfJoining.split('T')[0] : '',
    experienceInYears: s.experienceInYears || 0,
    canLogin:         !!s.canLogin,
    isEmployeeActive: s.employeeActive   !== undefined ? s.employeeActive
                    : s.isEmployeeActive !== undefined ? s.isEmployeeActive : true,
    staffAddressDto:  s.staffAddressDto  || s.staffAddress
                    || { landmark: '', city: '', state: '', country: '', pinCode: '' },
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Backdrop({ onClick }) {
  return <div style={ADMIN_STYLES.backdrop} onClick={onClick} />
}

function FormLabel({ text }) {
  return <label style={ADMIN_STYLES.formLabel}>{text}</label>
}

function ModalHeader({ title, onClose }) {
  return (
    <div style={ADMIN_STYLES.modalHeader}>
      <h5 style={ADMIN_STYLES.modalTitle}>{title}</h5>
      <button style={ADMIN_STYLES.btnClose} onClick={onClose}>×</button>
    </div>
  )
}

function ModalHeaderSm({ title, onClose }) {
  return (
    <div style={ADMIN_STYLES.modalHeaderSm}>
      <h5 style={ADMIN_STYLES.modalTitleSm}>{title}</h5>
      <button style={ADMIN_STYLES.btnClose} onClick={onClose}>×</button>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AdminStaff() {
  const [loading,         setLoading]         = useState(false)
  const [staffs,          setStaffs]          = useState([])
  const [showFormModal,   setShowFormModal]   = useState(false)
  const [showResignModal, setShowResignModal] = useState(false)
  const [selectedStaff,   setSelectedStaff]   = useState(null)
  const [editingId,       setEditingId]       = useState(null)
  const [filters,         setFilters]         = useState({ q: '', staffType: '' })
  const [toast,           setToast]           = useState({ show: false, message: '', type: 'success' })
  const [form,            setForm]            = useState(EMPTY_STAFF_FORM)

  // ── Toast ──────────────────────────────────────────────────────────────────
  const showToast = (message, type = 'success') => setToast({ show: true, message, type })
  const closeToast = () => setToast({ show: false, message: '', type: 'success' })

  // ── Data loading ───────────────────────────────────────────────────────────
  useEffect(() => { loadStaffs() }, [])

  async function loadStaffs() {
    setLoading(true)
    try {
      const list = await api.getStaffs()
      setStaffs(Array.isArray(list) ? list : [])
    } catch {
      showToast(ADMIN_TEXT.ALERT_LOAD_FAILED, 'error')
    } finally {
      setLoading(false)
    }
  }

  // ── Form modal ─────────────────────────────────────────────────────────────
  function openAdd() {
    setEditingId(null)
    setForm(EMPTY_STAFF_FORM)
    setShowFormModal(true)
  }

  function openEdit(s) {
    setEditingId(getStaffId(s))
    setForm(buildEditForm(s))
    setShowFormModal(true)
  }

  function closeFormModal() {
    setShowFormModal(false)
    setEditingId(null)
    setForm(EMPTY_STAFF_FORM)
  }

  function setField(key, value) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function setAddressField(key, value) {
    setForm(f => ({ ...f, staffAddressDto: { ...f.staffAddressDto, [key]: value } }))
  }

  async function submitForm(e) {
    e.preventDefault()

    const missing = [
      ...REQUIRED_STAFF_FIELDS.filter(field => !form[field]),
      ...(String(form.experienceInYears) === '' ? ['experienceInYears'] : []),
      ...REQUIRED_ADDRESS_FIELDS.filter(f => !(form.staffAddressDto || {})[f]).map(f => `address.${f}`),
    ]

    if (missing.length) {
      showToast(ADMIN_TEXT.ALERT_FILL_REQUIRED + missing.join(', '), 'error')
      return
    }

    try {
      if (editingId) {
        const payload = { ...form }
        delete payload.staffId
        const updated = await api.updateStaff(editingId, payload)
        setStaffs(prev => prev.map(p => String(getStaffId(p)) === String(editingId) ? updated : p))
        showToast(ADMIN_TEXT.ALERT_STAFF_UPDATED, 'success')
      } else {
        const emailTaken = staffs.some(s => String(s.email || '').toLowerCase() === String(form.email || '').toLowerCase())
        if (emailTaken) { showToast(ADMIN_TEXT.ALERT_EMAIL_EXISTS, 'error'); return }
        const payload = { ...form }
        delete payload.staffId
        await api.addStaff(payload)
        showToast(ADMIN_TEXT.ALERT_STAFF_ADDED, 'success')
        await loadStaffs()
      }
      closeFormModal()
    } catch {
      showToast(ADMIN_TEXT.ALERT_SAVE_FAILED, 'error')
    }
  }

  // ── Resign modal ───────────────────────────────────────────────────────────
  function openResign(s) {
    setSelectedStaff(s)
    setShowResignModal(true)
  }

  function closeResignModal() {
    setShowResignModal(false)
    setSelectedStaff(null)
  }

  async function confirmResign() {
    if (!selectedStaff) return
    try {
      await api.resignStaff(getStaffId(selectedStaff))
      setStaffs(prev => prev.map(p =>
        String(getStaffId(p)) === String(getStaffId(selectedStaff))
          ? { ...p, isEmployeeActive: false, employeeActive: false }
          : p
      ))
      showToast(ADMIN_TEXT.ALERT_STAFF_RESIGNED, 'success')
      closeResignModal()
    } catch {
      showToast(ADMIN_TEXT.ALERT_RESIGN_FAILED, 'error')
    }
  }

  // ── Filtering ──────────────────────────────────────────────────────────────
  const filtered = staffs.filter(s => {
    if (filters.staffType && String(s.staffType || '').toLowerCase() !== filters.staffType.toLowerCase()) return false
    if (filters.q) {
      const q = filters.q.toLowerCase()
      return (
        String(s.firstName || '').toLowerCase().includes(q) ||
        String(s.lastName  || '').toLowerCase().includes(q) ||
        String(getStaffId(s)).toLowerCase().includes(q)
      )
    }
    return true
  })

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={ADMIN_STYLES.page}>
      <div style={ADMIN_STYLES.card}>

        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h4 style={ADMIN_STYLES.pageTitle}>{ADMIN_TEXT.TITLE}</h4>
            <small style={ADMIN_STYLES.pageSubtitle}>{ADMIN_TEXT.SUBTITLE}</small>
          </div>
          <div className="d-flex gap-2">
            <button onClick={loadStaffs} disabled={loading} style={ADMIN_STYLES.btnRefresh}>
              {loading ? ADMIN_TEXT.BTN_REFRESHING : ADMIN_TEXT.BTN_REFRESH}
            </button>
            <button onClick={openAdd} style={ADMIN_STYLES.btnAdd}>
              {ADMIN_TEXT.BTN_ADD_STAFF}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="row mb-4 g-2">
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder={ADMIN_TEXT.SEARCH_PLACEHOLDER}
              value={filters.q}
              onChange={e => setFilters(f => ({ ...f, q: e.target.value }))}
              style={ADMIN_STYLES.filterInput}
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={filters.staffType}
              onChange={e => setFilters(f => ({ ...f, staffType: e.target.value }))}
              style={ADMIN_STYLES.filterInput}
            >
              <option value="">{ADMIN_TEXT.FILTER_ALL_TYPES}</option>
              <option value="DOCTOR">{ADMIN_TEXT.FILTER_DOCTOR}</option>
              <option value="NON_DOCTOR">{ADMIN_TEXT.FILTER_NON_DOCTOR}</option>
            </select>
          </div>
        </div>

        {/* Table - Desktop */}
        <div style={ADMIN_STYLES.tableWrapper} className="d-none d-md-block">
          <table className="table table-hover mb-0">
            <thead style={ADMIN_STYLES.thead}>
              <tr>
                {STAFF_COLUMNS.map(col => (
                  <th key={col.key} style={ADMIN_STYLES.th}>{col.header}</th>
                ))}
                <th className="text-end" style={ADMIN_STYLES.th}>{ADMIN_TEXT.TH_ACTIONS}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const active = isStaffActive(s)
                return (
                  <tr key={getStaffId(s)} style={ADMIN_STYLES.trRow}>
                    <td style={ADMIN_STYLES.tdId}>{getStaffId(s)}</td>
                    <td style={ADMIN_STYLES.tdName}>
                      <span style={ADMIN_STYLES.initials}>
                        {(s.firstName || '').substring(0, 2).toUpperCase()}
                      </span>
                      {s.firstName} {s.lastName}
                    </td>
                    <td style={ADMIN_STYLES.tdCell}>{s.staffType}</td>
                    <td style={ADMIN_STYLES.tdCell}>{s.role}</td>
                    <td style={ADMIN_STYLES.tdCell}>{s.phoneNumber}</td>
                    <td style={ADMIN_STYLES.tdCell}>
                      <span style={active ? ADMIN_STYLES.badgeActive : ADMIN_STYLES.badgeInactive}>
                        {active ? `● ${ADMIN_TEXT.ACTIVE_YES}` : `● ${ADMIN_TEXT.ACTIVE_NO}`}
                      </span>
                    </td>
                    <td className="text-end" style={ADMIN_STYLES.tdActions}>
                      <button onClick={() => openEdit(s)} style={ADMIN_STYLES.btnEdit}>
                        {ADMIN_TEXT.BTN_EDIT}
                      </button>
                      <button
                        onClick={() => openResign(s)}
                        disabled={!active}
                        style={active ? ADMIN_STYLES.btnResignActive : ADMIN_STYLES.btnResignOff}
                      >
                        {ADMIN_TEXT.BTN_RESIGN}
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-muted" style={ADMIN_STYLES.tdEmpty}>
                    {ADMIN_TEXT.EMPTY_STAFF}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards - Mobile Only */}
        <div className="d-md-none">
          {filtered.map(s => {
            const active = isStaffActive(s)
            return (
              <div key={getStaffId(s)} style={ADMIN_STYLES.mobileCard}>
                {/* Header with initials and name */}
                <div style={ADMIN_STYLES.mobileCardHeader}>
                  <div style={ADMIN_STYLES.mobileInitials}>
                    {(s.firstName || '').substring(0, 2).toUpperCase()}
                  </div>
                  <div style={ADMIN_STYLES.mobileCardTitle}>
                    <div style={ADMIN_STYLES.mobileName}>
                      {s.firstName} {s.lastName}
                    </div>
                    <div style={ADMIN_STYLES.mobileId}>
                      ID: {getStaffId(s)}
                    </div>
                  </div>
                  <span style={active ? ADMIN_STYLES.badgeActive : ADMIN_STYLES.badgeInactive}>
                    {active ? `● ${ADMIN_TEXT.ACTIVE_YES}` : `● ${ADMIN_TEXT.ACTIVE_NO}`}
                  </span>
                </div>

                {/* Body with details */}
                <div style={ADMIN_STYLES.mobileCardBody}>
                  <div style={ADMIN_STYLES.mobileField}>
                    <div style={ADMIN_STYLES.mobileLabel}>Role:</div>
                    <div style={ADMIN_STYLES.mobileValue}>{s.role}</div>
                  </div>
                  <div style={ADMIN_STYLES.mobileField}>
                    <div style={ADMIN_STYLES.mobileLabel}>Type:</div>
                    <div style={ADMIN_STYLES.mobileValue}>{s.staffType}</div>
                  </div>
                  <div style={ADMIN_STYLES.mobileField}>
                    <div style={ADMIN_STYLES.mobileLabel}>Phone:</div>
                    <div style={ADMIN_STYLES.mobileValue}>{s.phoneNumber}</div>
                  </div>
                </div>

                {/* Actions */}
                <div style={ADMIN_STYLES.mobileActions}>
                  <button onClick={() => openEdit(s)} style={{ ...ADMIN_STYLES.btnEdit, flex: 1 }}>
                    {ADMIN_TEXT.BTN_EDIT}
                  </button>
                  <button
                    onClick={() => openResign(s)}
                    disabled={!active}
                    style={{ ...(active ? ADMIN_STYLES.btnResignActive : ADMIN_STYLES.btnResignOff), flex: 1 }}
                  >
                    {ADMIN_TEXT.BTN_RESIGN}
                  </button>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div style={{ ...ADMIN_STYLES.mobileCard, textAlign: 'center', color: '#6c757d' }}>
              {ADMIN_TEXT.EMPTY_STAFF}
            </div>
          )}
        </div>
      </div>

      {/* ── Staff Form Modal ── */}
      {showFormModal && (
        <>
          <Backdrop onClick={closeFormModal} />
          <div style={ADMIN_STYLES.modalOuter}>
            <div style={ADMIN_STYLES.modalCard}>
              <ModalHeader
                title={editingId ? ADMIN_TEXT.FORM_EDIT_TITLE : ADMIN_TEXT.FORM_ADD_TITLE}
                onClose={closeFormModal}
              />
              <form onSubmit={submitForm}>
                <div style={ADMIN_STYLES.modalBody}>

                  {/* Basic fields */}
                  <div className="row g-3 mb-3">
                    {FORM_FIELDS.basic.map(field => (
                      <div key={field.name} className={field.col}>
                        <FormLabel text={field.label} />
                        <input
                          type={field.type || 'text'}
                          className="form-control"
                          value={form[field.name]}
                          onChange={e => setField(field.name, e.target.value)}
                          required={field.required}
                          style={ADMIN_STYLES.formInput}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Type / Role / Specialization / Experience */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-3">
                      <FormLabel text={ADMIN_TEXT.LABEL_TYPE} />
                      <select className="form-select" value={form.staffType} onChange={e => setField('staffType', e.target.value)} required style={ADMIN_STYLES.formInput}>
                        <option value="">{ADMIN_TEXT.OPT_SELECT_TYPE}</option>
                        <option value="DOCTOR">{ADMIN_TEXT.FILTER_DOCTOR}</option>
                        <option value="NON_DOCTOR">{ADMIN_TEXT.FILTER_NON_DOCTOR}</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <FormLabel text={ADMIN_TEXT.LABEL_ROLE} />
                      <select className="form-select" value={form.role || 'ADMIN'} onChange={e => setField('role', e.target.value)} required style={ADMIN_STYLES.formInput}>
                        <option value="ADMIN">{ADMIN_TEXT.OPT_ROLE_ADMIN}</option>
                        <option value="STAFF">{ADMIN_TEXT.OPT_ROLE_STAFF}</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <FormLabel text={ADMIN_TEXT.LABEL_SPECIALIZATION} />
                      <select className="form-select" value={form.specialization} onChange={e => setField('specialization', e.target.value)} required style={ADMIN_STYLES.formInput}>
                        <option value="">{ADMIN_TEXT.OPT_SELECT_SPEC}</option>
                        {FORM_FIELDS.specializations.map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <FormLabel text={ADMIN_TEXT.LABEL_EXPERIENCE} />
                      <input type="number" className="form-control" value={form.experienceInYears} onChange={e => setField('experienceInYears', Number(e.target.value))} required style={ADMIN_STYLES.formInput} />
                    </div>
                  </div>

                  {/* Date / Can Login / Active */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <FormLabel text={ADMIN_TEXT.LABEL_DATE_JOINING} />
                      <input type="date" className="form-control" value={form.dateOfJoining} onChange={e => setField('dateOfJoining', e.target.value)} required style={ADMIN_STYLES.formInput} />
                    </div>
                    <div className="col-md-4">
                      <FormLabel text={ADMIN_TEXT.LABEL_CAN_LOGIN} />
                      <select className="form-select" value={form.canLogin ? 'yes' : 'no'} onChange={e => setField('canLogin', e.target.value === 'yes')} style={ADMIN_STYLES.formInput}>
                        <option value="yes">{ADMIN_TEXT.OPT_YES}</option>
                        <option value="no">{ADMIN_TEXT.OPT_NO}</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <FormLabel text={ADMIN_TEXT.LABEL_ACTIVE} />
                      <select className="form-select" value={form.isEmployeeActive ? 'yes' : 'no'} onChange={e => setField('isEmployeeActive', e.target.value === 'yes')} style={ADMIN_STYLES.formInput}>
                        <option value="yes">{ADMIN_TEXT.OPT_YES}</option>
                        <option value="no">{ADMIN_TEXT.OPT_NO}</option>
                      </select>
                    </div>
                  </div>

                  {/* Address */}
                  <div style={ADMIN_STYLES.addressSection}>
                    <p style={ADMIN_STYLES.addressTitle}>{ADMIN_TEXT.FORM_ADDRESS_TITLE}</p>
                    <div className="row g-2">
                      {FORM_FIELDS.address.map(field => (
                        <div key={field.name} className={field.col}>
                          <input
                            className="form-control"
                            placeholder={field.placeholder}
                            value={form.staffAddressDto[field.name]}
                            onChange={e => setAddressField(field.name, e.target.value)}
                            required
                            style={ADMIN_STYLES.formInput}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={ADMIN_STYLES.modalFooter}>
                  <button type="button" onClick={closeFormModal} style={ADMIN_STYLES.btnCancel}>
                    {ADMIN_TEXT.BTN_CANCEL}
                  </button>
                  <button type="submit" style={ADMIN_STYLES.btnSubmit}>
                    {editingId ? ADMIN_TEXT.BTN_UPDATE : ADMIN_TEXT.BTN_CREATE}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* ── Resign Confirmation Modal ── */}
      {showResignModal && (
        <>
          <Backdrop onClick={closeResignModal} />
          <div style={ADMIN_STYLES.modalOuter}>
            <div style={ADMIN_STYLES.modalCardSm}>
              <ModalHeaderSm title={ADMIN_TEXT.CONFIRM_RESIGN_TITLE} onClose={closeResignModal} />
              <div style={ADMIN_STYLES.modalBodySm}>
                <div className="d-flex align-items-start gap-3">
                  <div style={ADMIN_STYLES.resignIconWrap}>{ADMIN_TEXT.CONFIRM_RESIGN_ICON}</div>
                  <div>
                    <p style={ADMIN_STYLES.resignMsg}>
                      {ADMIN_TEXT.CONFIRM_RESIGN_MSG.replace('{name}',
                        selectedStaff ? `${selectedStaff.firstName} ${selectedStaff.lastName}` : ''
                      )}
                    </p>
                    <p style={ADMIN_STYLES.resignNote}>{ADMIN_TEXT.CONFIRM_RESIGN_NOTE}</p>
                  </div>
                </div>
              </div>
              <div style={ADMIN_STYLES.modalFooterSm}>
                <button onClick={closeResignModal} style={ADMIN_STYLES.btnCancel}>
                  {ADMIN_TEXT.BTN_CANCEL}
                </button>
                <button onClick={confirmResign} style={ADMIN_STYLES.btnConfirmResign}>
                  {ADMIN_TEXT.BTN_CONFIRM_RESIGN}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <Toast show={toast.show} onClose={closeToast} message={toast.message} type={toast.type} duration={3000} />
    </div>
  )
}
