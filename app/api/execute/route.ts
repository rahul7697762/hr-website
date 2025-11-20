import { NextRequest, NextResponse } from 'next/server';

// Judge0 API configuration
const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || ''; // Add your RapidAPI key in .env.local

// Language ID mapping for Judge0
const LANGUAGE_IDS: Record<string, number> = {
  javascript: 63,      // Node.js (12.14.0)
  python: 71,          // Python (3.8.1)
  java: 62,            // Java (OpenJDK 13.0.1)
  c_cpp: 54,           // C++ (GCC 9.2.0)
  c: 50,               // C (GCC 9.2.0)
  csharp: 51,          // C# (Mono 6.6.0.161)
  typescript: 74,      // TypeScript (3.7.4)
  ruby: 72,            // Ruby (2.7.0)
  golang: 60,          // Go (1.13.5)
  php: 68,             // PHP (7.4.1)
  swift: 83,           // Swift (5.2.3)
  kotlin: 78,          // Kotlin (1.3.70)
  rust: 73,            // Rust (1.40.0)
  scala: 81,           // Scala (2.13.2)
  perl: 85,            // Perl (5.28.1)
  r: 80,               // R (4.0.0)
  haskell: 61,         // Haskell (GHC 8.8.1)
  lua: 64,             // Lua (5.3.5)
  dart: 90,            // Dart (2.19.2)
  elixir: 57,          // Elixir (1.9.4)
  clojure: 86,         // Clojure (1.10.1)
  fsharp: 87,          // F# (.NET Core SDK 3.1.202)
  groovy: 88,          // Groovy (3.0.3)
  objectivec: 79,      // Objective-C (Clang 7.0.1)
  pascal: 67,          // Pascal (FPC 3.0.4)
  fortran: 59,         // Fortran (GFortran 9.2.0)
  assembly_x86: 45,    // Assembly (NASM 2.14.02)
  cobol: 77,           // COBOL (GnuCOBOL 2.2)
  lisp: 55,            // Common Lisp (SBCL 2.0.0)
  d: 56,               // D (DMD 2.089.1)
  erlang: 58,          // Erlang (OTP 22.2)
  ocaml: 65,           // OCaml (4.09.0)
  prolog: 69,          // Prolog (GNU Prolog 1.4.5)
  sql: 82,             // SQL (SQLite 3.27.2)
  vbscript: 84,        // Visual Basic.Net (vbnc 0.0.0.5943)
};

export async function POST(request: NextRequest) {
  try {
    const { code, language, customInput } = await request.json();

    if (!code || !language) {
      return NextResponse.json(
        { error: 'Code and language are required' },
        { status: 400 }
      );
    }

    let output = '';
    let error = '';

    try {
      // Use Judge0 API for all languages
      if (RAPIDAPI_KEY) {
        const result = await executeWithJudge0(code, language, customInput || '');
        output = result.output;
        error = result.error;
      } else {
        // Fallback to local JavaScript execution only
        if (language === 'javascript') {
          output = await executeJavaScript(code);
        } else {
          error = 'Code execution API not configured. Please add RAPIDAPI_KEY to environment variables.';
        }
      }
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    }

    return NextResponse.json({
      output: output || undefined,
      error: error || undefined,
    });
  } catch (err) {
    console.error('Execution error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Execute code using Judge0 API
async function executeWithJudge0(
  code: string,
  language: string,
  stdin: string
): Promise<{ output: string; error: string }> {
  const languageId = LANGUAGE_IDS[language];
  
  if (!languageId) {
    return { output: '', error: `Language ${language} is not supported` };
  }

  try {
    // Submit code for execution
    const submitResponse = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      },
      body: JSON.stringify({
        source_code: code,
        language_id: languageId,
        stdin: stdin || '',
      }),
    });

    if (!submitResponse.ok) {
      throw new Error(`Judge0 API error: ${submitResponse.statusText}`);
    }

    const result = await submitResponse.json();

    // Check for compilation or runtime errors
    if (result.status.id === 6) {
      // Compilation Error
      return { output: '', error: result.compile_output || 'Compilation error' };
    } else if (result.status.id === 11 || result.status.id === 12 || result.status.id === 13) {
      // Runtime Error, Time Limit Exceeded, or other errors
      return { output: '', error: result.stderr || result.status.description };
    }

    // Success
    const output = result.stdout || 'Code executed successfully (no output)';
    const error = result.stderr || '';

    return { output, error };
  } catch (err) {
    return { 
      output: '', 
      error: `Execution Error: ${err instanceof Error ? err.message : String(err)}` 
    };
  }
}

// JavaScript execution (using Node.js) - Fallback for local development
async function executeJavaScript(code: string): Promise<string> {
  try {
    // Capture console.log output
    const logs: string[] = [];
    const originalLog = console.log;
    
    console.log = (...args: any[]) => {
      logs.push(args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' '));
    };

    // Execute code
    // eslint-disable-next-line no-eval
    eval(code);
    
    console.log = originalLog;
    return logs.join('\n') || 'Code executed successfully (no output)';
  } catch (err) {
    throw new Error(`JavaScript Error: ${err instanceof Error ? err.message : String(err)}`);
  }
}


