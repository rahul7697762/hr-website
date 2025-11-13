'use client';
import { useState, useEffect, useRef } from 'react';
import { ScreeningConfig, ScreeningResult } from '../../interview-prep/voice-screening/page';
import { useVapi, createInterviewAssistant } from './VapiClient';

interface VoiceScreeningInterfaceProps {
  config: ScreeningConfig;
  onComplete: (result: ScreeningResult) => void;
  onBack: () => void;
}

interface Question {
  id: string;
  question: string;
  category: string;
  expectedDuration: number; // in seconds
}

interface InterviewState {
  isActive: boolean;
  currentQuestion: Question | null;
  questionIndex: number;
  startTime: Date | null;
  endTime: Date | null;
  transcript: string;
  responses: Array<{
    question: string;
    answer: string;
    duration: number;
    timestamp: Date;
  }>;
}

export default function VoiceScreeningInterface({ 
  config, 
  onComplete, 
  onBack 
}: VoiceScreeningInterfaceProps) {
  const { vapi, isInitialized, initializeVapi } = useVapi();
  const [interviewState, setInterviewState] = useState<InterviewState>({
    isActive: false,
    currentQuestion: null,
    questionIndex: 0,
    startTime: null,
    endTime: null,
    transcript: '',
    responses: []
  });

  const [isConnecting, setIsConnecting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(config.duration * 60);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const questionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate questions based on config
  const generateQuestions = (): Question[] => {
    const baseQuestions: Record<string, Question[]> = {
      'Technical Skills': [
        {
          id: 'tech-1',
          question: `Tell me about your experience with the technical requirements for a ${config.jobTitle} role.`,
          category: 'Technical Skills',
          expectedDuration: 90
        },
        {
          id: 'tech-2',
          question: 'Describe a challenging technical problem you solved recently.',
          category: 'Technical Skills',
          expectedDuration: 120
        }
      ],
      'Communication': [
        {
          id: 'comm-1',
          question: 'How do you handle disagreements with team members?',
          category: 'Communication',
          expectedDuration: 90
        },
        {
          id: 'comm-2',
          question: 'Describe a time when you had to explain a complex concept to someone.',
          category: 'Communication',
          expectedDuration: 90
        }
      ],
      'Problem Solving': [
        {
          id: 'prob-1',
          question: 'Walk me through your approach to solving complex problems.',
          category: 'Problem Solving',
          expectedDuration: 120
        },
        {
          id: 'prob-2',
          question: 'Tell me about a time when you had to make a decision with limited information.',
          category: 'Problem Solving',
          expectedDuration: 90
        }
      ],
      'Leadership': [
        {
          id: 'lead-1',
          question: 'Describe your leadership style and give me an example of when you used it.',
          category: 'Leadership',
          expectedDuration: 120
        },
        {
          id: 'lead-2',
          question: 'How do you motivate team members who are struggling?',
          category: 'Leadership',
          expectedDuration: 90
        }
      ],
      'Cultural Fit': [
        {
          id: 'culture-1',
          question: `What interests you most about working in the ${config.industry} industry?`,
          category: 'Cultural Fit',
          expectedDuration: 90
        },
        {
          id: 'culture-2',
          question: 'How do you handle work-life balance and stress?',
          category: 'Cultural Fit',
          expectedDuration: 90
        }
      ]
    };

    const selectedQuestions: Question[] = [];
    config.focusAreas.forEach(area => {
      if (baseQuestions[area]) {
        selectedQuestions.push(...baseQuestions[area]);
      }
    });

    // Add opening and closing questions
    selectedQuestions.unshift({
      id: 'opening',
      question: `Hi! I'm excited to speak with you today about the ${config.jobTitle} position. Let's start with you telling me a bit about yourself and your background.`,
      category: 'Introduction',
      expectedDuration: 120
    });

    selectedQuestions.push({
      id: 'closing',
      question: 'Do you have any questions for me about the role or the company?',
      category: 'Closing',
      expectedDuration: 60
    });

    return selectedQuestions.slice(0, Math.min(selectedQuestions.length, 8)); // Limit questions based on time
  };

  const [questions] = useState<Question[]>(generateQuestions());

  useEffect(() => {
    if (interviewState.isActive && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && interviewState.isActive) {
      handleEndInterview();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeRemaining, interviewState.isActive]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startInterview = async () => {
    setIsConnecting(true);
    try {
      // Initialize Vapi with interview assistant configuration
      if (!isInitialized) {
        const assistantConfig = createInterviewAssistant(
          config.jobTitle,
          config.industry,
          config.focusAreas
        );
        
        await initializeVapi({
          apiKey: process.env.NEXT_PUBLIC_VAPI_API_KEY || 'your-vapi-api-key',
          assistant: assistantConfig
        });
      }

      if (vapi) {
        // Set up event listeners
        vapi.onTranscriptUpdate((transcript) => {
          setCurrentTranscript(transcript);
        });

        vapi.onCallStart(() => {
          setIsListening(true);
          setInterviewState(prev => ({
            ...prev,
            isActive: true,
            startTime: new Date(),
            currentQuestion: questions[0],
            questionIndex: 0
          }));
        });

        vapi.onCallEnd(() => {
          handleEndInterview();
        });

        vapi.onError((error) => {
          console.error('Vapi error:', error);
        });

        // Start the call
        await vapi.start();
      }
      
    } catch (error) {
      console.error('Failed to start interview:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const speakQuestion = (question: Question) => {
    // In a real implementation, this would use Vapi's TTS
    console.log('AI asking:', question.question);
    
    // Start listening for response after question is asked
    setTimeout(() => {
      setIsListening(true);
      startQuestionTimer(question);
    }, 2000);
  };

  const startQuestionTimer = (question: Question) => {
    questionTimerRef.current = setTimeout(() => {
      moveToNextQuestion();
    }, question.expectedDuration * 1000);
  };

  const moveToNextQuestion = () => {
    if (questionTimerRef.current) {
      clearTimeout(questionTimerRef.current);
    }

    const currentAnswer = currentTranscript;
    
    setInterviewState(prev => {
      const newResponses = [...prev.responses];
      if (prev.currentQuestion) {
        newResponses.push({
          question: prev.currentQuestion.question,
          answer: currentAnswer,
          duration: prev.currentQuestion.expectedDuration,
          timestamp: new Date()
        });
      }

      const nextIndex = prev.questionIndex + 1;
      const nextQuestion = questions[nextIndex];

      if (nextQuestion) {
        setTimeout(() => speakQuestion(nextQuestion), 1000);
        return {
          ...prev,
          questionIndex: nextIndex,
          currentQuestion: nextQuestion,
          responses: newResponses
        };
      } else {
        // Interview complete
        handleEndInterview();
        return {
          ...prev,
          responses: newResponses,
          endTime: new Date()
        };
      }
    });

    setCurrentTranscript('');
  };

  const handleEndInterview = async () => {
    setInterviewState(prev => ({ ...prev, isActive: false, endTime: new Date() }));
    setIsListening(false);
    
    if (timerRef.current) clearTimeout(timerRef.current);
    if (questionTimerRef.current) clearTimeout(questionTimerRef.current);

    // Stop Vapi connection
    if (vapi) {
      await vapi.stop();
    }

    // Generate results
    const result: ScreeningResult = {
      id: Date.now().toString(),
      timestamp: new Date(),
      config,
      duration: config.duration * 60 - timeRemaining,
      transcript: interviewState.responses.map(r => `Q: ${r.question}\nA: ${r.answer}`).join('\n\n'),
      scores: {
        communication: Math.floor(Math.random() * 30) + 70, // Mock scoring
        technical: Math.floor(Math.random() * 30) + 70,
        cultural: Math.floor(Math.random() * 30) + 70,
        overall: Math.floor(Math.random() * 30) + 70
      },
      feedback: {
        strengths: [
          'Clear communication style',
          'Good technical knowledge',
          'Structured responses'
        ],
        improvements: [
          'Provide more specific examples',
          'Elaborate on technical details',
          'Show more enthusiasm'
        ],
        recommendations: [
          'Practice the STAR method for behavioral questions',
          'Research the company more thoroughly',
          'Prepare specific examples from your experience'
        ]
      },
      questions: interviewState.responses.map((response) => ({
        question: response.question,
        answer: response.answer,
        score: Math.floor(Math.random() * 30) + 70,
        feedback: 'Good response with room for more detail.'
      }))
    };

    onComplete(result);
  };

  // Mock transcript updates
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setCurrentTranscript(prev => {
          const mockResponses = [
            'I have experience with...',
            'In my previous role, I...',
            'I believe that...',
            'My approach to this would be...',
            'I think the key is...'
          ];
          return prev + (prev ? ' ' : '') + mockResponses[Math.floor(Math.random() * mockResponses.length)];
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isListening]);

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Voice Interview in Progress
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {config.jobTitle} • {config.industry} • {config.jobLevel} level
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Time Remaining
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Question {interviewState.questionIndex + 1} of {questions.length}</span>
            <span>{Math.round(((interviewState.questionIndex + 1) / questions.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((interviewState.questionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {!interviewState.isActive ? (
          /* Pre-Interview */
          <div className="text-center py-12">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🎤</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Ready to Start Your Voice Interview?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                Make sure you&apos;re in a quiet environment with a good microphone. 
                The interview will last approximately {config.duration} minutes.
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={onBack}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                ← Back to Setup
              </button>
              <button
                onClick={startInterview}
                disabled={isConnecting}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
              >
                {isConnecting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Connecting...
                  </div>
                ) : (
                  'Start Interview 🎤'
                )}
              </button>
            </div>
          </div>
        ) : (
          /* During Interview */
          <div className="space-y-6">
            {/* Current Question */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">AI</span>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Current Question:
                  </h4>
                  <p className="text-blue-800 dark:text-blue-200">
                    {interviewState.currentQuestion?.question}
                  </p>
                </div>
              </div>
            </div>

            {/* Voice Status */}
            <div className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Voice Status
                </h4>
                <div className={`flex items-center ${isListening ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-3 h-3 rounded-full mr-2 ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                  {isListening ? 'Listening...' : 'Not listening'}
                </div>
              </div>

              {/* Live Transcript */}
              <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4 min-h-[100px]">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Response:
                </h5>
                <p className="text-gray-900 dark:text-white">
                  {currentTranscript || 'Start speaking...'}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={moveToNextQuestion}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Next Question →
              </button>
              <button
                onClick={handleEndInterview}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                End Interview
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}