import { createClient } from "@/lib/supabase/server";
import { getPublicImageUrl } from "@/lib/supabase/client";
import {
  formatCents,
  rentalDays,
  STATUS_COLORS,
  STATUS_LABELS,
  type Booking,
} from "@/lib/types";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, CalendarDays, MessageCircle } from "lucide-react";
import BookingActions from "./BookingActions";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select("*, listings(title, image_paths, daily_price_cents, city)")
    .eq("id", id)
    .single();

  if (!booking) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const item = booking as Booking;
  const listing = item.listings as {
    title: string;
    image_paths: string[];
    daily_price_cents: number;
    city?: string;
  } | null;

  const isOwner = user?.id === item.owner_id;
  const isRenter = user?.id === item.renter_id;
  const days = rentalDays(item.start_date, item.end_date);

  const imgUrl = listing?.image_paths?.[0]
    ? getPublicImageUrl(listing.image_paths[0])
    : null;

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/bookings"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        All bookings
      </Link>

      {/* Card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Image header */}
        <div className="relative h-40 bg-gradient-to-br from-indigo-50 to-violet-50 overflow-hidden">
          {imgUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgUrl}
              alt=""
              className="w-full h-full object-cover opacity-70"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5">
            <h1 className="text-xl font-extrabold text-white truncate">
              {listing?.title ?? "Booking"}
            </h1>
            <span
              className={`inline-block mt-1 text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[item.status]}`}
            >
              {STATUS_LABELS[item.status]}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                <CalendarDays className="w-3 h-3" /> Duration
              </p>
              <p className="font-bold text-slate-900 text-sm">
                {item.start_date} → {item.end_date}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {days} day{days > 1 ? "s" : ""}
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-xs text-slate-400 mb-1">Total charged</p>
              <p className="font-bold text-indigo-700 text-lg">
                {formatCents(item.total_cents)}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">incl. deposit</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Role</span>
              <span className="font-medium text-slate-900">
                {isOwner ? "Owner (lending)" : "Renter (borrowing)"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Booking ID</span>
              <span className="font-mono text-xs text-slate-500">{item.id.slice(0, 8)}…</span>
            </div>
          </div>

          {/* Actions (approve/decline for owner, cancel for renter) */}
          <BookingActions booking={item} isOwner={isOwner} isRenter={isRenter} />

          {/* Message link */}
          <Link
            href={`/messages/${item.id}`}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-2xl transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Open conversation
          </Link>
        </div>
      </div>
    </div>
  );
}
