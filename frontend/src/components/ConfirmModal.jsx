import { useState } from 'react';

function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', danger = false }) {
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setLoading(true);
        await onConfirm();
        setLoading(false);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.2s ease-out'
        }} onClick={onClose}>
            <div className="card" style={{
                maxWidth: '500px',
                width: '90%',
                margin: 0,
                animation: 'slideUp 0.3s ease-out'
            }} onClick={(e) => e.stopPropagation()}>
                <h3 style={{
                    marginBottom: '1rem',
                    color: danger ? 'var(--pk-danger)' : 'var(--pk-text-main)'
                }}>
                    {title}
                </h3>
                <p style={{
                    color: 'var(--pk-text-muted)',
                    marginBottom: '2rem',
                    lineHeight: '1.6'
                }}>
                    {message}
                </p>
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'flex-end'
                }}>
                    <button
                        onClick={onClose}
                        className="btn btn-ghost"
                        disabled={loading}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`btn ${danger ? 'btn-danger-solid' : 'btn-primary'} ${loading ? 'loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;
