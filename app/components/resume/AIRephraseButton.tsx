import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface AIRephraseButtonProps {
  text: string;
  section: string;
  onApply: (newText: string) => void;
}

const AIRephraseButton: React.FC<AIRephraseButtonProps> = ({ text, section, onApply }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSuggestions = async () => {
    if (!text || text.trim().length < 10) {
      setError('Please enter at least 10 characters to get AI suggestions');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      // Use Google Generative AI SDK
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || 'Api key not found';
      
      if (!apiKey || apiKey === 'your-api-key-here') {
        throw new Error('Google AI API key not configured. Please add NEXT_PUBLIC_GOOGLE_AI_API_KEY to .env.local');
      }

      console.log('Using API key:', apiKey.substring(0, 10) + '...');
      
      const genAI = new GoogleGenerativeAI(apiKey);
      
      const prompt = `You are a professional resume writer. Rephrase the following ${section} section text to make it more professional, impactful, and ATS-friendly. Provide 3 different variations. Keep the same meaning but improve clarity, use action verbs, and quantify achievements where possible.

Original text: "${text}"

Provide 3 rephrased versions, each on a new line, numbered 1-3.`;

      // Try multiple model versions
      const models = ['gemini-2.5-flash'];
      
      let generatedText = '';
      let lastError: Error | null = null;

      for (const modelName of models) {
        try {
          console.log('Trying model:', modelName);
          const model = genAI.getGenerativeModel({ model: modelName });
          
          const result = await model.generateContent(prompt);
          const response = await result.response;
          generatedText = response.text();
          
          if (generatedText) {
            console.log('Successfully used model:', modelName);
            break;
          }
        } catch (err) {
          lastError = err as Error;
          console.log(`Model ${modelName} failed:`, err);
        }
      }

      if (!generatedText) {
        throw lastError || new Error('All model attempts failed');
      }

      console.log('Generated text:', generatedText);
      
      // Parse the numbered suggestions
      const lines = generatedText.split('\n').filter((line: string) => line.trim());
      const parsedSuggestions = lines
        .filter((line: string) => /^\d+[.)]/.test(line.trim()))
        .map((line: string) => line.replace(/^\d+[.)]/, '').trim())
        .filter((s: string) => s.length > 0);

      if (parsedSuggestions.length === 0) {
        // Fallback: split by newlines if no numbered format
        const fallbackSuggestions = lines.slice(0, 3).filter((s: string) => s.length > 10);
        setSuggestions(fallbackSuggestions.length > 0 ? fallbackSuggestions : [generatedText.trim()]);
      } else {
        setSuggestions(parsedSuggestions.slice(0, 3));
      }
      
      setShowSuggestions(true);
    } catch (err) {
      console.error('AI Rephrase Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate suggestions';
      setError(`${errorMessage}. Please check your API key in .env.local`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = (suggestion: string) => {
    onApply(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={generateSuggestions}
        disabled={isLoading || !text}
        className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span>Generating...</span>
          </>
        ) : (
          <>
            <span>✨</span>
            <span>AI Rephrase</span>
          </>
        )}
      </button>

      {error && (
        <div className="absolute z-10 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg shadow-lg text-sm text-red-600 w-80">
          {error}
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 mt-2 p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg shadow-xl w-96 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">AI Suggestions</h4>
            <button
              onClick={() => setShowSuggestions(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-3 bg-purple-50 dark:bg-slate-700 rounded-lg border border-purple-200 dark:border-slate-600"
              >
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {suggestion}
                </p>
                <button
                  onClick={() => handleApply(suggestion)}
                  className="text-xs px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                >
                  Use This
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRephraseButton;
