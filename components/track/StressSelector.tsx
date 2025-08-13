import { Button } from '../ui/button';
import { Smile, Meh, Frown } from 'lucide-react';
import type { StressLevel } from '../../contexts/DataContext';

interface StressSelectorProps {
  stress: StressLevel;
  onStressChange: (stress: StressLevel) => void;
}

export function StressSelector({ stress, onStressChange }: StressSelectorProps) {
  const stressLevels: Array<{ 
    value: StressLevel; 
    label: string; 
    icon: typeof Smile; 
    description: string;
    color: string;
  }> = [
    { value: 'low', label: 'Low', icon: Smile, description: 'Calm and relaxed', color: 'text-fuchsia-600' },
    { value: 'medium', label: 'Medium', icon: Meh, description: 'Some tension', color: 'text-orange-600' },
    { value: 'high', label: 'High', icon: Frown, description: 'Very stressed', color: 'text-purple-600' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stressLevels.map((stressOption) => {
        const IconComponent = stressOption.icon;
        return (
          <Button
            key={stressOption.value}
            variant={stress === stressOption.value ? 'default' : 'outline'}
            onClick={() => onStressChange(stressOption.value)}
            className={`h-20 flex flex-col items-center gap-2 transition-all duration-200 ${
              stress === stressOption.value
                ? 'bg-magenta-600 text-white border-magenta-600 shadow-md scale-105'
                : 'bg-background hover:bg-accent/50 border-border/50'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              stress === stressOption.value ? 'bg-white/20' : 'bg-muted/30'
            }`}>
              <IconComponent className={`w-5 h-5 ${
                stress === stressOption.value ? 'text-white' : stressOption.color
              }`} />
            </div>
            <div className="text-center">
              <div className="text-sm font-medium">{stressOption.label}</div>
              <div className="text-xs opacity-75">{stressOption.description}</div>
            </div>
          </Button>
        );
      })}
    </div>
  );
}