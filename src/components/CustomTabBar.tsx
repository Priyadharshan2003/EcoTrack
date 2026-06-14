import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useThemeColor } from '../hooks/useThemeColor';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_BAR_WIDTH = SCREEN_WIDTH * 0.85;
const TAB_WIDTH = TAB_BAR_WIDTH / 4; // 4 tabs

export function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const primaryColor = useThemeColor({}, 'primary');
  const inactiveColor = useThemeColor({}, 'textSecondary');
  
  const indicatorPosition = useSharedValue(0);

  useEffect(() => {
    indicatorPosition.value = withSpring(state.index * TAB_WIDTH, {
      damping: 18,
      stiffness: 150,
      mass: 0.8,
    });
  }, [state.index]);

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorPosition.value }],
    };
  });

  return (
    <Animated.View style={[styles.container, { bottom: Math.max(30, insets.bottom + 10) }]}>
      <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
        <Animated.View style={[styles.indicator, animatedIndicatorStyle, { backgroundColor: `${primaryColor}25` }]} />
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tabButton}
            >
              <AnimatedTabIcon 
                icon={options.tabBarIcon} 
                isFocused={isFocused} 
                primaryColor={primaryColor} 
                inactiveColor={inactiveColor} 
              />
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </Animated.View>
  );
}

// Separate component for individual icon bounce animations
function AnimatedTabIcon({ icon, isFocused, primaryColor, inactiveColor }: any) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isFocused) {
      scale.value = withSpring(1.2, { damping: 10, stiffness: 200 });
    } else {
      scale.value = withSpring(1, { damping: 10, stiffness: 200 });
    }
  }, [isFocused]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={style}>
      {icon && icon({ 
        focused: isFocused, 
        color: isFocused ? primaryColor : inactiveColor, 
        size: 24 
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: '0px 10px 20px rgba(0,0,0,0.5)' } as any,
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 20,
      }
    })
  },
  blurContainer: {
    flexDirection: 'row',
    width: TAB_BAR_WIDTH,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(20,20,20,0.5)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  indicator: {
    position: 'absolute',
    width: TAB_WIDTH,
    height: 64,
    borderRadius: 32,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 64,
  }
});
