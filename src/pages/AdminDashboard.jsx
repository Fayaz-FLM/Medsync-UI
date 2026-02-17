import React, { useEffect, useState } from 'react'
import * as api from '../services/api'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false)
  const [staffs, setStaffs] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [filters, setFilters] = useState({ q: '', staffType: '' })

  const initForm = {
    firstName: '', lastName: '', email: '', gender: 'MALE', phoneNumber: '', staffType: 'DOCTOR', role: 'ADMIN', specialization: '', dateOfJoining: '', experienceInYears: 0, canLogin: true, isEmployeeActive: true,
    staffAddressDto: { landmark: '', city: '', state: '', country: '', pinCode: '' }
  }
  const [form, setForm] = useState(initForm)

  useEffect(() => { loadStaffs() }, [])

  async function loadStaffs() {
    setLoading(true)
    try {
      const list = await api.getStaffs()
      setStaffs(Array.isArray(list) ? list : [])
    } catch (err) {
      console.warn('loadStaffs failed', err)
    } finally { setLoading(false) }
  }

  function startAdd() {
    setEditingId(null)
    setForm(initForm)
    setShowForm(true)
  }

  function startEdit(s) {
    setEditingId(s.staffId || s.id)
    const roleValue = (s.role && String(s.role).trim()) ? String(s.role).trim().toUpperCase() : 'ADMIN'
    setForm({
      staffId: s.staffId || s.id,
      firstName: s.firstName || '', lastName: s.lastName || '', email: s.email || '', gender: s.gender || 'MALE', phoneNumber: s.phoneNumber || '', staffType: s.staffType || 'DOCTOR', role: roleValue, specialization: s.specialization || '', dateOfJoining: s.dateOfJoining ? s.dateOfJoining.split('T')[0] : '', experienceInYears: s.experienceInYears || 0, canLogin: !!s.canLogin, isEmployeeActive: s.employeeActive !== undefined ? s.employeeActive : (s.isEmployeeActive !== undefined ? s.isEmployeeActive : true),
      staffAddressDto: s.staffAddressDto || s.staffAddress || { landmark: '', city: '', state: '', country: '', pinCode: '' }
    })
    setShowForm(true)
  }

  async function submitForm(e) {
    e.preventDefault()
    try {
      // Validate required fields (all except lastName)
      const missing = []
      if (!form.firstName) missing.push('First name')
      if (!form.email) missing.push('Email')
      if (!form.phoneNumber) missing.push('Phone')
      if (!form.staffType) missing.push('Type')
      if (!form.role) missing.push('Role')
      if (!form.specialization) missing.push('Specialization')
      if (!form.dateOfJoining) missing.push('Date of Joining')
      if (form.experienceInYears === undefined || form.experienceInYears === null || String(form.experienceInYears) === '') missing.push('Experience (yrs)')
      if (typeof form.canLogin !== 'boolean') missing.push('Can Login')
      if (typeof form.isEmployeeActive !== 'boolean') missing.push('Active')
      const addr = form.staffAddressDto || {}
      if (!addr.landmark) missing.push('Address: Landmark')
      if (!addr.city) missing.push('Address: City')
      if (!addr.state) missing.push('Address: State')
      if (!addr.country) missing.push('Address: Country')
      if (!addr.pinCode) missing.push('Address: Pin code')
      if (missing.length) {
        alert('Please fill required fields: ' + missing.join(', '))
        return
      }

      if (editingId) {
        // For editing: send staffId as path param and RegisterStaffDto in the body
        const updateData = { ...form }
        // Ensure staffId is not sent in the request body
        if (updateData.staffId !== undefined) delete updateData.staffId
        const updated = await api.updateStaff(editingId, updateData)
        setStaffs(prev => prev.map(p => (String(p.staffId || p.id) === String(editingId) ? updated : p)))
        alert('Staff updated')
      } else {
        // Check if email already exists (only for add)
        const emailExists = staffs.some(s => String(s.email || '').toLowerCase() === String(form.email || '').toLowerCase())
        if (emailExists) {
          alert('Email already exists! Please use a different email.')
          return
        }
        // For adding, don't send staffId
        const addData = { ...form }
        delete addData.staffId
        const created = await api.addStaff(addData)
        alert('Staff added')
        setShowForm(false)
        setEditingId(null)
        setForm(initForm)
        // Refresh staff list from API
        await loadStaffs()
      }
      setShowForm(false)
      setEditingId(null)
      setForm(initForm)
    } catch (err) {
      console.warn('submitForm failed', err)
      alert('Unable to save staff')
    }
  }

  async function handleResign(s) {
    if (!confirm(`Mark ${s.firstName} ${s.lastName} as resigned?`)) return
    try {
      await api.resignStaff(s.staffId || s.id)
      setStaffs(prev => prev.map(p => (String(p.staffId || p.id) === String(s.staffId || s.id) ? { ...p, isEmployeeActive: false, employeeActive: false } : p)))
      alert('Staff resigned')
    } catch (err) {
      console.warn('resign failed', err)
      alert('Unable to resign staff')
    }
  }

  const filtered = staffs.filter(s => {
    if (filters.staffType && String(s.staffType || '').toLowerCase() !== String(filters.staffType).toLowerCase()) return false
    if (filters.q) {
      const q = filters.q.toLowerCase()
      return (String(s.firstName || '').toLowerCase().includes(q) || String(s.lastName || '').toLowerCase().includes(q) || String(s.staffId || s.id || '').toLowerCase().includes(q))
    }
    return true
  })

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h4 className="mb-0">Admin — Staff Management</h4>
            <small className="text-muted">Add, edit, resign and search staff (Doctors & Receptionists)</small>
          </div>
          <div>
            <button className="btn btn-outline-secondary me-2" onClick={loadStaffs} disabled={loading}>{loading ? 'Refreshing...' : 'Refresh'}</button>
            <button className="btn btn-primary" onClick={startAdd}>Add Staff</button>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <input className="form-control" placeholder="Search by name or id" value={filters.q} onChange={(e) => setFilters(f => ({ ...f, q: e.target.value }))} />
          </div>
          <div className="col-md-3">
            <select className="form-select" value={filters.staffType} onChange={(e) => setFilters(f => ({ ...f, staffType: e.target.value }))}>
              <option value="">All types</option>
              <option value="DOCTOR">Doctor</option>
              <option value="NON_DOCTOR">Non Doctor</option>
            </select>
          </div>
        </div>

        <div className="table-responsive mb-3">
          <table className="table table-hover">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Type</th><th>Role</th><th>Phone</th><th>Active</th><th className="text-end">Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.staffId || s.id}>
                  <td>{s.staffId || s.id}</td>
                  <td>{s.firstName} {s.lastName}</td>
                  <td>{s.staffType}</td>
                  <td>{s.role}</td>
                  <td>{s.phoneNumber}</td>
                  <td>{(s.employeeActive !== undefined ? s.employeeActive : s.isEmployeeActive) ? 'Yes' : 'No'}</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEdit(s)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleResign(s)} disabled={!(s.employeeActive !== undefined ? s.employeeActive : s.isEmployeeActive)}>Resign</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan="7" className="text-muted">No staff found</td></tr>}
            </tbody>
          </table>
        </div>

        {showForm && (
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <h6 className="mb-3">{editingId ? 'Edit Staff' : 'Add Staff'}</h6>
              <form onSubmit={submitForm}>
                <div className="row g-2 mb-2">
                  <div className="col-md-3"><label className="form-label">First name</label><input className="form-control" value={form.firstName} onChange={(e)=>setForm(f=>({...f, firstName: e.target.value}))} required /></div>
                  <div className="col-md-3"><label className="form-label">Last name</label><input className="form-control" value={form.lastName} onChange={(e)=>setForm(f=>({...f, lastName: e.target.value}))} /></div>
                  <div className="col-md-2"><label className="form-label">Email</label><input type="email" className="form-control" value={form.email} onChange={(e)=>setForm(f=>({...f, email: e.target.value}))} required /></div>
                  <div className="col-md-2"><label className="form-label">Phone</label><input className="form-control" value={form.phoneNumber} onChange={(e)=>setForm(f=>({...f, phoneNumber: e.target.value}))} required /></div>
                </div>

                <div className="row g-2 mb-2">
                  <div className="col-md-3"><label className="form-label">Type</label>
                    <select className="form-select" value={form.staffType} onChange={(e)=>setForm(f=>({...f, staffType: e.target.value}))} required>
                      <option value="">Select type</option>
                      <option value="DOCTOR">Doctor</option>
                      <option value="NON_DOCTOR">Non Doctor</option>
                    </select>
                  </div>
                  <div className="col-md-3"><label className="form-label">Role</label>
                    <select className="form-select" value={form.role || 'ADMIN'} onChange={(e)=>setForm(f=>({...f, role: e.target.value}))} required>
                      <option value="ADMIN">ADMIN</option>
                      <option value="STAFF">STAFF</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Specialization</label>
                    <select className="form-select" value={form.specialization} onChange={(e) => setForm(f => ({ ...f, specialization: e.target.value }))} required>
                      <option value="">Select specialization</option>
                      <option value="GENERAL_PHYSICIAN">GENERAL_PHYSICIAN</option>
                      <option value="CARDIOLOGIST">CARDIOLOGIST</option>
                      <option value="NEUROLOGIST">NEUROLOGIST</option>
                      <option value="ENT_SPECIALIST">ENT_SPECIALIST</option>
                      <option value="DENTIST">DENTIST</option>
                      <option value="PULMONOLOGIST">PULMONOLOGIST</option>
                      <option value="GASTROENTEROLOGIST">GASTROENTEROLOGIST</option>
                      <option value="PEDIATRICIAN">PEDIATRICIAN</option>
                      <option value="GYNECOLOGIST">GYNECOLOGIST</option>
                      <option value="RECEPTIONIST">RECEPTIONIST</option>
                      <option value="OTHER">OTHER</option>
                    </select>
                  </div>
                  <div className="col-md-3"><label className="form-label">Experience (yrs)</label><input type="number" className="form-control" value={form.experienceInYears} onChange={(e)=>setForm(f=>({...f, experienceInYears: Number(e.target.value)}))} required /></div>
                </div>

                <div className="row g-2 mb-2">
                  <div className="col-md-3"><label className="form-label">Date of Joining</label><input type="date" className="form-control" value={form.dateOfJoining} onChange={(e)=>setForm(f=>({...f, dateOfJoining: e.target.value}))} required /></div>
                  <div className="col-md-3"><label className="form-label">Can Login</label>
                    <select className="form-select" value={form.canLogin ? 'yes' : 'no'} onChange={(e)=>setForm(f=>({...f, canLogin: e.target.value==='yes'}))} required>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div className="col-md-3"><label className="form-label">Active</label>
                    <select className="form-select" value={form.isEmployeeActive ? 'yes' : 'no'} onChange={(e)=>setForm(f=>({...f, isEmployeeActive: e.target.value==='yes'}))} required>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>

                <h6 className="mt-3">Address</h6>
                <div className="row g-2 mb-2">
                  <div className="col-md-4"><input className="form-control" placeholder="Landmark" value={form.staffAddressDto.landmark} onChange={(e)=>setForm(f=>({...f, staffAddressDto:{...f.staffAddressDto, landmark: e.target.value}}))} required /></div>
                  <div className="col-md-3"><input className="form-control" placeholder="City" value={form.staffAddressDto.city} onChange={(e)=>setForm(f=>({...f, staffAddressDto:{...f.staffAddressDto, city: e.target.value}}))} required /></div>
                  <div className="col-md-2"><input className="form-control" placeholder="State" value={form.staffAddressDto.state} onChange={(e)=>setForm(f=>({...f, staffAddressDto:{...f.staffAddressDto, state: e.target.value}}))} required /></div>
                  <div className="col-md-2"><input className="form-control" placeholder="Country" value={form.staffAddressDto.country} onChange={(e)=>setForm(f=>({...f, staffAddressDto:{...f.staffAddressDto, country: e.target.value}}))} required /></div>
                  <div className="col-md-2"><input className="form-control" placeholder="Pin code" value={form.staffAddressDto.pinCode} onChange={(e)=>setForm(f=>({...f, staffAddressDto:{...f.staffAddressDto, pinCode: e.target.value}}))} required /></div>
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-success" type="submit">{editingId ? 'Update' : 'Create'}</button>
                  <button type="button" className="btn btn-secondary" onClick={()=>{ setShowForm(false); setEditingId(null); setForm(initForm) }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
