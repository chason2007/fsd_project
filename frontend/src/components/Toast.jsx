import { useEffect } from 'react';

function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const styles = {
        container: {
            position: 'fixed',
            top: '2rem',
            right: '2rem',
            zIndex: 1000,
            minWidth: '300px',
            maxWidth: '400px',
            animation: 'slideInRight 0.3s ease-out'
        },
        toast: {
            background: type === 'success' ? '#dcfce7' : '#fee2e2',
            border: `1px solid ${type === 'success' ? '#86efac' : '#fca5a5'}`,
            borderRadius: '12px',
            padding: '1rem 1.5rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
        },
        icon: {
            fontSize: '1.5rem'
        },
        content: {
            flex: 1
        },
        message: {
            color: type === 'success' ? '#166534' : '#991b1b',
            fontWeight: '600',
            fontSize: '0.95rem',
            margin: 0
        },
        closeButton: {
            background: 'transparent',
            border: 'none',
            color: type === 'success' ? '#166534' : '#991b1b',
            cursor: 'pointer',
            fontSize: '1.25rem',
            padding: '0',
            lineHeight: 1,
            opacity: 0.7,
            transition: 'opacity 0.2s'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.toast}>
                <span style={styles.icon}>
                </span>
                <div style={styles.content}>
                    <p style={styles.message}>{message}</p>
                </div>
                <button
                    onClick={onClose}
                    style={styles.closeButton}
                    onMouseOver={(e) => e.target.style.opacity = '1'}
                    onMouseOut={(e) => e.target.style.opacity = '0.7'}
                >
                    ×
                </button>
            </div>
        </div>
    );
}

export default Toast;
