import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '@/lib/useTheme';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'accent';

interface Props extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
}

export function Button({
  title,
  variant = 'primary',
  loading,
  disabled,
  size = 'md',
  style,
  fullWidth = true,
  ...rest
}: Props) {
  const { colors, radius } = useTheme();

  const variantStyle = {
    primary: { bg: colors.primary, text: colors.textOnPrimary, border: colors.primary },
    secondary: { bg: colors.surface, text: colors.text, border: colors.border },
    danger: { bg: colors.danger, text: '#FFFFFF', border: colors.danger },
    ghost: { bg: 'transparent', text: colors.primary, border: 'transparent' },
    accent: { bg: colors.accent, text: '#FFFFFF', border: colors.accent },
  }[variant];

  const sizeStyle = {
    sm: { py: 10, px: 16, fontSize: 14, br: radius.sm },
    md: { py: 14, px: 20, fontSize: 16, br: radius.button },
    lg: { py: 18, px: 24, fontSize: 17, br: radius.button },
  }[size];

  return (
    <Pressable
      style={({ pressed }) =>
        StyleSheet.flatten([
          styles.base,
          {
            backgroundColor: variantStyle.bg,
            borderColor: variantStyle.border,
            borderRadius: sizeStyle.br,
            paddingVertical: sizeStyle.py,
            paddingHorizontal: sizeStyle.px,
            borderWidth: variant === 'secondary' ? 1.5 : 0,
            alignSelf: fullWidth ? 'stretch' : 'flex-start',
            opacity: disabled || loading ? 0.45 : pressed ? 0.82 : 1,
          },
          style,
        ])
      }
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'danger' || variant === 'accent'
            ? '#FFFFFF'
            : colors.primary}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.text,
            { color: variantStyle.text, fontSize: sizeStyle.fontSize },
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.1,
  },
});
