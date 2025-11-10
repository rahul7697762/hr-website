import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { get } from '../../utils/api';

interface ATSStats {
  total_analyses: number;
  average_score: number;
  highest_score: number;
  lowest_score: number;
  recent_analyses: Array<{
    ats_id: number;
    overall_score: number;
    created_at: string;
  }>;
}

interface KeywordAnalysis {
  top_matching_keywords: Array<{
    keyword: string;
    count: number;
  }>;
  top_missing_keywords: Array<{
    keyword: string;
    count: number;
  }>;
  total_analyses: number;
}

const ATSDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ATSStats | null>(null);
  const [keywordAnalysis, setKeywordAnalysis] = useState<KeywordAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/ats-analyzer/results`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Dashboard data received:', data); // Debug log
        if (data.success) {
          setStats(data.stats);
          setKeywordAnalysis(data.keywordAnalysis);
        } else {
          console.log('No ATS data available yet');
        }
      } else {
        console.error('Failed to load dashboard data:', response.status);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats || stats.total_analyses === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No ATS Analysis Yet</h3>
            <p className="text-gray-500 mb-4">
              Start by analyzing your resume to see detailed statistics and insights here.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-left max-w-md mx-auto">
              <h4 className="font-medium text-blue-800 mb-2">How to get started:</h4>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. Go back to ATS Tools</li>
                <li>2. Click "Launch Analyzer"</li>
                <li>3. Upload a resume or paste text</li>
                <li>4. Add a job description</li>
                <li>5. Click "Analyze Resume"</li>
                <li>6. Return here to see your results</li>
              </ol>
            </div>
            {/* Debug info */}
            <div className="mt-4 text-xs text-gray-400">
              Debug: Stats loaded = {stats ? 'Yes' : 'No'}, 
              Total analyses = {stats?.total_analyses || 0}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ATS Analysis Dashboard</h1>
          <p className="text-gray-600 mb-4">
            Track your resume optimization progress and insights
          </p>
          <button
            onClick={() => window.location.href = '#analyzer'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            📄 Analyze New Resume
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.total_analyses}</div>
            <div className="text-sm text-gray-600">Total Analyses</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className={`text-3xl font-bold mb-2 ${getScoreColor(stats.average_score)}`}>
              {stats.average_score}%
            </div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.highest_score}%</div>
            <div className="text-sm text-gray-600">Highest Score</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">{stats.lowest_score}%</div>
            <div className="text-sm text-gray-600">Lowest Score</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Analyses */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Analyses</h3>
            {stats.recent_analyses.length > 0 ? (
              <div className="space-y-3">
                {stats.recent_analyses.map((analysis) => (
                  <div key={analysis.ats_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <div className="text-sm text-gray-600">
                        {new Date(analysis.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(analysis.overall_score)} ${getScoreColor(analysis.overall_score)}`}>
                      {analysis.overall_score}%
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent analyses</p>
            )}
          </div>

          {/* Keyword Analysis */}
          {keywordAnalysis && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Keyword Insights</h3>
              
              {/* Top Matching Keywords */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-green-600 mb-3">
                  ✅ Most Matched Keywords
                </h4>
                {keywordAnalysis.top_matching_keywords.length > 0 ? (
                  <div className="space-y-2">
                    {keywordAnalysis.top_matching_keywords.slice(0, 5).map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{item.keyword}</span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {item.count}x
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No matching keywords yet</p>
                )}
              </div>

              {/* Top Missing Keywords */}
              <div>
                <h4 className="text-md font-medium text-red-600 mb-3">
                  ❌ Most Missing Keywords
                </h4>
                {keywordAnalysis.top_missing_keywords.length > 0 ? (
                  <div className="space-y-2">
                    {keywordAnalysis.top_missing_keywords.slice(0, 5).map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{item.keyword}</span>
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                          {item.count}x
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No missing keywords data</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Improvement Tips */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Improvement Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-blue-600 mb-2">Boost Your ATS Score</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Include relevant keywords from job descriptions</li>
                <li>• Use standard section headings (Experience, Education, Skills)</li>
                <li>• Avoid complex formatting and graphics</li>
                <li>• Use bullet points for easy scanning</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-green-600 mb-2">Optimize Content</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Quantify achievements with numbers</li>
                <li>• Use action verbs to start bullet points</li>
                <li>• Tailor content to each job application</li>
                <li>• Keep formatting consistent throughout</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSDashboard;