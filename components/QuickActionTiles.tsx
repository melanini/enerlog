import { useState } from 'react';
import { Play, Pause, Camera, Clock } from 'lucide-react';
import { Button } from './ui/button';

export function QuickActionTiles() {
  const [workTimerActive, setWorkTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(20 * 60); // 20 minutes in seconds

  const handleWorkTimerToggle = () => {
    setWorkTimerActive(!workTimerActive);
    // In a real app, you'd implement the actual timer logic here
  };

  const handleHappyMoment = () => {
    // In a real app, this would open a form or camera
    alert('Happy moment recorded! 🌼');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl p-4 border border-border">
        <h4 className="text-foreground mb-3">Work Time</h4>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
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
          className="w-full"
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

      <div className="bg-white rounded-2xl p-4 border border-border">
        <h4 className="text-foreground mb-3">Happy Collector</h4>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
            <span className="text-xl">🌼</span>
          </div>
          <div className="flex-1">
            <div className="text-sm text-muted-foreground">
              Press to record happy moment
            </div>
          </div>
        </div>
        <Button 
          onClick={handleHappyMoment}
          size="sm"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
        >
          <Camera className="w-4 h-4 mr-2" />
          Record
        </Button>
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <span>📸</span>
          <span>View moments</span>
        </div>
      </div>
    </div>
  );
}