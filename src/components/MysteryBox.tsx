import React, { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  interpolate,
  interpolateColor,
  Easing,
  runOnJS
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Package, Award } from 'lucide-react-native';
import { useThemeColor } from '../hooks/useThemeColor';

export function MysteryBox({
  onUnlock,
  iconColor
}: {
  onUnlock: () => void;
  iconColor: string;
}) {
  const [isOpened, setIsOpened] = useState(false);

  const taps = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const glow = useSharedValue(0);
  const opacity = useSharedValue(1);
  const badgeScale = useSharedValue(0.6);

  const primaryColor = useThemeColor({}, 'primary');

  const handleTap = () => {
    if (isOpened) return;

    taps.value += 1;

    // 🔥 Subtle iOS-like haptic
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // ✨ Premium micro interaction
    scale.value = withSequence(
      withTiming(0.92, { duration: 100, easing: Easing.out(Easing.exp) }),
      withSpring(1, { damping: 12, stiffness: 200 })
    );

    // 🌀 Minimal rotation (clean)
    rotation.value = withSequence(
      withTiming(-3, { duration: 80 }),
      withTiming(3, { duration: 80 }),
      withTiming(0, { duration: 80 })
    );

    // 💡 Glow increases progressively
    glow.value = withTiming(taps.value / 5, { duration: 200 });

    // 🎁 Unlock trigger
    if (taps.value >= 5) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // ✨ Smooth explode out
      scale.value = withSequence(
        withTiming(1.2, { duration: 200, easing: Easing.out(Easing.cubic) }),
        withTiming(0.9, { duration: 120 }),
        withSpring(1)
      );

      opacity.value = withTiming(0, { duration: 200 });

      setTimeout(() => {
        setIsOpened(true);

        // 🎖 Badge reveal animation
        badgeScale.value = withSpring(1, {
          damping: 10,
          stiffness: 120
        });

        runOnJS(onUnlock)();
      }, 220);
    }
  };

  const boxStyle = useAnimatedStyle(() => {
    const glowIntensity = glow.value;

    return {
      opacity: opacity.value,
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
      ],
      shadowOpacity: interpolate(glowIntensity, [0, 1], [0.2, 0.6]),
      shadowRadius: interpolate(glowIntensity, [0, 1], [8, 20]),
    };
  });

  const badgeStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: badgeScale.value }],
      opacity: badgeScale.value
    };
  });

  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <Animated.View style={styles.container}>
        {!isOpened ? (
          <Animated.View
            style={[
              styles.box,
              { backgroundColor: primaryColor },
              boxStyle
            ]}
          >
            <Package color="#fff" size={28} />
          </Animated.View>
        ) : (
          <Animated.View
            style={[
              styles.badge,
              {
                backgroundColor: `${iconColor}15`,
                borderColor: `${iconColor}80`
              },
              badgeStyle
            ]}
          >
            <Award color={iconColor} size={30} />
          </Animated.View>
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  box: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0px 6px 20px rgba(0,0,0,0.25)'
      } as any,
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 10,
      }
    })
  },
  badge: {
    width: '100%',
    height: '100%',
    borderRadius: 36,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  }
});