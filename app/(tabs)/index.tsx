import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { ListingCard } from '@/components/ListingCard';
import { SearchFilters } from '@/components/SearchFilters';
import { fetchListings } from '@/lib/api/listings';
import type { Listing, ListingFilters as Filters } from '@/lib/types';
import { theme } from '@/lib/theme';

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function BrowseScreen() {
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

  const listEmpty = useMemo(
    () => (
      <EmptyState
        title={loading ? 'Loading...' : 'No listings found'}
        message="Try adjusting your filters, or list your first item."
      />
    ),
    [loading]
  );

  return (
    <View style={styles.container}>
      <SearchFilters filters={filters} onChange={setFilters} />
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ListingCard listing={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={listEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  list: {
    padding: theme.spacing.md,
    flexGrow: 1,
  },
});
