import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppStateProvider } from './contexts/AppStateContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Endpoints from './pages/Endpoints';
import Threats from './pages/Threats';
import Mitre from './pages/Mitre';
import Automation from './pages/Automation';
import FIM from './pages/FIM';
import UserActivity from './pages/UserActivity';
import WatchFloor from './pages/WatchFloor';

function ProtectedRoutes() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="endpoints" element={<Endpoints />} />
        <Route path="threats" element={<Threats />} />
        <Route path="mitre" element={<Mitre />} />
        <Route path="automation" element={<Automation />} />
        <Route path="fim" element={<FIM />} />
        <Route path="user-activity" element={<UserActivity />} />
        <Route path="watch-floor" element={<WatchFloor />} />
      </Route>
    </Routes>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <AppStateProvider>
              <AppRoutes />
            </AppStateProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
