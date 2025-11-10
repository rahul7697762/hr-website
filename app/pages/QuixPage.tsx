import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { quizApi, QuizQuestion } from "../api/quizApi";
import { Button } from "../components/ui/button";

interface FormattedQuestion extends QuizQuestion {
  options: string[];
}

// Quiz categories - General & Technical
const CATEGORIES = [
  { id: "", name: "Any Category", group: "general" },
  { id: "9", name: "General Knowledge", group: "general" },
  { id: "18", name: "Science: Computers", group: "technical" },
  { id: "19", name: "Science: Mathematics", group: "technical" },
  { id: "21", name: "Sports", group: "general" },
  { id: "22", name: "Geography", group: "general" },
  { id: "23", name: "History", group: "general" },
  { id: "27", name: "Animals", group: "general" },
  { id: "17", name: "Science & Nature", group: "general" },
  { id: "25", name: "Art", group: "general" },
];

// Technical Subjects for Placement Prep
const TECHNICAL_SUBJECTS = [
  { id: "dsa", name: "Data Structures & Algorithms" },
  { id: "os", name: "Operating Systems" },
  { id: "dbms", name: "Database Management Systems" },
  { id: "cn", name: "Computer Networks" },
  { id: "oops", name: "Object-Oriented Programming" },
  { id: "web", name: "Web Development" },
  { id: "python", name: "Python Programming" },
  { id: "java", name: "Java Programming" },
  { id: "javascript", name: "JavaScript" },
  { id: "react", name: "React.js" },
  { id: "sql", name: "SQL" },
  { id: "aptitude", name: "Aptitude & Reasoning" },
];

// Company-specific preparation
const COMPANY_TAGS = [
  { id: "google", name: "Google", icon: "🔍" },
  { id: "microsoft", name: "Microsoft", icon: "🪟" },
  { id: "amazon", name: "Amazon", icon: "📦" },
  { id: "meta", name: "Meta (Facebook)", icon: "👥" },
  { id: "apple", name: "Apple", icon: "🍎" },
  { id: "netflix", name: "Netflix", icon: "🎬" },
  { id: "tesla", name: "Tesla", icon: "⚡" },
  { id: "uber", name: "Uber", icon: "🚗" },
  { id: "airbnb", name: "Airbnb", icon: "🏠" },
  { id: "tcs", name: "TCS", icon: "💼" },
  { id: "infosys", name: "Infosys", icon: "💼" },
  { id: "wipro", name: "Wipro", icon: "💼" },
];

