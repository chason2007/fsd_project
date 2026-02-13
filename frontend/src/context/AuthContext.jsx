import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token');

            if (token) {
                try {
                    console.log("Checking user against:", import.meta.env.VITE_API_URL);
                    const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/user`, {
                        headers: { 'auth-token': token },
                        timeout: 10000 // 10 second timeout
                    });
                    console.log("User found:", userRes.data);
                    setUser(userRes.data);

                    // Update whichever storage has the token
                    if (localStorage.getItem('auth-token')) {
                        localStorage.setItem('user', JSON.stringify(userRes.data));
                    } else {
                        sessionStorage.setItem('user', JSON.stringify(userRes.data));
                    }
                } catch (error) {
                    console.error("Failed to fetch user data", error);
                    if (error.code === 'ECONNABORTED') {
                        console.error("Request timed out");
                    }
                    // Invalid token, clear all
                    localStorage.removeItem('auth-token');
                    localStorage.removeItem('user');
                    sessionStorage.removeItem('auth-token');
                    sessionStorage.removeItem('user');
                    setUser(null);
                }
            } else {
                console.log("No token found");
                setUser(null);
            }
            setLoading(false);
        };

        checkLoggedIn();
    }, []);

    const login = (token, userData, rememberMe = true) => {
        // Clear potential old session in other storage
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('auth-token');
        sessionStorage.removeItem('user');

        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('auth-token', token);
        storage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('auth-token');
        sessionStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {loading ? (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    backgroundColor: 'var(--pk-bg)',
                    color: 'var(--pk-primary)',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                    <div className="btn loading" style={{ width: '40px', height: '40px', background: 'transparent' }}></div>
                    <p style={{ fontWeight: 500 }}>Loading WorkSync...</p>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
