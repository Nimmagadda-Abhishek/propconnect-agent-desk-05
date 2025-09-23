export interface Agent {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  totalProperties?: number;
}

export interface PropertyStats {
  totalProperties: number;
  activeProperties: number;
  premiumProperties: number;
  featuredProperties: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  userType: 'AGENT';
  agent: Agent;
}

export interface PropertyImage {
  id: number;
  imageUrl: string;
  altText: string;
  displayOrder: number;
  isPrimary: boolean;
  createdAt: string;
}

export interface Property {
  id: number;
  propertyTitle: string;
  price: number;
  propertyType: 'RESIDENTIAL' | 'COMMERCIAL' | 'NEW_DEVELOPMENT' | 'AGRICULTURE';
  listingType: 'SALE' | 'RESALE' | 'RENT';
  propertyDescription: string;
  fullAddress: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  carpetArea: string;
  builtUpArea: string;
  floors: number;
  totalFloors: number;
  propertyAge: number;
  furnishing: 'FULLY_FURNISHED' | 'SEMI_FURNISHED' | 'UNFURNISHED';
  amenities: string;
  parkingAvailable: boolean;
  parkingSpots: number;
  propertyImages: PropertyImage[];
  youtubeVideoUrl?: string;
  instagramProfile?: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  status: 'ACTIVE' | 'INACTIVE';
  listingStatus: 'PREMIUM' | 'FEATURED' | 'RECENT';
  agent: {
    id: number;
    fullName: string;
    phoneNumber: string;
  };
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  isVerified: boolean;
}

export interface PropertyDto {
  propertyTitle: string;
  price: number;
  propertyType: 'RESIDENTIAL' | 'COMMERCIAL' | 'NEW_DEVELOPMENT' | 'AGRICULTURE';
  listingType: 'SALE' | 'RESALE' | 'RENT';
  propertyDescription: string;
  fullAddress: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  carpetArea?: string;
  builtUpArea?: string;
  floors: number;
  totalFloors: number;
  propertyAge: number;
  furnishing: 'FULLY_FURNISHED' | 'SEMI_FURNISHED' | 'UNFURNISHED';
  amenities: string;
  parkingAvailable: boolean;
  parkingSpots: number;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  youtubeVideoUrl?: string;
  instagramProfile?: string;
  listingStatus: 'PREMIUM' | 'FEATURED' | 'RECENT';
  agentId: number;
}

export interface Inquiry {
  id: number;
  propertyId: number;
  propertyTitle: string;
  userName: string;
  email: string;
  phone: string;
  message: string;
  type: string;
  status: string;
  createdAt: string;
}