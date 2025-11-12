import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { code, language } = await request.json();

    if (!code || !language) {
      return NextResponse.json(
        { error: 'Code and language are required' },
        { status: 400 }
      );
    }

    // Create a temporary directory for code execution
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'code-exec-'));
    
    let output = '';
    let error = '';

    try {
      switch (language) {
        case 'javascript':
          output = await executeJavaScript(code);
          break;
        case 'python':
          output = await executePython(code, tempDir);
          break;
        case 'c_cpp':
          output = await executeCpp(code, tempDir);
          break;
        case 'java':
          output = await executeJava(code, tempDir);
          break;
        default:
          error = `Language ${language} is not supported yet`;
      }
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    } finally {
      // Cleanup temp directory
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
      } catch (cleanupErr) {
        console.error('Cleanup error:', cleanupErr);
      }
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

// JavaScript execution (using Node.js)
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

// Python execution
async function executePython(code: string, tempDir: string): Promise<string> {
  const filePath = path.join(tempDir, 'script.py');
  await fs.writeFile(filePath, code);

  try {
    const { stdout, stderr } = await execAsync(`python "${filePath}"`, {
      timeout: 5000, // 5 second timeout
      maxBuffer: 1024 * 1024, // 1MB buffer
    });
    
    if (stderr) {
      throw new Error(stderr);
    }
    
    return stdout || 'Code executed successfully (no output)';
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      throw new Error('Python is not installed. Please install Python to run Python code.');
    }
    throw new Error(`Python Error: ${err.message}`);
  }
}

// C++ execution
async function executeCpp(code: string, tempDir: string): Promise<string> {
  const sourceFile = path.join(tempDir, 'program.cpp');
  const outputFile = path.join(tempDir, 'program.exe');
  
  await fs.writeFile(sourceFile, code);

  try {
    // Compile
    await execAsync(`g++ "${sourceFile}" -o "${outputFile}"`, {
      timeout: 10000,
    });

    // Execute
    const { stdout, stderr } = await execAsync(`"${outputFile}"`, {
      timeout: 5000,
      maxBuffer: 1024 * 1024,
    });

    if (stderr) {
      throw new Error(stderr);
    }

    return stdout || 'Code executed successfully (no output)';
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      throw new Error('g++ (GCC) is not installed. Please install MinGW or GCC to compile C++ code.');
    }
    throw new Error(`C++ Error: ${err.message}`);
  }
}

// Java execution
async function executeJava(code: string, tempDir: string): Promise<string> {
  // Extract class name from code
  const classNameMatch = code.match(/public\s+class\s+(\w+)/);
  const className = classNameMatch ? classNameMatch[1] : 'Main';
  
  const sourceFile = path.join(tempDir, `${className}.java`);
  await fs.writeFile(sourceFile, code);

  try {
    // Compile
    await execAsync(`javac "${sourceFile}"`, {
      timeout: 10000,
      cwd: tempDir,
    });

    // Execute
    const { stdout, stderr } = await execAsync(`java ${className}`, {
      timeout: 5000,
      maxBuffer: 1024 * 1024,
      cwd: tempDir,
    });

    if (stderr) {
      throw new Error(stderr);
    }

    return stdout || 'Code executed successfully (no output)';
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      throw new Error('Java is not installed. Please install JDK to run Java code.');
    }
    throw new Error(`Java Error: ${err.message}`);
  }
}
