// Unified Animal interface compatible with components and API
export interface Animal {
  id?: number; // Optional for creation
  name: string;
  gender: string;
  birthDate: string; // ISO string as required by API
  breed: string;
  location: string;
  bovineImg?: string; // Optional image
  stableId: number; // Required by API

  // Legacy properties for component compatibility
  birthdate?: Date; // For component compatibility
  imageUrl?: string; // For component compatibility
  weight?: number; // For component compatibility
  campaign?: string; // For component compatibility
  barn?: string; // For component compatibility
  age?: number; // For component compatibility
  createdAt?: Date; // For component compatibility
}

// Request Model for creating animals
export interface CreateAnimalRequest {
  name: string;
  gender: string; // Must be "Male" or "Female"
  birthDate: Date; // Component uses Date
  breed: string;
  location: string;
  bovineImg?: string; // Optional image URL (for response)
  imageFile?: File; // Actual file to upload
  stableId: number; // Fixed to 1
}

// API-specific request models
export interface CreateAnimalApiRequest {
  name: string;
  gender: string;
  birthDate: string; // ISO string for API
  breed: string;
  location: string;
  bovineImg?: string;
  stableId: number;
}

// Vaccination model
export interface Vaccination {
  id?: number;
  name: string;
  vaccineType: string;
  vaccineDate: string; // ISO string
  vaccineImg?: string;
  bovineId: number;
}

// Stable model to match your backend
export interface Stable {
  id?: number;
  name: string;
  limit: number; // Changed from capacity to limit
}