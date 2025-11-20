"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Quiz = { quiz_id: number; title: string; description?: string };
type Question = { question_id: number; question: string; choices?: string[]; difficulty?: string };

// AI Generation types
type AIGenerationMode = "topic" | "company" | "custom";

export default function AdminPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  // manual form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [qText, setQText] = useState("");
  const [qChoices, setQChoices] = useState<string>("");
  const [qCorrect, setQCorrect] = useState("");
  const [qDifficulty, setQDifficulty] = useState("easy");
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  // AI Generator states
  const [aiModeType, setAiModeType] = useState<AIGenerationMode>("topic");
  const [aiTopic, setAiTopic] = useState("");
  const [aiCompanyList, setAiCompanyList] = useState<string[]>([]);
  const [aiCustomPrompt, setAiCustomPrompt] = useState("");
  const [aiNumQuestions, setAiNumQuestions] = useState("5");
  const [aiDifficulty, setAiDifficulty] = useState("medium");
  const [aiProvider, setAiProvider] = useState<'auto' | 'openai' | 'gemini'>("auto");
  const [aiGenerating, setAiGenerating] = useState(false);

  useEffect(() => {
    loadQuizzes();
    loadQuestions();
  }, []);

  async function loadQuizzes() {
    const { data } = await supabase
      .from("quizzes")
      .select("*")
      .order("created_at", { ascending: false });

    setQuizzes((data || []) as Quiz[]);
  }

  async function loadQuestions() {
    const { data } = await supabase
      .from("questions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    setQuestions((data || []) as Question[]);
  }

  async function handleCreateQuiz(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/quiz/admin/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(json));

      alert("Quiz created");
      setTitle("");
      setDescription("");
      loadQuizzes();
    } catch (err) {
      console.error(err);
      alert("Failed to create quiz");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (!qText.trim()) return alert("Enter question text");
    setLoading(true);
    try {
      const payload = {
        question: qText,
        choices: qChoices ? qChoices.split(",").map((s) => s.trim()) : [],
        correct_answer: qCorrect || null,
        difficulty: qDifficulty,
      };

      const res = await fetch("/api/quiz/admin/add-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(json));

      alert("Question added");
      setQText("");
      setQChoices("");
      setQCorrect("");
      loadQuestions();
    } catch (err) {
      console.error(err);
      alert("Failed to add question");
    } finally {
      setLoading(false);
    }
  }

  async function handleAttach() {
    if (!selectedQuiz || !selectedQuestion) return alert("Select quiz and question");

    setLoading(true);
    try {
      const res = await fetch("/api/quiz/admin/attach-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId: selectedQuiz, questionId: selectedQuestion }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(json));

      alert("Question attached to quiz");
    } catch (err) {
      console.error(err);
      alert("Failed to attach");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteQuiz(quizId: number) {
    if (!confirm("Delete quiz and all mappings?")) return;

    setLoading(true);
    try {
      const res = await fetch("/api/quiz/admin/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(json));

      alert("Deleted");
      loadQuizzes();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  }

  // 🔥 UPDATED FULL AI GENERATION HANDLER (supports all 3 modes)
  async function handleAIGenerate() {
    if (aiModeType === "topic" && !aiTopic.trim()) {
      return alert("Enter a topic");
    }

    if (aiModeType === "company" && aiCompanyList.length === 0) {
      return alert("Select at least one company");
    }

    if (aiModeType === "custom" && !aiCustomPrompt.trim()) {
      return alert("Write a custom prompt");
    }

    setAiGenerating(true);

    try {
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: aiModeType,
          topic: aiTopic,
          companies: aiCompanyList,
          customPrompt: aiCustomPrompt,
          numQuestions: parseInt(aiNumQuestions),
          difficulty: aiDifficulty,
          provider: aiProvider,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "AI generation failed");

      alert(`✨ Quiz Generated Successfully!`);

      setAiTopic("");
      setAiCompanyList([]);
      setAiCustomPrompt("");

      loadQuizzes();
      loadQuestions();
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setAiGenerating(false);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-4">
        <a
          href="/admin_dashboard"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
        >
          ← Back to Admin Dashboard
        </a>
      </div>

      <h1 className="text-2xl font-bold mb-4">🤖 AI-Powered Quiz Admin Dashboard</h1>

      {/* ------------------- AI GENERATION SECTION ------------------- */}
      <section className="mb-6 p-6 border-2 border-purple-300 dark:border-purple-700 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-3xl">✨</span>
          <h2 className="text-xl font-bold text-purple-900 dark:text-purple-100">
            AI Quiz Generator
          </h2>
        </div>

        {/* AI Mode Selector */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setAiModeType("topic")}
            className={`px-3 py-2 rounded ${
              aiModeType === "topic" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Topic Based
          </button>

          <button
            onClick={() => setAiModeType("company")}
            className={`px-3 py-2 rounded ${
              aiModeType === "company" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Company Based
          </button>

          <button
            onClick={() => setAiModeType("custom")}
            className={`px-3 py-2 rounded ${
              aiModeType === "custom" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Custom Prompt
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* LEFT SIDE */}
          <div className="space-y-3">
            {/* Topic Mode */}
            {aiModeType === "topic" && (
              <input
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="Enter topic (e.g. Java, DSA, ML...)"
                className="w-full p-3 border-2 border-purple-300 rounded-lg"
              />
            )}

            {/* Company Mode */}
            {aiModeType === "company" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Companies</label>
                <select
                  multiple
                  value={aiCompanyList}
                  onChange={(e) =>
                    setAiCompanyList(
                      Array.from(e.target.selectedOptions, (o) => o.value)
                    )
                  }
                  className="w-full p-3 border rounded h-32"
                >
                  <option value="Amazon">Amazon</option>
                  <option value="Google">Google</option>
                  <option value="Meta">Meta</option>
                  <option value="Microsoft">Microsoft</option>
                  <option value="Apple">Apple</option>
                  <option value="Netflix">Netflix</option>
                  <option value="Adobe">Adobe</option>
                  <option value="Oracle">Oracle</option>
                  <option value="TCS">TCS</option>
                  <option value="Infosys">Infosys</option>
                </select>

                <p className="text-xs text-gray-500">
                  Hold CTRL to select multiple companies.
                </p>
              </div>
            )}

            {/* Custom Prompt */}
            {aiModeType === "custom" && (
              <textarea
                value={aiCustomPrompt}
                onChange={(e) => setAiCustomPrompt(e.target.value)}
                placeholder="Write custom quiz generation instructions..."
                className="w-full p-3 border-2 rounded-lg h-32"
              />
            )}

            {/* Common DIFFICULTY + NUMBER + PROVIDER */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Questions
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={aiNumQuestions}
                  onChange={(e) => setAiNumQuestions(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Difficulty
                </label>
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
                <label className="block text-sm font-medium mb-1">
                  AI Provider
                </label>
                <select
                  value={aiProvider}
                  onChange={(e) => setAiProvider(e.target.value as any)}
                  className="w-full p-2 border rounded"
                >
                  <option value="auto">🤖 Auto</option>
                  <option value="openai">🟢 OpenAI</option>
                  <option value="gemini">🔵 Gemini</option>
                </select>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE INFO + BUTTON */}
          <div className="space-y-3">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <strong>🤖 AI will generate:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Quiz title & description</li>
                <li>{aiNumQuestions} MCQs</li>
                <li>Correct answers included</li>
                <li>Attached automatically</li>
              </ul>

              <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 text-xs rounded">
                Mode:{" "}
                {aiModeType === "topic" && "Topic Based"}
                {aiModeType === "company" && "Company Interview Based"}
                {aiModeType === "custom" && "Custom Prompt Mode"}
              </div>
            </div>

            <button
              onClick={handleAIGenerate}
              disabled={aiGenerating}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90"
            >
              {aiGenerating ? (
                <>
                  <span className="animate-spin">⚙️</span> Generating...
                </>
              ) : (
                <>
                  <span>✨</span> Generate Quiz with AI
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ------------------- MANUAL CREATION SECTION ------------------- */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          Or Create Manually
        </h2>
      </div>

      <section className="grid grid-cols-2 gap-6">
        {/* Create Quiz */}
        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Create Quiz</h2>
          <form onSubmit={handleCreateQuiz} className="space-y-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Quiz title"
              className="w-full p-2 border rounded"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full p-2 border rounded h-20"
            />
            <button
              className="px-3 py-2 bg-blue-600 text-white rounded"
              disabled={loading}
            >
              {loading ? "..." : "Create"}
            </button>
          </form>
        </div>

        {/* Add Question Manually */}
        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Add Question</h2>
          <form onSubmit={handleAddQuestion} className="space-y-2">
            <textarea
              value={qText}
              onChange={(e) => setQText(e.target.value)}
              placeholder="Question text"
              className="w-full p-2 border rounded h-20"
            />

            <input
              value={qChoices}
              onChange={(e) => setQChoices(e.target.value)}
              placeholder="Choices (comma separated)"
              className="w-full p-2 border rounded"
            />

            <input
              value={qCorrect}
              onChange={(e) => setQCorrect(e.target.value)}
              placeholder="Correct answer"
              className="w-full p-2 border rounded"
            />

            <select
              value={qDifficulty}
              onChange={(e) => setQDifficulty(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="easy">easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
            </select>

            <button
              className="px-3 py-2 bg-green-600 text-white rounded"
              disabled={loading}
            >
              {loading ? "..." : "Add Question"}
            </button>
          </form>
        </div>
      </section>

      {/* ------------------- ATTACH QUESTION SECTION ------------------- */}
      <section className="mt-6 grid grid-cols-2 gap-6">
        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Attach Question to Quiz</h2>

          <select
            value={selectedQuiz ?? ""}
            onChange={(e) => setSelectedQuiz(Number(e.target.value) || null)}
            className="w-full p-2 border rounded mb-2"
          >
            <option value="">Select quiz</option>
            {quizzes.map((q) => (
              <option key={q.quiz_id} value={q.quiz_id}>
                {q.title}
              </option>
            ))}
          </select>

          <select
            value={selectedQuestion ?? ""}
            onChange={(e) =>
              setSelectedQuestion(Number(e.target.value) || null)
            }
            className="w-full p-2 border rounded mb-2"
          >
            <option value="">Select question</option>
            {questions.map((q) => (
              <option key={q.question_id} value={q.question_id}>
                {q.question.slice(0, 80)}
              </option>
            ))}
          </select>

          <button
            onClick={handleAttach}
            className="px-3 py-2 bg-indigo-600 text-white rounded"
          >
            Attach
          </button>
        </div>

        {/* Quizzes list */}
        <div className="p-4 border rounded max-h-64 overflow-auto">
          <h2 className="font-semibold mb-2">Quizzes</h2>
          <div className="space-y-2">
            {quizzes.map((q) => (
              <QuizItem
                key={q.quiz_id}
                quiz={q}
                onDelete={handleDeleteQuiz}
                onRefresh={loadQuizzes}
              />
            ))}
          </div>
        </div>
      </section>
      {/* ------------------- ATTEMPTS + LEADERBOARD ------------------- */}
      <section className="mt-6 grid grid-cols-2 gap-6">
        <AttemptsPanel />
        <LeaderboardPanel />
      </section>
    </div>
  );
}

/* ============================================================
   ATTEMPTS PANEL
============================================================ */
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
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 border rounded">
      <h2 className="font-semibold mb-2">View Attempts</h2>

      <div className="flex gap-2 mb-2">
        <input
          value={quizId}
          onChange={(e) => setQuizId(e.target.value)}
          placeholder="quiz_id"
          className="p-2 border rounded"
        />
        <button
          onClick={loadAttempts}
          className="px-3 py-2 bg-sky-600 text-white rounded"
          disabled={loading}
        >
          {loading ? "..." : "Load"}
        </button>
      </div>

      <div className="max-h-64 overflow-auto">
        {attempts.length === 0 && (
          <div className="text-sm text-gray-500">No attempts</div>
        )}

        {attempts.map((a) => (
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

/* ============================================================
   LEADERBOARD PANEL
============================================================ */
function LeaderboardPanel() {
  const [quizId, setQuizId] = useState<string>("");
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadLeaderboard() {
    if (!quizId) return alert("Enter quizId");

    setLoading(true);
    try {
      const res = await fetch(`/api/quiz/${quizId}/leaderboard`);
      const json = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(json));
      setRows(json);
    } catch (err) {
      console.error(err);
      alert("Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 border rounded">
      <h2 className="font-semibold mb-2">Leaderboard</h2>

      <div className="flex gap-2 mb-2">
        <input
          value={quizId}
          onChange={(e) => setQuizId(e.target.value)}
          placeholder="quiz_id"
          className="p-2 border rounded"
        />

        <button
          onClick={loadLeaderboard}
          className="px-3 py-2 bg-emerald-600 text-white rounded"
          disabled={loading}
        >
          {loading ? "..." : "Load"}
        </button>
      </div>

      <div className="max-h-64 overflow-auto">
        {rows.length === 0 && (
          <div className="text-sm text-gray-500">No rows</div>
        )}

        {rows.map((r, i) => (
          <div key={i} className="p-2 border rounded mb-2 flex justify-between">
            <div>
              <div className="font-medium">User: {r.user_id}</div>
              <div className="text-xs">Score: {r.score}</div>
            </div>
            <div className="text-xs">
              {new Date(r.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   QUIZ ITEM WITH SHARE MODAL
============================================================ */
function QuizItem({ quiz, onDelete, onRefresh }: { quiz: Quiz; onDelete: (quizId: number) => void; onRefresh: () => void }) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  async function loadStudents() {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("user_id, name, email")
        .eq("role", "student")
        .order("name");

      if (error) throw error;
      setStudents(data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load students");
    }
  }

  function toggleStudent(id: number) {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function selectAll() {
    const filtered = students.filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSelectedStudents(filtered.map((s) => s.user_id));
  }

  function deselectAll() {
    setSelectedStudents([]);
  }

  async function handleShare() {
    if (selectedStudents.length === 0) return alert("Select students");

    setLoading(true);
    try {
      const assignments = selectedStudents.map((userId) => ({
        quiz_id: quiz.quiz_id,
        user_id: userId,
        assigned_at: new Date().toISOString(),
        status: "assigned",
      }));

      const { error } = await supabase
        .from("quiz_assignments")
        .upsert(assignments, { onConflict: "quiz_id,user_id" });

      if (error) throw error;

      alert(`Shared with ${selectedStudents.length} students`);
      setShowShareModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to share quiz");
    } finally {
      setLoading(false);
    }
  }

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* QUIZ ROW */}
      <div className="p-2 border rounded flex justify-between items-center">
          <div className="flex-1">
            <div className="font-medium">{quiz.title}</div>
            <div className="text-xs text-gray-500">{quiz.description}</div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowShareModal(true);
                loadStudents();
              }}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm"
            >
              📤 Share
            </button>

            <button
              onClick={() => onDelete(quiz.quiz_id)}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm"
            >
              Delete
            </button>
          </div>
      </div>

      {/* SHARE MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* HEADER */}
            <div className="p-4 border-b flex justify-between">
              <h3 className="text-lg font-semibold">
                Share Quiz: {quiz.title}
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-500"
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="p-4">
              <input
                type="text"
                placeholder="Search students..."
                className="w-full p-2 border rounded mb-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <div className="flex gap-2 mb-3">
                <button
                  onClick={selectAll}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                >
                  Select All ({filteredStudents.length})
                </button>

                <button
                  onClick={deselectAll}
                  className="px-3 py-1 bg-gray-600 text-white rounded text-sm"
                >
                  Deselect All
                </button>
              </div>

              <div className="max-h-80 overflow-auto space-y-2">
                {filteredStudents.map((s) => (
                  <div
                    key={s.user_id}
                    onClick={() => toggleStudent(s.user_id)}
                    className={`p-3 border rounded cursor-pointer ${
                      selectedStudents.includes(s.user_id)
                        ? "bg-blue-50 border-blue-600"
                        : ""
                    }`}
                  >
                    <div className="font-medium">{s.name}</div>
                    <div className="text-sm text-gray-500">{s.email}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* FOOTER */}
            <div className="p-4 border-t flex justify-end gap-2">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleShare}
                className="px-4 py-2 bg-green-600 text-white rounded"
                disabled={loading}
              >
                {loading ? "Sharing..." : `Share (${selectedStudents.length})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
