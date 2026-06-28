import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { getAuthErrorMessage } from '@/lib/auth-errors';
import { useTheme } from '@/lib/useTheme';

export default function ForgotPasswordScreen() {
  const { resetPassword } = useAuth();
  const router = useRouter();
  const { colors, spacing, radius, shadow } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSendReset = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (e: unknown) {
      Alert.alert('Error', getAuthErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.outer, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.container, { paddingHorizontal: spacing.lg }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Reset password</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Enter your email and we'll send you a reset link.
          </Text>
        </View>

        {sent ? (
          <View
            style={[
              styles.successCard,
              {
                backgroundColor: colors.successMuted,
                borderColor: colors.accent,
                borderRadius: radius.lg,
              },
            ]}
          >
            <Ionicons name="mail-outline" size={28} color={colors.accent} style={styles.successIcon} />
            <Text style={[styles.successTitle, { color: colors.text }]}>Check your inbox</Text>
            <Text style={[styles.successMsg, { color: colors.textSecondary }]}>
              We've sent a reset link to {email}. Check your spam folder if you don't see it.
            </Text>
          </View>
        ) : (
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: radius.lg,
              },
              shadow.md,
            ]}
          >
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
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />
            <Button title="Send reset link" onPress={onSendReset} loading={loading} />
          </View>
        )}

        <Button
          title="Back to login"
          variant="ghost"
          onPress={() => router.back()}
          disabled={loading}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 48,
  },
  backBtn: {
    position: 'absolute',
    top: 60,
    left: 16,
    zIndex: 10,
  },
  header: {
    gap: 6,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 23,
  },
  card: {
    padding: 24,
    borderWidth: 1,
    gap: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 16,
  },
  successCard: {
    padding: 24,
    borderWidth: 1.5,
    alignItems: 'center',
    gap: 8,
  },
  successIcon: {
    marginBottom: 4,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  successMsg: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});
