import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { adminCancelBooking, getAllBookings, type AdminBookingRow } from '@/lib/api/admin';
import { BOOKING_STATUS_LABEL } from '@/lib/constants';
import { formatCents } from '@/lib/utils';
import { useTheme } from '@/lib/useTheme';
import { SearchBar } from '@/components/SearchBar';
import { Badge } from '@/components/Badge';

type BadgeVariant = 'primary' | 'accent' | 'danger' | 'warning' | 'success' | 'neutral';

function statusVariant(status: string): BadgeVariant {
  switch (status) {
    case 'pending':    return 'warning';
    case 'approved':   return 'primary';
    case 'paid':
    case 'active':     return 'success';
    case 'completed':  return 'neutral';
    case 'declined':
    case 'cancelled':  return 'danger';
    default:           return 'neutral';
  }
}

export default function AdminBookingsScreen() {
  const { colors, radius, shadow, spacing } = useTheme();
  const [bookings, setBookings] = useState<AdminBookingRow[]>([]);
  const [filtered, setFiltered] = useState<AdminBookingRow[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getAllBookings()
      .then((data) => { setBookings(data); setFiltered(data); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      bookings.filter(
        (b) =>
          (b.listings?.title ?? '').toLowerCase().includes(q) ||
          (b.renter as { display_name?: string } | undefined)?.display_name
            ?.toLowerCase()
            .includes(q) ||
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.toolbar, { borderBottomColor: colors.border }]}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search by listing, renter, status…"
          style={styles.searchBar}
        />
        <Text style={[styles.count, { color: colors.textSecondary }]}>
          {filtered.length}
        </Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingHorizontal: spacing.md }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const renterName =
            (item.renter as { display_name?: string } | undefined)?.display_name ?? 'Unknown';
          const ownerName =
            (item.owner as { display_name?: string } | undefined)?.display_name ?? 'Unknown';
          const canCancel = !['cancelled', 'declined', 'completed'].includes(item.status);

          return (
            <View
              style={[
                styles.row,
                {
                  backgroundColor: colors.surface,
                  borderRadius: radius.lg,
                  borderColor: colors.border,
                },
                shadow.sm,
              ]}
            >
              <View style={styles.info}>
                <Text style={[styles.listingTitle, { color: colors.text }]} numberOfLines={1}>
                  {item.listings?.title ?? 'Listing'}
                </Text>
                <Badge
                  label={BOOKING_STATUS_LABEL[item.status]}
                  variant={statusVariant(item.status)}
                  size="sm"
                  dot
                  style={styles.statusBadge}
                />
                <View style={styles.metaRow}>
                  <Ionicons name="calendar-outline" size={12} color={colors.textSecondary} />
                  <Text style={[styles.meta, { color: colors.textSecondary }]}>
                    {item.start_date} → {item.end_date}
                  </Text>
                </View>
                <Text style={[styles.meta, { color: colors.textSecondary }]}>
                  Renter: {renterName}
                </Text>
                <Text style={[styles.meta, { color: colors.textSecondary }]}>
                  Owner: {ownerName}
                </Text>
                <Text style={[styles.total, { color: colors.text }]}>
                  {formatCents(item.total_cents)}
                </Text>
              </View>
              {canCancel && (
                <Pressable
                  onPress={() => cancelBooking(item)}
                  style={({ pressed }) =>
                    StyleSheet.flatten([
                      styles.cancelBtn,
                      {
                        backgroundColor: colors.dangerMuted,
                        borderRadius: radius.xs,
                        opacity: pressed ? 0.7 : 1,
                      },
                    ])
                  }
                >
                  <Text style={[styles.cancelText, { color: colors.danger }]}>Cancel</Text>
                </Pressable>
              )}
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  searchBar: { flex: 1 },
  count: { fontSize: 13, fontWeight: '600', flexShrink: 0 },
  list: { paddingTop: 12, paddingBottom: 40 },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderWidth: 1,
  },
  info: { flex: 1, minWidth: 0, gap: 4 },
  listingTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  statusBadge: {
    marginVertical: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  meta: { fontSize: 12, fontWeight: '500' },
  total: { fontSize: 14, fontWeight: '700', marginTop: 2 },
  cancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    flexShrink: 0,
  },
  cancelText: { fontSize: 13, fontWeight: '600' },
});
