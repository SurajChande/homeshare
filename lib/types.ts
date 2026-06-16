export type ListingCategory =
  | 'tools'
  | 'kitchen'
  | 'electronics'
  | 'furniture'
  | 'outdoor'
  | 'other';

export type BookingStatus =
  | 'pending'
  | 'approved'
  | 'paid'
  | 'active'
  | 'completed'
  | 'declined'
  | 'cancelled';

export interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  city: string | null;
  is_admin: boolean;
  created_at: string;
}

export interface Listing {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  category: ListingCategory;
  daily_price_cents: number;
  deposit_cents: number;
  city: string;
  latitude: number | null;
  longitude: number | null;
  image_paths: string[];
  is_active: boolean;
  created_at: string;
  profiles?: Pick<Profile, 'display_name' | 'city'>;
}

export interface Booking {
  id: string;
  listing_id: string;
  renter_id: string;
  owner_id: string;
  start_date: string;
  end_date: string;
  status: BookingStatus;
  total_cents: number;
  stripe_payment_intent_id: string | null;
  created_at: string;
  updated_at: string;
  listings?: Pick<Listing, 'title' | 'image_paths' | 'daily_price_cents'>;
}

export interface Message {
  id: string;
  booking_id: string;
  sender_id: string;
  body: string;
  created_at: string;
}

export interface ListingFilters {
  search?: string;
  category?: ListingCategory | null;
  minPriceCents?: number;
  maxPriceCents?: number;
  city?: string;
}

export interface ConversationPreview {
  booking_id: string;
  listing_title: string;
  other_party_name: string;
  last_message: string | null;
  last_message_at: string | null;
}
