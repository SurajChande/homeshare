import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { Avatar } from '@/components/Avatar';
import { DateRangePicker } from '@/components/DateRangePicker';
import { Skeleton } from '@/components/LoadingSkeleton';
import { useAuth } from '@/context/AuthContext';
import { createBooking } from '@/lib/api/bookings';
import { fetchListingById, listingImageUrl } from '@/lib/api/listings';
import { CATEGORY_LABEL } from '@/lib/constants';
import type { Listing } from '@/lib/types';
import { computeTotalCents, formatCents, toDateString } from '@/lib/utils';
import { useTheme } from '@/lib/useTheme';

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const { colors, radius, shadow, spacing } = useTheme();
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
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <Skeleton height={260} borderRadius={0} />
        <View style={[styles.body, { paddingHorizontal: spacing.md }]}>
          <Skeleton width="40%" height={12} borderRadius={6} style={{ marginTop: 16 }} />
          <Skeleton width="80%" height={28} borderRadius={8} style={{ marginTop: 12 }} />
          <Skeleton width="50%" height={40} borderRadius={20} style={{ marginTop: 16 }} />
          <Skeleton width="90%" height={16} borderRadius={6} style={{ marginTop: 20 }} />
          <Skeleton width="75%" height={16} borderRadius={6} style={{ marginTop: 8 }} />
        </View>
      </ScrollView>
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
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero image */}
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder, { backgroundColor: colors.surfaceSubtle }]}>
          <Ionicons name="image-outline" size={40} color={colors.textTertiary} />
        </View>
      )}

      <View style={[styles.body, { paddingHorizontal: spacing.md }]}>
        {/* Category + inactive badge */}
        <View style={styles.topRow}>
          <Text style={[styles.category, { color: colors.textSecondary }]}>
            {CATEGORY_LABEL[listing.category]}
          </Text>
          {!listing.is_active && <Badge label="Inactive" variant="neutral" size="sm" />}
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>{listing.title}</Text>

        {/* Price */}
        <View style={styles.priceRow}>
          <View style={[styles.pricePill, { backgroundColor: colors.primaryMuted }]}>
            <Text style={[styles.priceValue, { color: colors.primary }]}>
              {formatCents(listing.daily_price_cents)}
            </Text>
            <Text style={[styles.priceUnit, { color: colors.primary }]}>/day</Text>
          </View>
          {listing.deposit_cents > 0 && (
            <Text style={[styles.deposit, { color: colors.textSecondary }]}>
              + {formatCents(listing.deposit_cents)} deposit
            </Text>
          )}
        </View>

        {/* Location */}
        {listing.city ? (
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={15} color={colors.textSecondary} />
            <Text style={[styles.city, { color: colors.textSecondary }]}>{listing.city}</Text>
          </View>
        ) : null}

        {/* Description */}
        {listing.description ? (
          <Text style={[styles.desc, { color: colors.text }]}>{listing.description}</Text>
        ) : null}

        {/* Owner */}
        {listing.profiles?.display_name && (
          <View
            style={[
              styles.ownerCard,
              {
                backgroundColor: colors.surface,
                borderRadius: radius.md,
                borderColor: colors.border,
              },
            ]}
          >
            <Avatar name={listing.profiles.display_name} size={40} />
            <View>
              <Text style={[styles.ownerLabel, { color: colors.textSecondary }]}>Listed by</Text>
              <Text style={[styles.ownerName, { color: colors.text }]}>
                {listing.profiles.display_name}
              </Text>
            </View>
          </View>
        )}

        {/* Booking panel */}
        {!isOwner && (
          <View
            style={[
              styles.bookingBox,
              {
                backgroundColor: colors.surface,
                borderRadius: radius.lg,
                borderColor: colors.border,
              },
              shadow.md,
            ]}
          >
            <Text style={[styles.bookingTitle, { color: colors.text }]}>Request rental dates</Text>
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onChange={(s, e) => {
                setStartDate(s);
                setEndDate(e);
              }}
            />
            <View style={[styles.totalRow, { borderTopColor: colors.border }]}>
              <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Total estimate</Text>
              <Text style={[styles.totalValue, { color: colors.text }]}>{formatCents(total)}</Text>
            </View>
            <Button title="Request to rent" onPress={requestBooking} loading={loading} />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 48 },
  image: {
    width: '100%',
    height: 280,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingTop: 20,
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  category: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 33,
    letterSpacing: -0.4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pricePill: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    gap: 2,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  priceUnit: {
    fontSize: 14,
    fontWeight: '600',
  },
  deposit: {
    fontSize: 14,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  city: {
    fontSize: 14,
    fontWeight: '500',
  },
  desc: {
    fontSize: 16,
    lineHeight: 26,
  },
  ownerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderWidth: 1,
  },
  ownerLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  ownerName: {
    fontSize: 15,
    fontWeight: '700',
  },
  bookingBox: {
    marginTop: 8,
    padding: 20,
    borderWidth: 1,
    gap: 16,
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: 15,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
});
