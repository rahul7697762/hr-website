'use client';
import React, { useState } from 'react';
import { ScreeningResult } from '../../interview-prep/voice-screening/page';

interface ScreeningResultsProps {
  result: ScreeningResult;
  onRestart: () => void;
  onBack: () => void;
}

const ScoreCard = ({ title, score, description }: { title: string; score: number; description: string }) => {
  const getScoreColor = (score: number): string => {
    if (score >= 85) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 85) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 70) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  return (
    <div className={`${getScoreBgColor(score)} rounded-lg p-4 border border-gray-200 dark:border-gray-700`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
        <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
        <div 
          className={`h-2 rounded-full ${score >= 85 ? 'bg-green-500' : score >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
};

export default function ScreeningResults({ result, onRestart, onBack }: ScreeningResultsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'transcript'>('overview');

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 85) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 85) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 70) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };



  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✅</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Interview Complete!
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Here&apos;s your detailed performance analysis and feedback
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{result.scores.overall}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Overall Score</div>
          </div>
          <div className="bg-white dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{formatDuration(result.duration)}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
          </div>
          <div className="bg-white dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{result.questions.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Questions</div>
          </div>
          <div className="bg-white dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{result.config.jobLevel}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Level</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'questions', label: 'Question Analysis', icon: '❓' },
              { id: 'transcript', label: 'Transcript', icon: '📝' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Score Breakdown */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Performance Scores
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ScoreCard
                  title="Communication"
                  score={result.scores.communication}
                  description="Clarity, articulation, and verbal presentation"
                />
                <ScoreCard
                  title="Technical Knowledge"
                  score={result.scores.technical}
                  description="Domain expertise and technical competency"
                />
                <ScoreCard
                  title="Cultural Fit"
                  score={result.scores.cultural}
                  description="Alignment with company values and culture"
                />
                <ScoreCard
                  title="Overall Performance"
                  score={result.scores.overall}
                  description="Combined assessment across all areas"
                />
              </div>
            </div>

            {/* Feedback Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Strengths */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center">
                  <span className="mr-2">💪</span>
                  Strengths
                </h4>
                <ul className="space-y-2">
                  {result.feedback.strengths.map((strength, index) => (
                    <li key={index} className="text-green-700 dark:text-green-400 text-sm flex items-start">
                      <span className="mr-2 text-green-500">•</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas for Improvement */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-3 flex items-center">
                  <span className="mr-2">🎯</span>
                  Areas for Improvement
                </h4>
                <ul className="space-y-2">
                  {result.feedback.improvements.map((improvement, index) => (
                    <li key={index} className="text-yellow-700 dark:text-yellow-400 text-sm flex items-start">
                      <span className="mr-2 text-yellow-500">•</span>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center">
                  <span className="mr-2">💡</span>
                  Recommendations
                </h4>
                <ul className="space-y-2">
                  {result.feedback.recommendations.map((recommendation, index) => (
                    <li key={index} className="text-blue-700 dark:text-blue-400 text-sm flex items-start">
                      <span className="mr-2 text-blue-500">•</span>
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Question-by-Question Analysis
            </h3>
            {result.questions.map((q, index) => (
              <div key={index} className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white flex-1 mr-4">
                    Q{index + 1}: {q.question}
                  </h4>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(q.score)} ${getScoreColor(q.score)}`}>
                    {q.score}/100
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4 mb-4">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Answer:</h5>
                  <p className="text-gray-900 dark:text-white text-sm">{q.answer}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Feedback:</h5>
                  <p className="text-blue-700 dark:text-blue-400 text-sm">{q.feedback}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'transcript' && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Full Interview Transcript
            </h3>
            <div className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
              <pre className="whitespace-pre-wrap text-sm text-gray-900 dark:text-white font-mono">
                {result.transcript}
              </pre>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            ← Back to Setup
          </button>
          <button
            onClick={onRestart}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            Take Another Interview 🎤
          </button>
        </div>

        {/* Export Options */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Want to save your results?
          </p>
          <div className="flex justify-center space-x-4">
            <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
              📄 Export as PDF
            </button>
            <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
              📧 Email Results
            </button>
            <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
              💾 Save to Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}