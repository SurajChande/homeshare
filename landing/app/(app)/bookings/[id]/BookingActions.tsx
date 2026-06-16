"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Booking } from "@/lib/types";

export default function BookingActions({
  booking,
  isOwner,
  isRenter,
}: {
  booking: Booking;
  isOwner: boolean;
  isRenter: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (status: string) => {
    setLoading(status);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", booking.id);
    if (error) {
      setError(error.message);
    } else {
      router.refresh();
    }
    setLoading(null);
  };

  if (booking.status === "completed" || booking.status === "cancelled" || booking.status === "declined") {
    return null;
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>
      )}

      {/* Owner actions */}
      {isOwner && booking.status === "pending" && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => updateStatus("approved")}
            disabled={!!loading}
            className="flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl disabled:opacity-60 transition-colors"
          >
            {loading === "approved" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            Approve
          </button>
          <button
            onClick={() => updateStatus("declined")}
            disabled={!!loading}
            className="flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-2xl disabled:opacity-60 transition-colors"
          >
            {loading === "declined" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            Decline
          </button>
        </div>
      )}

      {/* Renter cancel */}
      {isRenter && (booking.status === "pending" || booking.status === "approved") && (
        <button
          onClick={() => updateStatus("cancelled")}
          disabled={!!loading}
          className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-2xl disabled:opacity-60 transition-colors"
        >
          {loading === "cancelled" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          Cancel request
        </button>
      )}
    </div>
  );
}
