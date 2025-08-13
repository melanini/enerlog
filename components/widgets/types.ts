export type WidgetType = 'work-timer' | 'happy-moment' | 'mood-tracker' | 'water-reminder';

export interface Widget {
  id: string;
  type: WidgetType;
  position: number;
}

export interface WidgetDefinition {
  type: WidgetType;
  name: string;
  description: string;
  icon: string;
}