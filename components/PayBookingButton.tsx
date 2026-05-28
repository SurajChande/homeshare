import { Alert } from 'react-native';
import { Button } from '@/components/Button';

/** Web/default: payments require iOS/Android dev build. */
export function PayBookingButton({ onPaid: _onPaid }: { bookingId: string; onPaid: () => void }) {
  return (
    <Button
      title="Pay now"
      onPress={() =>
        Alert.alert(
          'Mobile app required',
          'Stripe payments work in the iOS or Android dev build. Run: npx expo run:ios'
        )
      }
    />
  );
}
