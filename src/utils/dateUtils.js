// Centralized date utility functions for consistent formatting

/**
 * Convert YYYY-MM-DD to MM-DD-YYYY
 * @param {string} isoDate - Date in YYYY-MM-DD format
 * @returns {string} Date in MM-DD-YYYY format
 */
export function formatDateToDisplay(isoDate) {
  if (!isoDate) return ''
  const [year, month, day] = isoDate.split('-')
  return `${month}-${day}-${year}`
}

/**
 * Convert MM-DD-YYYY to YYYY-MM-DD
 * @param {string} displayDate - Date in MM-DD-YYYY format
 * @returns {string} Date in YYYY-MM-DD format
 */
export function formatDateToISO(displayDate) {
  if (!displayDate) return ''
  const [month, day, year] = displayDate.split('-')
  return `${year}-${month}-${day}`
}

/**
 * Format date for display with day name
 * @param {string} isoDate - Date in YYYY-MM-DD format
 * @returns {string} Formatted date like "Sat, May 3, 2026"
 */
export function formatDateWithDay(isoDate) {
  if (!isoDate) return ''
  const [year, month, day] = isoDate.split('-')
  const dateObj = new Date(year, month - 1, day)
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} Today's date
 */
export function getTodayISO() {
  return new Date().toISOString().split('T')[0]
}

/**
 * Check if date is in the past
 * @param {string} isoDate - Date in YYYY-MM-DD format
 * @returns {boolean} True if date is before today
 */
export function isPastDate(isoDate) {
  const today = getTodayISO()
  return isoDate < today
}
