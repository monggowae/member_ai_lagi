import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { AuthGuard } from './components/AuthGuard';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { Generator } from './pages/Generator';
import { Dashboard } from './pages/Dashboard';
import { TokenRequests } from './pages/TokenRequests';
import { AdminPanel } from './pages/AdminPanel';
import { TransferTokens } from './pages/TransferTokens';
import { ProfileEdit } from './pages/ProfileEdit';

function App() {
  // Get last visited path from localStorage or default to '/'
  const getLastPath = () => {
    const lastPath = localStorage.getItem('lastPath') || '/';
    return lastPath;
  };

  // Save current path to localStorage whenever it changes
  React.useEffect(() => {
    const handleRouteChange = () => {
      localStorage.setItem('lastPath', window.location.pathname);
    };

    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange);
    // Save initial path
    handleRouteChange();

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            }
          />
          <Route
            path="/token-requests"
            element={
              <AuthGuard>
                <TokenRequests />
              </AuthGuard>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthGuard>
                <ProfileEdit />
              </AuthGuard>
            }
          />
          <Route
            path="/admin"
            element={
              <AuthGuard>
                <AdminPanel />
              </AuthGuard>
            }
          />
          <Route
            path="/transfer"
            element={
              <AuthGuard>
                <TransferTokens />
              </AuthGuard>
            }
          />
          <Route
            path="/product"
            element={
              <AuthGuard>
                <Generator />
              </AuthGuard>
            }
          />
          <Route
            path="/fashion"
            element={
              <AuthGuard>
                <div className="text-center text-gray-600">Fashion Photography - Coming Soon</div>
              </AuthGuard>
            }
          />
          <Route
            path="/animals"
            element={
              <AuthGuard>
                <div className="text-center text-gray-600">Animal Photography - Coming Soon</div>
              </AuthGuard>
            }
          />
          <Route
            path="/food"
            element={
              <AuthGuard>
                <div className="text-center text-gray-600">Food Photography - Coming Soon</div>
              </AuthGuard>
            }
          />
          <Route
            path="/modify"
            element={
              <AuthGuard>
                <div className="text-center text-gray-600">Photo Modification - Coming Soon</div>
              </AuthGuard>
            }
          />
          {/* Catch all unknown routes and redirect to last visited page or home */}
          <Route
            path="*"
            element={<Navigate to={getLastPath()} replace />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;