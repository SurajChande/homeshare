import { getAuthErrorMessage } from '@/lib/auth-errors';

describe('getAuthErrorMessage', () => {
  it('returns fallback message for null', () => {
    expect(getAuthErrorMessage(null)).toBe('Something went wrong');
  });

  it('returns fallback message for undefined', () => {
    expect(getAuthErrorMessage(undefined)).toBe('Something went wrong');
  });

  it('returns fallback message for non-object primitives', () => {
    expect(getAuthErrorMessage(42)).toBe('Something went wrong');
    expect(getAuthErrorMessage(true)).toBe('Something went wrong');
  });

  it('returns the raw message for unknown errors', () => {
    expect(getAuthErrorMessage({ message: 'Something custom happened' })).toBe(
      'Something custom happened'
    );
  });

  it('handles email not confirmed error (case-insensitive)', () => {
    const msg = getAuthErrorMessage({ message: 'Email not confirmed' });
    expect(msg).toContain('email is not confirmed');
  });

  it('handles invalid login credentials error', () => {
    const msg = getAuthErrorMessage({ message: 'Invalid login credentials' });
    expect(msg).toContain('Incorrect email or password');
  });

  it('handles user already registered error', () => {
    const msg = getAuthErrorMessage({ message: 'User already registered' });
    expect(msg).toContain('already exists');
  });

  it('handles Error instances', () => {
    const msg = getAuthErrorMessage(new Error('Invalid login credentials'));
    expect(msg).toContain('Incorrect email or password');
  });
});
