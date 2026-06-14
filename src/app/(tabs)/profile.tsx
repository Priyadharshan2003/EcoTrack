import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../store';
import { ThemedView } from '../../components/themed-view';
import { ThemedText } from '../../components/themed-text';
import { Card } from '../../components/Card';
import { MysteryBox } from '../../components/MysteryBox';
import { Spacing, Radius } from '../../constants/theme';
import { Award, Activity, Settings, Wallet, ChevronRight, Sprout, Car, Flame, Briefcase, TreePine } from 'lucide-react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { router } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  interpolate, 
  Extrapolation, 
  useAnimatedRef, 
  useScrollViewOffset 
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const BADGE_MAP: Record<string, { title: string, icon: React.ElementType, color: string, desc: string }> = {
  'first_offset': { title: 'First Offset', icon: Sprout, color: '#00C864', desc: 'Planted your first real-world tree.' },
  'low_transport': { title: 'Eco Transit', icon: Car, color: '#007AFF', desc: 'Used public transit 5 times.' },
  'streak_7': { title: '7-Day Streak', icon: Flame, color: '#FF6B00', desc: 'Maintained a 7-day green streak.' },
};

function FlippableBadge({ badgeData }: { badgeData: typeof BADGE_MAP[0] }) {
  const isFlipped = useSharedValue(0);

  const frontStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(isFlipped.value, [0, 1], [0, 180], Extrapolation.CLAMP);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden',
    };
  });

  const backStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(isFlipped.value, [0, 1], [180, 360], Extrapolation.CLAMP);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden',
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
    };
  });

  return (
    <TouchableOpacity 
      activeOpacity={1}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        isFlipped.value = withSpring(isFlipped.value ? 0 : 1, { damping: 12 });
      }}
      style={styles.badgeContainer}
    >
      <Animated.View style={[styles.badgeIconBox, { backgroundColor: `${badgeData.color}20`, borderColor: `${badgeData.color}50` }, frontStyle]}>
        <badgeData.icon size={28} color={badgeData.color} />
      </Animated.View>
      <Animated.View style={[styles.badgeIconBox, { backgroundColor: badgeData.color, borderColor: badgeData.color }, backStyle]}>
        <ThemedText type="small" weight="bold" style={{ color: '#FFF', textAlign: 'center', fontSize: 10 }}>{badgeData.desc}</ThemedText>
      </Animated.View>
      <ThemedText type="small" style={styles.badgeTitle}>{badgeData.title}</ThemedText>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const verifiedActivities = useStore((state) => state.verifiedActivities);
  const totalOffset = useStore((state) => state.totalOffset);
  const ecoScore = useStore((state) => state.ecoScore);
  const badges = useStore((state) => state.badges);
  const corporateEmail = useStore((state) => state.corporateEmail);
  
  const primaryColor = useThemeColor({}, 'primary');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const textColor = useThemeColor({}, 'text');

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    // Parallax scale effect when pulling down
    const scale = interpolate(
      scrollOffset.value,
      [-100, 0],
      [1.5, 1],
      Extrapolation.CLAMP
    );
    // Move slightly up when scrolling down
    const translateY = interpolate(
      scrollOffset.value,
      [0, 100],
      [0, -50],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { scale },
        { translateY }
      ]
    };
  });

  return (
    <ThemedView style={styles.container}>
      <Animated.View style={[StyleSheet.absoluteFill, headerAnimatedStyle, { height: 300 }]}>
        <LinearGradient 
          colors={['rgba(0, 255, 163, 0.2)', '#000']} 
          style={StyleSheet.absoluteFill} 
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </Animated.View>

      <Animated.ScrollView 
        ref={scrollRef}
        scrollEventThrottle={16}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + Spacing.xl, paddingBottom: 130 + insets.bottom }]}
      >
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: `${primaryColor}20` }]}>
            <ThemedText type="title" colorName="primary">E</ThemedText>
          </View>
          <ThemedText type="subtitle" style={styles.name}>Eco Warrior</ThemedText>
          <View style={[styles.streakBadge, { backgroundColor: `${primaryColor}20` }]}>
            <Award size={16} color={primaryColor} />
            <ThemedText type="small" colorName="primary" style={styles.streakText}>Eco Score: {ecoScore.toFixed(0)}</ThemedText>
          </View>
          
          <TouchableOpacity onPress={() => router.push('/impact-story' as any)} style={[styles.impactBtn, { backgroundColor: primaryColor }]}>
            <ThemedText type="small" weight="bold" style={{ color: '#000' }}>View My Week</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Achievements Showcase */}
        {badges.length > 0 && (
          <View style={styles.showcaseSection}>
            <ThemedText type="large" weight="bold" style={styles.sectionTitle}>Achievements</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgeScroll}>
              {badges.map((badgeId) => {
                const badgeData = BADGE_MAP[badgeId];
                if (!badgeData) return null;
                return <FlippableBadge key={badgeId} badgeData={badgeData} />;
              })}
              <View style={styles.badgeContainer}>
                <MysteryBox 
                  onUnlock={() => {
                    // Logic to add a new badge could go here
                  }} 
                  iconColor="#FFB800" 
                />
                <ThemedText type="small" colorName="textSecondary" style={styles.badgeTitle}>Tap to Reveal</ThemedText>
              </View>
            </ScrollView>
          </View>
        )}

        {/* Corporate Section (Conditionally Rendered) */}
        {corporateEmail !== null && (
          <>
            <ThemedText type="large" weight="bold" style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>Corporate</ThemedText>
            <TouchableOpacity onPress={() => router.push('/corporate-leaderboard')}>
              <Card variant="elevated" style={[styles.actionCard, { borderColor: '#007AFF', borderWidth: 1 }]}>
                <View style={styles.cardRow}>
                  <View style={[styles.iconBox, { backgroundColor: 'rgba(0, 122, 255, 0.1)' }]}>
                    <Briefcase size={24} color="#007AFF" />
                  </View>
                  <View style={styles.cardInfo}>
                    <ThemedText type="default" weight="bold">Company Leaderboard</ThemedText>
                    <ThemedText type="small" colorName="textSecondary">See how your company ranks</ThemedText>
                  </View>
                  <ChevronRight size={20} color={textSecondary} />
                </View>
              </Card>
            </TouchableOpacity>
          </>
        )}

        <ThemedText type="large" weight="bold" style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>Impact</ThemedText>

        <TouchableOpacity onPress={() => router.push('/wallet')}>
          <Card variant="elevated" style={styles.actionCard}>
            <View style={styles.cardRow}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(0, 200, 100, 0.1)' }]}>
                <Wallet size={24} color="#00C864" />
              </View>
              <View style={styles.cardInfo}>
                <ThemedText type="default" weight="bold">Carbon Wallet</ThemedText>
                <ThemedText type="small" colorName="textSecondary">View balance & transactions</ThemedText>
              </View>
              <ChevronRight size={20} color={textSecondary} />
            </View>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/forest' as any)}>
          <Card variant="elevated" style={[styles.actionCard, { marginTop: Spacing.md }]}>
            <View style={styles.cardRow}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(0, 200, 100, 0.1)' }]}>
                <TreePine size={24} color="#00C864" />
              </View>
              <View style={styles.cardInfo}>
                <ThemedText type="default" weight="bold">The Impact Forest</ThemedText>
                <ThemedText type="small" colorName="textSecondary">View your digital trophy room</ThemedText>
              </View>
              <ChevronRight size={20} color={textSecondary} />
            </View>
          </Card>
        </TouchableOpacity>

        <ThemedText type="large" weight="bold" style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>
          History
        </ThemedText>

        <Card variant="default" style={styles.historyCard}>
          <View style={styles.historyRow}>
            <Activity size={24} color={primaryColor} />
            <View style={styles.historyInfo}>
              <ThemedText type="default" weight="bold">Verified Activities</ThemedText>
              <ThemedText type="small" colorName="textSecondary">{verifiedActivities.length} total approvals</ThemedText>
            </View>
          </View>
        </Card>

        <ThemedText type="large" weight="bold" style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>Account</ThemedText>

        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Card variant="default" style={styles.actionCard}>
            <View style={styles.cardRow}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(150, 150, 150, 0.1)' }]}>
                <Settings size={24} color={textColor} />
              </View>
              <View style={styles.cardInfo}>
                <ThemedText type="default" weight="bold">Settings</ThemedText>
                <ThemedText type="small" colorName="textSecondary">Theme & Integrations</ThemedText>
              </View>
              <ChevronRight size={20} color={textSecondary} />
            </View>
          </Card>
        </TouchableOpacity>

      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  name: {
    marginBottom: Spacing.xs,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 999,
  },
  streakText: {
    marginLeft: Spacing.xs,
  },
  impactBtn: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  showcaseSection: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  badgeScroll: {
    flexDirection: 'row',
    paddingBottom: Spacing.md,
  },
  badgeContainer: {
    alignItems: 'center',
    marginRight: Spacing.xl,
    width: 70,
  },
  badgeIconBox: {
    width: 72,
    height: 72,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    padding: 4,
  },
  badgeTitle: {
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 14,
  },
  actionCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  historyCard: {
    marginBottom: Spacing.md,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyInfo: {
    marginLeft: Spacing.md,
  }
});
