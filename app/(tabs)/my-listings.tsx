import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { EmptyState } from '@/components/EmptyState';
import { ListingCard } from '@/components/ListingCard';
import { FLOATING_TAB_BAR_HEIGHT } from '@/components/FloatingTabBar';
import { useAuth } from '@/context/AuthContext';
import { fetchMyListings, updateListing } from '@/lib/api/listings';
import type { Listing } from '@/lib/types';
import { useTheme } from '@/lib/useTheme';

export default function MyListingsScreen() {
  const { user } = useAuth();
  const { colors, radius, shadow } = useTheme();
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
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: FLOATING_TAB_BAR_HEIGHT + 32 },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.screenTitle, { color: colors.text }]}>My Listings</Text>
            <Link href="/listing/new" asChild>
              <Pressable
                style={({ pressed }) => [
                  styles.addBtn,
                  {
                    backgroundColor: colors.primary,
                    borderRadius: radius.button,
                    opacity: pressed ? 0.82 : 1,
                  },
                  shadow.md,
                ]}
              >
                <Ionicons name="add" size={20} color="#FFFFFF" />
                <Text style={styles.addBtnText}>New listing</Text>
              </Pressable>
            </Link>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="No listings yet"
            message="Share items or spaces with your neighborhood."
            icon="storefront-outline"
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
          <View>
            <ListingCard listing={item} />
            <View style={styles.actions}>
              <Link href={`/listing/new?id=${item.id}`} asChild>
                <Pressable
                  style={({ pressed }) => [
                    styles.actionChip,
                    {
                      backgroundColor: colors.primaryMuted,
                      borderRadius: radius.xs,
                      opacity: pressed ? 0.75 : 1,
                    },
                  ]}
                >
                  <Ionicons name="pencil-outline" size={14} color={colors.primary} />
                  <Text style={[styles.actionChipText, { color: colors.primary }]}>Edit</Text>
                </Pressable>
              </Link>
              {item.is_active ? (
                <Pressable
                  style={({ pressed }) => [
                    styles.actionChip,
                    {
                      backgroundColor: colors.dangerMuted,
                      borderRadius: radius.xs,
                      opacity: pressed ? 0.75 : 1,
                    },
                  ]}
                  onPress={() => deactivate(item)}
                >
                  <Ionicons name="eye-off-outline" size={14} color={colors.danger} />
                  <Text style={[styles.actionChipText, { color: colors.danger }]}>Deactivate</Text>
                </Pressable>
              ) : (
                <View
                  style={[
                    styles.actionChip,
                    { backgroundColor: colors.surfaceSubtle, borderRadius: radius.xs },
                  ]}
                >
                  <Text style={[styles.actionChipText, { color: colors.textSecondary }]}>Inactive</Text>
                </View>
              )}
            </View>
          </View>
        )}
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
    paddingBottom: 20,
    gap: 16,
  },
  screenTitle: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 6,
    alignSelf: 'stretch',
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: -10,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 5,
  },
  actionChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
