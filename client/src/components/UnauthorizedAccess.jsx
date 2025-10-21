import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const UnauthorizedAccess = ({ attemptedCompany, userCompany }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Auto-redirect after 3 seconds
    const timer = setTimeout(() => {
      const redirectPath = user?.company?.slug
        ? `/${user.company.slug}/dashboard`
        : '/';
      navigate(redirectPath, { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, user]);

  const handleRedirect = () => {
    const redirectPath = user?.company?.slug
      ? `/${user.company.slug}/dashboard`
      : '/';
    navigate(redirectPath, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {/* Warning Icon */}
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            <h2 className="mt-4 text-lg font-medium text-gray-900">
              Access Denied
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              You don't have permission to access <strong>{attemptedCompany}</strong>'s resources.
            </p>

            {userCompany && (
              <p className="mt-1 text-sm text-gray-500">
                You belong to <strong>{userCompany}</strong>.
              </p>
            )}

            <div className="mt-6 space-y-3">
              <button
                onClick={handleRedirect}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {userCompany ? `Go to ${userCompany} Dashboard` : 'Go to Home'}
              </button>

              <p className="text-xs text-gray-500">
                Redirecting automatically in 3 seconds...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedAccess;