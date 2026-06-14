import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedView } from '../components/themed-view';
import { ThemedText } from '../components/themed-text';
import { useStore } from '../store';
import { Spacing, Radius } from '../constants/theme';
import { useThemeColor } from '../hooks/useThemeColor';
import { ChevronLeft, TreePine, Sprout, Wind } from 'lucide-react-native';
import Animated, { 
  FadeInUp, 
  ZoomIn, 
  Layout, 
  withSpring, 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  useAnimatedRef,
  useScrollViewOffset,
  Easing,
  interpolate,
  Extrapolation,
  runOnJS
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TREE_SIZE = 40;

// Deterministic position generator based on index to distribute trees in layers
const generateTreePosition = (index: number, total: number) => {
  const layer = index % 3; // 0: background, 1: midground, 2: foreground
  
  // Seed-based pseudo-random generator
  const pseudoRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const left = 5 + pseudoRandom(index * 17) * 80; // 5% to 85% width

  let top = 0;
  let scale = 1;
  let zIndex = 1;
  let opacity = 1;

  if (layer === 0) {
    top = 5 + pseudoRandom(index * 23) * 25; // 5% to 30% height
    scale = 0.5 + pseudoRandom(index * 13) * 0.15; // 0.5 - 0.65
    zIndex = 10;
    opacity = 0.55;
  } else if (layer === 1) {
    top = 35 + pseudoRandom(index * 23) * 25; // 35% to 60% height
    scale = 0.8 + pseudoRandom(index * 13) * 0.15; // 0.8 - 0.95
    zIndex = 20;
    opacity = 0.8;
  } else {
    top = 65 + pseudoRandom(index * 23) * 25; // 65% to 90% height
    scale = 1.1 + pseudoRandom(index * 13) * 0.2; // 1.1 - 1.3
    zIndex = 30;
    opacity = 1.0;
  }

  return { left: `${left}%`, top: `${top}%`, scale, zIndex, opacity };
};

// Falling leaf particle component
const LeafParticle = ({ index }: { index: number }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    const duration = 5000 + Math.random() * 4000;
    const delay = index * 1000;
    
    // Stagger start
    const timeout = setTimeout(() => {
      progress.value = withRepeat(
        withTiming(1, { duration, easing: Easing.linear }),
        -1,
        false
      );
    }, delay);
    
    return () => clearTimeout(timeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = 30 + Math.sin(progress.value * Math.PI * 2) * 20 + (progress.value * 50);
    const translateY = progress.value * 400;
    const rotate = `${progress.value * 360}deg`;
    const opacity = interpolate(
      progress.value,
      [0, 0.15, 0.85, 1],
      [0, 0.4, 0.4, 0],
      Extrapolation.CLAMP
    );

    return {
      position: 'absolute',
      left: `${(index * 25) % 85}%`,
      top: -20,
      transform: [
        { translateX },
        { translateY },
        { rotate }
      ],
      opacity
    };
  });

  return (
    <Animated.View style={animatedStyle} pointerEvents="none">
      <Sprout size={10} color="#00C864" />
    </Animated.View>
  );
};

// Animated swaying tree component
const AnimatedTree = ({ index, type, pos }: { index: number; type: 'sprout' | 'pine'; pos: any }) => {
  const primaryColor = useThemeColor({}, 'primary');
  const sway = useSharedValue(0);

  useEffect(() => {
    // Sway animation with staggered delay
    const delay = index * 200;
    const timeout = setTimeout(() => {
      sway.value = withRepeat(
        withSequence(
          withTiming(-4, { duration: 1800 + (index % 4) * 300, easing: Easing.inOut(Easing.ease) }),
          withTiming(4, { duration: 1800 + (index % 4) * 300, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }, delay);

    return () => clearTimeout(timeout);
  }, []);

  const swayStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: pos.scale },
      { rotate: `${sway.value}deg` }
    ],
    opacity: pos.opacity,
    left: pos.left,
    top: pos.top,
    zIndex: pos.zIndex,
  }));

  return (
    <Animated.View 
      entering={ZoomIn.delay(index * 40).springify().damping(12)}
      layout={Layout.springify()}
      style={[styles.treeCell, swayStyle]}
    >
      <View style={[styles.glowBox, { shadowColor: type === 'pine' ? primaryColor : '#00C864' }]}>
        {type === 'pine' ? (
          <TreePine size={24} color={primaryColor} />
        ) : (
          <Sprout size={24} color="#00C864" />
        )}
      </View>
    </Animated.View>
  );
};

