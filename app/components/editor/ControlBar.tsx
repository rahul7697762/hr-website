'use client';

import React from 'react';

interface ControlBarProps {
  activeTab: 'program' | 'debug';
  language: string;
  theme: string;
  onTabChange: (tab: 'program' | 'debug') => void;
  onLanguageChange: (language: string) => void;
  onThemeToggle: () => void;
}

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'c_cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'golang', label: 'Go' },
];

const ControlBar: React.FC<ControlBarProps> = ({
  activeTab,
  language,
  theme,
  onTabChange,
  onLanguageChange,
  onThemeToggle,
}) => {
  const isDark = theme === 'dark';

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-2 px-3 py-2 md:px-4 md:py-2 border-b transition-colors duration-300 ${
        isDark
          ? 'bg-gray-800 border-gray-700'
          : 'bg-gray-100 border-gray-300'
      }`}
    >
      {/* Left: Tab Navigation */}
      <div className="flex gap-1" role="tablist" aria-label="Code editor modes">
        <button
          onClick={() => onTabChange('program')}
          role="tab"
          aria-selected={activeTab === 'program'}
          aria-controls="editor-panel"
          aria-label="Program tab"
          tabIndex={activeTab === 'program' ? 0 : -1}
          className={`px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium transition-colors touch-manipulation ${
            activeTab === 'program'
              ? isDark
                ? 'bg-gray-900 text-white border-b-2 border-blue-500'
                : 'bg-white text-gray-900 border-b-2 border-blue-500'
              : isDark
              ? 'bg-transparent text-gray-400 hover:bg-gray-700 active:bg-gray-600 hover:text-gray-200'
              : 'bg-transparent text-gray-600 hover:bg-gray-200 active:bg-gray-300 hover:text-gray-900'
          }`}
        >
          Program
        </button>
        <button
          onClick={() => onTabChange('debug')}
          role="tab"
          aria-selected={activeTab === 'debug'}
          aria-controls="editor-panel"
          aria-label="Debug tab"
          tabIndex={activeTab === 'debug' ? 0 : -1}
          className={`px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium transition-colors touch-manipulation ${
            activeTab === 'debug'
              ? isDark
                ? 'bg-gray-900 text-white border-b-2 border-blue-500'
                : 'bg-white text-gray-900 border-b-2 border-blue-500'
              : isDark
              ? 'bg-transparent text-gray-400 hover:bg-gray-700 active:bg-gray-600 hover:text-gray-200'
              : 'bg-transparent text-gray-600 hover:bg-gray-200 active:bg-gray-300 hover:text-gray-900'
          }`}
        >
          Debug
        </button>
      </div>

      {/* Center: Language Selector */}
      <div className="flex items-center gap-2 flex-1 md:flex-initial justify-center">
        <label htmlFor="language-selector" className="sr-only">
          Select programming language
        </label>
        <select
          id="language-selector"
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          aria-label="Select programming language"
          className={`px-2 py-1.5 md:px-3 md:py-1.5 text-xs md:text-sm rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 touch-manipulation ${
            isDark
              ? 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600'
              : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
          }`}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.value + lang.label} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Right: Theme Toggle */}
      <button
        onClick={onThemeToggle}
        aria-label="Toggle theme"
        aria-pressed={isDark}
        title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        className={`p-1.5 md:p-2 rounded transition-colors touch-manipulation ${
          isDark
            ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600 active:bg-gray-500'
            : 'bg-white text-gray-700 hover:bg-gray-200 active:bg-gray-300'
        }`}
      >
        {isDark ? (
          // Sun icon for light mode
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="md:w-5 md:h-5"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          // Moon icon for dark mode
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="md:w-5 md:h-5"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default ControlBar;
