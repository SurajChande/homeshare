import { Button } from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { getAuthErrorMessage } from '@/lib/auth-errors';
import { isSupabaseConfigured } from '@/lib/supabase';
import { theme } from '@/lib/theme';
import { Link } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!isSupabaseConfigured) {
      Alert.alert('Setup required', 'Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to .env');
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
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoLetter}>H</Text>
        </View>
        <Text style={styles.brand}>Homeshare</Text>
        <Text style={styles.subtitle}>Rent household items from your neighbours</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.fieldLabel}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          placeholderTextColor={theme.colors.textSecondary}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.fieldLabel}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor={theme.colors.textSecondary}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Log in" onPress={onLogin} loading={loading} style={styles.loginBtn} />
        <Link href="/(auth)/forgot-password" style={styles.forgotLink}>
          <Text style={styles.forgotText}>Forgot your password?</Text>
        </Link>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>New to Homeshare? </Text>
        <Link href="/(auth)/signup">
          <Text style={styles.footerLink}>Create an account</Text>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  logoLetter: {
    fontSize: 32,
    fontWeight: '900',
    color: theme.colors.textOnPrimary,
  },
  brand: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  form: {
    marginBottom: theme.spacing.lg,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 13,
    marginBottom: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
  },
  loginBtn: {
    marginTop: theme.spacing.xs,
  },
  forgotLink: {
    alignSelf: 'center',
    marginTop: theme.spacing.md,
  },
  forgotText: {
    color: theme.colors.accent,
    fontSize: 15,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: theme.colors.textSecondary,
    fontSize: 15,
  },
  footerLink: {
    color: theme.colors.accent,
    fontSize: 15,
    fontWeight: '700',
  },
});
