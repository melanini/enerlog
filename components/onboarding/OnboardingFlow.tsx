import { useState } from 'react';
import { Button } from '../ui/button';
import { ChevronRight, Smartphone, Heart, CheckCircle, Zap, Apple, Watch } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [healthConnected, setHealthConnected] = useState(false);
  const [wearableConnected, setWearableConnected] = useState(false);

  const screens = [
    {
      id: 'welcome',
      title: "Welcome to Energy Tracker",
      subtitle: "Track your cognitive clarity and physical energy throughout the day",
      icon: Zap,
      color: 'magenta'
    },
    {
      id: 'health',
      title: "Connect Your Health Data",
      subtitle: "Sync with wearables and Apple Health for automatic sleep and activity tracking",
      icon: Heart,
      color: 'fuchsia'
    },
    {
      id: 'checkins',
      title: "Daily Check-ins Made Simple",
      subtitle: "Quick 30-second check-ins help you understand your energy patterns",
      icon: CheckCircle,
      color: 'orange'
    },
    {
      id: 'ready',
      title: "You're All Set!",
      subtitle: "Start tracking your energy journey and discover what affects your daily performance",
      icon: Smartphone,
      color: 'purple'
    }
  ];

  const currentScreenData = screens[currentScreen];
  const isLastScreen = currentScreen === screens.length - 1;

  const handleNext = () => {
    if (isLastScreen) {
      // Mark onboarding as complete
      localStorage.setItem('energyApp_onboardingCompleted', 'true');
      onComplete();
    } else {
      setCurrentScreen(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('energyApp_onboardingCompleted', 'true');
    onComplete();
  };

  const handleHealthConnect = async () => {
    // Simulate connection process
    setHealthConnected(true);
    // In a real app, this would trigger the Apple Health permission request
    console.log('Requesting Apple Health permissions...');
  };

  const handleWearableConnect = async () => {
    // Simulate connection process  
    setWearableConnected(true);
    // In a real app, this would trigger wearable pairing
    console.log('Connecting to wearable device...');
  };

  const IconComponent = currentScreenData.icon;
  const colorMap = {
    magenta: 'bg-magenta-600',
    fuchsia: 'bg-fuchsia-600', 
    orange: 'bg-orange-600',
    purple: 'bg-purple-600'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Skip button */}
      {!isLastScreen && (
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="text-muted-foreground hover:text-foreground"
          >
            Skip
          </Button>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Icon */}
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 ${colorMap[currentScreenData.color as keyof typeof colorMap]}`}>
          <IconComponent className="w-12 h-12 text-white" />
        </div>

        {/* Title and subtitle */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-4 max-w-sm">
          {currentScreenData.title}
        </h1>
        <p className="text-gray-600 mb-8 max-w-sm leading-relaxed">
          {currentScreenData.subtitle}
        </p>

        {/* Health Integration Screen Content */}
        {currentScreen === 1 && (
          <div className="w-full max-w-sm space-y-4 mb-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Apple className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Apple Health</div>
                    <div className="text-sm text-gray-600">Sleep, steps, heart rate</div>
                  </div>
                </div>
                <Button
                  variant={healthConnected ? "default" : "outline"}
                  size="sm"
                  onClick={handleHealthConnect}
                  disabled={healthConnected}
                  className={healthConnected ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {healthConnected ? "Connected" : "Connect"}
                </Button>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Watch className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Wearable Device</div>
                    <div className="text-sm text-gray-600">Fitness tracker, smartwatch</div>
                  </div>
                </div>
                <Button
                  variant={wearableConnected ? "default" : "outline"}
                  size="sm"
                  onClick={handleWearableConnect}
                  disabled={wearableConnected}
                  className={wearableConnected ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {wearableConnected ? "Connected" : "Connect"}
                </Button>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              You can always connect these later in Settings
            </p>
          </div>
        )}

        {/* Check-ins Screen Content */}
        {currentScreen === 2 && (
          <div className="w-full max-w-sm mb-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-purple-600">1</span>
                  </div>
                  <span className="text-sm text-gray-700">Rate your cognitive clarity (1-12)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-orange-600">2</span>
                  </div>
                  <span className="text-sm text-gray-700">Rate your physical energy (1-12)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-fuchsia-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-fuchsia-600">3</span>
                  </div>
                  <span className="text-sm text-gray-700">Submit in 30 seconds</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom section */}
      <div className="px-6 pb-8">
        {/* Progress indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {screens.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentScreen 
                  ? 'bg-magenta-600 w-6' 
                  : index < currentScreen 
                    ? 'bg-magenta-600/50' 
                    : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Next button */}
        <Button
          onClick={handleNext}
          className="w-full bg-magenta-600 hover:bg-magenta-700 text-white rounded-full h-12"
        >
          {isLastScreen ? 'Start Tracking' : 'Next'}
          {!isLastScreen && <ChevronRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
}