export default function ForestScreen() {
  const insets = useSafeAreaInsets();
  const primaryColor = useThemeColor({}, 'primary');
  
  const totalOffset = useStore((state) => state.totalOffset);
  
  // 1 tree per 10kg offset
  const treeCount = Math.floor(totalOffset / 10);
  const trees = Array.from({ length: treeCount }).map((_, i) => ({
    id: `tree-${i}`,
    type: (i % 3 === 0 ? 'sprout' : 'pine') as 'sprout' | 'pine'
  }));

  const containerHeight = Math.max(400, 300 + Math.ceil(treeCount / 4) * 50);

  // Parallax Scroll Tracking
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  // Live Carbon Absorption counter (pulsing Milligrams in real time)
  const [liveAbsorbed, setLiveAbsorbed] = useState(0);
  const absorptionRate = treeCount * 0.000697; // g/sec (pine tree average)

  useEffect(() => {
    if (absorptionRate === 0) return;
    const interval = setInterval(() => {
      setLiveAbsorbed((prev) => prev + (absorptionRate * 0.1));
    }, 100);
    return () => clearInterval(interval);
  }, [absorptionRate]);

  // Swaying wind speed shared value
  const windValue = useSharedValue(0);
  useEffect(() => {
    windValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4000 }),
        withTiming(0, { duration: 4000 })
      ),
      -1,
      true
    );
  }, []);

  const bgStyle = useAnimatedStyle(() => ({
    opacity: 0.08 + (windValue.value * 0.07)
  }));

  // Parallax Layer translation styles
  const backgroundLayerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scrollOffset.value * 0.45 }]
  }));

  const midgroundLayerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scrollOffset.value * 0.25 }]
  }));

  // Separate trees into background, midground, and foreground lists
  const backgroundTrees: any[] = [];
  const midgroundTrees: any[] = [];
  const foregroundTrees: any[] = [];

  trees.forEach((tree, i) => {
    const pos = generateTreePosition(i, treeCount);
    const treeWithPos = { ...tree, pos };
    if (i % 3 === 0) {
      backgroundTrees.push(treeWithPos);
    } else if (i % 3 === 1) {
      midgroundTrees.push(treeWithPos);
    } else {
      foregroundTrees.push(treeWithPos);
    }
  });

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Background Ambience */}
      <Animated.View style={[StyleSheet.absoluteFill, bgStyle]}>
        <LinearGradient 
          colors={['transparent', 'rgba(0,255,163,0.15)']} 
          style={StyleSheet.absoluteFill} 
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <ThemedText type="default" weight="bold">The Impact Forest</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <Animated.ScrollView 
        ref={scrollRef} 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {/* Stats Card */}
        <Animated.View entering={FadeInUp.duration(600).springify()}>
          <LinearGradient
            colors={['#161616', '#0d0d0d'] as const}
            style={styles.statsCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.statsRow}>
              <View>
                <ThemedText type="small" colorName="textSecondary">Total Offset</ThemedText>
                <ThemedText type="large" weight="bold" style={{ color: primaryColor }}>{totalOffset.toFixed(1)} kg</ThemedText>
              </View>
              <View style={styles.divider} />
              <View>
                <ThemedText type="small" colorName="textSecondary">Trees Planted</ThemedText>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TreePine size={20} color="#FFF" />
                  <ThemedText type="large" weight="bold" style={{ marginLeft: 6 }}>{treeCount}</ThemedText>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Live Counter (Pulsing milligram ticks) */}
        {treeCount > 0 && (
          <Animated.View entering={ZoomIn.delay(200)} style={styles.counterBox}>
            <Wind size={16} color={primaryColor} />
            <ThemedText type="small" style={{ color: '#888', marginLeft: 8 }}>
              Active Absorption: 
              <ThemedText type="small" weight="bold" style={{ color: primaryColor }}>
                {` ${liveAbsorbed.toFixed(5)}g `}
              </ThemedText>
              CO₂ offset during session
            </ThemedText>
          </Animated.View>
        )}

        {/* Forest Parallax Container */}
        <View style={[styles.forestContainer, { height: containerHeight }]}>
          {trees.length === 0 ? (
            <View style={styles.emptyState}>
              <Wind size={48} color="#333" />
              <ThemedText type="default" colorName="textSecondary" style={{ marginTop: Spacing.md, textAlign: 'center' }}>
                Your forest is empty. Purchase offsets in the Eco Market to plant your first tree!
              </ThemedText>
            </View>
          ) : (
            <>
              {/* Falling leaf particles */}
              {Array.from({ length: Math.min(10, Math.ceil(treeCount / 2)) }).map((_, i) => (
                <LeafParticle key={`leaf-${i}`} index={i} />
              ))}

              {/* Background Layer (Scrolls Slower) */}
              <Animated.View style={[StyleSheet.absoluteFill, backgroundLayerStyle]}>
                {backgroundTrees.map((tree) => (
                  <AnimatedTree key={tree.id} index={parseInt(tree.id.split('-')[1])} type={tree.type} pos={tree.pos} />
                ))}
              </Animated.View>

              {/* Midground Layer (Scrolls Med-Slower) */}
              <Animated.View style={[StyleSheet.absoluteFill, midgroundLayerStyle]}>
                {midgroundTrees.map((tree) => (
                  <AnimatedTree key={tree.id} index={parseInt(tree.id.split('-')[1])} type={tree.type} pos={tree.pos} />
                ))}
              </Animated.View>

              {/* Foreground Layer (Scrolls Normally) */}
              <View style={StyleSheet.absoluteFill}>
                {foregroundTrees.map((tree) => (
                  <AnimatedTree key={tree.id} index={parseInt(tree.id.split('-')[1])} type={tree.type} pos={tree.pos} />
                ))}
              </View>
            </>
          )}
        </View>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 130, // Clearance for CustomTabBar
  },
  statsCard: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#242424',
    marginBottom: Spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#242424',
  },
  counterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: '#242424',
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
  },
  forestContainer: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  treeCell: {
    position: 'absolute',
    width: TREE_SIZE,
    height: TREE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 255, 163, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: '0px 0px 20px rgba(0, 255, 163, 0.6)' } as any,
      default: {
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 15,
        elevation: 3,
      }
    })
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    marginTop: Spacing.xxl,
  }
});
