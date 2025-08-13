import { ArrowLeft } from 'lucide-react';
import { Button } from './button';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  variant?: 'default' | 'minimal';
}

export function ScreenHeader({ 
  title, 
  subtitle, 
  onBack, 
  rightElement, 
  variant = 'default' 
}: ScreenHeaderProps) {
  return (
    <div className={`${
      variant === 'minimal' 
        ? 'bg-transparent border-0' 
        : 'bg-card/80 backdrop-blur-sm border-b border-border/50'
    } sticky top-0 z-50`}>
      <div className="flex items-center justify-between p-4 max-w-md mx-auto">
        <div className="flex items-center min-w-0 flex-1">
          {onBack && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onBack}
              className="shrink-0 mr-3 hover:bg-accent/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          
          <div className={`min-w-0 ${onBack ? '' : 'text-center flex-1'}`}>
            <h1 className="text-xl font-semibold text-foreground truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground truncate mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        {rightElement && (
          <div className="shrink-0 ml-3">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}