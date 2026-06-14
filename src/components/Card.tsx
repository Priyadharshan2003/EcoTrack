import { View, type ViewProps, StyleSheet, Platform } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';
import { Radius, Spacing } from '../constants/theme';

export type CardProps = ViewProps & {
  variant?: 'default' | 'outlined' | 'elevated';
};

export function Card({ style, variant = 'default', ...props }: CardProps) {
  const backgroundColor = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');
  const shadowColor = useThemeColor({}, 'text');

  return (
    <View
      style={[
        styles.card,
        { backgroundColor },
        variant === 'outlined' && { borderWidth: 1, borderColor },
        variant === 'elevated' && Platform.select({
          web: { boxShadow: '0px 4px 8px rgba(0,0,0,0.1)' } as any,
          default: {
            shadowColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }
        }),
        style
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl, // 20px
    padding: Spacing.xl, // 20px
    overflow: 'hidden',
  }
});
