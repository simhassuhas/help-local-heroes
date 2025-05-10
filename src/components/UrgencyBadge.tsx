
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { UrgencyLevel } from '@/types';
import { cn } from '@/lib/utils';

interface UrgencyBadgeProps {
  level: UrgencyLevel;
  className?: string;
}

const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ level, className }) => {
  const getVariant = () => {
    switch (level) {
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return '';
    }
  };
  
  const getLabel = () => {
    switch (level) {
      case 'low':
        return 'Low Urgency';
      case 'medium':
        return 'Medium Urgency';
      case 'high':
        return 'High Urgency';
      default:
        return level;
    }
  };
  
  return (
    <Badge className={cn('font-medium border', getVariant(), className)} variant="outline">
      {getLabel()}
    </Badge>
  );
};

export default UrgencyBadge;
