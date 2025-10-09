export interface DashboardStats {
  registeredAnimals: number;
  campaigns: number;
  employees: number;
  vaccinesAboutToExpire: number;
  activeCampaigns: number;
  totalStables: number;
  totalVaccines: number;
}

export interface UpcomingEvent {
  id: number;
  title: string;
  date: string;
  type?: string; // 'campaign-start', 'campaign-end', etc.
}