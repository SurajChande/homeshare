import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getAdminStats, type AdminStats } from '@/lib/api/admin';
import { formatCents } from '@/lib/utils';
import { useTheme } from '@/lib/useTheme';
import { SectionHeader } from '@/components/SectionHeader';

type IoniconName = keyof typeof Ionicons.glyphMap;

const QUICK_LINKS: { href: string; label: string; icon: IoniconName; tint: string }[] = [
  { href: '/admin/users',     label: 'Manage Users',    icon: 'people-outline',   tint: '#4F46E5' },
  { href: '/admin/listings',  label: 'Manage Listings', icon: 'storefront-outline', tint: '#10B981' },
  { href: '/admin/bookings',  label: 'Manage Bookings', icon: 'calendar-outline', tint: '#8B5CF6' },
  { href: '/admin/reports',   label: 'View Reports',    icon: 'bar-chart-outline', tint: '#F59E0B' },
];

export default function AdminDashboard() {
  const { colors, radius, shadow, spacing } = useTheme();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Failed'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingHorizontal: spacing.md }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Dashboard</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Platform overview</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : error ? (
        <View
          style={[
            styles.errorBox,
            { backgroundColor: colors.dangerMuted, borderColor: colors.danger, borderRadius: radius.md },
          ]}
        >
          <Ionicons name="warning-outline" size={16} color={colors.danger} />
          <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
        </View>
      ) : stats ? (
        <>
          <SectionHeader title="Platform metrics" />
          <View style={styles.statsGrid}>
            <StatCard label="Users"           value={stats.totalUsers.toString()}       icon="people"       colors={colors} radius={radius} shadow={shadow} />
            <StatCard label="Listings"        value={stats.totalListings.toString()}    icon="storefront"   colors={colors} radius={radius} shadow={shadow} />
            <StatCard label="Active"          value={stats.activeListings.toString()}   icon="checkmark-circle" colors={colors} radius={radius} shadow={shadow} />
            <StatCard label="Bookings"        value={stats.totalBookings.toString()}    icon="calendar"     colors={colors} radius={radius} shadow={shadow} />
            <StatCard label="Completed"       value={stats.completedBookings.toString()} icon="trophy"     colors={colors} radius={radius} shadow={shadow} />
            <StatCard
              label="Revenue"
              value={formatCents(stats.totalRevenueCents)}
              icon="cash"
              colors={colors} radius={radius} shadow={shadow}
              highlight
            />
          </View>
        </>
      ) : null}

      <SectionHeader title="Quick actions" style={styles.quickTitle} />
      <View style={styles.quickGrid}>
        {QUICK_LINKS.map((item) => (
          <Pressable
            key={item.href}
            onPress={() => router.push(item.href as Parameters<typeof router.push>[0])}
            style={({ pressed }) =>
              StyleSheet.flatten([
                styles.quickCard,
                {
                  backgroundColor: colors.surface,
                  borderRadius: radius.lg,
                  borderColor: colors.border,
                  opacity: pressed ? 0.75 : 1,
                },
                shadow.sm,
              ])
            }
          >
            <View
              style={[
                styles.quickIconWrap,
                { backgroundColor: item.tint + '18', borderRadius: radius.md },
              ]}
            >
              <Ionicons name={item.icon} size={22} color={item.tint} />
            </View>
            <Text style={[styles.quickLabel, { color: colors.text }]}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.borderStrong} />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

function StatCard({
  label,
  value,
  icon,
  highlight,
  colors,
  radius,
  shadow,
}: {
  label: string;
  value: string;
  icon: IoniconName;
  highlight?: boolean;
  colors: ReturnType<typeof useTheme>['colors'];
  radius: ReturnType<typeof useTheme>['radius'];
  shadow: ReturnType<typeof useTheme>['shadow'];
}) {
  return (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: highlight ? colors.primaryMuted : colors.surface,
          borderRadius: radius.lg,
          borderColor: highlight ? colors.primary : colors.border,
        },
        shadow.sm,
      ]}
    >
      <Ionicons
        name={icon}
        size={20}
        color={highlight ? colors.primary : colors.textSecondary}
      />
      <Text style={[styles.statValue, { color: highlight ? colors.primary : colors.text }]}>
        {value}
      </Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingTop: 16,
    paddingBottom: 48,
    gap: 0,
  },
  header: {
    marginBottom: 24,
    gap: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 15,
  },
  loader: { marginTop: 40 },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  errorText: { fontSize: 14, flex: 1 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: 140,
    padding: 16,
    borderWidth: 1,
    gap: 6,
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  quickTitle: {
    marginBottom: 12,
  },
  quickGrid: {
    gap: 10,
  },
  quickCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderWidth: 1,
  },
  quickIconWrap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  quickLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
});
