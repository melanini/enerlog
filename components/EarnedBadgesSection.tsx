import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Progress } from './ui/progress';
import { 
  Trophy, 
  Moon, 
  Apple, 
  Dumbbell, 
  Droplets, 
  Heart, 
  Zap,
  Target,
  Calendar,
  Award,
  Star,
  Flame,
  Shield,
  Crown,
  Diamond,
  Sparkles,
  Mountain,
  Sun,
  Coffee,
  Smile,
  Info
} from 'lucide-react';
import { TrackingEntry } from '../contexts/DataContext';

interface EarnedBadgesSectionProps {
  trackingEntries: TrackingEntry[];
}

interface UserBadge {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'foundation' | 'consistency' | 'wellness' | 'energy' | 'special' | 'mastery';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  currentProgress: number;
  targetProgress: number;
  isUnlocked: boolean;
  unlockedDate?: Date;
  celebrationMessage: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export function EarnedBadgesSection({ trackingEntries }: EarnedBadgesSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const calculateStreaks = (): Record<string, number> => {
    if (trackingEntries.length === 0) return {};

    const sortedEntries = [...trackingEntries].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const streaks: Record<string, number> = {};
    
    // Helper function to calculate consecutive days
    const calculateConsecutiveDays = (entries: TrackingEntry[], condition: (entry: TrackingEntry) => boolean): number => {
      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let checkDate = new Date(today);
      
      for (let i = 0; i < 30; i++) { // Check last 30 days
        const dayEntries = entries.filter(entry => {
          const entryDate = new Date(entry.timestamp);
          entryDate.setHours(0, 0, 0, 0);
          return entryDate.getTime() === checkDate.getTime();
        });
        
        if (dayEntries.length > 0 && dayEntries.some(condition)) {
          streak++;
        } else if (i === 0) {
          // If today doesn't have the condition, start from yesterday
          checkDate.setDate(checkDate.getDate() - 1);
          continue;
        } else {
          break;
        }
        
        checkDate.setDate(checkDate.getDate() - 1);
      }
      
      return streak;
    };

    // Sleep quality streak (4+ rating)
    streaks.goodSleep = calculateConsecutiveDays(sortedEntries, 
      entry => (entry.lifestyleFactors?.sleep || 0) >= 4
    );

    // Nutrition streak (4+ healthy meals/snacks)
    streaks.healthyNutrition = calculateConsecutiveDays(sortedEntries, 
      entry => (entry.lifestyleFactors?.nutrition || 0) >= 4
    );

    // Exercise streak
    streaks.exercise = calculateConsecutiveDays(sortedEntries, 
      entry => entry.lifestyleFactors?.exercise === true
    );

    // Hydration streak (8+ glasses)
    streaks.hydration = calculateConsecutiveDays(sortedEntries, 
      entry => (entry.lifestyleFactors?.hydration || 0) >= 8
    );

    // Low stress streak
    streaks.lowStress = calculateConsecutiveDays(sortedEntries, 
      entry => entry.stress === 'low'
    );

    // High energy streak (80+ combined energy)
    streaks.highEnergy = calculateConsecutiveDays(sortedEntries, 
      entry => (entry.physicalEnergy + entry.cognitiveClarity) >= 80
    );

    // Daily tracking streak
    streaks.dailyTracking = calculateConsecutiveDays(sortedEntries, 
      () => true // Any entry counts as tracking
    );

    return streaks;
  };

  const streaks = calculateStreaks();

  const badges: UserBadge[] = [
    // Foundation Badges (Bronze Tier)
    {
      id: 'first-steps',
      title: 'First Steps',
      description: 'Complete your first energy check-in',
      icon: <Star className="w-5 h-5" />,
      category: 'foundation',
      tier: 'bronze',
      currentProgress: trackingEntries.length > 0 ? 1 : 0,
      targetProgress: 1,
      isUnlocked: trackingEntries.length > 0,
      celebrationMessage: '🌟 Welcome to your energy journey! First step taken!',
      rarity: 'common'
    },
    {
      id: 'early-riser',
      title: 'Early Riser',
      description: 'Complete 3 morning check-ins',
      icon: <Sun className="w-5 h-5" />,
      category: 'foundation',
      tier: 'bronze',
      currentProgress: trackingEntries.filter(e => e.type === 'morning').length,
      targetProgress: 3,
      isUnlocked: trackingEntries.filter(e => e.type === 'morning').length >= 3,
      celebrationMessage: '🌅 Early Riser! Morning energy tracking mastered!',
      rarity: 'common'
    },
    {
      id: 'hydration-starter',
      title: 'Hydration Starter',
      description: 'Track hydration for 3 days',
      icon: <Droplets className="w-5 h-5" />,
      category: 'foundation',
      tier: 'bronze',
      currentProgress: trackingEntries.filter(e => e.lifestyleFactors?.hydration).length,
      targetProgress: 3,
      isUnlocked: trackingEntries.filter(e => e.lifestyleFactors?.hydration).length >= 3,
      celebrationMessage: '💧 Hydration Starter! Water tracking begins!',
      rarity: 'common'
    },

    // Consistency Badges (Silver Tier)
    {
      id: 'consistency-champion',
      title: 'Consistency Champion',
      description: 'Track daily for 7 consecutive days',
      icon: <Calendar className="w-5 h-5" />,
      category: 'consistency',
      tier: 'silver',
      currentProgress: streaks.dailyTracking || 0,
      targetProgress: 7,
      isUnlocked: (streaks.dailyTracking || 0) >= 7,
      celebrationMessage: '📅 Consistency Champion! 7 days of dedication!',
      rarity: 'uncommon'
    },
    {
      id: 'sleep-guardian',
      title: 'Sleep Guardian',
      description: 'Quality sleep for 7 consecutive days',
      icon: <Moon className="w-5 h-5" />,
      category: 'consistency',
      tier: 'silver',
      currentProgress: streaks.goodSleep || 0,
      targetProgress: 7,
      isUnlocked: (streaks.goodSleep || 0) >= 7,
      celebrationMessage: '🌙 Sleep Guardian! Rest is your strength!',
      rarity: 'uncommon'
    },
    {
      id: 'nutrition-warrior',
      title: 'Nutrition Warrior',
      description: 'Healthy eating for 7 consecutive days',
      icon: <Apple className="w-5 h-5" />,
      category: 'consistency',
      tier: 'silver',
      currentProgress: streaks.healthyNutrition || 0,
      targetProgress: 7,
      isUnlocked: (streaks.healthyNutrition || 0) >= 7,
      celebrationMessage: '🍎 Nutrition Warrior! Fueling greatness daily!',
      rarity: 'uncommon'
    },

    // Wellness Badges (Gold Tier)
    {
      id: 'zen-master',
      title: 'Zen Master',
      description: 'Maintain low stress for 10 consecutive days',
      icon: <Heart className="w-5 h-5" />,
      category: 'wellness',
      tier: 'gold',
      currentProgress: streaks.lowStress || 0,
      targetProgress: 10,
      isUnlocked: (streaks.lowStress || 0) >= 10,
      celebrationMessage: '🧘 Zen Master! Inner peace achieved!',
      rarity: 'rare'
    },
    {
      id: 'fitness-legend',
      title: 'Fitness Legend',
      description: 'Exercise for 14 consecutive days',
      icon: <Dumbbell className="w-5 h-5" />,
      category: 'wellness',
      tier: 'gold',
      currentProgress: streaks.exercise || 0,
      targetProgress: 14,
      isUnlocked: (streaks.exercise || 0) >= 14,
      celebrationMessage: '💪 Fitness Legend! Movement is your medicine!',
      rarity: 'rare'
    },
    {
      id: 'wellness-champion',
      title: 'Wellness Champion',
      description: 'Complete all lifestyle factors for 5 days',
      icon: <Shield className="w-5 h-5" />,
      category: 'wellness',
      tier: 'gold',
      currentProgress: trackingEntries.filter(e => 
        e.lifestyleFactors?.sleep && 
        e.lifestyleFactors?.nutrition && 
        e.lifestyleFactors?.exercise && 
        e.lifestyleFactors?.hydration
      ).length,
      targetProgress: 5,
      isUnlocked: trackingEntries.filter(e => 
        e.lifestyleFactors?.sleep && 
        e.lifestyleFactors?.nutrition && 
        e.lifestyleFactors?.exercise && 
        e.lifestyleFactors?.hydration
      ).length >= 5,
      celebrationMessage: '🛡️ Wellness Champion! Complete lifestyle mastery!',
      rarity: 'rare'
    },

    // Energy Badges (Platinum Tier)
    {
      id: 'energy-master',
      title: 'Energy Master',
      description: 'High energy levels for 10 consecutive days',
      icon: <Zap className="w-5 h-5" />,
      category: 'energy',
      tier: 'platinum',
      currentProgress: streaks.highEnergy || 0,
      targetProgress: 10,
      isUnlocked: (streaks.highEnergy || 0) >= 10,
      celebrationMessage: '⚡ Energy Master! You radiate vitality!',
      rarity: 'epic'
    },
    {
      id: 'peak-performer',
      title: 'Peak Performer',
      description: 'Average energy above 85% for 7 days',
      icon: <Mountain className="w-5 h-5" />,
      category: 'energy',
      tier: 'platinum',
      currentProgress: trackingEntries.filter(e => 
        (e.physicalEnergy + e.cognitiveClarity) >= 85
      ).length >= 7 ? 7 : trackingEntries.filter(e => 
        (e.physicalEnergy + e.cognitiveClarity) >= 85
      ).length,
      targetProgress: 7,
      isUnlocked: trackingEntries.filter(e => 
        (e.physicalEnergy + e.cognitiveClarity) >= 85
      ).length >= 7,
      celebrationMessage: '🏔️ Peak Performer! You\'ve reached new heights!',
      rarity: 'epic'
    },

    // Special Badges (Mixed Tiers)
    {
      id: 'morning-glory',
      title: 'Morning Glory',
      description: 'Complete 10 morning check-ins with high energy',
      icon: <Coffee className="w-5 h-5" />,
      category: 'special',
      tier: 'gold',
      currentProgress: trackingEntries.filter(e => 
        e.type === 'morning' && (e.physicalEnergy + e.cognitiveClarity) >= 80
      ).length,
      targetProgress: 10,
      isUnlocked: trackingEntries.filter(e => 
        e.type === 'morning' && (e.physicalEnergy + e.cognitiveClarity) >= 80
      ).length >= 10,
      celebrationMessage: '☕ Morning Glory! You own the dawn!',
      rarity: 'rare'
    },
    {
      id: 'mood-booster',
      title: 'Mood Booster',
      description: 'Log 15 happy moods',
      icon: <Smile className="w-5 h-5" />,
      category: 'special',
      tier: 'silver',
      currentProgress: trackingEntries.filter(e => e.mood === 'happy').length,
      targetProgress: 15,
      isUnlocked: trackingEntries.filter(e => e.mood === 'happy').length >= 15,
      celebrationMessage: '😊 Mood Booster! Happiness is your superpower!',
      rarity: 'uncommon'
    },

    // Mastery Badges (Diamond Tier)
    {
      id: 'habit-architect',
      title: 'Habit Architect',
      description: 'Track daily for 30 consecutive days',
      icon: <Crown className="w-5 h-5" />,
      category: 'mastery',
      tier: 'diamond',
      currentProgress: streaks.dailyTracking || 0,
      targetProgress: 30,
      isUnlocked: (streaks.dailyTracking || 0) >= 30,
      celebrationMessage: '👑 Habit Architect! You build excellence daily!',
      rarity: 'legendary'
    },
    {
      id: 'ultimate-warrior',
      title: 'Ultimate Warrior',
      description: 'Maintain all streaks for 21 consecutive days',
      icon: <Diamond className="w-5 h-5" />,
      category: 'mastery',
      tier: 'diamond',
      currentProgress: Math.min(
        streaks.goodSleep || 0,
        streaks.healthyNutrition || 0,
        streaks.exercise || 0,
        streaks.hydration || 0,
        streaks.highEnergy || 0
      ),
      targetProgress: 21,
      isUnlocked: Math.min(
        streaks.goodSleep || 0,
        streaks.healthyNutrition || 0,
        streaks.exercise || 0,
        streaks.hydration || 0,
        streaks.highEnergy || 0
      ) >= 21,
      celebrationMessage: '💎 Ultimate Warrior! You are the master of your energy!',
      rarity: 'legendary'
    },
    {
      id: 'energy-sage',
      title: 'Energy Sage',
      description: 'Complete 100 total check-ins',
      icon: <Sparkles className="w-5 h-5" />,
      category: 'mastery',
      tier: 'diamond',
      currentProgress: trackingEntries.length,
      targetProgress: 100,
      isUnlocked: trackingEntries.length >= 100,
      celebrationMessage: '✨ Energy Sage! Wisdom flows through your dedication!',
      rarity: 'legendary'
    }
  ];

  const unlockedBadges = badges.filter(b => b.isUnlocked);
  const nearProgressBadges = badges
    .filter(b => !b.isUnlocked && b.currentProgress >= b.targetProgress * 0.5)
    .slice(0, 4);
  const upcomingBadges = badges
    .filter(b => !b.isUnlocked && b.currentProgress < b.targetProgress * 0.5)
    .slice(0, 4);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'text-amber-700';
      case 'silver': return 'text-gray-600';
      case 'gold': return 'text-yellow-600';
      case 'platinum': return 'text-purple-600';
      case 'diamond': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'bg-amber-100 text-amber-800';
      case 'silver': return 'bg-gray-100 text-gray-700';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'platinum': return 'bg-purple-100 text-purple-700';
      case 'diamond': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'foundation': return 'text-green-600';
      case 'consistency': return 'text-blue-600';
      case 'wellness': return 'text-purple-600';
      case 'energy': return 'text-orange-600';
      case 'special': return 'text-pink-600';
      case 'mastery': return 'text-indigo-600';
      default: return 'text-gray-600';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'common': return '';
      case 'uncommon': return 'ring-2 ring-green-300';
      case 'rare': return 'ring-2 ring-blue-300 shadow-blue-200/50 shadow-lg';
      case 'epic': return 'ring-2 ring-purple-300 shadow-purple-200/50 shadow-lg';
      case 'legendary': return 'ring-2 ring-yellow-300 shadow-yellow-200/50 shadow-xl';
      default: return '';
    }
  };

  if (unlockedBadges.length === 0) {
    return (
      <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-medium text-lg mb-2">No Badges Yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Keep tracking your energy to unlock your first badge!
          </p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Info className="w-4 h-4 mr-2" />
                Learn More
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  Badge Categories
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {/* Categories Overview */}
                <div className="grid grid-cols-2 gap-3">
                  {['foundation', 'consistency', 'wellness', 'energy', 'special', 'mastery'].map((category) => {
                    const categoryBadges = badges.filter(b => b.category === category);
                    const unlockedCount = categoryBadges.filter(b => b.isUnlocked).length;
                    return (
                      <div key={category} className="p-3 bg-white border border-white rounded-lg shadow-sm">
                        <div className="text-center space-y-1">
                          <h4 className={`font-medium text-sm ${getCategoryColor(category)} capitalize`}>
                            {category}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {unlockedCount}/{categoryBadges.length}
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                category === 'foundation' ? 'bg-green-500' :
                                category === 'consistency' ? 'bg-blue-500' :
                                category === 'wellness' ? 'bg-purple-500' :
                                category === 'energy' ? 'bg-orange-500' :
                                category === 'special' ? 'bg-pink-500' :
                                'bg-indigo-500'
                              }`}
                              style={{ width: `${(unlockedCount / categoryBadges.length) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Upcoming Badges */}
                <div>
                  <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-indigo-600" />
                    Next Badges to Unlock
                  </h4>
                  <div className="space-y-3">
                    {badges.filter(b => !b.isUnlocked).slice(0, 6).map((badge) => (
                      <div key={badge.id} className="flex items-center gap-3 p-3 bg-white border border-white rounded-lg shadow-sm">
                        <div className={`${getTierColor(badge.tier)}`}>
                          {badge.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-medium text-sm">{badge.title}</h5>
                            <Badge className={`${getTierBadgeColor(badge.tier)} text-xs`}>
                              {badge.tier}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{badge.description}</p>
                          <div className="mt-2">
                            <Progress 
                              value={(badge.currentProgress / badge.targetProgress) * 100} 
                              className="h-1.5"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              {badge.currentProgress}/{badge.targetProgress}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Your Badges ({unlockedBadges.length})
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Info className="w-4 h-4 mr-2" />
                Learn More
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  Badge Categories
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {/* Categories Overview */}
                <div className="grid grid-cols-2 gap-3">
                  {['foundation', 'consistency', 'wellness', 'energy', 'special', 'mastery'].map((category) => {
                    const categoryBadges = badges.filter(b => b.category === category);
                    const unlockedCount = categoryBadges.filter(b => b.isUnlocked).length;
                    return (
                      <div key={category} className="p-3 bg-white border border-white rounded-lg shadow-sm">
                        <div className="text-center space-y-1">
                          <h4 className={`font-medium text-sm ${getCategoryColor(category)} capitalize`}>
                            {category}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {unlockedCount}/{categoryBadges.length}
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                category === 'foundation' ? 'bg-green-500' :
                                category === 'consistency' ? 'bg-blue-500' :
                                category === 'wellness' ? 'bg-purple-500' :
                                category === 'energy' ? 'bg-orange-500' :
                                category === 'special' ? 'bg-pink-500' :
                                'bg-indigo-500'
                              }`}
                              style={{ width: `${(unlockedCount / categoryBadges.length) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Near Progress Badges */}
                {nearProgressBadges.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-600" />
                      Almost Unlocked!
                    </h4>
                    <div className="space-y-3">
                      {nearProgressBadges.map((badge) => (
                        <div key={badge.id} className="flex items-center gap-3 p-3 bg-white border border-white rounded-lg shadow-sm">
                          <div className={`${getTierColor(badge.tier)}`}>
                            {badge.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-medium text-sm">{badge.title}</h5>
                              <Badge className={`${getTierBadgeColor(badge.tier)} text-xs`}>
                                {badge.tier}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{badge.description}</p>
                            <div className="mt-2">
                              <Progress 
                                value={(badge.currentProgress / badge.targetProgress) * 100} 
                                className="h-1.5"
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                {badge.currentProgress}/{badge.targetProgress}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upcoming Badges */}
                <div>
                  <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-indigo-600" />
                    Upcoming Badges
                  </h4>
                  <div className="space-y-3">
                    {upcomingBadges.map((badge) => (
                      <div key={badge.id} className="flex items-center gap-3 p-3 bg-white border border-white rounded-lg shadow-sm">
                        <div className={`${getTierColor(badge.tier)}`}>
                          {badge.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-medium text-sm">{badge.title}</h5>
                            <Badge className={`${getTierBadgeColor(badge.tier)} text-xs`}>
                              {badge.tier}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{badge.description}</p>
                          <div className="mt-2">
                            <Progress 
                              value={(badge.currentProgress / badge.targetProgress) * 100} 
                              className="h-1.5"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              {badge.currentProgress}/{badge.targetProgress}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {unlockedBadges.slice(-6).map((badge) => (
            <div key={badge.id} className={`p-3 bg-white border-2 border-white rounded-lg shadow-sm ${getRarityGlow(badge.rarity)}`}>
              <div className="text-center space-y-2">
                <div className={`flex justify-center ${getTierColor(badge.tier)}`}>
                  {badge.icon}
                </div>
                <div>
                  <h4 className="font-medium text-xs leading-tight">{badge.title}</h4>
                  <div className="flex justify-center gap-1 mt-1">
                    <Badge className={`${getTierBadgeColor(badge.tier)} text-xs px-1 py-0`}>
                      {badge.tier}
                    </Badge>
                    <Badge className="bg-white text-gray-700 border border-gray-300 text-xs px-1 py-0">
                      ✓
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {unlockedBadges.length > 6 && (
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Showing latest 6 badges • {unlockedBadges.length - 6} more unlocked
          </p>
        )}
      </CardContent>
    </Card>
  );
}