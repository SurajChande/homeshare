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
        <Pressable style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}>
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
                <Pressable style={styles.actionBtn}>
                  <Text style={styles.actionEdit}>Edit</Text>
                </Pressable>
              </Link>
              {item.is_active ? (
                <Pressable style={styles.actionBtn} onPress={() => deactivate(item)}>
                  <Text style={styles.actionDanger}>Deactivate</Text>
                </Pressable>
              ) : (
                <View style={styles.inactiveTag}>
                  <Text style={styles.inactiveText}>Inactive</Text>
                </View>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <EmptyState title="No listings yet" message="Tap + New listing to share an item with neighbours." />
        }
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
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  addBtn: {
    margin: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  addBtnPressed: { opacity: 0.8 },
  addText: { color: theme.colors.textOnPrimary, fontWeight: '700', fontSize: 16 },
  list: { paddingHorizontal: theme.spacing.md, flexGrow: 1 },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: -theme.spacing.sm,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.xs,
    alignItems: 'center',
  },
  actionBtn: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionEdit: { color: theme.colors.accent, fontWeight: '600', fontSize: 13 },
  actionDanger: { color: theme.colors.danger, fontWeight: '600', fontSize: 13 },
  inactiveTag: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
  },
  inactiveText: { color: theme.colors.textSecondary, fontSize: 13 },
});
