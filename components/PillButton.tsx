import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@/lib/useTheme';

interface PillButtonProps {
  label: string;
  active?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export function PillButton({ label, active = false, onPress, style }: PillButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        {
          backgroundColor: active ? colors.primary : colors.surface,
          borderColor: active ? colors.primary : colors.border,
          opacity: pressed ? 0.75 : 1,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: active ? colors.textOnPrimary : colors.textSecondary },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1.5,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
});
