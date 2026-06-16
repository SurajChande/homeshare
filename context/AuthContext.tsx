import { ensureProfile } from '@/lib/api/profiles';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/lib/types';
import type { Session, User } from '@supabase/supabase-js';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type SignUpResult = {
  needsEmailConfirmation: boolean;
};

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  loading: boolean;
  isRecoveryMode: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<SignUpResult>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearRecoveryMode: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);

  const loadProfile = useCallback(async (user: User) => {
    try {
      const p = await ensureProfile(
        user.id,
        user.user_metadata?.display_name as string | undefined
      );
      setProfile(p);
    } catch {
      // Profile issues should not block auth
      setProfile(null);
    }
  }, []);

  const applySession = useCallback(
    async (next: Session | null) => {
      setSession(next);
      if (next?.user) {
        await loadProfile(next.user);
      } else {
        setProfile(null);
      }
    },
    [loadProfile]
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      applySession(s).finally(() => setLoading(false));
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoveryMode(true);
      }
      applySession(s);
    });

    return () => sub.subscription.unsubscribe();
  }, [applySession]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) throw error;
    if (!data.session) {
      throw new Error('No session returned. Check if email confirmation is required.');
    }
    await applySession(data.session);
  };

  const signUp = async (
    email: string,
    password: string,
    displayName: string
  ): Promise<SignUpResult> => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { display_name: displayName } },
    });
    if (error) throw error;

    if (data.session) {
      await applySession(data.session);
      return { needsEmailConfirmation: false };
    }

    return { needsEmailConfirmation: true };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    await applySession(null);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: 'homeshare:///reset-password-confirm',
    });
    if (error) throw error;
  };

  const clearRecoveryMode = () => setIsRecoveryMode(false);

  const refreshProfile = async () => {
    if (session?.user) await loadProfile(session.user);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        isAdmin: profile?.is_admin === true,
        loading,
        isRecoveryMode,
        signIn,
        signUp,
        signOut,
        resetPassword,
        refreshProfile,
        clearRecoveryMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
