'use client';
import React, { useState } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import VoiceScreeningInterface from '../../components/voice/VoiceScreeningInterface';
import ScreeningResults from '../../components/voice/ScreeningResults';
import ScreeningSetup from '../../components/voice/ScreeningSetup';
import { VapiProvider } from '../../components/voice/VapiClient';

export interface ScreeningConfig {
  jobTitle: string;
  jobLevel: 'entry' | 'mid' | 'senior' | 'executive';
  industry: string;
  duration: number; // in minutes
  focusAreas: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ScreeningResult {
  id: string;
  timestamp: Date;
  config: ScreeningConfig;
  duration: number;
  transcript: string;
  scores: {
    communication: number;
    technical: number;
    cultural: number;
    overall: number;
  };
  feedback: {
    strengths: string[];
    improvements: string[];
    recommendations: string[];
  };
  questions: Array<{
    question: string;
    answer: string;
    score: number;
    feedback: string;
  }>;
}

type ScreeningPhase = 'setup' | 'interview' | 'results';

export default function VoiceScreeningPage() {
  const [currentPhase, setCurrentPhase] = useState<ScreeningPhase>('setup');
  const [screeningConfig, setScreeningConfig] = useState<ScreeningConfig | null>(null);
  const [screeningResult, setScreeningResult] = useState<ScreeningResult | null>(null);

  const handleStartScreening = (config: ScreeningConfig) => {
    setScreeningConfig(config);
    setCurrentPhase('interview');
  };

  const handleScreeningComplete = (result: ScreeningResult) => {
    setScreeningResult(result);
    setCurrentPhase('results');
  };

  const handleRestart = () => {
    setCurrentPhase('setup');
    setScreeningConfig(null);
    setScreeningResult(null);
  };

  const renderCurrentPhase = () => {
    switch (currentPhase) {
      case 'setup':
        return (
          <ScreeningSetup 
            onStartScreening={handleStartScreening}
            isLoading={false}
          />
        );
      case 'interview':
        return screeningConfig ? (
          <VoiceScreeningInterface
            config={screeningConfig}
            onComplete={handleScreeningComplete}
            onBack={() => setCurrentPhase('setup')}
          />
        ) : null;
      case 'results':
        return screeningResult ? (
          <ScreeningResults
            result={screeningResult}
            onRestart={handleRestart}
            onBack={() => setCurrentPhase('setup')}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <ProtectedRoute>
      <VapiProvider apiKey={process.env.NEXT_PUBLIC_VAPI_API_KEY || 'your-vapi-api-key'}>
        <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-gray-100 font-sans min-h-screen">
          <Header />
          <main className="py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Header Section */}
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  🎤 Voice Interview Screening
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Practice real-time voice interviews with AI-powered feedback and analysis
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="flex justify-center mb-8">
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center ${currentPhase === 'setup' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentPhase === 'setup' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                      1
                    </div>
                    <span className="ml-2 font-medium">Setup</span>
                  </div>
                  <div className="w-8 h-0.5 bg-gray-300"></div>
                  <div className={`flex items-center ${currentPhase === 'interview' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentPhase === 'interview' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                      2
                    </div>
                    <span className="ml-2 font-medium">Interview</span>
                  </div>
                  <div className="w-8 h-0.5 bg-gray-300"></div>
                  <div className={`flex items-center ${currentPhase === 'results' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentPhase === 'results' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                      3
                    </div>
                    <span className="ml-2 font-medium">Results</span>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                {renderCurrentPhase()}
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </VapiProvider>
    </ProtectedRoute>
  );
}