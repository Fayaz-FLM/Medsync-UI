import React from 'react'

export default function TimeRangePicker({ from, to, onChange, disabled }) {
  function handleFrom(e) {
    onChange({ from: e.target.value, to })
  }
  function handleTo(e) {
    onChange({ from, to: e.target.value })
  }

  const invalid = from && to && from >= to

  return (
    <div>
      <div className="row g-2">
        <div className="col">
          <label className="form-label small">From</label>
          <input type="time" className="form-control" value={from || ''} onChange={handleFrom} disabled={disabled} />
        </div>
        <div className="col">
          <label className="form-label small">To</label>
          <input type="time" className="form-control" value={to || ''} onChange={handleTo} disabled={disabled} />
        </div>
      </div>
      {invalid && <div className="text-danger small mt-1">End time must be after start time.</div>}
    </div>
  )
}