import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/useTheme';

interface ListItemProps {
  title: string;
  subtitle?: string;
  meta?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function ListItem({
  title,
  subtitle,
  meta,
  icon,
  iconColor,
  onPress,
  rightElement,
  showChevron = true,
  style,
}: ListItemProps) {
  const { colors, radius } = useTheme();

  const content = (
    <View style={[styles.row, { backgroundColor: colors.surface, borderRadius: radius.md }, style]}>
      {icon && (
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: (iconColor ?? colors.primary) + '18' },
          ]}
        >
          <Ionicons name={icon} size={20} color={iconColor ?? colors.primary} />
        </View>
      )}
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {meta ? (
        <Text style={[styles.meta, { color: colors.textSecondary }]}>{meta}</Text>
      ) : null}
      {rightElement ?? null}
      {showChevron && onPress ? (
        <Ionicons name="chevron-forward" size={16} color={colors.borderStrong} />
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [pressed && { opacity: 0.75 }]}
      >
        {content}
      </Pressable>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    minHeight: 56,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  meta: {
    fontSize: 14,
    fontWeight: '500',
    flexShrink: 0,
  },
});
