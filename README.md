# Homeshare

Mobile app for peer-to-peer household item rentals. Built with Expo (React Native), Supabase, and Stripe.

## Features

- Browse and search listings (category, price, city)
- Create and manage your listings with photos
- Request rentals with date ranges
- Owner approve/decline booking requests
- Stripe Payment Sheet for approved bookings
- Booking-scoped in-app messaging (Supabase Realtime)

## Prerequisites

- Node.js 20.19+ (or 22+)
- [Supabase](https://supabase.com) project
- [Stripe](https://stripe.com) account (test mode for development)
- iOS Simulator / Android emulator, or physical device with a **development build** (Stripe requires `expo-dev-client`, not Expo Go)

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Run the SQL in [`supabase/migrations/00001_initial.sql`](supabase/migrations/00001_initial.sql) in the SQL Editor.
3. Copy your project URL and anon key.

### 2. Edge Functions (payments)

Deploy functions and set secrets:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_...
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
npx supabase functions deploy create-payment-intent
npx supabase functions deploy stripe-webhook
```

Point Stripe webhook to: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/stripe-webhook`  
Events: `payment_intent.succeeded`

### 3. App environment

```bash
cp .env.example .env
```

Fill in `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, and `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`.

### 4. Install and run

```bash
npm install
npx expo prebuild   # if using native Stripe
npx expo run:ios    # or run:android
```

For quick UI testing without payments, `npx expo start` works for auth/listings; use a dev build for Stripe.

## Test flow

1. Sign up two accounts (owner + renter).
2. Owner: **My Listings** → create a listing with photo.
3. Renter: **Browse** → open listing → pick dates → **Request to rent**.
4. Owner: **Bookings** → **Approve**.
5. Renter: open booking → **Pay now** (Stripe test card `4242424242424242`).
6. Both: **Messages** → chat on the booking.

## Project structure

- `app/` — Expo Router screens
- `lib/` — Supabase client, API helpers, types
- `components/` — UI components
- `context/` — Auth provider
- `supabase/migrations/` — Database schema
- `supabase/functions/` — Stripe Edge Functions
