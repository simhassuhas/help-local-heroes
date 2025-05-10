
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RequestCard from '@/components/RequestCard';
import StatCard from '@/components/StatCard';
import { generateStatistics } from '@/services/mockData';
import { ArrowRight, BarChart3, MapPin } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const DashboardPage = () => {
  const { requests, isLoading } = useApp();
  
  // Calculate statistics
  const stats = useMemo(() => {
    return generateStatistics(requests);
  }, [requests]);
  
  // Prepare chart data
  const resourceTypeData = useMemo(() => {
    return [
      { name: 'Food', value: stats.foodRequests, color: '#e53935' },
      { name: 'Shelter', value: stats.shelterRequests, color: '#43a047' },
      { name: 'Healthcare', value: stats.healthcareRequests, color: '#1e88e5' },
    ];
  }, [stats]);
  
  const statusData = useMemo(() => {
    return [
      { name: 'Pending', value: stats.pendingRequests },
      { name: 'In Progress', value: stats.inProgressRequests },
      { name: 'Fulfilled', value: stats.fulfilledRequests },
    ];
  }, [stats]);
  
  // Get recent requests
  const recentRequests = useMemo(() => {
    return [...requests]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }, [requests]);
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">NGO Dashboard</h1>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse-subtle">Loading dashboard data...</div>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard 
                title="Total Requests" 
                value={stats.totalRequests} 
                description="All time requests" 
              />
              <StatCard 
                title="Pending Requests" 
                value={stats.pendingRequests} 
                description="Awaiting fulfillment" 
              />
              <StatCard 
                title="High Urgency" 
                value={stats.highUrgency} 
                description="Requires immediate attention" 
              />
              <StatCard 
                title="Fulfillment Rate" 
                value={`${stats.fulfillmentRate}%`} 
                description="Requests marked as fulfilled" 
              />
            </div>
            
            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Request Distribution by Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={resourceTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {resourceTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Request Status Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={statusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Requests" fill="#0ea5e9" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Requests & Quick Links */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Requests */}
              <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold mb-4">Recent Requests</h2>
                <div className="space-y-4">
                  {recentRequests.map(request => (
                    <RequestCard key={request.id} request={request} showActions />
                  ))}
                  <div className="text-right">
                    <Button variant="link" asChild>
                      <Link to="/ngo/map">
                        View All Requests <ArrowRight size={16} className="ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Quick Links */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/ngo/map">
                      <MapPin className="mr-2 h-5 w-5" /> View Resource Map
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/ngo/dashboard">
                      <BarChart3 className="mr-2 h-5 w-5" /> Refresh Dashboard
                    </Link>
                  </Button>
                </div>
                
                <Card className="mt-6">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Resource Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Food Requests:</span>
                        <span className="font-medium">{stats.foodRequests}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shelter Requests:</span>
                        <span className="font-medium">{stats.shelterRequests}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Healthcare Requests:</span>
                        <span className="font-medium">{stats.healthcareRequests}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;
