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
      console.log('Already authenticated, redirecting to:', redirectPath);
      // Use replace instead of push to prevent back button issues
      router.replace(redirectPath);
    }
  }, [isAuthenticated, loading, user, router]);

  // Show loading only on initial mount, not when navigating back
  if (loading) {
    return null; // Don't show loading spinner, just render nothing briefly
  }

  // Do not render if authenticated (redirecting)
  if (isAuthenticated) {
    return null; // Don't show anything while redirecting
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-gradient">
      <div className="max-w-md w-full space-y-8 animate-fadeIn">
        <div className="text-center">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            EduAI Platform
          </h1>
          <p className="text-gray-600 text-lg">
            Build your career with AI-powered tools
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
