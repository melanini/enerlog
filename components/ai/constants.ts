import { CheckCircle, AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react';

export const INSIGHT_ICONS = {
  positive: CheckCircle,
  warning: AlertTriangle,
  recommendation: Lightbulb,
  pattern: TrendingUp,
  default: Lightbulb,
} as const;

export const INSIGHT_COLORS = {
  positive: 'bg-green-50 border-green-200',
  warning: 'bg-orange-50 border-orange-200',
  recommendation: 'bg-blue-50 border-blue-200',
  pattern: 'bg-purple-50 border-purple-200',
  default: 'bg-gray-50 border-gray-200',
} as const;

export const ICON_COLORS = {
  positive: 'text-green-600',
  warning: 'text-orange-600',
  recommendation: 'text-blue-600',
  pattern: 'text-purple-600',
  default: 'text-gray-600',
} as const;