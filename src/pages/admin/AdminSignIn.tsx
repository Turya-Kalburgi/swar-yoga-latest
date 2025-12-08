import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, AlertCircle, Loader } from 'lucide-react';
import { toast } from 'react-toastify';

interface AdminSignInForm {
  email: string;
  password: string;
}

interface AdminUser {
  id: string;
  adminId: number;
  email: string;
  name: string;
  role: string;
  timestamp: string;
}

const AdminSignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AdminSignInForm>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<AdminSignInForm>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name as keyof AdminSignInForm]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<AdminSignInForm> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors and try again');
      return;
    }

    setLoading(true);

    try {
      const API_URL = (import.meta as any).env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : 'https://api.swaryoga.online/api');

      const response = await fetch(`${API_URL}/admin/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Sign in failed');
        setLoading(false);
        return;
      }

      // Save admin user data to localStorage
      const adminUser: AdminUser = data.admin;
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
      localStorage.setItem('adminSession', JSON.stringify({
        email: formData.email,
        loginTime: new Date().toISOString()
      }));

      console.log(`✅ Admin signin successful:`, {
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
        timestamp: new Date().toLocaleString()
      });

      toast.success(`Welcome back, ${adminUser.name}!`);

      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('❌ Sign in error:', error);
      toast.error('An error occurred during sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-8">
            <div className="flex items-center justify-center mb-2">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white text-center">Admin Sign In</h1>
            <p className="text-purple-100 text-center mt-2">Access the Admin Dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                placeholder="admin@example.com"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              {errors.email && (
                <div className="flex items-center mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                placeholder="Enter your password"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                  errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              {errors.password && (
                <div className="flex items-center mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password}
                </div>
              )}
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In
                </>
              )}
            </button>

            {/* Links */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 text-sm">
              <Link to="/admin/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                Create Account
              </Link>
              <Link to="/" className="text-gray-600 hover:text-gray-700">
                Back to Home
              </Link>
            </div>
          </form>

          {/* Info Banner */}
          <div className="bg-blue-50 px-6 py-4 border-t border-blue-100">
            <p className="text-sm text-gray-600">
              <strong>Demo Credentials:</strong> Use your registered admin email and password
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;
