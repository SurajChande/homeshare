import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { getAuthErrorMessage } from '@/lib/auth-errors';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useTheme } from '@/lib/useTheme';

export default function EmailLoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { colors, spacing, radius, shadow } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!isSupabaseConfigured) {
      Alert.alert(
        'Setup required',
        'Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to .env'
      );
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (e: unknown) {
      Alert.alert('Login failed', getAuthErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.outer, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingHorizontal: spacing.lg }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
        <Pressable
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace('/(auth)/login')
          }
          style={styles.backBtn}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>

        {/* Brand */}
        <View style={styles.brand}>
          <View
            style={[
              styles.logoMark,
              { backgroundColor: colors.primary, borderRadius: radius.md },
            ]}
          >
            <Text style={styles.logoLetter}>H</Text>
          </View>
          <Text style={[styles.brandName, { color: colors.text }]}>Welcome back</Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>
            Sign in to your Homeshare account
          </Text>
        </View>

        {/* Form card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderRadius: radius.lg,
              borderColor: colors.border,
            },
            shadow.md,
          ]}
        >
          <View style={styles.fields}>
            <View>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.text,
                    borderRadius: radius.md,
                  },
                ]}
                placeholder="you@example.com"
                placeholderTextColor={colors.textTertiary}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                value={email}
                onChangeText={setEmail}
                returnKeyType="next"
              />
            </View>
            <View>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Password</Text>
              <View>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text,
                      borderRadius: radius.md,
                      paddingRight: 48,
                    },
                  ]}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textTertiary}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                  value={password}
                  onChangeText={setPassword}
                  returnKeyType="done"
                  onSubmitEditing={onLogin}
                />
                <Pressable
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword((v) => !v)}
                  hitSlop={8}
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={18}
                    color={colors.textSecondary}
                  />
                </Pressable>
              </View>
            </View>
          </View>

          <Link href="/(auth)/forgot-password" style={styles.forgotLink}>
            <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot password?</Text>
          </Link>

          <Button title="Sign in" onPress={onLogin} loading={loading} />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Don't have an account?{' '}
          </Text>
          <Link href="/(auth)/signup">
            <Text style={[styles.footerLink, { color: colors.primary }]}>Sign up</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 24,
  },
  backBtn: {
    position: 'absolute',
    top: 56,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    paddingTop: 32,
  },
  logoMark: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  logoLetter: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  brandName: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    textAlign: 'center',
  },
  card: {
    padding: 24,
    borderWidth: 1,
    gap: 16,
  },
  fields: {
    gap: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  eyeBtn: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  forgotLink: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: { fontSize: 15 },
  footerLink: { fontSize: 15, fontWeight: '700' },
});
