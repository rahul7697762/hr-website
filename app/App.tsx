import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Mentor from './components/Mentor';
import Stats from './components/Stats';
import CTA from './components/CTA';
import Footer from './components/Footer';

import ATSTools from './pages/ATSTools';
import AuthPage from './pages/AuthPage';
import Dashboard from './components/Dashboard';
import CodePlayground from './pages/CodePlayground';
import ResumeBuilder from './pages/ResumeBuilder';
import TemplateSelection from './pages/TemplateSelection';
import QuizPage from './pages/QuixPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

import { ResumeProvider } from './contexts';
import { AuthProvider, useAuth } from './contexts/AuthContext';

type Page = 'home' | 'resumeBuilder' | 'professionalResume' | 'atsTools' | 'auth' | 'dashboard' | 'codePlayground' | 'quiz';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedTemplate, setSelectedTemplate] = useState<number>(0);
  const [showTemplateSelection, setShowTemplateSelection] = useState<boolean>(false);
  const { isAuthenticated, loading } = useAuth();

  const navigateTo = (page: Page) => {
    if (page === 'resumeBuilder' || page === 'professionalResume') {
      setShowTemplateSelection(true);
      setCurrentPage(page);
    } else {
      setShowTemplateSelection(false);
      setCurrentPage(page);
    }
  };

  const handleTemplateSelect = (templateId: number) => {
    setSelectedTemplate(templateId);
    setShowTemplateSelection(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated && currentPage !== 'auth' && currentPage !== 'home') {
    return <AuthPage />;
  }

  return (
    <ResumeProvider>
      <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-gray-100 font-sans">
        <Header navigateTo={navigateTo} />
        <main>
          {currentPage === 'home' && (
            <>
              <Hero />
              <Features />
              <Mentor />
              <Stats />
              <CTA />
            </>
          )}
          {currentPage === 'dashboard' && (
            <ProtectedRoute>
              <Dashboard navigateTo={navigateTo} />
            </ProtectedRoute>
          )}
          {(currentPage === 'resumeBuilder' || currentPage === 'professionalResume') && (
            <ProtectedRoute>
              {showTemplateSelection ? (
                <TemplateSelection onTemplateSelect={handleTemplateSelect} />
              ) : (
                <ResumeBuilder 
                  selectedTemplate={selectedTemplate} 
                  onBackToTemplates={() => setShowTemplateSelection(true)}
                />
              )}
            </ProtectedRoute>
          )}
          {currentPage === 'atsTools' && (
            <ProtectedRoute>
              <ATSTools />
            </ProtectedRoute>
          )}
          {currentPage === 'codePlayground' && (
            <ProtectedRoute>
              <CodePlayground />
            </ProtectedRoute>
          )}
          {currentPage === 'quiz' && (
            <ProtectedRoute>
              <QuizPage />
            </ProtectedRoute>
          )}
          {currentPage === 'auth' && <AuthPage />}
        </main>
        <Footer />
      </div>
    </ResumeProvider>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;