import { Button } from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { getAuthErrorMessage } from '@/lib/auth-errors';
import { supabase } from '@/lib/supabase';
import { theme } from '@/lib/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

export default function ResetPasswordConfirmScreen() {
  const params = useLocalSearchParams<{ token_hash?: string; type?: string }>();
  const router = useRouter();
  const { clearRecoveryMode } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!params.token_hash || params.type !== 'recovery') {
      Alert.alert(
        'Invalid link',
        'The password reset link is invalid or has expired.'
      );
      router.replace('/(auth)/login');
      return;
    }

    supabase.auth
      .verifyOtp({ token_hash: params.token_hash, type: 'recovery' })
      .then(({ error }) => {
        if (error) {
          Alert.alert(
            'Link expired',
            'This password reset link has expired or already been used. Please request a new one.'
          );
          router.replace('/(auth)/login');
        } else {
          setVerified(true);
        }
      });
  }, [params.token_hash, params.type, router]);

  const onResetPassword = async () => {
    if (!password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in both password fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setSuccess(true);
      clearRecoveryMode();
      await supabase.auth.signOut();
      Alert.alert('Success', 'Your password has been reset. Please log in with your new password.');
      setTimeout(() => router.replace('/(auth)/login'), 2000);
    } catch (e: unknown) {
      Alert.alert('Error', getAuthErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.successBox}>
          <Text style={styles.successText}>✓ Password reset successful!</Text>
          <Text style={styles.successSubtext}>
            Redirecting you to login...
          </Text>
        </View>
      </KeyboardAvoidingView>
    );
  }

  if (!verified) {
    return (
      <KeyboardAvoidingView style={styles.container}>
        <Text style={styles.subtitle}>Verifying your reset link...</Text>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Set New Password</Text>
      <Text style={styles.subtitle}>Enter your new password below.</Text>

      <TextInput
        style={styles.input}
        placeholder="New password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        editable={!loading}
      />

      <Button
        title="Update password"
        onPress={onResetPassword}
        loading={loading}
      />
      <Button
        title="Back to login"
        variant="secondary"
        onPress={() => router.replace('/(auth)/login')}
        disabled={loading}
      />
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
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.5,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
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
  successBox: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
  },
  successText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#166534',
    marginBottom: theme.spacing.sm,
  },
  successSubtext: {
    fontSize: 14,
    color: '#15803D',
    lineHeight: 20,
  },
});
