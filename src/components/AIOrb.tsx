import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing,
  withDelay
} from 'react-native-reanimated';
import { useThemeColor } from '../hooks/useThemeColor';

export function AIOrb({ size = 48 }: { size?: number }) {
  const primaryColor = useThemeColor({}, 'primary');
  
  // Create shared values for 3 distinct orbs
  const scale1 = useSharedValue(0.8);
  const scale2 = useSharedValue(0.8);
  const scale3 = useSharedValue(0.8);
  
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Orb 1 breathing
    scale1.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.8, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // infinite
      true // reverse
    );

    // Orb 2 breathing (delayed)
    scale2.value = withDelay(
      600,
      withRepeat(
        withSequence(
          withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.7, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );

    // Orb 3 breathing (delayed)
    scale3.value = withDelay(
      1200,
      withRepeat(
        withSequence(
          withTiming(1.3, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.9, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );

    // Global rotation
    rotation.value = withRepeat(
      withTiming(360, { duration: 8000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const style1 = useAnimatedStyle(() => ({
    transform: [{ scale: scale1.value }, { translateX: -size * 0.1 }],
    opacity: 0.6,
  }));
  
  const style2 = useAnimatedStyle(() => ({
    transform: [{ scale: scale2.value }, { translateX: size * 0.1 }, { translateY: -size * 0.1 }],
    opacity: 0.5,
  }));

  const style3 = useAnimatedStyle(() => ({
    transform: [{ scale: scale3.value }, { translateY: size * 0.1 }],
    opacity: 0.4,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const orbStyle = {
    position: 'absolute' as const,
    width: size * 0.7,
    height: size * 0.7,
    borderRadius: size,
    backgroundColor: primaryColor,
  };

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <Animated.View style={[styles.container, containerStyle]}>
        {/* Web compat: we don't use expo-blur here because simple opacity blending is cheaper and works perfectly for solid colors */}
        <Animated.View style={[orbStyle, style1, { backgroundColor: '#00F0FF' }]} />
        <Animated.View style={[orbStyle, style2, { backgroundColor: primaryColor }]} />
        <Animated.View style={[orbStyle, style3, { backgroundColor: '#FF00A0' }]} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
