-- Add admin flag to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false;

-- Helper function: returns true if the calling user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Admins can read all profiles (the existing SELECT policy already allows this via "true")
-- Admins can update any profile
CREATE POLICY "Admins update any profile"
  ON profiles FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Admins can view all listings including inactive
DROP POLICY IF EXISTS "Active listings viewable by authenticated" ON listings;
CREATE POLICY "Active listings viewable by authenticated"
  ON listings FOR SELECT TO authenticated
  USING (is_active = true OR owner_id = auth.uid() OR public.is_admin());

-- Admins can update any listing (e.g. flag/remove)
CREATE POLICY "Admins update any listing"
  ON listings FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Admins can delete any listing
CREATE POLICY "Admins delete any listing"
  ON listings FOR DELETE TO authenticated
  USING (public.is_admin());

-- Admins can view all bookings
DROP POLICY IF EXISTS "Participants view bookings" ON bookings;
CREATE POLICY "Participants view bookings"
  ON bookings FOR SELECT TO authenticated
  USING (renter_id = auth.uid() OR owner_id = auth.uid() OR public.is_admin());

-- Admins can update any booking (e.g. cancel/override)
CREATE POLICY "Admins update any booking"
  ON bookings FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Admins can view all messages
DROP POLICY IF EXISTS "Participants view messages" ON messages;
CREATE POLICY "Participants view messages"
  ON messages FOR SELECT TO authenticated
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.id = booking_id
        AND (b.renter_id = auth.uid() OR b.owner_id = auth.uid())
    )
  );
