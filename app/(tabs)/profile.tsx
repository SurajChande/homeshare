import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
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
      Alert.alert('Saved', 'Profile updated.');
    } catch (e: unknown) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Could not save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.email}>{user?.email}</Text>
      {!isSupabaseConfigured && (
        <Text style={styles.warn}>Configure .env with Supabase keys to use the app.</Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Display name"
        value={displayName}
        onChangeText={setDisplayName}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />
      <Button title="Save profile" onPress={save} loading={saving} />
      <View style={styles.spacer} />
      <Button title="Sign out" variant="danger" onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  email: { fontSize: 14, color: theme.colors.textSecondary, marginBottom: theme.spacing.lg },
  warn: {
    color: theme.colors.warning,
    marginBottom: theme.spacing.md,
    backgroundColor: '#FFF8E7',
    padding: theme.spacing.md,
    borderRadius: theme.radius.sm,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    fontSize: 16,
  },
  spacer: { flex: 1 },
});
