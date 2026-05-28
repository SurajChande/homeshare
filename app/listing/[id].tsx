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
        <Text>Loading...</Text>
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
        <View style={[styles.image, styles.placeholder]} />
      )}
      <Text style={styles.category}>{CATEGORY_LABEL[listing.category]}</Text>
      <Text style={styles.title}>{listing.title}</Text>
      <Text style={styles.price}>{formatCents(listing.daily_price_cents)}/day</Text>
      {listing.deposit_cents > 0 && (
        <Text style={styles.deposit}>Deposit: {formatCents(listing.deposit_cents)}</Text>
      )}
      <Text style={styles.city}>{listing.city}</Text>
      <Text style={styles.desc}>{listing.description}</Text>
      {!isOwner && (
        <View style={styles.booking}>
          <Text style={styles.section}>Request dates</Text>
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={(s, e) => {
              setStartDate(s);
              setEndDate(e);
            }}
          />
          <Text style={styles.total}>Total: {formatCents(total)}</Text>
          <Button title="Request to rent" onPress={requestBooking} loading={loading} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingBottom: 40 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  image: { width: '100%', height: 240, backgroundColor: theme.colors.primaryMuted },
  placeholder: {},
  category: {
    marginTop: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginHorizontal: theme.spacing.md,
    marginTop: 4,
    color: theme.colors.text,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.primary,
    marginHorizontal: theme.spacing.md,
    marginTop: 8,
  },
  deposit: { marginHorizontal: theme.spacing.md, color: theme.colors.textSecondary },
  city: { marginHorizontal: theme.spacing.md, marginTop: 4, color: theme.colors.textSecondary },
  desc: {
    margin: theme.spacing.md,
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text,
  },
  booking: {
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  section: { fontSize: 18, fontWeight: '600', marginBottom: theme.spacing.md },
  total: { fontSize: 18, fontWeight: '700', marginVertical: theme.spacing.md },
});
