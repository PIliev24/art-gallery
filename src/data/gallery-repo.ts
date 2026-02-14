import { api } from '../lib/api';

export async function getGalleryInfo() {
  return api<{
    name: string;
    description: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
    email: string;
    workingHours: string;
  }>('/gallery');
}
