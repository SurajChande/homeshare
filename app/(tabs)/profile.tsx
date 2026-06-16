import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { updateProfile } from '@/lib/api/profiles';
import { isSupabaseConfigured } from '@/lib/supabase';
import { theme } from '@/lib/theme';

export default function ProfileScreen() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '');
  const [city, setCity] = useState(profile?.city ?? '');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateProfile(user.id, {
        display_name: displayName.trim(),
        city: city.trim() || null,
      });
      await refreshProfile();
      Alert.alert('Saved', 'Your profile has been updated.');
    } catch (e: unknown) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Could not save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarSection}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarLetter}>
            {(profile?.display_name ?? user?.email ?? 'U').charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.displayName}>{profile?.display_name || 'Your name'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {!isSupabaseConfigured && (
        <View style={styles.warnBox}>
          <Text style={styles.warnText}>Configure .env with Supabase keys to use the app.</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Edit profile</Text>

      <Text style={styles.fieldLabel}>Display name</Text>
      <TextInput
        style={styles.input}
        placeholder="Your name"
        placeholderTextColor={theme.colors.textSecondary}
        value={displayName}
        onChangeText={setDisplayName}
      />
      <Text style={styles.fieldLabel}>City</Text>
      <TextInput
        style={styles.input}
        placeholder="Where are you based?"
        placeholderTextColor={theme.colors.textSecondary}
        value={city}
        onChangeText={setCity}
      />
      <Button title="Save profile" onPress={save} loading={saving} />

      <View style={styles.divider} />
      <Button title="Sign out" variant="danger" onPress={signOut} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  avatarLetter: {
    fontSize: 36,
    fontWeight: '800',
    color: theme.colors.textOnPrimary,
  },
  displayName: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  warnBox: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  warnText: {
    color: '#92400E',
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
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
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.xl,
  },
});
