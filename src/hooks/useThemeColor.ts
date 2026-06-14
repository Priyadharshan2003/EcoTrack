import { useColorScheme } from 'react-native';
import { useStore } from '../store';
import { Colors } from '../constants/theme';

export function useThemeColor(
  props?: { light?: string; dark?: string },
  colorName?: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const storeTheme = useStore((state) => state.theme);
  const systemTheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  
  const theme = storeTheme === 'system' ? systemTheme : storeTheme;
  
  if (props && theme && props[theme]) {
    return props[theme];
  }

  if (colorName) {
    return Colors[theme][colorName];
  }
  
  return Colors[theme].text; // Default fallback
}

export function useActiveTheme() {
  const storeTheme = useStore((state) => state.theme);
  const systemTheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  return storeTheme === 'system' ? systemTheme : storeTheme;
}
