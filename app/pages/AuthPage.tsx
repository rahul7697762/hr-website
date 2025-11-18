"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { getRedirectPath } from "@/utils/redirectHelpers";

export default function AuthPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  // Redirect if already logged in based on role
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      const redirectPath = getRedirectPath(user.role);
      router.push(redirectPath);
    }
  }, [isAuthenticated, loading, user, router]);

  // While checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Do not render if authenticated (redirecting)
  if (isAuthenticated) return null;

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

        <LoginForm onSuccess={(userRole) => {
          const redirectPath = getRedirectPath(userRole);
          router.push(redirectPath);
        }} />
      </div>
    </div>
  );
}
