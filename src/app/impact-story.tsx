import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, Image, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../components/themed-text';
import { Spacing, Radius } from '../constants/theme';
import { useThemeColor } from '../hooks/useThemeColor';
import { useStore } from '../store';
import { router } from 'expo-router';
import { X, Share2, Globe, TreePine, AlertTriangle, TrendingUp } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeInUp, FadeIn, FadeOut, useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { HABITATS, convertCreditsToArea } from '../constants/habitats';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SLIDE_DURATION = 6000; // 6 seconds per slide

export default function ImpactStoryScreen() {
  const insets = useSafeAreaInsets();
  const ecoScore = useStore((state) => state.ecoScore);
  const totalOffset = useStore((state) => state.totalOffset);
  const streakDays = useStore((state) => state.streakDays);
  const impactCredits = useStore((state) => state.impactCredits);
  const selectedHabitatId = useStore((state) => state.selectedHabitat);

  const activeHabitat = HABITATS[selectedHabitatId] || HABITATS['mangrove'];
  const projectedArea = convertCreditsToArea(impactCredits, activeHabitat.id);

  const primaryColor = useThemeColor({}, 'primary');
  const dangerColor = useThemeColor({}, 'danger');
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const progress = useSharedValue(0);
  const scaleAnim = useSharedValue(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startSlide = (index: number) => {
    progress.value = 0;
    scaleAnim.value = 1;
    
    // Progress bar animation
    progress.value = withTiming(1, { duration: SLIDE_DURATION, easing: Easing.linear });
    
    // Cinematic Ken Burns slow zoom (video playback feel)
    scaleAnim.value = withTiming(1.15, { duration: SLIDE_DURATION, easing: Easing.out(Easing.quad) });

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (index < 3) {
        setCurrentSlide(index + 1);
        startSlide(index + 1);
      } else {
        router.back();
      }
    }, SLIDE_DURATION);
  };

  useEffect(() => {
    startSlide(0);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleNext = () => {
    if (currentSlide < 3) {
      const next = currentSlide + 1;
      setCurrentSlide(next);
      startSlide(next);
    } else {
      router.back();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      const prev = currentSlide - 1;
      setCurrentSlide(prev);
      startSlide(prev);
    }
  };

  const handleScreenPress = (event: any) => {
    const x = event.nativeEvent.locationX;
    if (x < SCREEN_WIDTH * 0.3) {
      handlePrev();
    } else {
      handleNext();
    }
  };

  const getProgressStyle = (index: number) => {
    return useAnimatedStyle(() => {
      if (index < currentSlide) return { width: '100%' };
      if (index > currentSlide) return { width: '0%' };
      return { width: `${progress.value * 100}%` };
    });
  };

  const cinematicStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }]
  }));

  return (
    <View style={styles.container}>
      {/* Background Media */}
      {currentSlide === 0 && (
        <LinearGradient colors={['#1A2A6C', '#112D4E', '#0B162C']} style={StyleSheet.absoluteFill} />
      )}
      {currentSlide === 1 && (
        <Animated.Image 
          source={require('../../assets/images/inflation.png')} 
          style={[StyleSheet.absoluteFill, styles.bgImage, cinematicStyle]} 
        />
      )}
      {currentSlide === 2 && (
        <Animated.Image 
          source={require('../../assets/images/polar_bear.png')} 
          style={[StyleSheet.absoluteFill, styles.bgImage, cinematicStyle]} 
        />
      )}
      {currentSlide === 3 && (
        <LinearGradient colors={['#0F2027', '#203A43', '#2C5364']} style={StyleSheet.absoluteFill} />
      )}

      {/* Dark overlay for readability */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)' }]} />
      {currentSlide > 0 && (
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']} style={StyleSheet.absoluteFill} />
      )}

      <View style={[styles.safeArea, { paddingTop: Platform.OS === 'ios' ? 50 : 20, paddingBottom: insets.bottom }]}>
        
        {/* Story Progress Indicators */}
        <View style={styles.storyIndicators}>
          {[0, 1, 2, 3].map((idx) => (
            <View key={idx} style={styles.indicatorBg}>
              <Animated.View style={[styles.indicatorFill, { backgroundColor: '#FFF' }, getProgressStyle(idx)]} />
            </View>
          ))}
        </View>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <X size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Share2 size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Pressable area for navigation */}
        <Pressable onPress={handleScreenPress} style={styles.contentArea}>
          
          {/* SLIDE 1: Personal Stats */}
          {currentSlide === 0 && (
            <Animated.View entering={FadeInUp.springify()} exiting={FadeOut} style={styles.slideContent}>
              <View style={styles.storyCard}>
                <ThemedText type="title" style={styles.title}>Your Eco Impact</ThemedText>
                <ThemedText type="large" colorName="textSecondary" style={styles.subtitle}>This Week</ThemedText>
                
                <View style={styles.statsGrid}>
                  <View style={styles.statBox}>
                    <Globe size={32} color={primaryColor} />
                    <ThemedText type="huge" style={[styles.statNumber, { color: primaryColor }]}>{Math.round(ecoScore)}</ThemedText>
                    <ThemedText type="small" colorName="textSecondary">EcoScore</ThemedText>
                  </View>
                  <View style={styles.statBox}>
                    <TreePine size={32} color="#00C864" />
                    <ThemedText type="huge" style={[styles.statNumber, { color: '#00C864' }]}>{totalOffset}</ThemedText>
                    <ThemedText type="small" colorName="textSecondary">kg CO₂ Saved</ThemedText>
                  </View>
                </View>

                <View style={[styles.streakBox, { backgroundColor: 'rgba(255, 107, 0, 0.1)' }]}>
                  <ThemedText type="large" weight="bold" style={{ color: '#FF6B00' }}>🔥 {streakDays} Day Green Streak</ThemedText>
                </View>
              </View>
            </Animated.View>
          )}

          {/* SLIDE 2: Economic Reality */}
          {currentSlide === 1 && (
            <Animated.View entering={FadeInUp.delay(200)} exiting={FadeOut} style={[styles.slideContent, { justifyContent: 'flex-end', paddingBottom: Spacing.xxl }]}>
              <View style={styles.iconCircleWarning}>
                <TrendingUp size={32} color={dangerColor} />
              </View>
              <ThemedText type="title" weight="bold" style={styles.dramaticTitle}>
                The Hidden Tax
              </ThemedText>
              <ThemedText type="large" style={styles.dramaticText}>
                Your emissions this week contributed to an estimated <ThemedText type="large" weight="bold" style={{ color: dangerColor }}>$0.15 rise</ThemedText> in global climate-driven logistics costs.
              </ThemedText>
              <View style={styles.insightBox}>
                <AlertTriangle size={20} color="#FFD700" style={{ marginRight: Spacing.sm }} />
                <ThemedText type="small" style={{ flex: 1, color: '#DDD' }}>
                  Over 5 years, unchecked footprints cause a 15% inflation in everyday grocery prices. You pay for your emissions at the checkout counter.
                </ThemedText>
              </View>
            </Animated.View>
          )}

          {/* SLIDE 3: Animal Suffering */}
          {currentSlide === 2 && (
            <Animated.View entering={FadeInUp.delay(200)} exiting={FadeOut} style={[styles.slideContent, { justifyContent: 'flex-end', paddingBottom: Spacing.xxl }]}>
              <ThemedText type="title" weight="bold" style={styles.dramaticTitle}>
                A Shrinking World
              </ThemedText>
              <ThemedText type="large" style={styles.dramaticText}>
                The excess CO₂ you emitted this week is equivalent to melting <ThemedText type="large" weight="bold" style={{ color: '#00F0FF' }}>1.2 sq meters</ThemedText> of Arctic sea ice.
              </ThemedText>
              <ThemedText type="default" style={[styles.dramaticText, { color: '#AAA', marginTop: Spacing.md }]}>
                This directly displaces endangered Polar Bears and destroys natural breeding grounds forever. Every choice carries weight.
              </ThemedText>
            </Animated.View>
          )}

          {/* SLIDE 4: Your Power (Redemption) */}
          {currentSlide === 3 && (
            <Animated.View entering={FadeInUp.delay(200)} exiting={FadeOut} style={[styles.slideContent, { justifyContent: 'center' }]}>
              <View style={[styles.storyCard, { backgroundColor: 'rgba(0, 255, 163, 0.1)', borderColor: primaryColor }]}>
                <ThemedText type="large" style={{ fontSize: 48, marginBottom: Spacing.md }}>{activeHabitat.icon}</ThemedText>
                <ThemedText type="title" weight="bold" style={{ color: '#FFF' }}>Your Power</ThemedText>
                
                <ThemedText type="large" style={{ textAlign: 'center', marginTop: Spacing.xl, lineHeight: 28 }}>
                  You've avoided <ThemedText type="large" weight="bold" style={{ color: primaryColor }}>{Math.round(impactCredits / 10)}kg CO₂</ThemedText>.
                </ThemedText>
                <ThemedText type="large" style={{ textAlign: 'center', marginTop: Spacing.md, lineHeight: 28 }}>
                  That protects <ThemedText type="large" weight="bold" style={{ color: primaryColor }}>{projectedArea} m²</ThemedText> of {activeHabitat.name}.
                </ThemedText>
                
                <ThemedText type="default" colorName="textSecondary" style={{ textAlign: 'center', marginTop: Spacing.lg }}>
                  Convert your credits to real-world impact right now.
                </ThemedText>

                <TouchableOpacity 
                  style={[styles.actionButton, { marginTop: Spacing.xxl, backgroundColor: primaryColor, width: '100%' }]}
                  onPress={() => {
                    if (timerRef.current) clearTimeout(timerRef.current);
                    router.push('/impact-redeem');
                  }}
                >
                  <ThemedText type="default" weight="bold" style={{ color: '#000' }}>Protect Now</ThemedText>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  bgImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  storyIndicators: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: Spacing.md,
  },
  indicatorBg: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  indicatorFill: {
    height: '100%',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: Spacing.md,
    zIndex: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentArea: {
    flex: 1,
  },
  slideContent: {
    flex: 1,
    justifyContent: 'center',
  },
  storyCard: {
    width: '100%',
    padding: Spacing.xxl,
    borderRadius: Radius.lg,
    backgroundColor: 'rgba(30,30,30,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFF',
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: Spacing.xxl,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: Spacing.xxl,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 48,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  streakBox: {
    width: '100%',
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    alignItems: 'center',
  },
  dramaticTitle: {
    color: '#FFF',
    fontSize: 36,
    marginBottom: Spacing.md,
  },
  dramaticText: {
    color: '#FFF',
    lineHeight: 28,
  },
  iconCircleWarning: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  insightBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: Spacing.lg,
    borderRadius: Radius.md,
    marginTop: Spacing.xl,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  actionButton: {
    paddingVertical: Spacing.lg,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
