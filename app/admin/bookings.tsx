import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { adminCancelBooking, getAllBookings, type AdminBookingRow } from '@/lib/api/admin';
import { BOOKING_STATUS_LABEL } from '@/lib/constants';
import { formatCents } from '@/lib/utils';
import { theme } from '@/lib/theme';

function statusColor(status: string): string {
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

export default function AdminBookingsScreen() {
  const [bookings, setBookings] = useState<AdminBookingRow[]>([]);
  const [filtered, setFiltered] = useState<AdminBookingRow[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getAllBookings()
      .then((data) => {
        setBookings(data);
        setFiltered(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      bookings.filter(
        (b) =>
          (b.listings?.title ?? '').toLowerCase().includes(q) ||
          (b.renter as { display_name?: string } | undefined)?.display_name?.toLowerCase().includes(q) ||
          b.status.includes(q)
      )
    );
  }, [search, bookings]);

  const cancelBooking = (booking: AdminBookingRow) => {
    Alert.alert('Cancel booking?', `Cancel booking for "${booking.listings?.title}"?`, [
      { text: 'No', style: 'cancel' },
      {
        text: 'Cancel booking',
        style: 'destructive',
        onPress: async () => {
          try {
            await adminCancelBooking(booking.id);
            load();
          } catch (e: unknown) {
            Alert.alert('Error', e instanceof Error ? e.message : 'Failed');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <TextInput
          style={styles.search}
          placeholder="Search by listing or renter..."
          placeholderTextColor={theme.colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
        <Text style={styles.count}>{filtered.length} bookings</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const color = statusColor(item.status);
            const renterName = (item.renter as { display_name?: string } | undefined)?.display_name ?? 'Unknown';
            const ownerName = (item.owner as { display_name?: string } | undefined)?.display_name ?? 'Unknown';
            return (
              <View style={styles.row}>
                <View style={styles.info}>
                  <Text style={styles.listingTitle} numberOfLines={1}>
                    {item.listings?.title ?? 'Listing'}
                  </Text>
                  <View style={styles.statusRow}>
                    <View style={[styles.statusDot, { backgroundColor: color }]} />
                    <Text style={[styles.status, { color }]}>
                      {BOOKING_STATUS_LABEL[item.status]}
                    </Text>
                  </View>
                  <Text style={styles.meta}>
                    {item.start_date} → {item.end_date}
                  </Text>
                  <Text style={styles.meta}>Renter: {renterName}</Text>
                  <Text style={styles.meta}>Owner: {ownerName}</Text>
                  <Text style={styles.total}>{formatCents(item.total_cents)}</Text>
                </View>
                {!['cancelled', 'declined', 'completed'].includes(item.status) && (
                  <Pressable
                    style={({ pressed }) => [styles.cancelBtn, pressed && styles.cancelBtnPressed]}
                    onPress={() => cancelBooking(item)}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </Pressable>
                )}
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.surface },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  search: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    fontSize: 15,
    color: theme.colors.text,
  },
  count: { fontSize: 13, color: theme.colors.textSecondary, fontWeight: '500', flexShrink: 0 },
  loader: { marginTop: theme.spacing.xxl },
  list: { padding: theme.spacing.md, gap: theme.spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  info: { flex: 1 },
  listingTitle: { fontSize: 15, fontWeight: '700', color: theme.colors.text, marginBottom: 4 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  status: { fontSize: 13, fontWeight: '600' },
  meta: { fontSize: 13, color: theme.colors.textSecondary },
  total: { fontSize: 15, fontWeight: '700', color: theme.colors.text, marginTop: 4 },
  cancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.danger + '50',
    alignSelf: 'flex-start',
    flexShrink: 0,
  },
  cancelBtnPressed: { opacity: 0.7 },
  cancelText: { fontSize: 13, fontWeight: '600', color: theme.colors.danger },
});
