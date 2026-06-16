import { Button } from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import {
  createListing,
  fetchListingById,
  updateListing,
  uploadListingImage,
} from '@/lib/api/listings';
import { LISTING_CATEGORIES } from '@/lib/constants';
import { theme } from '@/lib/theme';
import type { ListingCategory } from '@/lib/types';
import { parsePriceToCents } from '@/lib/utils';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

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
      const errorMessage = e instanceof Error ? e.message : 'Could not save listing';
      console.error('Save listing error:', e);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      scrollEnabled
      bounces
    >
      <Text style={styles.sectionTitle}>Basic details</Text>
      <Text style={styles.fieldLabel}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. KitchenAid stand mixer"
        placeholderTextColor={theme.colors.textSecondary}
        value={title}
        onChangeText={setTitle}
      />
      <Text style={styles.fieldLabel}>Description</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Describe the item, its condition, and any requirements..."
        placeholderTextColor={theme.colors.textSecondary}
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.sectionTitle}>Category</Text>
      <View style={styles.categories}>
        {LISTING_CATEGORIES.map((c) => (
          <Pressable
            key={c.value}
            onPress={() => setCategory(c.value)}
            style={[styles.chip, category === c.value && styles.chipActive]}
          >
            <Text style={[styles.chipText, category === c.value && styles.chipTextActive]}>
              {c.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Pricing</Text>
      <Text style={styles.fieldLabel}>Daily price ($)</Text>
      <TextInput
        style={styles.input}
        placeholder="0.00"
        placeholderTextColor={theme.colors.textSecondary}
        keyboardType="decimal-pad"
        value={dailyPrice}
        onChangeText={setDailyPrice}
      />
      <Text style={styles.fieldLabel}>Security deposit ($, optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="0.00"
        placeholderTextColor={theme.colors.textSecondary}
        keyboardType="decimal-pad"
        value={deposit}
        onChangeText={setDeposit}
      />

      <Text style={styles.sectionTitle}>Location</Text>
      <TextInput
        style={styles.input}
        placeholder="City or suburb"
        placeholderTextColor={theme.colors.textSecondary}
        value={city}
        onChangeText={setCity}
      />

      <Text style={styles.sectionTitle}>Photo</Text>
      <Button title="Choose from library" variant="secondary" onPress={pickImage} />
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.preview} />
      ) : null}

      <View style={styles.submitRow}>
        <Button
          title={isEdit ? 'Save changes' : 'Create listing'}
          onPress={save}
          loading={loading}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.md, paddingBottom: theme.spacing.xxl },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 13,
    marginBottom: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
  },
  multiline: { minHeight: 110, textAlignVertical: 'top', paddingTop: 13 },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.full,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  chipTextActive: {
    color: theme.colors.textOnPrimary,
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  submitRow: {
    marginTop: theme.spacing.lg,
  },
});
