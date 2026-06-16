import { createClient } from "@/lib/supabase/server";
import ProfileForm from "./ProfileForm";
import { User } from "lucide-react";
import type { Profile } from "@/lib/types";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  const { data: stats } = await Promise.all([
    supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("owner_id", user!.id)
      .eq("is_active", true),
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("renter_id", user!.id),
  ]).then(([l, b]) => ({ data: { listings: l.count ?? 0, bookings: b.count ?? 0 } }));

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Profile</h1>
        <p className="text-slate-500 text-sm">Manage your public profile and account</p>
      </div>

      {/* Avatar + stats */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 mb-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
          <User className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          {profile?.display_name ?? user!.email}
        </h2>
        <p className="text-sm text-slate-400 mt-0.5">{user!.email}</p>
        {profile?.city && (
          <p className="text-sm text-slate-500 mt-1">📍 {profile.city}</p>
        )}

        <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-100">
          <div>
            <p className="text-2xl font-extrabold text-indigo-700">{stats.listings}</p>
            <p className="text-xs text-slate-400">Active listings</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-indigo-700">{stats.bookings}</p>
            <p className="text-xs text-slate-400">Bookings made</p>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6">
        <h3 className="font-bold text-slate-900 mb-5">Edit profile</h3>
        <ProfileForm
          userId={user!.id}
          initialData={{
            display_name: profile?.display_name ?? "",
            city: profile?.city ?? "",
          }}
        />
      </div>

      {/* Account info */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 mt-5">
        <h3 className="font-bold text-slate-900 mb-4">Account</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Email</span>
            <span className="font-medium text-slate-900">{user!.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Member since</span>
            <span className="font-medium text-slate-900">
              {new Date(user!.created_at).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
