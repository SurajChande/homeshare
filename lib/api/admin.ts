import { supabase } from '@/lib/supabase';
import type { Booking, Listing, Profile } from '@/lib/types';

// ─── Stats ────────────────────────────────────────────────────────────────────

export interface AdminStats {
  totalUsers: number;
  totalListings: number;
  activeListings: number;
  totalBookings: number;
  completedBookings: number;
  totalRevenueCents: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  const [usersRes, listingsRes, bookingsRes] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('listings').select('id, is_active', { count: 'exact' }),
    supabase.from('bookings').select('id, status, total_cents'),
  ]);

  const listings = listingsRes.data ?? [];
  const bookings = bookingsRes.data ?? [];

  return {
    totalUsers: usersRes.count ?? 0,
    totalListings: listingsRes.count ?? 0,
    activeListings: listings.filter((l) => l.is_active).length,
    totalBookings: bookings.length,
    completedBookings: bookings.filter((b) => b.status === 'completed').length,
    totalRevenueCents: bookings
      .filter((b) => ['paid', 'active', 'completed'].includes(b.status))
      .reduce((sum, b) => sum + (b.total_cents ?? 0), 0),
  };
}

// ─── Users ───────────────────────────────────────────────────────────────────

export async function getAllUsers(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function adminUpdateUser(
  userId: string,
  updates: Partial<Pick<Profile, 'display_name' | 'city' | 'is_admin'>>
): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  if (error) throw error;
}

// ─── Listings ─────────────────────────────────────────────────────────────────

export interface AdminListingRow extends Listing {
  profiles?: Pick<Profile, 'display_name' | 'city'>;
}

export async function getAllListings(): Promise<AdminListingRow[]> {
  const { data, error } = await supabase
    .from('listings')
    .select('*, profiles(display_name, city)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as AdminListingRow[];
}

export async function adminUpdateListing(
  listingId: string,
  updates: Partial<Pick<Listing, 'is_active' | 'title' | 'category'>>
): Promise<void> {
  const { error } = await supabase
    .from('listings')
    .update(updates)
    .eq('id', listingId);
  if (error) throw error;
}

export async function adminDeleteListing(listingId: string): Promise<void> {
  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', listingId);
  if (error) throw error;
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export interface AdminBookingRow extends Booking {
  renter?: Pick<Profile, 'display_name'>;
  owner?: Pick<Profile, 'display_name'>;
}

export async function getAllBookings(): Promise<AdminBookingRow[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select(
      '*, listings(title, image_paths, daily_price_cents), renter:renter_id(display_name), owner:owner_id(display_name)'
    )
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as AdminBookingRow[];
}

export async function adminCancelBooking(bookingId: string): Promise<void> {
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId);
  if (error) throw error;
}

// ─── Categories ───────────────────────────────────────────────────────────────
// Categories in this app are an enum in the DB — we surface them as a
// manageable list of labels that can be updated in lib/constants.ts at
// deploy time (no separate DB table). This function returns the current list.

export interface CategoryEntry {
  value: string;
  label: string;
}

export async function getBookingsByStatus(): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('bookings')
    .select('status');
  if (error) throw error;
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.status] = (counts[row.status] ?? 0) + 1;
  }
  return counts;
}

export async function getListingsByCategory(): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('listings')
    .select('category');
  if (error) throw error;
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.category] = (counts[row.category] ?? 0) + 1;
  }
  return counts;
}
