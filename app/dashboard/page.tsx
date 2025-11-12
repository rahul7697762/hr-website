'use client';
import React from 'react';
import UserDashboard from '../components/auth/UserDashboard';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DashboardPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-gray-100 font-sans">
        <Header />
        <main>
          <UserDashboard />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
