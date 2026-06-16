import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Message } from "@/lib/types";
import ChatWindow from "./ChatWindow";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: booking } = await supabase
    .from("bookings")
    .select("id, renter_id, owner_id, listings(title)")
    .eq("id", bookingId)
    .single();

  if (!booking) notFound();

  const isParticipant =
    booking.renter_id === user!.id || booking.owner_id === user!.id;
  if (!isParticipant) notFound();

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("booking_id", bookingId)
    .order("created_at", { ascending: true });

  const listing = (booking.listings as unknown) as { title: string } | null;

  // Get other party name
  const otherId =
    booking.renter_id === user!.id ? booking.owner_id : booking.renter_id;
  const { data: otherProfile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", otherId)
    .single();

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <Link
          href="/messages"
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-bold text-slate-900">
            {otherProfile?.display_name ?? "User"}
          </h1>
          <p className="text-xs text-slate-400">{listing?.title}</p>
        </div>
      </div>

      <ChatWindow
        bookingId={bookingId}
        currentUserId={user!.id}
        initialMessages={(messages ?? []) as Message[]}
      />
    </div>
  );
}
