import { useEffect } from 'react'

/**
 * Toast Notification Component
 * 
 * @param {boolean} show - Controls toast visibility
 * @param {function} onClose - Callback when toast closes
 * @param {string} message - Toast message
 * @param {string} type - Toast type: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Auto-close duration in ms (default: 3000)
 */
export default function Toast({ 
  show, 
  onClose, 
  message, 
  type = 'success',
  duration = 3000 
}) {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [show, duration, onClose])

  if (!show) return null

  const typeStyles = {
    success: {
      backgroundColor: '#d4edda',
      color: '#155724',
      borderColor: '#c3e6cb',
      icon: '✓'
    },
    error: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      borderColor: '#f5c6cb',
      icon: '✕'
    },
    warning: {
      backgroundColor: '#fff3cd',
      color: '#856404',
      borderColor: '#ffeaa7',
      icon: '⚠'
    },
    info: {
      backgroundColor: '#d1ecf1',
      color: '#0c5460',
      borderColor: '#bee5eb',
      icon: 'ℹ'
    }
  }

  const style = typeStyles[type] || typeStyles.info

  return (
    <div 
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        minWidth: '300px',
        maxWidth: '500px',
        animation: 'slideInRight 0.3s ease-out',
      }}
    >
      <div 
        style={{
          backgroundColor: style.backgroundColor,
          color: style.color,
          border: `1px solid ${style.borderColor}`,
          borderRadius: '8px',
          padding: '16px 20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
          {style.icon}
        </span>
        <span style={{ flex: 1, fontSize: '0.95rem', fontWeight: '500' }}>
          {message}
        </span>
        <button 
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: style.color,
            fontSize: '1.2rem',
            cursor: 'pointer',
            padding: '0',
            lineHeight: '1',
            opacity: 0.7,
          }}
          onMouseEnter={(e) => e.target.style.opacity = '1'}
          onMouseLeave={(e) => e.target.style.opacity = '0.7'}
        >
          ×
        </button>
      </div>
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
