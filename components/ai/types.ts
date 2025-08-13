export interface Insight {
  type: 'positive' | 'warning' | 'recommendation' | 'pattern';
  title: string;
  description: string;
  confidence: 'high' | 'medium' | 'low';
  actionable?: string;
}

export interface AIInsightsProps {
  trackingEntries: any[];
}