import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../contexts/AuthContext';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    window.location.href = '/';
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI-Powered Education Platform
          </h1>
          <p className="text-gray-600">
            Build your career with AI-powered tools and guidance
          </p>
        </div>

        {isLogin ? (
          <LoginForm
            onSuccess={() => window.location.href = '/'}
            onSwitchToRegister={() => setIsLogin(false)}
          />
        ) : (
          <RegisterForm
            onSuccess={() => window.location.href = '/'}
            onSwitchToLogin={() => setIsLogin(true)}
          />
        )}

        <div className="text-center text-sm text-gray-500">
          <p>Demo accounts:</p>
          <p>Student: john@example.com / password</p>
          <p>Recruiter: jane@example.com / password</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;