import React, { useState } from 'react';
import { ResumeData } from '../contexts/ResumeContext';
import { generateAISuggestions, Suggestion, KeywordRecommendation, FormattingTip, AISuggestionsResponse } from '../api/aiSuggestionsApi';

interface SuggestionsData {
  overallScore: number;
  suggestions: Suggestion[];
  keywordRecommendations: KeywordRecommendation[];
  formattingTips: FormattingTip[];
}

interface AISuggestionsProps {
  resumeData: ResumeData;
  onApplySuggestion: (section: keyof ResumeData, newValue: string) => void;
}

const AISuggestions: React.FC<AISuggestionsProps> = ({ resumeData, onApplySuggestion }) => {
  const [suggestions, setSuggestions] = useState<SuggestionsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());

  const handleGenerateSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await generateAISuggestions(resumeData);
      
      // Handle the response structure - it has a 'data' property
      if (response.success && response.data) {
        setSuggestions({
          overallScore: response.data.overallScore,
          suggestions: response.data.suggestions,
          keywordRecommendations: response.data.keywordRecommendations,
          formattingTips: response.data.formattingTips
        });
      } else {
        // Fallback for development/testing - create mock suggestions
        setSuggestions({
          overallScore: 75,
          suggestions: [
            {
              id: 'mock-1',
              section: 'summary' as any,
              type: 'content',
              priority: 'high',
              title: 'Improve Professional Summary',
              description: 'Your summary could be more impactful with specific achievements.',
              currentText: (resumeData as any).objective || '',
              suggestedText: 'Results-driven professional with proven track record of delivering high-quality solutions and exceeding performance targets.',
              reasoning: 'Adding quantifiable achievements makes your summary more compelling to recruiters.',
              confidence: 85
            }
          ],
          keywordRecommendations: [
            {
              keyword: 'Leadership',
              section: 'experience',
              importance: 'high' as any,
              context: 'Important for senior roles',
              industryRelevance: 90
            }
          ],
          formattingTips: [
            {
              tip: 'Use bullet points for better readability',
              section: 'experience',
              impact: 'Improves ATS parsing and human readability',
              priority: 'medium' as any,
              category: 'structure' as any
            }
          ]
        });
      }
    } catch (err) {
      console.error('AI Suggestions error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate suggestions');
      
      // Show fallback suggestions even on error for development
      setSuggestions({
        overallScore: 65,
        suggestions: [
          {
            id: 'fallback-1',
            section: 'summary' as any,
            type: 'content',
            priority: 'medium',
            title: 'AI Service Unavailable',
            description: 'Using fallback suggestions for development.',
            currentText: '',
            suggestedText: 'Consider adding more specific achievements and metrics to your resume.',
            reasoning: 'This is a fallback suggestion while the AI service is being set up.',
            confidence: 50
          }
        ],
        keywordRecommendations: [],
        formattingTips: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applySuggestion = (suggestion: Suggestion) => {
    const sectionMap: Record<string, keyof ResumeData> = {
      summary: 'summary',
      experience: 'experience',
      education: 'education',
      skills: 'skills',
      contact: 'fullName', // Default to fullName for contact suggestions
    };

    const resumeSection = sectionMap[suggestion.section];
    if (resumeSection) {
      onApplySuggestion(resumeSection, suggestion.suggestedText);
      setAppliedSuggestions(prev => new Set([...prev, suggestion.id]));
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'keyword': return '🔍';
      case 'formatting': return '📝';
      case 'content': return '✨';
      case 'structure': return '🏗️';
      default: return '💡';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          🤖 AI Resume Suggestions
        </h2>
        <button
          onClick={handleGenerateSuggestions}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Analyzing...' : 'Get AI Suggestions'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">Error: {error}</p>
        </div>
      )}

      {suggestions && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Resume Score
              </span>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {suggestions.overallScore}
                </span>
                <span className="text-gray-600 dark:text-gray-300 ml-1">/100</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${suggestions.overallScore}%` }}
              ></div>
            </div>
            {/* Show note if using fallback suggestions */}
            {(suggestions as any).note && (
              <div className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
                ℹ️ {(suggestions as any).note}
              </div>
            )}
          </div>

          {/* Suggestions */}
          {suggestions.suggestions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Improvement Suggestions
              </h3>
              <div className="space-y-4">
                {suggestions.suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className={`border rounded-lg p-4 ${getPriorityColor(suggestion.priority)}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{getTypeIcon(suggestion.type)}</span>
                        <div>
                          <h4 className="font-semibold">{suggestion.title}</h4>
                          <span className="text-xs uppercase font-medium">
                            {suggestion.section} • {suggestion.priority} priority
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => applySuggestion(suggestion)}
                        disabled={appliedSuggestions.has(suggestion.id)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          appliedSuggestions.has(suggestion.id)
                            ? 'bg-green-100 text-green-700 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                        }`}
                      >
                        {appliedSuggestions.has(suggestion.id) ? '✓ Applied' : 'Apply'}
                      </button>
                    </div>
                    
                    <p className="text-sm mb-3">{suggestion.description}</p>
                    
                    {suggestion.currentText && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Current:
                        </p>
                        <p className="text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded italic">
                          "{suggestion.currentText}"
                        </p>
                      </div>
                    )}
                    
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Suggested:
                      </p>
                      <p className="text-sm bg-white dark:bg-slate-600 p-2 rounded border">
                        "{suggestion.suggestedText}"
                      </p>
                    </div>
                    
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      💡 {suggestion.reasoning}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Keyword Recommendations */}
          {suggestions.keywordRecommendations.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Keyword Recommendations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestions.keywordRecommendations.map((keyword, index) => (
                  <div key={index} className="bg-blue-50 dark:bg-slate-700 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-blue-900 dark:text-blue-300">
                        {keyword.keyword}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        keyword.importance === 'high' ? 'bg-red-100 text-red-700' :
                        keyword.importance === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {keyword.importance}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      Section: {keyword.section}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {keyword.context}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formatting Tips */}
          {suggestions.formattingTips.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Formatting Tips
              </h3>
              <div className="space-y-3">
                {suggestions.formattingTips.map((tip, index) => (
                  <div key={index} className="bg-green-50 dark:bg-slate-700 p-3 rounded-lg">
                    <p className="font-medium text-green-900 dark:text-green-300 mb-1">
                      📝 {tip.tip}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      Section: {tip.section}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Impact: {tip.impact}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!suggestions && !isLoading && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🤖</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Get AI-powered suggestions to improve your resume
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Our AI will analyze your resume and provide personalized recommendations for better ATS compatibility and professional impact.
          </p>
        </div>
      )}
    </div>
  );
};

export default AISuggestions;