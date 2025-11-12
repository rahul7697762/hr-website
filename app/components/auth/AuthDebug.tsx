'use client';
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AuthDebug: React.FC = () => {
  const { user, token, loading, isAuthenticated } = useAuth();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-3 rounded-lg text-xs max-w-xs z-50">
      <div className="font-bold mb-2">Auth Debug</div>
      <div>Loading: {loading ? 'Yes' : 'No'}</div>
      <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
      <div>User: {user ? user.name : 'None'}</div>
      <div>Email: {user ? user.email : 'None'}</div>
      <div>Role: {user ? user.role : 'None'}</div>
      <div>Token: {token ? 'Present' : 'None'}</div>
      <div>User ID: {user ? user.user_id : 'None'}</div>
    </div>
  );
};

export default AuthDebug;