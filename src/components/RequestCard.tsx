
import React from 'react';
import { ResourceRequest } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock } from 'lucide-react';
import ResourceTypeBadge from './ResourceTypeBadge';
import UrgencyBadge from './UrgencyBadge';
import RequestStatusBadge from './RequestStatusBadge';
import { useApp } from '@/contexts/AppContext';

interface RequestCardProps {
  request: ResourceRequest;
  showActions?: boolean;
}

const RequestCard: React.FC<RequestCardProps> = ({ request, showActions = false }) => {
  const { updateRequestStatus, currentUser } = useApp();
  
  // Format the date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const handleUpdateStatus = (status: 'pending' | 'inProgress' | 'fulfilled') => {
    updateRequestStatus(request.id, status);
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">Request #{request.id.substring(0, 6)}</CardTitle>
          <RequestStatusBadge status={request.status} />
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex flex-wrap gap-2 mb-3">
          {request.resourceTypes.map(type => (
            <ResourceTypeBadge key={type} type={type} />
          ))}
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <MapPin size={16} className="mr-1" />
            <span>{request.location.address}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock size={16} className="mr-1" />
            <span>{formatDate(request.createdAt)}</span>
          </div>
          <div className="mt-2">
            <UrgencyBadge level={request.urgency} />
          </div>
        </div>
        
        {request.notes && (
          <div className="mt-3 pt-3 border-t text-sm">
            <p className="text-muted-foreground">{request.notes}</p>
          </div>
        )}
      </CardContent>
      
      {showActions && currentUser?.role === 'ngo' && (
        <CardFooter className="pt-0 flex-wrap gap-2">
          <Button 
            size="sm" 
            variant={request.status === 'pending' ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => handleUpdateStatus('pending')}
            disabled={request.status === 'pending'}
          >
            Mark Pending
          </Button>
          <Button 
            size="sm" 
            variant={request.status === 'inProgress' ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => handleUpdateStatus('inProgress')}
            disabled={request.status === 'inProgress'}
          >
            In Progress
          </Button>
          <Button 
            size="sm" 
            variant={request.status === 'fulfilled' ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => handleUpdateStatus('fulfilled')}
            disabled={request.status === 'fulfilled'}
          >
            Mark Fulfilled
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default RequestCard;
