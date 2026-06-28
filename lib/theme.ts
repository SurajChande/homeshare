// HomeShare Design System — Premium iOS-inspired design tokens

export const lightColors = {
  background: '#F8F9FC',
  surface: '#FFFFFF',
  surfaceRaised: '#FFFFFF',
  surfaceSubtle: '#F3F4F6',
  primary: '#4F46E5',
  primaryMuted: '#EEF2FF',
  primaryDark: '#3730A3',
  accent: '#10B981',
  accentMuted: '#D1FAE5',
  accentDark: '#059669',
  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textOnPrimary: '#FFFFFF',
  border: '#E5E7EB',
  borderStrong: '#D1D5DB',
  danger: '#EF4444',
  dangerMuted: '#FEE2E2',
  warning: '#F59E0B',
  warningMuted: '#FEF3C7',
  success: '#10B981',
  successMuted: '#D1FAE5',
} as const;

export const darkColors = {
  background: '#0F0F14',
  surface: '#1C1C1E',
  surfaceRaised: '#2C2C2E',
  surfaceSubtle: '#252528',
  primary: '#6366F1',
  primaryMuted: '#1E1B4B',
  primaryDark: '#818CF8',
  accent: '#34D399',
  accentMuted: '#064E3B',
  accentDark: '#10B981',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textTertiary: '#6B7280',
  textOnPrimary: '#FFFFFF',
  border: '#374151',
  borderStrong: '#4B5563',
  danger: '#F87171',
  dangerMuted: '#450A0A',
  warning: '#FBBF24',
  warningMuted: '#451A03',
  success: '#34D399',
  successMuted: '#064E3B',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
} as const;

export const radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  button: 18,
  bottomSheet: 28,
  full: 999,
} as const;

export const typography = {
  largeTitle: { fontSize: 34, fontWeight: '700' as const, letterSpacing: -0.5 },
  screenTitle: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.4 },
  sectionHeader: { fontSize: 22, fontWeight: '600' as const, letterSpacing: -0.3 },
  cardTitle: { fontSize: 18, fontWeight: '600' as const, letterSpacing: -0.2 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMedium: { fontSize: 16, fontWeight: '500' as const, lineHeight: 24 },
  bodySemibold: { fontSize: 16, fontWeight: '600' as const },
  caption: { fontSize: 13, fontWeight: '500' as const },
  captionSmall: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 0.3 },
} as const;

export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  float: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 12,
  },
} as const;

// Main theme export (light mode) — used by legacy screens and components
export const theme = {
  colors: lightColors,
  spacing,
  radius,
  typography,
  shadow,
} as const;
