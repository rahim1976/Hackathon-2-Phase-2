import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectPath = '/login'
}) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Preserve the original destination in the URL
      const currentPath = pathname || '/';
      const encodedRedirect = encodeURIComponent(currentPath);
      router.push(`${redirectPath}?redirect=${encodedRedirect}`);
    }
  }, [isAuthenticated, loading, redirectPath, router, pathname]);

  // Show a loading state while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If authenticated, render the protected content
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If not authenticated, return nothing (redirect effect will happen in useEffect)
  return null;
};

export default ProtectedRoute;