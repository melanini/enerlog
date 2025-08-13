import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Lightbulb, Loader2, RefreshCw, AlertTriangle } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import { InsightCard } from './ai/InsightCard';
import { generateFallbackInsights, formatTrackingEntriesForAPI } from './ai/helpers';
import { Insight, AIInsightsProps } from './ai/types';

export function AIInsights({ trackingEntries }: AIInsightsProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAIInsights();
  }, [trackingEntries]);

  const fetchAIInsights = async () => {
    try {
      setLoading(true);
      setError(null);

      const formattedEntries = formatTrackingEntriesForAPI(trackingEntries);

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-59c63097/ai-insights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          trackingEntries: formattedEntries
        }),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          // If we can't parse the error response, just use a generic message
          errorData = { error: 'Service temporarily unavailable' };
        }
        
        // Handle quota errors gracefully without throwing
        if (response.status === 429) {
          console.log('AI insights service temporarily unavailable, using fallback');
          setInsights(generateFallbackInsights(trackingEntries));
          return;
        }
        
        throw new Error(errorData.error || 'Failed to fetch AI insights');
      }

      const data = await response.json();
      setInsights(data.insights || []);
      
      // Only show success toast if we got meaningful insights (not just fallback)
      if (data.insights && data.insights.length > 0) {
        const hasAIInsights = !data.insights.some(insight => 
          insight.title === 'AI Analysis Unavailable' || 
          insight.title === 'Analysis Unavailable' ||
          insight.title === 'Keep Tracking'
        );
        
        if (hasAIInsights) {
          toast.success('AI insights updated successfully');
        } else {
          console.log('Received fallback insights due to API limitations');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load AI insights';
      
      // Handle quota/rate limit errors silently
      if (errorMessage.includes('quota') || errorMessage.includes('429') || errorMessage.includes('rate limit')) {
        console.log('AI insights service temporarily unavailable, using fallback insights');
        setError(null); // Don't show error state for quota issues
      } else {
        console.error('Error fetching AI insights:', err);
        setError(errorMessage);
        toast.error(`AI insights unavailable: ${errorMessage}`);
      }
      
      setInsights(generateFallbackInsights(trackingEntries));
    } finally {
      setLoading(false);
    }
  };

  const renderLoadingState = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 rounded-lg border bg-muted/20 animate-pulse">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-muted rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-1/3"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderErrorState = () => (
    <div className="p-4 rounded-lg border border-orange-200 bg-orange-50">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-orange-600" />
        <div className="flex-1">
          <h4 className="font-medium text-sm text-orange-800">AI Insights Unavailable</h4>
          <p className="text-sm text-orange-700">
            {error}. Showing basic analysis instead.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-purple-600" />
            AI Insights & Recommendations
            {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAIInsights}
            disabled={loading}
            className="h-8"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {loading ? renderLoadingState() : error ? renderErrorState() : insights.map((insight, index) => (
          <InsightCard key={index} insight={insight} index={index} />
        ))}
        
        {!loading && !error && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              AI insights are powered by OpenAI and based on your personal tracking patterns. 
              Continue tracking to improve accuracy and discover new patterns.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}