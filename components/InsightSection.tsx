import { X, TrendingUp, Lightbulb } from 'lucide-react';

interface InsightSectionProps {
  showInsight: boolean;
  setShowInsight: (show: boolean) => void;
  checkInsCompleted?: number;
  avgEnergyLevel?: number;
}

export function InsightSection({ showInsight, setShowInsight, checkInsCompleted = 1, avgEnergyLevel = 66 }: InsightSectionProps) {
  if (!showInsight) {
    return (
      <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 border-0 shadow-sm">
        <h4 className="text-foreground mb-3">Your Progress</h4>
        
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-foreground mb-1">{checkInsCompleted}/4 check-ins today</div>
            <div className="text-xs text-muted-foreground">
              Avg. energy: {avgEnergyLevel}% this week
            </div>
          </div>
        </div>
        
        <div className="mt-3">
          <button 
            onClick={() => setShowInsight(true)}
            className="text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3 py-2 border border-purple-200 rounded-lg transition-colors"
          >
            Show insights
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 border-0 shadow-sm relative">
      <button 
        onClick={() => setShowInsight(false)}
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
      >
        <X className="w-3 h-3" />
      </button>
      
      <h4 className="text-foreground mb-3">Daily Insight</h4>
      
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-4 h-4 text-orange-600" />
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed">
          You sleep better after being in nature. 10 mins outside today?
        </div>
      </div>
      
      <div className="mt-3 flex gap-2">
        <button className="text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50 px-3 py-2 border border-orange-200 rounded-lg transition-colors">
          More like this
        </button>
        <button className="text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 px-3 py-2 border border-border rounded-lg transition-colors">
          Not helpful
        </button>
      </div>
    </div>
  );
}