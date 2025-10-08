// Unified Campaign interface compatible with components and API
export interface Campaign {
  id: number; // API uses number
  name: string;
  description: string;
  startDate: Date; // Component compatible
  endDate: Date; // Component compatible
  status: CampaignStatus;
  targetAnimals?: string[]; // Component compatible
  vaccineType?: string; // Component compatible
  createdAt?: Date; // Component compatible
  updatedAt?: Date; // Component compatible
  goals?: Goal[]; // API format
  channels?: Channel[]; // API format
  stableId?: number | null; // API format
}

// Supporting models for campaigns
export interface Goal {
  id: number;
  description: string;
  metric: string;
  targetValue: number;
  currentValue: number;
  campaignId: number;
}

export interface Channel {
  id: number;
  type: string;
  details: string;
  campaignId: number;
}

export enum CampaignStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  SCHEDULED = 'scheduled',
  CANCELLED = 'cancelled'
}

// Request Model for creating campaigns
export interface CreateCampaignRequest {
  name: string;
  description: string;
  startDate: Date; // Component compatible
  endDate: Date; // Component compatible
  targetAnimals?: string[]; // Component compatible
  vaccineType?: string; // Component compatible
}

// API-specific request models (for internal use)
export interface CreateCampaignApiRequest {
  name: string;
  description: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  status: string;
  goals?: CreateGoalRequest[];
  channels?: CreateChannelRequest[];
  stableId?: number;
}

export interface CreateGoalRequest {
  description: string;
  metric: string;
  targetValue: number;
  currentValue: number;
}

export interface CreateChannelRequest {
  type: string;
  details: string;
}

// Additional API request models
export interface UpdateCampaignStatusRequest {
  status: string;
}

export interface AddGoalToCampaignRequest {
  description: string;
  metric: string;
  targetValue: number;
  currentValue: number;
}

export interface AddChannelToCampaignRequest {
  type: string;
  details: string;
}