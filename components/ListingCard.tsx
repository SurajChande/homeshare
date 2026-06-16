import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { CATEGORY_LABEL } from '@/lib/constants';
import { listingImageUrl } from '@/lib/api/listings';
import type { Listing } from '@/lib/types';
import { formatCents } from '@/lib/utils';
import { theme } from '@/lib/theme';

export function ListingCard({ listing }: { listing: Listing }) {
  const imageUri = listingImageUrl(listing);

  return (
    <Link href={`/listing/${listing.id}`} asChild>
      <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Text style={styles.placeholderText}>No photo</Text>
          </View>
        )}
        <View style={styles.body}>
          <View style={styles.header}>
            <Text style={styles.category}>{CATEGORY_LABEL[listing.category]}</Text>
            {!listing.is_active && (
              <View style={styles.inactiveBadge}>
                <Text style={styles.inactiveBadgeText}>Inactive</Text>
              </View>
            )}
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {listing.title}
          </Text>
          <View style={styles.footer}>
            <Text style={styles.city}>{listing.city || '—'}</Text>
            <View style={styles.priceBadge}>
              <Text style={styles.price}>{formatCents(listing.daily_price_cents)}/day</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardPressed: {
    opacity: 0.92,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: theme.colors.surface,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  body: {
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  category: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inactiveBadge: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  inactiveBadgeText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  city: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  priceBadge: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textOnPrimary,
  },
});
