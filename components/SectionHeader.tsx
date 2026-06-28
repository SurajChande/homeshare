import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@/lib/useTheme';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function SectionHeader({ title, actionLabel, onAction, style }: SectionHeaderProps) {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { marginBottom: spacing.md }, style]}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={12}>
          <Text style={[styles.action, { color: colors.primary }]}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  action: {
    fontSize: 15,
    fontWeight: '600',
  },
});
