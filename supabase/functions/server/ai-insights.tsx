import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';

const app = new Hono();

// Enable CORS
app.use('*', cors({
  origin: '*',
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

interface TrackingEntry {
  timestamp: string;
  physicalEnergy: number;
  cognitiveClarity: number;
  mood: string;
  stress: string;
  lifestyleFactors?: {
    sleep?: number;
    exercise?: boolean;
    nutrition?: number;
    hydration?: number;
    caffeine?: number;
    customTrackers?: Record<string, any>;
  };
}

interface AIInsight {
  type: 'positive' | 'warning' | 'recommendation' | 'pattern';
  title: string;
  description: string;
  confidence: 'high' | 'medium' | 'low';
  actionable?: string;
}

app.post('/make-server-59c63097/ai-insights', async (c) => {
  try {
    console.log('AI Insights request received');
    const body = await c.req.json();
    const { trackingEntries } = body;

    console.log(`Processing ${trackingEntries?.length || 0} tracking entries`);

    if (!trackingEntries || !Array.isArray(trackingEntries)) {
      console.error('Invalid tracking entries provided:', trackingEntries);
      return c.json({ error: 'Invalid tracking entries provided' }, 400);
    }

    if (trackingEntries.length < 3) {
      console.log('Insufficient data, returning onboarding insight');
      return c.json({ 
        insights: [{
          type: 'recommendation',
          title: 'Build Your Data Foundation',
          description: 'Track for at least 3 days to unlock personalized AI insights and recommendations.',
          confidence: 'high',
          actionable: 'Continue daily tracking to see meaningful patterns emerge.'
        }]
      });
    }

    // Prepare data summary for AI analysis
    const recentEntries = trackingEntries.slice(-14); // Last 2 weeks
    const dataForAI = prepareDataForAI(recentEntries);

    // Call OpenAI API
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('OpenAI API key not found in environment variables');
      return c.json({ error: 'AI service configuration error' }, 500);
    }

    console.log('Generating AI insights with OpenAI API...');
    const insights = await generateAIInsights(dataForAI, openaiApiKey);
    
    console.log(`Generated ${insights.length} AI insights successfully`);
    return c.json({ insights });

  } catch (error) {
    // Only log non-quota related errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (!errorMessage.includes('429') && !errorMessage.includes('quota') && !errorMessage.includes('rate limit')) {
      console.error('Critical error in AI insights endpoint:', error);
    } else {
      console.log('AI service temporarily unavailable, using fallback insights');
    }
    
    // Always return insights, even if there's an error - never fail completely
    const fallbackInsights = [
      {
        type: 'recommendation',
        title: 'Keep Tracking',
        description: 'Your energy tracking journey is valuable. Continue logging your daily patterns to build a comprehensive wellness profile.',
        confidence: 'high',
        actionable: 'Maintain consistent daily tracking to unlock more personalized insights.'
      }
    ];
    
    return c.json({ insights: fallbackInsights });
  }
});

function prepareDataForAI(entries: TrackingEntry[]): string {
  // Calculate key metrics
  const avgPhysicalEnergy = entries.reduce((sum, e) => sum + e.physicalEnergy, 0) / entries.length;
  const avgCognitiveClarity = entries.reduce((sum, e) => sum + e.cognitiveClarity, 0) / entries.length;
  const avgCombinedEnergy = (avgPhysicalEnergy + avgCognitiveClarity) / 2;

  // Sleep analysis
  const sleepRatings = entries.map(e => e.lifestyleFactors?.sleep || 0).filter(s => s > 0);
  const avgSleep = sleepRatings.length > 0 ? sleepRatings.reduce((a, b) => a + b, 0) / sleepRatings.length : 0;
  const poorSleepDays = sleepRatings.filter(s => s <= 2).length;
  const goodSleepDays = sleepRatings.filter(s => s >= 4).length;

  // Exercise analysis
  const exerciseDays = entries.filter(e => e.lifestyleFactors?.exercise).length;
  const exerciseRate = (exerciseDays / entries.length) * 100;

  // Stress analysis
  const highStressDays = entries.filter(e => e.stress === 'high').length;
  const lowStressDays = entries.filter(e => e.stress === 'low').length;

  // Hydration analysis
  const hydrationLevels = entries.map(e => e.lifestyleFactors?.hydration || 0);
  const avgHydration = hydrationLevels.reduce((a, b) => a + b, 0) / hydrationLevels.length;

  // Nutrition analysis
  const nutritionLevels = entries.map(e => e.lifestyleFactors?.nutrition || 0);
  const avgNutrition = nutritionLevels.reduce((a, b) => a + b, 0) / nutritionLevels.length;

  // Mood distribution
  const moodCounts = entries.reduce((acc, e) => {
    acc[e.mood] = (acc[e.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Energy trends (compare first half vs second half)
  const firstHalf = entries.slice(0, Math.floor(entries.length / 2));
  const secondHalf = entries.slice(Math.floor(entries.length / 2));
  
  const firstHalfAvg = firstHalf.reduce((sum, e) => sum + (e.physicalEnergy + e.cognitiveClarity) / 2, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, e) => sum + (e.physicalEnergy + e.cognitiveClarity) / 2, 0) / secondHalf.length;
  const energyTrend = secondHalfAvg - firstHalfAvg;

  // Exercise vs non-exercise days energy comparison
  const exerciseEntries = entries.filter(e => e.lifestyleFactors?.exercise);
  const nonExerciseEntries = entries.filter(e => !e.lifestyleFactors?.exercise);
  
  const exerciseEnergyAvg = exerciseEntries.length > 0 
    ? exerciseEntries.reduce((sum, e) => sum + (e.physicalEnergy + e.cognitiveClarity) / 2, 0) / exerciseEntries.length 
    : 0;
  const nonExerciseEnergyAvg = nonExerciseEntries.length > 0
    ? nonExerciseEntries.reduce((sum, e) => sum + (e.physicalEnergy + e.cognitiveClarity) / 2, 0) / nonExerciseEntries.length
    : 0;

  return `
User Energy Tracking Data Summary (${entries.length} days):

ENERGY METRICS:
- Average Physical Energy: ${avgPhysicalEnergy.toFixed(1)}/100
- Average Cognitive Clarity: ${avgCognitiveClarity.toFixed(1)}/100
- Combined Energy Average: ${avgCombinedEnergy.toFixed(1)}/100
- Energy Trend: ${energyTrend > 0 ? 'Improving' : energyTrend < 0 ? 'Declining' : 'Stable'} (${energyTrend.toFixed(1)} point change)

SLEEP:
- Average Sleep Quality: ${avgSleep.toFixed(1)}/5
- Poor Sleep Days (≤2): ${poorSleepDays}
- Good Sleep Days (≥4): ${goodSleepDays}

LIFESTYLE FACTORS:
- Exercise Days: ${exerciseDays}/${entries.length} (${exerciseRate.toFixed(1)}%)
- Energy on Exercise Days: ${exerciseEnergyAvg.toFixed(1)}/100
- Energy on Non-Exercise Days: ${nonExerciseEnergyAvg.toFixed(1)}/100
- Average Hydration: ${avgHydration.toFixed(1)} glasses/day
- Average Nutrition Score: ${avgNutrition.toFixed(1)}/5

STRESS & MOOD:
- High Stress Days: ${highStressDays}
- Low Stress Days: ${lowStressDays}
- Mood Distribution: ${Object.entries(moodCounts).map(([mood, count]) => `${mood}: ${count}`).join(', ')}

PATTERNS TO ANALYZE:
- Correlation between sleep quality and energy levels
- Impact of exercise on daily energy
- Stress patterns and their effect on well-being
- Hydration and nutrition impact on performance
- Weekly patterns (weekday vs weekend energy)
`;
}

async function generateAIInsights(dataForAI: string, apiKey: string): Promise<AIInsight[]> {
  console.log('Calling OpenAI API for insights generation...');
  const prompt = `
As an AI wellness coach, analyze this user's energy tracking data and provide 3-5 personalized insights. Focus on:

1. Identifying patterns and correlations in their data
2. Providing actionable recommendations for improvement
3. Celebrating positive trends and achievements
4. Warning about concerning patterns

For each insight, categorize as:
- "positive": Celebrating good patterns or achievements
- "warning": Alerting to concerning trends that need attention  
- "recommendation": Suggesting specific actions to improve
- "pattern": Highlighting interesting correlations discovered

Provide confidence level (high/medium/low) based on data quality and sample size.

Data to analyze:
${dataForAI}

Respond in JSON format with an array of insights, each containing:
{
  "type": "positive|warning|recommendation|pattern",
  "title": "Brief title (max 25 chars)",
  "description": "Clear explanation of the insight",
  "confidence": "high|medium|low",
  "actionable": "Specific action the user can take (optional)"
}
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert wellness coach and data analyst. Provide actionable, personalized insights based on energy tracking data. Be encouraging but honest about areas for improvement.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { error: { message: errorText } };
      }

      // Handle quota and rate limit errors silently with fallback
      if (response.status === 429) {
        if (errorData?.error?.code === 'insufficient_quota') {
          console.log('OpenAI quota exceeded, using rule-based insights');
        } else {
          console.log('OpenAI rate limit exceeded, using rule-based insights');
        }
        return generateRuleBasedInsights(dataForAI);
      } else {
        // Only log non-quota errors
        console.error(`OpenAI API error: ${response.status} ${response.statusText}`, errorData);
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }
    }

    const data = await response.json();
    console.log('OpenAI API response received successfully');
    const content = data.choices[0].message.content;
    
    // Parse the JSON response
    let insights;
    try {
      insights = JSON.parse(content);
      console.log('Successfully parsed AI insights JSON');
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', content);
      console.log('Falling back to rule-based insights due to JSON parse error');
      return generateRuleBasedInsights(dataForAI);
    }
    
    // Validate and limit to 5 insights
    const validatedInsights = insights.slice(0, 5).map((insight: any, index: number) => ({
      type: insight.type || 'recommendation',
      title: insight.title || `Insight ${index + 1}`,
      description: insight.description || 'No description available',
      confidence: insight.confidence || 'medium',
      actionable: insight.actionable || undefined
    }));
    
    console.log(`Validated and processed ${validatedInsights.length} insights`);
    return validatedInsights;

  } catch (error) {
    // Only log errors that aren't quota/rate limit related
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (!errorMessage.includes('429') && !errorMessage.includes('quota') && !errorMessage.includes('rate limit')) {
      console.error('OpenAI API integration failed:', error);
    } else {
      console.log('OpenAI service unavailable, using rule-based insights');
    }
    return generateRuleBasedInsights(dataForAI);
  }
}

function generateRuleBasedInsights(dataForAI: string): AIInsight[] {
  console.log('Generating rule-based insights as fallback');
  
  // Parse the data summary to extract key metrics
  const lines = dataForAI.split('\n');
  const insights: AIInsight[] = [];
  
  try {
    // Extract energy metrics
    const avgEnergyLine = lines.find(line => line.includes('Combined Energy Average:'));
    const energyTrendLine = lines.find(line => line.includes('Energy Trend:'));
    const avgSleepLine = lines.find(line => line.includes('Average Sleep Quality:'));
    const exerciseLine = lines.find(line => line.includes('Exercise Days:'));
    const hydrationLine = lines.find(line => line.includes('Average Hydration:'));
    
    // Energy analysis
    if (avgEnergyLine) {
      const energyMatch = avgEnergyLine.match(/(\d+\.?\d*)/);
      const avgEnergy = energyMatch ? parseFloat(energyMatch[1]) : 0;
      
      if (avgEnergy >= 75) {
        insights.push({
          type: 'positive',
          title: 'Strong Energy Levels',
          description: `Your average energy level of ${avgEnergy.toFixed(1)}% is excellent. You're maintaining great energy consistency.`,
          confidence: 'high',
          actionable: 'Keep up your current routine - it\'s working well for your energy levels.'
        });
      } else if (avgEnergy < 50) {
        insights.push({
          type: 'warning',
          title: 'Energy Boost Needed',
          description: `Your average energy level of ${avgEnergy.toFixed(1)}% suggests room for improvement.`,
          confidence: 'high',
          actionable: 'Focus on improving sleep quality, regular exercise, and stress management.'
        });
      }
    }

    // Sleep analysis
    if (avgSleepLine) {
      const sleepMatch = avgSleepLine.match(/(\d+\.?\d*)/);
      const avgSleep = sleepMatch ? parseFloat(sleepMatch[1]) : 0;
      
      if (avgSleep >= 4) {
        insights.push({
          type: 'positive',
          title: 'Quality Sleep Habits',
          description: `Your sleep quality of ${avgSleep.toFixed(1)}/5 is excellent and strongly supports your energy levels.`,
          confidence: 'high'
        });
      } else if (avgSleep < 3) {
        insights.push({
          type: 'recommendation',
          title: 'Sleep Improvement Focus',
          description: `Your sleep quality of ${avgSleep.toFixed(1)}/5 could be improved. Better sleep is the foundation of good energy.`,
          confidence: 'high',
          actionable: 'Establish a consistent bedtime routine and optimize your sleep environment.'
        });
      }
    }

    // Exercise analysis
    if (exerciseLine) {
      const exerciseMatch = exerciseLine.match(/(\d+)\/(\d+)/);
      if (exerciseMatch) {
        const exerciseDays = parseInt(exerciseMatch[1]);
        const totalDays = parseInt(exerciseMatch[2]);
        const exerciseRate = (exerciseDays / totalDays) * 100;
        
        if (exerciseRate >= 50) {
          insights.push({
            type: 'positive',
            title: 'Active Lifestyle',
            description: `You've exercised ${exerciseDays} out of ${totalDays} days (${exerciseRate.toFixed(0)}%). Regular movement supports sustained energy.`,
            confidence: 'high'
          });
        } else if (exerciseRate < 25) {
          insights.push({
            type: 'recommendation',
            title: 'Move More Opportunity',
            description: `You've exercised ${exerciseDays} out of ${totalDays} days. Regular movement can significantly boost energy levels.`,
            confidence: 'medium',
            actionable: 'Try to incorporate light exercise like walking or stretching into your daily routine.'
          });
        }
      }
    }

    // Hydration analysis
    if (hydrationLine) {
      const hydrationMatch = hydrationLine.match(/(\d+\.?\d*)/);
      const avgHydration = hydrationMatch ? parseFloat(hydrationMatch[1]) : 0;
      
      if (avgHydration < 6) {
        insights.push({
          type: 'recommendation',
          title: 'Hydration Focus',
          description: `Your average of ${avgHydration.toFixed(1)} glasses of water per day is below optimal levels.`,
          confidence: 'medium',
          actionable: 'Aim for 8-10 glasses of water daily to support your energy and cognitive function.'
        });
      }
    }

    // Energy trend analysis
    if (energyTrendLine) {
      if (energyTrendLine.includes('Improving')) {
        insights.push({
          type: 'positive',
          title: 'Positive Energy Trend',
          description: 'Your energy levels are trending upward. Your recent lifestyle changes are making a positive impact.',
          confidence: 'high',
          actionable: 'Continue with your current routine - you\'re on the right track!'
        });
      } else if (energyTrendLine.includes('Declining')) {
        insights.push({
          type: 'pattern',
          title: 'Energy Trend Alert',
          description: 'Your energy levels have been declining recently. Let\'s identify what might be affecting you.',
          confidence: 'medium',
          actionable: 'Review your sleep, stress levels, and lifestyle changes from the past week.'
        });
      }
    }

    // If we don't have enough insights, add meaningful fallbacks
    if (insights.length === 0) {
      insights.push({
        type: 'recommendation',
        title: 'Build Your Foundation',
        description: 'Continue tracking consistently to discover patterns in your energy levels and lifestyle factors.',
        confidence: 'high',
        actionable: 'Track daily for at least a week to see meaningful patterns emerge.'
      });
    }

    // Always include a motivational insight if we have space
    if (insights.length < 3) {
      insights.push({
        type: 'positive',
        title: 'Progress in Motion',
        description: 'Every day you track is a step toward better understanding your energy patterns and optimizing your wellbeing.',
        confidence: 'high',
        actionable: 'Continue your tracking streak to build momentum and discover insights.'
      });
    }

    console.log(`Generated ${insights.length} rule-based insights`);
    return insights.slice(0, 5);
    
  } catch (error) {
    console.error('Error generating rule-based insights:', error);
    return [
      {
        type: 'recommendation',
        title: 'Analysis Unavailable',
        description: 'Unable to generate insights at this time. Your tracking journey is valuable - keep it up!',
        confidence: 'high',
        actionable: 'Continue daily tracking to build your energy pattern database.'
      }
    ];
  }
}

export default app;