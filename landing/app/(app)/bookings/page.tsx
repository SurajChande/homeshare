import { createClient } from "@/lib/supabase/server";
import { getPublicImageUrl } from "@/lib/supabase/client";
import {
  CATEGORY_ICONS,
  formatCents,
  STATUS_COLORS,
  STATUS_LABELS,
  type Booking,
} from "@/lib/types";
import Link from "next/link";
import { CalendarDays, ChevronRight } from "lucide-react";

export default async function BookingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, listings(title, image_paths, daily_price_cents)")
    .or(`renter_id.eq.${user!.id},owner_id.eq.${user!.id}`)
    .order("created_at", { ascending: false });

  const items = (bookings ?? []) as Booking[];
  const asRenter = items.filter((b) => b.renter_id === user!.id);
  const asOwner = items.filter((b) => b.owner_id === user!.id);

  function BookingCard({ booking }: { booking: Booking }) {
    const listing = booking.listings;
    const imgPath = listing?.image_paths?.[0];
    const imgUrl = imgPath ? getPublicImageUrl(imgPath) : null;

    return (
      <Link
        href={`/bookings/${booking.id}`}
        className="group flex items-center gap-4 bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-lg hover:border-indigo-100 transition-all duration-200"
      >
        <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0">
          {imgUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imgUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">
              📦
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900 truncate group-hover:text-indigo-700 transition-colors">
            {listing?.title ?? "Listing"}
          </p>
          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
            <CalendarDays className="w-3 h-3" />
            {booking.start_date} → {booking.end_date}
          </p>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {formatCents(booking.total_cents)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[booking.status]}`}
          >
            {STATUS_LABELS[booking.status]}
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
        </div>
      </Link>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Bookings</h1>
        <p className="text-slate-500 text-sm">Track all your rental activity</p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <CalendarDays className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">No bookings yet</p>
          <Link
            href="/dashboard"
            className="mt-4 text-sm text-indigo-600 font-medium hover:underline"
          >
            Browse listings to get started
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {asRenter.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                Items I&apos;m borrowing ({asRenter.length})
              </h2>
              <div className="space-y-3">
                {asRenter.map((b) => (
                  <BookingCard key={b.id} booking={b} />
                ))}
              </div>
            </section>
          )}

          {asOwner.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                My items being borrowed ({asOwner.length})
              </h2>
              <div className="space-y-3">
                {asOwner.map((b) => (
                  <BookingCard key={b.id} booking={b} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