const DIFFICULTIES = [
  { value: "", label: "Any Difficulty" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

export default function QuizPage() {
  const [questions, setQuestions] = useState<FormattedQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showConfig, setShowConfig] = useState(true);
  
  // Quiz configuration
  const [numQuestions, setNumQuestions] = useState(10);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [quizType, setQuizType] = useState<"general" | "technical" | "company">("general");
  const [technicalSubject, setTechnicalSubject] = useState("");
  const [companyTag, setCompanyTag] = useState("");

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const config = {
        amount: numQuestions,
        category,
        difficulty,
        quizType,
        technicalSubject: quizType === "technical" ? technicalSubject : undefined,
        companyTag: quizType === "company" ? companyTag : undefined,
      };
      
      const response = await quizApi.fetchQuestions(config);
      
      const formatted = response.questions.map((q: QuizQuestion) => ({
        ...q,
        options: [...q.incorrect_answers, q.correct_answer].sort(
          () => Math.random() - 0.5
        ),
      }));
      
      setQuestions(formatted);
      setShowConfig(false);
    } catch (err) {
      setError("Failed to load quiz questions. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    if (numQuestions < 5 || numQuestions > 50) {
      setError("Please select between 5 and 50 questions");
      return;
    }

    // Validate selections based on quiz type
    if (quizType === "technical" && !technicalSubject) {
      setError("Please select a technical subject");
      return;
    }

    if (quizType === "company" && !companyTag) {
      setError("Please select a company");
      return;
    }

    setError(null);
    loadQuestions();
  };

  const handleSelect = (option: string) => {
    if (!showAnswer) {
      setSelected(option);
    }
  };

  const handleNext = async () => {
    if (!selected) return;

    const isCorrect = selected === questions[current].correct_answer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setShowAnswer(true);

    setTimeout(() => {
      if (current + 1 < questions.length) {
        setCurrent((prev) => prev + 1);
        setSelected(null);
        setShowAnswer(false);
      } else {
        setCompleted(true);
        submitQuiz();
      }
    }, 2000);
  };

  const submitQuiz = async () => {
    try {
      const userId = localStorage.getItem("userId") || "guest";
      await quizApi.submitQuiz({
        userId,
        score,
        total: questions.length,
        answers: questions,
      });
    } catch (err) {
      console.error("Failed to submit quiz:", err);
    }
  };

  const restartQuiz = () => {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setCompleted(false);
    setShowAnswer(false);
    setShowConfig(true);
    setQuestions([]);
  };

  const decodeHtml = (html: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  // Configuration Screen
  if (showConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
              ← Back to Home
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎯</div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Quiz Setup</h1>
              <p className="text-gray-600">Customize your quiz experience</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Quiz Type Tabs */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Quiz Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setQuizType("general")}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      quizType === "general"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="text-2xl mb-1">🌍</div>
                    <div className="text-sm">General</div>
                  </button>
                  <button
                    onClick={() => setQuizType("technical")}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      quizType === "technical"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="text-2xl mb-1">💻</div>
                    <div className="text-sm">Technical</div>
                  </button>
                  <button
                    onClick={() => setQuizType("company")}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      quizType === "company"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="text-2xl mb-1">🏢</div>
                    <div className="text-sm">Company</div>
                  </button>
                </div>
              </div>

              {/* Number of Questions */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Questions
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="w-16 text-center">
                    <span className="text-2xl font-bold text-blue-600">{numQuestions}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Choose between 5 and 50 questions</p>
              </div>

              {/* Category - General Quiz */}
              {quizType === "general" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Technical Subjects */}
              {quizType === "technical" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Technical Subject
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                    {TECHNICAL_SUBJECTS.map((subject) => (
                      <button
                        key={subject.id}
                        onClick={() => setTechnicalSubject(subject.id)}
                        className={`px-4 py-3 rounded-lg border-2 font-medium text-left transition-all ${
                          technicalSubject === subject.id
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        {subject.name}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Note: Technical questions are curated for placement preparation
                  </p>
                </div>
              )}

              {/* Company Tags */}
              {quizType === "company" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Company
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                    {COMPANY_TAGS.map((company) => (
                      <button
                        key={company.id}
                        onClick={() => setCompanyTag(company.id)}
                        className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                          companyTag === company.id
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <div className="text-2xl mb-1">{company.icon}</div>
                        <div className="text-sm">{company.name}</div>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Practice questions asked in company interviews
                  </p>
                </div>
              )}

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {DIFFICULTIES.map((diff) => (
                    <button
                      key={diff.value}
                      onClick={() => setDifficulty(diff.value)}
                      className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                        difficulty === diff.value
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      {diff.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Button */}
              <Button
                onClick={startQuiz}
                disabled={loading}
                className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    Loading Questions...
                  </span>
                ) : (
                  "Start Quiz"
                )}
              </Button>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              {quizType === "general" && (
                <>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-1">📚</div>
                    <div className="text-sm font-semibold text-gray-700">Multiple Topics</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-1">⏱️</div>
                    <div className="text-sm font-semibold text-gray-700">No Time Limit</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-1">🏆</div>
                    <div className="text-sm font-semibold text-gray-700">Track Progress</div>
                  </div>
                </>
              )}
              {quizType === "technical" && (
                <>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-1">💻</div>
                    <div className="text-sm font-semibold text-gray-700">CS Fundamentals</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-1">🎯</div>
                    <div className="text-sm font-semibold text-gray-700">Placement Ready</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-1">📈</div>
                    <div className="text-sm font-semibold text-gray-700">Skill Building</div>
                  </div>
                </>
              )}
              {quizType === "company" && (
                <>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-1">🏢</div>
                    <div className="text-sm font-semibold text-gray-700">Real Interview Qs</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-1">💼</div>
                    <div className="text-sm font-semibold text-gray-700">Company Specific</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-1">✨</div>
                    <div className="text-sm font-semibold text-gray-700">Interview Prep</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading quiz questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={loadQuestions} className="bg-blue-600 hover:bg-blue-700 text-white">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (completed) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full text-center">
          <div className="text-6xl mb-4">{passed ? "🎉" : "📚"}</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {passed ? "Congratulations!" : "Keep Learning!"}
          </h2>
          <p className="text-gray-600 mb-6">
            You scored {score} out of {questions.length} ({percentage}%)
          </p>
          
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 mb-6">
            <div className="text-white text-5xl font-bold">{score}/{questions.length}</div>
            <div className="text-blue-100 mt-2">Correct Answers</div>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Button onClick={restartQuiz} className="bg-blue-600 hover:bg-blue-700 text-white">
              Try Again
            </Button>
            <Link to="/">
              <Button className="bg-gray-600 hover:bg-gray-700 text-white">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">No questions available</p>
      </div>
    );
  }

  const currentQuestion = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center flex-wrap gap-3">
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Home
          </Link>
          <div className="flex items-center gap-3">
            {/* Quiz Type Badge */}
            {quizType === "technical" && technicalSubject && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                💻 {TECHNICAL_SUBJECTS.find(s => s.id === technicalSubject)?.name}
              </span>
            )}
            {quizType === "company" && companyTag && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                {COMPANY_TAGS.find(c => c.id === companyTag)?.icon} {COMPANY_TAGS.find(c => c.id === companyTag)?.name}
              </span>
            )}
            <div className="text-gray-600 font-medium">
              Score: {score}/{questions.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {current + 1} of {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Category & Difficulty */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {currentQuestion.category && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {decodeHtml(currentQuestion.category)}
              </span>
            )}
            {currentQuestion.difficulty && (
              <span className={`px-3 py-1 rounded-full text-sm ${
                currentQuestion.difficulty === "easy"
                  ? "bg-green-100 text-green-700"
                  : currentQuestion.difficulty === "medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {currentQuestion.difficulty}
              </span>
            )}
          </div>

          {/* Question */}
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            {decodeHtml(currentQuestion.question)}
          </h3>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selected === option;
              const isCorrect = option === currentQuestion.correct_answer;
              const showCorrect = showAnswer && isCorrect;
              const showIncorrect = showAnswer && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => handleSelect(option)}
                  disabled={showAnswer}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    showCorrect
                      ? "bg-green-100 border-green-500 text-green-800"
                      : showIncorrect
                      ? "bg-red-100 border-red-500 text-red-800"
                      : isSelected
                      ? "bg-blue-100 border-blue-500 text-blue-800"
                      : "bg-gray-50 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  } ${showAnswer ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{decodeHtml(option)}</span>
                    {showCorrect && <span className="text-2xl">✓</span>}
                    {showIncorrect && <span className="text-2xl">✗</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <Button
            onClick={handleNext}
            disabled={!selected || showAnswer}
            className={`w-full py-6 text-lg font-semibold ${
              !selected || showAnswer
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            }`}
          >
            {showAnswer
              ? "Loading next question..."
              : current + 1 === questions.length
              ? "Submit Quiz"
              : "Next Question"}
          </Button>
        </div>
      </div>
    </div>
  );
}
