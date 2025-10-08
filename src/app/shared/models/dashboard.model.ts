export interface DashboardStats {
  registeredAnimals: number;
  campaigns: number;
  employees: number;
  vaccinesAboutToExpire: number;
  activeCampaigns: number;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  type: EventType;
}

export enum EventType {
  VACCINATION = 'vaccination',
  DEWORMING = 'deworming',
  CAMPAIGN = 'campaign'
}