import React, { useState } from 'react';
import ATSAnalyzer from '../components/ats/ATSAnalyzer';
import CoverLetterGenerator from '../components/ats/CoverLetterGenerator';
import ATSDashboard from '../components/ats/ATSDashboard';

type ATSToolType = 'analyzer' | 'coverLetter' | 'dashboard' | 'stats';

const ATSTools: React.FC = () => {
  const [currentTool, setCurrentTool] = useState<ATSToolType>('dashboard');

  const renderDashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            ATS Tools Suite
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Optimize your resume and job applications with AI-powered ATS tools
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Dashboard */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                ATS Dashboard
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                View your analysis history, statistics, and improvement insights
              </p>
              <button
                onClick={() => setCurrentTool('stats')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                View Dashboard
              </button>
            </div>
          </div>
          {/* Resume Analyzer Tool */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📄</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Resume Analyzer
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Analyze your resume against job descriptions and get ATS compatibility scores
              </p>
              <button
                onClick={() => setCurrentTool('analyzer')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Launch Analyzer
              </button>
            </div>
          </div>

          {/* Cover Letter Generator */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✉️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Cover Letter Generator
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Generate personalized cover letters based on your resume and job requirements
              </p>
              <button
                onClick={() => setCurrentTool('coverLetter')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Generate Letter
              </button>
            </div>
          </div>

          {/* Resume Optimization */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Resume Optimization
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Get detailed suggestions to improve your resume's ATS compatibility
              </p>
              <button
                onClick={() => setCurrentTool('analyzer')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Optimize Resume
              </button>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {currentTool === 'dashboard' && renderDashboard()}
      {currentTool === 'analyzer' && (
        <div>
          <div className="p-4 bg-gray-100 dark:bg-slate-800">
            <button
              onClick={() => setCurrentTool('dashboard')}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← Back to ATS Tools
            </button>
          </div>
          <ATSAnalyzer />
        </div>
      )}
      {currentTool === 'coverLetter' && (
        <div>
          <div className="p-4 bg-gray-100 dark:bg-slate-800">
            <button
              onClick={() => setCurrentTool('dashboard')}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← Back to ATS Tools
            </button>
          </div>
          <CoverLetterGenerator />
        </div>
      )}
      {currentTool === 'stats' && (
        <div>
          <div className="p-4 bg-gray-100 dark:bg-slate-800">
            <button
              onClick={() => setCurrentTool('dashboard')}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← Back to ATS Tools
            </button>
          </div>
          <ATSDashboard />
        </div>
      )}
    </>
  );
};

export default ATSTools;