
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface RequestStatusBadgeProps {
  status: 'pending' | 'inProgress' | 'fulfilled';
  className?: string;
}

const RequestStatusBadge: React.FC<RequestStatusBadgeProps> = ({ status, className }) => {
  const getVariant = () => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'inProgress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'fulfilled':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return '';
    }
  };
  
  const getLabel = () => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'inProgress':
        return 'In Progress';
      case 'fulfilled':
        return 'Fulfilled';
      default:
        return status;
    }
  };
  
  return (
    <Badge className={cn('font-medium border', getVariant(), className)} variant="outline">
      {getLabel()}
    </Badge>
  );
};

export default RequestStatusBadge;
