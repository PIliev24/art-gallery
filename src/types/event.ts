import type { EventStatus } from './enums';

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  status: EventStatus;
  coverImage?: string;
  location?: string;
  isFeatured?: boolean;
}