import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Trash2, Loader2 } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5001/api';

const EmployeeManager = ({ showToast }) => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        employee_id: '',
        full_name: '',
        email: '',
        department: ''
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/employees`);
            setEmployees(res.data);
            setError(null);
        } catch (err) {
            setError('Failed to load employees');
        } finally {
            setLoading(false);
        }
    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post(`${API_BASE_URL}/employees`, formData);
            setFormData({ employee_id: '', full_name: '', email: '', department: '' });
            fetchEmployees();
            showToast('Employee added successfully');
        } catch (err) {
            showToast(err.response?.data?.error || 'Failed to add employee', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        // Removed confirm() as per user request "no need of popup for employee manager"
        setSubmitting(true);
        try {
            await axios.delete(`${API_BASE_URL}/employees/${id}`);
            fetchEmployees();
            showToast('Employee deleted successfully');
        } catch (err) {
            showToast('Failed to delete employee', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <div className="card">
                <h2 style={{ marginBottom: '1rem' }}><UserPlus size={20} /> Add New Employee</h2>
                <form onSubmit={handleAddEmployee} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input
                        className="input" placeholder="Employee ID" required
                        value={formData.employee_id} onChange={e => setFormData({ ...formData, employee_id: e.target.value })}
                    />
                    <input
                        className="input" placeholder="Full Name" required
                        value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                    />
                    <input
                        className="input" placeholder="Email Address" type="email" required
                        value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                    <input
                        className="input" placeholder="Department" required
                        value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}
                    />
                    <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 2' }}>Add Employee</button>
                </form>
            </div>

            <div className="card">
                <h2>Employee List</h2>
                {loading ? (
                    <div className="empty-state"><Loader2 className="loading-spinner" /></div>
                ) : employees.length === 0 ? (
                    <div className="empty-state">No employees found.</div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(emp => (
                                <tr key={emp.employee_id}>
                                    <td>{emp.employee_id}</td>
                                    <td>{emp.full_name}</td>
                                    <td>{emp.email}</td>
                                    <td>{emp.department}</td>
                                    <td>
                                        <button className="btn btn-danger" onClick={() => handleDelete(emp.employee_id)}>
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default EmployeeManager;
