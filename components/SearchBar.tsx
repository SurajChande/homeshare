import { useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/useTheme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  style?: StyleProp<ViewStyle>;
  autoFocus?: boolean;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search…',
  onFocus,
  onBlur,
  style,
  autoFocus,
}: SearchBarProps) {
  const { colors, shadow } = useTheme();
  const [focused, setFocused] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const borderColorAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setFocused(true);
    Animated.parallel([
      Animated.spring(scale, { toValue: 1.02, useNativeDriver: true, friction: 8 }),
      Animated.timing(borderColorAnim, { toValue: 1, duration: 200, useNativeDriver: false }),
    ]).start();
    onFocus?.();
  };

  const handleBlur = () => {
    setFocused(false);
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 8 }),
      Animated.timing(borderColorAnim, { toValue: 0, duration: 200, useNativeDriver: false }),
    ]).start();
    onBlur?.();
  };

  const borderColor = borderColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.primary],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor,
          transform: [{ scale }],
        },
        shadow.md,
        style,
      ]}
    >
      <Ionicons
        name="search"
        size={18}
        color={focused ? colors.primary : colors.textSecondary}
        style={styles.icon}
      />
      <TextInput
        style={[styles.input, { color: colors.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        onFocus={handleFocus}
        onBlur={handleBlur}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        autoFocus={autoFocus}
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText('')}
          hitSlop={10}
          style={[styles.clearBtn, { backgroundColor: colors.borderStrong }]}
        >
          <Ionicons name="close" size={12} color={colors.surface} />
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  icon: {
    flexShrink: 0,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    padding: 0,
  },
  clearBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
