import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../components/AdminDashboard';
import EmployeeDashboard from '../components/EmployeeDashboard';

function Dashboard() {
    const { user } = useAuth();

    if (!user) {
        return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20vh' }}>Loading user data...</div>;
    }

    return user.role === 'Admin' ? <AdminDashboard /> : <EmployeeDashboard user={user} />;
}

export default Dashboard;
