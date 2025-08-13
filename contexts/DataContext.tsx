import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isSupabaseConfigured } from '../utils/supabase/info';

// Types for our data structures
export interface CheckInEntry {
  id: string;
  timestamp: string;
  type: 'morning' | 'midday' | 'afternoon' | 'evening';
  cognitiveClarity: number;
  physicalEnergy: number;
}

export interface TrackingEntry {
  id: string;
  timestamp: string;
  mood: string;
  stressLevel: 'low' | 'medium' | 'high';
  cognitiveClarity: number;
  physicalEnergy: number;
  lifestyleFactors: {
    sleepHours: number;
    waterIntake: number;
    caffeineIntake: number;
    exerciseMinutes: number;
    screenTime: number;
    socialTime: number;
    outdoorTime: number;
    stressLevel: number;
    [key: string]: any;
  };
  notes?: string;
}

export interface HappyMoment {
  id: string;
  timestamp: string;
  description: string;
}

export interface PomodoroSession {
  id: string;
  timestamp: string;
  duration: number;
  completed: boolean;
}

interface DataContextType {
  // Data arrays
  checkInEntries: CheckInEntry[];
  trackingEntries: TrackingEntry[];
  happyMoments: HappyMoment[];
  pomodoroSessions: PomodoroSession[];
  
  // Data manipulation functions
  addCheckInEntry: (entry: Omit<CheckInEntry, 'id' | 'timestamp'>) => Promise<void>;
  addTrackingEntry: (entry: Omit<TrackingEntry, 'id' | 'timestamp'>) => Promise<void>;
  addHappyMoment: (description: string) => Promise<void>;
  addPomodoroSession: (session: Omit<PomodoroSession, 'id' | 'timestamp'>) => Promise<void>;
  
  // Utility functions
  loadMockData: () => void;
  clearAllData: () => void;
  getWeeklyData: () => TrackingEntry[];
  getMonthlyData: () => TrackingEntry[];
  
