export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  rating?: number;
  reviews?: Review[];
  numReviews?: number;
}

export interface Review {
    _id: string;
    name: string;
    rating: number;
    comment: string;
    createdAt: string;
}

interface Address {
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  profileImageUrl?: string;
  address?: Address;
  phone?: string; // Added the phone property
}

