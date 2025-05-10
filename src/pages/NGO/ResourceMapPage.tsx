
import React, { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Layout from '@/components/Layout';
import { useApp } from '@/contexts/AppContext';
import { ResourceType, ResourceRequest, UrgencyLevel } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import RequestCard from '@/components/RequestCard';
import { Calendar, Clock, Filter } from 'lucide-react';

// Set mapbox token - in a real app, this would be from environment variables
mapboxgl.accessToken = 'pk.eyJ1IjoiZGVtb3VzZXIxMjMiLCJhIjoiY2xzdXc0a2x0MHBiYTJrcGJ0NnhvNnNndiJ9.LBeeV5B7_UXRfY-l1Zez7A';

const ResourceMapPage = () => {
  const { requests, isLoading } = useApp();
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Filters
  const [selectedTypes, setSelectedTypes] = useState<ResourceType[]>(['food', 'shelter', 'healthcare']);
  const [selectedUrgency, setSelectedUrgency] = useState<UrgencyLevel[]>(['low', 'medium', 'high']);
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('week');
  const [selectedStatus, setSelectedStatus] = useState<string[]>(['pending', 'inProgress', 'fulfilled']);
  
  // Selected request from the map
  const [selectedRequest, setSelectedRequest] = useState<ResourceRequest | null>(null);
  
  // Filter requests
  const filteredRequests = requests.filter(req => {
    // Filter by resource type - request must have at least one of the selected types
    const typeMatch = req.resourceTypes.some(type => selectedTypes.includes(type));
    if (!typeMatch) return false;
    
    // Filter by urgency
    if (!selectedUrgency.includes(req.urgency)) return false;
    
    // Filter by status
    if (!selectedStatus.includes(req.status)) return false;
    
    // Filter by timeframe
    const requestDate = new Date(req.createdAt);
    const now = new Date();
    const daysDiff = (now.getTime() - requestDate.getTime()) / (1000 * 3600 * 24);
    
    if (timeframe === 'day' && daysDiff > 1) return false;
    if (timeframe === 'week' && daysDiff > 7) return false;
    if (timeframe === 'month' && daysDiff > 30) return false;
    
    return true;
  });
  
  // Initialize map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-122.4194, 37.7749], // San Francisco
      zoom: 12
    });
    
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    map.current.on('load', () => {
      setMapLoaded(true);
    });
    
    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);
  
  // Add markers when map is loaded and requests or filters change
  useEffect(() => {
    if (!mapLoaded || !map.current) return;
    
    // Remove existing markers
    const markers = document.querySelectorAll('.mapboxgl-marker');
    markers.forEach(marker => marker.remove());
    
    // Add new markers
    filteredRequests.forEach(request => {
      const [lng, lat] = request.location.coordinates;
      
      // Create marker element
      const markerEl = document.createElement('div');
      
      // Choose marker class based on primary resource type
      if (request.resourceTypes.includes('food')) {
        markerEl.className = 'marker-food';
      } else if (request.resourceTypes.includes('shelter')) {
        markerEl.className = 'marker-shelter';
      } else if (request.resourceTypes.includes('healthcare')) {
        markerEl.className = 'marker-healthcare';
      }
      
      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="font-medium">${request.id.substring(0,6)}</div>
          <div class="text-sm">
            ${request.resourceTypes.join(', ')}
          </div>
          <div class="text-sm mt-1">
            ${request.location.address}
          </div>
        `);
      
      // Add marker to map
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.current as mapboxgl.Map);
      
      // Add click event
      marker.getElement().addEventListener('click', () => {
        setSelectedRequest(request);
      });
    });
  }, [mapLoaded, filteredRequests]);
  
  // Helper for handling resource type filtering
  const handleResourceTypeChange = (type: ResourceType, checked: boolean) => {
    if (checked) {
      setSelectedTypes(prev => [...prev, type]);
    } else {
      setSelectedTypes(prev => prev.filter(t => t !== type));
    }
  };
  
  // Helper for handling urgency filtering
  const handleUrgencyChange = (level: UrgencyLevel, checked: boolean) => {
    if (checked) {
      setSelectedUrgency(prev => [...prev, level]);
    } else {
      setSelectedUrgency(prev => prev.filter(l => l !== level));
    }
  };
  
  // Helper for handling status filtering
  const handleStatusChange = (status: string, checked: boolean) => {
    if (checked) {
      setSelectedStatus(prev => [...prev, status]);
    } else {
      setSelectedStatus(prev => prev.filter(s => s !== status));
    }
  };
  
  return (
    <Layout>
      <div className="container-fluid mx-auto p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 min-h-[calc(100vh-64px)]">
          
          {/* Filters sidebar */}
          <div className="p-4 bg-muted/30 overflow-auto max-h-[calc(100vh-64px)]">
            <h1 className="text-xl font-bold mb-4">Resource Map</h1>
            
            <Card className="mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Resource Types */}
                <div>
                  <Label className="font-medium mb-2 block">Resource Types</Label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox 
                        id="food-filter"
                        checked={selectedTypes.includes('food')}
                        onCheckedChange={(checked) => handleResourceTypeChange('food', checked === true)}
                        className="data-[state=checked]:bg-food data-[state=checked]:border-food"
                      />
                      <Label htmlFor="food-filter" className="ml-2 font-normal">
                        Food & Water
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        id="shelter-filter"
                        checked={selectedTypes.includes('shelter')}
                        onCheckedChange={(checked) => handleResourceTypeChange('shelter', checked === true)}
                        className="data-[state=checked]:bg-shelter data-[state=checked]:border-shelter"
                      />
                      <Label htmlFor="shelter-filter" className="ml-2 font-normal">
                        Shelter
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        id="healthcare-filter"
                        checked={selectedTypes.includes('healthcare')}
                        onCheckedChange={(checked) => handleResourceTypeChange('healthcare', checked === true)}
                        className="data-[state=checked]:bg-healthcare data-[state=checked]:border-healthcare"
                      />
                      <Label htmlFor="healthcare-filter" className="ml-2 font-normal">
                        Healthcare
                      </Label>
                    </div>
                  </div>
                </div>
                
                {/* Urgency */}
                <div>
                  <Label className="font-medium mb-2 block">Urgency Level</Label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox 
                        id="low-filter"
                        checked={selectedUrgency.includes('low')}
                        onCheckedChange={(checked) => handleUrgencyChange('low', checked === true)}
                      />
                      <Label htmlFor="low-filter" className="ml-2 font-normal">Low</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        id="medium-filter"
                        checked={selectedUrgency.includes('medium')}
                        onCheckedChange={(checked) => handleUrgencyChange('medium', checked === true)}
                      />
                      <Label htmlFor="medium-filter" className="ml-2 font-normal">Medium</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        id="high-filter"
                        checked={selectedUrgency.includes('high')}
                        onCheckedChange={(checked) => handleUrgencyChange('high', checked === true)}
                      />
                      <Label htmlFor="high-filter" className="ml-2 font-normal">High</Label>
                    </div>
                  </div>
                </div>
                
                {/* Status */}
                <div>
                  <Label className="font-medium mb-2 block">Request Status</Label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox 
                        id="pending-filter"
                        checked={selectedStatus.includes('pending')}
                        onCheckedChange={(checked) => handleStatusChange('pending', checked === true)}
                      />
                      <Label htmlFor="pending-filter" className="ml-2 font-normal">Pending</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        id="inProgress-filter"
                        checked={selectedStatus.includes('inProgress')}
                        onCheckedChange={(checked) => handleStatusChange('inProgress', checked === true)}
                      />
                      <Label htmlFor="inProgress-filter" className="ml-2 font-normal">In Progress</Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        id="fulfilled-filter"
                        checked={selectedStatus.includes('fulfilled')}
                        onCheckedChange={(checked) => handleStatusChange('fulfilled', checked === true)}
                      />
                      <Label htmlFor="fulfilled-filter" className="ml-2 font-normal">Fulfilled</Label>
                    </div>
                  </div>
                </div>
                
                {/* Timeframe */}
                <div>
                  <Label className="font-medium mb-2 block">Timeframe</Label>
                  <ToggleGroup 
                    type="single" 
                    value={timeframe}
                    onValueChange={(value) => {
                      if (value) setTimeframe(value as 'day' | 'week' | 'month');
                    }}
                    className="justify-start"
                  >
                    <ToggleGroupItem value="day" aria-label="Last 24h">
                      <Clock className="h-4 w-4 mr-1" /> 24h
                    </ToggleGroupItem>
                    <ToggleGroupItem value="week" aria-label="Last Week">
                      <Calendar className="h-4 w-4 mr-1" /> Week
                    </ToggleGroupItem>
                    <ToggleGroupItem value="month" aria-label="Last Month">
                      <Calendar className="h-4 w-4 mr-1" /> Month
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </CardContent>
            </Card>
            
            {/* Selected request details */}
            {selectedRequest && (
              <div className="sticky top-4">
                <RequestCard request={selectedRequest} showActions />
              </div>
            )}
          </div>
          
          {/* Map */}
          <div className="md:col-span-2 lg:col-span-3 relative bg-muted">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse-subtle">Loading map data...</div>
              </div>
            ) : (
              <div className="absolute inset-0" ref={mapContainer} />
            )}
          </div>
          
        </div>
      </div>
    </Layout>
  );
};

export default ResourceMapPage;
