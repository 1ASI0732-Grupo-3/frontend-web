// Staff model to match your backend
export interface Staff {
  id?: number;
  name: string;
  employeeStatus: number; // 0, 1, etc. as required by API
  campaignId: number; // Required by API
}

// Request Model for creating staff
export interface CreateStaffRequest {
  name: string;
  employeeStatus: number;
  campaignId: number;
}

// Staff status enum
export enum StaffStatus {
  INACTIVE = 0,
  ACTIVE = 1,
  SUSPENDED = 2
}
