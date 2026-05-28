import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { ListingCard } from '@/components/ListingCard';
import { useAuth } from '@/context/AuthContext';
import { fetchMyListings, updateListing } from '@/lib/api/listings';
import type { Listing } from '@/lib/types';
import { theme } from '@/lib/theme';

export default function MyListingsScreen() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    const data = await fetchMyListings(user.id);
    setListings(data);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const deactivate = (listing: Listing) => {
    Alert.alert('Deactivate listing?', listing.title, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Deactivate',
        style: 'destructive',
        onPress: async () => {
          await updateListing(listing.id, { is_active: false });
          load();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Link href="/listing/new" asChild>
        <Pressable style={styles.addBtn}>
          <Text style={styles.addText}>+ New listing</Text>
        </Pressable>
      </Link>
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <ListingCard listing={item} />
            <View style={styles.actions}>
              <Link href={`/listing/new?id=${item.id}`} asChild>
                <Pressable>
                  <Text style={styles.action}>Edit</Text>
                </Pressable>
              </Link>
              {item.is_active ? (
                <Pressable onPress={() => deactivate(item)}>
                  <Text style={[styles.action, styles.danger]}>Deactivate</Text>
                </Pressable>
              ) : (
                <Text style={styles.inactive}>Inactive</Text>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <EmptyState title="No listings yet" message="Tap + New listing to share an item." />
        }
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
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  addBtn: {
    margin: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
  },
  addText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  list: { paddingHorizontal: theme.spacing.md, flexGrow: 1 },
  actions: { flexDirection: 'row', gap: 16, marginTop: -8, marginBottom: 16, paddingLeft: 4 },
  action: { color: theme.colors.primary, fontWeight: '600' },
  danger: { color: theme.colors.danger },
  inactive: { color: theme.colors.textSecondary },
});
