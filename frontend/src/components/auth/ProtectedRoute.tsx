import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectPath?: string;
  requireAuth?: boolean; // If true, requires auth; if false, requires no auth
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectPath = '/auth/login',
  requireAuth = true
}) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    const checkAuth = async () => {
      // Check if user is authenticated by looking for a valid token
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

      if (requireAuth) {
        // If route requires authentication
        if (!token) {
          // No token found, redirect to login
          setIsAuthorized(false);
          router.push(redirectPath);
          return;
        }

        // In a real app, you might want to validate the token here
        // For now, we'll just check if it exists and isn't obviously invalid
        try {
          const parts = token.split('.');
          if (parts.length !== 3) {
            // Invalid token format
            setIsAuthorized(false);
            router.push(redirectPath);
            return;
          }

          // Token exists and has valid format
          setIsAuthorized(true);
        } catch (error) {
          setIsAuthorized(false);
          router.push(redirectPath);
        }
      } else {
        // If route requires no authentication (e.g., login page)
        if (token) {
          // User is logged in, redirect away from login page
          setIsAuthorized(false);
          router.push('/'); // or wherever you want to redirect logged-in users
          return;
        }

        // No token exists, which is what we want for login pages
        setIsAuthorized(true);
      }
    };

    checkAuth();
  }, [router, redirectPath, requireAuth]);

  if (isAuthorized === null) {
    // Loading state - you might want to show a spinner here
    return <div>Loading...</div>;
  }

  if (isAuthorized) {
    return <>{children}</>;
  }

  // Don't render anything if not authorized (redirect is happening)
  return null;
};

export default ProtectedRoute;