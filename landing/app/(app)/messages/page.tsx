import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { MessageCircle, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ConversationRow {
  id: string;
  renter_id: string;
  owner_id: string;
  updated_at: string;
  listings: { title: string } | null;
  last_message?: string;
  other_name?: string;
}

export default async function MessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: bookings } = await supabase
    .from("bookings")
    .select("id, renter_id, owner_id, updated_at, listings(title)")
    .or(`renter_id.eq.${user!.id},owner_id.eq.${user!.id}`)
    .order("updated_at", { ascending: false });

  const rows = bookings ?? [];

  // Enrich each row with other party name + last message
  const conversations = await Promise.all(
    rows.map(async (b) => {
      const otherId = b.renter_id === user!.id ? b.owner_id : b.renter_id;

      const [{ data: profile }, { data: lastMsg }] = await Promise.all([
        supabase
          .from("profiles")
          .select("display_name")
          .eq("id", otherId)
          .single(),
        supabase
          .from("messages")
          .select("body, created_at")
          .eq("booking_id", b.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      return {
        ...b,
        other_name: profile?.display_name ?? "User",
        last_message: lastMsg?.body ?? null,
        last_message_at: lastMsg?.created_at ?? null,
      };
    })
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Messages</h1>
        <p className="text-slate-500 text-sm">Chat with renters and lenders</p>
      </div>

      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <MessageCircle className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">No conversations yet</p>
          <Link
            href="/dashboard"
            className="mt-4 text-sm text-indigo-600 font-medium hover:underline"
          >
            Browse listings to start a conversation
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => {
            const listing = (conv.listings as unknown) as { title: string } | null;
            return (
              <Link
                key={conv.id}
                href={`/messages/${conv.id}`}
                className="group flex items-center gap-4 bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-lg hover:border-indigo-100 transition-all duration-200"
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-semibold text-slate-900 truncate group-hover:text-indigo-700 transition-colors">
                      {conv.other_name}
                    </p>
                    {conv.last_message_at && (
                      <p className="text-xs text-slate-400 shrink-0">
                        {formatDistanceToNow(new Date(conv.last_message_at), {
                          addSuffix: true,
                        })}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">
                    Re: {listing?.title ?? "Listing"}
                  </p>
                  {conv.last_message && (
                    <p className="text-sm text-slate-500 truncate mt-0.5">
                      {conv.last_message}
                    </p>
                  )}
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 shrink-0 transition-colors" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
