
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ResourceType } from '@/types';
import { cn } from '@/lib/utils';

interface ResourceTypeBadgeProps {
  type: ResourceType;
  className?: string;
}

const ResourceTypeBadge: React.FC<ResourceTypeBadgeProps> = ({ type, className }) => {
  const getVariant = () => {
    switch (type) {
      case 'food':
        return 'bg-food-light text-red-800 border-red-300';
      case 'shelter':
        return 'bg-shelter-light text-green-800 border-green-300';
      case 'healthcare':
        return 'bg-healthcare-light text-blue-800 border-blue-300';
      default:
        return '';
    }
  };
  
  const getLabel = () => {
    switch (type) {
      case 'food':
        return 'Food & Water';
      case 'shelter':
        return 'Shelter';
      case 'healthcare':
        return 'Healthcare';
      default:
        return type;
    }
  };
  
  return (
    <Badge className={cn('font-medium border', getVariant(), className)} variant="outline">
      {getLabel()}
    </Badge>
  );
};

export default ResourceTypeBadge;
