import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@/lib/useTheme';

type BadgeVariant = 'primary' | 'accent' | 'danger' | 'warning' | 'success' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
  dot?: boolean;
}

export function Badge({ label, variant = 'neutral', size = 'md', style, dot }: BadgeProps) {
  const { colors } = useTheme();

  const variantStyles = {
    primary: { bg: colors.primaryMuted, text: colors.primary, dot: colors.primary },
    accent: { bg: colors.accentMuted, text: colors.accentDark, dot: colors.accent },
    danger: { bg: colors.dangerMuted, text: colors.danger, dot: colors.danger },
    warning: { bg: colors.warningMuted, text: colors.warning, dot: colors.warning },
    success: { bg: colors.successMuted, text: colors.accentDark, dot: colors.success },
    neutral: { bg: colors.surfaceSubtle, text: colors.textSecondary, dot: colors.textTertiary },
  };

  const vs = variantStyles[variant];
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: vs.bg,
          paddingHorizontal: isSmall ? 8 : 10,
          paddingVertical: isSmall ? 2 : 4,
        },
        style,
      ]}
    >
      {dot && (
        <View
          style={[
            styles.dot,
            { backgroundColor: vs.dot, width: isSmall ? 5 : 6, height: isSmall ? 5 : 6 },
          ]}
        />
      )}
      <Text
        style={[
          styles.label,
          { color: vs.text, fontSize: isSmall ? 11 : 12 },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    gap: 4,
    alignSelf: 'flex-start',
  },
  dot: {
    borderRadius: 999,
  },
  label: {
    fontWeight: '600',
    letterSpacing: 0.1,
  },
});
