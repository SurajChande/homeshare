import { useCallback, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { EmptyState } from '@/components/EmptyState';
import { Avatar } from '@/components/Avatar';
import { ConversationSkeleton } from '@/components/LoadingSkeleton';
import { FLOATING_TAB_BAR_HEIGHT } from '@/components/FloatingTabBar';
import { useAuth } from '@/context/AuthContext';
import { fetchConversationPreviews } from '@/lib/api/messages';
import type { ConversationPreview } from '@/lib/types';
import { useTheme } from '@/lib/useTheme';

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return date.toLocaleDateString([], { weekday: 'short' });
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

interface ConversationCardProps {
  item: ConversationPreview;
}

function ConversationCard({ item }: ConversationCardProps) {
  const router = useRouter();
  const { colors, radius, shadow } = useTheme();

  return (
    <Pressable
      onPress={() => router.push(`/chat/${item.booking_id}`)}
      style={({ pressed }) =>
        StyleSheet.flatten([
          styles.card,
          {
            backgroundColor: colors.surface,
            borderRadius: radius.lg,
            borderColor: colors.border,
            opacity: pressed ? 0.78 : 1,
          },
          shadow.sm,
        ])
      }
      accessibilityRole="button"
      accessibilityLabel={`Conversation with ${item.other_party_name}`}
    >
      <Avatar name={item.other_party_name} size={52} />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {item.other_party_name}
          </Text>
          {item.last_message_at && (
            <Text style={[styles.time, { color: colors.textSecondary }]}>
              {formatTime(item.last_message_at)}
            </Text>
          )}
        </View>
        <Text style={[styles.listingTitle, { color: colors.primary }]} numberOfLines={1}>
          {item.listing_title}
        </Text>
        <Text style={[styles.preview, { color: colors.textSecondary }]} numberOfLines={1}>
          {item.last_message ?? 'No messages yet'}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.borderStrong} />
    </Pressable>
  );
}

export default function MessagesScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    const data = await fetchConversationPreviews(user.id);
    setConversations(data);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load().finally(() => setLoading(false));
    }, [load])
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.booking_id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: FLOATING_TAB_BAR_HEIGHT + 32 },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.screenHeader}>
            <Text style={[styles.screenTitle, { color: colors.text }]}>Messages</Text>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.skeletons}>
              {[0, 1, 2, 3].map((i) => <ConversationSkeleton key={i} />)}
            </View>
          ) : (
            <EmptyState
              title="No messages yet"
              message="Messages appear once you have an active booking."
              icon="chatbubble-ellipses-outline"
            />
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            tintColor={colors.primary}
            onRefresh={async () => {
              setRefreshing(true);
              await load();
              setRefreshing(false);
            }}
          />
        }
        renderItem={({ item }) => <ConversationCard item={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  list: {
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  screenHeader: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  screenTitle: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
    borderWidth: 1,
    width: '100%',
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
    letterSpacing: -0.1,
  },
  time: {
    fontSize: 12,
    fontWeight: '500',
    flexShrink: 0,
  },
  listingTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  preview: {
    fontSize: 14,
    lineHeight: 19,
  },
  separator: {
    height: 12,
  },
  skeletons: {
    gap: 12,
  },
});
