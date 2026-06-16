import { Ionicons } from '@expo/vector-icons';
import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { useAuth } from '@/context/AuthContext';
import { fetchConversationPreviews } from '@/lib/api/messages';
import type { ConversationPreview } from '@/lib/types';
import { theme } from '@/lib/theme';

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return date.toLocaleDateString([], { weekday: 'short' });
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

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
              <View style={styles.topRow}>
                <Text style={styles.name} numberOfLines={1}>{item.other_party_name}</Text>
                {item.last_message_at && (
                  <Text style={styles.time}>{formatTime(item.last_message_at)}</Text>
                )}
              </View>
              <Text style={styles.listingTitle} numberOfLines={1}>{item.listing_title}</Text>
              <Text style={styles.preview} numberOfLines={1}>
                {item.last_message ?? 'No messages yet'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.border} />
          </Pressable>
        </Link>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  list: {
    flexGrow: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 14,
    borderRadius: theme.radius.lg,
    gap: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardPressed: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.primary,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    borderWidth: 2,
    borderColor: theme.colors.primary + '40',
  },
  avatarLetter: {
    fontSize: 20,
    fontWeight: '800',
    color: '#A66E00',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  time: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    flexShrink: 0,
  },
  listingTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.accent,
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  preview: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
});
