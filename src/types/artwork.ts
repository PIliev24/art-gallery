import type { ArtCategory } from './enums';

export interface Dimensions {
  width: number;
  height: number;
  depth?: number;
  unit: 'cm' | 'm' | 'mm';
}

export interface Artwork {
  id: string;
  title: string;
  artistName: string;
  category: ArtCategory;
  medium: string;
  dimensions: Dimensions;
  year: number;
  imageUrl: string;
  description?: string;
  isFeatured?: boolean;
  isAvailable?: boolean;
}