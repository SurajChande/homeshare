import { createClient } from "@/lib/supabase/server";
import { getPublicImageUrl } from "@/lib/supabase/client";
import {
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  formatCents,
  type Listing,
} from "@/lib/types";
import Link from "next/link";
import { Package, Plus, Eye, EyeOff } from "lucide-react";
import ToggleActive from "./ToggleActive";

export default async function MyListingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .eq("owner_id", user!.id)
    .order("created_at", { ascending: false });

  const items = (listings ?? []) as Listing[];
  const active = items.filter((l) => l.is_active);
  const inactive = items.filter((l) => !l.is_active);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-1">My Listings</h1>
          <p className="text-slate-500 text-sm">
            {active.length} active · {inactive.length} paused
          </p>
        </div>
        {/* 
          Creating a listing requires image upload which is mobile-first (expo-file-system).
          Link to the mobile app or show a simplified form here.
        */}
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-2xl">
          <Package className="w-4 h-4" />
          New listings via mobile app
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Package className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">No listings yet</p>
          <p className="text-sm text-slate-400 mt-2 max-w-xs">
            Open the HomeShare mobile app to create your first listing with photos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((listing) => {
            const imgUrl = listing.image_paths?.[0]
              ? getPublicImageUrl(listing.image_paths[0])
              : null;

            return (
              <div
                key={listing.id}
                className={`bg-white rounded-3xl border overflow-hidden transition-all ${
                  listing.is_active
                    ? "border-slate-100"
                    : "border-slate-200 opacity-70"
                }`}
              >
                {/* Image */}
                <div className="relative h-44 bg-gradient-to-br from-slate-100 to-slate-200">
                  {imgUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imgUrl}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                      {CATEGORY_ICONS[listing.category]}
                    </div>
                  )}
                  {!listing.is_active && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <span className="text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-full border border-slate-200">
                        Paused
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <p className="text-xs text-indigo-600 font-semibold mb-1">
                    {CATEGORY_LABELS[listing.category]}
                  </p>
                  <h3 className="font-bold text-slate-900 text-sm leading-tight mb-1 truncate">
                    {listing.title}
                  </h3>
                  <p className="text-sm font-bold text-indigo-700 mb-4">
                    {formatCents(listing.daily_price_cents)}
                    <span className="text-xs font-normal text-slate-400">/day</span>
                  </p>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/listings/${listing.id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </Link>
                    <ToggleActive listingId={listing.id} isActive={listing.is_active} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
