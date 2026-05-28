import { supabase } from '../supabase';
import type { Booking, BookingStatus } from '../types';

export async function fetchMyBookings(userId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, listings(title, image_paths, daily_price_cents)')
    .or(`renter_id.eq.${userId},owner_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Booking[];
}

export async function fetchBookingById(id: string): Promise<Booking | null> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, listings(title, image_paths, daily_price_cents, city)')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Booking;
}

export async function createBooking(params: {
  listing_id: string;
  renter_id: string;
  owner_id: string;
  start_date: string;
  end_date: string;
  total_cents: number;
}): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .insert({ ...params, status: 'pending' })
    .select()
    .single();

  if (error) throw error;
  return data as Booking;
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus
): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Booking;
}

export async function createPaymentIntent(bookingId: string): Promise<{
  clientSecret: string;
  paymentIntentId: string;
}> {
  const { data: session } = await supabase.auth.getSession();
  const token = session.session?.access_token;
  if (!token) throw new Error('Not authenticated');

  const { data, error } = await supabase.functions.invoke('create-payment-intent', {
    body: { bookingId },
    headers: { Authorization: `Bearer ${token}` },
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data as { clientSecret: string; paymentIntentId: string };
}
