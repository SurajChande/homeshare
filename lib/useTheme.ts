import { useColorScheme } from 'react-native';
import { lightColors, darkColors, spacing, radius, typography, shadow } from './theme';

export type ThemeColors = typeof lightColors;

export function useTheme() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors: ThemeColors = isDark ? darkColors : lightColors;
  return { colors, spacing, radius, typography, shadow, isDark };
}
