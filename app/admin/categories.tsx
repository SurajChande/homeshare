import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getListingsByCategory } from '@/lib/api/admin';
import { LISTING_CATEGORIES } from '@/lib/constants';
import { useTheme } from '@/lib/useTheme';
import { SectionHeader } from '@/components/SectionHeader';

export default function AdminCategoriesScreen() {
  const { colors, radius, shadow, spacing } = useTheme();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getListingsByCategory().then(setCounts).finally(() => setLoading(false));
  }, []);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingHorizontal: spacing.md }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.text }]}>Listing categories</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Categories are defined in the database schema. The table below shows how listings are
        distributed across each category.
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : (
        <View
          style={[
            styles.table,
            {
              backgroundColor: colors.surface,
              borderRadius: radius.lg,
              borderColor: colors.border,
            },
            shadow.sm,
          ]}
        >
          <View
            style={[
              styles.tableHeader,
              { backgroundColor: colors.background, borderBottomColor: colors.border },
            ]}
          >
            <Text style={[styles.headerCell, { color: colors.textSecondary, flex: 2 }]}>
              Category
            </Text>
            <Text style={[styles.headerCell, styles.headerRight, { color: colors.textSecondary }]}>
              Listings
            </Text>
            <Text style={[styles.headerCell, styles.headerRight, { color: colors.textSecondary }]}>
              Share
            </Text>
          </View>
          {LISTING_CATEGORIES.map((cat) => {
            const count = counts[cat.value] ?? 0;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <View
                key={cat.value}
                style={[styles.tableRow, { borderBottomColor: colors.border }]}
              >
                <Text style={[styles.cell, { color: colors.text, flex: 2 }]}>{cat.label}</Text>
                <Text
                  style={[
                    styles.cell,
                    styles.cellRight,
                    styles.cellBold,
                    { color: colors.text },
                  ]}
                >
                  {count}
                </Text>
                <Text style={[styles.cell, styles.cellRight, { color: colors.textSecondary }]}>
                  {pct}%
                </Text>
              </View>
            );
          })}
          <View style={[styles.totalRow, { backgroundColor: colors.primaryMuted }]}>
            <Text style={[styles.cell, styles.cellBold, { color: colors.primary, flex: 2 }]}>
              Total
            </Text>
            <Text
              style={[styles.cell, styles.cellRight, styles.cellBold, { color: colors.primary }]}
            >
              {total}
            </Text>
            <Text
              style={[styles.cell, styles.cellRight, styles.cellBold, { color: colors.primary }]}
            >
              100%
            </Text>
          </View>
        </View>
      )}

      <View
        style={[
          styles.infoBox,
          {
            backgroundColor: colors.accentMuted,
            borderRadius: radius.lg,
            borderColor: colors.accent + '40',
          },
          shadow.sm,
        ]}
      >
        <View style={styles.infoHeader}>
          <Ionicons name="information-circle-outline" size={18} color={colors.accent} />
          <Text style={[styles.infoTitle, { color: colors.accentDark }]}>
            To add or rename categories
          </Text>
        </View>
        <Text style={[styles.infoText, { color: colors.text }]}>
          Categories are stored as a PostgreSQL enum type. To add a new category:{'\n'}
          1. Add a migration to ALTER TYPE listing_category ADD VALUE 'newvalue'{'\n'}
          2. Add the label to CATEGORY_LABEL and LISTING_CATEGORIES in lib/constants.ts
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingTop: 16,
    paddingBottom: 48,
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: -8,
  },
  loader: { marginTop: 40 },
  table: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  headerCell: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerRight: {
    textAlign: 'right',
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  cell: { fontSize: 15 },
  cellRight: { textAlign: 'right', flex: 1 },
  cellBold: { fontWeight: '700' },
  totalRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 13,
    alignItems: 'center',
  },
  infoBox: {
    padding: 16,
    borderWidth: 1,
    gap: 10,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  infoText: {
    fontSize: 13,
    lineHeight: 22,
  },
});
