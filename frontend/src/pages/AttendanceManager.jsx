import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipboardList, Loader2 } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5001/api';

const AttendanceManager = ({ showToast }) => {
    const [employees, setEmployees] = useState([]);
    const [records, setRecords] = useState([]);
    const [selectedEmp, setSelectedEmp] = useState('');
    const [attendanceData, setAttendanceData] = useState({
        date: new Date().toISOString().split('T')[0],
        status: 'Present'
    });
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/employees`);
            setEmployees(res.data);
        } catch (err) {
            console.error('Failed to load employees');
        }
    };

    const fetchAttendance = async (id) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/attendance/${id}`);
            setRecords(res.data);
        } catch (err) {
            console.error('Failed to load attendance');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAttendance = async (e) => {
        e.preventDefault();
        if (!selectedEmp) return showToast('Select an employee', 'error');

        setSubmitting(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/attendance`, {
                employee_id: selectedEmp,
                ...attendanceData
            });
            fetchAttendance(selectedEmp);
            showToast(res.data.message || 'Attendance marked successfully');
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to mark attendance';
            showToast(errorMsg, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEmployeeChange = (e) => {
        const id = e.target.value;
        setSelectedEmp(id);
        if (id) fetchAttendance(id);
        else setRecords([]);
    };

    return (
        <div>
            <div className="card">
                <h2 style={{ marginBottom: '1rem' }}><ClipboardList size={20} /> Mark Attendance</h2>
                <form onSubmit={handleMarkAttendance} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', alignItems: 'end' }}>
                    <div>
                        <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Employee</label>
                        <select className="input" value={selectedEmp} onChange={handleEmployeeChange} required>
                            <option value="">Select Employee</option>
                            {employees.map(emp => (
                                <option key={emp.employee_id} value={emp.employee_id}>{emp.full_name} ({emp.employee_id})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Date</label>
                        <input
                            type="date" className="input" required
                            value={attendanceData.date} onChange={e => setAttendanceData({ ...attendanceData, date: e.target.value })}
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Status</label>
                        <select
                            className="input" value={attendanceData.status}
                            onChange={e => setAttendanceData({ ...attendanceData, status: e.target.value })}
                        >
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 3', marginTop: '1rem' }} disabled={submitting}>
                        {submitting ? 'Marking...' : 'Mark Attendance'}
                    </button>
                </form>
            </div>

            {selectedEmp && (
                <div className="card">
                    <h2>Attendance Records for {employees.find(e => e.employee_id === selectedEmp)?.full_name}</h2>
                    {loading ? (
                        <div className="empty-state"><Loader2 className="loading-spinner" /></div>
                    ) : records.length === 0 ? (
                        <div className="empty-state">No attendance records found.</div>
                    ) : (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map(rec => (
                                    <tr key={rec.id}>
                                        <td>{rec.date}</td>
                                        <td style={{ color: rec.status === 'Present' ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                                            {rec.status}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default AttendanceManager;
