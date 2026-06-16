import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function getPublicImageUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const supabase = createClient();
  const { data } = supabase.storage.from("listing-images").getPublicUrl(path);
  return data.publicUrl;
}
