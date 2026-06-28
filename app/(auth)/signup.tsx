import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Link } from 'expo-router';
import { Button } from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { getAuthErrorMessage } from '@/lib/auth-errors';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useTheme } from '@/lib/useTheme';

export default function SignupScreen() {
  const { signUp } = useAuth();
  const { colors, spacing, radius, shadow } = useTheme();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSignup = async () => {
    if (!isSupabaseConfigured) {
      Alert.alert('Setup required', 'Configure Supabase env vars in .env first.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Password too short', 'Use at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const { needsEmailConfirmation } = await signUp(
        email.trim(),
        password,
        displayName.trim() || 'User'
      );
      if (needsEmailConfirmation) {
        Alert.alert(
          'Confirm your email',
          'We sent a confirmation link to your inbox. Click it, then return here to log in.'
        );
      }
    } catch (e: unknown) {
      Alert.alert('Sign up failed', getAuthErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = [
    styles.input,
    {
      backgroundColor: colors.background,
      borderColor: colors.border,
      color: colors.text,
      borderRadius: radius.md,
    },
  ];

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
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Create account</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Join your neighborhood on Homeshare.
          </Text>
        </View>

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
              <Text style={[styles.label, { color: colors.textSecondary }]}>Your name</Text>
              <TextInput
                style={inputStyle}
                placeholder="Jane Smith"
                placeholderTextColor={colors.textTertiary}
                value={displayName}
                onChangeText={setDisplayName}
              />
            </View>
            <View>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
              <TextInput
                style={inputStyle}
                placeholder="you@example.com"
                placeholderTextColor={colors.textTertiary}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Password</Text>
              <TextInput
                style={inputStyle}
                placeholder="Minimum 6 characters"
                placeholderTextColor={colors.textTertiary}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          <Button
            title="Create account"
            onPress={onSignup}
            loading={loading}
            style={styles.signupBtn}
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Already have an account?{' '}
          </Text>
          <Link href="/(auth)/login">
            <Text style={[styles.footerLink, { color: colors.primary }]}>Log in</Text>
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
  header: {
    gap: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 23,
  },
  card: {
    padding: 24,
    borderWidth: 1,
    gap: 20,
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
    paddingVertical: 13,
    fontSize: 16,
  },
  signupBtn: {
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 15,
  },
  footerLink: {
    fontSize: 15,
    fontWeight: '700',
  },
});
