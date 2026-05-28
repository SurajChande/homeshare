import { Link, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { PayBookingButton } from '@/components/PayBookingButton';
import { useAuth } from '@/context/AuthContext';
import { fetchBookingById, updateBookingStatus } from '@/lib/api/bookings';
import { BOOKING_STATUS_LABEL } from '@/lib/constants';
import type { Booking } from '@/lib/types';
import { formatCents } from '@/lib/utils';
import { theme } from '@/lib/theme';

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (id) setBooking(await fetchBookingById(id));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (!booking || !user) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const isOwner = booking.owner_id === user.id;
  const isRenter = booking.renter_id === user.id;

  const setStatus = async (status: 'approved' | 'declined' | 'cancelled') => {
    setLoading(true);
    try {
      await updateBookingStatus(booking.id, status);
      await load();
    } catch (e: unknown) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{booking.listings?.title ?? 'Booking'}</Text>
      <Text style={styles.row}>
        {booking.start_date} → {booking.end_date}
      </Text>
      <Text style={styles.status}>{BOOKING_STATUS_LABEL[booking.status]}</Text>
      <Text style={styles.total}>{formatCents(booking.total_cents)}</Text>

      {isOwner && booking.status === 'pending' && (
        <View style={styles.actions}>
          <Button title="Approve" onPress={() => setStatus('approved')} loading={loading} />
          <Button
            title="Decline"
            variant="danger"
            onPress={() => setStatus('declined')}
            loading={loading}
          />
        </View>
      )}

      {isRenter && booking.status === 'approved' && (
        <PayBookingButton bookingId={booking.id} onPaid={load} />
      )}

      <Link href={`/chat/${booking.id}`} style={styles.chatLink}>
        <Text style={styles.chatText}>Open messages</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.lg, backgroundColor: theme.colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: theme.colors.text },
  row: { marginTop: 8, color: theme.colors.textSecondary },
  status: { marginTop: 16, fontSize: 16, color: theme.colors.primary, fontWeight: '600' },
  total: { marginTop: 8, fontSize: 24, fontWeight: '700' },
  actions: { marginTop: 24, gap: 12 },
  chatLink: { marginTop: 32 },
  chatText: { color: theme.colors.accent, fontSize: 16, fontWeight: '600' },
});
