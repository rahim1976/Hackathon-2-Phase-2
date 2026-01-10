import React from 'react';
import RegisterForm from '../../components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  const handleRegisterSuccess = (userData: any) => {
    console.log('Registration successful:', userData);
    // Redirect to dashboard or login page after successful registration
    window.location.href = '/dashboard'; // or wherever you want to redirect after registration
  };

  const handleRegisterError = (error: string) => {
    console.error('Registration error:', error);
    // Handle registration error (show notification, etc.)
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h2>Register</h2>
            </div>
            <div className="card-body">
              <RegisterForm
                onSuccess={handleRegisterSuccess}
                onError={handleRegisterError}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;