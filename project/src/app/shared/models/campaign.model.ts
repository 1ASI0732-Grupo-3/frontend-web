export interface Campaign {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: CampaignStatus;
  targetAnimals?: string[];
  vaccineType?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum CampaignStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  SCHEDULED = 'scheduled',
  CANCELLED = 'cancelled'
}

export interface CreateCampaignRequest {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  targetAnimals?: string[];
  vaccineType?: string;
}