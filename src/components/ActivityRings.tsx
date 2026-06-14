import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import Animated, { 
  useSharedValue, 
  useAnimatedProps, 
  withTiming, 
  withDelay, 
  Easing 
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface RingData {
  progress: number; // 0 to 1
  color: string;
}

interface ActivityRingsProps {
  rings: RingData[];
  size?: number;
  strokeWidth?: number;
  spacing?: number;
}

export const ActivityRings = React.memo(function ActivityRings({ 
  rings, 
  size = 120, 
  strokeWidth = 12, 
  spacing = 2 
}: ActivityRingsProps) {
  
  const center = size / 2;
  
  return (
    <View 
      style={{ width: size, height: size }}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityLabel={`Activity Rings with ${rings.length} metrics.`}
    >
      <Svg
        width={size}
        height={size}
        style={{ transform: [{ rotate: '-90deg' }] }}
      >
        {rings.map((ring, index) => {
          const radius = (size / 2) - (strokeWidth / 2) - (index * (strokeWidth + spacing));
          return (
            <Ring
              key={index}
              index={index}
              radius={radius}
              center={center}
              strokeWidth={strokeWidth}
              color={ring.color}
              progress={ring.progress}
            />
          );
        })}
      </Svg>
    </View>
  );
});

interface RingProps {
  index: number;
  radius: number;
  center: number;
  strokeWidth: number;
  color: string;
  progress: number;
}

function Ring({ index, radius, center, strokeWidth, color, progress }: RingProps) {
  const circumference = 2 * Math.PI * radius;
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    // Delay each inner ring slightly for a cascading animation effect
    animatedProgress.value = withDelay(
      index * 300, 
      withTiming(progress, {
        duration: 1500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );
  }, [progress, index]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference - (animatedProgress.value * circumference);
    return {
      strokeDashoffset,
    };
  });

  return (
    <G>
      {/* Background Track */}
      <Circle
        cx={center}
        cy={center}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeOpacity={0.2}
        fill="none"
      />
      {/* Foreground Animated Ring */}
      <AnimatedCircle
        cx={center}
        cy={center}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        animatedProps={animatedProps}
      />
    </G>
  );
}
