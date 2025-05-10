
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DensityMap from '@/components/DensityMap';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'citizen' | 'organization'>('citizen');
  const { login, currentUser } = useApp();
  const navigate = useNavigate();
  
  // If already logged in, redirect based on role
  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'ngo') {
        navigate('/ngo/dashboard');
      } else {
        navigate('/requests');
      }
    }
  }, [currentUser, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        // Login redirects are handled by the effect above
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // This is for demo/testing only
  const handleQuickLogin = async (type: 'citizen' | 'ngo') => {
    setIsSubmitting(true);
    try {
      if (type === 'citizen') {
        await login('john@example.com', 'password');
      } else {
        await login('sarah@ngo.org', 'password');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <div className="min-h-[calc(100vh-180px)] flex flex-col lg:flex-row bg-muted/30">
        {/* Login Form Side */}
        <div className="flex flex-col w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 justify-center">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Sign in to MeshAid</CardTitle>
              <CardDescription>
                Enter your email and password to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'citizen' | 'organization')}>
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="citizen">Citizen</TabsTrigger>
                  <TabsTrigger value="organization">Organization</TabsTrigger>
                </TabsList>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
                
                <div className="mt-6 pt-6 border-t">
                  <p className="text-center text-sm text-muted-foreground mb-4">
                    For demo purposes only
                  </p>
                  <div className="flex flex-col space-y-2">
                    <Button 
                      variant={activeTab === 'citizen' ? "default" : "outline"} 
                      onClick={() => {
                        setActiveTab('citizen');
                        handleQuickLogin('citizen');
                      }}
                      disabled={isSubmitting}
                    >
                      Sign in as Citizen
                    </Button>
                    <Button 
                      variant={activeTab === 'organization' ? "default" : "outline"}
                      onClick={() => {
                        setActiveTab('organization');
                        handleQuickLogin('ngo');
                      }}
                      disabled={isSubmitting}
                    >
                      Sign in as Organization
                    </Button>
                  </div>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Map Side - Only show for organization login */}
        <div className={`w-full lg:w-1/2 p-4 transition-all ${activeTab === 'organization' ? 'block' : 'hidden lg:block lg:opacity-50'}`}>
          <Card className="h-full overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle className="text-lg">Resource Density Overview</CardTitle>
              <CardDescription>
                View real-time distribution of resource needs across regions
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-[500px]">
              <DensityMap className="h-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
