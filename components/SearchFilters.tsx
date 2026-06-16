import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { LISTING_CATEGORIES } from '@/lib/constants';
import type { ListingCategory, ListingFilters } from '@/lib/types';
import { theme } from '@/lib/theme';

interface Props {
  filters: ListingFilters;
  onChange: (filters: ListingFilters) => void;
}

export function SearchFilters({ filters, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.search}
          placeholder="Search listings..."
          placeholderTextColor={theme.colors.textSecondary}
          value={filters.search ?? ''}
          onChangeText={(search) => onChange({ ...filters, search })}
          returnKeyType="search"
        />
      </View>
      <View style={styles.cityRow}>
        <TextInput
          style={[styles.search, styles.cityInput]}
          placeholder="Location"
          placeholderTextColor={theme.colors.textSecondary}
          value={filters.city ?? ''}
          onChangeText={(city) => onChange({ ...filters, city })}
        />
        <TextInput
          style={[styles.search, styles.priceInput]}
          placeholder="Min $"
          keyboardType="decimal-pad"
          placeholderTextColor={theme.colors.textSecondary}
          onChangeText={(v) => {
            const n = parseFloat(v);
            onChange({
              ...filters,
              minPriceCents: Number.isNaN(n) ? undefined : Math.round(n * 100),
            });
          }}
        />
        <TextInput
          style={[styles.search, styles.priceInput]}
          placeholder="Max $"
          keyboardType="decimal-pad"
          placeholderTextColor={theme.colors.textSecondary}
          onChangeText={(v) => {
            const n = parseFloat(v);
            onChange({
              ...filters,
              maxPriceCents: Number.isNaN(n) ? undefined : Math.round(n * 100),
            });
          }}
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips} contentContainerStyle={styles.chipsContent}>
        <Chip
          label="All"
          active={!filters.category}
          onPress={() => onChange({ ...filters, category: null })}
        />
        {LISTING_CATEGORIES.map((c) => (
          <Chip
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

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Text
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchRow: {
    marginBottom: theme.spacing.sm,
  },
  cityRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  search: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    fontSize: 15,
    color: theme.colors.text,
  },
  cityInput: {
    flex: 2,
  },
  priceInput: {
    flex: 1,
  },
  chips: {
    marginBottom: theme.spacing.xs,
  },
  chipsContent: {
    gap: theme.spacing.sm,
    paddingRight: theme.spacing.md,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '500',
    overflow: 'hidden',
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    color: theme.colors.textOnPrimary,
    fontWeight: '700',
  },
});
