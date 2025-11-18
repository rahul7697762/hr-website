'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type Question = {
  question_id: number;
  question: string;
  choices?: string[];
  correct_answer?: string;
  difficulty?: string;
};

type Quiz = {
  quiz_id: number;
  title: string;
  description?: string;
};

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const quizId = params.quizId as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }
    loadQuiz();
  }, [quizId, isAuthenticated]);

  async function loadQuiz() {
    try {
      // Load quiz details
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('quiz_id', quizId)
        .single();

      if (quizError || !quizData) {
        throw new Error('Quiz not found');
      }

      setQuiz(quizData);

      // Load questions for this quiz
      const { data: mappings, error: mappingsError } = await supabase
        .from('quiz_questions')
        .select('question_id')
        .eq('quiz_id', quizId);

      if (mappingsError || !mappings || mappings.length === 0) {
        throw new Error('No questions found for this quiz');
      }

      const questionIds = mappings.map((m: any) => m.question_id);

      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .in('question_id', questionIds);

      if (questionsError || !questionsData) {
        throw new Error('Failed to load questions');
      }

      setQuestions(questionsData);
    } catch (error: any) {
      console.error('Error loading quiz:', error);
      alert(error.message || 'Failed to load quiz');
      router.push('/quiz');
    } finally {
      setLoading(false);
    }
  }

  function handleAnswerSelect(answer: string) {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: answer,
    });
  }

  function handleNext() {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  }

  function handlePrevious() {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }

  async function handleSubmit() {
    // Calculate score
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correct_answer) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setShowResults(true);

    // Save attempt to database
    if (user) {
      const durationSec = Math.floor((Date.now() - startTime) / 1000);
      
      try {
        await supabase.from('attempts').insert([
          {
            quiz_id: parseInt(quizId),
            user_id: user.user_id,
            score: correctCount,
            max_score: questions.length,
            duration_sec: durationSec,
          },
        ]);
      } catch (error) {
        console.error('Failed to save attempt:', error);
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Quiz Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The quiz you're looking for doesn't exist or has no questions.
            </p>
            <button
              onClick={() => router.push('/quiz')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Quizzes
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Quiz Completed! 🎉
              </h1>
              <p className="text-gray-600 dark:text-gray-300">{quiz.title}</p>
            </div>

            <div className="text-center mb-8">
              <div className="inline-block p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full mb-4">
                <div className="text-6xl font-bold text-blue-600 dark:text-blue-400">
                  {percentage}%
                </div>
              </div>
              <p className="text-xl text-gray-700 dark:text-gray-300">
                You scored {score} out of {questions.length}
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {questions.map((q, index) => {
                const userAnswer = selectedAnswers[index];
                const isCorrect = userAnswer === q.correct_answer;
                
                return (
                  <div
                    key={q.question_id}
                    className={`p-4 rounded-lg border-2 ${
                      isCorrect
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">
                        {isCorrect ? '✅' : '❌'}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white mb-2">
                          {index + 1}. {q.question}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Your answer: <span className="font-medium">{userAnswer || 'Not answered'}</span>
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-green-600 dark:text-green-400">
                            Correct answer: <span className="font-medium">{q.correct_answer}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/quiz')}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Back to Quizzes
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-8">
          {/* Quiz Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {quiz.title}
            </h1>
            {quiz.description && (
              <p className="text-gray-600 dark:text-gray-300">{quiz.description}</p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <div className="flex items-start gap-3 mb-6">
              <span className="text-3xl">❓</span>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Answer Choices */}
            <div className="space-y-3">
              {currentQuestion.choices?.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(choice)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    selectedAnswers[currentQuestionIndex] === choice
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswers[currentQuestionIndex] === choice
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-gray-400'
                      }`}
                    >
                      {selectedAnswers[currentQuestionIndex] === choice && (
                        <span className="text-white text-sm">✓</span>
                      )}
                    </div>
                    <span className="text-gray-900 dark:text-white">{choice}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <button
              onClick={handleNext}
              disabled={!selectedAnswers[currentQuestionIndex]}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestionIndex === questions.length - 1 ? 'Submit Quiz' : 'Next →'}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
