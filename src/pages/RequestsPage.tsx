
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import RequestCard from '@/components/RequestCard';
import { Plus } from 'lucide-react';

const RequestsPage = () => {
  const { requests, currentUser, isLoading } = useApp();
  
  // Filter requests based on user
  const userRequests = currentUser?.role === 'citizen'
    ? requests.filter(req => req.citizenId === currentUser.id)
    : [];
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Requests</h1>
          <Button asChild>
            <Link to="/requests/new">
              <Plus size={18} className="mr-2" /> New Request
            </Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse-subtle">Loading requests...</div>
          </div>
        ) : userRequests.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userRequests.map(request => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">You don't have any requests yet.</p>
            <Button asChild>
              <Link to="/requests/new">
                <Plus size={18} className="mr-2" /> Create New Request
              </Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RequestsPage;
