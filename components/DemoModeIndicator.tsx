import { Badge } from './ui/badge';
import { Info, Wifi, WifiOff } from 'lucide-react';
import { isSupabaseConfigured, isDevelopment } from '../utils/supabase/info';

interface DemoModeIndicatorProps {
  className?: string;
}

export function DemoModeIndicator({ className = '' }: DemoModeIndicatorProps) {
  const isConnected = isSupabaseConfigured();
  
  // Only show in development mode or when explicitly needed
  if (!isDevelopment && isConnected) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {isConnected ? (
        <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
          <Wifi className="h-3 w-3 mr-1" />
          Live Backend
        </Badge>
      ) : (
        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
          <Info className="h-3 w-3 mr-1" />
          Demo Mode
        </Badge>
      )}
    </div>
  );
}