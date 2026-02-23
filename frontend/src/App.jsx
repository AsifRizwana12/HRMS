import React, { useState } from 'react';
import EmployeeManager from './pages/EmployeeManager';
import AttendanceManager from './pages/AttendanceManager';

const App = () => {
  const [view, setView] = useState('employees');
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">HRMS Lite</div>
        <div className="nav-links">
          <button
            className={`btn ${view === 'employees' ? 'nav-link active' : 'nav-link'}`}
            onClick={() => setView('employees')}
          >
            Employees
          </button>
          <button
            className={`btn ${view === 'attendance' ? 'nav-link active' : 'nav-link'}`}
            onClick={() => setView('attendance')}
          >
            Attendance
          </button>
        </div>
      </nav>

      <main className="container">
        {view === 'employees' ? (
          <EmployeeManager showToast={showToast} />
        ) : (
          <AttendanceManager showToast={showToast} />
        )}
      </main>

      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
