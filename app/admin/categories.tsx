import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getListingsByCategory } from '@/lib/api/admin';
import { LISTING_CATEGORIES } from '@/lib/constants';
import { theme } from '@/lib/theme';

export default function AdminCategoriesScreen() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getListingsByCategory()
      .then(setCounts)
      .finally(() => setLoading(false));
  }, []);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Listing categories</Text>
      <Text style={styles.subtitle}>
        Categories are defined in the database schema. The table below shows how listings are
        distributed across each category.
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
      ) : (
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, { flex: 2 }]}>Category</Text>
            <Text style={[styles.headerCell, styles.headerRight]}>Listings</Text>
            <Text style={[styles.headerCell, styles.headerRight]}>Share</Text>
          </View>
          {LISTING_CATEGORIES.map((cat) => {
            const count = counts[cat.value] ?? 0;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <View key={cat.value} style={styles.tableRow}>
                <Text style={[styles.cell, { flex: 2 }]}>{cat.label}</Text>
                <Text style={[styles.cell, styles.cellRight, styles.cellBold]}>{count}</Text>
                <Text style={[styles.cell, styles.cellRight]}>{pct}%</Text>
              </View>
            );
          })}
          <View style={styles.totalRow}>
            <Text style={[styles.cell, styles.cellBold, { flex: 2 }]}>Total</Text>
            <Text style={[styles.cell, styles.cellRight, styles.cellBold]}>{total}</Text>
            <Text style={[styles.cell, styles.cellRight, styles.cellBold]}>100%</Text>
          </View>
        </View>
      )}

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>To add or rename categories</Text>
        <Text style={styles.infoText}>
          Categories are stored as a PostgreSQL enum type. To add a new category:{'\n'}
          1. Add a migration to ALTER TYPE listing_category ADD VALUE 'newvalue'{'\n'}
          2. Add the label to CATEGORY_LABEL and LISTING_CATEGORIES in lib/constants.ts
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.surface },
  content: { padding: theme.spacing.lg, gap: theme.spacing.md },
  title: { fontSize: 22, fontWeight: '800', color: theme.colors.text, letterSpacing: -0.3 },
  subtitle: { fontSize: 14, color: theme.colors.textSecondary, lineHeight: 20 },
  loader: { marginTop: theme.spacing.xxl },
  table: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerCell: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerRight: {
    textAlign: 'right',
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    alignItems: 'center',
  },
  cell: {
    fontSize: 15,
    color: theme.colors.text,
  },
  cellRight: {
    textAlign: 'right',
    flex: 1,
  },
  cellBold: { fontWeight: '700' },
  totalRow: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 13,
    backgroundColor: theme.colors.primaryMuted,
    alignItems: 'center',
  },
  infoBox: {
    backgroundColor: theme.colors.accentMuted,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.accent + '40',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  infoTitle: { fontSize: 15, fontWeight: '700', color: theme.colors.accent },
  infoText: { fontSize: 13, color: '#1A4E6F', lineHeight: 22 },
});
