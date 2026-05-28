import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text } from 'react-native';
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
        <EmptyState title="No messages" message="Messages appear after you have a booking." />
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await load();
            setRefreshing(false);
          }}
        />
      }
      renderItem={({ item }) => (
        <Link href={`/chat/${item.booking_id}`} asChild>
          <Pressable style={styles.card}>
            <Text style={styles.title}>{item.listing_title}</Text>
            <Text style={styles.party}>{item.other_party_name}</Text>
            <Text style={styles.preview} numberOfLines={1}>
              {item.last_message ?? 'No messages yet'}
            </Text>
          </Pressable>
        </Link>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  list: { padding: theme.spacing.md, flexGrow: 1 },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
  party: { fontSize: 14, color: theme.colors.textSecondary, marginTop: 2 },
  preview: { marginTop: 6, color: theme.colors.textSecondary },
});
