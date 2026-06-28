import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { StripeRoot } from '@/components/StripeRoot';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { theme } from '@/lib/theme';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

function AuthGate() {
  const { session, loading, isRecoveryMode } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const inAuth = segments[0] === '(auth)';

    if (!session && !inAuth) {
      router.replace('/(auth)/login');
    } else if (session && inAuth && !isRecoveryMode) {
      router.replace('/(tabs)');
    }
  }, [session, loading, segments, router, isRecoveryMode]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.primary,
        headerTitleStyle: { color: theme.colors.text, fontWeight: '700', fontSize: 17, letterSpacing: -0.2 },
        headerShadowVisible: false,
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="listing" options={{ headerShown: true }} />
      <Stack.Screen name="booking" options={{ headerShown: true, title: 'Booking' }} />
      <Stack.Screen name="chat" options={{ headerShown: true, title: 'Chat' }} />
      <Stack.Screen name="admin" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <StripeRoot>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </StripeRoot>
  );
}
