import { Stack } from 'expo-router';

export default function ListingLayout() {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ title: 'Listing' }} />
      <Stack.Screen name="new" options={{ title: 'New listing' }} />
    </Stack>
  );
}
