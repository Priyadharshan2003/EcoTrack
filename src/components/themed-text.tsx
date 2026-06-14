import { Text, type TextProps, StyleSheet } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';
import { Colors } from '../constants/theme';

export type ThemedTextProps = TextProps & {
  type?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'tiny' | 'default' | 'title' | 'subtitle' | 'small' | 'large' | 'huge';
  colorName?: keyof typeof Colors.light & keyof typeof Colors.dark;
  lightColor?: string;
  darkColor?: string;
  weight?: 'normal' | 'medium' | 'bold' | 'heavy';
};

export function ThemedText({ 
  style, 
  type = 'body', 
  colorName = 'text', 
  lightColor, 
  darkColor, 
  weight,
  ...rest 
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, colorName);

  // Map legacy types to new strict scale
  let activeType = type;
  if (type === 'huge' || type === 'title') activeType = 'h1';
  if (type === 'subtitle') activeType = 'h2';
  if (type === 'large') activeType = 'h3';
  if (type === 'default') activeType = 'body';
  if (type === 'small') activeType = 'caption';

  return (
    <Text
      style={[
        { color },
        styles[activeType as keyof typeof styles],
        weight && { fontWeight: weight === 'normal' ? '400' : weight === 'medium' ? '500' : weight === 'bold' ? '700' : '900' },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 28,
    fontWeight: '700',
  },
  h2: {
    fontSize: 22,
    fontWeight: '600',
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
  },
  caption: {
    fontSize: 13,
    fontWeight: '400',
    opacity: 0.7,
  },
  tiny: {
    fontSize: 11,
    fontWeight: '400',
    opacity: 0.6,
  },
});
