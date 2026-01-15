import React, { useState } from 'react';
import { authService } from '../../services/auth-service';
import { validateLoginForm } from '../../utils/validators';
import { User } from '../../types/auth';

interface LoginFormProps {
  onSuccess?: (user: User) => void;
  onError?: (error: string) => void;
  redirectToDashboard?: () => void; // Function to handle redirect after successful login
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError, redirectToDashboard }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validation = validateLoginForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      const result = await authService.login({
        email: formData.email,
        password: formData.password
      });

      if (onSuccess) {
        onSuccess(result.user);
      } else if (redirectToDashboard) {
        // Default behavior: redirect to dashboard if provided
        redirectToDashboard();
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed. Please check your credentials and try again.';
      setErrors({ form: errorMessage });
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-slate-900 p-8 rounded-xl shadow-md border border-slate-800">
      <h2 className="text-2xl font-bold mb-6 text-center text-slate-100">Sign in to your account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-slate-800 text-slate-200 border rounded-md placeholder-slate-400 ${
              errors.email ? 'border-red-500' : 'border-slate-600'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="email@example.com"
            required
          />
          {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-slate-800 text-slate-200 border rounded-md placeholder-slate-400 ${
              errors.password ? 'border-red-500' : 'border-slate-600'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="••••••••"
            required
          />
          {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
        </div>

        {errors.form && (
          <div className="rounded-md bg-red-900/30 p-4 border border-red-800">
            <p className="text-sm text-red-400">{errors.form}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            loading
              ? 'bg-slate-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900'
          }`}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-slate-400">
          Don't have an account?{' '}
          <a href="/register" className="font-medium text-blue-400 hover:text-blue-300">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;