'use client';
import React, { useState } from 'react';
import { useVapi, createInterviewAssistant } from './VapiClient';

export default function VoiceDemo() {
  const { vapi, isInitialized, error, initializeVapi } = useVapi();
  const [isConnected, setIsConnected] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const startDemo = async () => {
    setIsLoading(true);
    try {
      if (!isInitialized) {
        const assistantConfig = createInterviewAssistant(
          'Software Engineer',
          'Technology',
          ['Technical Skills', 'Communication']
        );
        
        await initializeVapi({
          apiKey: process.env.NEXT_PUBLIC_VAPI_API_KEY || 'demo-key',
          assistant: assistantConfig
        });
      }

      if (vapi) {
        vapi.onTranscriptUpdate((newTranscript) => {
          setTranscript(newTranscript);
        });

        vapi.onCallStart(() => {
          setIsConnected(true);
        });

        vapi.onCallEnd(() => {
          setIsConnected(false);
        });

        await vapi.start();
      }
    } catch (err) {
      console.error('Demo error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const stopDemo = async () => {
    if (vapi) {
      await vapi.stop();
      setIsConnected(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        🎤 Voice Demo
      </h3>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-center">
          {!isConnected ? (
            <button
              onClick={startDemo}
              disabled={isLoading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Connecting...' : 'Start Voice Demo'}
            </button>
          ) : (
            <button
              onClick={stopDemo}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Stop Demo
            </button>
          )}
        </div>

        <div className={`flex items-center justify-center ${isConnected ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>

        {transcript && (
          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Live Transcript:
            </h4>
            <p className="text-gray-900 dark:text-white text-sm">{transcript}</p>
          </div>
        )}
      </div>
    </div>
  );
}