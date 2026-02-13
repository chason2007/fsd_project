import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import { formatDate } from '../utils/dateUtils';

function AttendanceForm() {
    const [status, setStatus] = useState('Present');
    const [loading, setLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [todayAttendance, setTodayAttendance] = useState(null);
    const [hasSubmittedToday, setHasSubmittedToday] = useState(false);

    const { showToast } = useToast();
    const { user } = useAuth();

    // Update current time (just for header display)
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Check today's status & History
    useEffect(() => {
        if (user) {
            checkTodayAttendance();
            fetchAttendanceHistory();
        }
    }, [user, checkTodayAttendance, fetchAttendanceHistory]);

    const checkTodayAttendance = useCallback(async () => {
        if (!user || user._id === undefined) return;
        const userId = user._id || user.id;

        try {
            const token = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token');
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/attendance/today/${userId}`,
                { headers: { 'auth-token': token } }
            );

            if (response.data.hasAttendance) {
                setHasSubmittedToday(true);
                setTodayAttendance(response.data.attendance);
            }
        } catch (error) {
            console.error('Failed to check attendance:', error);
        }
    }, [user]);

    const fetchAttendanceHistory = useCallback(async () => {
        if (!user || user._id === undefined) return;
        const userId = user._id || user.id;
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/attendance/user/${userId}`);
            const records = Array.isArray(response.data) ? response.data : [];
            setAttendanceHistory(records.slice(0, 7)); // Last 7 days
        } catch (error) {
            console.error('Failed to fetch history:', error);
        }
    }, [user]);

    const markAttendance = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token');
            const userId = user._id || user.id;

            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/attendance/mark`, {
                userId,
                status
            }, { headers: { 'auth-token': token } });

            showToast(`Attendance marked as ${status}!`, 'success');
            setHasSubmittedToday(true);
            setTodayAttendance(res.data);
            fetchAttendanceHistory();
        } catch (error) {
            const msg = error.response?.data?.error || 'Failed to mark attendance';
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    // const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const formatTime = (date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const statusOptions = [
        {
            value: 'Present',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            ),
            label: 'Present'
        },
        {
            value: 'Half-day',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2a10 10 0 0 1 0 20Z" fill="currentColor" fillOpacity="0.5"></path>
                </svg>
            ),
            label: 'Half Day'
        },
        {
            value: 'Absent',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            ),
            label: 'Absent'
        }
    ];

    const presentDays = attendanceHistory.filter(r => r.status === 'Present').length;
    const halfDays = attendanceHistory.filter(r => r.status === 'Half-day').length;

    return (
        <div className="page-container">
            {/* Header */}
            <div className="page-header">
                <h1>Attendance Tracker</h1>
                <p className="subtitle">{formatDate(currentTime)}</p>
                <p className="subtitle text-primary font-semibold">
                    {formatTime(currentTime)}
                </p>
            </div>

            {/* Stats */}
            {attendanceHistory.length > 0 && (
                <div className="stats-grid">
                    <div className="stat-card">
                        <h4>Present Days</h4>
                        <p className="stat-value">{presentDays}</p>
                    </div>
                    <div className="stat-card bg-gradient-warning">
                        <h4>Half Days</h4>
                        <p className="stat-value">{halfDays}</p>
                    </div>
                </div>
            )}

            {/* Attendance Card */}
            <div className="card text-center">
                {hasSubmittedToday ? (
                    <div className="py-8">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                            {todayAttendance?.status === 'Absent' ? 'Unmarked' : todayAttendance?.status === 'Half-day' ? 'Half-day' : 'Present'}
                        </div>
                        <h2 className="mb-2">Attendance Marked</h2>
                        <p className="text-muted">
                            You have marked yourself as <strong>{todayAttendance?.status}</strong> for today.
                        </p>
                    </div>
                ) : (
                    <>
                        <h3 className="mb-4">How are you working today?</h3>
                        <div className="status-grid">
                            {statusOptions.map((option) => (
                                <div
                                    key={option.value}
                                    className={`status-card ${status === option.value ? 'selected' : ''}`}
                                    onClick={() => setStatus(option.value)}
                                >
                                    <span className="status-card-icon">{option.icon}</span>
                                    <h4 className="status-card-title">{option.label}</h4>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={markAttendance}
                            className="btn btn-primary w-full py-3 mt-4 text-lg"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Submit Attendance'}
                        </button>
                    </>
                )}
            </div>

            {/* History Table */}
            {attendanceHistory.length > 0 && (
                <div className="card">
                    <h3 className="mb-4">Recent History</h3>
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Day</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceHistory.map((record, index) => (
                                    <tr key={index}>
                                        <td>{formatDate(record.date)}</td>
                                        <td>{new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}</td>
                                        <td><StatusBadge status={record.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AttendanceForm;