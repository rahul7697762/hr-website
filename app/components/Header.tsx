import React, { useState, useEffect, useRef } from 'react';
import ThemeToggleButton from './ThemeToggleButton';
import UserProfile from './auth/UserProfile';
import { useAuth } from '../contexts/AuthContext';

type Page = 'home' | 'resumeBuilder' | 'professionalResume' | 'atsTools' | 'auth' | 'dashboard' | 'codePlayground' | 'quiz';

const NavLink: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button onClick={onClick} className="text-gray-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium">
    {children}
  </button>
);

const MobileNavLink: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
    <button onClick={onClick} className="text-left w-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-slate-900 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium">
      {children}
    </button>
  );

const DropdownNavLink: React.FC<{ children: React.ReactNode; isOpen: boolean; onToggle: () => void }> = ({ children, isOpen, onToggle }) => (
  <div className="relative">
    <button 
      onClick={onToggle}
      className="flex items-center text-gray-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium"
    >
      {children}
      <svg className={`ml-1 h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  </div>
);

const DropdownItem: React.FC<{ onClick: () => void; children: React.ReactNode; description?: string }> = ({ onClick, children, description }) => (
  <button
    onClick={onClick}
    className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
  >
    <div className="font-medium">{children}</div>
    {description && <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</div>}
  </button>
);

interface HeaderProps {
    navigateTo: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ navigateTo }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [resumeDropdownOpen, setResumeDropdownOpen] = useState(false);
    const [placementDropdownOpen, setPlacementDropdownOpen] = useState(false);
    const { isAuthenticated } = useAuth();
    const resumeDropdownRef = useRef<HTMLDivElement>(null);
    const placementDropdownRef = useRef<HTMLDivElement>(null);

    const handleMobileNavClick = (page: Page) => {
        navigateTo(page);
        setIsOpen(false);
    }

    const handleResumeBuilderClick = (page: Page) => {
        navigateTo(page);
        setResumeDropdownOpen(false);
    }

    const handlePlacementPrepClick = (page: Page) => {
        navigateTo(page);
        setPlacementDropdownOpen(false);
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (resumeDropdownRef.current && !resumeDropdownRef.current.contains(event.target as Node)) {
                setResumeDropdownOpen(false);
            }
            if (placementDropdownRef.current && !placementDropdownRef.current.contains(event.target as Node)) {
                setPlacementDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="#" onClick={() => navigateTo('home')} className="text-2xl font-bold text-slate-900 dark:text-white">EduAI</a>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              <NavLink onClick={() => navigateTo('home')}>Home</NavLink>
              {isAuthenticated && <NavLink onClick={() => navigateTo('dashboard')}>Dashboard</NavLink>}
              
              {/* Resume Builder Dropdown */}
              <div className="relative" ref={resumeDropdownRef}>
                <DropdownNavLink 
                  isOpen={resumeDropdownOpen} 
                  onToggle={() => setResumeDropdownOpen(!resumeDropdownOpen)}
                >
                  Resume Builder
                </DropdownNavLink>
                
                {resumeDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="py-1">
                      <DropdownItem 
                        onClick={() => handleResumeBuilderClick('resumeBuilder')}
                        description="Simple resume builder with basic templates"
                      >
                        Basic Resume Builder
                      </DropdownItem>
                      <DropdownItem 
                        onClick={() => handleResumeBuilderClick('professionalResume')}
                        description="Advanced professional template with detailed sections"
                      >
                        Professional Resume
                      </DropdownItem>
                    </div>
                  </div>
                )}
              </div>
              
              <NavLink onClick={() => navigateTo('atsTools')}>ATS Tools</NavLink>
              
              {/* Placement Prep Dropdown */}
              <div className="relative" ref={placementDropdownRef}>
                <DropdownNavLink 
                  isOpen={placementDropdownOpen} 
                  onToggle={() => setPlacementDropdownOpen(!placementDropdownOpen)}
                >
                  Placement Prep
                </DropdownNavLink>
                
                {placementDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="py-1">
                      <DropdownItem 
                        onClick={() => handlePlacementPrepClick('quiz')}
                        description="Test your knowledge with interactive quizzes"
                      >
                        📝 Quiz
                      </DropdownItem>
                      <DropdownItem 
                        onClick={() => {}}
                        description="Practice coding problems and algorithms"
                      >
                        💻 Coding Practice
                      </DropdownItem>
                      <DropdownItem 
                        onClick={() => {}}
                        description="Prepare for technical interviews"
                      >
                        🎯 Mock Interview
                      </DropdownItem>
                      <DropdownItem 
                        onClick={() => {}}
                        description="Aptitude and reasoning questions"
                      >
                        🧮 Aptitude Tests
                      </DropdownItem>
                    </div>
                  </div>
                )}
              </div>
              
              <NavLink onClick={() => navigateTo('codePlayground')}>Code Playground</NavLink>
              <NavLink onClick={() => {}}>Games</NavLink>
              <div className="ml-4 flex items-center space-x-3">
                <ThemeToggleButton />
                {isAuthenticated ? (
                  <UserProfile />
                ) : (
                  <button
                    onClick={() => navigateTo('auth')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="-mr-2 flex items-center md:hidden">
            <ThemeToggleButton />
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="ml-2 bg-gray-100 dark:bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-indigo-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavLink onClick={() => handleMobileNavClick('home')}>Home</MobileNavLink>
            {isAuthenticated && <MobileNavLink onClick={() => handleMobileNavClick('dashboard')}>Dashboard</MobileNavLink>}
            
            {/* Resume Builder Section */}
            <div className="px-3 py-2">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Resume Builder</div>
            </div>
            <div className="ml-4 space-y-1">
              <MobileNavLink onClick={() => handleMobileNavClick('resumeBuilder')}>Basic Resume Builder</MobileNavLink>
              <MobileNavLink onClick={() => handleMobileNavClick('professionalResume')}>Professional Resume</MobileNavLink>
            </div>
            
            <MobileNavLink onClick={() => handleMobileNavClick('atsTools')}>ATS Tools</MobileNavLink>
            
            {/* Placement Prep Section */}
            <div className="px-3 py-2">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Placement Prep</div>
            </div>
            <div className="ml-4 space-y-1">
              <MobileNavLink onClick={() => handleMobileNavClick('quiz')}>📝 Quiz</MobileNavLink>
              <MobileNavLink onClick={() => {}}>💻 Coding Practice</MobileNavLink>
              <MobileNavLink onClick={() => {}}>🎯 Mock Interview</MobileNavLink>
              <MobileNavLink onClick={() => {}}>🧮 Aptitude Tests</MobileNavLink>
            </div>
            
            <MobileNavLink onClick={() => handleMobileNavClick('codePlayground')}>Code Playground</MobileNavLink>
            <MobileNavLink onClick={() => {}}>Games</MobileNavLink>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;