import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedView } from '../../components/themed-view';
import { ThemedText } from '../../components/themed-text';
import { Card } from '../../components/Card';
import { Spacing, Radius } from '../../constants/theme';
import { useThemeColor } from '../../hooks/useThemeColor';
import { Leaf, Award, Heart } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { useStore } from '../../store';
import { SpatialCarousel } from '../../components/SpatialCarousel';

// Mock data for the Impact Network
const SOCIAL_FEED = [
  { id: '1', user: 'Alex M.', action: 'offset a flight to Tokyo', impact: '1250kg', type: 'offset', time: '2h ago' },
  { id: '2', user: 'Sarah K.', action: 'rode the metro for 5 days straight', impact: '25kg', type: 'habit', time: '4h ago' },
  { id: '3', user: 'David W.', action: 'unlocked the "Plant-Based Week" badge', impact: '18kg', type: 'badge', time: '6h ago' },
  { id: '4', user: 'Elena R.', action: 'purchased a Bamboo Coffee Cup', impact: '5kg', type: 'product', time: '1d ago' },
];

export default function SocialScreen() {
  const insets = useSafeAreaInsets();
  const primaryColor = useThemeColor({}, 'primary');
  const cardColor = useThemeColor({}, 'surface');
  const textSecondary = useThemeColor({}, 'textSecondary');
  
  const ecoPoints = useStore((state) => state.ecoPoints);

  // Calculate League
  const LEAGUES = [
    { name: 'Seedling', threshold: 0, color: '#4CAF50' },
    { name: 'Bronze', threshold: 200, color: '#CD7F32' },
    { name: 'Silver', threshold: 500, color: '#C0C0C0' },
    { name: 'Gold', threshold: 1000, color: '#FFD700' },
    { name: 'Diamond', threshold: 2000, color: '#00FFFF' },
  ];

  let currentLeague = LEAGUES[0];
  let nextLeague = LEAGUES[1];
  for (let i = LEAGUES.length - 1; i >= 0; i--) {
    if (ecoPoints >= LEAGUES[i].threshold) {
      currentLeague = LEAGUES[i];
      nextLeague = LEAGUES[i + 1] || LEAGUES[i];
      break;
    }
  }

  const progress = currentLeague === nextLeague 
    ? 1 
    : (ecoPoints - currentLeague.threshold) / (nextLeague.threshold - currentLeague.threshold);

  // State to track claps
  const [claps, setClaps] = useState<Record<string, boolean>>({});
  const [particles, setParticles] = useState<{ id: string, postId: string }[]>([]);

  const spawnParticles = (postId: string) => {
    const newParticles = Array.from({ length: 3 }).map(() => ({
      id: Math.random().toString(),
      postId
    }));
    setParticles(prev => [...prev, ...newParticles]);
  };

  const removeParticle = (id: string) => {
    setParticles(prev => prev.filter(p => p.id !== id));
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ThemedText type="subtitle" weight="bold">Impact Network</ThemedText>
        <ThemedText type="small" colorName="textSecondary" style={styles.subtitle}>
          See what your friends are doing to save the planet.
        </ThemedText>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 130 + insets.bottom }]}>
        
        {/* League Card */}
        <Card variant="elevated" style={styles.leagueCard}>
          <View style={styles.leagueHeader}>
            <View>
              <ThemedText type="small" colorName="textSecondary">Current League</ThemedText>
              <ThemedText type="large" weight="bold" style={{ color: currentLeague.color }}>
                {currentLeague.name}
              </ThemedText>
            </View>
            <View style={styles.pointsBadge}>
              <Award size={16} color={currentLeague.color} />
              <ThemedText type="default" weight="bold" style={{ marginLeft: 4, color: currentLeague.color }}>
                {ecoPoints} PTS
              </ThemedText>
            </View>
          </View>
          
          {currentLeague !== nextLeague && (
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <ThemedText type="small" colorName="textSecondary">Progress to {nextLeague.name}</ThemedText>
                <ThemedText type="small" weight="bold">
                  {nextLeague.threshold - ecoPoints} PTS needed
                </ThemedText>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progress * 100}%`, backgroundColor: nextLeague.color }]} />
              </View>
            </View>
          )}
        </Card>

        {/* 3D Spatial Carousel */}
        <ThemedText type="large" weight="bold" style={{ marginLeft: Spacing.xl, marginTop: Spacing.xl, marginBottom: Spacing.md }}>Trending Impact</ThemedText>
        <SpatialCarousel 
          data={SOCIAL_FEED.map(post => ({
            id: post.id,
            user: post.user,
            action: post.action,
            impact: post.impact,
            type: post.type === 'badge' ? 'award' : post.type === 'habit' ? 'bike' : 'plant'
          })) as any} 
        />
        
      </ScrollView>
    </ThemedView>
  );
}

// Particle Component
function Particle({ onComplete }: { onComplete: () => void }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0.5);
  
  // Random X offset and duration
  const translateX = (Math.random() - 0.5) * 60;
  const duration = 800 + Math.random() * 400;

  React.useEffect(() => {
    translateY.value = withTiming(-80 - Math.random() * 40, { duration });
    opacity.value = withTiming(0, { duration }, (finished) => {
      if (finished) {
        runOnJS(onComplete)();
      }
    });
    scale.value = withSpring(1.2 + Math.random());
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    top: 0,
    left: 20,
    transform: [
      { translateY: translateY.value }, 
      { translateX }, 
      { scale: scale.value }
    ],
    opacity: opacity.value,
    zIndex: 1000,
    pointerEvents: 'none',
  }));

  return (
    <Animated.Text style={[style, { fontSize: 24 }]}>👏</Animated.Text>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  subtitle: {
    marginTop: Spacing.xs,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  leagueCard: {
    marginBottom: Spacing.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(150,150,150,0.1)',
  },
  leagueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(150,150,150,0.1)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  progressContainer: {
    marginTop: Spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(150,150,150,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  feedCard: {
    marginBottom: Spacing.lg,
    padding: Spacing.md,
  },
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  feedHeaderText: {
    flex: 1,
  },
  feedBody: {
    marginBottom: Spacing.md,
  },
  impactBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  feedFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.1)',
    paddingTop: Spacing.md,
    flexDirection: 'row',
  },
  clapButton: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});
