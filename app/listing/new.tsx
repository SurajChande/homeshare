import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Button } from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import {
  createListing,
  fetchListingById,
  updateListing,
  uploadListingImage,
} from '@/lib/api/listings';
import { LISTING_CATEGORIES } from '@/lib/constants';
import type { ListingCategory } from '@/lib/types';
import { parsePriceToCents } from '@/lib/utils';
import { theme } from '@/lib/theme';

export default function NewListingScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ListingCategory>('other');
  const [dailyPrice, setDailyPrice] = useState('');
  const [deposit, setDeposit] = useState('');
  const [city, setCity] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [existingPaths, setExistingPaths] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchListingById(id).then((listing) => {
      if (!listing) return;
      setTitle(listing.title);
      setDescription(listing.description);
      setCategory(listing.category);
      setDailyPrice((listing.daily_price_cents / 100).toString());
      setDeposit((listing.deposit_cents / 100).toString());
      setCity(listing.city);
      setExistingPaths(listing.image_paths ?? []);
    });
  }, [id]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const save = async () => {
    if (!user) return;
    const dailyPriceCents = parsePriceToCents(dailyPrice);
    if (!title.trim() || dailyPriceCents <= 0) {
      Alert.alert('Missing fields', 'Title and daily price are required.');
      return;
    }

    setLoading(true);
    try {
      const depositCents = parsePriceToCents(deposit) || 0;

      if (isEdit && id) {
        let image_paths = existingPaths;
        if (imageUri) {
          const path = await uploadListingImage(user.id, id, imageUri);
          image_paths = [...image_paths, path];
        }
        await updateListing(id, {
          title: title.trim(),
          description: description.trim(),
          category,
          daily_price_cents: dailyPriceCents,
          deposit_cents: depositCents,
          city: city.trim(),
          image_paths,
        });
      } else {
        const listing = await createListing({
          owner_id: user.id,
          title: title.trim(),
          description: description.trim(),
          category,
          daily_price_cents: dailyPriceCents,
          deposit_cents: depositCents,
          city: city.trim() || (user.email?.split('@')[0] ?? ''),
          latitude: null,
          longitude: null,
          is_active: true,
        });
        if (imageUri) {
          const path = await uploadListingImage(user.id, listing.id, imageUri);
          await updateListing(listing.id, { image_paths: [path] });
        }
      }
      router.back();
    } catch (e: unknown) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Could not save listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Description"
        multiline
        value={description}
        onChangeText={setDescription}
      />
      <Text style={styles.label}>Category</Text>
      <View style={styles.categories}>
        {LISTING_CATEGORIES.map((c) => (
          <Text
            key={c.value}
            onPress={() => setCategory(c.value)}
            style={[styles.chip, category === c.value && styles.chipActive]}
          >
            {c.label}
          </Text>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Daily price ($)"
        keyboardType="decimal-pad"
        value={dailyPrice}
        onChangeText={setDailyPrice}
      />
      <TextInput
        style={styles.input}
        placeholder="Deposit ($, optional)"
        keyboardType="decimal-pad"
        value={deposit}
        onChangeText={setDeposit}
      />
      <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} />
      <Button title="Add photo" variant="secondary" onPress={pickImage} />
      {imageUri ? <Image source={{ uri: imageUri }} style={styles.preview} /> : null}
      <Button title={isEdit ? 'Save changes' : 'Create listing'} onPress={save} loading={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.md },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    fontSize: 16,
  },
  multiline: { minHeight: 100, textAlignVertical: 'top' },
  label: { fontWeight: '600', marginBottom: theme.spacing.sm },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: theme.spacing.md },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  chipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary, color: '#fff' },
  preview: { width: '100%', height: 180, borderRadius: theme.radius.sm, marginVertical: theme.spacing.md },
});
