import React from 'react';
import LoginForm from '../../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  const handleLoginSuccess = (userData: any) => {
    console.log('Login successful:', userData);
    // Redirect to dashboard or home page after successful login
    window.location.href = '/dashboard'; // or wherever you want to redirect after login
  };

  const handleLoginError = (error: string) => {
    console.error('Login error:', error);
    // Handle login error (show notification, etc.)
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h2>Login</h2>
            </div>
            <div className="card-body">
              <LoginForm
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;