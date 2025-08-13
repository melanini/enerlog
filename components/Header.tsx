import { useState, useEffect } from 'react';
import { Settings, User, Bell, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { DemoModeIndicator } from './DemoModeIndicator';
import { appConfig, isDevelopment } from '../utils/supabase/info';

export function Header() {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }));
      setCurrentDate(now.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'short', 
        day: 'numeric' 
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getUserDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.email) return user.email.split('@')[0];
    return 'there';
  };

  return (
    <div className="relative">
      {/* Demo Mode Indicator - only in development */}
      {isDevelopment && (
        <div className="absolute top-2 right-2 z-10">
          <DemoModeIndicator />
        </div>
      )}
      
      <div className="flex items-center justify-between p-6 bg-card/50 backdrop-blur-sm">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-medium text-foreground">
                {getGreeting()}, {getUserDisplayName()}! 👋
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-muted-foreground">
                  {currentDate} • {currentTime}
                </p>
                {user?.id === 'demo-user' && (
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    Demo User
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-magenta-600 rounded-full"></span>
          </Button>
          
          <Button variant="ghost" size="sm">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}