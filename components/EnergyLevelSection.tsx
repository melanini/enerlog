import { Zap, Smile, Meh, Frown } from 'lucide-react';

interface EnergyLevelSectionProps {
  energyLevel: number;
}

export function EnergyLevelSection({ energyLevel }: EnergyLevelSectionProps) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (energyLevel / 100) * circumference;

  const getEnergyStatus = (level: number) => {
    if (level >= 80) return { icon: Zap, text: 'Energized', color: 'text-fuchsia-600' };
    if (level >= 60) return { icon: Smile, text: 'Good', color: 'text-orange-600' };
    if (level >= 40) return { icon: Meh, text: 'Moderate', color: 'text-yellow-600' };
    return { icon: Frown, text: 'Low Energy', color: 'text-purple-600' };
  };

  const status = getEnergyStatus(energyLevel);
  const StatusIcon = status.icon;

  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 border-0 shadow-sm">
      <h4 className="text-foreground mb-3">Energy Level</h4>
      
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#f3f4f6"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#953599" />
                <stop offset="100%" stopColor="#ce0069" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg text-foreground">{energyLevel}%</span>
          </div>
        </div>
        
        <div className="mt-2 text-center">
          <div className="text-sm text-muted-foreground flex items-center gap-1 justify-center">
            <StatusIcon className={`w-4 h-4 ${status.color}`} />
            <span>{status.text}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Based on today's check-ins
          </div>
        </div>
      </div>
    </div>
  );
}