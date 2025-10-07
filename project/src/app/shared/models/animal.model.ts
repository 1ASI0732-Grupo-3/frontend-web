export interface Animal {
  id: string;
  name: string;
  breed: string;
  weight: number; // en kg
  age: number; // en años
  birthdate: Date;
  barn: string;
  location: string;
  campaign: string;
  gender: 'male' | 'female';
  imageUrl: string;
  createdAt: Date;
}

export interface CreateAnimalRequest {
  name: string;
  breed: string;
  weight: number;
  birthdate: Date;
  barn: string;
  location: string;
  campaign: string;
  gender: 'male' | 'female';
  imageUrl: string;
}