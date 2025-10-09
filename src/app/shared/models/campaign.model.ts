// Unified Campaign interface compatible with components and API
export interface Campaign {
  id?: number; // API uses number, optional for creation
  name: string;
  description: string;
  startDate: Date; // Component compatible
  endDate: Date; // Component compatible
  status: CampaignStatus;
  goals?: Goal[]; // API format
  channels?: Channel[]; // API format
  stableId: number; // Required by API
  createdAt?: Date; // Component compatible
  updatedAt?: Date; // Component compatible
  vaccineType?: string; // Added for component compatibility
  targetAnimals?: string[]; // Added for component compatibility
}

// Supporting models for campaigns
export interface Goal {
  id?: number; // Optional for creation
  title: string; // Changed from description to title
  description: string;
}

export interface Channel {
  id?: number; // Optional for creation
  type: string;
  details: string;
}

export enum CampaignStatus {
  DRAFT = 'Draft',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  SCHEDULED = 'Scheduled' // Added missing SCHEDULED status
}

// Request Model for creating campaigns
export interface CreateCampaignRequest {
  name: string;
  description: string;
  startDate: Date; // Component compatible
  endDate: Date; // Component compatible
  status?: string; // Optional, defaults to Draft
  goals?: Goal[];
  channels?: Channel[];
  stableId: number; // Required
  vaccineType?: string; // Added for component compatibility
  targetAnimals?: string[]; // Added for component compatibility
}

// API-specific request models (for internal use)
export interface CreateCampaignApiRequest {
  name: string;
  description: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  status: string; // Draft, Active, etc.
  goals?: Goal[];
  channels?: Channel[];
  stableId: number; // Required by API
}

export interface CreateGoalRequest {
  title: string; // Changed to title
  description: string;
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
  title: string; // Changed to title
  description: string;
}

export interface AddChannelToCampaignRequest {
  type: string;
  details: string;
}