import { useStripe } from '@stripe/stripe-react-native';
import { useState } from 'react';
import { Alert } from 'react-native';
import { Button } from '@/components/Button';
import { createPaymentIntent } from '@/lib/api/bookings';

export function PayBookingButton({
  bookingId,
  onPaid,
}: {
  bookingId: string;
  onPaid: () => void;
}) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const pay = async () => {
    setLoading(true);
    try {
      const { clientSecret } = await createPaymentIntent(bookingId);
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Homeshare',
      });
      if (initError) throw new Error(initError.message);
      const { error: presentError } = await presentPaymentSheet();
      if (presentError) {
        if (presentError.code !== 'Canceled') throw new Error(presentError.message);
      } else {
        Alert.alert('Payment submitted', 'Status updates when Stripe confirms.');
        onPaid();
      }
    } catch (e: unknown) {
      Alert.alert('Payment error', e instanceof Error ? e.message : 'Could not pay');
    } finally {
      setLoading(false);
    }
  };

  return <Button title="Pay now" onPress={pay} loading={loading} />;
}
