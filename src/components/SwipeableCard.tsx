import React from 'react';
import { StyleSheet, Dimensions, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Card } from './Card';
import { useThemeColor } from '../hooks/useThemeColor';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const MAX_ROTATION = 14;
const STACK_OFFSET_Y = 18;
const STACK_SCALE_DIFF = 0.05;

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  index?: number;
}

export const SwipeableCard = React.memo(function SwipeableCard({
  children,
  onSwipeRight,
  onSwipeLeft,
  index = 0,
}: SwipeableCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(index * STACK_OFFSET_Y);
  const scale = useSharedValue(1 - index * STACK_SCALE_DIFF);
  const isActive = useSharedValue(false);

  const primaryColor = useThemeColor({}, 'primary');
  const dangerColor = useThemeColor({}, 'danger');

  /**
   * Gesture
   */
  const pan = Gesture.Pan()
    .onStart(() => {
      isActive.value = true;

      // subtle lift on touch
      scale.value = withSpring(
        1 - index * STACK_SCALE_DIFF + 0.03,
        { damping: 20 }
      );
    })
    .onUpdate((e) => {
      translateX.value = e.translationX;

      // subtle vertical resist + parallax feel
      translateY.value =
        index * STACK_OFFSET_Y + e.translationY * 0.12;
    })
    .onEnd((e) => {
      isActive.value = false;

      const velocityX = e.velocityX;

      const shouldSwipeRight =
        translateX.value > SWIPE_THRESHOLD || velocityX > 900;

      const shouldSwipeLeft =
        translateX.value < -SWIPE_THRESHOLD || velocityX < -900;

      if (shouldSwipeRight) {
        translateX.value = withSpring(
          SCREEN_WIDTH * 1.5,
          {
            velocity: velocityX,
            damping: 18,
          }
        );
        runOnJS(onSwipeRight)();
        return;
      }

      if (shouldSwipeLeft) {
        translateX.value = withSpring(
          -SCREEN_WIDTH * 1.5,
          {
            velocity: velocityX,
            damping: 18,
          }
        );
        runOnJS(onSwipeLeft)();
        return;
      }

      // snap back
      translateX.value = withSpring(0, {
        damping: 20,
        stiffness: 180,
      });

      translateY.value = withSpring(
        index * STACK_OFFSET_Y,
        {
          damping: 20,
        }
      );

      scale.value = withSpring(
        1 - index * STACK_SCALE_DIFF,
        {
          damping: 20,
        }
      );
    });

  /**
   * Card animation
   */
  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      [-MAX_ROTATION, 0, MAX_ROTATION],
      Extrapolation.CLAMP
    );

    const dynamicScale = interpolate(
      Math.abs(translateX.value),
      [0, SCREEN_WIDTH],
      [scale.value, scale.value - 0.05],
      Extrapolation.CLAMP
    );

    return {
      zIndex: 100 - index,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
        { scale: dynamicScale },
      ],
    };
  });

  /**
   * Glow overlays (CRED style)
   */
  const overlayRight = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 0.8],
      Extrapolation.CLAMP
    ),
  }));

  const overlayLeft = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, -SWIPE_THRESHOLD],
      [0, 0.8],
      Extrapolation.CLAMP
    ),
  }));

  /**
   * Labels
   */
  const rightLabel = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD * 0.4],
      [0, 1],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        scale: interpolate(
          translateX.value,
          [0, SWIPE_THRESHOLD],
          [0.6, 1],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  const leftLabel = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, -SWIPE_THRESHOLD * 0.4],
      [0, 1],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        scale: interpolate(
          translateX.value,
          [0, -SWIPE_THRESHOLD],
          [0.6, 1],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View 
        style={[styles.container, cardStyle]}
        accessible={true}
        accessibilityRole="adjustable"
        accessibilityLabel="Swipeable activity card. Swipe right to confirm, swipe left to reject"
        accessibilityActions={[{name: 'swipeRight', label: 'Confirm'}, {name: 'swipeLeft', label: 'Reject'}]}
        onAccessibilityAction={(event) => {
          if (event.nativeEvent.actionName === 'swipeRight') onSwipeRight();
          if (event.nativeEvent.actionName === 'swipeLeft') onSwipeLeft();
        }}
      >
        <Card variant="elevated" style={styles.card}>
          {children}

          {/* RIGHT GLOW */}
          <Animated.View
            style={[
              styles.glow,
              styles.rightGlow,
              overlayRight,
              { backgroundColor: primaryColor },
            ]}
            pointerEvents="none"
          />

          {/* LEFT GLOW */}
          <Animated.View
            style={[
              styles.glow,
              styles.leftGlow,
              overlayLeft,
              { backgroundColor: dangerColor },
            ]}
            pointerEvents="none"
          />

          {/* LABELS */}
          <Animated.View
            style={[styles.label, styles.rightLabel, rightLabel]}
          >
            <Animated.Text style={styles.labelTextGreen}>
              CONFIRM
            </Animated.Text>
          </Animated.View>

          <Animated.View
            style={[styles.label, styles.leftLabel, leftLabel]}
          >
            <Animated.Text style={styles.labelTextRed}>
              REJECT
            </Animated.Text>
          </Animated.View>
        </Card>
      </Animated.View>
    </GestureDetector>
  );
});

/**
 * Styles (CRED inspired)
 */
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
  },

  card: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 22,
    backgroundColor: '#111',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.08)',

    // iOS shadow (CRED feel)
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.35,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 12 },
      },
      android: {
        elevation: 8,
      },
    }),
  },

  glow: {
    ...StyleSheet.absoluteFill,
    opacity: 0,
  },

  rightGlow: {
    borderRadius: 22,
  },

  leftGlow: {
    borderRadius: 22,
  },

  label: {
    position: 'absolute',
    top: 30,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 2,
  },

  rightLabel: {
    left: 20,
    borderColor: '#3BE8B0',
    transform: [{ rotate: '-10deg' }],
  },

  leftLabel: {
    right: 20,
    borderColor: '#FF453A',
    transform: [{ rotate: '10deg' }],
  },

  labelTextGreen: {
    color: '#3BE8B0',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  labelTextRed: {
    color: '#FF453A',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
});