import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { adminDeleteListing, adminUpdateListing, getAllListings, type AdminListingRow } from '@/lib/api/admin';
import { listingImageUrl } from '@/lib/api/listings';
import { CATEGORY_LABEL } from '@/lib/constants';
import { formatCents } from '@/lib/utils';
import { theme } from '@/lib/theme';

export default function AdminListingsScreen() {
  const [listings, setListings] = useState<AdminListingRow[]>([]);
  const [filtered, setFiltered] = useState<AdminListingRow[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getAllListings()
      .then((data) => {
        setListings(data);
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
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <TextInput
          style={styles.search}
          placeholder="Search listings..."
          placeholderTextColor={theme.colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
        <Text style={styles.count}>{filtered.length} listings</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const imageUri = listingImageUrl(item);
            return (
              <View style={styles.row}>
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.thumb} />
                ) : (
                  <View style={[styles.thumb, styles.thumbPlaceholder]}>
                    <Text style={styles.thumbPlaceholderText}>No photo</Text>
                  </View>
                )}
                <View style={styles.info}>
                  <View style={styles.titleRow}>
                    <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                    {!item.is_active && (
                      <View style={styles.inactiveBadge}>
                        <Text style={styles.inactiveBadgeText}>Inactive</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.meta}>
                    {CATEGORY_LABEL[item.category]} · {item.city}
                  </Text>
                  <Text style={styles.meta}>
                    By {item.profiles?.display_name ?? 'Unknown'}
                  </Text>
                  <Text style={styles.price}>{formatCents(item.daily_price_cents)}/day</Text>
                </View>
                <View style={styles.actions}>
                  <Pressable
                    style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
                    onPress={() => toggleActive(item)}
                  >
                    <Text style={styles.actionToggle}>
                      {item.is_active ? 'Deactivate' : 'Activate'}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [styles.actionBtn, styles.actionDelete, pressed && styles.actionBtnPressed]}
                    onPress={() => deleteListing(item)}
                  >
                    <Text style={styles.actionDeleteText}>Delete</Text>
                  </Pressable>
                </View>
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
  thumb: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.md,
    flexShrink: 0,
    backgroundColor: theme.colors.surface,
  },
  thumbPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbPlaceholderText: { fontSize: 11, color: theme.colors.textSecondary },
  info: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs, flexWrap: 'wrap' },
  title: { fontSize: 15, fontWeight: '700', color: theme.colors.text, flex: 1 },
  inactiveBadge: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  inactiveBadgeText: { fontSize: 11, color: theme.colors.textSecondary },
  meta: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 2 },
  price: { fontSize: 14, fontWeight: '700', color: theme.colors.text, marginTop: 4 },
  actions: { gap: theme.spacing.xs, flexShrink: 0 },
  actionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  actionBtnPressed: { opacity: 0.7 },
  actionDelete: { borderColor: theme.colors.danger + '40' },
  actionToggle: { fontSize: 12, fontWeight: '600', color: theme.colors.accent },
  actionDeleteText: { fontSize: 12, fontWeight: '600', color: theme.colors.danger },
});
