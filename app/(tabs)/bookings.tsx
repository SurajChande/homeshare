import { useCallback, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { EmptyState } from '@/components/EmptyState';
import { Badge } from '@/components/Badge';
import { PillButton } from '@/components/PillButton';
import { FLOATING_TAB_BAR_HEIGHT } from '@/components/FloatingTabBar';
import { useAuth } from '@/context/AuthContext';
import { fetchMyBookings } from '@/lib/api/bookings';
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

type Filter = 'all' | 'renting' | 'hosting';

interface BookingCardProps {
  booking: Booking;
  userId: string;
}

function BookingCard({ booking, userId }: BookingCardProps) {
  const router = useRouter();
  const { colors, radius, shadow } = useTheme();
  const isRenting = booking.renter_id === userId;
  const role: Filter = isRenting ? 'renting' : 'hosting';
  const title = booking.listings?.title ?? 'Booking';

  return (
    <Pressable
      onPress={() => router.push(`/booking/${booking.id}`)}
      style={({ pressed }) =>
        StyleSheet.flatten([
          styles.card,
          {
            backgroundColor: colors.surface,
            borderRadius: radius.lg,
            borderColor: colors.border,
            opacity: pressed ? 0.78 : 1,
          },
          shadow.sm,
        ])
      }
      accessibilityRole="button"
      accessibilityLabel={`Booking for ${title}`}
    >
      <View style={styles.cardTop}>
        <Badge
          label={role === 'renting' ? 'Renting' : 'Hosting'}
          variant={role === 'renting' ? 'primary' : 'accent'}
          size="sm"
        />
        <Badge
          label={BOOKING_STATUS_LABEL[booking.status]}
          variant={statusBadgeVariant(booking.status)}
          size="sm"
          dot
        />
      </View>

      <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>
        {title}
      </Text>

      <View style={styles.cardMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={13} color={colors.textSecondary} />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            {booking.start_date} → {booking.end_date}
          </Text>
        </View>
        <Text style={[styles.total, { color: colors.text }]}>
          {formatCents(booking.total_cents)}
        </Text>
      </View>

      <View style={[styles.chevronRow]}>
        <Ionicons name="chevron-forward" size={14} color={colors.borderStrong} />
      </View>
    </Pressable>
  );
}

export default function BookingsScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');

  const load = useCallback(async () => {
    if (!user) return;
    const data = await fetchMyBookings(user.id);
    setBookings(data);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const filtered = bookings.filter((b) => {
    if (filter === 'all') return true;
    if (filter === 'renting') return b.renter_id === user?.id;
    return b.owner_id === user?.id;
  });

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: FLOATING_TAB_BAR_HEIGHT + 32 },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.screenTitle, { color: colors.text }]}>Bookings</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filters}
            >
              {(['all', 'renting', 'hosting'] as Filter[]).map((f) => (
                <PillButton
                  key={f}
                  label={f.charAt(0).toUpperCase() + f.slice(1)}
                  active={filter === f}
                  onPress={() => setFilter(f)}
                />
              ))}
            </ScrollView>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title={filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
            message="Request a rental from any listing to get started."
            icon="calendar-outline"
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            tintColor={colors.primary}
            onRefresh={async () => {
              setRefreshing(true);
              await load();
              setRefreshing(false);
            }}
          />
        }
        renderItem={({ item }) => (
          <BookingCard booking={item} userId={user?.id ?? ''} />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  list: {
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 8,
    gap: 16,
  },
  screenTitle: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  filters: {
    gap: 8,
    paddingBottom: 8,
  },
  card: {
    padding: 16,
    borderWidth: 1,
    gap: 10,
    width: '100%',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
    lineHeight: 23,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '500',
  },
  total: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  chevronRow: {
    alignItems: 'flex-end',
    marginTop: -4,
  },
  separator: {
    height: 12,
  },
});
