'use client';
import React from 'react';
import RoleProtectedRoute from '../components/auth/RoleProtectedRoute';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import RoleBadge from '../components/ui/RoleBadge';

const AdminPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <RoleProtectedRoute allowedRoles={['admin']}>
      <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-gray-100 font-sans">
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Admin Header */}
            <div className="bg-white dark:bg-slate-700 rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Welcome, {user?.name}! Manage your platform from here.
                  </p>
                </div>
                <div className="text-right">
                  {user && <RoleBadge role={user.role} size="lg" />}
                </div>
              </div>
            </div>

            {/* Admin Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-slate-700 rounded-lg shadow-sm p-6">
                <div className="text-3xl mb-3">👥</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  User Management
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Manage user accounts, roles, and permissions
                </p>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                  Manage Users
                </button>
              </div>

              <div className="bg-white dark:bg-slate-700 rounded-lg shadow-sm p-6">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Analytics
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  View platform usage statistics and reports
                </p>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                  View Analytics
                </button>
              </div>

              <div className="bg-white dark:bg-slate-700 rounded-lg shadow-sm p-6">
                <div className="text-3xl mb-3">🛡️</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Content Moderation
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Review and moderate user-generated content
                </p>
                <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors">
                  Moderate Content
                </button>
              </div>

              <div className="bg-white dark:bg-slate-700 rounded-lg shadow-sm p-6">
                <div className="text-3xl mb-3">⚙️</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Platform Settings
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Configure platform-wide settings and features
                </p>
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors">
                  Settings
                </button>
              </div>

              <div className="bg-white dark:bg-slate-700 rounded-lg shadow-sm p-6">
                <div className="text-3xl mb-3">🔧</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  System Health
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Monitor system performance and health
                </p>
                <button className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
                  System Status
                </button>
              </div>

              <div className="bg-white dark:bg-slate-700 rounded-lg shadow-sm p-6">
                <div className="text-3xl mb-3">📝</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Logs & Audit
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  View system logs and audit trails
                </p>
                <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
                  View Logs
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-slate-700 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Platform Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">0</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Total Users</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">0</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Active Sessions</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">0</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Resumes Created</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">0</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">System Alerts</div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </RoleProtectedRoute>
  );
};

export default AdminPage;