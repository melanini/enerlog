import { useState, useEffect } from 'react';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { 
  ChevronDown, 
  ChevronUp, 
  Smartphone, 
  Carrot, 
  Apple, 
  Moon, 
  Pill, 
  Heart, 
  Coffee, 
  X, 
  Settings,
  Activity,
  Users
} from 'lucide-react';
import dropletIcon from 'figma:asset/edabe4150381c8b1ac1430c02e70fbda2cffe438.png';
import type { LifestyleFactors as LifestyleFactorsType } from '../../contexts/DataContext';

interface LifestyleFactorsProps {
  factors: LifestyleFactorsType;
  onFactorsChange: (factors: LifestyleFactorsType) => void;
}

interface CustomTracker {
  id: string;
  label: string;
  type: 'number' | 'boolean' | 'text';
  value: number | boolean | string;
  min?: number;
  max?: number;
  unit?: string;
}

export function LifestyleFactors({ factors, onFactorsChange }: LifestyleFactorsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [medicationInput, setMedicationInput] = useState('');
  const [allergiesInput, setAllergiesInput] = useState('');
  const [supplementsInput, setSupplementsInput] = useState('');
  const [medicationSuggestions, setMedicationSuggestions] = useState<string[]>([]);
  const [allergiesSuggestions, setAllergiesSuggestions] = useState<string[]>([]);
  const [supplementsSuggestions, setSupplementsSuggestions] = useState<string[]>([]);
  
  // Custom tracker states
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);
  const [newTrackerLabel, setNewTrackerLabel] = useState('');
  const [newTrackerType, setNewTrackerType] = useState<'number' | 'boolean' | 'text'>('number');
  const [newTrackerMin, setNewTrackerMin] = useState(0);
  const [newTrackerMax, setNewTrackerMax] = useState(10);
  const [newTrackerUnit, setNewTrackerUnit] = useState('');

  // Load previous entries from localStorage for suggestions
  useEffect(() => {
    const savedMedications = JSON.parse(localStorage.getItem('lifestyleMedications') || '[]');
    const savedAllergies = JSON.parse(localStorage.getItem('lifestyleAllergies') || '[]');
    const savedSupplements = JSON.parse(localStorage.getItem('lifestyleSupplements') || '[]');
    
    setMedicationSuggestions(savedMedications);
    setAllergiesSuggestions(savedAllergies);
    setSupplementsSuggestions(savedSupplements);
  }, []);

  // Ensure factors object has all required properties with defaults
  const safeFactors: LifestyleFactorsType = {
    sleep: factors?.sleep ?? 3,
    hydration: Math.min(factors?.hydration ?? 6, 10),
    exercise: factors?.exercise ?? false,
    nutrition: Math.max(0, factors?.nutrition ?? 2),
    social: factors?.social ?? false,
    work: factors?.work ?? 6,
    family: factors?.family ?? 2, // Keep for data compatibility but don't display
    hobby: factors?.hobby ?? 1,
    // New lifestyle factors - support arrays for multiple entries
    medication: factors?.medication ?? [],
    allergies: factors?.allergies ?? [],
    supplements: factors?.supplements ?? [],
    caffeine: factors?.caffeine ?? 0,
    custom: factors?.custom ?? [],
    ...factors // Spread the actual factors to override defaults
  };

  // Convert legacy string format to array format
  const medicationList = Array.isArray(safeFactors.medication) ? safeFactors.medication : (safeFactors.medication ? [safeFactors.medication] : []);
  const allergiesList = Array.isArray(safeFactors.allergies) ? safeFactors.allergies : (safeFactors.allergies ? [safeFactors.allergies] : []);
  const supplementsList = Array.isArray(safeFactors.supplements) ? safeFactors.supplements : (safeFactors.supplements ? [safeFactors.supplements] : []);
  
  // Convert custom trackers to proper format
  const customTrackers: CustomTracker[] = Array.isArray(safeFactors.custom) 
    ? safeFactors.custom.map(item => ({
        id: item.id || crypto.randomUUID(),
        label: item.label || '',
        type: item.type || 'number',
        value: item.value ?? (item.type === 'boolean' ? false : item.type === 'number' ? 0 : ''),
        min: item.min ?? 0,
        max: item.max ?? 10,
        unit: item.unit ?? ''
      }))
    : [];

  const updateFactor = <K extends keyof LifestyleFactorsType>(
    key: K,
    value: LifestyleFactorsType[K]
  ) => {
    onFactorsChange({
      ...safeFactors,
      [key]: value
    });
  };

  // Helper functions for managing list items
  const addToList = (category: 'medication' | 'allergies' | 'supplements', item: string) => {
    if (!item.trim()) return;
    
    const currentList = category === 'medication' ? medicationList : 
                       category === 'allergies' ? allergiesList : supplementsList;
    
    if (currentList.includes(item.trim())) return; // Avoid duplicates
    
    const newList = [...currentList, item.trim()];
    updateFactor(category, newList);
    
    // Save to suggestions
    const storageKey = `lifestyle${category.charAt(0).toUpperCase() + category.slice(1)}`;
    const currentSuggestions = category === 'medication' ? medicationSuggestions :
                              category === 'allergies' ? allergiesSuggestions : supplementsSuggestions;
    
    if (!currentSuggestions.includes(item.trim())) {
      const newSuggestions = [...currentSuggestions, item.trim()];
      localStorage.setItem(storageKey, JSON.stringify(newSuggestions));
      
      // Update state
      if (category === 'medication') setMedicationSuggestions(newSuggestions);
      else if (category === 'allergies') setAllergiesSuggestions(newSuggestions);
      else setSupplementsSuggestions(newSuggestions);
    }
  };

  const removeFromList = (category: 'medication' | 'allergies' | 'supplements', index: number) => {
    const currentList = category === 'medication' ? medicationList : 
                       category === 'allergies' ? allergiesList : supplementsList;
    
    const newList = currentList.filter((_, i) => i !== index);
    updateFactor(category, newList);
  };

  const handleKeyPress = (e: React.KeyboardEvent, category: 'medication' | 'allergies' | 'supplements', input: string, setInput: (value: string) => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addToList(category, input);
      setInput('');
    }
  };

  const getFilteredSuggestions = (input: string, suggestions: string[], currentList: string[]) => {
    if (!input.trim()) return [];
    return suggestions
      .filter(suggestion => 
        suggestion.toLowerCase().includes(input.toLowerCase()) && 
        !currentList.includes(suggestion)
      )
      .slice(0, 3); // Limit to 3 suggestions
  };

  // Custom tracker functions
  const addCustomTracker = () => {
    if (!newTrackerLabel.trim()) return;
    
    const newTracker: CustomTracker = {
      id: crypto.randomUUID(),
      label: newTrackerLabel.trim(),
      type: newTrackerType,
      value: newTrackerType === 'boolean' ? false : newTrackerType === 'number' ? newTrackerMin : '',
      min: newTrackerType === 'number' ? newTrackerMin : undefined,
      max: newTrackerType === 'number' ? newTrackerMax : undefined,
      unit: newTrackerType === 'number' ? newTrackerUnit.trim() : undefined
    };

    const newCustomList = [...customTrackers, newTracker];
    updateFactor('custom', newCustomList);
    
    // Reset form
    setNewTrackerLabel('');
    setNewTrackerType('number');
    setNewTrackerMin(0);
    setNewTrackerMax(10);
    setNewTrackerUnit('');
    setIsCustomDialogOpen(false);
  };

  const updateCustomTracker = (id: string, value: number | boolean | string) => {
    const updatedTrackers = customTrackers.map(tracker => 
      tracker.id === id ? { ...tracker, value } : tracker
    );
    updateFactor('custom', updatedTrackers);
  };

  const removeCustomTracker = (id: string) => {
    const updatedTrackers = customTrackers.filter(tracker => tracker.id !== id);
    updateFactor('custom', updatedTrackers);
  };

  // Removed work and hobby sliders from sliderFactors
  const sliderFactors = [
    {
      key: 'sleep' as const,
      label: 'Sleep Quality',
      icon: Moon,
      description: 'How restful sleep felt last night',
      min: 1,
      max: 5,
      step: 1,
      unit: '/5',
      value: safeFactors.sleep,
      color: 'text-purple-600'
    },
    {
      key: 'hydration' as const,
      label: 'Hydration',
      icon: 'custom', // Special marker for custom droplet icon
      description: 'Glasses of water today',
      min: 0,
      max: 10,
      step: 1,
      unit: 'glasses',
      value: Math.min(safeFactors.hydration, 10),
      color: 'text-blue-600'
    },
    {
      key: 'nutrition' as const,
      label: 'Healthy Food',
      icon: Apple,
      description: 'Healthy meals and snacks',
      min: 0,
      max: 5,
      step: 1,
      unit: '/5',
      value: Math.max(0, Math.min(5, safeFactors.nutrition)),
      color: 'text-orange-600'
    },
    {
      key: 'caffeine' as const,
      label: 'Caffeine',
      icon: Coffee,
      description: 'Cups of coffee today',
      min: 0,
      max: 4,
      step: 1,
      unit: 'cups',
      value: safeFactors.caffeine,
      color: 'text-yellow-600'
    }
  ];

  const switchFactors = [
    {
      key: 'exercise' as const,
      label: 'Exercise',
      icon: Activity,
      description: 'Did you exercise today?',
      value: safeFactors.exercise,
      color: 'text-fuchsia-600'
    },
    {
      key: 'social' as const,
      label: 'Social Interaction',
      icon: Users,
      description: 'Meaningful social time today?',
      value: safeFactors.social,
      color: 'text-orange-600'
    }
  ];

  // Show only key factors when collapsed (now includes caffeine)
  const keyFactors = sliderFactors.slice(0, 4);

  const renderSleepFactor = (factor: typeof sliderFactors[0]) => {
    return (
      <div key={factor.key} className="bg-background/50 backdrop-blur-sm rounded-lg p-4 border border-border/50 shadow-sm">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-purple-100`}>
                <factor.icon className={`w-4 h-4 ${factor.color}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-foreground">{factor.label}</h4>
                  <div className="flex items-center gap-1">
                    <Smartphone className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Auto-sync available</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{factor.description}</p>
              </div>
            </div>
            <Badge variant="outline" className="font-mono">
              {factor.value} {factor.unit}
            </Badge>
          </div>
          
          <div className="px-2">
            <div className="flex items-center justify-center gap-2 py-2">
              {Array.from({ length: 5 }, (_, index) => {
                const sleepLevel = index + 1;
                const isFilled = sleepLevel <= factor.value;
                return (
                  <button
                    key={index}
                    onClick={() => updateFactor(factor.key, sleepLevel)}
                    className="group relative p-2 transition-all duration-200 hover:scale-110"
                  >
                    <Moon
                      className={`h-8 w-8 transition-all duration-200 ${
                        isFilled
                          ? 'text-purple-400 fill-purple-300'
                          : 'text-gray-300 hover:text-gray-400 group-hover:fill-gray-100'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground -mt-1">
              <span>Poor</span>
              <span>Restful</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderNutritionFactor = (factor: typeof sliderFactors[0]) => {
    // Pattern: veggie, fruit, veggie, fruit, veggie (3 veggies, 2 fruits)
    const foodIcons = [
      { type: 'veggie', icon: Carrot, color: 'orange' },
      { type: 'fruit', icon: Apple, color: 'red' },
      { type: 'veggie', icon: Carrot, color: 'orange' },
      { type: 'fruit', icon: Apple, color: 'red' },
      { type: 'veggie', icon: Carrot, color: 'orange' }
    ];

    return (
      <div key={factor.key} className="bg-background/50 backdrop-blur-sm rounded-lg p-4 border border-border/50 shadow-sm">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-orange-100`}>
                <factor.icon className={`w-4 h-4 ${factor.color}`} />
              </div>
              <div>
                <h4 className="font-medium text-foreground">{factor.label}</h4>
                <p className="text-sm text-muted-foreground">{factor.description}</p>
              </div>
            </div>
            <Badge variant="outline" className="font-mono">
              {factor.value} {factor.unit}
            </Badge>
          </div>
          
          <div className="px-2">
            <div className="flex items-center justify-center gap-2 py-2">
              {foodIcons.map((food, index) => {
                const isFilled = index < factor.value;
                const IconComponent = food.icon;
                return (
                  <button
                    key={index}
                    onClick={() => updateFactor(factor.key, index + 1)}
                    className="group relative p-2 transition-all duration-200 hover:scale-110"
                  >
                    <IconComponent
                      className={`h-8 w-8 transition-all duration-200 ${
                        isFilled
                          ? food.color === 'orange' 
                            ? 'text-orange-400 fill-orange-300'
                            : 'text-red-400 fill-red-300'
                          : 'text-gray-300 hover:text-gray-400 group-hover:fill-gray-100'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground -mt-1">
              <span>0 servings</span>
              <span>5 servings</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderHydrationFactor = (factor: typeof sliderFactors[0]) => (
    <div key={factor.key} className="bg-background/50 backdrop-blur-sm rounded-lg p-4 border border-border/50 shadow-sm">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-blue-100`}>
              <img src={dropletIcon} alt="Hydration" className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">{factor.label}</h4>
              <p className="text-sm text-muted-foreground">{factor.description}</p>
            </div>
          </div>
          <Badge variant="outline" className="font-mono">
            {factor.value} {factor.unit}
          </Badge>
        </div>
        
        <div className="px-2">
          <div className="flex items-center justify-center gap-1 py-2">
            {Array.from({ length: 10 }, (_, index) => {
              const dropletNumber = index + 1;
              const isFilled = dropletNumber <= factor.value;
              return (
                <button
                  key={index}
                  onClick={() => updateFactor(factor.key, dropletNumber)}
                  className="group relative p-1 transition-all duration-200 hover:scale-110"
                >
                  <img 
                    src={dropletIcon} 
                    alt={`Water glass ${dropletNumber}`}
                    className={`h-6 w-6 transition-all duration-200 ${
                      isFilled
                        ? 'opacity-100'
                        : 'opacity-30 hover:opacity-60'
                    }`}
                    style={{
                      filter: isFilled 
                        ? 'none' 
                        : 'grayscale(100%) brightness(150%)'
                    }}
                  />
                </button>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground -mt-1">
            <span>0 glasses</span>
            <span>10 glasses</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCaffeineFactor = (factor: typeof sliderFactors[0]) => (
    <div key={factor.key} className="bg-background/50 backdrop-blur-sm rounded-lg p-4 border border-border/50 shadow-sm">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-yellow-100`}>
              <factor.icon className={`w-4 h-4 ${factor.color}`} />
            </div>
            <div>
              <h4 className="font-medium text-foreground">{factor.label}</h4>
              <p className="text-sm text-muted-foreground">{factor.description}</p>
            </div>
          </div>
          <Badge variant="outline" className="font-mono">
            {factor.value} {factor.unit}
          </Badge>
        </div>
        
        <div className="px-2">
          <div className="flex items-center justify-center gap-2 py-2">
            {Array.from({ length: 4 }, (_, index) => {
              const cupNumber = index + 1;
              const isFilled = cupNumber <= factor.value;
              return (
                <button
                  key={index}
                  onClick={() => updateFactor(factor.key, cupNumber)}
                  className="group relative p-2 transition-all duration-200 hover:scale-110"
                >
                  <Coffee
                    className={`h-8 w-8 transition-all duration-200 ${
                      isFilled
                        ? 'text-yellow-600 fill-yellow-500'
                        : 'text-gray-300 hover:text-yellow-400 group-hover:fill-yellow-100'
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground -mt-1">
            <span>No caffeine</span>
            <span>Heavy intake</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCustomTracker = (tracker: CustomTracker) => {
    switch (tracker.type) {
      case 'number':
        return (
          <div key={tracker.id} className="space-y-2 p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-purple-400" />
                <div>
                  <h4 className="font-medium text-foreground">{tracker.label}</h4>
                  <p className="text-xs text-muted-foreground">Custom number tracker</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  {tracker.value}{tracker.unit}
                </Badge>
                <button
                  onClick={() => removeCustomTracker(tracker.id)}
                  className="hover:bg-destructive/20 rounded-full p-1"
                >
                  <X className="h-3 w-3 text-destructive" />
                </button>
              </div>
            </div>
            
            <div className="px-2">
              <Slider
                value={[Number(tracker.value)]}
                onValueChange={(values) => updateCustomTracker(tracker.id, values[0])}
                max={tracker.max}
                min={tracker.min}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground -mt-1">
                <span>{tracker.min}{tracker.unit}</span>
                <span>{tracker.max}{tracker.unit}</span>
              </div>
            </div>
          </div>
        );

      case 'boolean':
        return (
          <div key={tracker.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Settings className="h-4 w-4 text-purple-400" />
              <div>
                <h4 className="font-medium text-foreground">{tracker.label}</h4>
                <p className="text-xs text-muted-foreground">Custom yes/no tracker</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={Boolean(tracker.value)}
                onCheckedChange={(checked) => updateCustomTracker(tracker.id, checked)}
              />
              <button
                onClick={() => removeCustomTracker(tracker.id)}
                className="hover:bg-destructive/20 rounded-full p-1"
              >
                <X className="h-3 w-3 text-destructive" />
              </button>
            </div>
          </div>
        );

      case 'text':
        return (
          <div key={tracker.id} className="space-y-2 p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-purple-400" />
                <div>
                  <h4 className="font-medium text-foreground">{tracker.label}</h4>
                  <p className="text-xs text-muted-foreground">Custom text tracker</p>
                </div>
              </div>
              <button
                onClick={() => removeCustomTracker(tracker.id)}
                className="hover:bg-destructive/20 rounded-full p-1"
              >
                <X className="h-3 w-3 text-destructive" />
              </button>
            </div>
            <Input
              placeholder="Enter value..."
              value={String(tracker.value)}
              onChange={(e) => updateCustomTracker(tracker.id, e.target.value)}
              className="bg-background/50"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const renderSliderFactor = (factor: typeof sliderFactors[0]) => {
    if (factor.key === 'sleep') {
      return renderSleepFactor(factor);
    }
    
    if (factor.key === 'hydration') {
      return renderHydrationFactor(factor);
    }
    
    if (factor.key === 'nutrition') {
      return renderNutritionFactor(factor);
    }
    
    if (factor.key === 'caffeine') {
      return renderCaffeineFactor(factor);
    }
    
    return null;
  };

  const renderSwitchFactor = (factor: typeof switchFactors[0]) => (
    <div key={factor.key} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-${factor.color.includes('fuchsia') ? 'fuchsia' : 'orange'}-100`}>
          <factor.icon className={`w-4 h-4 ${factor.color}`} />
        </div>
        <div>
          <h4 className="font-medium text-foreground">{factor.label}</h4>
          <p className="text-sm text-muted-foreground">{factor.description}</p>
        </div>
      </div>
      <Switch
        checked={factor.value}
        onCheckedChange={(checked) => updateFactor(factor.key, checked)}
      />
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Key Factors - Always Visible */}
      <div className="space-y-6">
        {keyFactors.map(renderSliderFactor)}
      </div>

      {/* Switch Factors */}
      <div className="space-y-3">
        {switchFactors.map(renderSwitchFactor)}
      </div>

      {/* Expandable Lifestyle Tracking */}
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 bg-background/50"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Hide Lifestyle
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              Lifestyle
            </>
          )}
        </Button>

        {isExpanded && (
          <div className="space-y-5 pt-2">
            {/* Medication */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-blue-600" />
                  <h4 className="font-medium text-foreground">Medication</h4>
                </div>
                <span className="text-sm text-muted-foreground">
                  {medicationList.length > 0 ? `${medicationList.length} items` : 'None'}
                </span>
              </div>
              
              {/* Show existing medications */}
              {medicationList.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {medicationList.map((med, index) => (
                    <div key={index} className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm">
                      <span>{med}</span>
                      <button
                        onClick={() => removeFromList('medication', index)}
                        className="hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add new medication */}
              <div className="space-y-2">
                <Input
                  placeholder="Add medication..."
                  value={medicationInput}
                  onChange={(e) => setMedicationInput(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'medication', medicationInput, setMedicationInput)}
                  className="bg-background/50"
                />
                
                {/* Show filtered suggestions */}
                {getFilteredSuggestions(medicationInput, medicationSuggestions, medicationList).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      addToList('medication', suggestion);
                      setMedicationInput('');
                    }}
                    className="block w-full text-left px-3 py-2 text-sm bg-muted/30 hover:bg-muted/50 rounded-md transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
                
                {medicationInput.trim() && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      addToList('medication', medicationInput);
                      setMedicationInput('');
                    }}
                    className="w-full"
                  >
                    Add "{medicationInput}"
                  </Button>
                )}
              </div>
            </div>

            {/* Allergies */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-orange-400" />
                  <h4 className="font-medium text-foreground">Allergies</h4>
                </div>
                <span className="text-sm text-muted-foreground">
                  {allergiesList.length > 0 ? `${allergiesList.length} items` : 'None'}
                </span>
              </div>
              
              {/* Show existing allergies */}
              {allergiesList.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {allergiesList.map((allergy, index) => (
                    <div key={index} className="flex items-center gap-1 bg-orange-50 text-orange-700 px-2 py-1 rounded-full text-sm">
                      <span>{allergy}</span>
                      <button
                        onClick={() => removeFromList('allergies', index)}
                        className="hover:bg-orange-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add new allergy */}
              <div className="space-y-2">
                <Input
                  placeholder="Add allergy..."
                  value={allergiesInput}
                  onChange={(e) => setAllergiesInput(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'allergies', allergiesInput, setAllergiesInput)}
                  className="bg-background/50"
                />
                
                {/* Show filtered suggestions */}
                {getFilteredSuggestions(allergiesInput, allergiesSuggestions, allergiesList).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      addToList('allergies', suggestion);
                      setAllergiesInput('');
                    }}
                    className="block w-full text-left px-3 py-2 text-sm bg-muted/30 hover:bg-muted/50 rounded-md transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
                
                {allergiesInput.trim() && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      addToList('allergies', allergiesInput);
                      setAllergiesInput('');
                    }}
                    className="w-full"
                  >
                    Add "{allergiesInput}"
                  </Button>
                )}
              </div>
            </div>

            {/* Supplements */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-purple-400" />
                  <h4 className="font-medium text-foreground">Supplements</h4>
                </div>
                <span className="text-sm text-muted-foreground">
                  {supplementsList.length > 0 ? `${supplementsList.length} items` : 'None'}
                </span>
              </div>
              
              {/* Show existing supplements */}
              {supplementsList.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {supplementsList.map((supplement, index) => (
                    <div key={index} className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-sm">
                      <span>{supplement}</span>
                      <button
                        onClick={() => removeFromList('supplements', index)}
                        className="hover:bg-purple-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add new supplement */}
              <div className="space-y-2">
                <Input
                  placeholder="Add supplement..."
                  value={supplementsInput}
                  onChange={(e) => setSupplementsInput(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'supplements', supplementsInput, setSupplementsInput)}
                  className="bg-background/50"
                />
                
                {/* Show filtered suggestions */}
                {getFilteredSuggestions(supplementsInput, supplementsSuggestions, supplementsList).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      addToList('supplements', suggestion);
                      setSupplementsInput('');
                    }}
                    className="block w-full text-left px-3 py-2 text-sm bg-muted/30 hover:bg-muted/50 rounded-md transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
                
                {supplementsInput.trim() && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      addToList('supplements', supplementsInput);
                      setSupplementsInput('');
                    }}
                    className="w-full"
                  >
                    Add "{supplementsInput}"
                  </Button>
                )}
              </div>
            </div>

            {/* Custom Trackers */}
            {customTrackers.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-foreground flex items-center gap-2">
                  <Settings className="h-4 w-4 text-purple-400" />
                  Custom Trackers
                </h4>
                {customTrackers.map(renderCustomTracker)}
              </div>
            )}

            {/* Add Custom Tracker */}
            <Dialog open={isCustomDialogOpen} onOpenChange={setIsCustomDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Add Custom Tracker
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Custom Tracker</DialogTitle>
                  <DialogDescription>
                    Add a personalized tracker for any lifestyle factor important to you.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tracker-label">Tracker Name</Label>
                    <Input
                      id="tracker-label"
                      placeholder="e.g., Meditation minutes, Water quality, etc."
                      value={newTrackerLabel}
                      onChange={(e) => setNewTrackerLabel(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="tracker-type">Tracker Type</Label>
                    <Select 
                      value={newTrackerType} 
                      onValueChange={(value: 'number' | 'boolean' | 'text') => setNewTrackerType(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="number">Number (with slider)</SelectItem>
                        <SelectItem value="boolean">Yes/No (switch)</SelectItem>
                        <SelectItem value="text">Text (notes)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {newTrackerType === 'number' && (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="tracker-min">Min Value</Label>
                          <Input
                            id="tracker-min"
                            type="number"
                            value={newTrackerMin}
                            onChange={(e) => setNewTrackerMin(Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="tracker-max">Max Value</Label>
                          <Input
                            id="tracker-max"
                            type="number"
                            value={newTrackerMax}
                            onChange={(e) => setNewTrackerMax(Number(e.target.value))}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="tracker-unit">Unit (optional)</Label>
                        <Input
                          id="tracker-unit"
                          placeholder="e.g., minutes, cups, hours"
                          value={newTrackerUnit}
                          onChange={(e) => setNewTrackerUnit(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={addCustomTracker} 
                      disabled={!newTrackerLabel.trim()}
                      className="flex-1"
                    >
                      Create Tracker
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCustomDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}