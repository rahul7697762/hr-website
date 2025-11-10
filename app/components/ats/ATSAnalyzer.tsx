import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { get, post } from '../../utils/api';

interface ATSResult {
  ats_id: number;
  overall_score: number;
  matching_keywords: string[];
  missing_keywords: string[];
  suggestions: string;
  job_description: string;
  created_at: string;
  analysis_data?: {
    full_analysis: string;
    keyword_density: number;
    readability_score: number;
    format_score: number;
    sections_analysis: {
      hasContactInfo: boolean;
      hasSummary: boolean;
      hasExperience: boolean;
      hasEducation: boolean;
      hasSkills: boolean;
    };
  };
}

interface Resume {
  resume_id: number;
  resume_name: string;
  resume_data: any;
}

const ATSAnalyzer: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'upload' | 'results'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResult, setCurrentResult] = useState<ATSResult | null>(null);
  const [userResumes, setUserResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [atsStats, setAtsStats] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadUserResumes();
      loadATSStats();
    }
  }, [user]);

  const loadUserResumes = async () => {
    try {
      const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/database/users/${user?.user_id}/resumes`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserResumes(data.data);
        }
      }
    } catch (error) {
      console.error('Error loading resumes:', error);
    }
  };

  const loadATSStats = async () => {
    try {
      const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/ats-analyzer/results`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAtsStats(data.stats);
        }
      }
    } catch (error) {
      console.error('Error loading ATS stats:', error);
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/ats-analyzer/process-resume`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setResumeText(data.resumeText);
      } else {
        throw new Error(data.error || 'Failed to process resume');
      }
    } catch (error) {
      console.error('Error processing resume:', error);
      alert(`Failed to process resume: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText || !jobDescription) {
      alert('Please provide both resume text and job description.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/ats-analyzer/analyze-and-save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          resumeId: selectedResumeId,
          resumeName: file?.name || 'Uploaded Resume'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setCurrentResult(data.atsResult);
        loadATSStats(); // Refresh stats
        setActiveTab('results');
      } else {
        throw new Error(data.error || 'Failed to analyze resume');
      }
    } catch (error) {
      console.error('Error analyzing resume:', error);
      alert(`Failed to analyze resume: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ATS Resume Analyzer</h1>
          <p className="text-gray-600">
            Optimize your resume for Applicant Tracking Systems with AI-powered analysis
          </p>
        </div>

        {/* Stats Overview */}
        {atsStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{atsStats.total_analyses}</div>
              <div className="text-sm text-gray-600">Total Analyses</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-2xl font-bold text-green-600">{atsStats.average_score}%</div>
              <div className="text-sm text-gray-600">Average Score</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">{atsStats.highest_score}%</div>
              <div className="text-sm text-gray-600">Highest Score</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-2xl font-bold text-orange-600">{atsStats.lowest_score}%</div>
              <div className="text-sm text-gray-600">Lowest Score</div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'upload'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📄 Analyze Resume
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'results'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📊 View Results
          </button>
        </div>

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Resume</h3>
              
              {/* File Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume File (PDF or DOCX)
                </label>
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleFileUpload}
                  disabled={!file || isProcessing}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : 'Process Resume'}
                </button>
              </div>

              {/* Or Select Existing Resume */}
              {userResumes.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or Select Existing Resume
                  </label>
                  <select
                    value={selectedResumeId || ''}
                    onChange={(e) => {
                      const resumeId = parseInt(e.target.value);
                      setSelectedResumeId(resumeId);
                      const resume = userResumes.find(r => r.resume_id === resumeId);
                      if (resume?.resume_data?.resumeText) {
                        setResumeText(resume.resume_data.resumeText);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a resume...</option>
                    {userResumes.map((resume) => (
                      <option key={resume.resume_id} value={resume.resume_id}>
                        {resume.resume_name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Resume Text */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume Text
                </label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here or upload a file above..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={8}
                />
              </div>
            </div>

            {/* Job Description Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description you want to analyze against..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={12}
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!resumeText || !jobDescription || isAnalyzing}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isAnalyzing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Resume...
                  </span>
                ) : (
                  '🎯 Analyze Resume'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && currentResult && (
          <div className="space-y-6">
            {/* Score Overview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">ATS Analysis Results</h3>
                <div className={`px-4 py-2 rounded-full ${getScoreBgColor(currentResult.overall_score)}`}>
                  <span className={`text-2xl font-bold ${getScoreColor(currentResult.overall_score)}`}>
                    {currentResult.overall_score}%
                  </span>
                </div>
              </div>

              {/* Detailed Scores */}
              {currentResult.analysis_data && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-xl font-semibold text-blue-600">
                      {Math.round(currentResult.analysis_data.keyword_density)}%
                    </div>
                    <div className="text-sm text-gray-600">Keyword Match</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold text-green-600">
                      {Math.round(currentResult.analysis_data.readability_score)}%
                    </div>
                    <div className="text-sm text-gray-600">Readability</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold text-purple-600">
                      {Math.round(currentResult.analysis_data.format_score)}%
                    </div>
                    <div className="text-sm text-gray-600">Format</div>
                  </div>
                </div>
              )}
            </div>

            {/* Keywords Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Matching Keywords */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="text-lg font-semibold text-green-600 mb-4">
                  ✅ Matching Keywords ({currentResult.matching_keywords.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentResult.matching_keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="text-lg font-semibold text-red-600 mb-4">
                  ❌ Missing Keywords ({currentResult.missing_keywords.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentResult.missing_keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="text-lg font-semibold text-blue-600 mb-4">💡 Suggestions for Improvement</h4>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{currentResult.suggestions}</p>
              </div>
            </div>

            {/* Full Analysis */}
            {currentResult.analysis_data?.full_analysis && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">📋 Detailed Analysis</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700">
                    {currentResult.analysis_data.full_analysis}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ATSAnalyzer;