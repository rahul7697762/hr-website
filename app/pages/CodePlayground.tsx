'use client';

import { useState, useEffect, useCallback } from "react";
import AceEditorWrapper from "../components/editor/AceEditorWrapper";
import ControlBar from "../components/editor/ControlBar";
import CustomInputBox from "../components/editor/CustomInputBox";
import OutputConsole from "../components/editor/OutputConsole";
import LanguageChangeDialog from "../components/editor/LanguageChangeDialog";
import { getTemplate, getDefaultTemplate } from "../utils/codeTemplates";

export default function CodePlayground() {
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [code, setCode] = useState("// JavaScript runs in your browser!\nconsole.log('Hello, World!');\nconsole.log('2 + 2 =', 2 + 2);");
  const [output, setOutput] = useState("");
  const [activeTab, setActiveTab] = useState<'program' | 'debug'>('program');
  const [customInput, setCustomInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  
  // Template tracking state
  const [originalTemplate, setOriginalTemplate] = useState<string>("");
  const [showLanguageChangeDialog, setShowLanguageChangeDialog] = useState(false);
  const [pendingLanguage, setPendingLanguage] = useState<string | null>(null);

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // State for smooth template loading transition
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);

  // Load template for a specific language
  const loadTemplate = useCallback((newLanguage: string) => {
    // Trigger fade-out effect
    setIsLoadingTemplate(true);
    
    // Small delay for smooth transition
    setTimeout(() => {
      const template = getTemplate(newLanguage);
      setCode(template);
      setOriginalTemplate(template);
      setLanguage(newLanguage);
      setOutput(""); // Clear output when loading new template
      setActiveTab('program'); // Switch to program tab when loading template
      
      // Trigger fade-in effect
      setTimeout(() => {
        setIsLoadingTemplate(false);
      }, 50);
    }, 150);
  }, []);

  // Handle language change with modification detection
  const handleLanguageChange = useCallback((newLanguage: string) => {
    // Check if code has been modified from the original template
    const isModified = code !== originalTemplate;
    
    if (isModified) {
      // Show confirmation dialog if code has been modified
      setPendingLanguage(newLanguage);
      setShowLanguageChangeDialog(true);
    } else {
      // Load template directly if code is unmodified
      loadTemplate(newLanguage);
    }
  }, [code, originalTemplate, loadTemplate]);

  const handleRun = useCallback(async () => {
    if (isRunning) return; // Prevent multiple simultaneous executions
    
    setIsRunning(true);
    setOutput(""); // Clear previous output
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
      setIsRunning(false);
      return;
    }

    // For other languages, use Next.js API route
    try {
      const res = await fetch('/api/execute', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, customInput }),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'API request failed' }));
        throw new Error(errorData.error || 'API request failed');
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
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, language, code, customInput]);

  // Load default JavaScript template on component mount
  useEffect(() => {
    const defaultTemplate = getDefaultTemplate();
    setCode(defaultTemplate);
    setOriginalTemplate(defaultTemplate);
  }, []); // Empty dependency array ensures this runs only once on mount

  // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to run code
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+Enter (Windows/Linux) or Cmd+Enter (Mac)
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        handleRun();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleRun]);

  // Handler for confirming language change
  const handleConfirmLanguageChange = useCallback(() => {
    if (pendingLanguage) {
      loadTemplate(pendingLanguage);
    }
    setShowLanguageChangeDialog(false);
    setPendingLanguage(null);
  }, [pendingLanguage, loadTemplate]);

  // Handler for canceling language change
  const handleCancelLanguageChange = useCallback(() => {
    setShowLanguageChangeDialog(false);
    setPendingLanguage(null);
  }, []);

  return (
    <div className={`h-screen w-full flex flex-col ${theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      {/* Language Change Confirmation Dialog */}
      <LanguageChangeDialog
        isOpen={showLanguageChangeDialog}
        currentLanguage={language}
        targetLanguage={pendingLanguage || language}
        theme={theme}
        onConfirm={handleConfirmLanguageChange}
        onCancel={handleCancelLanguageChange}
      />

      {/* Control Bar */}
      <ControlBar
        activeTab={activeTab}
        language={language}
        theme={theme}
        onTabChange={setActiveTab}
        onLanguageChange={handleLanguageChange}
        onThemeToggle={handleThemeToggle}
      />

      {/* Main Content Area - Grid Layout */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_400px] lg:grid-cols-[1fr_450px] overflow-hidden transition-all duration-300">
        {/* Editor Panel */}
        <div 
          id="editor-panel"
          role="tabpanel"
          aria-labelledby="program-tab"
          className={`min-h-[400px] md:min-h-0 border-b md:border-b-0 md:border-r transition-all duration-200 ${
            isLoadingTemplate ? 'opacity-70' : 'opacity-100'
          } ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}
        >
          <AceEditorWrapper
            code={code}
            language={language}
            theme={theme}
            onChange={setCode}
          />
        </div>

        {/* Side Panel */}
        <div className="flex flex-col w-full transition-all duration-300">
          {/* Custom Input Box */}
          <div className={`h-[150px] md:h-[200px] border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
            <CustomInputBox
              value={customInput}
              onChange={setCustomInput}
              theme={theme}
            />
          </div>

          {/* Output Console */}
          <div className="flex-1 overflow-hidden min-h-[200px] md:min-h-0">
            <OutputConsole
              output={output}
              theme={theme}
            />
          </div>

          {/* Compile & Run Button */}
          <div className={`p-3 md:p-4 border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-100'}`}>
            <button
              onClick={handleRun}
              disabled={isRunning}
              aria-label="Compile and run code (Ctrl+Enter or Cmd+Enter)"
              title="Compile & Run (Ctrl+Enter or Cmd+Enter)"
              className={`w-full px-3 py-2 md:px-4 md:py-2 rounded-md text-sm md:text-base font-medium transition-colors touch-manipulation ${
                isRunning
                  ? 'bg-gray-400 cursor-not-allowed text-gray-700'
                  : 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white'
              }`}
            >
              {isRunning ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 md:h-5 md:w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Running...
                </span>
              ) : (
                'Compile & Run'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
