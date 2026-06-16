// Shared types — mirrors /lib/types.ts from the Expo app
export type ListingCategory =
  | "tools"
  | "kitchen"
  | "electronics"
  | "furniture"
  | "outdoor"
  | "other";

export type BookingStatus =
  | "pending"
  | "approved"
  | "paid"
  | "active"
  | "completed"
  | "declined"
  | "cancelled";

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
  profiles?: Pick<Profile, "display_name" | "city">;
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
  listings?: Pick<Listing, "title" | "image_paths" | "daily_price_cents">;
}

export interface Message {
  id: string;
  booking_id: string;
  sender_id: string;
  body: string;
  created_at: string;
}

export interface ConversationPreview {
  booking_id: string;
  listing_title: string;
  other_party_name: string;
  last_message: string | null;
  last_message_at: string | null;
}

export interface ListingFilters {
  search?: string;
  category?: ListingCategory | null;
  city?: string;
}

export const CATEGORY_LABELS: Record<ListingCategory, string> = {
  tools: "Tools",
  kitchen: "Kitchen",
  electronics: "Electronics",
  furniture: "Furniture",
  outdoor: "Outdoor",
  other: "Other",
};

export const CATEGORY_ICONS: Record<ListingCategory, string> = {
  tools: "🔧",
  kitchen: "🍳",
  electronics: "📱",
  furniture: "🪑",
  outdoor: "🏕️",
  other: "📦",
};

export const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  paid: "Paid",
  active: "Active",
  completed: "Completed",
  declined: "Declined",
  cancelled: "Cancelled",
};

export const STATUS_COLORS: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-blue-100 text-blue-700",
  paid: "bg-indigo-100 text-indigo-700",
  active: "bg-emerald-100 text-emerald-700",
  completed: "bg-slate-100 text-slate-600",
  declined: "bg-red-100 text-red-700",
  cancelled: "bg-slate-100 text-slate-500",
};

export function formatCents(cents: number): string {
  return `₹${(cents / 100).toLocaleString("en-IN")}`;
}

export function rentalDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.max(
    1,
    Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  );
}
