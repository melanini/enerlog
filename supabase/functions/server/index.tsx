import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';
import aiInsightsApp from './ai-insights.tsx';

const app = new Hono();

// Middleware
app.use('*', cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['*'],
}));
app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Routes

// Get all tracking entries for a user
app.get('/make-server-59c63097/tracking-entries', async (c) => {
  try {
    const entries = await kv.getByPrefix('tracking_entry:');
    const sortedEntries = entries
      .map(entry => JSON.parse(entry))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return c.json({ entries: sortedEntries });
  } catch (error) {
    console.log('Error fetching tracking entries:', error);
    return c.json({ error: 'Failed to fetch tracking entries' }, 500);
  }
});

// Create a new tracking entry
app.post('/make-server-59c63097/tracking-entries', async (c) => {
  try {
    const body = await c.req.json();
    const { mood, stress, cognitiveClarity, physicalEnergy, lifestyle } = body;

    // Validate required fields
    if (!mood || mood.length === 0) {
      return c.json({ error: 'Mood is required' }, 400);
    }
    if (!stress) {
      return c.json({ error: 'Stress level is required' }, 400);
    }
    if (typeof cognitiveClarity !== 'number' || cognitiveClarity < 1 || cognitiveClarity > 12) {
      return c.json({ error: 'Cognitive clarity must be between 1 and 12' }, 400);
    }
    if (typeof physicalEnergy !== 'number' || physicalEnergy < 1 || physicalEnergy > 12) {
      return c.json({ error: 'Physical energy must be between 1 and 12' }, 400);
    }

    const entry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      mood: Array.isArray(mood) ? mood : [mood],
      stress,
      cognitiveClarity,
      physicalEnergy,
      lifestyle: lifestyle || {},
    };

    await kv.set(`tracking_entry:${entry.id}`, JSON.stringify(entry));
    
    console.log('Tracking entry created successfully:', entry.id);
    return c.json({ entry }, 201);
  } catch (error) {
    console.log('Error creating tracking entry:', error);
    return c.json({ error: 'Failed to create tracking entry' }, 500);
  }
});

// Get all check-in entries
app.get('/make-server-59c63097/check-in-entries', async (c) => {
  try {
    const entries = await kv.getByPrefix('check_in_entry:');
    const sortedEntries = entries
      .map(entry => JSON.parse(entry))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return c.json({ entries: sortedEntries });
  } catch (error) {
    console.log('Error fetching check-in entries:', error);
    return c.json({ error: 'Failed to fetch check-in entries' }, 500);
  }
});

// Create a new check-in entry
app.post('/make-server-59c63097/check-in-entries', async (c) => {
  try {
    const body = await c.req.json();
    const { type, cognitiveClarity, physicalEnergy } = body;

    // Validate required fields
    if (!type || !['morning', 'midday', 'afternoon', 'evening'].includes(type)) {
      return c.json({ error: 'Valid check-in type is required' }, 400);
    }
    if (typeof cognitiveClarity !== 'number' || cognitiveClarity < 1 || cognitiveClarity > 12) {
      return c.json({ error: 'Cognitive clarity must be between 1 and 12' }, 400);
    }
    if (typeof physicalEnergy !== 'number' || physicalEnergy < 1 || physicalEnergy > 12) {
      return c.json({ error: 'Physical energy must be between 1 and 12' }, 400);
    }

    const entry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type,
      cognitiveClarity,
      physicalEnergy,
    };

    await kv.set(`check_in_entry:${entry.id}`, JSON.stringify(entry));
    
    console.log('Check-in entry created successfully:', entry.id);
    return c.json({ entry }, 201);
  } catch (error) {
    console.log('Error creating check-in entry:', error);
    return c.json({ error: 'Failed to create check-in entry' }, 500);
  }
});

// Get analytics data
app.get('/make-server-59c63097/analytics', async (c) => {
  try {
    const trackingEntries = await kv.getByPrefix('tracking_entry:');
    const checkInEntries = await kv.getByPrefix('check_in_entry:');
    
    const trackingData = trackingEntries.map(entry => JSON.parse(entry));
    const checkInData = checkInEntries.map(entry => JSON.parse(entry));
    
    // Calculate averages
    const avgCognitiveClarity = trackingData.length > 0 
      ? trackingData.reduce((sum, entry) => sum + entry.cognitiveClarity, 0) / trackingData.length
      : 0;
    
    const avgPhysicalEnergy = trackingData.length > 0
      ? trackingData.reduce((sum, entry) => sum + entry.physicalEnergy, 0) / trackingData.length
      : 0;
    
    // Get mood trends
    const moodCounts = {};
    trackingData.forEach(entry => {
      entry.mood.forEach(mood => {
        moodCounts[mood] = (moodCounts[mood] || 0) + 1;
      });
    });
    
    // Get stress trends
    const stressCounts = {};
    trackingData.forEach(entry => {
      stressCounts[entry.stress] = (stressCounts[entry.stress] || 0) + 1;
    });

    const analytics = {
      totalTrackingEntries: trackingData.length,
      totalCheckInEntries: checkInData.length,
      averages: {
        cognitiveClarity: Math.round(avgCognitiveClarity * 10) / 10,
        physicalEnergy: Math.round(avgPhysicalEnergy * 10) / 10,
      },
      trends: {
        mood: moodCounts,
        stress: stressCounts,
      },
      lastEntry: trackingData.length > 0 
        ? trackingData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
        : null,
    };
    
    return c.json({ analytics });
  } catch (error) {
    console.log('Error fetching analytics:', error);
    return c.json({ error: 'Failed to fetch analytics data' }, 500);
  }
});

// Mount AI insights routes
app.route('/', aiInsightsApp);

// Health check
app.get('/make-server-59c63097/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start the server
Deno.serve(app.fetch);