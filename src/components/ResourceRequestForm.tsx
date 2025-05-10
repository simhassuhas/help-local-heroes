
import React, { useState } from 'react';
import { ResourceType, UrgencyLevel } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

interface ResourceRequestFormProps {
  onSubmitComplete?: () => void;
}

const ResourceRequestForm: React.FC<ResourceRequestFormProps> = ({ onSubmitComplete }) => {
  const { addRequest } = useApp();
  
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);
  const [address, setAddress] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('medium');
  const [contactInfo, setContactInfo] = useState('');
  const [notes, setNotes] = useState('');
  
  // For a real app, we'd use geocoding to get coordinates from the address
  // For this demo, we'll generate random coordinates around San Francisco
  const generateMockCoordinates = (): [number, number] => {
    const SF_LAT = 37.7749;
    const SF_LNG = -122.4194;
    const lat = SF_LAT + (Math.random() - 0.5) * 0.1;
    const lng = SF_LNG + (Math.random() - 0.5) * 0.1;
    return [lng, lat];
  };
  
  const handleResourceTypeChange = (type: ResourceType, checked: boolean) => {
    if (checked) {
      setResourceTypes(prev => [...prev, type]);
    } else {
      setResourceTypes(prev => prev.filter(t => t !== type));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (resourceTypes.length === 0) {
      alert('Please select at least one resource type');
      return;
    }
    
    if (!address) {
      alert('Please enter an address');
      return;
    }
    
    const newRequest = {
      resourceTypes,
      location: {
        address,
        coordinates: generateMockCoordinates()
      },
      urgency,
      contactInfo: contactInfo || undefined,
      notes: notes || undefined
    };
    
    addRequest(newRequest);
    
    // Reset the form
    setResourceTypes([]);
    setAddress('');
    setUrgency('medium');
    setContactInfo('');
    setNotes('');
    
    if (onSubmitComplete) {
      onSubmitComplete();
    }
  };
  
  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Request Resources</CardTitle>
        <CardDescription>Tell us what resources you need and where to deliver them.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">What resources do you need?</h3>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="food"
                    checked={resourceTypes.includes('food')}
                    onCheckedChange={(checked) => handleResourceTypeChange('food', checked === true)}
                  />
                  <Label htmlFor="food" className="font-normal">Food & Water</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="shelter"
                    checked={resourceTypes.includes('shelter')}
                    onCheckedChange={(checked) => handleResourceTypeChange('shelter', checked === true)}
                  />
                  <Label htmlFor="shelter" className="font-normal">Shelter</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="healthcare"
                    checked={resourceTypes.includes('healthcare')}
                    onCheckedChange={(checked) => handleResourceTypeChange('healthcare', checked === true)}
                  />
                  <Label htmlFor="healthcare" className="font-normal">Healthcare</Label>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Location</Label>
              <Input 
                id="address"
                placeholder="Enter your address"
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label>Urgency Level</Label>
              <RadioGroup 
                value={urgency} 
                onValueChange={(value) => setUrgency(value as UrgencyLevel)}
                className="flex flex-col space-y-2 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low" className="font-normal">Low - Needed within a week</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium" className="font-normal">Medium - Needed within days</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high" className="font-normal">High - Needed immediately</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label htmlFor="contact">Contact Information (Optional)</Label>
              <Input 
                id="contact"
                placeholder="Phone number or email"
                value={contactInfo}
                onChange={e => setContactInfo(e.target.value)}
              />
              <p className="text-sm text-muted-foreground mt-1">
                This helps us contact you about your request.
              </p>
            </div>
            
            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea 
                id="notes"
                placeholder="Any additional details about your request"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full">Submit Request</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ResourceRequestForm;
