import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import Avatar from './Avatar';
import Skeleton from './Skeleton';
import EmptyState from './EmptyState';
import StatusBadge from './StatusBadge';
import ConfirmModal from './ConfirmModal';
import { formatDate } from '../utils/dateUtils';

function EmployeeDashboard({ user }) {
    const [pageLoading, setPageLoading] = useState(true);
    const [leaves, setLeaves] = useState([]);
    const [leavePage, setLeavePage] = useState(1);
    const [leaveMeta, setLeaveMeta] = useState({ pages: 1, total: 0 });
    const [stats, setStats] = useState({ totalPresent: 0, totalHalfDays: 0, thisMonthPresent: 0 });

    const [leaveReason, setLeaveReason] = useState('');
    const [leaveStartDate, setLeaveStartDate] = useState('');
    const [leaveEndDate, setLeaveEndDate] = useState('');
    const [loading, setLoading] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({ title: '', message: '', action: null });

    const openModal = (title, message, action) => {
        setModalConfig({ title, message, action });
        setIsModalOpen(true);
    };

    // Unused state removed: attendanceRecords, attendancePage, attendanceMeta
    const { showToast } = useToast();

    useEffect(() => {
        fetchData();
    }, [user, leavePage, fetchData]);

    const fetchData = useCallback(async () => {
        const token = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token');
        try {
            // Fetch leaves
            const leavesRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/leaves?page=${leavePage}&limit=5`, {
                headers: { 'auth-token': token }
            });
            if (leavesRes.data.pagination) {
                setLeaves(leavesRes.data.data);
                setLeaveMeta(leavesRes.data.pagination);
            } else {
                setLeaves(Array.isArray(leavesRes.data) ? leavesRes.data : []);
            }

            // Attendance fetch removed as unused state was removed

            // Fetch stats
            if (user?._id || user?.id) {
                const userId = user._id || user.id;
                const statsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/attendance/stats/${userId}`, {
                    headers: { 'auth-token': token }
                });
                setStats(statsRes.data);
            }
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setPageLoading(false);
        }
    }, [user, leavePage]);

    const submitLeaveRequest = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token');
            await axios.post(`${import.meta.env.VITE_API_URL}/api/leaves`, {
                reason: leaveReason,
                startDate: leaveStartDate,
                endDate: leaveEndDate
            }, { headers: { 'auth-token': token } });

            showToast("Leave request submitted successfully!", 'success');
            // Refresh leaves to show new one (reset to page 1)
            setLeavePage(1);
            fetchData();

            setLeaveReason('');
            setLeaveStartDate('');
            setLeaveEndDate('');
        } catch {
            showToast("Failed to request leave", 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelLeave = async (leaveId) => {
        try {
            const token = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token');
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/leaves/${leaveId}`, {
                headers: { 'auth-token': token }
            });
            showToast('Leave request cancelled successfully', 'success');
            fetchData(); // Refresh list
        } catch (err) {
            showToast(err.response?.data?.error || 'Failed to cancel leave', 'error');
        }
    };

    return (
        <div className="fade-in max-w-screen-xl mx-auto p-4 md:p-8">
            {/* Welcome Card */}
            <div className="card flex justify-between items-center bg-gradient-primary text-white mb-8">
                <div className="flex items-center gap-4">
                    <Avatar user={user} size="lg" />
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Welcome, {user?.name}!</h2>
                        <p className="opacity-90">Role: {user?.role} {user?.position && `• ${user.position}`}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm opacity-80">
                        {formatDate(new Date())}
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid mb-8">
                {pageLoading ? (
                    <>
                        <Skeleton type="card" height="120px" />
                        <Skeleton type="card" height="120px" />
                        <Skeleton type="card" height="120px" />
                        <Skeleton type="card" height="120px" />
                    </>
                ) : (
                    <>
                        <div className="stat-card">
                            <h4>Pending Requests</h4>
                            <p className="stat-value">{leaves.filter(l => l.status === 'Pending').length}</p>
                        </div>
                        <div className="stat-card bg-gradient-success">
                            <h4>Approved Leaves</h4>
                            <p className="stat-value">{leaves.filter(l => l.status === 'Approved').length}</p>
                        </div>
                        <div className="stat-card bg-gradient-warning">
                            <h4>This Month</h4>
                            <p className="stat-value">{stats.thisMonthPresent} days</p>
                        </div>
                        <div className="stat-card bg-gradient-violet">
                            <h4>Total Present</h4>
                            <p className="stat-value">{stats.totalPresent}</p>
                        </div>
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                {/* Request Form */}
                <div className="card lg:col-span-2 h-fit">
                    <h3 className="flex items-center gap-2 mb-4">
                        Request Leave
                    </h3>
                    <form onSubmit={submitLeaveRequest} className="flex flex-col gap-4">
                        <div>
                            <label htmlFor="leave-reason" className="block mb-2 font-medium">
                                Reason
                            </label>
                            <input
                                id="leave-reason"
                                type="text"
                                placeholder="Sick leave, Vacation..."
                                value={leaveReason}
                                onChange={e => setLeaveReason(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="w-full">
                                <label htmlFor="leave-start" className="block mb-2 font-medium">
                                    Start Date
                                </label>
                                <input
                                    id="leave-start"
                                    type="date"
                                    value={leaveStartDate}
                                    onChange={e => setLeaveStartDate(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="leave-end" className="block mb-2 font-medium">
                                    End Date
                                </label>
                                <input
                                    id="leave-end"
                                    type="date"
                                    value={leaveEndDate}
                                    onChange={e => setLeaveEndDate(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className={`btn btn-primary mt-4 ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </form>
                </div>

                {/* Leave History */}
                <div className="card lg:col-span-3">
                    <h3 className="flex items-center gap-2 mb-4">
                        My Leave History
                    </h3>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Reason</th>
                                    <th>Dates</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageLoading ? (
                                    <>
                                        <tr><td colSpan="3"><Skeleton /></td></tr>
                                        <tr><td colSpan="3"><Skeleton /></td></tr>
                                        <tr><td colSpan="3"><Skeleton /></td></tr>
                                    </>
                                ) : (
                                    <>
                                        {leaves.map(l => (
                                            <tr key={l._id}>
                                                <td>{l.reason}</td>
                                                <td>{formatDate(l.startDate)} - {formatDate(l.endDate)}</td>
                                                <td>
                                                    <StatusBadge status={l.status} />
                                                </td>
                                                <td>
                                                    {l.status === 'Pending' && (
                                                        <button
                                                            className="btn btn-ghost p-2 text-sm text-danger"
                                                            onClick={() => openModal(
                                                                'Cancel Leave Request',
                                                                'Are you sure you want to cancel this pending leave request?',
                                                                () => handleCancelLeave(l._id)
                                                            )}
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {leaves.length === 0 && (
                                            <tr>
                                                <td colSpan="4">
                                                    <EmptyState
                                                        title="No Leave History"
                                                        description="You haven't applied for any leaves yet."
                                                    />
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Leave Pagination Controls */}
                    {leaveMeta.pages > 1 && (
                        <div className="flex justify-center gap-2 mt-4 p-2">
                            <button
                                className="btn btn-ghost p-2 text-sm"
                                disabled={leavePage === 1}
                                onClick={() => setLeavePage(p => Math.max(1, p - 1))}
                            >
                                «
                            </button>
                            <span className="flex items-center text-sm">
                                Page {leavePage}
                            </span>
                            <button
                                className="btn btn-ghost p-2 text-sm"
                                disabled={leavePage === leaveMeta.pages}
                                onClick={() => setLeavePage(p => Math.min(leaveMeta.pages, p + 1))}
                            >
                                »
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={modalConfig.action}
                title={modalConfig.title}
                message={modalConfig.message}
                confirmText="Yes, Cancel"
                danger={true}
            />
        </div>
    );
}

EmployeeDashboard.propTypes = {
    user: PropTypes.shape({
        _id: PropTypes.string,
        id: PropTypes.string,
        name: PropTypes.string,
        role: PropTypes.string,
        position: PropTypes.string,
    }),
};

export default EmployeeDashboard;
