import React from 'react';

const STATUS_CONFIG = {
    // Attendance
    'Present': { color: 'success' },
    'Absent': { color: 'danger' },
    'Late': { color: 'warning' },
    'Half-day': { color: 'warning' },

    // Leaves
    'Approved': { color: 'success' },
    'Rejected': { color: 'danger' },
    'Pending': { color: 'warning' },

    // Roles
    'Admin': { color: 'primary' },
    'Employee': { color: 'neutral' },

    // General
    'Completed': { color: 'success' },
    'Active': { color: 'success' },
    'Inactive': { color: 'neutral' }
};

const StatusBadge = ({ status, className = '' }) => {
    const config = STATUS_CONFIG[status] || { color: 'neutral', icon: '•' };

    return (
        <span className={`status-badge status-${config.color} ${className}`}>
            <span className="status-text">{status}</span>
        </span>
    );
};

export default StatusBadge;
