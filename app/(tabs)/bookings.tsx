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
      ListEmptyComponent={<EmptyState title="No bookings yet" message="Request a rental from a listing." />}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
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
        return (
          <Link href={`/booking/${item.id}`} asChild>
            <Pressable style={styles.card}>
              <Text style={styles.role}>{role}</Text>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.dates}>
                {item.start_date} → {item.end_date}
              </Text>
              <Text style={styles.status}>{BOOKING_STATUS_LABEL[item.status]}</Text>
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
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  role: { fontSize: 12, color: theme.colors.accent, fontWeight: '600' },
  title: { fontSize: 17, fontWeight: '600', marginTop: 4, color: theme.colors.text },
  dates: { color: theme.colors.textSecondary, marginTop: 4 },
  status: { marginTop: 8, color: theme.colors.primary, fontWeight: '500' },
  total: { marginTop: 4, fontWeight: '700', color: theme.colors.text },
});
