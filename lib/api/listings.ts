import { supabase, getPublicImageUrl } from '../supabase';
import { STORAGE_BUCKET } from '../constants';
import type { Listing, ListingFilters } from '../types';

export async function fetchListings(filters: ListingFilters = {}): Promise<Listing[]> {
  let query = supabase
    .from('listings')
    .select('*, profiles(display_name, city)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  if (filters.minPriceCents != null) {
    query = query.gte('daily_price_cents', filters.minPriceCents);
  }
  if (filters.maxPriceCents != null) {
    query = query.lte('daily_price_cents', filters.maxPriceCents);
  }
  if (filters.city?.trim()) {
    query = query.ilike('city', `%${filters.city.trim()}%`);
  }
  if (filters.search?.trim()) {
    const term = filters.search.trim();
    query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Listing[];
}

export async function fetchMyListings(ownerId: string): Promise<Listing[]> {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Listing[];
}

export async function fetchListingById(id: string): Promise<Listing | null> {
  const { data, error } = await supabase
    .from('listings')
    .select('*, profiles(display_name, city)')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Listing;
}

export async function createListing(
  listing: Omit<Listing, 'id' | 'created_at' | 'image_paths'> & { image_paths?: string[] }
): Promise<Listing> {
  const { data, error } = await supabase
    .from('listings')
    .insert(listing)
    .select()
    .single();

  if (error) throw error;
  return data as Listing;
}

export async function updateListing(
  id: string,
  updates: Partial<
    Pick<
      Listing,
      | 'title'
      | 'description'
      | 'category'
      | 'daily_price_cents'
      | 'deposit_cents'
      | 'city'
      | 'image_paths'
      | 'is_active'
    >
  >
): Promise<Listing> {
  const { data, error } = await supabase
    .from('listings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Listing;
}

export async function uploadListingImage(
  ownerId: string,
  listingId: string,
  uri: string,
  mimeType = 'image/jpeg'
): Promise<string> {
  const ext = mimeType.includes('png') ? 'png' : 'jpg';
  const path = `${ownerId}/${listingId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const response = await fetch(uri);
  const blob = await response.blob();
  const arrayBuffer = await new Response(blob).arrayBuffer();

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, arrayBuffer, { contentType: mimeType, upsert: false });

  if (error) throw error;
  return path;
}

export function listingImageUrl(listing: Listing): string {
  const first = listing.image_paths?.[0];
  if (!first) return '';
  return getPublicImageUrl(first);
}
