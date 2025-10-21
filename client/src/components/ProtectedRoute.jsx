import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import UnauthorizedAccess from './UnauthorizedAccess';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const { companySlug } = useParams();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user belongs to the company in the URL (only if there's a company slug)
  if (companySlug && user?.company?.slug !== companySlug) {
    // User is trying to access a different company's resources
    console.warn(`Access denied: User belongs to company "${user?.company?.slug}" but trying to access "${companySlug}"`);
    
    // Show unauthorized access page with auto-redirect
    return (
      <UnauthorizedAccess 
        attemptedCompany={companySlug}
        userCompany={user?.company?.name}
      />
    );
  }

  return children;
};

export default ProtectedRoute;
