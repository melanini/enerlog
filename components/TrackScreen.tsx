import { useState } from 'react';
import { Calendar, Check, Zap, Activity, Brain } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ScreenHeader } from './ui/screen-header';
import { MoodSelector } from './track/MoodSelector';
import { StressSelector } from './track/StressSelector';
import { EnergySlider } from './track/EnergySlider';
import { LifestyleFactors } from './track/LifestyleFactors';
import { useData } from '../contexts/DataContext';
import { toast } from 'sonner@2.0.3';
import type { Mood, StressLevel, LifestyleFactors as LifestyleFactorsType } from '../contexts/DataContext';

interface TrackScreenProps {
  onBack: () => void;
}

export function TrackScreen({ onBack }: TrackScreenProps) {
  const { addTrackingEntry } = useData();
  const [mood, setMood] = useState<Mood>('content');
  const [stress, setStress] = useState<StressLevel>('medium');
  const [cognitiveClarity, setCognitiveClarity] = useState(60);
  const [physicalEnergy, setPhysicalEnergy] = useState(60);
  const [lifestyleFactors, setLifestyleFactors] = useState<LifestyleFactorsType>({
    sleep: 3,
    hydration: 6,
    exercise: false,
    nutrition: 2,
    social: false,
    work: 6,
    family: 2,
    hobby: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await addTrackingEntry({
        mood,
        stress,
        cognitiveClarity,
        physicalEnergy,
        lifestyleFactors
      });
      
      toast.success('Energy tracking entry saved successfully! ✨');
      onBack();
    } catch (error) {
      console.error('Error saving tracking entry:', error);
      toast.error('Failed to save tracking entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = mood && stress !== undefined && cognitiveClarity > 0 && physicalEnergy > 0;

  return (
    <div className="min-h-screen bg-gradient-pastel">
      <ScreenHeader 
        title="Track Energy"
        subtitle="Complete tracking with all factors"
        onBack={onBack}
        rightElement={
          <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
            <Calendar className="h-3 w-3" />
            {new Date().toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
        }
      />

      <div className="px-4 pb-24 space-y-6 max-w-md mx-auto">
        {/* Mood Selection */}
        <Card className="border-0 shadow-sm bg-card/80 backdrop-blur-sm mt-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-magenta-100 rounded-full flex items-center justify-center">
                <span className="text-lg">😊</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Current Mood</h3>
                <p className="text-sm text-muted-foreground">How are you feeling right now?</p>
              </div>
            </div>
            <MoodSelector mood={mood} onMoodChange={setMood} />
          </CardContent>
        </Card>

        {/* Stress Level */}
        <Card className="border-0 shadow-sm bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Activity className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Stress Level</h3>
                <p className="text-sm text-muted-foreground">Rate your current stress</p>
              </div>
            </div>
            <StressSelector stress={stress} onStressChange={setStress} />
          </CardContent>
        </Card>

        {/* Energy Levels */}
        <Card className="border-0 shadow-sm bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-fuchsia-100 rounded-full flex items-center justify-center">
                <Zap className="h-5 w-5 text-fuchsia-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Energy Levels</h3>
                <p className="text-sm text-muted-foreground">Rate your cognitive and physical energy</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <EnergySlider
                label="Cognitive Clarity"
                value={cognitiveClarity}
                onChange={setCognitiveClarity}
                icon={<Brain className="w-5 h-5 text-purple-600" />}
                description="Mental sharpness and focus"
              />
              <EnergySlider
                label="Physical Energy"
                value={physicalEnergy}
                onChange={setPhysicalEnergy}
                icon={<Zap className="w-5 h-5 text-orange-600" />}
                description="Physical vitality and stamina"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lifestyle Factors */}
        <Card className="border-0 shadow-sm bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Activity className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Lifestyle Factors</h3>
                <p className="text-sm text-muted-foreground">Rate factors affecting your energy</p>
              </div>
            </div>
            <LifestyleFactors
              factors={lifestyleFactors}
              onFactorsChange={setLifestyleFactors}
            />
          </CardContent>
        </Card>
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-transparent border-t border-border/50 backdrop-blur-sm">
        <div className="max-w-md mx-auto p-4">
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="w-full h-12 bg-magenta-600 hover:bg-magenta-700 text-white font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Save Tracking Entry
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}