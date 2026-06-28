import { ScrollView, StyleSheet, View } from 'react-native';
import { LISTING_CATEGORIES } from '@/lib/constants';
import type { ListingCategory, ListingFilters } from '@/lib/types';
import { useTheme } from '@/lib/useTheme';
import { SearchBar } from '@/components/SearchBar';
import { PillButton } from '@/components/PillButton';

interface Props {
  filters: ListingFilters;
  onChange: (filters: ListingFilters) => void;
}

export function SearchFilters({ filters, onChange }: Props) {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.wrap, { backgroundColor: colors.background }]}>
      <SearchBar
        value={filters.search ?? ''}
        onChangeText={(search) => onChange({ ...filters, search })}
        placeholder="Search spaces, tools, parking…"
        style={styles.searchBar}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.chipsContent, { paddingHorizontal: spacing.md }]}
        style={styles.chips}
      >
        <PillButton
          label="All"
          active={!filters.category}
          onPress={() => onChange({ ...filters, category: null })}
        />
        {LISTING_CATEGORIES.map((c) => (
          <PillButton
            key={c.value}
            label={c.label}
            active={filters.category === c.value}
            onPress={() =>
              onChange({
                ...filters,
                category: filters.category === c.value ? null : (c.value as ListingCategory),
              })
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 12,
    paddingBottom: 12,
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  chips: {
    flexGrow: 0,
  },
  chipsContent: {
    gap: 8,
    paddingRight: 16,
  },
});