  // Connection status
  isOnline: boolean;
  syncStatus: 'synced' | 'pending' | 'error';
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Simplified mock data generator
const generateMockData = () => {
  const now = new Date();
  const mockData = {
    checkInEntries: [] as CheckInEntry[],
    trackingEntries: [] as TrackingEntry[],
    happyMoments: [] as HappyMoment[],
    pomodoroSessions: [] as PomodoroSession[]
  };

  const moods = ['😊', '😔', '😴', '😤', '🥰', '😌', '🤔', '😅'];
  const stressLevels: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
  const checkInTypes: ('morning' | 'midday' | 'afternoon' | 'evening')[] = ['morning', 'midday', 'afternoon', 'evening'];

  // Generate 14 days of data (reduced from 30 for performance)
  for (let i = 0; i < 14; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Add 2 check-ins per day
    for (let j = 0; j < 2; j++) {
      const checkInTime = new Date(date);
      checkInTime.setHours(8 + j * 6);
      
      mockData.checkInEntries.push({
        id: `checkin-${i}-${j}`,
        timestamp: checkInTime.toISOString(),
        type: checkInTypes[j % checkInTypes.length],
        cognitiveClarity: Math.floor(Math.random() * 12) + 1,
        physicalEnergy: Math.floor(Math.random() * 12) + 1,
      });
    }

    // Add tracking entry (80% chance)
    if (Math.random() > 0.2) {
      const trackingTime = new Date(date);
      trackingTime.setHours(Math.floor(Math.random() * 12) + 8);
      
      mockData.trackingEntries.push({
        id: `tracking-${i}`,
        timestamp: trackingTime.toISOString(),
        mood: moods[Math.floor(Math.random() * moods.length)],
        stressLevel: stressLevels[Math.floor(Math.random() * stressLevels.length)],
        cognitiveClarity: Math.floor(Math.random() * 100),
        physicalEnergy: Math.floor(Math.random() * 100),
        lifestyleFactors: {
          sleepHours: Math.floor(Math.random() * 3) + 6,
          waterIntake: Math.floor(Math.random() * 6) + 2,
          caffeineIntake: Math.floor(Math.random() * 3),
          exerciseMinutes: Math.floor(Math.random() * 90),
          screenTime: Math.floor(Math.random() * 6) + 2,
          socialTime: Math.floor(Math.random() * 4),
          outdoorTime: Math.floor(Math.random() * 3),
          stressLevel: Math.floor(Math.random() * 10) + 1,
        },
        notes: Math.random() > 0.8 ? 'Great day!' : undefined,
      });
    }

    // Add happy moment (30% chance)
    if (Math.random() > 0.7) {
      const happyMoments = [
        'Had coffee with a friend',
        'Finished a project',
        'Enjoyed the sunset',
        'Received a kind message'
      ];
      
      mockData.happyMoments.push({
        id: `happy-${i}`,
        timestamp: date.toISOString(),
        description: happyMoments[Math.floor(Math.random() * happyMoments.length)],
      });
    }
  }

  return mockData;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [checkInEntries, setCheckInEntries] = useState<CheckInEntry[]>([]);
  const [trackingEntries, setTrackingEntries] = useState<TrackingEntry[]>([]);
  const [happyMoments, setHappyMoments] = useState<HappyMoment[]>([]);
  const [pomodoroSessions, setPomodoroSessions] = useState<PomodoroSession[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'pending' | 'error'>('synced');
  const [isInitialized, setIsInitialized] = useState(false);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load data from localStorage on mount
  useEffect(() => {
    if (isInitialized) return;

    try {
      const savedCheckIns = localStorage.getItem('energyApp_checkIns');
      const savedTracking = localStorage.getItem('energyApp_tracking');
      const savedHappyMoments = localStorage.getItem('energyApp_happyMoments');
      const savedPomodoros = localStorage.getItem('energyApp_pomodoros');

      let hasData = false;

      if (savedCheckIns) {
        setCheckInEntries(JSON.parse(savedCheckIns));
        hasData = true;
      }
      if (savedTracking) {
        setTrackingEntries(JSON.parse(savedTracking));
        hasData = true;
      }
      if (savedHappyMoments) {
        setHappyMoments(JSON.parse(savedHappyMoments));
      }
      if (savedPomodoros) {
        setPomodoroSessions(JSON.parse(savedPomodoros));
      }

      // If no data exists, load mock data
      if (!hasData) {
        const mockData = generateMockData();
        setCheckInEntries(mockData.checkInEntries);
        setTrackingEntries(mockData.trackingEntries);
        setHappyMoments(mockData.happyMoments);
        setPomodoroSessions(mockData.pomodoroSessions);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Load mock data as fallback
      const mockData = generateMockData();
      setCheckInEntries(mockData.checkInEntries);
      setTrackingEntries(mockData.trackingEntries);
      setHappyMoments(mockData.happyMoments);
      setPomodoroSessions(mockData.pomodoroSessions);
    } finally {
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Save to localStorage with debouncing
  useEffect(() => {
    if (!isInitialized) return;
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem('energyApp_checkIns', JSON.stringify(checkInEntries));
      } catch (error) {
        console.error('Error saving check-ins:', error);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [checkInEntries, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem('energyApp_tracking', JSON.stringify(trackingEntries));
      } catch (error) {
        console.error('Error saving tracking entries:', error);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [trackingEntries, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem('energyApp_happyMoments', JSON.stringify(happyMoments));
      } catch (error) {
        console.error('Error saving happy moments:', error);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [happyMoments, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem('energyApp_pomodoros', JSON.stringify(pomodoroSessions));
      } catch (error) {
        console.error('Error saving pomodoro sessions:', error);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [pomodoroSessions, isInitialized]);

  // Data manipulation functions
  const addCheckInEntry = async (entry: Omit<CheckInEntry, 'id' | 'timestamp'>) => {
    const newEntry: CheckInEntry = {
      ...entry,
      id: `checkin-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
    };

    setCheckInEntries(prev => [newEntry, ...prev.slice(0, 99)]); // Keep only last 100 entries
  };

  const addTrackingEntry = async (entry: Omit<TrackingEntry, 'id' | 'timestamp'>) => {
    const newEntry: TrackingEntry = {
      ...entry,
      id: `tracking-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
    };

    setTrackingEntries(prev => [newEntry, ...prev.slice(0, 99)]); // Keep only last 100 entries
  };

  const addHappyMoment = async (description: string) => {
    const newMoment: HappyMoment = {
      id: `happy-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      description,
    };

    setHappyMoments(prev => [newMoment, ...prev.slice(0, 49)]); // Keep only last 50 entries
  };

  const addPomodoroSession = async (session: Omit<PomodoroSession, 'id' | 'timestamp'>) => {
    const newSession: PomodoroSession = {
      ...session,
      id: `pomodoro-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
    };

    setPomodoroSessions(prev => [newSession, ...prev.slice(0, 99)]); // Keep only last 100 entries
  };

  const loadMockData = () => {
    const mockData = generateMockData();
    setCheckInEntries(mockData.checkInEntries);
    setTrackingEntries(mockData.trackingEntries);
    setHappyMoments(mockData.happyMoments);
    setPomodoroSessions(mockData.pomodoroSessions);
  };

  const clearAllData = () => {
    setCheckInEntries([]);
    setTrackingEntries([]);
    setHappyMoments([]);
    setPomodoroSessions([]);
    
    try {
      localStorage.removeItem('energyApp_checkIns');
      localStorage.removeItem('energyApp_tracking');
      localStorage.removeItem('energyApp_happyMoments');
      localStorage.removeItem('energyApp_pomodoros');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  };

  const getWeeklyData = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return trackingEntries.filter(entry => 
      new Date(entry.timestamp) >= oneWeekAgo
    );
  };

  const getMonthlyData = () => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
    
    return trackingEntries.filter(entry => 
      new Date(entry.timestamp) >= oneMonthAgo
    );
  };

  const value: DataContextType = {
    checkInEntries,
    trackingEntries,
    happyMoments,
    pomodoroSessions,
    addCheckInEntry,
    addTrackingEntry,
    addHappyMoment,
    addPomodoroSession,
    loadMockData,
    clearAllData,
    getWeeklyData,
    getMonthlyData,
    isOnline,
    syncStatus,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};