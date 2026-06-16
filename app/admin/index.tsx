import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getAdminStats, type AdminStats } from '@/lib/api/admin';
import { formatCents } from '@/lib/utils';
import { theme } from '@/lib/theme';

const QUICK_LINKS = [
  { href: '/admin/users', label: 'Manage Users', icon: '👥', color: theme.colors.accent },
  { href: '/admin/listings', label: 'Manage Listings', icon: '🏷', color: theme.colors.primary },
  { href: '/admin/bookings', label: 'Manage Bookings', icon: '📋', color: '#8B5CF6' },
  { href: '/admin/reports', label: 'View Reports', icon: '📊', color: theme.colors.success },
] as const;

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Platform overview</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
      ) : error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : stats ? (
        <>
          <Text style={styles.sectionTitle}>Platform metrics</Text>
          <View style={styles.statsGrid}>
            <StatCard label="Total users" value={stats.totalUsers.toString()} icon="👤" />
            <StatCard label="Total listings" value={stats.totalListings.toString()} icon="🏷" />
            <StatCard label="Active listings" value={stats.activeListings.toString()} icon="✅" />
            <StatCard label="Total bookings" value={stats.totalBookings.toString()} icon="📋" />
            <StatCard
              label="Completed"
              value={stats.completedBookings.toString()}
              icon="🎉"
            />
            <StatCard
              label="Revenue"
              value={formatCents(stats.totalRevenueCents)}
              icon="💰"
              highlight
            />
          </View>
        </>
      ) : null}

      <Text style={styles.sectionTitle}>Quick actions</Text>
      <View style={styles.quickGrid}>
        {QUICK_LINKS.map((item) => (
          <Link key={item.href} href={item.href as Parameters<typeof Link>[0]['href']} asChild>
            <Pressable style={({ pressed }) => [styles.quickCard, pressed && styles.quickCardPressed]}>
              <View style={[styles.quickIcon, { backgroundColor: item.color + '20' }]}>
                <Text style={styles.quickIconText}>{item.icon}</Text>
              </View>
              <Text style={styles.quickLabel}>{item.label}</Text>
              <Text style={styles.quickArrow}>→</Text>
            </Pressable>
          </Link>
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
}: {
  label: string;
  value: string;
  icon: string;
  highlight?: boolean;
}) {
  return (
    <View style={[styles.statCard, highlight && styles.statCardHighlight]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, highlight && styles.statValueHighlight]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.surface },
  content: { padding: theme.spacing.lg, paddingBottom: theme.spacing.xxl },
  header: { marginBottom: theme.spacing.lg },
  greeting: { fontSize: 28, fontWeight: '800', color: theme.colors.text, letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: theme.colors.textSecondary, marginTop: theme.spacing.xs },
  loader: { marginTop: theme.spacing.xxl },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  errorText: { color: theme.colors.danger, fontSize: 14 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'flex-start',
    gap: theme.spacing.xs,
  },
  statCardHighlight: {
    backgroundColor: theme.colors.primaryMuted,
    borderColor: theme.colors.primary,
  },
  statIcon: { fontSize: 22 },
  statValue: { fontSize: 24, fontWeight: '800', color: theme.colors.text },
  statValueHighlight: { color: '#A66E00' },
  statLabel: { fontSize: 13, color: theme.colors.textSecondary, fontWeight: '500' },
  quickGrid: {
    gap: theme.spacing.sm,
  },
  quickCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  quickCardPressed: { opacity: 0.85 },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickIconText: { fontSize: 22 },
  quickLabel: { flex: 1, fontSize: 15, fontWeight: '700', color: theme.colors.text },
  quickArrow: { fontSize: 18, color: theme.colors.textSecondary },
});
