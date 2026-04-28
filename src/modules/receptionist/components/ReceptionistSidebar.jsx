import React from 'react';
import { SIDEBAR, STYLES, COLORS } from '../constants/receptionistConstants';

export default function ReceptionistSidebar({ activeSection, onSectionChange }) {
  return (
    <div style={STYLES.sidebar}>
      <ul className="nav flex-column" style={{ gap: '0.375rem', listStyle: 'none', padding: 0 }}>
        {SIDEBAR.sections.map(section => {
          const isActive = activeSection === section.id;
          const itemStyle = isActive ? STYLES.sidebarItem.active : STYLES.sidebarItem.inactive;
          
          return (
            <li key={section.id}>
              <button
                style={{
                  ...itemStyle,
                  width: '100%',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  fontFamily: STYLES.typography.fontFamily
                }}
                onClick={() => onSectionChange(section.id)}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = COLORS.slate100;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <i className={`bi ${section.icon}`} style={{ fontSize: '1.125rem' }}></i>
                <span>{section.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
