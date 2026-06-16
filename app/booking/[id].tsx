import { Link, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { PayBookingButton } from '@/components/PayBookingButton';
import { useAuth } from '@/context/AuthContext';
import { fetchBookingById, updateBookingStatus } from '@/lib/api/bookings';
import { BOOKING_STATUS_LABEL } from '@/lib/constants';
import type { Booking } from '@/lib/types';
import { formatCents } from '@/lib/utils';
import { theme } from '@/lib/theme';

function statusColor(status: Booking['status']): string {
  switch (status) {
    case 'pending': return theme.colors.warning;
    case 'approved': return theme.colors.accent;
    case 'paid':
    case 'active': return theme.colors.success;
    case 'completed': return theme.colors.textSecondary;
    case 'declined':
    case 'cancelled': return theme.colors.danger;
    default: return theme.colors.textSecondary;
  }
}

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
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const isOwner = booking.owner_id === user.id;
  const isRenter = booking.renter_id === user.id;
  const color = statusColor(booking.status);

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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.listingTitle}>{booking.listings?.title ?? 'Booking'}</Text>

        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: color }]} />
          <Text style={[styles.statusText, { color }]}>{BOOKING_STATUS_LABEL[booking.status]}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Dates</Text>
          <Text style={styles.infoValue}>
            {booking.start_date} → {booking.end_date}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Role</Text>
          <Text style={styles.infoValue}>{isOwner ? 'Hosting' : 'Renting'}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCents(booking.total_cents)}</Text>
        </View>
      </View>

      {isOwner && booking.status === 'pending' && (
        <View style={styles.actionsCard}>
          <Text style={styles.actionsTitle}>Respond to request</Text>
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
        <View style={styles.actionsCard}>
          <Text style={styles.actionsTitle}>Complete payment</Text>
          <PayBookingButton bookingId={booking.id} onPaid={load} />
        </View>
      )}

      {isRenter && booking.status === 'pending' && (
        <View style={styles.actionsCard}>
          <Button
            title="Cancel request"
            variant="secondary"
            onPress={() => setStatus('cancelled')}
            loading={loading}
          />
        </View>
      )}

      <Link href={`/chat/${booking.id}`} style={styles.chatLink}>
        <Text style={styles.chatText}>Open messages for this booking</Text>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.md, gap: theme.spacing.md, paddingBottom: theme.spacing.xxl },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: theme.colors.textSecondary, fontSize: 16 },
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  listingTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.3,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  totalLabel: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  totalValue: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.text,
  },
  actionsCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  chatLink: {
    alignSelf: 'center',
    marginTop: theme.spacing.sm,
  },
  chatText: {
    color: theme.colors.accent,
    fontSize: 15,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
