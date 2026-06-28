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
import { useTheme } from '@/lib/useTheme';
import { SectionHeader } from '@/components/SectionHeader';

export default function AdminReportsScreen() {
  const { colors, radius, shadow, spacing } = useTheme();
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
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingHorizontal: spacing.md }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.pageTitle, { color: colors.text }]}>Reports</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : (
        <>
          {stats && (
            <View style={styles.section}>
              <SectionHeader title="Revenue summary" />
              <View
                style={[
                  styles.revenueCard,
                  {
                    backgroundColor: colors.primaryMuted,
                    borderColor: colors.primary,
                    borderRadius: radius.lg,
                  },
                  shadow.md,
                ]}
              >
                <Text style={[styles.revenueLabel, { color: colors.textSecondary }]}>
                  Total platform revenue
                </Text>
                <Text style={[styles.revenueValue, { color: colors.primary }]}>
                  {formatCents(stats.totalRevenueCents)}
                </Text>
                <Text style={[styles.revenueSub, { color: colors.textSecondary }]}>
                  From {stats.completedBookings} completed bookings out of {stats.totalBookings} total
                </Text>
              </View>
              <View style={styles.metricsRow}>
                <MetricPill
                  label="Completion rate"
                  value={
                    stats.totalBookings > 0
                      ? `${Math.round((stats.completedBookings / stats.totalBookings) * 100)}%`
                      : '—'
                  }
                  colors={colors}
                  radius={radius}
                  shadow={shadow}
                />
                <MetricPill
                  label="Active listings"
                  value={`${stats.activeListings}/${stats.totalListings}`}
                  colors={colors}
                  radius={radius}
                  shadow={shadow}
                />
                <MetricPill
                  label="Total users"
                  value={stats.totalUsers.toString()}
                  colors={colors}
                  radius={radius}
                  shadow={shadow}
                />
              </View>
            </View>
          )}

          <View style={styles.section}>
            <SectionHeader title="Bookings by status" />
            <BarChart
              data={bookingCounts}
              total={totalBookings}
              labelMap={BOOKING_STATUS_LABEL as Record<string, string>}
              barColor={colors.primary}
              colors={colors}
              radius={radius}
              shadow={shadow}
            />
          </View>

          <View style={styles.section}>
            <SectionHeader title="Listings by category" />
            <BarChart
              data={categoryCounts}
              total={totalListings}
              labelMap={CATEGORY_LABEL as Record<string, string>}
              barColor={colors.accent}
              colors={colors}
              radius={radius}
              shadow={shadow}
            />
          </View>
        </>
      )}
    </ScrollView>
  );
}

function MetricPill({
  label,
  value,
  colors,
  radius,
  shadow,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useTheme>['colors'];
  radius: ReturnType<typeof useTheme>['radius'];
  shadow: ReturnType<typeof useTheme>['shadow'];
}) {
  return (
    <View
      style={[
        styles.pill,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radius.lg,
        },
        shadow.sm,
      ]}
    >
      <Text style={[styles.pillValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.pillLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

function BarChart({
  data,
  total,
  labelMap,
  barColor,
  colors,
  radius,
  shadow,
}: {
  data: Record<string, number>;
  total: number;
  labelMap: Record<string, string>;
  barColor: string;
  colors: ReturnType<typeof useTheme>['colors'];
  radius: ReturnType<typeof useTheme>['radius'];
  shadow: ReturnType<typeof useTheme>['shadow'];
}) {
  return (
    <View
      style={[
        styles.barChart,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radius.lg,
        },
        shadow.sm,
      ]}
    >
      {Object.entries(data)
        .sort(([, a], [, b]) => b - a)
        .map(([key, count]) => {
          const pct = total > 0 ? (count / total) * 100 : 0;
          return (
            <View key={key} style={styles.barRow}>
              <Text style={[styles.barLabel, { color: colors.text }]} numberOfLines={1}>
                {labelMap[key] ?? key}
              </Text>
              <View
                style={[
                  styles.barTrack,
                  { backgroundColor: colors.surfaceSubtle, borderRadius: radius.full },
                ]}
              >
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${Math.max(pct, 2)}%`,
                      backgroundColor: barColor,
                      borderRadius: radius.full,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.barCount, { color: colors.textSecondary }]}>{count}</Text>
            </View>
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingTop: 16,
    paddingBottom: 48,
    gap: 24,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  loader: { marginTop: 40 },
  section: { gap: 12 },
  revenueCard: {
    padding: 20,
    borderWidth: 1.5,
    gap: 6,
  },
  revenueLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  revenueValue: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1,
  },
  revenueSub: { fontSize: 13 },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  pill: {
    flex: 1,
    padding: 14,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  pillValue: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  pillLabel: { fontSize: 11, textAlign: 'center', fontWeight: '500' },
  barChart: {
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  barLabel: {
    fontSize: 13,
    fontWeight: '500',
    width: 90,
    flexShrink: 0,
  },
  barTrack: {
    flex: 1,
    height: 8,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
  },
  barCount: {
    fontSize: 12,
    fontWeight: '700',
    width: 28,
    textAlign: 'right',
  },
});
