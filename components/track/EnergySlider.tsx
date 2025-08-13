import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';
import { ReactNode } from 'react';

interface EnergySliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon: ReactNode;
  description: string;
}

export function EnergySlider({ label, value, onChange, icon, description }: EnergySliderProps) {
  const handleValueChange = (values: number[]) => {
    onChange(values[0]);
  };

  const getEnergyLevel = (value: number) => {
    if (value >= 80) return { label: 'Very High', color: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300' };
    if (value >= 60) return { label: 'High', color: 'bg-orange-100 text-orange-800 border-orange-300' };
    if (value >= 40) return { label: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
    if (value >= 20) return { label: 'Low', color: 'bg-purple-100 text-purple-800 border-purple-300' };
    return { label: 'Very Low', color: 'bg-red-100 text-red-800 border-red-300' };
  };

  const energyLevel = getEnergyLevel(value);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-muted/30 rounded-full flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h4 className="font-medium text-foreground">{label}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={energyLevel.color}>
            {energyLevel.label}
          </Badge>
          <Badge variant="outline" className="font-mono">
            {value}%
          </Badge>
        </div>
      </div>
      
      <div className="px-2">
        <Slider
          value={[value]}
          onValueChange={handleValueChange}
          max={100}
          min={0}
          step={5}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}