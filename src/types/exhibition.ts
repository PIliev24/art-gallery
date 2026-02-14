import type { ExhibitionStatus } from './enums';
import type { Artist } from './artwork';

export interface Exhibition {
  id: string;
  title: string;
  slug: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: ExhibitionStatus;
  coverImage: string;
  artists: Artist[];
  location?: string;
  isFeatured?: boolean;
}