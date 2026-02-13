import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AttendanceForm from './pages/AttendanceForm';
import Login from './pages/Login';
import AddUser from './pages/AddUser';
import Settings from './pages/Settings';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';
import './mobile.css';

import Header from './components/Header';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <div className="app-container">
      <Header />
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/attendance" element={user ? <AttendanceForm /> : <Navigate to="/login" />} />
        <Route path="/settings" element={user?.role === 'Admin' ? <Settings /> : <Navigate to="/" />} />
        <Route path="/add-user" element={user?.role === 'Admin' ? <AddUser /> : <Navigate to="/" />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <AppRoutes />
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

