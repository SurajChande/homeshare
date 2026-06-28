import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { fetchMessages, sendMessage, subscribeToMessages } from '@/lib/api/messages';
import type { Message } from '@/lib/types';
import { useTheme } from '@/lib/useTheme';

function formatMessageTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

interface BubbleProps {
  message: Message;
  isMine: boolean;
}

function Bubble({ message, isMine }: BubbleProps) {
  const { colors, radius } = useTheme();
  return (
    <View style={[styles.bubbleWrapper, isMine ? styles.mineWrapper : styles.theirsWrapper]}>
      <View
        style={[
          styles.bubble,
          isMine
            ? [styles.mineBubble, { backgroundColor: colors.primary }]
            : [styles.theirsBubble, { backgroundColor: colors.surface, borderColor: colors.border }],
          { borderRadius: radius.md },
          isMine
            ? { borderBottomRightRadius: 4 }
            : { borderBottomLeftRadius: 4 },
        ]}
      >
        <Text style={[styles.bubbleText, { color: isMine ? '#FFFFFF' : colors.text }]}>
          {message.body}
        </Text>
      </View>
      {message.created_at && (
        <Text style={[styles.timeText, { color: colors.textTertiary }]}>
          {formatMessageTime(message.created_at)}
        </Text>
      )}
    </View>
  );
}

export default function ChatScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const { user } = useAuth();
  const { colors, radius, shadow } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const seenIds = useRef(new Set<string>());
  const flatListRef = useRef<FlatList>(null);

  const appendMessage = useCallback((msg: Message) => {
    if (seenIds.current.has(msg.id)) return;
    seenIds.current.add(msg.id);
    setMessages((prev) => [...prev, msg]);
  }, []);

  useEffect(() => {
    if (!bookingId) return;
    fetchMessages(bookingId).then((msgs) => {
      msgs.forEach((m) => seenIds.current.add(m.id));
      setMessages(msgs);
    });
    return subscribeToMessages(bookingId, appendMessage);
  }, [bookingId, appendMessage]);

  const onSend = async () => {
    if (!user || !bookingId || !text.trim()) return;
    setSending(true);
    const content = text.trim();
    setText('');
    try {
      const msg = await sendMessage(bookingId, user.id, content);
      appendMessage(msg);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } finally {
      setSending(false);
    }
  };

  const canSend = text.trim().length > 0 && !sending;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          renderItem={({ item }) => (
            <Bubble message={item} isMine={item.sender_id === user?.id} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyChat}>
              <Text style={[styles.emptyChatText, { color: colors.textSecondary }]}>
                No messages yet. Say hello! 👋
              </Text>
            </View>
          }
        />

        {/* Input bar */}
        <View
          style={[
            styles.inputBar,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.inputWrap,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: radius.button,
              },
            ]}
          >
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={text}
              onChangeText={setText}
              placeholder="Message…"
              placeholderTextColor={colors.textTertiary}
              multiline
              maxLength={1000}
            />
          </View>
          <Pressable
            onPress={onSend}
            disabled={!canSend}
            style={({ pressed }) => [
              styles.sendBtn,
              {
                backgroundColor: canSend ? colors.primary : colors.surfaceSubtle,
                borderRadius: 999,
                opacity: pressed ? 0.8 : 1,
              },
              canSend && shadow.sm,
            ]}
          >
            <Ionicons
              name="arrow-up"
              size={18}
              color={canSend ? '#FFFFFF' : colors.textTertiary}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  kav: { flex: 1 },
  list: {
    padding: 16,
    paddingBottom: 8,
    flexGrow: 1,
    gap: 6,
  },
  bubbleWrapper: {
    maxWidth: '78%',
    gap: 3,
  },
  mineWrapper: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  theirsWrapper: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  mineBubble: {},
  theirsBubble: {
    borderWidth: 1,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 22,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '500',
    paddingHorizontal: 4,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderTopWidth: 1,
  },
  inputWrap: {
    flex: 1,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxHeight: 120,
  },
  input: {
    fontSize: 15,
    lineHeight: 22,
    padding: 0,
  },
  sendBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  emptyChat: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyChatText: {
    fontSize: 15,
    textAlign: 'center',
  },
});
