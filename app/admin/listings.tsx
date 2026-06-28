import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  adminDeleteListing,
  adminUpdateListing,
  getAllListings,
  type AdminListingRow,
} from '@/lib/api/admin';
import { listingImageUrl } from '@/lib/api/listings';
import { CATEGORY_LABEL } from '@/lib/constants';
import { formatCents } from '@/lib/utils';
import { useTheme } from '@/lib/useTheme';
import { SearchBar } from '@/components/SearchBar';
import { Badge } from '@/components/Badge';

export default function AdminListingsScreen() {
  const { colors, radius, shadow, spacing } = useTheme();
  const [listings, setListings] = useState<AdminListingRow[]>([]);
  const [filtered, setFiltered] = useState<AdminListingRow[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getAllListings()
      .then((data) => { setListings(data); setFiltered(data); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      listings.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q) ||
          (l.profiles?.display_name ?? '').toLowerCase().includes(q)
      )
    );
  }, [search, listings]);

  const toggleActive = (listing: AdminListingRow) => {
    const action = listing.is_active ? 'Deactivate' : 'Reactivate';
    Alert.alert(`${action} listing?`, listing.title, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: action,
        style: listing.is_active ? 'destructive' : 'default',
        onPress: async () => {
          try {
            await adminUpdateListing(listing.id, { is_active: !listing.is_active });
            load();
          } catch (e: unknown) {
            Alert.alert('Error', e instanceof Error ? e.message : 'Failed');
          }
        },
      },
    ]);
  };

  const deleteListing = (listing: AdminListingRow) => {
    Alert.alert('Delete listing?', `This will permanently delete "${listing.title}".`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await adminDeleteListing(listing.id);
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
          placeholder="Search listings…"
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
          const imageUri = listingImageUrl(item);
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
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  style={[styles.thumb, { borderRadius: radius.md }]}
                />
              ) : (
                <View
                  style={[
                    styles.thumb,
                    styles.thumbPlaceholder,
                    { backgroundColor: colors.surfaceSubtle, borderRadius: radius.md },
                  ]}
                >
                  <Ionicons name="image-outline" size={20} color={colors.textTertiary} />
                </View>
              )}
              <View style={styles.info}>
                <View style={styles.titleRow}>
                  <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  {!item.is_active && <Badge label="Inactive" variant="neutral" size="sm" />}
                </View>
                <Text style={[styles.meta, { color: colors.textSecondary }]}>
                  {CATEGORY_LABEL[item.category]} · {item.city}
                </Text>
                <Text style={[styles.meta, { color: colors.textSecondary }]}>
                  {item.profiles?.display_name ?? 'Unknown'}
                </Text>
                <Text style={[styles.price, { color: colors.primary }]}>
                  {formatCents(item.daily_price_cents)}/day
                </Text>
              </View>
              <View style={styles.actions}>
                <Pressable
                  onPress={() => toggleActive(item)}
                  style={({ pressed }) =>
                    StyleSheet.flatten([
                      styles.actionBtn,
                      {
                        backgroundColor: item.is_active ? colors.warningMuted : colors.accentMuted,
                        borderRadius: radius.xs,
                        opacity: pressed ? 0.7 : 1,
                      },
                    ])
                  }
                >
                  <Text
                    style={[
                      styles.actionText,
                      { color: item.is_active ? colors.warning : colors.accentDark },
                    ]}
                  >
                    {item.is_active ? 'Deactivate' : 'Activate'}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => deleteListing(item)}
                  style={({ pressed }) =>
                    StyleSheet.flatten([
                      styles.actionBtn,
                      {
                        backgroundColor: colors.dangerMuted,
                        borderRadius: radius.xs,
                        opacity: pressed ? 0.7 : 1,
                      },
                    ])
                  }
                >
                  <Text style={[styles.actionText, { color: colors.danger }]}>Delete</Text>
                </Pressable>
              </View>
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
  thumb: {
    width: 72,
    height: 72,
    flexShrink: 0,
  },
  thumbPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, minWidth: 0, gap: 3 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 2,
  },
  title: { fontSize: 15, fontWeight: '700', flex: 1 },
  meta: { fontSize: 12, fontWeight: '500' },
  price: { fontSize: 13, fontWeight: '700', marginTop: 4 },
  actions: { gap: 6, flexShrink: 0, alignItems: 'flex-end' },
  actionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
  },
  actionText: { fontSize: 12, fontWeight: '600' },
});
