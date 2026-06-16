import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { useAuth } from '@/context/AuthContext';
import { fetchMyBookings } from '@/lib/api/bookings';
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

export default function BookingsScreen() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [refreshing, setRefreshing] = useState(false);

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

  return (
    <FlatList
      style={styles.container}
      data={bookings}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      ListEmptyComponent={<EmptyState title="No bookings yet" message="Request a rental from any listing to get started." />}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          tintColor={theme.colors.primary}
          onRefresh={async () => {
            setRefreshing(true);
            await load();
            setRefreshing(false);
          }}
        />
      }
      renderItem={({ item }) => {
        const role = item.renter_id === user?.id ? 'Renting' : 'Hosting';
        const title = item.listings?.title ?? 'Listing';
        const color = statusColor(item.status);
        return (
          <Link href={`/booking/${item.id}`} asChild>
            <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
              <View style={styles.cardTop}>
                <View style={[styles.roleBadge, role === 'Hosting' && styles.roleBadgeHost]}>
                  <Text style={[styles.roleText, role === 'Hosting' && styles.roleTextHost]}>
                    {role}
                  </Text>
                </View>
                <View style={[styles.statusDot, { backgroundColor: color }]} />
                <Text style={[styles.statusText, { color }]}>
                  {BOOKING_STATUS_LABEL[item.status]}
                </Text>
              </View>
              <Text style={styles.title} numberOfLines={1}>{title}</Text>
              <Text style={styles.dates}>
                {item.start_date} → {item.end_date}
              </Text>
              <Text style={styles.total}>{formatCents(item.total_cents)}</Text>
            </Pressable>
          </Link>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  list: { padding: theme.spacing.md, flexGrow: 1 },
  card: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.xs,
  },
  cardPressed: { opacity: 0.85 },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accentMuted,
  },
  roleBadgeHost: {
    backgroundColor: theme.colors.primaryMuted,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.accent,
  },
  roleTextHost: {
    color: '#A66E00',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  title: { fontSize: 17, fontWeight: '700', color: theme.colors.text },
  dates: { fontSize: 13, color: theme.colors.textSecondary },
  total: { fontSize: 16, fontWeight: '700', color: theme.colors.text, marginTop: theme.spacing.xs },
});
