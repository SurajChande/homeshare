import { supabase } from '../supabase';
import type { ConversationPreview, Message } from '../types';

export async function fetchMessages(bookingId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('booking_id', bookingId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as Message[];
}

export async function sendMessage(
  bookingId: string,
  senderId: string,
  body: string
): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert({ booking_id: bookingId, sender_id: senderId, body: body.trim() })
    .select()
    .single();

  if (error) throw error;
  return data as Message;
}

export function subscribeToMessages(
  bookingId: string,
  onMessage: (message: Message) => void
) {
  const channel = supabase
    .channel(`messages:${bookingId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `booking_id=eq.${bookingId}`,
      },
      (payload) => {
        onMessage(payload.new as Message);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export async function fetchConversationPreviews(
  userId: string
): Promise<ConversationPreview[]> {
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('id, renter_id, owner_id, listings(title)')
    .or(`renter_id.eq.${userId},owner_id.eq.${userId}`)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  if (!bookings?.length) return [];

  const previews: ConversationPreview[] = [];

  for (const booking of bookings) {
    const listingTitle =
      (booking.listings as { title?: string } | null)?.title ?? 'Listing';
    const otherId =
      booking.renter_id === userId ? booking.owner_id : booking.renter_id;

    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', otherId)
      .single();

    const { data: lastMsg } = await supabase
      .from('messages')
      .select('body, created_at')
      .eq('booking_id', booking.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    previews.push({
      booking_id: booking.id,
      listing_title: listingTitle,
      other_party_name: profile?.display_name ?? 'User',
      last_message: lastMsg?.body ?? null,
      last_message_at: lastMsg?.created_at ?? null,
    });
  }

  return previews;
}
