import { useState, useEffect } from 'react';
import { getPatients, getRooms, getBeds, getStaffs } from '../../../services/api';
import ReceptionistSidebar from '../components/ReceptionistSidebar';
import DashboardSection from '../components/DashboardSection';
import AppointmentsSection from '../components/AppointmentsSection';
import PatientsSection from '../components/PatientsSection';
import RoomsBedsSection from '../components/RoomsBedsSection';
import Toast from '../../../components/common/Toast';
import { LOADING_STYLES, COLORS } from '../constants/receptionistConstants';

export default function ReceptionistDashboardPage() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [patients, setPatients] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [beds, setBeds] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalPatients: 0, appointmentsToday: 0, totalRooms: 0, bedsOccupied: 0, bedsAvailable: 0 });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [patients, rooms, beds]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [patientsData, roomsData, bedsData, staffData] = await Promise.all([
        getPatients(),
        getRooms(),
        getBeds(),
        getStaffs()
      ]);
      setPatients(Array.isArray(patientsData) ? patientsData : []);
      setRooms(Array.isArray(roomsData) ? roomsData : []);
      setBeds(Array.isArray(bedsData) ? bedsData : []);
      
      // Debug: Log all staff data
      console.log('All staff data:', staffData);
      
      // Filter doctors by staffType (DOCTOR) and ensure they're active
      const doctorsList = Array.isArray(staffData) 
        ? staffData.filter(s => {
            const staffType = s.staffType || '';
            const isActive = s.employeeActive !== undefined ? s.employeeActive : s.isEmployeeActive;
            return staffType.toUpperCase() === 'DOCTOR' && isActive !== false;
          })
        : [];
      
      console.log('Filtered doctors:', doctorsList);
      setDoctors(doctorsList);
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const bedsOccupied = beds.filter(b => b.isOccupied || b.occupied).length;
    const bedsAvailable = beds.filter(b => !b.isOccupied && !b.occupied).length;
    setStats({
      totalPatients: patients.length,
      appointmentsToday: 0,
      totalRooms: rooms.length,
      bedsOccupied,
      bedsAvailable
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={LOADING_STYLES.container}>
        <div className="spinner-border text-primary" role="status" style={LOADING_STYLES.spinner}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const handleBookAppointment = (patient) => {
    console.log('Book button clicked for patient:', patient);
    console.log('Switching to appointments section...');
    setActiveSection('appointments');
    // Store patient in sessionStorage so AppointmentsSection can pick it up
    sessionStorage.setItem('preselectedPatient', JSON.stringify(patient));
    console.log('Patient stored in sessionStorage:', sessionStorage.getItem('preselectedPatient'));
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: COLORS.slate50 }}>
      <ReceptionistSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-grow-1 p-4">
        {activeSection === 'dashboard' && <DashboardSection stats={stats} />}
        {activeSection === 'appointments' && <AppointmentsSection doctors={doctors} showToast={showToast} />}
        {activeSection === 'patients' && <PatientsSection patients={patients} doctors={doctors} onRefresh={loadAllData} showToast={showToast} onBookAppointment={handleBookAppointment} />}
        {activeSection === 'rooms' && <RoomsBedsSection rooms={rooms} beds={beds} stats={stats} onRefresh={loadAllData} showToast={showToast} />}

        <Toast show={toast.show} message={toast.message} type={toast.type} onClose={hideToast} />
      </div>
    </div>
  );
}
