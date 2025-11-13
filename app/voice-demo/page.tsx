'use client';
import React from 'react';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { VapiProvider } from '../components/voice/VapiClient';
import VoiceDemo from '../components/voice/VoiceDemo';

export default function VoiceDemoPage() {
  return (
    <ProtectedRoute>
      <VapiProvider apiKey={process.env.NEXT_PUBLIC_VAPI_API_KEY || 'demo-key'}>
        <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-gray-100 font-sans min-h-screen">
          <Header />
          <main className="py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  Voice AI Demo
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Test the voice functionality before using the full interview screening
                </p>
              </div>

              <div className="flex justify-center">
                <VoiceDemo />
              </div>

              <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
                  🔧 Setup Instructions
                </h2>
                <div className="space-y-3 text-blue-800 dark:text-blue-200">
                  <p>
                    <strong>1. Get Vapi API Key:</strong> Sign up at{' '}
                    <a href="https://vapi.ai" target="_blank" rel="noopener noreferrer" className="underline">
                      vapi.ai
                    </a>{' '}
                    and get your public API key
                  </p>
                  <p>
                    <strong>2. Environment Variable:</strong> Add{' '}
                    <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">
                      NEXT_PUBLIC_VAPI_API_KEY=your_key_here
                    </code>{' '}
                    to your .env.local file
                  </p>
                  <p>
                    <strong>3. Test:</strong> Click the demo button above to test voice functionality
                  </p>
                  <p>
                    <strong>4. Full Experience:</strong> Visit the{' '}
                    <a href="/interview-prep/voice-screening" className="underline">
                      Voice Interview Screening
                    </a>{' '}
                    page for the complete interview experience
                  </p>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </VapiProvider>
    </ProtectedRoute>
  );
}