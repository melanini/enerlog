import { Heart } from 'lucide-react';
import { Button } from '../ui/button';

interface MoodTrackerWidgetProps {
  onRemove?: () => void;
  isEditing?: boolean;
}

export function MoodTrackerWidget({ onRemove, isEditing }: MoodTrackerWidgetProps) {
  const handleMoodTrack = () => {
    if (isEditing) return;
    alert('Mood tracked! 💙');
  };

  return (
    <div className={`bg-card/50 backdrop-blur-sm rounded-2xl p-4 border-0 shadow-sm relative ${isEditing ? 'ring-2 ring-magenta-200' : ''}`}>
      {isEditing && (
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
        >
          ×
        </button>
      )}
      
      <h4 className="text-foreground mb-3">Mood Tracker</h4>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
          <span className="text-xl">💙</span>
        </div>
        <div className="flex-1">
          <div className="text-sm text-muted-foreground">
            Quick mood check-in
          </div>
        </div>
      </div>
      <Button 
        onClick={handleMoodTrack}
        size="sm"
        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        disabled={isEditing}
      >
        <Heart className="w-4 h-4 mr-2" />
        Track Mood
      </Button>
      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
        <span>📊</span>
        <span>View trends</span>
      </div>
    </div>
  );
}