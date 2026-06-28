import { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { Avatar } from '@/components/Avatar';
import { ListItem } from '@/components/ListItem';
import { SectionHeader } from '@/components/SectionHeader';
import { FLOATING_TAB_BAR_HEIGHT } from '@/components/FloatingTabBar';
import { useAuth } from '@/context/AuthContext';
import { updateProfile } from '@/lib/api/profiles';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useTheme } from '@/lib/useTheme';

export default function ProfileScreen() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const { colors, spacing, radius, shadow } = useTheme();
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '');
  const [city, setCity] = useState(profile?.city ?? '');
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateProfile(user.id, {
        display_name: displayName.trim(),
        city: city.trim() || null,
      });
      await refreshProfile();
      setEditing(false);
      Alert.alert('Saved', 'Your profile has been updated.');
    } catch (e: unknown) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Could not save');
    } finally {
      setSaving(false);
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
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: FLOATING_TAB_BAR_HEIGHT + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero header */}
        <View style={[styles.heroSection, { backgroundColor: colors.surface }]}>
          <Avatar name={profile?.display_name ?? user?.email} size={88} />
          <Text style={[styles.heroName, { color: colors.text }]}>
            {profile?.display_name || 'Your name'}
          </Text>
          <Text style={[styles.heroEmail, { color: colors.textSecondary }]}>
            {user?.email}
          </Text>
          {profile?.city ? (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
              <Text style={[styles.locationText, { color: colors.textSecondary }]}>
                {profile.city}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={[styles.body, { paddingHorizontal: spacing.md }]}>
          {!isSupabaseConfigured && (
            <View
              style={[
                styles.warnBox,
                {
                  backgroundColor: colors.warningMuted,
                  borderColor: colors.warning,
                  borderRadius: radius.md,
                },
              ]}
            >
              <Text style={[styles.warnText, { color: colors.text }]}>
                Configure .env with Supabase keys to use the app.
              </Text>
            </View>
          )}

          {/* Edit profile section */}
          <SectionHeader
            title="Profile"
            actionLabel={editing ? undefined : 'Edit'}
            onAction={() => setEditing(true)}
          />

          {editing ? (
            <View
              style={[
                styles.editCard,
                {
                  backgroundColor: colors.surface,
                  borderRadius: radius.lg,
                  borderColor: colors.border,
                },
                shadow.sm,
              ]}
            >
              <View>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Display name</Text>
                <TextInput
                  style={inputStyle}
                  placeholder="Your name"
                  placeholderTextColor={colors.textTertiary}
                  value={displayName}
                  onChangeText={setDisplayName}
                />
              </View>
              <View>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>City</Text>
                <TextInput
                  style={inputStyle}
                  placeholder="Where are you based?"
                  placeholderTextColor={colors.textTertiary}
                  value={city}
                  onChangeText={setCity}
                />
              </View>
              <View style={styles.editActions}>
                <Button title="Cancel" variant="secondary" onPress={() => setEditing(false)} fullWidth={false} style={styles.editBtn} />
                <Button title="Save changes" onPress={save} loading={saving} fullWidth={false} style={styles.editBtn} />
              </View>
            </View>
          ) : (
            <View
              style={[
                styles.infoCard,
                {
                  backgroundColor: colors.surface,
                  borderRadius: radius.lg,
                  borderColor: colors.border,
                },
                shadow.sm,
              ]}
            >
              <ListItem
                title="Display name"
                subtitle={profile?.display_name || 'Not set'}
                icon="person-outline"
                showChevron={false}
              />
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <ListItem
                title="City"
                subtitle={profile?.city || 'Not set'}
                icon="location-outline"
                showChevron={false}
              />
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <ListItem
                title="Email"
                subtitle={user?.email ?? ''}
                icon="mail-outline"
                showChevron={false}
              />
            </View>
          )}

          {/* Account section */}
          <SectionHeader title="Account" style={styles.sectionGap} />
          <View
            style={[
              styles.accountCard,
              {
                backgroundColor: colors.surface,
                borderRadius: radius.lg,
                borderColor: colors.border,
              },
              shadow.sm,
            ]}
          >
            <ListItem
              title="Sign out"
              icon="log-out-outline"
              iconColor={colors.danger}
              onPress={signOut}
              showChevron={false}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    gap: 0,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 28,
    paddingHorizontal: 24,
    gap: 6,
    marginBottom: 24,
  },
  heroName: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginTop: 8,
  },
  heroEmail: {
    fontSize: 14,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 13,
  },
  body: {
    gap: 12,
  },
  warnBox: {
    padding: 14,
    borderWidth: 1.5,
    marginBottom: 8,
  },
  warnText: {
    fontSize: 14,
    lineHeight: 20,
  },
  editCard: {
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  editActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  editBtn: {
    flex: 1,
  },
  infoCard: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    marginLeft: 64,
  },
  sectionGap: {
    marginTop: 20,
  },
  accountCard: {
    borderWidth: 1,
    overflow: 'hidden',
  },
});
