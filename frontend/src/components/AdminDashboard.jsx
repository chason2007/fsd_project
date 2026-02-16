import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from './ConfirmModal';
import Avatar from './Avatar';
import Skeleton from './Skeleton';
import EmptyState from './EmptyState';
import StatusBadge from './StatusBadge';
import { formatDate, formatDateTime } from '../utils/dateUtils';

function AdminDashboard() {
    const { user: currentUser } = useAuth();
    const [attendanceLogs, setAttendanceLogs] = useState([]);
    const [attendancePage, setAttendancePage] = useState(1);
    const [attendanceMeta, setAttendanceMeta] = useState({ pages: 1, total: 0 });
    const [stats, setStats] = useState({ todayAttendance: 0, pendingLeaves: 0, totalUsers: 0 });

    const [pageLoading, setPageLoading] = useState(true);

    // Initialize with LOCAL date string (YYYY-MM-DD)
    const [selectedDate, setSelectedDate] = useState(() => {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    });

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', role: 'Employee', position: '', employeeId: '' });
    const [leaves, setLeaves] = useState([]);
    const [leavePage, setLeavePage] = useState(1);
    const [leaveMeta, setLeaveMeta] = useState({ pages: 1, total: 0 });

    const [editingAttendance, setEditingAttendance] = useState(null);
    const [editAttendanceStatus, setEditAttendanceStatus] = useState('');
    const [showEditAttendanceModal, setShowEditAttendanceModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

    // Leave Request State
    const [leaveReason, setLeaveReason] = useState('');
    const [leaveStartDate, setLeaveStartDate] = useState('');
    const [leaveEndDate, setLeaveEndDate] = useState('');
    const [isSubmittingLeave, setIsSubmittingLeave] = useState(false);

    const { showToast } = useToast();

    const openModal = (title, message, onConfirm) => {
        setModalConfig({ isOpen: true, title, message, onConfirm });
    };

    const closeModal = () => {
        setModalConfig({ isOpen: false, title: '', message: '', onConfirm: null });
    };

    const handleEditClick = (user) => {
        setEditingUser(user._id);
        setEditForm({
            name: user.name,
            email: user.email,
            role: user.role,
            position: user.position || '',
            employeeId: user.employeeId || ''
        });
    };

    // Mock Data
    const mockUsers = [
        { _id: 'u1', name: 'John Doe', email: 'john@worksync.com', role: 'Employee', position: 'Developer', employeeId: 'EMP001' },
        { _id: 'u2', name: 'Jane Smith', email: 'jane@worksync.com', role: 'Employee', position: 'Designer', employeeId: 'EMP002' },
        { _id: 'u3', name: 'Mike Johnson', email: 'mike@worksync.com', role: 'Manager', position: 'Team Lead', employeeId: 'EMP003' },
    ];

    const mockAttendance = [
        { _id: 'a1', userId: mockUsers[0], date: new Date().toISOString(), status: 'Present', modifiedBy: null },
        { _id: 'a2', userId: mockUsers[1], date: new Date().toISOString(), status: 'Half-day', modifiedBy: 'Admin' },
    ];

    const mockLeaves = [
        { _id: 'l1', userId: mockUsers[0], reason: 'Sick Leave', startDate: new Date().toISOString(), endDate: new Date().toISOString(), status: 'Pending' },
        { _id: 'l2', userId: mockUsers[1], reason: 'Vacation', startDate: new Date().toISOString(), endDate: new Date().toISOString(), status: 'Approved' },
    ];

    const handleUpdateUser = async () => {
        try {
            // Mock Update
            await new Promise(resolve => setTimeout(resolve, 500));
            setUsers(users.map(u => u._id === editingUser ? { ...u, ...editForm } : u));
            setEditingUser(null);
            showToast("User updated successfully (Mock)", 'success');
        } catch (err) {
            showToast("Failed to update user", 'error');
        }
    };

    const fetchAttendance = useCallback(async () => {
        // Mock Fetch Attendance
        await new Promise(resolve => setTimeout(resolve, 500));
        setAttendanceLogs(mockAttendance);
        setAttendanceMeta({ pages: 1, total: mockAttendance.length });
    }, [selectedDate, attendancePage]);

    useEffect(() => {
        const fetchAdminData = async () => {
            setPageLoading(true);
            try {
                await fetchAttendance();

                // Mock Fetch Users
                await new Promise(resolve => setTimeout(resolve, 500));
                setUsers(mockUsers);
                setFilteredUsers(mockUsers);

                // Mock Fetch Leaves
                await new Promise(resolve => setTimeout(resolve, 500));
                setLeaves(mockLeaves);
                setLeaveMeta({ pages: 1, total: mockLeaves.length });

            } catch (err) {
                console.error("Failed to fetch admin data", err);
                showToast("Failed to load dashboard data", 'error');
            } finally {
                setPageLoading(false);
            }
        };

        const fetchStats = async () => {
            // Mock Fetch Stats
            await new Promise(resolve => setTimeout(resolve, 500));
            setStats({
                todayAttendance: 2,
                pendingLeaves: 1,
                totalUsers: 3
            });
        };

        fetchAdminData();
        fetchStats();
    }, [selectedDate, attendancePage, leavePage, fetchAttendance, showToast]);

    // Search functionality
    useEffect(() => {
        if (searchTerm) {
            const filtered = users.filter(u =>
                u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (u.position && u.position.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (u.employeeId && u.employeeId.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    }, [searchTerm, users]);

    const submitLeaveRequest = async (e) => {
        e.preventDefault();
        setIsSubmittingLeave(true);

        try {
            // Mock Submit Leave
            await new Promise(resolve => setTimeout(resolve, 500));
            const newLeave = {
                _id: 'l' + Date.now(),
                userId: { name: 'Admin User', email: 'admin@worksync.com' }, // Current mock user
                reason: leaveReason,
                startDate: leaveStartDate,
                endDate: leaveEndDate,
                status: 'Pending'
            };

            showToast("Leave request submitted successfully! (Mock)", 'success');
            setLeaves([newLeave, ...leaves]);
            setLeaveReason('');
            setLeaveStartDate('');
            setLeaveEndDate('');
        } catch {
            showToast("Failed to request leave", 'error');
        } finally {
            setIsSubmittingLeave(false);
        }
    };

    const updateLeaveStatus = async (id, status) => {
        try {
            // Mock Update Status
            await new Promise(resolve => setTimeout(resolve, 500));
            setLeaves(leaves.map(l => l._id === id ? { ...l, status } : l));
            showToast(`Leave ${status.toLowerCase()} successfully (Mock)`, 'success');
        } catch {
            showToast("Failed to update status", 'error');
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            // Mock Delete
            await new Promise(resolve => setTimeout(resolve, 500));
            setUsers(users.filter(u => u._id !== id));
            showToast("User deleted successfully (Mock)", 'success');
        } catch {
            showToast("Failed to delete user", 'error');
        }
    };

    // Export attendance to CSV
    const exportToCSV = () => {
        if (attendanceLogs.length === 0) {
            showToast("No attendance data to export", 'error');
            return;
        }

        // Prepare CSV headers
        const headers = ['Employee Name', 'Email', 'Date', 'Time', 'Status'];

        // Prepare CSV rows
        const rows = attendanceLogs.map(log => {
            const date = new Date(log.date);
            return [
                log.userId?.name || 'Unknown',
                log.userId?.email || 'N/A',
                formatDate(date),
                date.toLocaleTimeString(),
                log.status
            ];
        });

        // Combine headers and rows
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `attendance_${selectedDate || 'all'}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast(`Exported ${attendanceLogs.length} attendance records`, 'success');
    };

    // Edit Attendance Handlers
    const openEditAttendanceModal = (log) => {
        setEditingAttendance(log);
        setEditAttendanceStatus(log.status);
        setShowEditAttendanceModal(true);
    };

    const handleUpdateAttendance = async () => {
        if (!editingAttendance) return;

        try {
            // Mock Update Attendance
            await new Promise(resolve => setTimeout(resolve, 500));

            // Update the log in the local list
            setAttendanceLogs(attendanceLogs.map(log =>
                log._id === editingAttendance._id ? { ...log, status: editAttendanceStatus } : log
            ));

            showToast(`Attendance updated for ${editingAttendance.userId?.name || 'User'} (Mock)`, 'success');
            setShowEditAttendanceModal(false);
            setEditingAttendance(null);

        } catch (err) {
            console.error('Update attendance error:', err);
            showToast('Failed to update attendance', 'error');
        }
    };

    // Calculate stats
    // Local calculation removed as they are unused and we use fetched stats

    return (
        <div className="fade-in max-w-screen-xl mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="mb-2">Admin Dashboard</h1>
                    <p className="text-muted">Manage users, attendance, and leave requests</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn btn-secondary">
                        Reports
                    </button>
                    <button className="btn btn-primary">
                        + Add Employee
                    </button>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="stats-grid">
                {pageLoading ? (
                    <>
                        <Skeleton type="card" height="120px" />
                        <Skeleton type="card" height="120px" />
                        <Skeleton type="card" height="120px" />
                    </>
                ) : (
                    <>
                        <div className="stat-card">
                            <h4 className="stat-label">Today's Attendance</h4>
                            <p className="stat-value text-success">{stats.todayAttendance}</p>
                        </div>
                        <div className="stat-card">
                            <h4 className="stat-label">Pending Leaves</h4>
                            <p className="stat-value text-warning">{stats.pendingLeaves}</p>
                        </div>
                        <div className="stat-card">
                            <h4 className="stat-label">Total Users</h4>
                            <p className="stat-value text-primary">{stats.totalUsers}</p>
                        </div>
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {/* User Management */}
                <div className="card md:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3>User Management</h3>
                        <div className="input-group w-64">
                            <span className="input-icon"></span>
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageLoading ? (
                                    <tr><td colSpan="3"><Skeleton /></td></tr>
                                ) : (
                                    <>
                                        {filteredUsers.map(u => (
                                            <tr key={u._id}>
                                                {editingUser === u._id ? (
                                                    <>
                                                        <td colSpan="2">
                                                            <div className="flex-col gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={editForm.name}
                                                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                                    placeholder="Name"
                                                                />
                                                                <input
                                                                    type="email"
                                                                    value={editForm.email}
                                                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                                                    placeholder="Email"
                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="flex gap-2">
                                                                <button onClick={handleUpdateUser} className="btn btn-primary btn-sm">Save</button>
                                                                <button onClick={() => setEditingUser(null)} className="btn btn-ghost btn-sm">Cancel</button>
                                                            </div>
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td>
                                                            <div className="flex items-center gap-3">
                                                                <Avatar user={u} size="sm" />
                                                                <div>
                                                                    <div className="font-bold">{u.name}</div>
                                                                    <div className="text-sm text-muted">{u.email}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td><StatusBadge status={u.role} /></td>
                                                        <td>
                                                            {(u.role !== 'Admin' || (currentUser && currentUser.email === 'admin@worksync.com')) && (
                                                                <div className="flex gap-2">
                                                                    <button onClick={() => handleEditClick(u)} className="btn btn-ghost p-2">Edit</button>
                                                                    <button
                                                                        onClick={() => openModal(
                                                                            'Delete User',
                                                                            `Are you sure you want to delete ${u.name}?`,
                                                                            () => handleDeleteUser(u._id)
                                                                        )}
                                                                        className="btn btn-ghost p-2 text-danger"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Request Leave Section for Admin */}
                <div className="card h-fit">
                    <h3 className="mb-4">Request Leave</h3>
                    <form onSubmit={submitLeaveRequest} className="flex flex-col gap-4">
                        <div>
                            <label className="mb-2 block text-sm font-bold text-muted">Reason</label>
                            <input
                                type="text"
                                placeholder="Meeting, Personal..."
                                value={leaveReason}
                                onChange={e => setLeaveReason(e.target.value)}
                                required
                                disabled={isSubmittingLeave}
                            />
                        </div>
                        <div className="flex gap-2">
                            <div className="w-full">
                                <label className="mb-2 block text-sm font-bold text-muted">Start Date</label>
                                <input
                                    type="date"
                                    value={leaveStartDate}
                                    onChange={e => setLeaveStartDate(e.target.value)}
                                    required
                                    disabled={isSubmittingLeave}
                                />
                            </div>
                            <div className="w-full">
                                <label className="mb-2 block text-sm font-bold text-muted">End Date</label>
                                <input
                                    type="date"
                                    value={leaveEndDate}
                                    onChange={e => setLeaveEndDate(e.target.value)}
                                    required
                                    disabled={isSubmittingLeave}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary w-full mt-2"
                            disabled={isSubmittingLeave}
                        >
                            {isSubmittingLeave ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Leave Requests */}
            <div className="card mb-8">
                <h3 className="mb-4">Leave Requests</h3>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Reason</th>
                                <th>Dates</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.map(l => (
                                <tr key={l._id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <Avatar user={l.userId} size="sm" />
                                            <span className="font-bold">{l.userId?.name}</span>
                                        </div>
                                    </td>
                                    <td>{l.reason}</td>
                                    <td>{formatDate(l.startDate)} - {formatDate(l.endDate)}</td>
                                    <td><StatusBadge status={l.status} /></td>
                                    <td>
                                        {l.status === 'Pending' && (
                                            <div className="flex gap-2">
                                                <button onClick={() => updateLeaveStatus(l._id, 'Approved')} className="btn btn-primary py-1 px-3">Approve</button>
                                                <button onClick={() => updateLeaveStatus(l._id, 'Rejected')} className="btn btn-danger py-1 px-3">Reject</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {leaves.length === 0 && (
                                <tr>
                                    <td colSpan="5">
                                        <EmptyState
                                            title="No Leave Requests"
                                            description="There are no pending leave requests at the moment."
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Leave Pagination Controls */}
                {leaveMeta.pages > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                        <button
                            className="btn btn-ghost"
                            disabled={leavePage === 1}
                            onClick={() => setLeavePage(p => Math.max(1, p - 1))}
                        >
                            « Previous
                        </button>
                        <span className="flex items-center text-sm text-muted">
                            Page {leavePage} of {leaveMeta.pages}
                        </span>
                        <button
                            className="btn btn-ghost"
                            disabled={leavePage === leaveMeta.pages}
                            onClick={() => setLeavePage(p => Math.min(leaveMeta.pages, p + 1))}
                        >
                            Next »
                        </button>
                    </div>
                )}
            </div>

            {/* Attendance Logs */}
            <div className="card">
                <div className="flex justify-between items-center mb-6">
                    <h3>Attendance Logs</h3>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={exportToCSV}
                            className="btn btn-secondary"
                            disabled={attendanceLogs.length === 0}
                        >
                            Export CSV
                        </button>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-auto"
                        />
                    </div>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Date/Time</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceLogs.map(log => (
                                <tr key={log._id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <Avatar user={log.userId} size="sm" />
                                            <div>
                                                <div className="font-bold">{log.userId?.name || 'Unknown'}</div>
                                                <div className="text-sm text-muted">{log.userId?.email || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div>{formatDateTime(log.date)}</div>
                                        {(log.modifiedBy || log.modifiedAt) && (
                                            <div className="text-sm text-muted">
                                                Edited {log.modifiedAt && formatDate(log.modifiedAt)}
                                            </div>
                                        )}
                                    </td>
                                    <td><StatusBadge status={log.status} /></td>
                                    <td>
                                        <button
                                            onClick={() => openEditAttendanceModal(log)}
                                            className="btn btn-ghost"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {attendanceLogs.length === 0 && (
                                <tr>
                                    <td colSpan="4">
                                        <EmptyState
                                            title="No Attendance"
                                            description={`No records for ${formatDate(selectedDate)}.`}
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Attendance Pagination Controls */}
                {attendanceMeta.pages > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                        <button
                            className="btn btn-ghost"
                            disabled={attendancePage === 1}
                            onClick={() => setAttendancePage(p => Math.max(1, p - 1))}
                        >
                            « Previous
                        </button>
                        <span className="flex items-center text-sm text-muted">
                            Page {attendancePage} of {attendanceMeta.pages}
                        </span>
                        <button
                            className="btn btn-ghost"
                            disabled={attendancePage === attendanceMeta.pages}
                            onClick={() => setAttendancePage(p => Math.min(attendanceMeta.pages, p + 1))}
                        >
                            Next »
                        </button>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                onConfirm={modalConfig.onConfirm}
                title={modalConfig.title}
                message={modalConfig.message}
                danger={true}
            />

            {/* Edit Attendance Modal */}
            {showEditAttendanceModal && editingAttendance && (
                <>
                    <div className="modal-backdrop" onClick={() => setShowEditAttendanceModal(false)} />
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Edit Attendance</h3>
                            <button
                                className="btn btn-ghost p-2"
                                onClick={() => setShowEditAttendanceModal(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="modal-body">
                            <p className="text-muted mb-4">
                                Updating attendance for <strong>{editingAttendance.userId?.name}</strong>
                                <br />
                                <span className="text-sm">
                                    Original Date: {formatDateTime(editingAttendance.date)}
                                </span>
                            </p>
                            <div>
                                <label className="block mb-2 font-bold text-sm">Status</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Present', 'Half-day', 'Absent'].map((status) => (
                                        <div
                                            key={status}
                                            className={`stat-card cursor-pointer p-4 items-center justify-center ${editAttendanceStatus === status ? 'bg-primary-50 ring-2 ring-primary-500' : 'bg-surface'}`}
                                            onClick={() => setEditAttendanceStatus(status)}
                                        >
                                            <div className="text-sm font-semibold text-center">
                                                {status}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={() => setShowEditAttendanceModal(false)} className="btn btn-ghost">
                                Cancel
                            </button>
                            <button type="button" onClick={handleUpdateAttendance} className="btn btn-primary">
                                Update
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default AdminDashboard;
