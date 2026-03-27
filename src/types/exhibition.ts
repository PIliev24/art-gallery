import type { ExhibitionStatus } from './enums';

export interface Exhibition {
  id: string;
  title: string;
  slug: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: ExhibitionStatus;
  coverImage: string;
  artistNames: string[];
  location?: string;
  isFeatured?: boolean;
}