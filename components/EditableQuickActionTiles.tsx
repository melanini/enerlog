import { useState } from 'react';
import { Edit3, Plus, X } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { WorkTimerWidget } from './widgets/WorkTimerWidget';
import { HappyMomentWidget } from './widgets/HappyMomentWidget';
import { MoodTrackerWidget } from './widgets/MoodTrackerWidget';
import { WaterReminderWidget } from './widgets/WaterReminderWidget';
import { Widget, WidgetType, WidgetDefinition } from './widgets/types';

const AVAILABLE_WIDGETS: WidgetDefinition[] = [
  {
    type: 'work-timer',
    name: 'Work Timer',
    description: 'Pomodoro-style focus timer',
    icon: '🍅'
  },
  {
    type: 'happy-moment',
    name: 'Happy Collector',
    description: 'Record positive moments',
    icon: '🌼'
  },
  {
    type: 'mood-tracker',
    name: 'Mood Tracker',
    description: 'Quick mood check-ins',
    icon: '💙'
  },
  {
    type: 'water-reminder',
    name: 'Water Reminder',
    description: 'Track water intake',
    icon: '💧'
  }
];

export function EditableQuickActionTiles() {
  const [isEditing, setIsEditing] = useState(false);
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: '1', type: 'work-timer', position: 0 },
    { id: '2', type: 'happy-moment', position: 1 }
  ]);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const addWidget = (type: WidgetType) => {
    const newWidget: Widget = {
      id: Date.now().toString(),
      type,
      position: widgets.length
    };
    setWidgets([...widgets, newWidget]);
    setShowAddDialog(false);
  };

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id));
  };

  const renderWidget = (widget: Widget) => {
    const props = {
      onRemove: () => removeWidget(widget.id),
      isEditing
    };

    switch (widget.type) {
      case 'work-timer':
        return <WorkTimerWidget key={widget.id} {...props} />;
      case 'happy-moment':
        return <HappyMomentWidget key={widget.id} {...props} />;
      case 'mood-tracker':
        return <MoodTrackerWidget key={widget.id} {...props} />;
      case 'water-reminder':
        return <WaterReminderWidget key={widget.id} {...props} />;
      default:
        return null;
    }
  };

  const getAvailableWidgets = () => {
    const usedTypes = widgets.map(w => w.type);
    return AVAILABLE_WIDGETS.filter(w => !usedTypes.includes(w.type));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-foreground">Quick Actions</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
          className="h-8 px-2 text-muted-foreground hover:text-foreground"
        >
          {isEditing ? (
            <>
              <X className="w-4 h-4 mr-1" />
              Done
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4 mr-1" />
              Edit
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {widgets.map(renderWidget)}
        
        {isEditing && (
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <div className="bg-card/30 backdrop-blur-sm rounded-2xl p-4 border-2 border-dashed border-fuchsia-200 flex flex-col items-center justify-center min-h-[180px] cursor-pointer hover:bg-card/40 transition-colors">
                <Plus className="w-8 h-8 text-fuchsia-600 mb-2" />
                <span className="text-sm text-fuchsia-600">Add Widget</span>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Widget</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3">
                {getAvailableWidgets().map(widget => (
                  <button
                    key={widget.type}
                    onClick={() => addWidget(widget.type)}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">{widget.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-foreground">{widget.name}</div>
                      <div className="text-xs text-muted-foreground">{widget.description}</div>
                    </div>
                  </button>
                ))}
                {getAvailableWidgets().length === 0 && (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    All available widgets are already added
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isEditing && (
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Tap the × on widgets to remove them, or add new ones above
          </p>
        </div>
      )}
    </div>
  );
}