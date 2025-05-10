
import { ResourceRequest, User, ResourceType, UrgencyLevel } from '../types';

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 12);

// Generate a random date within the last month
const randomDate = () => {
  const now = new Date();
  const pastDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
  return pastDate;
};

// Generate random coordinates around a center point
const randomCoordinates = (centerLat: number, centerLng: number, radiusKm: number): [number, number] => {
  const radiusInDegrees = radiusKm / 111; // ~111km per degree
  const u = Math.random();
  const v = Math.random();
  const w = radiusInDegrees * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);
  // Adjust the x-coordinate for the shrinking of the east-west distances
  const newLng = x / Math.cos(centerLat * Math.PI / 180) + centerLng;
  const newLat = y + centerLat;
  return [newLng, newLat];
};

const resourceTypes: ResourceType[] = ['food', 'shelter', 'healthcare'];
const urgencyLevels: UrgencyLevel[] = ['low', 'medium', 'high'];
const statuses = ['pending', 'inProgress', 'fulfilled'];

// Mock addresses
const addresses = [
  "123 Main St",
  "456 Oak Ave",
  "789 Pine Rd",
  "321 Maple Ln",
  "654 Cedar Blvd",
  "987 Birch Way",
  "135 Spruce Dr",
  "246 Elm St",
  "579 Willow Ave",
  "864 Aspen Ct"
];

// Generate mock resource requests
export const generateMockRequests = (count: number, centerLat: number, centerLng: number): ResourceRequest[] => {
  const requests: ResourceRequest[] = [];
  
  for (let i = 0; i < count; i++) {
    const coords = randomCoordinates(centerLat, centerLng, 10);
    const types = [...resourceTypes]
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.ceil(Math.random() * 3)) as ResourceType[];
      
    requests.push({
      id: generateId(),
      resourceTypes: types,
      location: {
        address: addresses[Math.floor(Math.random() * addresses.length)],
        coordinates: coords
      },
      urgency: urgencyLevels[Math.floor(Math.random() * urgencyLevels.length)],
      contactInfo: Math.random() > 0.3 ? `person${i}@example.com` : undefined,
      createdAt: randomDate(),
      status: statuses[Math.floor(Math.random() * statuses.length)] as 'pending' | 'inProgress' | 'fulfilled',
      citizenId: Math.random() > 0.5 ? generateId() : undefined,
      notes: Math.random() > 0.7 ? "Additional notes about this request" : undefined
    });
  }
  
  return requests;
};

// Mock users
export const mockUsers: User[] = [
  {
    id: "citizen1",
    name: "John Citizen",
    email: "john@example.com",
    role: "citizen"
  },
  {
    id: "ngo1",
    name: "Sarah Helper",
    email: "sarah@ngo.org",
    role: "ngo",
    organization: "Help Foundation"
  }
];

// Default mock data centered around San Francisco
const SF_LAT = 37.7749;
const SF_LNG = -122.4194;
export const mockRequests = generateMockRequests(50, SF_LAT, SF_LNG);

// Generate statistics based on the mock data
export const generateStatistics = (requests: ResourceRequest[]) => {
  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const inProgressRequests = requests.filter(r => r.status === 'inProgress').length;
  const fulfilledRequests = requests.filter(r => r.status === 'fulfilled').length;
  
  const foodRequests = requests.filter(r => r.resourceTypes.includes('food')).length;
  const shelterRequests = requests.filter(r => r.resourceTypes.includes('shelter')).length;
  const healthcareRequests = requests.filter(r => r.resourceTypes.includes('healthcare')).length;
  
  const highUrgency = requests.filter(r => r.urgency === 'high').length;
  
  return {
    totalRequests,
    pendingRequests,
    inProgressRequests,
    fulfilledRequests,
    foodRequests,
    shelterRequests,
    healthcareRequests,
    highUrgency,
    fulfillmentRate: totalRequests ? Math.round((fulfilledRequests / totalRequests) * 100) : 0
  };
};
