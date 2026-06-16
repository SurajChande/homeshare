import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { adminUpdateUser, getAllUsers } from '@/lib/api/admin';
import type { Profile } from '@/lib/types';
import { theme } from '@/lib/theme';

export default function AdminUsersScreen() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [filtered, setFiltered] = useState<Profile[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getAllUsers()
      .then((data) => {
        setUsers(data);
        setFiltered(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      users.filter(
        (u) =>
          u.display_name.toLowerCase().includes(q) ||
          (u.city ?? '').toLowerCase().includes(q)
      )
    );
  }, [search, users]);

  const toggleAdmin = (user: Profile) => {
    const action = user.is_admin ? 'Remove admin' : 'Make admin';
    Alert.alert(action, `${action} for ${user.display_name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: action,
        onPress: async () => {
          try {
            await adminUpdateUser(user.id, { is_admin: !user.is_admin });
            load();
          } catch (e: unknown) {
            Alert.alert('Error', e instanceof Error ? e.message : 'Failed');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <TextInput
          style={styles.search}
          placeholder="Search by name or city..."
          placeholderTextColor={theme.colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
        <Text style={styles.count}>{filtered.length} users</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.display_name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.info}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{item.display_name}</Text>
                  {item.is_admin && (
                    <View style={styles.adminBadge}>
                      <Text style={styles.adminBadgeText}>Admin</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.meta}>{item.city ?? 'No city'}</Text>
                <Text style={styles.meta}>
                  Joined {new Date(item.created_at).toLocaleDateString()}
                </Text>
              </View>
              <Pressable
                style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
                onPress={() => toggleAdmin(item)}
              >
                <Text style={styles.actionText}>
                  {item.is_admin ? 'Remove admin' : 'Make admin'}
                </Text>
              </Pressable>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.surface },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  search: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    fontSize: 15,
    color: theme.colors.text,
  },
  count: { fontSize: 13, color: theme.colors.textSecondary, fontWeight: '500', flexShrink: 0 },
  loader: { marginTop: theme.spacing.xxl },
  list: { padding: theme.spacing.md, gap: theme.spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: { fontSize: 18, fontWeight: '700', color: '#A66E00' },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  name: { fontSize: 15, fontWeight: '700', color: theme.colors.text },
  adminBadge: {
    backgroundColor: theme.colors.primaryMuted,
    borderRadius: theme.radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  adminBadgeText: { fontSize: 11, fontWeight: '700', color: '#A66E00' },
  meta: { fontSize: 13, color: theme.colors.textSecondary },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexShrink: 0,
  },
  actionBtnPressed: { opacity: 0.7 },
  actionText: { fontSize: 13, fontWeight: '600', color: theme.colors.accent },
});
