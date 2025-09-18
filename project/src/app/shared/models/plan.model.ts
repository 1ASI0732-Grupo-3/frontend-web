export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  isPopular?: boolean;
}