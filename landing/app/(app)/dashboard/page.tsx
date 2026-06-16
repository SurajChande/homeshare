import { createClient } from "@/lib/supabase/server";
import { getPublicImageUrl } from "@/lib/supabase/client";
import {
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  formatCents,
  type Listing,
  type ListingCategory,
} from "@/lib/types";
import Link from "next/link";
import { Search, SlidersHorizontal, MapPin, Package } from "lucide-react";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    city?: string;
  }>;
}

function ListingCard({ listing }: { listing: Listing }) {
  const imgUrl = listing.image_paths?.[0]
    ? getPublicImageUrl(listing.image_paths[0])
    : null;

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        {imgUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgUrl}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            {CATEGORY_ICONS[listing.category]}
          </div>
        )}
        <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-slate-700 capitalize">
          {CATEGORY_LABELS[listing.category]}
        </span>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-slate-900 text-base leading-tight mb-1 group-hover:text-indigo-700 transition-colors">
          {listing.title}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 flex-1 mb-3">
          {listing.description}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-extrabold text-indigo-700">
              {formatCents(listing.daily_price_cents)}
            </span>
            <span className="text-xs text-slate-400">/day</span>
          </div>
          {listing.city && (
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <MapPin className="w-3 h-3" />
              {listing.city}
            </span>
          )}
        </div>
        {listing.profiles?.display_name && (
          <p className="text-xs text-slate-400 mt-2">
            by {listing.profiles.display_name}
          </p>
        )}
      </div>
    </Link>
  );
}

const CATEGORIES: ListingCategory[] = [
  "tools",
  "kitchen",
  "electronics",
  "furniture",
  "outdoor",
  "other",
];

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { search, category, city } = params;

  const supabase = await createClient();

  let query = supabase
    .from("listings")
    .select("*, profiles(display_name, city)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (category && CATEGORIES.includes(category as ListingCategory)) {
    query = query.eq("category", category);
  }
  if (city?.trim()) {
    query = query.ilike("city", `%${city.trim()}%`);
  }
  if (search?.trim()) {
    query = query.or(
      `title.ilike.%${search.trim()}%,description.ilike.%${search.trim()}%`
    );
  }

  const { data: listings } = await query.limit(48);
  const items = (listings ?? []) as Listing[];

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Browse listings</h1>
        <p className="text-slate-500 text-sm">
          Borrow what you need from neighbours in your community
        </p>
      </div>

      {/* Search + Filter bar */}
      <form method="GET" className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            name="search"
            defaultValue={search}
            type="text"
            placeholder="Search listings..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm"
          />
        </div>
        <div className="relative">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <select
            name="category"
            defaultValue={category ?? ""}
            className="pl-9 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm appearance-none cursor-pointer"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_ICONS[c]} {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            name="city"
            defaultValue={city}
            type="text"
            placeholder="City"
            className="pl-9 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm w-36"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-2xl hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Search
        </button>
        {(search || category || city) && (
          <Link
            href="/dashboard"
            className="px-4 py-3 text-sm text-slate-500 hover:text-slate-800 rounded-2xl border border-slate-200 bg-white text-center"
          >
            Clear
          </Link>
        )}
      </form>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/dashboard"
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            !category
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
          }`}
        >
          All
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/dashboard?${new URLSearchParams({ ...(search ? { search } : {}), ...(city ? { city } : {}), category: c }).toString()}`}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              category === c
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
            }`}
          >
            <span>{CATEGORY_ICONS[c]}</span>
            {CATEGORY_LABELS[c]}
          </Link>
        ))}
      </div>

      {/* Results */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Package className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">No listings found</p>
          <p className="text-sm text-slate-400 mt-1">
            Try adjusting your filters or{" "}
            <Link href="/my-listings" className="text-indigo-600 hover:underline">
              post your own listing
            </Link>
            .
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500 mb-5">
            {items.length} listing{items.length !== 1 ? "s" : ""} found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {items.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
