import { Link, Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { theme } from '@/lib/theme';

function BackButton() {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
      style={styles.backBtn}
      hitSlop={8}
    >
      <Text style={styles.backBtnText}>‹ Back</Text>
    </Pressable>
  );
}

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: '⊞' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
  { href: '/admin/listings', label: 'Listings', icon: '🏷' },
  { href: '/admin/bookings', label: 'Bookings', icon: '📋' },
  { href: '/admin/categories', label: 'Categories', icon: '📂' },
  { href: '/admin/reports', label: 'Reports', icon: '📊' },
] as const;

function AdminSidebar() {
  const segments = useSegments();
  const currentPath = '/' + segments.join('/');

  return (
    <View style={styles.sidebar}>
      <View style={styles.sidebarBrand}>
        <View style={styles.sidebarLogo}>
          <Text style={styles.sidebarLogoText}>H</Text>
        </View>
        <View>
          <Text style={styles.sidebarTitle}>Homeshare</Text>
          <Text style={styles.sidebarSubtitle}>Admin Portal</Text>
        </View>
      </View>
      <ScrollView style={styles.sidebarNav}>
        {NAV_ITEMS.map((item) => {
          const active = currentPath === item.href || (item.href !== '/admin' && currentPath.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href as Parameters<typeof Link>[0]['href']} asChild>
              <Pressable style={[styles.navItem, active && styles.navItemActive]}>
                <Text style={styles.navIcon}>{item.icon}</Text>
                <Text style={[styles.navLabel, active && styles.navLabelActive]}>
                  {item.label}
                </Text>
              </Pressable>
            </Link>
          );
        })}
      </ScrollView>
      <Link href="/(tabs)" asChild>
        <Pressable style={styles.backToApp}>
          <Text style={styles.backToAppText}>← Back to app</Text>
        </Pressable>
      </Link>
    </View>
  );
}

export default function AdminLayout() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace('/(tabs)');
    }
  }, [isAdmin, loading, router]);

  if (loading || !isAdmin) return null;

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webRoot}>
        <AdminSidebar />
        <View style={styles.webContent}>
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.text,
        headerTitleStyle: { fontWeight: '700', fontSize: 17 },
        headerShadowVisible: false,
        headerLeft: () => <BackButton />,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Dashboard',
          headerLeft: () => (
            <Pressable
              onPress={() => router.replace('/(tabs)')}
              style={styles.backBtn}
              hitSlop={8}
            >
              <Text style={styles.backBtnText}>‹ App</Text>
            </Pressable>
          ),
        }}
      />
      <Stack.Screen name="users" options={{ title: 'Users' }} />
      <Stack.Screen name="listings" options={{ title: 'Listings' }} />
      <Stack.Screen name="bookings" options={{ title: 'Bookings' }} />
      <Stack.Screen name="categories" options={{ title: 'Categories' }} />
      <Stack.Screen name="reports" options={{ title: 'Reports' }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  webRoot: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 240,
    backgroundColor: theme.colors.text,
    flexShrink: 0,
    paddingTop: 24,
  },
  sidebarBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    marginBottom: theme.spacing.sm,
  },
  sidebarLogo: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidebarLogoText: {
    fontSize: 20,
    fontWeight: '900',
    color: theme.colors.textOnPrimary,
  },
  sidebarTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
  },
  sidebarSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500',
  },
  sidebarNav: {
    flex: 1,
    paddingHorizontal: theme.spacing.sm,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.md,
    marginBottom: 2,
  },
  navItemActive: {
    backgroundColor: theme.colors.primary,
  },
  navIcon: {
    fontSize: 16,
  },
  navLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
  navLabelActive: {
    color: theme.colors.textOnPrimary,
  },
  backToApp: {
    margin: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  backToAppText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '500',
  },
  webContent: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
  },
  backBtn: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  backBtnText: {
    fontSize: 17,
    color: theme.colors.accent,
    fontWeight: '600',
  },
});
