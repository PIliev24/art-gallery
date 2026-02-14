import type { ArtCategory } from './enums';

export interface Dimensions {
  width: number;
  height: number;
  depth?: number;
  unit: 'cm' | 'm' | 'mm';
}

export interface Artist {
  id: string;
  name: string;
  bio?: string;
  nationality?: string;
}

export interface Artwork {
  id: string;
  title: string;
  artist: Artist;
  category: ArtCategory;
  medium: string;
  dimensions: Dimensions;
  year: number;
  imageUrl: string;
  description?: string;
  isFeatured?: boolean;
  isAvailable?: boolean;
}