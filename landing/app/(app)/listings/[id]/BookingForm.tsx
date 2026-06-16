"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatCents, rentalDays, type Listing } from "@/lib/types";

export default function BookingForm({
  listing,
  renterId,
}: {
  listing: Listing;
  renterId: string;
}) {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const days = startDate && endDate ? rentalDays(startDate, endDate) : 0;
  const subtotal = days * listing.daily_price_cents;
  const total = subtotal + listing.deposit_cents;

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return;
    if (endDate < startDate) {
      setError("End date must be after start date.");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        listing_id: listing.id,
        renter_id: renterId,
        owner_id: listing.owner_id,
        start_date: startDate,
        end_date: endDate,
        status: "pending",
        total_cents: total,
      })
      .select()
      .single();

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(`/bookings/${data.id}`);
  };

  return (
    <form onSubmit={handleBook} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Start date
          </label>
          <input
            type="date"
            required
            min={today}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            End date
          </label>
          <input
            type="date"
            required
            min={startDate || today}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          />
        </div>
      </div>

      {days > 0 && (
        <div className="bg-slate-50 rounded-2xl p-4 space-y-2 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>
              {formatCents(listing.daily_price_cents)} × {days} day{days > 1 ? "s" : ""}
            </span>
            <span>{formatCents(subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Security deposit</span>
            <span>{formatCents(listing.deposit_cents)}</span>
          </div>
          <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-2">
            <span>Total</span>
            <span>{formatCents(total)}</span>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !startDate || !endDate}
        className="w-full flex items-center justify-center gap-2 py-3.5 px-6 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl hover:shadow-lg hover:shadow-indigo-200 disabled:opacity-60 transition-all"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? "Sending request..." : "Request to borrow"}
      </button>

      <p className="text-xs text-center text-slate-400">
        The owner will approve or decline your request
      </p>
    </form>
  );
}
