
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, MapPin, LineChart } from 'lucide-react';

const HomePage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Connecting Resources to Those Who Need Them Most
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              ResourceHub efficiently connects citizens in need with organizations that can help. Request essential resources or join as an organization to provide assistance.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link to="/requests/new">
                  Request Resources <ArrowRight size={18} className="ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">
                  Organization Login
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Request Resources</h3>
              <p className="text-muted-foreground">
                Citizens can easily submit requests for essential resources like food, shelter, and healthcare.
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Visualize Needs</h3>
              <p className="text-muted-foreground">
                Organizations can see real-time maps showing where resources are most needed.
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <LineChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Track Impact</h3>
              <p className="text-muted-foreground">
                Monitor the impact of resource allocation and optimize distribution strategies.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-muted-foreground">
            Whether you need resources or want to help distribute them, ResourceHub makes the process simple and efficient.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/requests/new">Request Resources</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Organization Login</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
