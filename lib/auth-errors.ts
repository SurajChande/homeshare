export function getAuthErrorMessage(error: unknown): string {
  const msg =
    error && typeof error === 'object' && 'message' in error
      ? String((error as { message: string }).message)
      : 'Something went wrong';

  const lower = msg.toLowerCase();

  if (lower.includes('email not confirmed')) {
    return (
      'Your email is not confirmed yet. Open the link in the signup email, then try again.\n\n' +
      'For local testing, disable confirmation in Supabase: Authentication → Providers → Email → turn off "Confirm email".'
    );
  }

  if (lower.includes('invalid login credentials')) {
    return (
      'Incorrect email or password. If you just signed up, confirm your email first, or use the exact password from signup.'
    );
  }

  if (lower.includes('user already registered')) {
    return 'An account with this email already exists. Try logging in instead.';
  }

  return msg;
}
