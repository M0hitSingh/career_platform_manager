import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ManageJobs from './pages/ManageJobs';
import EditCareerPage from './pages/EditCareerPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Public career pages - accessible to everyone */}
          {/* Note: These are handled by the server-side rendering we implemented */}
          {/* The /:companySlug/careers route is served by the backend */}

          {/* Protected routes with dynamic company slug */}
          <Route
            path="/:companySlug/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/:companySlug/manage-jobs"
            element={
              <ProtectedRoute>
                <ManageJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/:companySlug/edit"
            element={
              <ProtectedRoute>
                <EditCareerPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
