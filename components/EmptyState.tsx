import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { useTheme } from '@/lib/useTheme';

type IoniconName = keyof typeof Ionicons.glyphMap;

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: IoniconName;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function EmptyState({
  title,
  message,
  icon = 'file-tray',
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  style,
}: EmptyStateProps) {
  const { colors, radius } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: colors.primaryMuted, borderRadius: radius.lg },
        ]}
      >
        <Ionicons name={icon} size={32} color={colors.primary} />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {message ? (
        <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button
          title={actionLabel}
          onPress={onAction}
          style={styles.action}
        />
      ) : null}
      {secondaryActionLabel && onSecondaryAction ? (
        <Button
          title={secondaryActionLabel}
          variant="ghost"
          onPress={onSecondaryAction}
          style={styles.secondaryAction}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 48,
    gap: 12,
  },
  iconCircle: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  action: {
    marginTop: 8,
    paddingHorizontal: 32,
    alignSelf: 'center',
  },
  secondaryAction: {
    marginTop: 2,
  },
});
