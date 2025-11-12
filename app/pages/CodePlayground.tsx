import React, { useState } from "react";
import CodeEditor from "../components/editor/CodeEditor";
import SplitPane from "react-split-pane-next";

export default function CodePlayground() {
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("monokai");
  const [code, setCode] = useState("// JavaScript runs in your browser!\nconsole.log('Hello, World!');\nconsole.log('2 + 2 =', 2 + 2);");
  const [output, setOutput] = useState("");

  const handleRun = async () => {
    setOutput("⏳ Running code...");

    // Client-side execution for JavaScript only
    if (language === "javascript") {
      try {
        // Capture console.log output
        const logs: string[] = [];
        const originalLog = console.log;
        console.log = (...args: any[]) => {
          logs.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' '));
        };

        // Execute code in a try-catch
        try {
          // eslint-disable-next-line no-eval
          eval(code);
          console.log = originalLog;
          setOutput(logs.length > 0 ? logs.join('\n') : '✅ Code executed successfully (no output)');
        } catch (error) {
          console.log = originalLog;
          setOutput(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
        }
      } catch (err) {
        setOutput(`❌ Execution failed: ${err instanceof Error ? err.message : String(err)}`);
      }
      return;
    }

    // For other languages, use Next.js API route
    try {
      const res = await fetch('/api/execute', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });
      
      if (!res.ok) {
        throw new Error('API request failed');
      }
      
      const data = await res.json();
      setOutput(data.output || data.error || "No output");
    } catch (err) {
      setOutput(`⚠️ Error executing ${language} code.\n\n` +
        `Make sure you have the required compiler/interpreter installed:\n` +
        `- Python: Install Python 3.x\n` +
        `- C++: Install MinGW (g++)\n` +
        `- Java: Install JDK\n\n` +
        `Error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gray-950 text-white">
      {/* 🔹 Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-900">
        <div className="flex gap-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-800 text-white rounded px-3 py-1 focus:ring focus:ring-blue-500"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="c_cpp">C++</option>
            <option value="java">Java</option>
            <option value="sql">SQL</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="json">JSON</option>
          </select>

          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="bg-gray-800 text-white rounded px-3 py-1 focus:ring focus:ring-blue-500"
          >
            <option value="monokai">Monokai</option>
            <option value="github">GitHub</option>
            <option value="dracula">Dracula</option>
            <option value="twilight">Twilight</option>
          </select>
        </div>

        <button
          onClick={handleRun}
          className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          ▶️ Run Code
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
          <div className="w-1/2 border-r border-gray-700 overflow-auto resize-x min-w-[30%]">
            <CodeEditor
              language={language}
              theme={theme}
              value={code}
              onChange={setCode}
            />
          </div>
          <div className="flex-1 bg-black text-green-400 p-4 overflow-auto font-mono">
            <pre>{output}</pre>
          </div>
      </div>


    </div>
  );
}
