import { useState } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

// Helper functions outside component to avoid initialization issues
const generatePasswordHelper = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let newPassword = '';
    const randomValues = new Uint32Array(length);
    globalThis.crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
        newPassword += charset.charAt(randomValues[i] % charset.length);
    }
    return newPassword;
};

const getPasswordStrength = (pwd) => {
    if (!pwd) return null;
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[!@#$%^&*]/.test(pwd)) strength++;

    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
};

const getStrengthColor = (level) => {
    if (level === 'weak') return 'text-danger';
    if (level === 'medium') return 'text-warning';
    return 'text-success';
};

function AddUser() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Employee');
    const [position, setPosition] = useState('');

    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const { showToast } = useToast();

    const generatePassword = () => {
        const newPassword = generatePasswordHelper();
        setPassword(newPassword);
        showToast('Strong password generated!', 'success');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                showToast('Please select an image file', 'error');
                return;
            }
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                showToast('Image size must be less than 5MB', 'error');
                return;
            }
            setProfileImage(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadProfileImage = async (userId) => {
        if (!profileImage) {
            console.log('No profile image to upload');
            return;
        }

        console.log('Starting image upload for user:', userId);
        const formData = new FormData();
        formData.append('profileImage', profileImage);

        try {
            const token = localStorage.getItem('auth-token');
            console.log('Auth token exists?', !!token);

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/admin/users/${userId}/upload-image`,
                formData,
                {
                    headers: {
                        'auth-token': token,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            console.log('Image upload response:', response.data);
            showToast('Profile image uploaded successfully!', 'success');
        } catch (err) {
            console.error('Image upload error:', err);
            console.error('Error response:', err.response?.data);
            showToast(err.response?.data?.error || 'User created but image upload failed', 'error');
        }
    };

    const passwordStrength = getPasswordStrength(password);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('auth-token');
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
                name,
                email,
                password,
                role,
                position,
            }, {
                headers: {
                    'auth-token': token
                }
            });

            console.log('User created:', res.data);
            console.log('Has profile image?', !!profileImage);
            console.log('User ID:', res.data._id);

            // Upload profile image if selected
            if (profileImage && res.data._id) {
                console.log('Uploading profile image for user:', res.data._id);
                await uploadProfileImage(res.data._id);
            }

            showToast(`User ${name} created successfully!`, 'success');

            // Reset Form
            setName('');
            setEmail('');
            setPassword('');
            setRole('Employee');
            setPosition('');

            setProfileImage(null);
            setImagePreview(null);
        } catch (err) {
            console.error('Registration error:', err);
            showToast(err.response?.data || 'Failed to create user', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in max-w-2xl mx-auto p-4 md:p-8">
            <h1 className="mb-8 font-bold text-2xl">Add Employee</h1>
            <div className="card">
                <h3 className="mb-6 text-xl font-semibold">New User Details</h3>
                <form onSubmit={handleRegister} className="flex flex-col gap-6">
                    {/* Full Name */}
                    <div>
                        <label htmlFor="name" className="block mb-2 font-medium">
                            Full Name *
                        </label>
                        <div className="input-group">
                            <span className="input-icon"></span>
                            <input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Profile Image */}
                    <div>
                        <label className="block mb-2 font-medium">
                            Profile Image
                        </label>
                        <div className="flex gap-4 items-center">
                            {imagePreview && (
                                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary-500 flex-shrink-0">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={loading}
                                    className="hidden"
                                    id="profile-image-input"
                                    style={{ display: 'none' }}
                                />
                                <label
                                    htmlFor="profile-image-input"
                                    className="btn btn-ghost cursor-pointer inline-block"
                                >
                                    {imagePreview ? 'Change Image' : 'Upload Image'}
                                </label>
                                {imagePreview && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setProfileImage(null);
                                            setImagePreview(null);
                                        }}
                                        className="btn btn-ghost text-danger ml-2"
                                    >
                                        ✕ Remove
                                    </button>
                                )}
                                <div className="text-sm text-muted mt-2">
                                    Max size: 5MB. Formats: JPG, PNG, GIF
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block mb-2 font-medium">
                            Email Address *
                        </label>
                        <div className="input-group">
                            <span className="input-icon"></span>
                            <input
                                id="email"
                                type="email"
                                placeholder="john@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Position and Role */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 font-medium">
                                Position
                            </label>
                            <div className="input-group">
                                <span className="input-icon"></span>
                                <input
                                    type="text"
                                    placeholder="Manager, Lead..."
                                    value={position}
                                    onChange={(e) => setPosition(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block mb-2 font-medium">
                                Role *
                            </label>
                            <div className="flex gap-4 h-12 items-center">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="Employee"
                                        checked={role === 'Employee'}
                                        onChange={(e) => setRole(e.target.value)}
                                        disabled={loading}
                                        className="w-5 h-5 m-0"
                                    />
                                    Employee
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="Admin"
                                        checked={role === 'Admin'}
                                        onChange={(e) => setRole(e.target.value)}
                                        disabled={loading}
                                        className="w-5 h-5 m-0"
                                    />
                                    <span className="text-primary font-medium">Admin</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block mb-2 font-medium">
                            Default Password *
                        </label>
                        <div className="flex gap-2">
                            <div className="input-group flex-1">
                                <span className="input-icon"></span>
                                <input
                                    id="password"
                                    type="text"
                                    placeholder="Secret123"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="p-2 w-full border rounded"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={generatePassword}
                                className="btn btn-ghost whitespace-nowrap"
                                disabled={loading}
                            >
                                Generate
                            </button>
                        </div>

                        {/* Password Strength Indicator */}
                        {password && (
                            <div>
                                <div className="password-strength mt-2">
                                    <div className={`password-strength-bar password-strength-${passwordStrength}`}></div>
                                </div>
                                <p className={`mt-1 text-sm ${getStrengthColor(passwordStrength)}`}>
                                    Password strength: {passwordStrength?.toUpperCase()}
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className={`btn btn-primary w-full mt-2 ${loading ? 'loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddUser;
