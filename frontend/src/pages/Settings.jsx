import { useState } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal';
import ThemeToggle from '../components/ThemeToggle';

function Settings() {
    const { showToast } = useToast();
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

    const openModal = (title, message, onConfirm) => {
        setModalConfig({ isOpen: true, title, message, onConfirm });
    };

    const closeModal = () => {
        setModalConfig({ isOpen: false, title: '', message: '', onConfirm: null });
    };

    const handleDeleteUsers = async () => {
        try {
            const token = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token');
            const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
                headers: { 'auth-token': token }
            });
            showToast(res.data.message, 'success');
        } catch (err) {
            showToast("Failed to delete users: " + (err.response?.data?.error || err.message), 'error');
        }
    };

    const handleDeleteAttendance = async () => {
        try {
            const token = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token');
            const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/attendance`, {
                headers: { 'auth-token': token }
            });
            showToast(res.data.message, 'success');
        } catch (err) {
            showToast("Failed to delete attendance: " + (err.response?.data?.error || err.message), 'error');
        }
    };

    const handleDeleteLeaves = async () => {
        try {
            const token = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token');
            const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/leaves`, {
                headers: { 'auth-token': token }
            });
            showToast(res.data.message, 'success');
        } catch (err) {
            showToast("Failed to delete leaves: " + (err.response?.data?.error || err.message), 'error');
        }
    };

    const handleSystemReset = async () => {
        try {
            const token = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token');
            // Hard delete everything
            await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/reset-system`, {}, {
                headers: { 'auth-token': token }
            });
            showToast("System Reset Complete", 'success');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (err) {
            showToast("Reset Failed: " + (err.response?.data?.error || err.message), 'error');
        }
    };

    return (
        <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
            <h1 className="mb-8">Admin Settings</h1>

            {/* Appearance Settings */}
            <div className="card mb-8">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Appearance
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontWeight: '500' }}>Theme Preference</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--pk-text-muted)' }}>
                            Choose your preferred appearance mode.
                        </div>
                    </div>
                    <ThemeToggle />
                </div>
            </div>

            <div className="card border-danger">
                <h3 className="flex items-center gap-2 text-danger">
                    Danger Zone
                </h3>
                <p style={{ color: 'var(--pk-text-muted)', marginBottom: '1.5rem' }}>
                    These actions are destructive and cannot be undone. Please be certain.
                </p>
                <div className="flex flex-col gap-4">
                    {/* Delete Users */}
                    <div className="flex justify-between items-center p-4 bg-danger rounded border-danger">
                        <div style={{ flex: 1 }}>
                            <div className="flex items-center gap-2 mb-1">
                                <strong className="text-danger">Delete All Users</strong>
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                Removes all employee accounts. Admin remains.
                            </div>
                        </div>
                        <button
                            onClick={() => openModal(
                                'Delete All Users',
                                'This will permanently delete all employee accounts. Admin accounts will remain. This action cannot be undone.',
                                handleDeleteUsers
                            )}
                            className="btn btn-danger"
                        >
                            Delete Users
                        </button>
                    </div>

                    {/* Delete Attendance */}
                    <div className="flex justify-between items-center p-4 bg-danger rounded border-danger">
                        <div style={{ flex: 1 }}>
                            <div className="flex items-center gap-2 mb-1">
                                <strong className="text-danger">Delete All Attendance</strong>
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                Clears the entire attendance history log.
                            </div>
                        </div>
                        <button
                            onClick={() => openModal(
                                'Delete All Attendance',
                                'This will permanently delete all attendance records from the system. This action cannot be undone.',
                                handleDeleteAttendance
                            )}
                            className="btn btn-danger"
                        >
                            Delete Attendance
                        </button>
                    </div>

                    {/* Delete Leaves */}
                    <div className="flex justify-between items-center p-4 bg-danger rounded border-danger">
                        <div style={{ flex: 1 }}>
                            <div className="flex items-center gap-2 mb-1">
                                <strong className="text-danger">Delete All Leaves</strong>
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                Removes all leave requests (Pending/Approved/Rejected).
                            </div>
                        </div>
                        <button
                            onClick={() => openModal(
                                'Delete All Leaves',
                                'This will permanently delete all leave requests regardless of status. This action cannot be undone.',
                                handleDeleteLeaves
                            )}
                            className="btn btn-danger"
                        >
                            Delete Leaves
                        </button>
                    </div>

                    {/* Reset System */}
                    <div className="flex justify-between items-center p-4 bg-danger rounded border-danger">
                        <div style={{ flex: 1 }}>
                            <div className="flex items-center gap-2 mb-1">
                                <strong className="text-danger">RESET SYSTEM</strong>
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                Deletes ALL data (Users, Attendance, Leaves). Only Super Admin remains.
                            </div>
                        </div>
                        <button
                            onClick={() => openModal(
                                'RESET ENTIRE SYSTEM',
                                'WARNING: This will delete ALL attendance records, ALL leaves, and ALL users (except you). This cannot be undone. Are you absolutely sure?',
                                handleSystemReset
                            )}
                            className="btn btn-danger"
                            style={{ fontWeight: 'bold' }}
                        >
                            RESET SYSTEM
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                onConfirm={modalConfig.onConfirm}
                title={modalConfig.title}
                message={modalConfig.message}
                confirmText="Yes, Delete"
                cancelText="Cancel"
                danger={true}
            />

            <footer style={{
                marginTop: '4rem',
                textAlign: 'center',
                color: 'var(--pk-text-muted)',
                fontSize: '0.85rem',
                padding: '1rem',
                borderTop: '1px solid var(--pk-border)'
            }}>
                <p style={{ margin: 0 }}>WorkSync - developed by Chason Hurtis</p>
            </footer>
        </div >
    );
}

export default Settings;
