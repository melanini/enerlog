import { Camera } from 'lucide-react';
import { Button } from '../ui/button';

interface HappyMomentWidgetProps {
  onRemove?: () => void;
  isEditing?: boolean;
}

export function HappyMomentWidget({ onRemove, isEditing }: HappyMomentWidgetProps) {
  const handleHappyMoment = () => {
    if (isEditing) return;
    // In a real app, this would open a form or camera
    alert('Happy moment recorded! 🌼');
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
        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
        disabled={isEditing}
      >
        <Camera className="w-4 h-4 mr-2" />
        Record
      </Button>
      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
        <span>📸</span>
        <span>View moments</span>
      </div>
    </div>
  );
}