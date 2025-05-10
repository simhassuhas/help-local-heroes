
import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Info } from 'lucide-react';

// Set mapbox token - in a real app, this would be from environment variables
mapboxgl.accessToken = 'pk.eyJ1IjoiZGVtb3VzZXIxMjMiLCJhIjoiY2xzdXc0a2x0MHBiYTJrcGJ0NnhvNnNndiJ9.LBeeV5B7_UXRfY-l1Zez7A';

// Mock disaster data - in a real app, this would come from an API
const mockDisasters = [
  {
    id: '1',
    type: 'Flooding',
    severity: 'severe',
    location: { lat: 29.7604, lng: -95.3698 }, // Houston
    description: 'Major flooding affecting downtown area',
    affectedArea: '15 square miles',
    timestamp: new Date().toISOString(),
    evacuationZones: ['Zone A', 'Zone B'],
    resourceNeeds: ['food', 'shelter', 'healthcare']
  },
  {
    id: '2',
    type: 'Wildfire',
    severity: 'high',
    location: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
    description: 'Rapidly spreading wildfire in suburban areas',
    affectedArea: '8 square miles',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    evacuationZones: ['Mountain View', 'Eagle Rock'],
    resourceNeeds: ['shelter', 'healthcare']
  },
  {
    id: '3',
    type: 'Earthquake',
    severity: 'moderate',
    location: { lat: 37.7749, lng: -122.4194 }, // San Francisco
    description: 'Magnitude 5.2 earthquake with moderate damage',
    affectedArea: '10 square miles',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    evacuationZones: [],
    resourceNeeds: ['shelter', 'healthcare', 'food']
  },
  {
    id: '4',
    type: 'Hurricane',
    severity: 'severe',
    location: { lat: 25.7617, lng: -80.1918 }, // Miami
    description: 'Category 3 hurricane approaching coastline',
    affectedArea: '30 square miles',
    timestamp: new Date(Date.now() - 43200000).toISOString(),
    evacuationZones: ['Coastal Zone A', 'Coastal Zone B', 'Coastal Zone C'],
    resourceNeeds: ['food', 'shelter', 'healthcare']
  }
];

const DisasterDetectionPage = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedDisaster, setSelectedDisaster] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('all');
  
  // Initialize map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-98.5795, 39.8283], // Center of USA
      zoom: 3
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
  
  // Add disaster markers when map is loaded
  useEffect(() => {
    if (!mapLoaded || !map.current) return;
    
    // Remove existing markers
    const markers = document.querySelectorAll('.mapboxgl-marker');
    markers.forEach(marker => marker.remove());
    
    // Filter disasters based on active tab
    const filteredDisasters = activeTab === 'all' 
      ? mockDisasters 
      : mockDisasters.filter(d => d.type.toLowerCase() === activeTab);
    
    // Add markers for disasters
    filteredDisasters.forEach(disaster => {
      // Create marker element
      const markerEl = document.createElement('div');
      markerEl.className = `w-6 h-6 rounded-full bg-destructive flex items-center justify-center cursor-pointer`;
      
      // Add disaster type icon
      const iconEl = document.createElement('div');
      iconEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>`;
      markerEl.appendChild(iconEl);
      
      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="font-medium">${disaster.type}</div>
          <div class="text-sm">
            ${disaster.description}
          </div>
          <div class="text-xs mt-1">
            Severity: ${disaster.severity}
          </div>
        `);
      
      // Add marker to map
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([disaster.location.lng, disaster.location.lat])
        .setPopup(popup)
        .addTo(map.current as mapboxgl.Map);
      
      // Add click event
      marker.getElement().addEventListener('click', () => {
        setSelectedDisaster(disaster);
      });
    });
    
    // Fly to selected disaster if any
    if (selectedDisaster) {
      map.current.flyTo({
        center: [selectedDisaster.location.lng, selectedDisaster.location.lat],
        zoom: 9
      });
    }
  }, [mapLoaded, selectedDisaster, activeTab]);
  
  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe': return 'bg-destructive';
      case 'high': return 'bg-orange-500';
      case 'moderate': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  return (
    <Layout>
      <div className="container-fluid mx-auto p-0">
        <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[calc(100vh-64px)]">
          
          {/* Sidebar */}
          <div className="bg-muted/30 p-4 overflow-auto max-h-[calc(100vh-64px)]">
            <h1 className="text-xl font-bold mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
              Disaster Detection
            </h1>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
              <TabsList className="w-full">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="flooding">Flood</TabsTrigger>
                <TabsTrigger value="wildfire">Fire</TabsTrigger>
                <TabsTrigger value="earthquake">Quake</TabsTrigger>
                <TabsTrigger value="hurricane">Storm</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="space-y-4">
              {(activeTab === 'all' ? mockDisasters : mockDisasters.filter(d => d.type.toLowerCase() === activeTab)).map(disaster => (
                <Card 
                  key={disaster.id} 
                  className={`cursor-pointer transition-all ${selectedDisaster?.id === disaster.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedDisaster(disaster)}
                >
                  <CardHeader className="py-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{disaster.type}</CardTitle>
                      <Badge className={`${getSeverityColor(disaster.severity)} capitalize`}>
                        {disaster.severity}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">{formatDate(disaster.timestamp)}</CardDescription>
                  </CardHeader>
                  <CardContent className="py-2 text-sm">
                    <p>{disaster.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Map and Details */}
          <div className="lg:col-span-3 flex flex-col">
            {/* Map */}
            <div className="relative h-[60vh] bg-muted">
              <div className="absolute inset-0" ref={mapContainer} />
            </div>
            
            {/* Selected Disaster Details */}
            {selectedDisaster && (
              <div className="p-4 bg-card">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
                    {selectedDisaster.type}: {selectedDisaster.description}
                  </h2>
                  <Badge className={`${getSeverityColor(selectedDisaster.severity)} capitalize`}>
                    {selectedDisaster.severity}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm flex items-center">
                        <Info className="h-4 w-4 mr-2" />
                        Affected Area
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <p className="font-medium">{selectedDisaster.affectedArea}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">Evacuation Zones</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      {selectedDisaster.evacuationZones.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedDisaster.evacuationZones.map((zone: string) => (
                            <Badge key={zone} variant="outline" className="border-destructive text-destructive">
                              {zone}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p>No evacuation zones established</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Resource Needs</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDisaster.resourceNeeds.map((resource: string) => (
                      <Badge key={resource} className="capitalize">
                        {resource}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6">
                  <Button asChild>
                    <Link to="/requests/new">Request Resources</Link>
                  </Button>
                  <Button variant="outline">Share Alert</Button>
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </Layout>
  );
};

export default DisasterDetectionPage;
