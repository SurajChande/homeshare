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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '@/components/Button';
import { SectionHeader } from '@/components/SectionHeader';
import { useAuth } from '@/context/AuthContext';
import {
  createListing,
  fetchListingById,
  updateListing,
  uploadListingImage,
} from '@/lib/api/listings';
import { LISTING_CATEGORIES } from '@/lib/constants';
import { useTheme } from '@/lib/useTheme';
import type { ListingCategory } from '@/lib/types';
import { parsePriceToCents } from '@/lib/utils';

export default function NewListingScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const { colors, radius, shadow, spacing } = useTheme();
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

  const inputStyle = [
    styles.input,
    {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      color: colors.text,
      borderRadius: radius.md,
    },
  ];

  const sectionCardStyle = [
    styles.sectionCard,
    {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: radius.lg,
    },
    shadow.sm,
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingHorizontal: spacing.md }]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Basic details */}
      <SectionHeader title="Basic details" style={styles.sectionTitle} />
      <View style={sectionCardStyle}>
        <View>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Title *</Text>
          <TextInput
            style={inputStyle}
            placeholder="e.g. KitchenAid stand mixer"
            placeholderTextColor={colors.textTertiary}
            value={title}
            onChangeText={setTitle}
          />
        </View>
        <View>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Description</Text>
          <TextInput
            style={[inputStyle, styles.multiline]}
            placeholder="Describe the item, its condition, and any requirements…"
            placeholderTextColor={colors.textTertiary}
            multiline
            value={description}
            onChangeText={setDescription}
          />
        </View>
      </View>

      {/* Category */}
      <SectionHeader title="Category" style={styles.sectionTitle} />
      <View style={[sectionCardStyle, styles.categoriesWrap]}>
        {LISTING_CATEGORIES.map((c) => (
          <Pressable
            key={c.value}
            onPress={() => setCategory(c.value)}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: category === c.value ? colors.primary : colors.background,
                borderColor: category === c.value ? colors.primary : colors.border,
                borderRadius: radius.xs,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                { color: category === c.value ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              {c.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Pricing */}
      <SectionHeader title="Pricing" style={styles.sectionTitle} />
      <View style={sectionCardStyle}>
        <View>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Daily price ($) *</Text>
          <TextInput
            style={inputStyle}
            placeholder="0.00"
            placeholderTextColor={colors.textTertiary}
            keyboardType="decimal-pad"
            value={dailyPrice}
            onChangeText={setDailyPrice}
          />
        </View>
        <View>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Security deposit ($, optional)</Text>
          <TextInput
            style={inputStyle}
            placeholder="0.00"
            placeholderTextColor={colors.textTertiary}
            keyboardType="decimal-pad"
            value={deposit}
            onChangeText={setDeposit}
          />
        </View>
      </View>

      {/* Location */}
      <SectionHeader title="Location" style={styles.sectionTitle} />
      <View style={sectionCardStyle}>
        <TextInput
          style={inputStyle}
          placeholder="City or suburb"
          placeholderTextColor={colors.textTertiary}
          value={city}
          onChangeText={setCity}
        />
      </View>

      {/* Photo */}
      <SectionHeader title="Photo" style={styles.sectionTitle} />
      <View style={sectionCardStyle}>
        <Pressable
          onPress={pickImage}
          style={({ pressed }) => [
            styles.photoBtn,
            {
              backgroundColor: colors.primaryMuted,
              borderColor: colors.primary,
              borderRadius: radius.md,
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <Ionicons name="image-outline" size={22} color={colors.primary} />
          <Text style={[styles.photoBtnText, { color: colors.primary }]}>
            {imageUri ? 'Change photo' : 'Choose from library'}
          </Text>
        </Pressable>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={[styles.preview, { borderRadius: radius.md }]}
          />
        ) : null}
      </View>

      <Button
        title={isEdit ? 'Save changes' : 'Create listing'}
        onPress={save}
        loading={loading}
        style={styles.submitBtn}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingTop: 8,
    paddingBottom: 48,
    gap: 0,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 12,
  },
  sectionCard: {
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 16,
  },
  multiline: {
    minHeight: 110,
    textAlignVertical: 'top',
    paddingTop: 13,
  },
  categoriesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1.5,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  photoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  photoBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  preview: {
    width: '100%',
    height: 200,
  },
  submitBtn: {
    marginTop: 32,
    marginBottom: 16,
  },
});
