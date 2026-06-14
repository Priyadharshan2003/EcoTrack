import { TouchableOpacity, type TouchableOpacityProps, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedText } from './themed-text';
import { useThemeColor } from '../hooks/useThemeColor';
import { Radius, Spacing } from '../constants/theme';

export type ButtonProps = TouchableOpacityProps & {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
};

export function Button({ 
  style, 
  title, 
  variant = 'primary', 
  isLoading,
  disabled,
  ...props 
}: ButtonProps) {
  const primaryBg = useThemeColor({}, 'primary');
  const primaryText = '#0F0F0F'; // Always dark on neon green
  const secondaryBg = useThemeColor({}, 'surface');
  const secondaryText = useThemeColor({}, 'text');
  const dangerBg = useThemeColor({}, 'danger');
  const dangerText = '#FFFFFF';

  let backgroundColor = primaryBg;
  let textColor = primaryText;

  if (variant === 'secondary') {
    backgroundColor = secondaryBg;
    textColor = secondaryText;
  } else if (variant === 'danger') {
    backgroundColor = dangerBg;
    textColor = dangerText;
  } else if (variant === 'ghost') {
    backgroundColor = 'transparent';
    textColor = primaryBg;
  }

  const opacity = disabled || isLoading ? 0.5 : 1;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.button,
        { backgroundColor, opacity },
        style
      ]}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <ThemedText style={{ color: textColor }} type="body" weight="bold">
          {title}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    flexDirection: 'row',
  }
});
