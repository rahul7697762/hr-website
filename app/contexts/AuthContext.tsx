'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export type UserRole = 'student' | 'recruiter' | 'mentor' | 'admin';

interface User {
  user_id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  // Helper function to save user to localStorage
  const saveUserToStorage = (userData: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hr_user', JSON.stringify(userData));
    }
  };

  // Helper function to load user from localStorage
  const loadUserFromStorage = (): User | null => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('hr_user');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (error) {
          console.error('Failed to parse stored user data:', error);
          localStorage.removeItem('hr_user');
        }
      }
    }
    return null;
  };

  // Helper function to clear user from localStorage
  const clearUserFromStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hr_user');
    }
  };

  // Helper function to validate session
  const validateSession = async (): Promise<boolean> => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.log('Session validation failed:', error.message);
        return false;
      }
      return !!user;
    } catch (validationError) {
      console.log('Session validation exception:', validationError);
      return false;
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('Checking for existing session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          return;
        }
        
        if (session && session.user?.email) {
          console.log('Found existing session for user:', session.user.email);
          setToken(session.access_token);
          
          // Fetch user profile from users table with retry logic
          let userData = null;
          let error = null;
          let attempts = 0;
          const maxAttempts = 3;
          
          while (attempts < maxAttempts && !userData) {
            attempts++;
            const result = await supabase
              .from('users')
              .select('*')
              .eq('email', session.user.email)
              .single();
            
            userData = result.data;
            error = result.error;
            
            if (!userData && attempts < maxAttempts) {
              console.log(`User profile fetch attempt ${attempts} failed, retrying...`);
              await new Promise(resolve => setTimeout(resolve, 1000 * attempts)); // Exponential backoff
            }
          }
          
          if (userData && !error) {
            console.log('User profile loaded:', userData.name);
            setUser(userData);
            saveUserToStorage(userData);
          } else {
            console.warn('Failed to load user profile after', attempts, 'attempts. Error:', error?.message || 'No error details');
            console.log('Creating fallback user from session data for:', session.user.email);
            // Create a fallback user object from session data
            const fallbackUser: User = {
              user_id: (session.user.id && parseInt(session.user.id)) || Math.floor(Math.random() * 1000000),
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              role: session.user.user_metadata?.role || 'student',
              created_at: session.user.created_at || new Date().toISOString(),
            };
            setUser(fallbackUser);
            saveUserToStorage(fallbackUser);
          }
        } else {
          console.log('No existing session found, checking localStorage...');
          // Try to load from localStorage as fallback
          const storedUser = loadUserFromStorage();
          if (storedUser) {
            console.log('Found user in localStorage:', storedUser.name);
            // Validate if the session is still valid
            const isValidSession = await validateSession();
            if (isValidSession) {
              setUser(storedUser);
            } else {
              console.log('Stored session is invalid, clearing localStorage');
              clearUserFromStorage();
            }
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (session && session.user?.email) {
        setToken(session.access_token);
        
        // Fetch user profile
        try {
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', session.user.email)
            .single();
          
          if (userData && !error) {
            console.log('User profile loaded on auth change:', userData.name);
            setUser(userData);
            saveUserToStorage(userData);
          } else {
            console.warn('User profile not found in database, creating fallback user. Error:', error?.message || 'No error details');
            // Create a fallback user object
            const fallbackUser: User = {
              user_id: (session.user.id && parseInt(session.user.id)) || Math.floor(Math.random() * 1000000),
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              role: session.user.user_metadata?.role || 'student',
              created_at: session.user.created_at || new Date().toISOString(),
            };
            setUser(fallbackUser);
            saveUserToStorage(fallbackUser);
          }
        } catch (profileError) {
          console.error('Exception while fetching user profile on auth change:', profileError);
          // Create a fallback user object
          const fallbackUser: User = {
            user_id: (session.user.id && parseInt(session.user.id)) || Math.floor(Math.random() * 1000000),
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            role: session.user.user_metadata?.role || 'student',
            created_at: session.user.created_at || new Date().toISOString(),
          };
          setUser(fallbackUser);
          saveUserToStorage(fallbackUser);
        }
      } else {
        console.log('Session ended, clearing user data');
        setUser(null);
        setToken(null);
        clearUserFromStorage();
      }
      
      // Set loading to false after any auth state change
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Provide helpful error messages
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and click the confirmation link. Or disable email confirmation in Supabase Dashboard → Authentication → Providers → Email');
        }
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password');
        }
        throw error;
      }

      if (data.session) {
        setToken(data.session.access_token);
        
        // Fetch user profile from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();
        
        if (userError) {
          console.warn('User profile not found in database during login, creating basic user. Error:', userError?.message || 'No error details');
          // Create a basic user object if profile doesn't exist
          const basicUser: User = {
            user_id: 0,
            name: data.user?.user_metadata?.name || email.split('@')[0],
            email: email,
            role: data.user?.user_metadata?.role || 'student',
            created_at: new Date().toISOString(),
          };
          setUser(basicUser);
          saveUserToStorage(basicUser);
          return;
        }
        
        if (userData) {
          setUser(userData);
          saveUserToStorage(userData);
        }
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';
      throw new Error(errorMessage);
    }
  };

  const register = async (name: string, email: string, password: string, role: string = 'student') => {
    try {
      // Sign up with Supabase Auth with email confirmation disabled for development
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
          data: {
            name,
            role,
          }
        }
      });

      if (authError) {
        // Provide more helpful error messages
        if (authError.message.includes('invalid')) {
          throw new Error('Please use a valid email address (e.g., user@example.com)');
        }
        throw authError;
      }

      if (authData.user) {
        // Create user profile in users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .insert([
            {
              email,
              name,
              role,
              password_hash: 'managed_by_supabase_auth',
            }
          ])
          .select()
          .single();

        if (userError) {
          // If user already exists in table, fetch it
          if (userError.code === '23505') {
            const { data: existingUser } = await supabase
              .from('users')
              .select('*')
              .eq('email', email)
              .single();
            
            if (existingUser) {
              if (authData.session) {
                setToken(authData.session.access_token);
                setUser(existingUser);
                saveUserToStorage(existingUser);
              }
              return;
            }
          }
          throw userError;
        }

        if (authData.session) {
          setToken(authData.session.access_token);
          setUser(userData);
          saveUserToStorage(userData);
        } else {
          // Email confirmation required
          throw new Error('Please check your email to confirm your account');
        }
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed';
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out user...');
      await supabase.auth.signOut();
      setUser(null);
      setToken(null);
      clearUserFromStorage();
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local state even if logout fails
      setUser(null);
      setToken(null);
      clearUserFromStorage();
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};