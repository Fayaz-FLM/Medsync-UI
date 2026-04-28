import { useEffect } from 'react'

/**
 * CommonModal - Reusable Modal Component
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback when modal should close
 * @param {string} title - Modal title
 * @param {node} children - Modal content
 * @param {node} footer - Modal footer (buttons)
 * @param {string} size - Modal size: 'sm', 'md', 'lg', 'xl'
 */
export default function CommonModal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  size = 'lg' 
}) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'modal-sm',
    md: '',
    lg: 'modal-lg',
    xl: 'modal-xl'
  }

  return (
    <div 
      className="modal show d-block" 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 1050,
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div 
        className={`modal-dialog modal-dialog-centered ${sizeClasses[size]}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          margin: '1.75rem auto',
          maxWidth: size === 'sm' ? '300px' : size === 'md' ? '500px' : size === 'lg' ? '800px' : '1140px',
        }}
      >
        <div 
          className="modal-content" 
          style={{ 
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          }}
        >
          {/* Modal Header */}
          <div 
            className="modal-header" 
            style={{ 
              borderBottom: '1px solid #dee2e6',
              padding: '1rem 1.5rem',
            }}
          >
            <h5 
              className="modal-title" 
              style={{ 
                fontWeight: '600', 
                color: '#2c3e50',
                fontSize: '1.1rem',
              }}
            >
              {title}
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Modal Body */}
          <div 
            className="modal-body" 
            style={{ 
              maxHeight: '70vh', 
              overflowY: 'auto',
              padding: '1.5rem',
            }}
          >
            {children}
          </div>

          {/* Modal Footer */}
          {footer && (
            <div 
              className="modal-footer" 
              style={{ 
                borderTop: '1px solid #dee2e6',
                padding: '1rem 1.5rem',
              }}
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
