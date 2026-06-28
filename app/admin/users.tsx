import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { adminUpdateUser, getAllUsers } from '@/lib/api/admin';
import type { Profile } from '@/lib/types';
import { useTheme } from '@/lib/useTheme';
import { SearchBar } from '@/components/SearchBar';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { Skeleton } from '@/components/LoadingSkeleton';

export default function AdminUsersScreen() {
  const { colors, radius, shadow, spacing } = useTheme();
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

  useEffect(() => { load(); }, []);

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.toolbar, { borderBottomColor: colors.border }]}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search by name or city…"
          style={styles.searchBar}
        />
        <Text style={[styles.count, { color: colors.textSecondary }]}>
          {filtered.length} users
        </Text>
      </View>

      {loading ? (
        <View style={[styles.list, { paddingHorizontal: spacing.md }]}>
          {[0, 1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={[
                styles.skeletonRow,
                { backgroundColor: colors.surface, borderRadius: radius.lg },
              ]}
            >
              <Skeleton width={44} height={44} borderRadius={22} />
              <View style={styles.skeletonContent}>
                <Skeleton width="55%" height={14} borderRadius={6} />
                <Skeleton width="35%" height={11} borderRadius={5} style={{ marginTop: 6 }} />
              </View>
              <Skeleton width={80} height={32} borderRadius={radius.button} />
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.list, { paddingHorizontal: spacing.md }]}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          renderItem={({ item }) => (
            <View
              style={[
                styles.row,
                {
                  backgroundColor: colors.surface,
                  borderRadius: radius.lg,
                  borderColor: colors.border,
                },
                shadow.sm,
              ]}
            >
              <Avatar name={item.display_name} size={44} />
              <View style={styles.info}>
                <View style={styles.nameRow}>
                  <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
                    {item.display_name}
                  </Text>
                  {item.is_admin && <Badge label="Admin" variant="primary" size="sm" />}
                </View>
                <Text style={[styles.meta, { color: colors.textSecondary }]}>
                  {item.city ?? 'No city'} · Joined {new Date(item.created_at).toLocaleDateString()}
                </Text>
              </View>
              <Pressable
                onPress={() => toggleAdmin(item)}
                style={({ pressed }) =>
                  StyleSheet.flatten([
                    styles.actionBtn,
                    {
                      backgroundColor: item.is_admin ? colors.dangerMuted : colors.primaryMuted,
                      borderRadius: radius.xs,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ])
                }
              >
                <Ionicons
                  name={item.is_admin ? 'remove-circle-outline' : 'shield-outline'}
                  size={14}
                  color={item.is_admin ? colors.danger : colors.primary}
                />
                <Text
                  style={[
                    styles.actionText,
                    { color: item.is_admin ? colors.danger : colors.primary },
                  ]}
                >
                  {item.is_admin ? 'Remove' : 'Make admin'}
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
  container: { flex: 1 },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  searchBar: { flex: 1 },
  count: { fontSize: 13, fontWeight: '600', flexShrink: 0 },
  list: { paddingTop: 12, paddingBottom: 40, gap: 8 },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  skeletonContent: { flex: 1, gap: 0 },
  sep: { height: 0 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderWidth: 1,
  },
  info: { flex: 1, minWidth: 0, gap: 3 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    flexShrink: 1,
  },
  meta: { fontSize: 12, fontWeight: '500' },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 5,
    flexShrink: 0,
  },
  actionText: { fontSize: 12, fontWeight: '600' },
});
