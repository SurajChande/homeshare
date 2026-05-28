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
      <TextInput
        style={styles.search}
        placeholder="Search listings..."
        placeholderTextColor={theme.colors.textSecondary}
        value={filters.search ?? ''}
        onChangeText={(search) => onChange({ ...filters, search })}
      />
      <TextInput
        style={styles.search}
        placeholder="City filter"
        placeholderTextColor={theme.colors.textSecondary}
        value={filters.city ?? ''}
        onChangeText={(city) => onChange({ ...filters, city })}
      />
      <View style={styles.priceRow}>
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
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
    paddingBottom: theme.spacing.sm,
  },
  search: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    marginBottom: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.text,
  },
  priceRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  priceInput: {
    flex: 1,
  },
  chips: {
    marginTop: theme.spacing.xs,
  },
  chip: {
    marginRight: theme.spacing.sm,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.text,
    overflow: 'hidden',
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    color: '#fff',
  },
});
