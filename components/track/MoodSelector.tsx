import { Button } from '../ui/button';
import type { Mood } from '../../contexts/DataContext';

interface MoodSelectorProps {
  mood: Mood;
  onMoodChange: (mood: Mood) => void;
}

export function MoodSelector({ mood, onMoodChange }: MoodSelectorProps) {
  const moods: Array<{ value: Mood; label: string; emoji: string }> = [
    { value: 'calm', label: 'Calm', emoji: '😌' },
    { value: 'content', label: 'Content', emoji: '😊' },
    { value: 'joyful', label: 'Joyful', emoji: '😄' },
    { value: 'sad', label: 'Sad', emoji: '😢' },
    { value: 'annoyed', label: 'Annoyed', emoji: '😤' },
    { value: 'anxious', label: 'Anxious', emoji: '😰' },
    { value: 'confused', label: 'Confused', emoji: '😕' },
    { value: 'angry', label: 'Angry', emoji: '😠' },
    { value: 'scared', label: 'Scared', emoji: '😨' },
    { value: 'exhausted', label: 'Exhausted', emoji: '😴' },
    { value: 'other', label: 'Other', emoji: '' },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {moods.map((moodOption) => (
        <Button
          key={moodOption.value}
          variant={mood === moodOption.value ? 'default' : 'outline'}
          onClick={() => onMoodChange(moodOption.value)}
          className={`h-12 flex flex-col items-center gap-1 transition-all duration-200 text-xs ${
            mood === moodOption.value
              ? 'bg-magenta-600 text-white border-magenta-600 shadow-md scale-105'
              : 'bg-background hover:bg-accent/50 border-border/50'
          }`}
        >
          {moodOption.emoji && <span className="text-sm">{moodOption.emoji}</span>}
          <span className="font-medium leading-tight">{moodOption.label}</span>
        </Button>
      ))}
    </div>
  );
}