import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button } from '@/components/Button';
import { DateRangePicker } from '@/components/DateRangePicker';
import { useAuth } from '@/context/AuthContext';
import { createBooking } from '@/lib/api/bookings';
import { fetchListingById, listingImageUrl } from '@/lib/api/listings';
import { CATEGORY_LABEL } from '@/lib/constants';
import type { Listing } from '@/lib/types';
import { computeTotalCents, formatCents, toDateString } from '@/lib/utils';
import { theme } from '@/lib/theme';

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(false);
  const today = toDateString(new Date());
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  useEffect(() => {
    if (id) fetchListingById(id).then(setListing);
  }, [id]);

  if (!listing) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const imageUri = listingImageUrl(listing);
  const total = computeTotalCents(
    listing.daily_price_cents,
    listing.deposit_cents,
    startDate,
    endDate
  );
  const isOwner = user?.id === listing.owner_id;

  const requestBooking = async () => {
    if (!user || isOwner) {
      Alert.alert('Cannot book', isOwner ? 'You own this listing.' : 'Please log in.');
      return;
    }
    setLoading(true);
    try {
      const booking = await createBooking({
        listing_id: listing.id,
        renter_id: user.id,
        owner_id: listing.owner_id,
        start_date: startDate,
        end_date: endDate,
        total_cents: total,
      });
      Alert.alert('Request sent', 'The owner will review your booking.');
      router.push(`/booking/${booking.id}`);
    } catch (e: unknown) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Could not create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>No photo</Text>
        </View>
      )}
      <View style={styles.body}>
        <Text style={styles.category}>{CATEGORY_LABEL[listing.category]}</Text>
        <Text style={styles.title}>{listing.title}</Text>

        <View style={styles.priceRow}>
          <View style={styles.priceBadge}>
            <Text style={styles.priceValue}>{formatCents(listing.daily_price_cents)}</Text>
            <Text style={styles.priceUnit}>/day</Text>
          </View>
          {listing.deposit_cents > 0 && (
            <Text style={styles.deposit}>+ {formatCents(listing.deposit_cents)} deposit</Text>
          )}
        </View>

        {listing.city ? (
          <View style={styles.locationRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.city}>{listing.city}</Text>
          </View>
        ) : null}

        {listing.description ? (
          <Text style={styles.desc}>{listing.description}</Text>
        ) : null}

        {listing.profiles?.display_name && (
          <View style={styles.ownerRow}>
            <View style={styles.ownerAvatar}>
              <Text style={styles.ownerAvatarLetter}>
                {listing.profiles.display_name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.ownerName}>Listed by {listing.profiles.display_name}</Text>
          </View>
        )}

        {!isOwner && (
          <View style={styles.bookingBox}>
            <Text style={styles.bookingTitle}>Request rental dates</Text>
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onChange={(s, e) => {
                setStartDate(s);
                setEndDate(e);
              }}
            />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total estimate</Text>
              <Text style={styles.totalValue}>{formatCents(total)}</Text>
            </View>
            <Button title="Request to rent" onPress={requestBooking} loading={loading} />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingBottom: theme.spacing.xxl },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: theme.colors.textSecondary, fontSize: 16 },
  image: {
    width: '100%',
    height: 260,
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
    gap: theme.spacing.sm,
  },
  category: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.text,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginVertical: theme.spacing.xs,
  },
  priceBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.md,
    gap: 2,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textOnPrimary,
  },
  priceUnit: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textOnPrimary,
  },
  deposit: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  locationIcon: { fontSize: 14 },
  city: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  desc: {
    fontSize: 16,
    lineHeight: 26,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: theme.spacing.xs,
  },
  ownerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ownerAvatarLetter: {
    fontSize: 16,
    fontWeight: '700',
    color: '#A66E00',
  },
  ownerName: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  bookingBox: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  bookingTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.text,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  totalLabel: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text,
  },
});
