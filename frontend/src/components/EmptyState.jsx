import React from 'react';

function EmptyState({ icon, title = 'No Data Found', description = 'There is nothing to show here yet.', actionLabel, onAction }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem 2rem',
            textAlign: 'center',
            color: 'var(--pk-text-muted)',
            background: 'var(--pk-bg)',
            borderRadius: 'var(--pk-radius)',
            border: '2px dashed var(--pk-border)',
            margin: '1rem 0'
        }}>
            <div style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                background: 'var(--pk-surface)',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--pk-shadow)'
            }}>
                {icon || 'N/A'}
            </div>
            <h4 style={{
                margin: '0 0 0.5rem 0',
                color: 'var(--pk-text-main)',
                fontSize: '1.1rem',
                fontWeight: '600'
            }}>
                {title}
            </h4>
            <p style={{
                margin: 0,
                fontSize: '0.9rem',
                maxWidth: '300px',
                marginBottom: actionLabel ? '1.5rem' : '0'
            }}>
                {description}
            </p>
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="btn btn-primary"
                    style={{ fontSize: '0.9rem' }}
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}

export default EmptyState;
