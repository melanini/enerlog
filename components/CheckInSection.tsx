import { useState } from 'react';
import { X, Check, ChevronLeft, Clock, Brain, Dumbbell, Frown, Zap } from 'lucide-react';
import { Slider } from './ui/slider';
import { Button } from './ui/button';

interface CheckInSectionProps {
  cognitiveClarity: number;
  setCognitiveClarity: (value: number) => void;
  physicalEnergy: number;
  setPhysicalEnergy: (value: number) => void;
  checkInsCompleted: number;
  cognitiveClaritySelected: boolean;
  setCognitiveClaritySelected: (selected: boolean) => void;
  onSubmit: () => void;
}

export function CheckInSection({ 
  cognitiveClarity, 
  setCognitiveClarity, 
  physicalEnergy, 
  setPhysicalEnergy, 
  checkInsCompleted,
  cognitiveClaritySelected,
  setCognitiveClaritySelected,
  onSubmit 
}: CheckInSectionProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const progressDots = Array.from({ length: 4 }, (_, i) => i < checkInsCompleted);

  return (
    <div className="bg-fuchsia-50 rounded-3xl p-4 relative shadow-lg">
      <button 
        onClick={() => setDismissed(true)}
        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
      >
        <X className="w-4 h-4" />
      </button>
      
      <div className="mb-4 pr-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {cognitiveClaritySelected && (
              <button 
                onClick={() => setCognitiveClaritySelected(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <h3 className="text-foreground">Afternoon Check-in</h3>
            <Clock className="w-4 h-4 text-orange-600" />
          </div>
          <div className="flex gap-1">
            {progressDots.map((completed, i) => (
              <div 
                key={i} 
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  completed ? 'bg-fuchsia-600' : 'bg-fuchsia-200'
                }`} 
              >
                {completed && <Check className="w-3 h-3 text-white" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative min-h-[80px]">
          {/* Cognitive Clarity Slider */}
          <div className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            cognitiveClaritySelected 
              ? 'opacity-0 pointer-events-none transform translate-y-4' 
              : 'opacity-100'
          }`}>
            <div className="text-center mb-4">
              <div className="text-sm text-muted-foreground">Cognitive Clarity</div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Frown className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-xs text-muted-foreground">tired</span>
              </div>
              
              <div className="flex-1 relative slider-container">
                <style dangerouslySetInnerHTML={{
                  __html: `
                    .cognitive-slider [role="slider"]::after {
                      content: "${cognitiveClarity}";
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                      color: white;
                      font-size: 12px;
                      font-weight: 500;
                      z-index: 10;
                      pointer-events: none;
                    }
                  `
                }} />
                <Slider
                  value={[cognitiveClarity]}
                  onValueChange={(value) => {
                    setCognitiveClarity(value[0]);
                    if (!cognitiveClaritySelected) {
                      setTimeout(() => setCognitiveClaritySelected(true), 2500);
                    }
                  }}
                  max={12}
                  min={1}
                  step={1}
                  className="w-full cognitive-slider [&_[role=slider]]:bg-purple-600 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-lg [&_[role=slider]]:w-8 [&_[role=slider]]:h-8 [&_[role=slider]]:relative"
                />
              </div>
              
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Brain className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-xs text-muted-foreground">sharp</span>
              </div>
            </div>
          </div>

          {/* Physical Energy Slider */}
          <div className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            cognitiveClaritySelected 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 pointer-events-none transform translate-y-4'
          }`}>
            <div className="text-center mb-4">
              <div className="text-sm text-muted-foreground">Physical Energy</div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Frown className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-xs text-muted-foreground">weak</span>
              </div>
              
              <div className="flex-1 relative slider-container">
                <style dangerouslySetInnerHTML={{
                  __html: `
                    .physical-slider [role="slider"]::after {
                      content: "${physicalEnergy}";
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                      color: white;
                      font-size: 12px;
                      font-weight: 500;
                      z-index: 10;
                      pointer-events: none;
                    }
                  `
                }} />
                <Slider
                  value={[physicalEnergy]}
                  onValueChange={(value) => setPhysicalEnergy(value[0])}
                  max={12}
                  min={1}
                  step={1}
                  className="w-full physical-slider [&_[role=slider]]:bg-orange-600 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-lg [&_[role=slider]]:w-8 [&_[role=slider]]:h-8 [&_[role=slider]]:relative"
                />
              </div>
              
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Dumbbell className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-xs text-muted-foreground">strong</span>
              </div>
            </div>
          </div>
        </div>

        <Button 
          onClick={onSubmit}
          className={`w-full bg-magenta-600 hover:bg-magenta-700 text-white rounded-full transition-all duration-300 ${
            cognitiveClaritySelected 
              ? 'opacity-100 scale-100' 
              : 'opacity-50 scale-95 pointer-events-none'
          }`}
          disabled={!cognitiveClaritySelected}
        >
          Submit Check-in
        </Button>
      </div>
    </div>
  );
}