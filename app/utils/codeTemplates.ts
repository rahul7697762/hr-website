// Code template storage for the code playground

export interface CodeTemplate {
  code: string;
  description: string;
}

export const CODE_TEMPLATES: Record<string, CodeTemplate> = {
  javascript: {
    code: `// JavaScript runs in your browser!
console.log('Hello, World!');

// Variables and operations
const name = 'Developer';
const result = 2 + 2;

console.log(\`Welcome, \${name}!\`);
console.log('2 + 2 =', result);`,
    description: 'Basic JavaScript template with variables and console output'
  },
  
  python: {
    code: `# Python 3 - Simple and powerful
print('Hello, World!')

# Variables and operations
name = 'Developer'
result = 2 + 2

print(f'Welcome, {name}!')
print(f'2 + 2 = {result}')`,
    description: 'Basic Python template with variables and print statements'
  },
  
  java: {
    code: `public class Main {
    public static void main(String[] args) {
        // Java - Object-oriented programming
        System.out.println("Hello, World!");
        
        // Variables and operations
        String name = "Developer";
        int result = 2 + 2;
        
        System.out.println("Welcome, " + name + "!");
        System.out.println("2 + 2 = " + result);
    }
}`,
    description: 'Basic Java template with main method and console output'
  },
  
  c_cpp: {
    code: `#include <iostream>
#include <string>
using namespace std;

int main() {
    // C++ - Fast and powerful
    cout << "Hello, World!" << endl;
    
    // Variables and operations
    string name = "Developer";
    int result = 2 + 2;
    
    cout << "Welcome, " << name << "!" << endl;
    cout << "2 + 2 = " << result << endl;
    
    return 0;
}`,
    description: 'Basic C++ template with iostream and console output'
  },
  
  typescript: {
    code: `// TypeScript - JavaScript with types
console.log('Hello, World!');

// Variables with type annotations
const userName: string = 'Developer';
const result: number = 2 + 2;

console.log(\`Welcome, \${userName}!\`);
console.log('2 + 2 =', result);`,
    description: 'Basic TypeScript template with type annotations'
  },
  
  ruby: {
    code: `# Ruby - Elegant and expressive
puts 'Hello, World!'

# Variables and operations
name = 'Developer'
result = 2 + 2

puts "Welcome, #{name}!"
puts "2 + 2 = #{result}"`,
    description: 'Basic Ruby template with variables and puts statements'
  },
  
  golang: {
    code: `package main

import "fmt"

func main() {
    // Go - Simple, fast, and reliable
    fmt.Println("Hello, World!")
    
    // Variables and operations
    name := "Developer"
    result := 2 + 2
    
    fmt.Printf("Welcome, %s!\\n", name)
    fmt.Printf("2 + 2 = %d\\n", result)
}`,
    description: 'Basic Go template with fmt package and console output'
  },
  
  c: {
    code: `#include <stdio.h>

int main() {
    // C - The foundation of modern programming
    printf("Hello, World!\\n");
    
    // Variables and operations
    char name[] = "Developer";
    int result = 2 + 2;
    
    printf("Welcome, %s!\\n", name);
    printf("2 + 2 = %d\\n", result);
    
    return 0;
}`,
    description: 'Basic C template with stdio and printf statements'
  }
};

/**
 * Get the code template for a specific language
 * @param language - The language identifier
 * @returns The template code string, or a generic template if language not found
 */
export function getTemplate(language: string): string {
  const template = CODE_TEMPLATES[language];
  if (!template) {
    return `// ${language} template\n// Start coding here...\n`;
  }
  return template.code;
}

/**
 * Get the default template (JavaScript)
 * @returns The JavaScript template code string
 */
export function getDefaultTemplate(): string {
  return CODE_TEMPLATES.javascript.code;
}
