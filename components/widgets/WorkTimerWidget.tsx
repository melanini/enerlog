import { useState } from 'react';
import { Play, Pause, Clock } from 'lucide-react';
import { Button } from '../ui/button';

interface WorkTimerWidgetProps {
  onRemove?: () => void;
  isEditing?: boolean;
}

export function WorkTimerWidget({ onRemove, isEditing }: WorkTimerWidgetProps) {
  const [workTimerActive, setWorkTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(20 * 60); // 20 minutes in seconds

  const handleWorkTimerToggle = () => {
    if (isEditing) return;
    setWorkTimerActive(!workTimerActive);
    // In a real app, you'd implement the actual timer logic here
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`bg-card/80 backdrop-blur-sm rounded-2xl p-4 border-0 shadow-sm relative ${isEditing ? 'ring-2 ring-magenta-200' : ''}`}>
      {isEditing && (
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
        >
          ×
        </button>
      )}
      
      <h4 className="text-foreground mb-3">Work Time</h4>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
          <span className="text-xl">🍅</span>
        </div>
        <div className="flex-1">
          <div className="text-sm text-muted-foreground">
            {workTimerActive ? formatTime(timeRemaining) : 'Press to start 20 min timer'}
          </div>
        </div>
      </div>
      <Button 
        onClick={handleWorkTimerToggle}
        variant={workTimerActive ? "destructive" : "default"}
        size="sm"
        className="w-full bg-orange-600 hover:bg-orange-700"
        disabled={isEditing}
      >
        {workTimerActive ? (
          <>
            <Pause className="w-4 h-4 mr-2" />
            Pause
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2" />
            Start
          </>
        )}
      </Button>
      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="w-3 h-3" />
        <span>View history</span>
      </div>
    </div>
  );
}