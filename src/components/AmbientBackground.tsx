import React, { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat,
  withSequence,
  Easing,
  interpolateColor
} from 'react-native-reanimated';
import { useActiveTheme } from '../hooks/useThemeColor';

const { width, height } = Dimensions.get('window');

export function AmbientBackground() {
  const activeTheme = useActiveTheme();
  const timeProgress = useSharedValue(0);

  useEffect(() => {
    // Get current hour (0-23)
    const currentHour = new Date().getHours();
    
    // Map hour to a 0-1 range where:
    // Morning (6am) = 0.25
    // Noon (12pm) = 0.5
    // Sunset (6pm) = 0.75
    // Midnight (12am) = 1.0 or 0
    let initialProgress = currentHour / 24;
    timeProgress.value = initialProgress;

    // Simulate time passing (slowly shift background)
    timeProgress.value = withRepeat(
      withTiming(initialProgress + 1, { duration: 60000 * 5, easing: Easing.linear }), // shifts over 5 mins for demo
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    // Modulo 1 to keep it in 0-1 range
    const t = timeProgress.value % 1;

    let color1, color2;
    
    if (activeTheme === 'dark') {
      // Dark mode palette
      color1 = interpolateColor(
        t,
        [0, 0.25, 0.5, 0.75, 1],
        ['#0a0a1a', '#051b2c', '#00261c', '#2c1205', '#0a0a1a']
      );
      color2 = interpolateColor(
        t,
        [0, 0.25, 0.5, 0.75, 1],
        ['#1a0b2e', '#0a2e3f', '#00402e', '#4a1500', '#1a0b2e']
      );
    } else {
      // Light mode palette
      color1 = interpolateColor(
        t,
        [0, 0.25, 0.5, 0.75, 1],
        ['#f0f4ff', '#e0f7fa', '#e8f5e9', '#fff3e0', '#f0f4ff']
      );
      color2 = interpolateColor(
        t,
        [0, 0.25, 0.5, 0.75, 1],
        ['#e0e7ff', '#b2ebf2', '#c8e6c9', '#ffe0b2', '#e0e7ff']
      );
    }

    return {
      backgroundColor: color1,
      // We can't interpolate gradients natively without Skia, so we'll simulate an ambient glow using two large blurred circles or just a solid shifting background
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    const t = timeProgress.value % 1;
    const glowColor = interpolateColor(
      t,
      [0, 0.25, 0.5, 0.75, 1],
      ['rgba(138, 43, 226, 0.1)', 'rgba(0, 191, 255, 0.1)', 'rgba(0, 255, 163, 0.1)', 'rgba(255, 107, 0, 0.1)', 'rgba(138, 43, 226, 0.1)']
    );
    return {
      backgroundColor: glowColor,
      transform: [
        { scale: 1 + Math.sin(t * Math.PI * 2) * 0.2 },
        { translateX: Math.cos(t * Math.PI * 2) * 50 },
      ]
    };
  });

  return (
    <Animated.View style={[StyleSheet.absoluteFill, animatedStyle, { zIndex: -1 }]}>
      <Animated.View style={[styles.glow, glowStyle]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
    top: -height * 0.2,
    right: -width * 0.2,
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width,
    opacity: 0.8,
    // Web needs filter: blur
  }
});
