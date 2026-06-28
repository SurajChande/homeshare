import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@/lib/useTheme';

export const FLOATING_TAB_BAR_HEIGHT = 72;

type IoniconName = keyof typeof Ionicons.glyphMap;

const TAB_CONFIG: Record<string, { active: IoniconName; inactive: IoniconName; label: string }> = {
  index:         { active: 'compass',            inactive: 'compass-outline',            label: 'Browse'   },
  'my-listings': { active: 'storefront',          inactive: 'storefront-outline',          label: 'Listings' },
  bookings:      { active: 'calendar',            inactive: 'calendar-outline',            label: 'Bookings' },
  messages:      { active: 'chatbubble-ellipses', inactive: 'chatbubble-ellipses-outline', label: 'Messages' },
  profile:       { active: 'person-circle',       inactive: 'person-circle-outline',       label: 'Me'       },
  admin:         { active: 'construct',           inactive: 'construct-outline',           label: 'Admin'    },
};

interface TabItemProps {
  routeName: string;
  isFocused: boolean;
  onPress: () => void;
  label: string;
}

function TabItem({ routeName, isFocused, onPress, label }: TabItemProps) {
  const { colors } = useTheme();
  const config = TAB_CONFIG[routeName] ?? { active: 'ellipse', inactive: 'ellipse-outline', label };

  const progress = useSharedValue(isFocused ? 1 : 0);
  const scale = useSharedValue(1);

  useEffect(() => {
    progress.value = withTiming(isFocused ? 1 : 0, { duration: 220 });
  }, [isFocused, progress]);

  const iconBgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], ['transparent', colors.primary]),
    transform: [{ scale: withTiming(isFocused ? 1 : 0.85, { duration: 220 }) }],
  }));

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.82, { mass: 0.6, damping: 12 }),
      withSpring(1, { mass: 0.6, damping: 12 })
    );
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={styles.tab}
      accessibilityRole="button"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={label}
    >
      <Animated.View style={pressStyle}>
        <Animated.View style={[styles.iconWrap, iconBgStyle]}>
          <Ionicons
            name={isFocused ? config.active : config.inactive}
            size={22}
            color={isFocused ? '#FFFFFF' : colors.textSecondary}
          />
        </Animated.View>
      </Animated.View>
      <Text
        style={[
          styles.label,
          { color: isFocused ? colors.primary : colors.textSecondary },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

interface FloatingTabBarProps extends BottomTabBarProps {
  isAdmin?: boolean;
}

export function FloatingTabBar({ state, descriptors, navigation, isAdmin }: FloatingTabBarProps) {
  const { colors, shadow } = useTheme();
  const insets = useSafeAreaInsets();

  const visibleRoutes = state.routes.filter((route) => {
    if (route.name === 'admin' && !isAdmin) return false;
    return true;
  });

  return (
    <View
      style={[
        styles.wrapper,
        { bottom: Math.max(insets.bottom, 16) + 8 },
      ]}
      pointerEvents="box-none"
    >
      <View
        style={[
          styles.bar,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
          shadow.float,
        ]}
      >
        {visibleRoutes.map((route) => {
          const { options } = descriptors[route.key];
          const isFocused = state.routes[state.index]?.key === route.key;
          const config = TAB_CONFIG[route.name];
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : (config?.label ?? route.name);

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabItem
              key={route.key}
              routeName={route.name}
              isFocused={isFocused}
              onPress={onPress}
              label={label}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 28,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    width: '100%',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 4,
    minHeight: 56,
  },
  iconWrap: {
    width: 40,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
