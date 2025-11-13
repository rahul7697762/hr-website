'use client';
import React, { useState } from 'react';
import { ScreeningConfig } from '../../interview-prep/voice-screening/page';

interface ScreeningSetupProps {
  onStartScreening: (config: ScreeningConfig) => void;
  isLoading: boolean;
}

const jobTitles = [
  'Software Engineer',
  'Product Manager',
  'Data Scientist',
  'UX Designer',
  'Marketing Manager',
  'Sales Representative',
  'Business Analyst',
  'Project Manager',
  'DevOps Engineer',
  'Customer Success Manager'
];

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'E-commerce',
  'Education',
  'Manufacturing',
  'Consulting',
  'Media & Entertainment',
  'Real Estate',
  'Non-profit'
];

const focusAreaOptions = [
  'Technical Skills',
  'Communication',
  'Problem Solving',
  'Leadership',
  'Teamwork',
  'Cultural Fit',
  'Industry Knowledge',
  'Customer Service',
  'Sales Skills',
  'Analytical Thinking'
];

export default function ScreeningSetup({ onStartScreening, isLoading }: ScreeningSetupProps) {
  const [config, setConfig] = useState<ScreeningConfig>({
    jobTitle: '',
    jobLevel: 'mid',
    industry: '',
    duration: 15,
    focusAreas: [],
    difficulty: 'medium'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFocusAreaToggle = (area: string) => {
    setConfig(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area]
    }));
  };

  const validateConfig = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!config.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }
    if (!config.industry.trim()) {
      newErrors.industry = 'Industry is required';
    }
    if (config.focusAreas.length === 0) {
      newErrors.focusAreas = 'Select at least one focus area';
    }
    if (config.focusAreas.length > 4) {
      newErrors.focusAreas = 'Select maximum 4 focus areas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateConfig()) {
      onStartScreening(config);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Configure Your Voice Screening
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Set up your practice interview parameters for a personalized experience
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Job Title *
            </label>
            <select
              value={config.jobTitle}
              onChange={(e) => setConfig(prev => ({ ...prev, jobTitle: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            >
              <option value="">Select a job title</option>
              {jobTitles.map(title => (
                <option key={title} value={title}>{title}</option>
              ))}
            </select>
            {errors.jobTitle && <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>}
          </div>

          {/* Job Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Experience Level
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {(['entry', 'mid', 'senior', 'executive'] as const).map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setConfig(prev => ({ ...prev, jobLevel: level }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    config.jobLevel === level
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-500'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Industry *
            </label>
            <select
              value={config.industry}
              onChange={(e) => setConfig(prev => ({ ...prev, industry: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            >
              <option value="">Select an industry</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
            {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Interview Duration: {config.duration} minutes
            </label>
            <input
              type="range"
              min="5"
              max="30"
              step="5"
              value={config.duration}
              onChange={(e) => setConfig(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>5 min</span>
              <span>15 min</span>
              <span>30 min</span>
            </div>
          </div>

          {/* Focus Areas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Focus Areas * (Select 1-4)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {focusAreaOptions.map(area => (
                <button
                  key={area}
                  type="button"
                  onClick={() => handleFocusAreaToggle(area)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    config.focusAreas.includes(area)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 dark:bg-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-500'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
            {errors.focusAreas && <p className="text-red-500 text-sm mt-1">{errors.focusAreas}</p>}
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'medium', 'hard'] as const).map(difficulty => (
                <button
                  key={difficulty}
                  type="button"
                  onClick={() => setConfig(prev => ({ ...prev, difficulty }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    config.difficulty === difficulty
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-500'
                  }`}
                >
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Setting up...
                </div>
              ) : (
                'Start Voice Screening 🎤'
              )}
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-blue-600 dark:text-blue-400 text-xl">💡</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                What to Expect
              </h3>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                <ul className="list-disc list-inside space-y-1">
                  <li>Real-time voice conversation with AI interviewer</li>
                  <li>Questions tailored to your job title and experience level</li>
                  <li>Instant feedback on communication and content</li>
                  <li>Detailed analysis and improvement recommendations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}