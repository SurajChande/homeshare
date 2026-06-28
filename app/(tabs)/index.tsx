import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { ListingCard } from '@/components/ListingCard';
import { ListingCardSkeleton } from '@/components/LoadingSkeleton';
import { SearchFilters } from '@/components/SearchFilters';
import { FLOATING_TAB_BAR_HEIGHT } from '@/components/FloatingTabBar';
import { useAuth } from '@/context/AuthContext';
import { fetchListings } from '@/lib/api/listings';
import type { Listing, ListingFilters as Filters } from '@/lib/types';
import { useTheme } from '@/lib/useTheme';

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function BrowseScreen() {
  const { profile } = useAuth();
  const { colors } = useTheme();
  const [filters, setFilters] = useState<Filters>({});
  const debouncedFilters = useDebounce(filters, 400);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchListings(debouncedFilters);
      setListings(data);
    } catch {
      setListings([]);
    }
  }, [debouncedFilters]);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const greeting = getGreeting();
  const name = profile?.display_name?.split(' ')[0];

  const ListHeader = useMemo(
    () => (
      <View style={styles.header}>
        <View style={styles.greeting}>
          <Text style={[styles.greetingText, { color: colors.textSecondary }]}>{greeting}</Text>
          <Text style={[styles.greetingName, { color: colors.text }]}>
            {name ? `${name} 👋` : 'Welcome'}
          </Text>
        </View>
        <SearchFilters filters={filters} onChange={setFilters} />
      </View>
    ),
    [greeting, name, colors, filters]
  );

  const listEmpty = useMemo(
    () =>
      loading ? (
        <View style={styles.skeletons}>
          {[0, 1, 2].map((i) => <ListingCardSkeleton key={i} />)}
        </View>
      ) : (
        <EmptyState
          title="No listings found"
          message="Try adjusting your filters, or be the first to share something!"
          icon="search"
        />
      ),
    [loading]
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ListingCard listing={item} />}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: FLOATING_TAB_BAR_HEIGHT + 32 },
        ]}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={listEmpty}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    marginBottom: 8,
  },
  greeting: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 2,
  },
  greetingText: {
    fontSize: 15,
    fontWeight: '500',
  },
  greetingName: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  list: {
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  skeletons: {
    gap: 0,
  },
});
