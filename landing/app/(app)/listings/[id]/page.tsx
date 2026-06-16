import { createClient } from "@/lib/supabase/server";
import { getPublicImageUrl } from "@/lib/supabase/client";
import { CATEGORY_ICONS, CATEGORY_LABELS, formatCents, type Listing } from "@/lib/types";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, User, ChevronLeft, CalendarDays } from "lucide-react";
import BookingForm from "./BookingForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: listing, error } = await supabase
    .from("listings")
    .select("*, profiles(display_name, city)")
    .eq("id", id)
    .single();

  if (error || !listing) notFound();

  const { data: { user } } = await supabase.auth.getUser();

  const item = listing as Listing;
  const isOwner = user?.id === item.owner_id;
  const images = item.image_paths ?? [];

  return (
    <div className="max-w-5xl mx-auto">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to browse
      </Link>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left — Images + details */}
        <div className="lg:col-span-3 space-y-6">
          {/* Images */}
          <div className="space-y-3">
            <div className="aspect-video rounded-3xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
              {images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={getPublicImageUrl(images[0])}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl">
                  {CATEGORY_ICONS[item.category]}
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.slice(1, 5).map((path, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getPublicImageUrl(path)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full">
              <span>{CATEGORY_ICONS[item.category]}</span>
              {CATEGORY_LABELS[item.category]}
            </span>
          </div>

          {/* Title + desc */}
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-3">{item.title}</h1>
            <p className="text-slate-600 leading-relaxed">{item.description}</p>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <p className="text-xs text-slate-400 mb-1">Daily rate</p>
              <p className="text-xl font-bold text-indigo-700">
                {formatCents(item.daily_price_cents)}
                <span className="text-sm font-normal text-slate-400">/day</span>
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <p className="text-xs text-slate-400 mb-1">Security deposit</p>
              <p className="text-xl font-bold text-slate-700">
                {formatCents(item.deposit_cents)}
              </p>
            </div>
          </div>

          {/* Owner */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shrink-0">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-400 mb-0.5">Listed by</p>
              <p className="font-bold text-slate-900">
                {item.profiles?.display_name ?? "Neighbour"}
              </p>
              {item.city && (
                <p className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  {item.city}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right — Booking form */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 bg-white rounded-3xl border border-slate-200 shadow-xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <CalendarDays className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Request to borrow</h2>
            </div>

            {isOwner ? (
              <div className="text-sm text-slate-500 bg-slate-50 rounded-2xl p-4">
                This is your listing. You can&apos;t book your own items.
              </div>
            ) : !user ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-500">
                  Sign in to request this item
                </p>
                <Link
                  href={`/auth/login?next=/listings/${id}`}
                  className="block w-full text-center py-3 px-4 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl hover:shadow-lg transition-all"
                >
                  Sign in to book
                </Link>
              </div>
            ) : (
              <BookingForm
                listing={item}
                renterId={user.id}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
