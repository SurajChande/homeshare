import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { CATEGORY_LABEL } from '@/lib/constants';
import { listingImageUrl } from '@/lib/api/listings';
import type { Listing } from '@/lib/types';
import { formatCents } from '@/lib/utils';
import { useTheme } from '@/lib/useTheme';
import { Badge } from '@/components/Badge';

export function ListingCard({ listing }: { listing: Listing }) {
  const { colors, radius, shadow } = useTheme();
  const imageUri = listingImageUrl(listing);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { mass: 0.6, damping: 14 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { mass: 0.6, damping: 14 });
  };

  return (
    <Link href={`/listing/${listing.id}`} asChild>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderRadius: radius.lg,
              borderColor: colors.border,
            },
            shadow.md,
            animatedStyle,
          ]}
        >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={[styles.image, { borderRadius: radius.lg }]} />
        ) : (
          <View
            style={[
              styles.image,
              styles.placeholder,
              { backgroundColor: colors.surfaceSubtle, borderRadius: radius.lg },
            ]}
          >
            <Text style={[styles.placeholderText, { color: colors.textTertiary }]}>No photo</Text>
          </View>
        )}

        {!listing.is_active && (
          <View style={styles.inactiveBadgeContainer}>
            <Badge label="Inactive" variant="neutral" size="sm" />
          </View>
        )}

        <View style={styles.body}>
          <Text style={[styles.category, { color: colors.textSecondary }]}>
            {CATEGORY_LABEL[listing.category]}
          </Text>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
            {listing.title}
          </Text>
          <View style={styles.footer}>
            <Text style={[styles.city, { color: colors.textSecondary }]} numberOfLines={1}>
              {listing.city || '—'}
            </Text>
            <View style={[styles.pricePill, { backgroundColor: colors.primaryMuted }]}>
              <Text style={[styles.price, { color: colors.primary }]}>
                {formatCents(listing.daily_price_cents)}/day
              </Text>
            </View>
          </View>
        </View>
        </Animated.View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: 200,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 14,
  },
  inactiveBadgeContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  body: {
    padding: 16,
    gap: 6,
  },
  category: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 23,
    letterSpacing: -0.2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  city: {
    fontSize: 13,
    flex: 1,
    marginRight: 8,
  },
  pricePill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  price: {
    fontSize: 13,
    fontWeight: '700',
  },
});
