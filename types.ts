
export enum PropertyType {
  APARTMENT = 'Apartamento',
  HOUSE = 'Casa',
  PENTHOUSE = 'Cobertura',
  LAND = 'Terreno',
  COMMERCIAL = 'Comercial',
}

export type PropertyStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Property {
  id: string;
  type: PropertyType;
  region: string;
  condoName: string;
  bedrooms: number;
  area: number; // m²
  price?: number;
  videoUrl?: string; // New field for YouTube link
  description: string;
  ownerName: string;
  ownerPhone: string;
  images: string[]; // URLs
  isFeatured?: boolean; // New field for highlights
  status: PropertyStatus; // Workflow status
  createdAt: number;
}

export interface BuyerInterest {
  id: string;
  type: PropertyType;
  region: string;
  minBedrooms: number;
  minArea: number;
  maxPrice?: number; // New field for budget
  characteristics?: string; // Optional field for specific needs
  buyerName: string;
  buyerPhone: string;
  createdAt: number;
}

export interface LeadMatch {
  id: string;
  propertyId: string;
  buyerId: string; // Can be a registered buyer ID or a temporary one
  buyerName: string;
  buyerContact: string;
  status: 'PENDING' | 'CONTACTED' | 'CLOSED';
  createdAt: number;
}

export type UserRole = 'ADMIN' | 'MANAGER';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: number;
}

export interface StorageData {
  properties: Property[];
  interests: BuyerInterest[];
  matches: LeadMatch[];
  users: User[];
}