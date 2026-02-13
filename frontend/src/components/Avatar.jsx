function Avatar({ user, size = 'md', className = '' }) {
    const sizeClasses = {
        sm: 'avatar-sm',
        md: '',
        lg: 'avatar-lg'
    };

    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.charAt(0).toUpperCase();
    };

    const handleImageError = (e) => {
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'flex';
    };

    const imageUrl = user?.profileImage
        ? `${import.meta.env.VITE_API_URL}/uploads/profiles/${user.profileImage}`
        : null;

    return (
        <div className={`avatar ${sizeClasses[size]} ${className}`} style={{ position: 'relative', overflow: 'hidden' }}>
            {imageUrl ? (
                <>
                    <img
                        src={imageUrl}
                        alt={user?.name || 'User'}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            position: 'absolute',
                            top: 0,
                            left: 0
                        }}
                        onError={handleImageError}
                    />
                    <div style={{ display: 'none' }}>
                        {getInitials(user?.name)}
                    </div>
                </>
            ) : (
                <div>{getInitials(user?.name)}</div>
            )}
        </div>
    );
}

import PropTypes from 'prop-types';

Avatar.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string,
        profileImage: PropTypes.string,
    }),
    size: PropTypes.string,
    className: PropTypes.string,
};

export default Avatar;
