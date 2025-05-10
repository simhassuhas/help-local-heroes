
import React from "react";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertCircle, MapPin, Clock, Phone } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Emergency Header Banner */}
      <div className="bg-destructive text-destructive-foreground py-2 px-4">
        <div className="container mx-auto flex items-center justify-center text-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p className="text-sm md:text-base font-medium">
            Emergency Resource Request System - Get immediate help during crisis
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-destructive/90 text-destructive-foreground py-16 md:py-20 flex-grow">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
              Emergency Resource Hub
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Quick access to essential resources during crisis situations. Request food, shelter, or healthcare assistance immediately.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-destructive hover:bg-white/90 w-full sm:w-auto animate-pulse-subtle" asChild>
                <Link to="/requests/new">
                  Request Emergency Resources <ArrowRight size={18} className="ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto" asChild>
                <Link to="/login">
                  Organization / NGO Login
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Quick Access Cards */}
      <section className="py-10 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Food Card */}
            <div className="bg-food-light rounded-lg p-6 shadow-md border-l-4 border-food">
              <h3 className="text-xl font-bold mb-3 text-red-800">Food & Water</h3>
              <p className="mb-4 text-muted-foreground">Emergency food supplies, clean water, and essential nutrition during crisis.</p>
              <Button variant="outline" className="w-full border-food text-food hover:bg-food hover:text-white" asChild>
                <Link to="/requests/new">Request Food Aid</Link>
              </Button>
            </div>
            
            {/* Shelter Card */}
            <div className="bg-shelter-light rounded-lg p-6 shadow-md border-l-4 border-shelter">
              <h3 className="text-xl font-bold mb-3 text-green-800">Emergency Shelter</h3>
              <p className="mb-4 text-muted-foreground">Safe temporary housing, evacuation centers, and protection from disaster.</p>
              <Button variant="outline" className="w-full border-shelter text-shelter hover:bg-shelter hover:text-white" asChild>
                <Link to="/requests/new">Find Shelter</Link>
              </Button>
            </div>
            
            {/* Healthcare Card */}
            <div className="bg-healthcare-light rounded-lg p-6 shadow-md border-l-4 border-healthcare">
              <h3 className="text-xl font-bold mb-3 text-blue-800">Healthcare</h3>
              <p className="mb-4 text-muted-foreground">Medical assistance, first aid, medicine, and emergency health services.</p>
              <Button variant="outline" className="w-full border-healthcare text-healthcare hover:bg-healthcare hover:text-white" asChild>
                <Link to="/requests/new">Get Medical Help</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Emergency Instructions */}
      <section className="py-10 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">How To Get Help</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-6 shadow-sm border border-muted">
              <div className="flex items-center mb-4 text-primary">
                <MapPin className="h-6 w-6 mr-3" />
                <h3 className="text-lg font-semibold">Share Your Location</h3>
              </div>
              <p className="text-muted-foreground">
                Provide your address or allow location access so responders can reach you quickly.
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-sm border border-muted">
              <div className="flex items-center mb-4 text-primary">
                <Clock className="h-6 w-6 mr-3" />
                <h3 className="text-lg font-semibold">Indicate Urgency</h3>
              </div>
              <p className="text-muted-foreground">
                Let us know how urgent your situation is so we can prioritize response accordingly.
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-sm border border-muted">
              <div className="flex items-center mb-4 text-primary">
                <Phone className="h-6 w-6 mr-3" />
                <h3 className="text-lg font-semibold">Stay Reachable</h3>
              </div>
              <p className="text-muted-foreground">
                Provide contact information if possible so emergency responders can reach you.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Emergency CTA */}
      <section className="py-8 bg-destructive/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-6">Need Immediate Assistance?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto text-muted-foreground">
            Don't wait. Our emergency resource allocation system connects you with the help you need as quickly as possible.
          </p>
          <Button size="lg" className="bg-destructive hover:bg-destructive/90 text-white" asChild>
            <Link to="/requests/new">Request Emergency Resources Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
