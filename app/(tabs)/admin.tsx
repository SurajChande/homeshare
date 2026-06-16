import { Redirect } from 'expo-router';

/**
 * The Admin tab is a redirect to the admin stack root (/admin).
 * This ensures the navigation stack is:
 *   (tabs) → /admin (dashboard) → /admin/users, etc.
 * so the back button works correctly on every admin sub-page.
 */
export default function AdminTab() {
  return <Redirect href="/admin" />;
}
