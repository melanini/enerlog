import React from 'react';
import { Badge } from '../ui/badge';
import { Insight } from './types';
import { INSIGHT_ICONS, INSIGHT_COLORS, ICON_COLORS } from './constants';

interface InsightCardProps {
  insight: Insight;
  index: number;
}

export function InsightCard({ insight, index }: InsightCardProps) {
  const IconComponent = INSIGHT_ICONS[insight.type] || INSIGHT_ICONS.default;
  const colorClass = INSIGHT_COLORS[insight.type] || INSIGHT_COLORS.default;
  const iconColor = ICON_COLORS[insight.type] || ICON_COLORS.default;

  return (
    <div className={`p-4 rounded-lg border ${colorClass}`}>
      <div className="flex items-start gap-3">
        <IconComponent className={`w-5 h-5 ${iconColor}`} />
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm">{insight.title}</h4>
            <Badge variant="outline" className="text-xs">
              {insight.confidence} confidence
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {insight.description}
          </p>
          {insight.actionable && (
            <p className="text-sm font-medium text-gray-700 mt-2">
              💡 {insight.actionable}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}