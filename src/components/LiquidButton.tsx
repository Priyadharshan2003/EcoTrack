import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, TouchableOpacityProps, ViewStyle, Platform } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import { useThemeColor } from '../hooks/useThemeColor';

interface LiquidButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function LiquidButton({ children, style, ...props }: LiquidButtonProps) {
  const primaryColor = useThemeColor({}, 'primary');
  
  // 4 corners of the border radius
  const tl = useSharedValue(24);
  const tr = useSharedValue(24);
  const bl = useSharedValue(24);
  const br = useSharedValue(24);

  useEffect(() => {
    // Morphing border radii to create a liquid effect
    const duration = 2000;
    
    tl.value = withRepeat(
      withSequence(
        withTiming(16, { duration, easing: Easing.inOut(Easing.ease) }),
        withTiming(32, { duration, easing: Easing.inOut(Easing.ease) }),
        withTiming(24, { duration, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    
    tr.value = withRepeat(
      withSequence(
        withTiming(32, { duration: duration * 1.2, easing: Easing.inOut(Easing.ease) }),
        withTiming(16, { duration: duration * 1.2, easing: Easing.inOut(Easing.ease) }),
        withTiming(24, { duration: duration * 1.2, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    
    bl.value = withRepeat(
      withSequence(
        withTiming(30, { duration: duration * 0.8, easing: Easing.inOut(Easing.ease) }),
        withTiming(14, { duration: duration * 0.8, easing: Easing.inOut(Easing.ease) }),
        withTiming(24, { duration: duration * 0.8, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    br.value = withRepeat(
      withSequence(
        withTiming(12, { duration: duration * 1.5, easing: Easing.inOut(Easing.ease) }),
        withTiming(28, { duration: duration * 1.5, easing: Easing.inOut(Easing.ease) }),
        withTiming(24, { duration: duration * 1.5, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    borderTopLeftRadius: tl.value,
    borderTopRightRadius: tr.value,
    borderBottomLeftRadius: bl.value,
    borderBottomRightRadius: br.value,
  }));

  return (
    <TouchableOpacity activeOpacity={0.8} {...props}>
      <Animated.View style={[
        styles.liquidContainer, 
        { 
          backgroundColor: primaryColor, 
          ...Platform.select({
            web: { boxShadow: `0px 4px 8px ${primaryColor}4D` } as any,
            default: { shadowColor: primaryColor }
          })
        }, 
        animatedStyle,
        style
      ]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  liquidContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      default: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
      }
    })
  }
});
