import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  getAdminStats,
  getBookingsByStatus,
  getListingsByCategory,
  type AdminStats,
} from '@/lib/api/admin';
import { BOOKING_STATUS_LABEL, CATEGORY_LABEL } from '@/lib/constants';
import { formatCents } from '@/lib/utils';
import { theme } from '@/lib/theme';

export default function AdminReportsScreen() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [bookingCounts, setBookingCounts] = useState<Record<string, number>>({});
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminStats(), getBookingsByStatus(), getListingsByCategory()])
      .then(([s, b, c]) => {
        setStats(s);
        setBookingCounts(b);
        setCategoryCounts(c);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalBookings = Object.values(bookingCounts).reduce((a, b) => a + b, 0);
  const totalListings = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Reports</Text>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
      ) : (
        <>
          {stats && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Revenue summary</Text>
              <View style={styles.revenueCard}>
                <Text style={styles.revenueLabel}>Total platform revenue</Text>
                <Text style={styles.revenueValue}>{formatCents(stats.totalRevenueCents)}</Text>
                <Text style={styles.revenueSub}>
                  From {stats.completedBookings} completed bookings out of {stats.totalBookings} total
                </Text>
              </View>
              <View style={styles.metricsRow}>
                <MetricPill label="Completion rate" value={stats.totalBookings > 0 ? `${Math.round((stats.completedBookings / stats.totalBookings) * 100)}%` : '—'} />
                <MetricPill label="Active listings" value={`${stats.activeListings} / ${stats.totalListings}`} />
                <MetricPill label="Total users" value={stats.totalUsers.toString()} />
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bookings by status</Text>
            <View style={styles.barChart}>
              {Object.entries(bookingCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([status, count]) => {
                  const pct = totalBookings > 0 ? (count / totalBookings) * 100 : 0;
                  return (
                    <View key={status} style={styles.barRow}>
                      <Text style={styles.barLabel}>
                        {BOOKING_STATUS_LABEL[status as keyof typeof BOOKING_STATUS_LABEL] ?? status}
                      </Text>
                      <View style={styles.barTrack}>
                        <View style={[styles.barFill, { width: `${pct}%` }]} />
                      </View>
                      <Text style={styles.barCount}>{count}</Text>
                    </View>
                  );
                })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Listings by category</Text>
            <View style={styles.barChart}>
              {Object.entries(categoryCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([cat, count]) => {
                  const pct = totalListings > 0 ? (count / totalListings) * 100 : 0;
                  return (
                    <View key={cat} style={styles.barRow}>
                      <Text style={styles.barLabel}>
                        {CATEGORY_LABEL[cat as keyof typeof CATEGORY_LABEL] ?? cat}
                      </Text>
                      <View style={styles.barTrack}>
                        <View style={[styles.barFill, styles.barFillBlue, { width: `${pct}%` }]} />
                      </View>
                      <Text style={styles.barCount}>{count}</Text>
                    </View>
                  );
                })}
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillValue}>{value}</Text>
      <Text style={styles.pillLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.surface },
  content: { padding: theme.spacing.lg, gap: theme.spacing.md, paddingBottom: theme.spacing.xxl },
  pageTitle: { fontSize: 26, fontWeight: '800', color: theme.colors.text, letterSpacing: -0.5, marginBottom: theme.spacing.sm },
  loader: { marginTop: theme.spacing.xxl },
  section: { gap: theme.spacing.md },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: theme.colors.text },
  revenueCard: {
    backgroundColor: theme.colors.primaryMuted,
    borderRadius: theme.radius.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    padding: theme.spacing.lg,
    gap: theme.spacing.xs,
  },
  revenueLabel: { fontSize: 14, color: '#A66E00', fontWeight: '600' },
  revenueValue: { fontSize: 36, fontWeight: '900', color: theme.colors.text, letterSpacing: -1 },
  revenueSub: { fontSize: 13, color: theme.colors.textSecondary },
  metricsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  pill: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    alignItems: 'center',
    gap: 2,
  },
  pillValue: { fontSize: 18, fontWeight: '800', color: theme.colors.text },
  pillLabel: { fontSize: 11, color: theme.colors.textSecondary, textAlign: 'center' },
  barChart: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  barLabel: {
    fontSize: 13,
    color: theme.colors.text,
    fontWeight: '500',
    width: 100,
    flexShrink: 0,
  },
  barTrack: {
    flex: 1,
    height: 10,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    minWidth: 4,
  },
  barFillBlue: {
    backgroundColor: theme.colors.accent,
  },
  barCount: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text,
    width: 30,
    textAlign: 'right',
  },
});
