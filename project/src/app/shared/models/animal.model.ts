// Unified Animal interface compatible with components and API
export interface Animal {
  id: number; // API uses number
  name: string;
  breed: string;
  weight?: number; // Optional for display
  age?: number; // Calculated field
  birthdate?: Date; // For component compatibility
  birthDate?: string; // API format
  barn?: string; // For component compatibility  
  location: string;
  campaign?: string; // For component compatibility
  gender: 'male' | 'female' | string;
  imageUrl?: string; // For component compatibility
  bovineImg?: string | null; // API format
  stableId?: number | null; // API format
  createdAt?: Date;
}

// API Request Model for creating animals
export interface CreateAnimalRequest {
  name: string; // Component compatible
  breed: string;
  weight: number;
  birthdate: Date; // Component compatible
  barn: string; // Component compatible
  location: string;
  campaign: string; // Component compatible
  gender: 'male' | 'female';
  imageUrl: string; // Component compatible
}

// Vaccination model (from VaccineResource)
export interface Vaccination {
  id: number;
  name: string;
  vaccineType: string;
  vaccineDate: string; // ISO date string
  vaccineImg: string | null;
  bovineId: number;
}

// Stable model (from StableResource) 
export interface Stable {
  id: number;
  name: string;
  limit: number;
}