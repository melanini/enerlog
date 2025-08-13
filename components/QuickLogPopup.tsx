import { useState } from 'react';
import { Plus, X, Smile, Frown, Meh, Zap, Heart, Droplets, Brain, Target, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useData } from '../contexts/DataContext';
import { toast } from 'sonner@2.0.3';
import type { Mood, StressLevel } from '../contexts/DataContext';

interface TimeCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  keywords: string[];
  priority: number;
}

interface QuickLogPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToFullTracking: () => void;
}

export function QuickLogPopup({ isOpen, onClose, onNavigateToFullTracking }: QuickLogPopupProps) {
  const { addHappyMoment, addCheckInEntry, addTrackingEntry } = useData();
  
  // Quick states
  const [happyMoment, setHappyMoment] = useState('');
  const [quickEnergy, setQuickEnergy] = useState([7]);
  const [waterCount, setWaterCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Time tracking states
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [timeAmount, setTimeAmount] = useState('');
  const [timeUnit, setTimeUnit] = useState<'minutes' | 'hours'>('minutes');
  
  // Default time categories (can be made configurable later)
  const timeCategories: TimeCategory[] = [
    { id: '1', name: 'Work', color: '#c45e99', icon: '💼', keywords: ['meeting', 'project', 'deadline'], priority: 1 },
    { id: '2', name: 'Family', color: '#F59E0B', icon: '👨‍👩‍👧‍👦', keywords: ['dinner', 'kids', 'family'], priority: 2 },
    { id: '3', name: 'Exercise', color: '#10B981', icon: '🏃‍♂️', keywords: ['gym', 'run', 'workout'], priority: 3 },
    { id: '4', name: 'Personal', color: '#EF4444', icon: '🧘‍♀️', keywords: ['meditation', 'reading', 'hobby'], priority: 4 }
  ];

  // Simulate haptic feedback
  const hapticFeedback = () => {
    // In a real app, this would use the device's haptic API
    console.log('Haptic feedback triggered');
  };

  const handleQuickMood = async (mood: Mood) => {
    hapticFeedback();
    setIsSubmitting(true);
    try {
      await addTrackingEntry({
        mood,
        stress: 'medium' as StressLevel,
        cognitiveClarity: 60,
        physicalEnergy: 60,
        lifestyleFactors: {
          sleep: 7,
          hydration: 8,
          exercise: false,
          nutrition: 3,
          social: false,
          work: 6,
          family: 2,
          hobby: 1
        }
      });
      toast.success(`Mood logged: ${getMoodLabel(mood)} ${getMoodIcon(mood)}`);
      onClose();
    } catch (error) {
      toast.error('Failed to log mood');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickEnergy = async () => {
    hapticFeedback();
    setIsSubmitting(true);
    try {
      await addCheckInEntry({
        type: getCheckInType(),
        cognitiveClarity: quickEnergy[0],
        physicalEnergy: quickEnergy[0],
      });
      toast.success(`Energy check-in logged: ${quickEnergy[0]}/12 ⚡`);
      onClose();
    } catch (error) {
      toast.error('Failed to log energy');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHappyMoment = async () => {
    if (!happyMoment.trim()) return;
    
    hapticFeedback();
    setIsSubmitting(true);
    try {
      await addHappyMoment(happyMoment);
      toast.success('Happy moment saved! ✨');
      setHappyMoment('');
      onClose();
    } catch (error) {
      toast.error('Failed to save happy moment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStressLevel = async (stress: StressLevel) => {
    hapticFeedback();
    setIsSubmitting(true);
    try {
      await addTrackingEntry({
        mood: 'neutral' as Mood,
        stress,
        cognitiveClarity: 60,
        physicalEnergy: 60,
        lifestyleFactors: {
          sleep: 7,
          hydration: 8,
          exercise: false,
          nutrition: 3,
          social: false,
          work: 6,
          family: 2,
          hobby: 1
        }
      });
      toast.success(`Stress level logged: ${getStressLabel(stress)}`);
      onClose();
    } catch (error) {
      toast.error('Failed to log stress level');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWaterLog = () => {
    if (waterCount > 0) {
      hapticFeedback();
      toast.success(`Logged ${waterCount} glasses of water! 💧`);
      setWaterCount(0);
      onClose();
    }
  };

  const handleTimeLog = () => {
    if (!selectedCategory || !timeAmount || isNaN(Number(timeAmount))) {
      toast.error('Please select a category and enter a valid time amount');
      return;
    }

    const timeValue = Number(timeAmount);
    if (timeValue <= 0) {
      toast.error('Time amount must be greater than 0');
      return;
    }

    if (timeUnit === 'hours' && timeValue > 12) {
      toast.error('Maximum 12 hours can be logged at once');
      return;
    }

    if (timeUnit === 'minutes' && timeValue > 720) {
      toast.error('Maximum 720 minutes (12 hours) can be logged at once');
      return;
    }

    hapticFeedback();
    const category = timeCategories.find(cat => cat.id === selectedCategory);
    const timeInMinutes = timeUnit === 'hours' ? timeValue * 60 : timeValue;
    
    // Store time tracking data (for now just show success message)
    // In a real app, this would be saved to a separate time tracking context/storage
    const timeLogData = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      categoryId: selectedCategory,
      categoryName: category?.name,
      duration: timeInMinutes,
      unit: timeUnit,
      originalAmount: timeValue
    };
    
    // Store in localStorage for now
    const existingTimeLogs = JSON.parse(localStorage.getItem('energy_tracker_time_logs') || '[]');
    existingTimeLogs.push(timeLogData);
    localStorage.setItem('energy_tracker_time_logs', JSON.stringify(existingTimeLogs));
    
    toast.success(`Logged ${timeAmount} ${timeUnit} for ${category?.name} ${category?.icon}`);
    
    // Reset form
    setSelectedCategory('');
    setTimeAmount('');
    setTimeUnit('minutes');
    onClose();
  };

  const getCheckInType = (): 'morning' | 'midday' | 'afternoon' | 'evening' => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 15) return 'midday';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  const getMoodLabel = (mood: Mood): string => {
    const labels = {
      happy: 'Happy',
      excited: 'Excited', 
      neutral: 'Neutral',
      sad: 'Sad',
      anxious: 'Anxious'
    };
    return labels[mood];
  };

  const getStressLabel = (stress: StressLevel): string => {
    const labels = {
      low: 'Low',
      medium: 'Medium',
      high: 'High'
    };
    return labels[stress];
  };

  const getMoodIcon = (mood: Mood) => {
    switch (mood) {
      case 'happy':
        return '😊';
      case 'excited':
        return '🤩';
      case 'neutral':
        return '😐';
      case 'sad':
        return '😢';
      case 'anxious':
        return '😰';
      default:
        return '😐';
    }
  };

  // Reset time tracking form when dialog opens/closes
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setSelectedCategory('');
      setTimeAmount('');
      setTimeUnit('minutes');
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="max-w-sm mx-auto max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-center gap-2">
            <Zap className="h-5 w-5 text-magenta-600" />
            <DialogTitle className="text-center">Quick Log</DialogTitle>
          </div>
          <DialogDescription className="text-center">
            Fast data entry shortcuts for mood, energy, happy moments, water intake, stress levels, and time tracking
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pb-4">
          {/* Quick Mood */}
          <Card className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Smile className="h-4 w-4 text-magenta-600" />
                <span className="font-medium">How are you feeling?</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {(['happy', 'excited', 'neutral', 'sad', 'anxious'] as Mood[]).map((mood) => (
                  <Button
                    key={mood}
                    variant="outline"
                    size="sm"
                    className="h-14 flex flex-col items-center gap-1 hover:scale-105 transition-all active:scale-95"
                    onClick={() => handleQuickMood(mood)}
                    disabled={isSubmitting}
                  >
                    <span className="text-lg">{getMoodIcon(mood)}</span>
                    <span className="text-xs">{getMoodLabel(mood)}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Energy */}
          <Card className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-magenta-600" />
                <span className="font-medium">Energy Level</span>
                <Badge variant="outline" className="ml-auto">{quickEnergy[0]}/12</Badge>
              </div>
              <div className="space-y-4">
                <div className="px-2">
                  <Slider
                    value={quickEnergy}
                    onValueChange={setQuickEnergy}
                    max={12}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
                <Button 
                  onClick={handleQuickEnergy}
                  className="w-full hover:scale-[1.02] transition-all active:scale-95"
                  size="sm"
                  disabled={isSubmitting}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Log Energy
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Happy Moment */}
          <Card className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="h-4 w-4 text-magenta-600" />
                <span className="font-medium">Happy Moment</span>
              </div>
              <div className="space-y-3">
                <Input
                  placeholder="What made you smile today?"
                  value={happyMoment}
                  onChange={(e) => setHappyMoment(e.target.value)}
                  maxLength={100}
                  className="transition-all focus:scale-[1.01]"
                />
                <div className="text-xs text-muted-foreground text-right">
                  {happyMoment.length}/100
                </div>
                <Button 
                  onClick={handleHappyMoment}
                  className="w-full hover:scale-[1.02] transition-all active:scale-95"
                  size="sm"
                  disabled={!happyMoment.trim() || isSubmitting}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Save Moment ✨
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Water Intake */}
          <Card className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Droplets className="h-4 w-4 text-magenta-600" />
                <span className="font-medium">Water Intake</span>
                <Badge variant="outline" className="ml-auto">{waterCount} glasses</Badge>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-10 h-10 hover:scale-110 transition-all active:scale-95"
                  onClick={() => {
                    setWaterCount(Math.max(0, waterCount - 1));
                    hapticFeedback();
                  }}
                  disabled={waterCount === 0}
                >
                  -
                </Button>
                <div className="flex-1 text-center">
                  <div className="text-3xl">💧</div>
                  <div className="text-lg font-medium">{waterCount}</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-10 h-10 hover:scale-110 transition-all active:scale-95"
                  onClick={() => {
                    setWaterCount(waterCount + 1);
                    hapticFeedback();
                  }}
                >
                  +
                </Button>
                <Button
                  onClick={handleWaterLog}
                  size="sm"
                  className="hover:scale-105 transition-all active:scale-95"
                  disabled={waterCount === 0}
                >
                  Log
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stress Level */}
          <Card className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-4 w-4 text-magenta-600" />
                <span className="font-medium">Stress Level</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex flex-col items-center gap-1 h-16 hover:scale-105 transition-all active:scale-95"
                  onClick={() => handleStressLevel('low')}
                  disabled={isSubmitting}
                >
                  <span className="text-lg">😌</span>
                  <span className="text-xs">Low</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex flex-col items-center gap-1 h-16 hover:scale-105 transition-all active:scale-95"
                  onClick={() => handleStressLevel('medium')}
                  disabled={isSubmitting}
                >
                  <span className="text-lg">😐</span>
                  <span className="text-xs">Medium</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex flex-col items-center gap-1 h-16 hover:scale-105 transition-all active:scale-95"
                  onClick={() => handleStressLevel('high')}
                  disabled={isSubmitting}
                >
                  <span className="text-lg">😰</span>
                  <span className="text-xs">High</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Time Tracking */}
          <Card className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-magenta-600" />
                <span className="font-medium">Log Time</span>
              </div>
              <div className="space-y-3">
                {/* Category Selection */}
                <div className="grid grid-cols-2 gap-2">
                  {timeCategories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      className="flex flex-col items-center gap-1 h-16 hover:scale-105 transition-all active:scale-95"
                      onClick={() => setSelectedCategory(category.id)}
                      style={{
                        backgroundColor: selectedCategory === category.id ? category.color : undefined,
                        borderColor: selectedCategory === category.id ? category.color : undefined
                      }}
                    >
                      <span className="text-lg">{category.icon}</span>
                      <span className="text-xs">{category.name}</span>
                    </Button>
                  ))}
                </div>

                {/* Time Input */}
                {selectedCategory && (
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={timeAmount}
                      onChange={(e) => setTimeAmount(e.target.value)}
                      min="1"
                      max={timeUnit === 'hours' ? "12" : "720"}
                      className="flex-1"
                    />
                    <div className="flex rounded-lg border overflow-hidden">
                      <Button
                        variant={timeUnit === 'minutes' ? 'default' : 'outline'}
                        size="sm"
                        className="rounded-none border-0 hover:scale-100"
                        onClick={() => setTimeUnit('minutes')}
                      >
                        Min
                      </Button>
                      <Button
                        variant={timeUnit === 'hours' ? 'default' : 'outline'}
                        size="sm"
                        className="rounded-none border-0 hover:scale-100"
                        onClick={() => setTimeUnit('hours')}
                      >
                        Hrs
                      </Button>
                    </div>
                  </div>
                )}

                {!selectedCategory && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    Select a category to log time
                  </p>
                )}

                <Button 
                  onClick={handleTimeLog}
                  className="w-full hover:scale-[1.02] transition-all active:scale-95"
                  size="sm"
                  disabled={!selectedCategory || !timeAmount || isSubmitting}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Log Time
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Full Tracking */}
          <Card className="border-magenta-200 bg-gradient-to-r from-magenta-50 to-magenta-100">
            <CardContent className="p-4">
              <Button
                onClick={() => {
                  hapticFeedback();
                  onClose();
                  onNavigateToFullTracking();
                }}
                className="w-full bg-magenta-600 hover:bg-magenta-700 hover:scale-[1.02] transition-all active:scale-95"
                size="sm"
              >
                <Target className="h-4 w-4 mr-2" />
                Full Tracking Experience
              </Button>
              <p className="text-xs text-magenta-600 text-center mt-2">
                Complete tracking with all lifestyle factors
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}