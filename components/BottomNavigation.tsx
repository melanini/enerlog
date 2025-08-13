import { useState } from 'react';
import { Home, TrendingUp, BarChart3, User, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { QuickLogPopup } from './QuickLogPopup';

interface BottomNavigationProps {
  activeScreen: string;
  onScreenChange: (screen: string) => void;
}

export function BottomNavigation({ activeScreen, onScreenChange }: BottomNavigationProps) {
  const [showQuickLog, setShowQuickLog] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'track', label: 'Track', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleQuickLogOpen = () => {
    setShowQuickLog(true);
  };

  const handleQuickLogClose = () => {
    setShowQuickLog(false);
  };

  const handleNavigateToFullTracking = () => {
    onScreenChange('track');
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border/50 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-around py-3 px-4">
          {navItems.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = activeScreen === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onScreenChange(item.id)}
                className={`flex flex-col items-center gap-1 p-3 transition-all duration-200 ${
                  isActive 
                    ? 'text-magenta-600 scale-105' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <IconComponent className={`h-5 w-5 ${isActive ? 'stroke-2' : ''}`} />
                <span className={`text-xs ${isActive ? 'font-medium' : ''}`}>{item.label}</span>
              </button>
            );
          })}
          
          {/* Floating Action Button */}
          <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2">
            <Button
              size="icon"
              className="w-14 h-14 rounded-full bg-gradient-to-r from-magenta-600 to-magenta-700 hover:from-magenta-700 hover:to-magenta-700 text-white shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-2xl"
              onClick={handleQuickLogOpen}
            >
              <Plus className="h-6 w-6 stroke-2" />
            </Button>
          </div>
        </div>
      </div>

      <QuickLogPopup
        isOpen={showQuickLog}
        onClose={handleQuickLogClose}
        onNavigateToFullTracking={handleNavigateToFullTracking}
      />
    </>
  );
}