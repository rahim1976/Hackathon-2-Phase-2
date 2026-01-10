import React, { createContext, useContext, useEffect, useState } from 'react';

// Define the shape of our auth context
interface AuthContextType {
  user: any | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (userData: any) => void;
  logout: () => void;
  checkAuthStatus: () => void;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to wrap around the app
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check if user is authenticated by looking for a token
  const checkAuthStatus = () => {
    setLoading(true);
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

    if (token) {
      // In a real app, you might want to validate the token or fetch user details
      // For now, we'll just check if it exists
      try {
        // Simple validation - check if token has 3 parts (header.payload.signature)
        const parts = token.split('.');
        if (parts.length === 3) {
          setIsAuthenticated(true);
          // You could decode the payload to get user info if needed
          // setUser(decodedUser);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Error validating token:', error);
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  };

  // Login function
  const login = (userData: any) => {
    setUser(userData.user);
    setIsAuthenticated(true);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuthStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Main App component
const MyApp: React.FC<{ Component: any; pageProps: any }> = ({ Component, pageProps }) => {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
};

export default MyApp;