import type { ListingCategory } from './types';

export const LISTING_CATEGORIES: { value: ListingCategory; label: string }[] = [
  { value: 'tools', label: 'Tools' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'outdoor', label: 'Outdoor' },
  { value: 'other', label: 'Other' },
];

export const CATEGORY_LABEL: Record<ListingCategory, string> = Object.fromEntries(
  LISTING_CATEGORIES.map((c) => [c.value, c.label])
) as Record<ListingCategory, string>;

export const BOOKING_STATUS_LABEL: Record<string, string> = {
  pending: 'Pending approval',
  approved: 'Approved — pay now',
  paid: 'Paid',
  active: 'Active rental',
  completed: 'Completed',
  declined: 'Declined',
  cancelled: 'Cancelled',
};

export const STORAGE_BUCKET = 'listing-images';
