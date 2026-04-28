import { DASHBOARD, STYLES, COLORS, STATS_CARD } from '../constants/receptionistConstants';

// StatsCard Component (inline)
function StatsCard({ number, label, sublabel, icon, color = 'primary' }) {
  const currentColor = STATS_CARD.colorSchemes[color];

  return (
    <div 
      style={{
        background: COLORS.white,
        borderRadius: '10px',
        boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        border: `1px solid ${COLORS.slate200}`,
        padding: '1rem',
        cursor: 'default',
        height: '100%',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Compact Layout */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        {/* Small Icon - No background box */}
        <i 
          className={`bi ${icon}`}
          style={{
            fontSize: '1.125rem',
            color: currentColor.iconColor,
            opacity: 0.8
          }}
        ></i>
        
        {/* Compact Number */}
        <div 
          style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: COLORS.slate900,
            lineHeight: '1',
            fontFamily: STYLES.typography.fontFamily
          }}
        >
          {number}
        </div>
      </div>

      {/* Labels */}
      <div>
        <div 
          style={{
            fontSize: '0.875rem',
            fontWeight: '500',
            color: COLORS.slate700,
            marginBottom: '0.125rem',
            fontFamily: STYLES.typography.fontFamily
          }}
        >
          {label}
        </div>
        <div 
          style={{
            fontSize: '0.75rem',
            color: COLORS.slate500,
            fontWeight: '400',
            fontFamily: STYLES.typography.fontFamily
          }}
        >
          {sublabel}
        </div>
      </div>
    </div>
  );
}

// DashboardSection Component
export default function DashboardSection({ stats }) {
  return (
    <div style={{ background: COLORS.slate50, minHeight: '100vh', padding: '1rem 2rem' }}>
      {/* Compact Header */}
      <div style={{ marginBottom: '1.25rem', marginTop: '0.5rem' }}>
        <h1 style={{ 
          fontSize: '1.25rem',
          fontWeight: '600',
          color: COLORS.slate900,
          margin: 0,
          marginBottom: '0.25rem',
          fontFamily: STYLES.typography.fontFamily
        }}>
          {DASHBOARD.title}
        </h1>
        <p style={{ 
          fontSize: '0.875rem',
          color: COLORS.slate500,
          margin: 0,
          fontFamily: STYLES.typography.fontFamily
        }}>
          {DASHBOARD.subtitle}
        </p>
      </div>

      {/* Compact Stats Cards Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1rem' 
      }}>
        <StatsCard
          number={stats.totalPatients}
          label={DASHBOARD.stats.patients.label}
          sublabel={DASHBOARD.stats.patients.sublabel}
          icon={DASHBOARD.stats.patients.icon}
          color={DASHBOARD.stats.patients.color}
        />
        <StatsCard
          number={stats.appointmentsToday}
          label={DASHBOARD.stats.appointments.label}
          sublabel={DASHBOARD.stats.appointments.sublabel}
          icon={DASHBOARD.stats.appointments.icon}
          color={DASHBOARD.stats.appointments.color}
        />
        <StatsCard
          number={stats.totalRooms}
          label={DASHBOARD.stats.rooms.label}
          sublabel={DASHBOARD.stats.rooms.sublabel}
          icon={DASHBOARD.stats.rooms.icon}
          color={DASHBOARD.stats.rooms.color}
        />
        <StatsCard
          number={`${stats.bedsOccupied}/${stats.bedsOccupied + stats.bedsAvailable}`}
          label={DASHBOARD.stats.beds.label}
          sublabel={`${stats.bedsAvailable} ${DASHBOARD.stats.beds.sublabel}`}
          icon={DASHBOARD.stats.beds.icon}
          color={DASHBOARD.stats.beds.color}
        />
      </div>
    </div>
  );
}
