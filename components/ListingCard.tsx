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
      <Pressable style={styles.card}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Text style={styles.placeholderText}>No photo</Text>
          </View>
        )}
        <View style={styles.body}>
          <Text style={styles.category}>{CATEGORY_LABEL[listing.category]}</Text>
          <Text style={styles.title} numberOfLines={2}>
            {listing.title}
          </Text>
          <Text style={styles.city}>{listing.city || '—'}</Text>
          <Text style={styles.price}>{formatCents(listing.daily_price_cents)}/day</Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: theme.colors.primaryMuted,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: theme.colors.textSecondary,
  },
  body: {
    padding: theme.spacing.md,
  },
  category: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: 4,
  },
  city: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
    marginTop: 8,
  },
});
