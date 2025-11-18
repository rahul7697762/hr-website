// src/app/quiz/admin/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Quiz = { quiz_id: number; title: string; description?: string };
type Question = { question_id: number; question: string; choices?: string[]; difficulty?: string };

// AI Generation states
type AIGenerationMode = 'quiz' | 'questions' | null;

export default function AdminPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  // form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [qText, setQText] = useState("");
  const [qChoices, setQChoices] = useState<string>(""); // comma separated
  const [qCorrect, setQCorrect] = useState("");
  const [qDifficulty, setQDifficulty] = useState("easy");
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  // AI Generation states
  const [aiMode, setAiMode] = useState<AIGenerationMode>(null);
  const [aiTopic, setAiTopic] = useState("");
  const [aiNumQuestions, setAiNumQuestions] = useState("5");
  const [aiDifficulty, setAiDifficulty] = useState("medium");
  const [aiProvider, setAiProvider] = useState<'auto' | 'openai' | 'gemini'>('auto');
  const [aiGenerating, setAiGenerating] = useState(false);

  useEffect(() => {
    loadQuizzes();
    loadQuestions();
  }, []);

  async function loadQuizzes() {
    const { data } = await supabase.from("quizzes").select("*").order("created_at", { ascending: false });
    setQuizzes((data || []) as Quiz[]);
  }

  async function loadQuestions() {
    const { data } = await supabase.from("questions").select("*").order("created_at", { ascending: false }).limit(200);
    setQuestions((data || []) as Question[]);
  }

  async function handleCreateQuiz(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/quiz/admin/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(json));
      alert("Quiz created");
      setTitle(""); setDescription("");
      loadQuizzes();
    } catch (err) {
      console.error(err);
      alert("Failed to create quiz");
    } finally { setLoading(false); }
  }

  async function handleAddQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (!qText.trim()) return alert("Enter question text");
    setLoading(true);
    try {
      const payload = {
        question: qText,
        choices: qChoices ? qChoices.split(",").map(s => s.trim()) : [],
        correct_answer: qCorrect || null,
        difficulty: qDifficulty
      };
      const res = await fetch("/api/quiz/admin/add-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(json));
      alert("Question added");
      setQText(""); setQChoices(""); setQCorrect("");
      loadQuestions();
    } catch (err) {
      console.error(err);
      alert("Failed to add question");
    } finally { setLoading(false); }
  }

  async function handleAttach() {
    if (!selectedQuiz || !selectedQuestion) return alert("Select quiz and question");
    setLoading(true);
    try {
      const res = await fetch("/api/quiz/admin/attach-question", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ quizId: selectedQuiz, questionId: selectedQuestion })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(json));
      alert("Question attached to quiz");
    } catch (err) {
      console.error(err);
      alert("Failed to attach");
    } finally { setLoading(false); }
  }

  async function handleDeleteQuiz(quizId: number) {
    if (!confirm("Delete quiz and all mappings?")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/quiz/admin/delete", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ quizId })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(json));
      alert("Deleted");
      loadQuizzes();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    } finally { setLoading(false); }
  }

  async function handleAIGenerate() {
    if (!aiTopic.trim()) return alert("Enter a topic for AI generation");
    setAiGenerating(true);
    try {
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: aiTopic,
          numQuestions: parseInt(aiNumQuestions) || 5,
          difficulty: aiDifficulty,
          provider: aiProvider
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "AI generation failed");
      
      alert(`✨ AI Generated Successfully!\n${json.message || 'Quiz and questions created'}\n\nProvider: ${json.aiProvider || 'Unknown'}`);
      setAiTopic("");
      loadQuizzes();
      loadQuestions();
    } catch (err: any) {
      console.error(err);
      alert(`AI Generation failed: ${err.message}`);
    } finally {
      setAiGenerating(false);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-4">
        <a href="/admin_dashboard" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
          ← Back to Admin Dashboard
        </a>
      </div>
      <h1 className="text-2xl font-bold mb-4">🤖 AI-Powered Quiz Admin Dashboard</h1>

      {/* AI Generation Section */}
      <section className="mb-6 p-6 border-2 border-purple-300 dark:border-purple-700 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-3xl">✨</span>
          <h2 className="text-xl font-bold text-purple-900 dark:text-purple-100">AI Quiz Generator</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <input
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              placeholder="Enter topic (e.g., 'JavaScript Basics', 'Machine Learning')"
              className="w-full p-3 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none"
            />
            
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Questions</label>
                <input
                  type="number"
                  value={aiNumQuestions}
                  onChange={(e) => setAiNumQuestions(e.target.value)}
                  min="1"
                  max="20"
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Difficulty</label>
                <select
                  value={aiDifficulty}
                  onChange={(e) => setAiDifficulty(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">AI Provider</label>
                <select
                  value={aiProvider}
                  onChange={(e) => setAiProvider(e.target.value as any)}
                  className="w-full p-2 border rounded"
                >
                  <option value="auto">🤖 Auto (Smart)</option>
                  <option value="openai">🟢 OpenAI</option>
                  <option value="gemini">🔵 Gemini</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              <strong>🤖 AI will generate:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Complete quiz with title & description</li>
                <li>{aiNumQuestions} questions with multiple choices</li>
                <li>Correct answers automatically marked</li>
                <li>Questions automatically attached to quiz</li>
              </ul>
              
              <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                <strong>Provider Mode:</strong>
                {aiProvider === 'auto' && ' Tries OpenAI first, falls back to Gemini'}
                {aiProvider === 'openai' && ' Uses OpenAI GPT-3.5'}
                {aiProvider === 'gemini' && ' Uses Google Gemini Pro'}
              </div>
            </div>
            
            <button
              onClick={handleAIGenerate}
              disabled={aiGenerating || !aiTopic.trim()}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
            >
              {aiGenerating ? (
                <>
                  <span className="animate-spin">⚙️</span>
                  Generating with AI...
                </>
              ) : (
                <>
                  <span>✨</span>
                  Generate Quiz with AI
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Manual Creation Section */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Or Create Manually</h2>
      </div>

      <section className="grid grid-cols-2 gap-6">
        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Create Quiz</h2>
          <form onSubmit={handleCreateQuiz} className="space-y-2">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Quiz title" className="w-full p-2 border rounded" />
            <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Description" className="w-full p-2 border rounded h-20" />
            <div className="flex gap-2">
              <button className="px-3 py-2 bg-blue-600 text-white rounded" disabled={loading}>{loading ? "..." : "Create"}</button>
            </div>
          </form>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Add Question (manual)</h2>
          <form onSubmit={handleAddQuestion} className="space-y-2">
            <textarea value={qText} onChange={(e)=>setQText(e.target.value)} placeholder="Question text" className="w-full p-2 border rounded h-20" />
            <input value={qChoices} onChange={(e)=>setQChoices(e.target.value)} placeholder="Choices (comma separated)" className="w-full p-2 border rounded" />
            <input value={qCorrect} onChange={(e)=>setQCorrect(e.target.value)} placeholder="Correct answer (exact match)" className="w-full p-2 border rounded" />
            <select value={qDifficulty} onChange={(e)=>setQDifficulty(e.target.value)} className="w-full p-2 border rounded">
              <option value="easy">easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
            </select>
            <div className="flex gap-2">
              <button className="px-3 py-2 bg-green-600 text-white rounded" disabled={loading}>{loading ? "..." : "Add Question"}</button>
            </div>
          </form>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-6">
        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Attach Question to Quiz</h2>
          <div className="space-y-2">
            <select value={selectedQuiz ?? ""} onChange={(e)=>setSelectedQuiz(Number(e.target.value) || null)} className="w-full p-2 border rounded">
              <option value="">Select quiz</option>
              {quizzes.map(q => <option key={q.quiz_id} value={q.quiz_id}>{q.title}</option>)}
            </select>

            <select value={selectedQuestion ?? ""} onChange={(e)=>setSelectedQuestion(Number(e.target.value) || null)} className="w-full p-2 border rounded">
              <option value="">Select question</option>
              {questions.map(q => <option key={q.question_id} value={q.question_id}>{q.question.slice(0,80)}</option>)}
            </select>

            <div className="flex gap-2">
              <button onClick={handleAttach} className="px-3 py-2 bg-indigo-600 text-white rounded">Attach</button>
            </div>
          </div>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Quizzes</h2>
          <div className="space-y-2 max-h-64 overflow-auto">
            {quizzes.map(q => (
              <QuizItem key={q.quiz_id} quiz={q} onDelete={handleDeleteQuiz} onRefresh={loadQuizzes} />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-6">
        <AttemptsPanel />
        <LeaderboardPanel />
      </section>
    </div>
  );
}

/* ---------- Sub components: AttemptsPanel & LeaderboardPanel (client) ---------- */

function AttemptsPanel() {
  const [quizId, setQuizId] = useState<string>("");
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadAttempts() {
    if (!quizId) return alert("Enter quizId");
    setLoading(true);
    try {
      const res = await fetch(`/api/quiz/admin/attempts?quizId=${quizId}`);
      const json = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(json));
      setAttempts(json);
    } catch (err) {
      console.error(err);
      alert("Failed to load attempts");
    } finally { setLoading(false); }
  }

  return (
    <div className="p-4 border rounded">
      <h2 className="font-semibold mb-2">View Attempts</h2>
      <div className="flex gap-2 mb-2">
        <input value={quizId} onChange={(e)=>setQuizId(e.target.value)} placeholder="quiz_id" className="p-2 border rounded" />
        <button onClick={loadAttempts} className="px-3 py-2 bg-sky-600 text-white rounded" disabled={loading}>{loading ? "..." : "Load"}</button>
      </div>
      <div className="max-h-64 overflow-auto">
        {attempts.length === 0 && <div className="text-sm text-muted-foreground">No attempts</div>}
        {attempts.map(a => (
          <div key={a.attempt_id} className="p-2 border rounded mb-2">
            <div><strong>User:</strong> {a.user_id}</div>
            <div><strong>Score:</strong> {a.score}/{a.max_score}</div>
            <div><strong>Duration:</strong> {a.duration_sec}s</div>
            <div><strong>At:</strong> {new Date(a.created_at).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeaderboardPanel() {
  const [quizId, setQuizId] = useState<string>("");
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    if (!quizId) return alert("Enter quizId");
    setLoading(true);
    try {
      const res = await fetch(`/api/quiz/${quizId}/leaderboard`);
      const json = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(json));
      setRows(json);
    } catch (err) {
      console.error(err);
      alert("Failed");
    } finally { setLoading(false); }
  }

  return (
    <div className="p-4 border rounded">
      <h2 className="font-semibold mb-2">Leaderboard</h2>
      <div className="flex gap-2 mb-2">
        <input value={quizId} onChange={(e)=>setQuizId(e.target.value)} placeholder="quiz_id" className="p-2 border rounded" />
        <button onClick={load} className="px-3 py-2 bg-emerald-600 text-white rounded" disabled={loading}>{loading ? "..." : "Load"}</button>
      </div>
      <div className="max-h-64 overflow-auto">
        {rows.length === 0 && <div className="text-sm text-muted-foreground">No rows</div>}
        {rows.map((r, i) => (
          <div key={i} className="p-2 border rounded mb-2 flex justify-between">
            <div>
              <div className="font-medium">User: {r.user_id}</div>
              <div className="text-xs">Score: {r.score}</div>
            </div>
            <div className="text-xs">{new Date(r.created_at).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- QuizItem Component with Share Functionality ---------- */

function QuizItem({ quiz, onDelete, onRefresh }: { quiz: Quiz; onDelete: (id: number) => void; onRefresh: () => void }) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  async function loadStudents() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('user_id, name, email')
        .eq('role', 'student')
        .order('name');
      
      if (error) throw error;
      setStudents(data || []);
    } catch (err) {
      console.error('Failed to load students:', err);
      alert('Failed to load students');
    }
  }

  function handleShareClick() {
    setShowShareModal(true);
    loadStudents();
  }

  function toggleStudent(userId: number) {
    if (selectedStudents.includes(userId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== userId));
    } else {
      setSelectedStudents([...selectedStudents, userId]);
    }
  }

  function selectAll() {
    const filtered = students.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSelectedStudents(filtered.map(s => s.user_id));
  }

  function deselectAll() {
    setSelectedStudents([]);
  }

  async function handleShare() {
    if (selectedStudents.length === 0) {
      return alert('Please select at least one student');
    }

    setLoading(true);
    try {
      // Create quiz assignments for selected students
      const assignments = selectedStudents.map(userId => ({
        quiz_id: quiz.quiz_id,
        user_id: userId,
        assigned_at: new Date().toISOString(),
        status: 'assigned'
      }));

      const { error } = await supabase
        .from('quiz_assignments')
        .upsert(assignments, { onConflict: 'quiz_id,user_id' });

      if (error) throw error;

      alert(`✅ Quiz shared with ${selectedStudents.length} student(s)!`);
      setShowShareModal(false);
      setSelectedStudents([]);
    } catch (err: any) {
      console.error('Failed to share quiz:', err);
      alert(`Failed to share quiz: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="p-2 border rounded flex justify-between items-center">
        <div className="flex-1">
          <div className="font-medium">{quiz.title}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{quiz.description}</div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleShareClick}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
            📤 Share
          </button>
          <button
            onClick={() => onDelete(quiz.quiz_id)}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Share Quiz: {quiz.title}
                </h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4">
              {/* Search and Actions */}
              <div className="mb-4 space-y-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search students by name or email..."
                  className="w-full p-2 border rounded dark:bg-slate-700 dark:border-gray-600"
                />
                <div className="flex gap-2">
                  <button
                    onClick={selectAll}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Select All ({filteredStudents.length})
                  </button>
                  <button
                    onClick={deselectAll}
                    className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                  >
                    Deselect All
                  </button>
                  <div className="flex-1 text-right text-sm text-gray-600 dark:text-gray-400 py-1">
                    Selected: {selectedStudents.length}
                  </div>
                </div>
              </div>

              {/* Students List */}
              <div className="max-h-96 overflow-y-auto space-y-2 mb-4">
                {filteredStudents.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No students found' : 'No students available'}
                  </div>
                ) : (
                  filteredStudents.map(student => (
                    <div
                      key={student.user_id}
                      onClick={() => toggleStudent(student.user_id)}
                      className={`p-3 border rounded cursor-pointer transition-colors ${
                        selectedStudents.includes(student.user_id)
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            selectedStudents.includes(student.user_id)
                              ? 'border-blue-600 bg-blue-600'
                              : 'border-gray-400'
                          }`}
                        >
                          {selectedStudents.includes(student.user_id) && (
                            <span className="text-white text-xs">✓</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {student.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t dark:border-gray-700 flex justify-end gap-2">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                disabled={loading || selectedStudents.length === 0}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sharing...' : `Share with ${selectedStudents.length} Student(s)`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
