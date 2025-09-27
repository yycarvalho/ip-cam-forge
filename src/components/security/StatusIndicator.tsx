import React from 'react';
import { cn } from '@/lib/utils';
import { StatusColor } from '@/types';

interface StatusIndicatorProps {
  status: StatusColor;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  showPulse?: boolean;
  className?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  status, 
  size = 'md', 
  label, 
  showPulse = false,
  className 
}) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const statusClasses = {
    online: 'bg-status-online',
    offline: 'bg-status-offline',
    warning: 'bg-status-warning',
    neutral: 'bg-status-neutral',
  };

  const pulseClasses = {
    online: 'animate-pulse bg-status-online/20',
    offline: 'animate-pulse bg-status-offline/20',
    warning: 'animate-pulse bg-status-warning/20',
    neutral: 'animate-pulse bg-status-neutral/20',
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <div
          className={cn(
            "rounded-full transition-smooth",
            sizeClasses[size],
            statusClasses[status]
          )}
        />
        {showPulse && (
          <div
            className={cn(
              "absolute inset-0 rounded-full",
              sizeClasses[size],
              pulseClasses[status]
            )}
          />
        )}
      </div>
      {label && (
        <span className="text-sm font-medium text-foreground">{label}</span>
      )}
    </div>
  );
};

export default StatusIndicator;