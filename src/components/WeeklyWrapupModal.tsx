import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, Dimensions, Platform, Pressable } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing,
  FadeIn,
  FadeOut,
  ZoomIn,
  interpolate,
  Extrapolation
} from 'react-native-reanimated';
import { X, Sparkles, AlertTriangle, CheckCircle, Flame, ChevronRight, ChevronLeft } from 'lucide-react-native';
import Svg, { Path, Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { ThemedText } from './themed-text';
import { Button } from './Button';
import { useThemeColor } from '../hooks/useThemeColor';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Spacing, Radius } from '../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const STORY_DURATION = 5000; // 5 seconds per slide

interface WeeklyWrapupModalProps {
  visible: boolean;
  onClose: () => void;
  onOffsetAll: () => void;
}

export function WeeklyWrapupModal({ visible, onClose, onOffsetAll }: WeeklyWrapupModalProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const [currentSlide, setCurrentSlide] = useState(0);
  const progress = useSharedValue(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);

  // Setup weekly mock data
  const dailyEmissions = [12.4, 9.8, 14.2, 8.1, 5.3, 11.2, 6.4]; // Mon -> Sun
  const maxEmission = Math.max(...dailyEmissions);
  
  // Calculate SVG curve path for 300x100 viewBox
  const getCurvePath = () => {
    const points = dailyEmissions.map((val, idx) => {
      const x = 20 + idx * 43; // spacing across 300px
      const y = 90 - (val / maxEmission) * 60; // scale between y=30 and y=90
      return { x, y };
    });

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const cpX1 = (points[i].x + points[i + 1].x) / 2;
      const cpY1 = points[i].y;
      const cpX2 = (points[i].x + points[i + 1].x) / 2;
      const cpY2 = points[i + 1].y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${points[i + 1].x} ${points[i + 1].y}`;
    }
    return { path, points };
  };

  const { path: curvePath, points: curvePoints } = getCurvePath();

  // Handle slide timing loop
  const startStory = (slideIndex: number) => {
    progress.value = 0;
    progress.value = withTiming(1, { 
      duration: STORY_DURATION, 
      easing: Easing.linear 
    });

    startTimeRef.current = Date.now();

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (slideIndex < 2) {
        const next = slideIndex + 1;
        setCurrentSlide(next);
        startStory(next);
      } else {
        onClose();
      }
    }, STORY_DURATION);
  };

  useEffect(() => {
    if (visible) {
      setCurrentSlide(0);
      startStory(0);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible]);

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentSlide < 2) {
      const next = currentSlide + 1;
      setCurrentSlide(next);
      startStory(next);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentSlide > 0) {
      const prev = currentSlide - 1;
      setCurrentSlide(prev);
      startStory(prev);
    }
  };

  const handleScreenPress = (event: any) => {
    const x = event.nativeEvent.locationX;
    // Tap left third to go back, right two-thirds to go forward
    if (x < SCREEN_WIDTH * 0.3) {
      handlePrev();
    } else {
      handleNext();
    }
  };

  const handleOffsetAction = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onOffsetAll();
    onClose();
  };

  // Animated progress bar styles
  const getProgressStyle = (index: number) => {
    return useAnimatedStyle(() => {
      if (index < currentSlide) {
        return { width: '100%' };
      }
      if (index > currentSlide) {
        return { width: '0%' };
      }
      return {
        width: `${progress.value * 100}%`
      };
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Full Screen Cinematic Story Gradient */}
        <LinearGradient
          colors={['#000000', '#121212', '#081C15'] as const}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Top Header & Close button */}
        <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 50 : 20 }]}>
          {/* Story Progress Indicators */}
          <View style={styles.storyIndicators}>
            {[0, 1, 2].map((idx) => (
              <View key={idx} style={styles.indicatorBg}>
                <Animated.View style={[styles.indicatorFill, { backgroundColor: primaryColor }, getProgressStyle(idx)]} />
              </View>
            ))}
          </View>

          {/* Close button */}
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={22} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Swipe/Tap Detector Area */}
        <Pressable onPress={handleScreenPress} style={styles.contentArea}>
          
          {/* SLIDE 0: Carbon Trend */}
          {currentSlide === 0 && (
            <Animated.View entering={FadeIn} style={styles.slideContent}>
              <View style={styles.iconCircle}>
                <Sparkles size={32} color={primaryColor} />
              </View>
              <ThemedText type="large" weight="bold" style={styles.slideTitle}>
                Your Green Trendline
              </ThemedText>
              
              <ThemedText type="default" colorName="textSecondary" style={styles.slideDesc}>
                You emitted <ThemedText type="default" weight="bold" style={{ color: '#FFF' }}>67.4kg of CO₂</ThemedText> this week. That's a <ThemedText type="default" weight="bold" style={{ color: primaryColor }}>12% decrease</ThemedText> from last week!
              </ThemedText>

              {/* Curved Trend SVG Line Chart */}
              <View style={styles.chartContainer}>
                <Svg width="100%" height="100%" viewBox="0 0 300 120">
                  <Defs>
                    <SvgLinearGradient id="glowGrad" x1="0" y1="0" x2="0" y2="1">
                      <Stop offset="0%" stopColor={primaryColor} stopOpacity="0.3" />
                      <Stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
                    </SvgLinearGradient>
                  </Defs>
                  <Path
                    d={`${curvePath} L 278 110 L 20 110 Z`}
                    fill="url(#glowGrad)"
                  />
                  <Path
                    d={curvePath}
                    fill="none"
                    stroke={primaryColor}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  {curvePoints.map((p, i) => (
                    <Circle
                      key={i}
                      cx={p.x}
                      cy={p.y}
                      r="4"
                      fill="#FFF"
                      stroke={primaryColor}
                      strokeWidth="2"
                    />
                  ))}
                </Svg>
                
                {/* Chart labels */}
                <View style={styles.chartLabels}>
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                    <ThemedText key={idx} type="small" style={{ color: '#666', width: 25, textAlign: 'center' }}>
                      {day}
                    </ThemedText>
                  ))}
                </View>
              </View>

              <ThemedText type="small" colorName="textSecondary" style={styles.insightNote}>
                * Your lowest emission day was Friday (5.3kg CO₂) thanks to public transit logging!
              </ThemedText>
            </Animated.View>
          )}

          {/* SLIDE 1: Footprint Category Breakdown */}
          {currentSlide === 1 && (
            <Animated.View entering={FadeIn} style={styles.slideContent}>
              <View style={[styles.iconCircle, { borderColor: '#FF9500' }]}>
                <AlertTriangle size={32} color="#FF9500" />
              </View>
              <ThemedText type="large" weight="bold" style={styles.slideTitle}>
                Footprint Breakdown
              </ThemedText>

              <ThemedText type="default" colorName="textSecondary" style={[styles.slideDesc, { marginBottom: 30 }]}>
                Cab rides and deliveries were your largest contributors this week.
              </ThemedText>

              {/* Progress categories */}
              <View style={styles.breakdownContainer}>
                {/* Category 1 */}
                <View style={styles.breakdownRow}>
                  <View style={styles.breakdownInfo}>
                    <ThemedText type="default" weight="bold">🚗 Transport (Cabs/Flights)</ThemedText>
                    <ThemedText type="default" style={{ color: '#FF9500' }}>65% (43.8 kg)</ThemedText>
                  </View>
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { width: '65%', backgroundColor: '#FF9500' }]} />
                  </View>
                </View>

                {/* Category 2 */}
                <View style={styles.breakdownRow}>
                  <View style={styles.breakdownInfo}>
                    <ThemedText type="default" weight="bold">🍔 Food Delivery</ThemedText>
                    <ThemedText type="default" style={{ color: '#FFCC00' }}>25% (16.8 kg)</ThemedText>
                  </View>
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { width: '25%', backgroundColor: '#FFCC00' }]} />
                  </View>
                </View>

                {/* Category 3 */}
                <View style={styles.breakdownRow}>
                  <View style={styles.breakdownInfo}>
                    <ThemedText type="default" weight="bold">📺 Entertainment (Streaming)</ThemedText>
                    <ThemedText type="default" style={{ color: '#00C864' }}>10% (6.8 kg)</ThemedText>
                  </View>
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { width: '10%', backgroundColor: '#00C864' }]} />
                  </View>
                </View>
              </View>
            </Animated.View>
          )}

          {/* SLIDE 2: Oakley's Verdict Rating & One-Tap Offset Action */}
          {currentSlide === 2 && (
            <Animated.View entering={FadeIn} style={styles.slideContent}>
              <View style={[styles.iconCircle, { borderColor: primaryColor }]}>
                <CheckCircle size={32} color={primaryColor} />
              </View>
              <ThemedText type="large" weight="bold" style={styles.slideTitle}>
                Oakley's Verdict: A+
              </ThemedText>

              {/* Duolingo style rating card */}
              <View style={styles.verdictCard}>
                <View style={styles.verdictHeader}>
                  <Flame size={24} color="#FF5F00" />
                  <ThemedText type="default" weight="bold" style={{ color: '#FFF', marginLeft: 8 }}>
                    Gold Leaf Badge
                  </ThemedText>
                </View>
                <ThemedText type="small" colorName="textSecondary" style={styles.verdictDesc}>
                  "You offset 80% of your footprint this week. Oakley says you are doing great, but that 20% left is looking a bit grey. Let's offset it now and make Oakley happy!"
                </ThemedText>
              </View>

              <View style={styles.offsetActionCard}>
                <ThemedText type="default" weight="bold" style={{ color: '#FFF', marginBottom: 4 }}>
                  Offset Outstanding Emissions
                </ThemedText>
                <ThemedText type="small" colorName="textSecondary" style={{ marginBottom: 16 }}>
                  Buy 13.6 kg carbon credits to fully offset your remaining weekly emissions.
                </ThemedText>

                <Button
                  title="Make My Week 100% Green"
                  variant="primary"
                  onPress={handleOffsetAction}
                  style={styles.offsetBtn}
                />
              </View>
            </Animated.View>
          )}
        </Pressable>

        {/* Footer Navigation Hints */}
        <View style={styles.footerHints}>
          <View style={styles.hintContainer}>
            <ChevronLeft size={16} color="#666" />
            <ThemedText type="small" style={{ color: '#666', marginLeft: 4 }}>Tap left to go back</ThemedText>
          </View>
          <View style={styles.hintContainer}>
            <ThemedText type="small" style={{ color: '#666', marginRight: 4 }}>Tap right to skip</ThemedText>
            <ChevronRight size={16} color="#666" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    width: '100%',
    zIndex: 10,
  },
  storyIndicators: {
    flexDirection: 'row',
    flex: 1,
    gap: Spacing.xs,
    marginRight: Spacing.md,
  },
  indicatorBg: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.full,
    flex: 1,
    overflow: 'hidden',
  },
  indicatorFill: {
    height: '100%',
    width: '0%',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: Spacing.xl,
  },
  slideContent: {
    width: '100%',
    alignItems: 'center',
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#00FFA3',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    marginBottom: Spacing.xl,
  },
  slideTitle: {
    color: '#FFF',
    fontSize: 24,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  slideDesc: {
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  chartContainer: {
    width: '100%',
    height: 140,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#1f1f1f',
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.md,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: Spacing.sm,
  },
  insightNote: {
    color: '#888',
    textAlign: 'center',
    fontSize: 10,
    paddingHorizontal: Spacing.md,
  },
  breakdownContainer: {
    width: '100%',
    gap: Spacing.lg,
  },
  breakdownRow: {
    width: '100%',
  },
  breakdownInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  barBg: {
    height: 10,
    backgroundColor: '#1E1E1E',
    borderRadius: Radius.full,
    width: '100%',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  verdictCard: {
    backgroundColor: '#1A1A1C',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#2D2D2E',
    padding: Spacing.md,
    width: '100%',
    marginBottom: Spacing.lg,
  },
  verdictHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  verdictDesc: {
    lineHeight: 18,
  },
  offsetActionCard: {
    backgroundColor: 'rgba(0, 255, 163, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 163, 0.15)',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    width: '100%',
    alignItems: 'center',
  },
  offsetBtn: {
    width: '100%',
  },
  footerHints: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});
