import { Tabs } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { FloatingTabBar } from '@/components/FloatingTabBar';
import { theme } from '@/lib/theme';

export default function TabLayout() {
  const { isAdmin } = useAuth();

  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} isAdmin={isAdmin} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        } as object,
        headerShadowVisible: false,
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 17,
          letterSpacing: -0.3,
        },
        // No default tab bar — replaced by FloatingTabBar
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tabs.Screen name="index" options={{ headerShown: false }} />
      <Tabs.Screen name="my-listings" options={{ headerShown: false }} />
      <Tabs.Screen name="bookings" options={{ headerShown: false }} />
      <Tabs.Screen name="messages" options={{ headerShown: false }} />
      <Tabs.Screen name="profile" options={{ headerShown: false }} />
      <Tabs.Screen
        name="admin"
        options={{
          href: isAdmin ? undefined : null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
