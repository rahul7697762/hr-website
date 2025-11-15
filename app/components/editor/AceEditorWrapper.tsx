'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import CodeEditor to avoid SSR issues with Ace Editor
const CodeEditor = dynamic(() => import('./CodeEditor'), {
  ssr: false,
});

interface AceEditorWrapperProps {
  code: string;
  language: string;
  theme: 'light' | 'dark';
  onChange: (value: string) => void;
}

const AceEditorWrapper: React.FC<AceEditorWrapperProps> = ({
  code,
  language,
  theme,
  onChange,
}) => {
  // Map language names to Ace Editor mode names
  const languageMap: Record<string, string> = {
    javascript: 'javascript',
    python: 'python',
    c_cpp: 'c_cpp',
    java: 'java',
    typescript: 'typescript',
    ruby: 'ruby',
    golang: 'golang',
    c: 'c_cpp', // C uses the same mode as C++
  };

  // Map theme to Ace Editor theme names
  const themeMap = {
    dark: 'monokai',
    light: 'github',
  };

  const aceLanguage = languageMap[language] || 'javascript';
  const aceTheme = themeMap[theme];

  return (
    <div className={`h-full w-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <CodeEditor
        language={aceLanguage}
        theme={aceTheme}
        value={code}
        onChange={onChange}
      />
    </div>
  );
};

export default AceEditorWrapper;
