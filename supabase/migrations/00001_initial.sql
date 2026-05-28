-- Homeshare initial schema

CREATE TYPE listing_category AS ENUM (
  'tools', 'kitchen', 'electronics', 'furniture', 'outdoor', 'other'
);

CREATE TYPE booking_status AS ENUM (
  'pending', 'approved', 'paid', 'active', 'completed', 'declined', 'cancelled'
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  city TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category listing_category NOT NULL DEFAULT 'other',
  daily_price_cents INTEGER NOT NULL CHECK (daily_price_cents > 0),
  deposit_cents INTEGER NOT NULL DEFAULT 0 CHECK (deposit_cents >= 0),
  city TEXT NOT NULL DEFAULT '',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  image_paths TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  renter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  total_cents INTEGER NOT NULL CHECK (total_cents > 0),
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (end_date >= start_date)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (char_length(trim(body)) > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX listings_owner_id_idx ON listings(owner_id);
CREATE INDEX listings_category_idx ON listings(category);
CREATE INDEX listings_is_active_idx ON listings(is_active);
CREATE INDEX bookings_renter_id_idx ON bookings(renter_id);
CREATE INDEX bookings_owner_id_idx ON bookings(owner_id);
CREATE INDEX bookings_listing_id_idx ON bookings(listing_id);
CREATE INDEX messages_booking_id_idx ON messages(booking_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at for bookings
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Profiles are viewable by authenticated users"
  ON profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Listings
CREATE POLICY "Active listings viewable by authenticated"
  ON listings FOR SELECT TO authenticated
  USING (is_active = true OR owner_id = auth.uid());

CREATE POLICY "Owners insert listings"
  ON listings FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners update own listings"
  ON listings FOR UPDATE TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Owners delete own listings"
  ON listings FOR DELETE TO authenticated
  USING (owner_id = auth.uid());

-- Bookings
CREATE POLICY "Participants view bookings"
  ON bookings FOR SELECT TO authenticated
  USING (renter_id = auth.uid() OR owner_id = auth.uid());

CREATE POLICY "Renters create bookings"
  ON bookings FOR INSERT TO authenticated
  WITH CHECK (renter_id = auth.uid() AND renter_id != owner_id);

CREATE POLICY "Participants update bookings"
  ON bookings FOR UPDATE TO authenticated
  USING (renter_id = auth.uid() OR owner_id = auth.uid());

-- Messages
CREATE POLICY "Participants view messages"
  ON messages FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.id = booking_id
        AND (b.renter_id = auth.uid() OR b.owner_id = auth.uid())
    )
  );

CREATE POLICY "Participants send messages"
  ON messages FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.id = booking_id
        AND (b.renter_id = auth.uid() OR b.owner_id = auth.uid())
    )
  );

-- Storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-images', 'listing-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload listing images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'listing-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Anyone can view listing images"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'listing-images');

CREATE POLICY "Owners can update own listing images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'listing-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Owners can delete own listing images"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'listing-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
