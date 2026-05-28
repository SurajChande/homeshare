import type { ReactNode } from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';

const stripePublishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';

export function StripeRoot({ children }: { children: ReactNode }) {
  return (
    <StripeProvider
      publishableKey={stripePublishableKey || 'pk_test_placeholder'}
      merchantIdentifier="merchant.com.homeshare"
    >
      {children as React.ReactElement}
    </StripeProvider>
  );
}
