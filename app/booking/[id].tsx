import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { PayBookingButton } from '@/components/PayBookingButton';
import { Skeleton } from '@/components/LoadingSkeleton';
import { useAuth } from '@/context/AuthContext';
import { fetchBookingById, updateBookingStatus } from '@/lib/api/bookings';
import { BOOKING_STATUS_LABEL } from '@/lib/constants';
import type { Booking } from '@/lib/types';
import { formatCents } from '@/lib/utils';
import { useTheme } from '@/lib/useTheme';

type BadgeVariant = 'primary' | 'accent' | 'danger' | 'warning' | 'success' | 'neutral';

function statusBadgeVariant(status: Booking['status']): BadgeVariant {
  switch (status) {
    case 'pending':   return 'warning';
    case 'approved':  return 'primary';
    case 'paid':
    case 'active':    return 'success';
    case 'completed': return 'neutral';
    case 'declined':
    case 'cancelled': return 'danger';
    default:          return 'neutral';
  }
}

function InfoRow({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { colors, radius, shadow, spacing } = useTheme();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (id) setBooking(await fetchBookingById(id));
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (!booking || !user) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={[styles.content, { paddingHorizontal: spacing.md }]}
      >
        <Skeleton height={200} borderRadius={24} style={{ marginTop: 16 }} />
        <Skeleton height={120} borderRadius={24} style={{ marginTop: 12 }} />
        <Skeleton height={80} borderRadius={24} style={{ marginTop: 12 }} />
      </ScrollView>
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
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingHorizontal: spacing.md }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Main info card */}
      <View
        style={[
          styles.mainCard,
          {
            backgroundColor: colors.surface,
            borderRadius: radius.lg,
            borderColor: colors.border,
          },
          shadow.md,
        ]}
      >
        <Text style={[styles.listingTitle, { color: colors.text }]}>
          {booking.listings?.title ?? 'Booking'}
        </Text>

        <View style={styles.statusRow}>
          <Badge
            label={BOOKING_STATUS_LABEL[booking.status]}
            variant={statusBadgeVariant(booking.status)}
            dot
          />
          <Badge
            label={isOwner ? 'Hosting' : 'Renting'}
            variant={isOwner ? 'accent' : 'primary'}
          />
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.infoRows}>
          <InfoRow label="Check-in" value={booking.start_date} />
          <InfoRow label="Check-out" value={booking.end_date} />
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Total</Text>
          <Text style={[styles.totalValue, { color: colors.text }]}>
            {formatCents(booking.total_cents)}
          </Text>
        </View>
      </View>

      {/* Owner: respond to pending request */}
      {isOwner && booking.status === 'pending' && (
        <View
          style={[
            styles.actionCard,
            {
              backgroundColor: colors.surface,
              borderRadius: radius.lg,
              borderColor: colors.border,
            },
            shadow.sm,
          ]}
        >
          <Text style={[styles.actionTitle, { color: colors.text }]}>Respond to request</Text>
          <View style={styles.actionButtons}>
            <Button
              title="Approve"
              variant="accent"
              onPress={() => setStatus('approved')}
              loading={loading}
              fullWidth={false}
              style={styles.actionBtn}
            />
            <Button
              title="Decline"
              variant="danger"
              onPress={() => setStatus('declined')}
              loading={loading}
              fullWidth={false}
              style={styles.actionBtn}
            />
          </View>
        </View>
      )}

      {/* Renter: pay approved booking */}
      {isRenter && booking.status === 'approved' && (
        <View
          style={[
            styles.actionCard,
            {
              backgroundColor: colors.surface,
              borderRadius: radius.lg,
              borderColor: colors.primaryMuted,
              borderWidth: 2,
            },
            shadow.sm,
          ]}
        >
          <View style={styles.payHeader}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
            <Text style={[styles.actionTitle, { color: colors.text }]}>Complete payment</Text>
          </View>
          <PayBookingButton bookingId={booking.id} onPaid={load} />
        </View>
      )}

      {/* Renter: cancel pending request */}
      {isRenter && booking.status === 'pending' && (
        <View
          style={[
            styles.actionCard,
            {
              backgroundColor: colors.surface,
              borderRadius: radius.lg,
              borderColor: colors.border,
            },
            shadow.sm,
          ]}
        >
          <Button
            title="Cancel request"
            variant="secondary"
            onPress={() => setStatus('cancelled')}
            loading={loading}
          />
        </View>
      )}

      {/* Chat link */}
      <Link href={`/chat/${booking.id}`} asChild>
        <Pressable
          style={({ pressed }) => [
            styles.chatCard,
            {
              backgroundColor: colors.primaryMuted,
              borderRadius: radius.lg,
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.primary} />
          <Text style={[styles.chatText, { color: colors.primary }]}>
            Open messages for this booking
          </Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </Pressable>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingTop: 16,
    paddingBottom: 48,
    gap: 12,
  },
  mainCard: {
    padding: 20,
    borderWidth: 1,
    gap: 14,
  },
  listingTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
    lineHeight: 29,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  divider: {
    height: 1,
  },
  infoRows: {
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
  },
  totalValue: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  actionCard: {
    padding: 20,
    borderWidth: 1,
    gap: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
  },
  payHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 10,
  },
  chatText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
});
