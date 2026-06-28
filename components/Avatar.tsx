import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@/lib/useTheme';

const AVATAR_COLORS = [
  '#4F46E5', '#7C3AED', '#DB2777', '#DC2626',
  '#D97706', '#059669', '#0284C7', '#7C3AED',
];

function getAvatarColor(name: string): string {
  const index = Math.abs(name.charCodeAt(0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

interface AvatarProps {
  name?: string | null;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export function Avatar({ name, size = 44, style }: AvatarProps) {
  const { colors } = useTheme();
  const initial = (name ?? '?').charAt(0).toUpperCase();
  const bgColor = name ? getAvatarColor(name) : colors.border;
  const fontSize = Math.round(size * 0.42);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bgColor,
        },
        style,
      ]}
    >
      <Text style={[styles.initial, { fontSize, color: '#FFFFFF' }]}>
        {initial}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  initial: {
    fontWeight: '700',
  },
});
