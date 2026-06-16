import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { useAuth } from '@/context/AuthContext';
import { fetchConversationPreviews } from '@/lib/api/messages';
import type { ConversationPreview } from '@/lib/types';
import { theme } from '@/lib/theme';

export default function MessagesScreen() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    const data = await fetchConversationPreviews(user.id);
    setConversations(data);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <FlatList
      style={styles.container}
      data={conversations}
      keyExtractor={(item) => item.booking_id}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <EmptyState title="No messages" message="Messages appear once you have an active booking." />
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          tintColor={theme.colors.primary}
          onRefresh={async () => {
            setRefreshing(true);
            await load();
            setRefreshing(false);
          }}
        />
      }
      renderItem={({ item }) => (
        <Link href={`/chat/${item.booking_id}`} asChild>
          <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarLetter}>
                {item.other_party_name?.charAt(0).toUpperCase() ?? '?'}
              </Text>
            </View>
            <View style={styles.content}>
              <View style={styles.top}>
                <Text style={styles.party} numberOfLines={1}>{item.other_party_name}</Text>
                {item.last_message_at && (
                  <Text style={styles.time}>
                    {new Date(item.last_message_at).toLocaleDateString()}
                  </Text>
                )}
              </View>
              <Text style={styles.title} numberOfLines={1}>{item.listing_title}</Text>
              <Text style={styles.preview} numberOfLines={1}>
                {item.last_message ?? 'No messages yet'}
              </Text>
            </View>
          </Pressable>
        </Link>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  list: { flexGrow: 1 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  cardPressed: { backgroundColor: theme.colors.surface },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: theme.colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarLetter: {
    fontSize: 18,
    fontWeight: '700',
    color: '#A66E00',
  },
  content: { flex: 1 },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  party: { fontSize: 15, fontWeight: '700', color: theme.colors.text, flex: 1 },
  time: { fontSize: 12, color: theme.colors.textSecondary, marginLeft: theme.spacing.sm },
  title: { fontSize: 13, color: theme.colors.accent, marginTop: 1, fontWeight: '500' },
  preview: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 2 },
});
