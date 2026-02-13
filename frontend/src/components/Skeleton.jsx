import React from 'react';

function Skeleton({ type = 'text', width, height, style = {}, className = '' }) {
    const baseStyle = {
        background: 'linear-gradient(90deg, var(--pk-border) 25%, var(--pk-surface) 50%, var(--pk-border) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: 'var(--pk-radius-sm)',
        display: 'inline-block',
        width: width || '100%',
        height: height || (type === 'text' ? '1em' : '20px'),
        opacity: 0.6,
        ...style
    };

    if (type === 'circle') {
        baseStyle.borderRadius = '50%';
        baseStyle.width = width || '40px';
        baseStyle.height = height || '40px';
    } else if (type === 'title') {
        baseStyle.height = '2rem';
        baseStyle.marginBottom = '1rem';
    } else if (type === 'card') {
        baseStyle.height = '150px';
        baseStyle.borderRadius = 'var(--pk-radius)';
    }

    return <div className={`skeleton ${className}`} style={baseStyle}></div>;
}

export default Skeleton;
