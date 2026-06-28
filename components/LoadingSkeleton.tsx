import { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/lib/useTheme';

interface SkeletonProps {
  width?: number | `${number}%`;
  height: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({ width = '100%', height, borderRadius = 8, style }: SkeletonProps) {
  const { colors } = useTheme();
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.35, { duration: 750 }),
        withTiming(1, { duration: 750 })
      ),
      -1,
      false
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor: colors.border },
        animatedStyle,
        style,
      ]}
    />
  );
}

export function ListingCardSkeleton() {
  const { colors, radius } = useTheme();
  return (
    <View style={[styles.cardSkeleton, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
      <Skeleton height={180} borderRadius={radius.lg} style={styles.imageSkeleton} />
      <View style={styles.cardBody}>
        <Skeleton width="40%" height={12} borderRadius={6} />
        <Skeleton width="80%" height={18} borderRadius={6} style={{ marginTop: 8 }} />
        <View style={styles.cardFooter}>
          <Skeleton width="35%" height={12} borderRadius={6} />
          <Skeleton width="25%" height={28} borderRadius={12} />
        </View>
      </View>
    </View>
  );
}

export function ConversationSkeleton() {
  const { colors, radius } = useTheme();
  return (
    <View style={[styles.convSkeleton, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
      <Skeleton width={52} height={52} borderRadius={26} />
      <View style={styles.convContent}>
        <View style={styles.convTop}>
          <Skeleton width="45%" height={14} borderRadius={6} />
          <Skeleton width="15%" height={12} borderRadius={6} />
        </View>
        <Skeleton width="30%" height={11} borderRadius={5} style={{ marginTop: 6 }} />
        <Skeleton width="75%" height={12} borderRadius={6} style={{ marginTop: 4 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardSkeleton: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  imageSkeleton: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  cardBody: {
    padding: 16,
    gap: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  convSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    marginBottom: 8,
  },
  convContent: {
    flex: 1,
    gap: 0,
  },
  convTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
