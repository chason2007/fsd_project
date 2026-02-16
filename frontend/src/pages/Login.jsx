import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function Login() {
    const [email, setEmail] = useState('admin@worksync.com');
    const [password, setPassword] = useState('admin');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);


        try {
            // Mock Login Bypass
            if (email === 'admin@worksync.com' && password === 'admin') {
                // Simulate network request
                await new Promise(resolve => setTimeout(resolve, 800));

                const mockUser = {
                    _id: 'mock-user-id-001',
                    name: 'Admin User',
                    email: 'admin@worksync.com',
                    role: 'Admin',
                    department: 'Management'
                };

                login('mock-jwt-token-12345', mockUser, rememberMe);
                showToast('Login successful! Welcome back.', 'success');
                navigate('/');
                return;
            }

            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                email,
                password,
                rememberMe
            });

            // Update context state
            login(res.data.token, res.data.user, rememberMe);
            showToast('Login successful! Welcome back.', 'success');

            // Redirect to dashboard
            navigate('/');
        } catch (err) {
            console.error(err);
            showToast(err.response?.data || 'Login failed. Please check your credentials.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-app p-8">
            <div className="w-full max-w-md">
                {/* Simple Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">WorkSync</h1>
                    <p className="text-muted">Sign in to your account</p>
                </div>

                {/* Login Form Card */}
                <div className="card">
                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            className="btn btn-primary w-full mt-4"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center mt-6 text-sm text-muted">
                    Need access? Contact your administrator
                </p>
            </div>
        </div>
    );
}

export default Login;
