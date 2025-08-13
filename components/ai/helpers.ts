import { Insight } from './types';
import type { TrackingEntry } from '../../contexts/DataContext';

export const generateFallbackInsights = (trackingEntries: any[]): Insight[] => {
  if (trackingEntries.length < 3) {
    return [{
      type: 'recommendation',
      title: 'Build Your Data Foundation',
      description: 'Track for at least 3 days to unlock personalized AI insights and recommendations.',
      confidence: 'high',
      actionable: 'Continue daily tracking to see meaningful patterns emerge.'
    }];
  }

  const insights: Insight[] = [];
  const recentEntries = trackingEntries.slice(-14); // Last 2 weeks
  const veryRecentEntries = trackingEntries.slice(-7); // Last week

  // Sleep Quality Analysis
  const sleepQuality = recentEntries.map(e => e.lifestyleFactors?.sleep || 3);
  const avgSleep = sleepQuality.reduce((a, b) => a + b, 0) / sleepQuality.length;
  const poorSleepDays = sleepQuality.filter(s => s <= 2).length;

  if (avgSleep >= 4) {
    insights.push({
      type: 'positive',
      title: 'Excellent Sleep Patterns',
      description: `Your average sleep quality is ${avgSleep.toFixed(1)}/5. Great sleep is strongly correlated with higher energy levels.`,
      confidence: 'high',
      actionable: 'Maintain your current sleep routine - it\'s working well for your energy levels.'
    });
  } else if (poorSleepDays >= 3) {
    insights.push({
      type: 'warning',
      title: 'Sleep Quality Concerns',
      description: `You've had ${poorSleepDays} days of poor sleep recently. Sleep quality has the highest correlation with your energy levels.`,
      confidence: 'high',
      actionable: 'Consider establishing a consistent bedtime routine and optimizing your sleep environment.'
    });
  }

  // Energy Trend Analysis
  const energyLevels = veryRecentEntries.map(e => (e.physicalEnergy + e.cognitiveClarity) / 2);
  const energyTrend = energyLevels.length >= 3 ? 
    (energyLevels.slice(-3).reduce((a, b) => a + b) / 3) - (energyLevels.slice(0, 3).reduce((a, b) => a + b) / 3) : 0;

  if (energyTrend > 5) {
    insights.push({
      type: 'positive',
      title: 'Energy Levels Trending Up',
      description: `Your energy has increased by ${Math.round(energyTrend)} points this week. Your recent lifestyle changes are paying off!`,
      confidence: 'high'
    });
  } else if (energyTrend < -5) {
    insights.push({
      type: 'warning',
      title: 'Energy Decline Detected',
      description: `Your energy has decreased by ${Math.round(Math.abs(energyTrend))} points recently. Let's identify what might be affecting you.`,
      confidence: 'medium',
      actionable: 'Review your sleep, nutrition, and stress levels from the past week to identify potential causes.'
    });
  }

  // Exercise Analysis
  const exerciseDays = recentEntries.filter(e => e.lifestyleFactors?.exercise).length;
  if (exerciseDays <= 1) {
    insights.push({
      type: 'recommendation',
      title: 'Movement Opportunity',
      description: 'You\'ve exercised only once recently. Regular movement often correlates with higher energy levels.',
      confidence: 'medium',
      actionable: 'Try incorporating light exercise like a 10-minute walk to see how it affects your energy.'
    });
  } else if (exerciseDays >= 5) {
    insights.push({
      type: 'positive',
      title: 'Active Lifestyle',
      description: `You've been active ${exerciseDays} times recently! Regular exercise is a key factor in maintaining consistent energy levels.`,
      confidence: 'high',
      actionable: 'Keep up your excellent exercise routine - it\'s supporting your energy levels.'
    });
  }

  // Hydration Analysis
  const hydrationLevels = recentEntries.map(e => e.lifestyleFactors?.hydration || 0);
  const avgHydration = hydrationLevels.reduce((a, b) => a + b, 0) / hydrationLevels.length;
  if (avgHydration < 6 && insights.length < 4) {
    insights.push({
      type: 'recommendation',
      title: 'Hydration Focus',
      description: 'Your hydration tracking suggests room for improvement. Proper hydration supports energy and cognitive function.',
      confidence: 'medium',
      actionable: 'Aim for 8-10 glasses of water daily and notice how it affects your energy.'
    });
  }

  // General motivation if we don't have enough insights
  if (insights.length < 2) {
    insights.push({
      type: 'positive',
      title: 'Building Momentum',
      description: 'Every day you track brings you closer to understanding your unique energy patterns and optimizing your wellbeing.',
      confidence: 'high',
      actionable: 'Continue your consistent tracking to unlock deeper insights about your energy.'
    });
  }

  return insights.slice(0, 5);
};

export const formatTrackingEntriesForAPI = (trackingEntries: any[]) => {
  return trackingEntries.map(entry => ({
    timestamp: entry.timestamp.toISOString(),
    physicalEnergy: entry.physicalEnergy,
    cognitiveClarity: entry.cognitiveClarity,
    mood: entry.mood,
    stress: entry.stress,
    lifestyleFactors: entry.lifestyleFactors
  }));
};