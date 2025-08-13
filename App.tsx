import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { CheckInSection } from "./components/CheckInSection";
import { InsightSection } from "./components/InsightSection";
import { EnergyLevelSection } from "./components/EnergyLevelSection";
import { EditableQuickActionTiles } from "./components/EditableQuickActionTiles";
import { BottomNavigation } from "./components/BottomNavigation";
import { TrackScreen } from "./components/TrackScreen";
import { AnalyticsScreen } from "./components/AnalyticsScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { AuthFlow } from "./components/auth/AuthFlow";
import { OnboardingFlow } from "./components/onboarding/OnboardingFlow";
import { DataProvider, useData } from "./contexts/DataContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Toaster } from "sonner@2.0.3";
import { Button } from "./components/ui/button";
import { RotateCcw, TestTube } from "lucide-react";
import { appConfig } from "./utils/supabase/info";
import { initializeApp } from "./utils/init";

function TestingControls() {
  const {
    loadMockData,
    clearAllData,
    trackingEntries,
    checkInEntries,
    happyMoments,
  } = useData();
  const [showStats, setShowStats] = useState(false);

  const resetOnboarding = () => {
    try {
      localStorage.removeItem("energyApp_onboardingCompleted");
      window.location.reload();
    } catch (error) {
      console.error("Error resetting onboarding:", error);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-card/90 backdrop-blur-sm rounded-lg p-3 border shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <TestTube className="h-4 w-4 text-magenta-600" />
        <span className="text-sm font-medium">Testing</span>
      </div>

      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowStats(!showStats)}
          className="text-xs"
        >
          {showStats ? "Hide" : "Show"} Stats
        </Button>

        {showStats && (
          <div className="text-xs space-y-1 p-2 bg-muted/50 rounded">
            <div>Tracking: {trackingEntries.length}</div>
            <div>Check-ins: {checkInEntries.length}</div>
            <div>Happy: {happyMoments.length}</div>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={loadMockData}
          className="text-xs"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Reload Data
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={resetOnboarding}
          className="text-xs"
        >
          Reset Onboarding
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={clearAllData}
          className="text-xs"
        >
          Clear All
        </Button>
      </div>
    </div>
  );
}

function AppContent() {
  const { addCheckInEntry } = useData();
  const { isAuthenticated, isLoading } = useAuth();
  const [cognitiveClarity, setCognitiveClarity] = useState(7);
  const [physicalEnergy, setPhysicalEnergy] = useState(6);
  const [checkInsCompleted, setCheckInsCompleted] = useState(1);
  const [energyLevel, setEnergyLevel] = useState(66);
  const [showInsight, setShowInsight] = useState(true);
  const [
    cognitiveClaritySelected,
    setCognitiveClaritySelected,
  ] = useState(false);
  const [activeScreen, setActiveScreen] = useState("home");
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check if onboarding should be shown when authentication state changes
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      try {
        const onboardingCompleted = localStorage.getItem(
          "energyApp_onboardingCompleted",
        );
        setShowOnboarding(!onboardingCompleted);
      } catch (error) {
        console.error(
          "Error checking onboarding status:",
          error,
        );
        setShowOnboarding(false);
      }
    }
  }, [isAuthenticated, isLoading]);

  // Handle URL actions for PWA shortcuts
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(
        window.location.search,
      );
      const action = urlParams.get("action");

      if (action && isAuthenticated && !showOnboarding) {
        switch (action) {
          case "checkin":
            setActiveScreen("home");
            break;
          case "track":
            setActiveScreen("track");
            break;
          case "analytics":
            setActiveScreen("analytics");
            break;
        }

        // Clear the URL parameter
        window.history.replaceState(
          {},
          "",
          window.location.pathname,
        );
      }
    } catch (error) {
      console.error("Error handling URL actions:", error);
    }
  }, [isAuthenticated, showOnboarding]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const handleCheckInSubmit = async () => {
    try {
      setCheckInsCompleted((prev) => Math.min(prev + 1, 4));
      // Calculate energy level based on check-ins
      const avgEnergy = Math.round(
        ((cognitiveClarity + physicalEnergy) / 24) * 100,
      );
      setEnergyLevel(avgEnergy);

      // Save check-in entry
      await addCheckInEntry({
        type: getCheckInType(),
        cognitiveClarity,
        physicalEnergy,
      });
    } catch (error) {
      console.error("Error submitting check-in:", error);
      // Don't revert UI changes since data is still saved locally
    }
  };

  const getCheckInType = ():
    | "morning"
    | "midday"
    | "afternoon"
    | "evening" => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 15) return "midday";
    if (hour < 18) return "afternoon";
    return "evening";
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case "track":
        return (
          <TrackScreen onBack={() => setActiveScreen("home")} />
        );
      case "analytics":
        return (
          <AnalyticsScreen
            onBack={() => setActiveScreen("home")}
          />
        );
      case "profile":
        return (
          <ProfileScreen
            onBack={() => setActiveScreen("home")}
          />
        );
      case "home":
      default:
        return (
          <div className="flex-1 pb-20 bg-gradient-pastel">
            <Header />

            <div className="px-6 space-y-6 mt-6">
              <CheckInSection
                cognitiveClarity={cognitiveClarity}
                setCognitiveClarity={setCognitiveClarity}
                physicalEnergy={physicalEnergy}
                setPhysicalEnergy={setPhysicalEnergy}
                checkInsCompleted={checkInsCompleted}
                cognitiveClaritySelected={
                  cognitiveClaritySelected
                }
                setCognitiveClaritySelected={
                  setCognitiveClaritySelected
                }
                onSubmit={handleCheckInSubmit}
              />

              <div className="grid grid-cols-2 gap-4">
                <InsightSection
                  showInsight={showInsight}
                  setShowInsight={setShowInsight}
                  checkInsCompleted={checkInsCompleted}
                  avgEnergyLevel={energyLevel}
                />
                <EnergyLevelSection energyLevel={energyLevel} />
                <div className="col-span-2">
                  <EditableQuickActionTiles />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-pastel flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-magenta-600 rounded-full mb-4">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            {appConfig.name}
          </h2>
          <p className="text-gray-600">
            Loading your energy journey...
          </p>
        </div>
      </div>
    );
  }

  // Show auth flow if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-pastel">
        <AuthFlow />
      </div>
    );
  }

  // Show onboarding if needed
  if (showOnboarding) {
    return (
      <div className="min-h-screen">
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  // Show main app if authenticated and onboarding completed
  return (
    <div className="min-h-screen bg-gradient-pastel flex flex-col max-w-md mx-auto relative">
      {renderScreen()}

      <BottomNavigation
        activeScreen={activeScreen}
        onScreenChange={setActiveScreen}
      />

      {/* Testing Controls - only show in development with flag enabled */}
      {appConfig.enableDevTools && <TestingControls />}
    </div>
  );
}

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize the app environment
  useEffect(() => {
    const initialize = async () => {
      try {
        const success = initializeApp();
        setIsInitialized(true);

        if (!success) {
          console.warn(
            "App initialization had issues but continuing...",
          );
        }
      } catch (error) {
        console.error(
          "Error during app initialization:",
          error,
        );
        setIsInitialized(true); // Allow app to continue even if init fails
      }
    };

    initialize();
  }, []);

  // Show simple loading while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-pastel flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-magenta-600 rounded-full mb-3">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
          <p className="text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
        <Toaster />
      </DataProvider>
    </AuthProvider>
  );
}