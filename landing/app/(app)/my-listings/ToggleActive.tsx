"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeOff, Eye, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ToggleActive({
  listingId,
  isActive,
}: {
  listingId: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase
      .from("listings")
      .update({ is_active: !isActive })
      .eq("id", listingId);
    router.refresh();
    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-xl transition-colors ${
        isActive
          ? "text-orange-600 bg-orange-50 hover:bg-orange-100"
          : "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
      }`}
    >
      {loading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : isActive ? (
        <EyeOff className="w-3 h-3" />
      ) : (
        <Eye className="w-3 h-3" />
      )}
      {isActive ? "Pause" : "Activate"}
    </button>
  );
}
