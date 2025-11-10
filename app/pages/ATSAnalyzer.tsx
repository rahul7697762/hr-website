import React, { useState } from "react";
import {
  uploadResume,
  analyzeResume,
  generateCoverLetter,
  generateInterviewQuestions,
} from "../api/atsAnalyzerApi";

const ATSAnalyzer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedText, setParsedText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState("");

  const handleUpload = async () => {
    if (file) {
      const text = await uploadResume(file);
      setParsedText(text);
    }
  };

  const handleAnalyze = async () => {
    const result = await analyzeResume(parsedText, jobDescription, true);
    setAnalysis(result);
  };

  const handleCoverLetter = async () => {
    const result = await generateCoverLetter(parsedText, jobDescription);
    alert("Generated Cover Letter:\n" + result);
  };

  const handleQuestions = async () => {
    const result = await generateInterviewQuestions(jobDescription);
    alert("Generated Interview Questions:\n" + result);
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center">📄 ATS Resume Analyzer</h1>

      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload} className="bg-indigo-600 text-white px-4 py-2 rounded ml-2">
        Upload Resume
      </button>

      <textarea
        className="w-full mt-4 p-3 border rounded"
        placeholder="Enter Job Description..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <div className="flex gap-3 mt-4">
        <button onClick={handleAnalyze} className="bg-green-600 text-white px-4 py-2 rounded">
          Analyze Resume
        </button>
        <button onClick={handleCoverLetter} className="bg-blue-600 text-white px-4 py-2 rounded">
          Generate Cover Letter
        </button>
        <button onClick={handleQuestions} className="bg-purple-600 text-white px-4 py-2 rounded">
          Interview Qs
        </button>
      </div>

      {analysis && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow">
          <h2 className="font-semibold text-lg">ATS Result:</h2>
          <pre>{analysis}</pre>
        </div>
      )}
    </div>
  );
};

export default ATSAnalyzer;
