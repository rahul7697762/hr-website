'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Vapi Web SDK types
interface VapiConfig {
  apiKey: string;
  assistant?: {
    model: {
      provider: string;
      model: string;
      temperature: number;
      messages: Array<{
        role: string;
        content: string;
      }>;
    };
    voice: {
      provider: string;
      voiceId: string;
    };
    firstMessage?: string;
  };
}

interface VapiInstance {
  start: (assistantId?: string) => Promise<void>;
  stop: () => Promise<void>;
  isConnected: boolean;
  transcript: string;
  onTranscriptUpdate: (callback: (transcript: string) => void) => void;
  onCallEnd: (callback: () => void) => void;
  onCallStart: (callback: () => void) => void;
  onError: (callback: (error: any) => void) => void;
}

interface VapiContextType {
  vapi: VapiInstance | null;
  isInitialized: boolean;
  error: string | null;
  initializeVapi: (config: VapiConfig) => Promise<void>;
}

const VapiContext = createContext<VapiContextType | undefined>(undefined);

export const useVapi = () => {
  const context = useContext(VapiContext);
  if (!context) {
    throw new Error('useVapi must be used within a VapiProvider');
  }
  return context;
};

interface VapiProviderProps {
  children: ReactNode;
  apiKey: string;
}

export const VapiProvider: React.FC<VapiProviderProps> = ({ children, apiKey }) => {
  const [vapi, setVapi] = useState<VapiInstance | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeVapi = async (config: VapiConfig) => {
    try {
      setError(null);
      
      // Check if Vapi SDK is loaded
      if (typeof window !== 'undefined' && (window as any).Vapi) {
        const VapiSDK = (window as any).Vapi;
        
        const vapiInstance = new VapiSDK(config);

        // Create our wrapper instance
        const wrappedInstance: VapiInstance = {
          start: async (assistantId?: string) => {
            try {
              if (assistantId) {
                await vapiInstance.start(assistantId);
              } else if (config.assistant) {
                await vapiInstance.start(config.assistant);
              } else {
                throw new Error('No assistant configuration provided');
              }
            } catch (err) {
              console.error('Failed to start Vapi call:', err);
              throw err;
            }
          },
          stop: async () => {
            try {
              await vapiInstance.stop();
            } catch (err) {
              console.error('Failed to stop Vapi call:', err);
              throw err;
            }
          },
          isConnected: vapiInstance.isConnected || false,
          transcript: vapiInstance.transcript || '',
          onTranscriptUpdate: (callback: (transcript: string) => void) => {
            if (vapiInstance.on) {
              vapiInstance.on('transcript', callback);
            }
          },
          onCallEnd: (callback: () => void) => {
            if (vapiInstance.on) {
              vapiInstance.on('call-end', callback);
            }
          },
          onCallStart: (callback: () => void) => {
            if (vapiInstance.on) {
              vapiInstance.on('call-start', callback);
            }
          },
          onError: (callback: (error: any) => void) => {
            if (vapiInstance.on) {
              vapiInstance.on('error', callback);
            }
          }
        };

        setVapi(wrappedInstance);
        setIsInitialized(true);
      } else {
        // Fallback to mock implementation for development
        console.warn('Vapi SDK not loaded, using mock implementation');
        const mockInstance: VapiInstance = {
          start: async () => {
            console.log('Mock Vapi: Starting call');
            return Promise.resolve();
          },
          stop: async () => {
            console.log('Mock Vapi: Stopping call');
            return Promise.resolve();
          },
          isConnected: false,
          transcript: '',
          onTranscriptUpdate: (callback: (transcript: string) => void) => {
            // Mock transcript updates
            setTimeout(() => callback('Mock transcript update'), 1000);
          },
          onCallEnd: (callback: () => void) => {
            // Mock call end after 30 seconds
            setTimeout(callback, 30000);
          },
          onCallStart: (callback: () => void) => {
            setTimeout(callback, 1000);
          },
          onError: (_callback: (error: any) => void) => {
            // Mock error handling
          }
        };

        setVapi(mockInstance);
        setIsInitialized(true);
      }
    } catch (err) {
      console.error('Failed to initialize Vapi:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize Vapi');
    }
  };

  useEffect(() => {
    // Load Vapi SDK if not already loaded
    if (typeof window !== 'undefined' && !(window as any).Vapi) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@vapi-ai/web@latest/dist/index.js';
      script.async = true;
      script.onload = () => {
        console.log('Vapi SDK loaded');
      };
      script.onerror = () => {
        console.error('Failed to load Vapi SDK');
        setError('Failed to load Vapi SDK');
      };
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, []);

  const value: VapiContextType = {
    vapi,
    isInitialized,
    error,
    initializeVapi
  };

  return (
    <VapiContext.Provider value={value}>
      {children}
    </VapiContext.Provider>
  );
};

// Helper function to create interview assistant configuration
export const createInterviewAssistant = (jobTitle: string, industry: string, focusAreas: string[]) => {
  const systemPrompt = `You are an AI interviewer conducting a practice interview for a ${jobTitle} position in the ${industry} industry. 

Your role:
- Ask relevant, professional interview questions
- Focus on: ${focusAreas.join(', ')}
- Keep questions concise and clear
- Allow the candidate time to respond
- Be encouraging but professional
- Ask follow-up questions when appropriate

Guidelines:
- Start with an introduction and ask the candidate to introduce themselves
- Ask behavioral questions using the STAR method
- Include technical questions relevant to the role
- Ask about cultural fit and motivation
- End by asking if they have questions for you
- Keep responses under 30 words when possible
- Speak naturally and conversationally`;

  return {
    model: {
      provider: 'openai',
      model: 'gpt-4o',
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        }
      ]
    },
    voice: {
      provider: '11labs',
      voiceId: '21m00Tcm4TlvDq8ikWAM' // Professional female voice
    },
    firstMessage: `Hello! I'm excited to speak with you today about the ${jobTitle} position. Let's start with you telling me a bit about yourself and your background.`
  };
};