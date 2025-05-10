
export type ResourceType = 'food' | 'shelter' | 'healthcare';

export type UrgencyLevel = 'low' | 'medium' | 'high';

export interface ResourceRequest {
  id: string;
  resourceTypes: ResourceType[];
  location: {
    address: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  urgency: UrgencyLevel;
  contactInfo?: string;
  createdAt: Date;
  status: 'pending' | 'inProgress' | 'fulfilled';
  citizenId?: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'ngo';
  organization?: string;
}

export interface DashboardStat {
  label: string;
  value: number | string;
  change?: number;
  color?: string;
}
