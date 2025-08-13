import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isSupabaseConfigured, isDevelopment } from '../utils/supabase/info';

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loginAsDemo: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo user for when Supabase is not configured
const DEMO_USER: User = {
  id: 'demo-user',
  email: 'demo@energytracker.com',
  name: 'Demo User',
  avatar: undefined,
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if user was previously logged in
        const savedUser = localStorage.getItem('energyApp_user');
        const savedAuthState = localStorage.getItem('energyApp_authState');
        
        if (savedUser && savedAuthState === 'authenticated') {
          setUser(JSON.parse(savedUser));
        }

        // Log app mode for developers
        if (isDevelopment) {
          const mode = isSupabaseConfigured() ? 'Backend Mode' : 'Demo Mode';
          console.log(`🔐 Authentication: ${mode} initialized`);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      if (isSupabaseConfigured()) {
        // TODO: Implement Supabase authentication
        // const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        // if (error) throw error;
        // setUser(data.user);
        
        // For now, simulate successful login
        const simulatedUser: User = {
          id: `user-${Date.now()}`,
          email,
          name: email.split('@')[0],
        };
        
        setUser(simulatedUser);
        localStorage.setItem('energyApp_user', JSON.stringify(simulatedUser));
        localStorage.setItem('energyApp_authState', 'authenticated');
        
        return { success: true };
      } else {
        // Local authentication for demo mode
        if (email && password.length >= 6) {
          const localUser: User = {
            id: `local-${Date.now()}`,
            email,
            name: email.split('@')[0],
          };
          
          setUser(localUser);
          localStorage.setItem('energyApp_user', JSON.stringify(localUser));
          localStorage.setItem('energyApp_authState', 'authenticated');
          
          if (isDevelopment) {
            console.log('✅ Demo mode login successful');
          }
          
          return { success: true };
        } else {
          return { success: false, error: 'Please enter a valid email and password (6+ characters)' };
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      if (isSupabaseConfigured()) {
        // TODO: Implement Supabase registration
        // const { data, error } = await supabase.auth.signUp({ email, password });
        // if (error) throw error;
        
        // For now, simulate successful signup
        const simulatedUser: User = {
          id: `user-${Date.now()}`,
          email,
          name: name || email.split('@')[0],
        };
        
        setUser(simulatedUser);
        localStorage.setItem('energyApp_user', JSON.stringify(simulatedUser));
        localStorage.setItem('energyApp_authState', 'authenticated');
        
        return { success: true };
      } else {
        // Local registration for demo mode
        if (email && password.length >= 6) {
          const localUser: User = {
            id: `local-${Date.now()}`,
            email,
            name: name || email.split('@')[0],
          };
          
          setUser(localUser);
          localStorage.setItem('energyApp_user', JSON.stringify(localUser));
          localStorage.setItem('energyApp_authState', 'authenticated');
          
          if (isDevelopment) {
            console.log('✅ Demo mode signup successful');
          }
          
          return { success: true };
        } else {
          return { success: false, error: 'Please enter a valid email and password (6+ characters)' };
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      if (isSupabaseConfigured()) {
        // TODO: Implement Supabase logout
        // await supabase.auth.signOut();
      }
      
      setUser(null);
      localStorage.removeItem('energyApp_user');
      localStorage.removeItem('energyApp_authState');
      
      if (isDevelopment) {
        console.log('👋 User logged out');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const loginAsDemo = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setUser(DEMO_USER);
      localStorage.setItem('energyApp_user', JSON.stringify(DEMO_USER));
      localStorage.setItem('energyApp_authState', 'authenticated');
      
      if (isDevelopment) {
        console.log('🎯 Demo user logged in');
      }
    } catch (error) {
      console.error('Demo login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    try {
      if (!user) return;

      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('energyApp_user', JSON.stringify(updatedUser));

      if (isSupabaseConfigured()) {
        // TODO: Update profile in Supabase
        // await supabase.auth.updateUser({ data: updates });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    loginAsDemo,
    updateProfile,
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