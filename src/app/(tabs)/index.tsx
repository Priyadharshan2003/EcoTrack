import { Platform, StyleSheet, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser, useClerk } from '@clerk/expo';
import { useStore } from '../../store';
import { ThemedView } from '../../components/themed-view';
import { ThemedText } from '../../components/themed-text';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { ShareBanner } from '../../components/ShareBanner';
import { Spacing, Radius } from '../../constants/theme';
import { MessageCircle, Flame, Watch, X, Globe, Sparkles, Bell, Activity, AlertTriangle, Zap, TrendingUp } from 'lucide-react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { HABITATS } from '../../constants/habitats';
import { useRef, useState, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';
import { router } from 'expo-router';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withTiming, withSequence,
  FadeIn, FadeInDown, ZoomIn,
} from 'react-native-reanimated';
import { ActivityRings } from '../../components/ActivityRings';
import { AIOrb } from '../../components/AIOrb';
import { AmbientBackground } from '../../components/AmbientBackground';
import { ScannerModal } from '../../components/ScannerModal';
import { LiquidButton } from '../../components/LiquidButton';
import { ScratchCard } from '../../components/ScratchCard';
import { WeeklyWrapupModal } from '../../components/WeeklyWrapupModal';
import { WelcomeCelebration } from '../../components/WelcomeCelebration';
import { HabitatVisualizer } from '../../components/HabitatVisualizer';
import { CarFront, Utensils, Footprints, ChevronRight } from 'lucide-react-native';

// ─── Rotating Oakley messages — date-seeded, changes every day ───────────────
const OAKLEY_MESSAGES: Array<(score: number, streak: number, credits: number) => string> = [
  (score, streak) => `Your ${streak}-day streak is making a real dent. Just 2 more verified activities to maintain it!`,
  (score) => score > 70
    ? `EcoScore ${score} — you're in the top 30%. One more low-emission choice keeps you there.`
    : `EcoScore ${score}. National average is 58. Verify today's activities to push past it.`,
  (_s, _st, credits) => `You have ${credits} impact credits — enough to protect ${(credits * 0.02).toFixed(1)} m² of mangrove forest right now.`,
  () => `Rising ocean temps bleached 50% of the Great Barrier Reef since 2016. Every kg you save slows that.`,
  () => `Cab rides are your top emission source this week. One metro trip saves ~2.1 kg CO₂.`,
  (_s, streak) => streak > 0
    ? `${streak}-day streak! Each day = ${(streak * 1.2).toFixed(1)} m² of habitat protected indirectly.`
    : `Start your streak today — even 1 verified activity counts!`,
  () => `Food delivery is 18% of urban footprints. Choosing restaurants within 3 km cuts emissions by 40%.`,
  (_s, _st, credits) => credits >= 50
    ? `You've earned enough credits to protect real land. Tap "Protect Habitat" and watch your area grow.`
    : `Verify 3 more activities to earn 50 impact credits — your first m² of Amazon rainforest.`,
  () => `A polar bear needs 12,000 km² of sea ice to survive. Your green choices slow Arctic melt.`,
  (score) => `Carbon inflation: a 1°C global rise increases food prices 0.9% annually. Score ${score} is fighting that.`,
];

function getOakleyMessage(ecoScore: number, streakDays: number, impactCredits: number): string {
  const dayIndex = new Date().getDate() % OAKLEY_MESSAGES.length;
  return OAKLEY_MESSAGES[dayIndex](ecoScore, streakDays, impactCredits);
}

// ─── Section header ──────────────────────────────────────────────────────────
function SectionHeader({ label, color = '#A0A0A0' }: { label: string; color?: string }) {
  return (
    <ThemedText
      type="tiny"
      style={{
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontWeight: '700',
        color,
        marginBottom: Spacing.sm,
        marginTop: Spacing.xxl,
      }}
    >
      {label}
    </ThemedText>
  );
}

// ─── Stat pill ───────────────────────────────────────────────────────────────
function StatPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={statPillStyles.container}>
      <ThemedText type="h2" style={{ color }}>{value}</ThemedText>
      <ThemedText type="caption" colorName="textSecondary" style={{ marginTop: 2 }}>{label}</ThemedText>
    </View>
  );
}
const statPillStyles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingVertical: Spacing.md },
});

// ─── Screen ──────────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const { signOut } = useClerk();

  // Store
  const ecoScore          = useStore((s) => s.ecoScore);
  const totalOffset       = useStore((s) => s.totalOffset);
  const streakDays        = useStore((s) => s.streakDays);
  const ecoPoints         = useStore((s) => s.ecoPoints);
  const activeChallenge   = useStore((s) => s.activeChallenge);
  const isDeviceBannerDismissed = useStore((s) => s.isDeviceBannerDismissed);
  const dismissDeviceBanner     = useStore((s) => s.dismissDeviceBanner);
  const impactCredits     = useStore((s) => s.impactCredits);
  const selectedHabitat   = useStore((s) => s.selectedHabitat);
  const habitatProgress   = useStore((s) => s.habitatProgress);
  const pendingActivities = useStore((s) => s.pendingActivities);
  const verifyActivity     = useStore((s) => s.verifyActivity);
  const addPoints          = useStore((s) => s.addPoints);
  const purchaseOffset     = useStore((s) => s.purchaseOffset);
  const hasSeenWelcome     = useStore((s) => s.hasSeenWelcome);
  const setHasSeenWelcome  = useStore((s) => s.setHasSeenWelcome);
  const lastActiveTimestamp = useStore((s) => s.lastActiveTimestamp);
  const updateLastActive   = useStore((s) => s.updateLastActive);
  const redeemCredits      = useStore((s) => s.redeemCredits);

  // Theme
  const primaryColor = useThemeColor({}, 'primary');
  const cardColor    = useThemeColor({}, 'surface');

  // Refs
  const shareBannerRef = useRef<any>(null);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // State
  const [isScannerVisible,  setIsScannerVisible]  = useState(false);
  const [isSharing,         setIsSharing]          = useState(false);
  const [islandExpanded,    setIslandExpanded]     = useState(false);
  const [isScratchVisible,  setIsScratchVisible]   = useState(false);
  const [isWrapupVisible,   setIsWrapupVisible]    = useState(false);
  const [lootCardAvailable, setLootCardAvailable]  = useState(true);
  // Phase 4 — welcome celebration fires once
  const [showWelcome, setShowWelcome] = useState(false);
  // Phase 2 — streak loss warning (show if streak ≥ 3 and last active > 18h ago)
  const hoursInactive = (Date.now() - lastActiveTimestamp) / 3600000;
  const showStreakWarning = streakDays >= 3 && hoursInactive > 18;

  // Phase 4 — trigger welcome celebration on first launch
  useEffect(() => {
    if (!hasSeenWelcome) {
      const t = setTimeout(() => setShowWelcome(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  // Update lastActive on every home screen visit
  useEffect(() => { updateLastActive(); }, []);

  // Breathing animation for AI insight box
  const breathingValue = useSharedValue(0.08);
  useEffect(() => {
    breathingValue.value = withRepeat(
      withSequence(
        withTiming(0.35, { duration: 2200 }),
        withTiming(0.08, { duration: 2200 })
      ),
      -1,
      true
    );
  }, []);
  const animatedInsightStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(59, 232, 176, ${breathingValue.value})`,
    borderColor:     `rgba(59, 232, 176, ${breathingValue.value * 2.5})`,
  }));

  // Helpers
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning ☀️';
    if (h < 18) return 'Good Afternoon';
    return 'Good Evening 🌙';
  };

  const getScoreBenchmark = () => {
    if (ecoScore >= 80) return '🏆 Top 15% in your region';
    if (ecoScore >= 70) return 'Better than 68% of users';
    if (ecoScore >= 58) return 'Above national avg · 58';
    return 'National avg is 58 — keep going!';
  };

  const getAiInsight = () => {
    if (ecoScore >= 80) return "You're crushing it. Keep your emissions low.";
    if (ecoScore >= 50) return "You're on track. One more verified activity today.";
    return "Action needed — let's offset some footprint today.";
  };

  const handleShare = async () => {
    try {
      setIsSharing(true);
      if (shareBannerRef.current?.capture) {
        const uri = await shareBannerRef.current.capture();
        if (Platform.OS === 'web') {
          const w = window.open();
          if (w) w.document.write(`<img src="${uri}" style="max-width:100%"/>`);
          else Alert.alert('Web Sharing', 'Right-click the banner to save the image.');
        } else {
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Share your Carbon Score', UTI: 'public.png' });
          }
        }
      }
    } catch {
      Alert.alert('Sharing Error', 'Unable to share. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'cab_travel': return <CarFront size={20} color="#00F0FF" />;
      case 'food_order': return <Utensils size={20} color="#FFB800" />;
      default:           return <Footprints size={20} color="#3BE8B0" />;
    }
  };

  const habitat = HABITATS[selectedHabitat];

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <AmbientBackground />
      {/* Hidden capture target — zero layout impact */}
      <View style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}>
        <ShareBanner ref={shareBannerRef} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: 120 + insets.bottom }]}
      >
        {/* ── User Profile Header ─────────────────────────────────────── */}
        <View style={styles.userHeaderRow}>
          <ThemedText style={styles.userEmail}>
            {user?.primaryEmailAddress?.emailAddress || 'User'}
          </ThemedText>
          <TouchableOpacity onPress={() => signOut()} style={styles.signOutBtn}>
            <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
          </TouchableOpacity>
        </View>

        {/* ── Dynamic Island ─────────────────────────────────────── */}
        <View style={styles.islandRow}>
          <TouchableOpacity activeOpacity={0.85} onPress={() => setIslandExpanded(!islandExpanded)}>
            <View style={[styles.island, { backgroundColor: islandExpanded ? '#1A1A1A' : '#141414' }]}>
              <View style={styles.islandHeader}>
                {islandExpanded
                  ? <Sparkles size={15} color="#00FFA3" />
                  : <Bell size={15} color="#666" />}
                <ThemedText style={styles.islandTitle}>
                  {islandExpanded ? 'EcoTrack AI' : getGreeting()}
                </ThemedText>
                {streakDays > 0 && !islandExpanded && (
                  <View style={styles.streakPill}>
                    <Flame size={12} color="#FF6B00" />
                    <ThemedText style={styles.streakPillText}>{streakDays}d</ThemedText>
                  </View>
                )}
              </View>

              {islandExpanded && (
                <Animated.View entering={FadeIn.duration(200)} style={styles.islandBody}>
                  <ThemedText type="caption" style={{ color: '#AAA', lineHeight: 18 }}>
                    {pendingActivities.length > 0
                      ? `${pendingActivities.length} activit${pendingActivities.length === 1 ? 'y' : 'ies'} waiting · ${pendingActivities.reduce((s, a) => s + a.emissions_kg, 0).toFixed(1)} kg CO₂ to process`
                      : 'All activities verified. Monitoring in background.'}
                  </ThemedText>
                  {streakDays > 0 && (
                    <View style={styles.streakBadge}>
                      <Flame size={12} color="#FF6B00" />
                      <ThemedText type="caption" style={{ color: '#FF6B00', marginLeft: 4 }}>
                        {streakDays} day streak · {(streakDays * 1.2).toFixed(1)} m² protected
                      </ThemedText>
                    </View>
                  )}
                </Animated.View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Streak Loss Warning Banner (Phase 2) ──────────────── */}
        {showStreakWarning && (
          <Animated.View entering={FadeInDown.duration(350)} style={styles.streakWarning}>
            <Flame size={16} color="#FF453A" />
            <ThemedText type="caption" style={{ color: '#FF453A', flex: 1, marginLeft: 8 }}>
              Your {streakDays}-day streak is at risk! Verify an activity today to keep it alive.
            </ThemedText>
            <TouchableOpacity onPress={() => router.push('/(tabs)/verify')} style={styles.streakWarningBtn}>
              <ThemedText type="tiny" weight="bold" style={{ color: '#FF453A' }}>VERIFY NOW</ThemedText>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* ── Inline Verify Card (Phase 2) ───────────────────────── */}
        {pendingActivities.length > 0 && (
          <>
            <SectionHeader label={`Verify Now · ${pendingActivities.length} pending`} color="#FFB800" />
            <Animated.View entering={FadeInDown.duration(400)}>
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={() => router.push('/(tabs)/verify')}
              >
                <Card
                  variant="elevated"
                  style={[styles.card, { borderWidth: 1, borderColor: 'rgba(255,184,0,0.25)', backgroundColor: 'rgba(18,14,0,0.95)' }]}
                >
                  {/* Top row: icon + title + chevron */}
                  <View style={styles.row}>
                    <View style={styles.verifyIconBox}>
                      {getActivityIcon(pendingActivities[0].type)}
                    </View>
                    <View style={{ flex: 1, marginLeft: Spacing.md }}>
                      <ThemedText type="body" weight="bold" style={{ color: '#FFF' }}>
                        {pendingActivities[0].title}
                      </ThemedText>
                      <ThemedText type="caption" colorName="textSecondary" style={{ marginTop: 2 }}>
                        {pendingActivities[0].description}
                      </ThemedText>
                    </View>
                    <ChevronRight size={18} color="#555" />
                  </View>

                  {/* Emission chip + reward chip */}
                  <View style={[styles.row, { marginTop: Spacing.md, gap: Spacing.sm }]}>
                    <View style={styles.emissionChip}>
                      <ThemedText type="caption" weight="bold" style={{ color: '#FF9500' }}>
                        +{pendingActivities[0].emissions_kg} kg CO₂
                      </ThemedText>
                    </View>
                    <View style={styles.rewardChip}>
                      <Zap size={12} color="#3BE8B0" />
                      <ThemedText type="caption" weight="bold" style={{ color: '#3BE8B0', marginLeft: 4 }}>
                        +50 pts on verify
                      </ThemedText>
                    </View>
                    {pendingActivities.length > 1 && (
                      <View style={styles.moreChip}>
                        <ThemedText type="tiny" style={{ color: '#888' }}>
                          +{pendingActivities.length - 1} more
                        </ThemedText>
                      </View>
                    )}
                  </View>

                  {/* Swipe hint */}
                  <View style={styles.swipeHint}>
                    <ThemedText type="tiny" style={{ color: '#555', letterSpacing: 0.5 }}>
                      TAP TO VERIFY · SWIPE TO CONFIRM
                    </ThemedText>
                  </View>
                </Card>
              </TouchableOpacity>
            </Animated.View>
          </>
        )}

        {/* ── Eco Score Card ─────────────────────────────────────── */}
        <SectionHeader label="Overview" color={primaryColor} />
        <Animated.View entering={FadeInDown.duration(400).delay(50)}>
          <Card
            variant="elevated"
            style={[styles.card, { borderWidth: 1, borderColor: ecoScore > 70 ? `${primaryColor}40` : 'rgba(150,150,150,0.15)' }]}
          >
            {/* Hero row: score + icon */}
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.eyebrow}>ECO SCORE</ThemedText>
                <ThemedText style={styles.heroNumber}>{Math.round(ecoScore)}</ThemedText>
                <ThemedText type="caption" style={{ color: ecoScore >= 70 ? primaryColor : '#FF9500', marginTop: 4 }}>
                  {getScoreBenchmark()}
                </ThemedText>
              </View>
              {/* Activity Rings */}
              <ActivityRings
                rings={[
                  { progress: ecoScore / 100,           color: primaryColor },
                  { progress: Math.min(totalOffset / 50, 1), color: '#00F0FF' },
                  { progress: Math.min(streakDays / 7, 1),   color: '#FFB800' },
                ]}
                size={110}
                strokeWidth={11}
                spacing={3}
              />
            </View>

            {/* Legend row */}
            <View style={[styles.row, { marginTop: Spacing.md, gap: Spacing.lg }]}>
              {[
                { color: primaryColor,  label: 'Eco Score' },
                { color: '#00F0FF',     label: 'Offset' },
                { color: '#FFB800',     label: 'Streak' },
              ].map(({ color, label }) => (
                <View key={label} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: color }]} />
                  <ThemedText type="caption" colorName="textSecondary">{label}</ThemedText>
                </View>
              ))}
            </View>

            {/* AI Insight */}
            <Animated.View style={[styles.insightBox, animatedInsightStyle]}>
              <AIOrb size={18} />
              <ThemedText type="caption" colorName="textSecondary" style={styles.insightText}>
                {getAiInsight()}
              </ThemedText>
            </Animated.View>
          </Card>
        </Animated.View>

        {/* ── Quick Stats row ────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.duration(400).delay(120)}>
          <Card variant="elevated" style={[styles.card, styles.statsRow]}>
            <StatPill label="Points"    value={`${ecoPoints}`}            color="#FFD700" />
            <View style={styles.statDivider} />
            <StatPill label="Offset kg" value={totalOffset.toFixed(1)}    color="#00F0FF" />
            <View style={styles.statDivider} />
            <StatPill label="Streak"    value={`${streakDays}d`}          color="#FF6B00" />
          </Card>
        </Animated.View>

        {/* ── Your Impact Zone (with HabitatVisualizer) ─────────── */}
        <SectionHeader label="Your Impact Zone" color="#00FFA3" />
        <Animated.View entering={FadeInDown.duration(400).delay(180)}>
          <Card
            variant="elevated"
            style={[styles.card, { borderWidth: 1, borderColor: 'rgba(0,255,163,0.2)', backgroundColor: 'rgba(10,22,14,0.9)' }]}
          >
            {/* Habitat header */}
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.eyebrow}>SELECTED HABITAT</ThemedText>
                <ThemedText type="h2" style={{ marginTop: 4 }}>
                  {habitat?.name ?? 'Habitat'}
                </ThemedText>
              </View>
              <ThemedText style={styles.habitatEmoji}>{habitat?.icon ?? '🌿'}</ThemedText>
            </View>

            {/* Phase 4: Growing habitat visualization */}
            <View style={{ marginTop: Spacing.md }}>
              <HabitatVisualizer
                habitatId={selectedHabitat}
                areaProtected={habitatProgress[selectedHabitat] || 0}
                impactCredits={impactCredits}
                onProtect={() => router.push('/impact-redeem')}
                primaryColor={primaryColor}
              />
            </View>
          </Card>
        </Animated.View>

        {/* ── Impact Network ─────────────────────────────────────── */}
        <SectionHeader label="Impact Network" color="#00FFA3" />
        <Animated.View entering={FadeInDown.duration(400).delay(240)}>
          <Card variant="elevated" style={[styles.card, { borderWidth: 1, borderColor: 'rgba(0,240,255,0.15)' }]}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.eyebrow}>YOUR REGION</ThemedText>
                <ThemedText type="h3" style={{ marginTop: 4 }}>India</ThemedText>
                <ThemedText type="caption" style={{ color: '#3BE8B0', marginTop: 2 }}>Global Top 5%</ThemedText>
              </View>
              <Globe size={28} color="#00F0FF" />
            </View>

            <View style={[styles.statsRow, { marginTop: Spacing.lg }]}>
              <StatPill label="Members"     value="1.2k" color="#00F0FF" />
              <View style={styles.statDivider} />
              <StatPill label="m² Protected" value="45k" color="#3BE8B0" />
            </View>

            <TouchableOpacity
              style={[styles.ctaButton, styles.ctaGhost, { marginTop: Spacing.md }]}
              activeOpacity={0.8}
              onPress={() => router.push('/corporate-leaderboard')}
            >
              <TrendingUp size={16} color="#FFF" />
              <ThemedText type="body" weight="bold" style={{ color: '#FFF', marginLeft: 6 }}>
                View Leaderboard
              </ThemedText>
            </TouchableOpacity>
          </Card>
        </Animated.View>

        {/* ── Active Challenge ────────────────────────────────────── */}
        {activeChallenge && (
          <>
            <SectionHeader label="Weekly Challenge" color="#FFB800" />
            <Animated.View entering={FadeInDown.duration(400).delay(300)}>
              <Card
                variant="elevated"
                style={[styles.card, { borderWidth: 1, borderColor: 'rgba(255,184,0,0.2)' }]}
              >
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <ThemedText type="h3" weight="bold">{activeChallenge.title}</ThemedText>
                    <ThemedText type="caption" colorName="textSecondary" style={{ marginTop: 4 }}>
                      {activeChallenge.daysLeft} days remaining
                    </ThemedText>
                  </View>
                  <View style={styles.challengeBadge}>
                    <ThemedText type="caption" weight="bold" style={{ color: '#FFB800' }}>
                      {activeChallenge.progress}%
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, { width: `${(activeChallenge.progress / activeChallenge.target) * 100}%` }]} />
                </View>
              </Card>
            </Animated.View>
          </>
        )}

        {/* ── Device Banner ───────────────────────────────────────── */}
        {!isDeviceBannerDismissed && (
          <Animated.View entering={FadeInDown.duration(300)}>
            <Card
              variant="outlined"
              style={[styles.card, { borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.03)' }]}
            >
              <View style={styles.row}>
                <View style={styles.deviceIcon}>
                  <Watch size={18} color={primaryColor} />
                </View>
                <View style={{ flex: 1, marginLeft: Spacing.md }}>
                  <ThemedText type="body" weight="bold">Connect your devices</ThemedText>
                  <ThemedText type="caption" colorName="textSecondary" style={{ marginTop: 2 }}>
                    Improves tracking accuracy by 30%
                  </ThemedText>
                </View>
                <TouchableOpacity onPress={dismissDeviceBanner} style={styles.dismissBtn} hitSlop={12}>
                  <X size={18} color="#555" />
                </TouchableOpacity>
              </View>
            </Card>
          </Animated.View>
        )}

        {/* ── Oakley EcoCoach ─────────────────────────────────────── */}
        <SectionHeader label="Daily Insight" color="#A0A0A0" />
        <Animated.View entering={FadeInDown.duration(400).delay(360)} style={styles.coachRow}>
          {/* Avatar */}
          <View style={[styles.coachAvatar, {
            backgroundColor: ecoScore > 70 ? 'rgba(59,232,176,0.1)' : 'rgba(255,149,0,0.1)',
            borderColor:     ecoScore > 70 ? 'rgba(59,232,176,0.3)' : 'rgba(255,149,0,0.3)',
          }]}>
            {ecoScore > 70
              ? <Flame size={18} color="#3BE8B0" />
              : <AlertTriangle size={18} color="#FF9500" />}
          </View>

          {/* Bubble */}
          <View style={styles.coachBubble}>
            <View style={styles.coachBubbleTop}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <ThemedText type="caption" weight="bold" style={{ color: '#FFF' }}>Oakley</ThemedText>
                <View style={[styles.oakleyBadge, {
                  backgroundColor: ecoScore > 70 ? 'rgba(59,232,176,0.15)' : 'rgba(255,149,0,0.15)',
                }]}>
                  <ThemedText type="tiny" style={{ color: ecoScore > 70 ? '#3BE8B0' : '#FF9500' }}>
                    AI Coach
                  </ThemedText>
                </View>
              </View>
              {lootCardAvailable && (
                <Animated.View entering={ZoomIn.delay(400)} style={styles.lootBadge}>
                  <ThemedText type="tiny" weight="bold" style={{ color: '#000' }}>🎁 LOOT</ThemedText>
                </Animated.View>
              )}
            </View>
            <ThemedText type="body" style={styles.coachText}>
              {getOakleyMessage(ecoScore, streakDays, impactCredits)}
            </ThemedText>

            {/* Coach action buttons */}
            <View style={styles.coachActions}>
              <TouchableOpacity
                style={styles.coachChip}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setIsWrapupVisible(true); }}
              >
                <ThemedText type="caption" weight="bold" style={{ color: '#CCC' }}>Weekly Wrap-up</ThemedText>
              </TouchableOpacity>
              {lootCardAvailable && (
                <TouchableOpacity
                  style={[styles.coachChip, { backgroundColor: primaryColor }]}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setIsScratchVisible(true); }}
                >
                  <ThemedText type="caption" weight="bold" style={{ color: '#000' }}>Claim Loot Card</ThemedText>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Animated.View>

        {/* ── Share ───────────────────────────────────────────────── */}
        <Button
          title={`Share score: ${Math.round(ecoScore)}`}
          variant="secondary"
          style={{ marginTop: Spacing.xl }}
          onPress={handleShare}
          isLoading={isSharing}
        />

      </ScrollView>

      {/* ── FAB ─────────────────────────────────────────────────── */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: primaryColor, bottom: Math.max(insets.bottom + 4, 16) + 60 }]}
        activeOpacity={0.85}
        onPress={() => bottomSheetRef.current?.present()}
      >
        <MessageCircle size={26} color="#000" />
      </TouchableOpacity>

      {/* ── Bottom Sheet ─────────────────────────────────────────── */}
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={['42%', '80%']}
        backgroundStyle={{ backgroundColor: cardColor }}
        handleIndicatorStyle={{ backgroundColor: 'rgba(255,255,255,0.15)', width: 36 }}
      >
        <BottomSheetView style={styles.sheetContent}>
          <ThemedText type="h3" style={{ marginBottom: Spacing.lg }}>AI Quick Actions</ThemedText>
          <View style={styles.quickRow}>
            <LiquidButton style={{ flex: 1 }}>
              <ThemedText type="body" weight="bold" style={{ color: '#000' }}>✈️ Log Flight</ThemedText>
            </LiquidButton>
            <LiquidButton
              style={{ flex: 1 }}
              onPress={() => { bottomSheetRef.current?.dismiss(); setIsScannerVisible(true); }}
            >
              <ThemedText type="body" weight="bold" style={{ color: '#000' }}>🍔 Scan Meal</ThemedText>
            </LiquidButton>
          </View>
          <Button
            title="Open Full Chat"
            variant="primary"
            onPress={() => { bottomSheetRef.current?.dismiss(); router.push('/chat'); }}
            style={{ marginTop: Spacing.xl }}
          />
        </BottomSheetView>
      </BottomSheetModal>

      {/* ── Modals ───────────────────────────────────────────────── */}
      <ScannerModal visible={isScannerVisible} onClose={() => setIsScannerVisible(false)} />

      <ScratchCard
        visible={isScratchVisible}
        onClose={() => setIsScratchVisible(false)}
        onWin={(pts) => { addPoints(pts, 'Daily Scratch Card Loot'); setLootCardAvailable(false); }}
      />

      <WeeklyWrapupModal
        visible={isWrapupVisible}
        onClose={() => setIsWrapupVisible(false)}
        onOffsetAll={() => {
          purchaseOffset({
            id: `offset_weekly_${Date.now()}`,
            title: 'Weekly Wrap Offset Credit',
            impact_kg: 13.6,
            price: 150,
            currency: 'PTS',
            timestamp: new Date().toISOString(),
          }, 150);
        }}
      />

      {/* Phase 4 — Welcome celebration (first-launch only) */}
      <WelcomeCelebration
        visible={showWelcome}
        credits={impactCredits}
        onDismiss={() => {
          setShowWelcome(false);
          setHasSeenWelcome();
        }}
      />
    </ThemedView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },

  scroll: {
    paddingHorizontal: Spacing.lg,   // 16px gutters
    paddingTop: Spacing.md,
  },

  // ── Island ──
  islandRow: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  island: {
    borderRadius: 28,
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 160,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  islandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  islandTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255,107,0,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  streakPillText: {
    color: '#FF6B00',
    fontSize: 12,
    fontWeight: '700',
  },
  islandBody: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
    gap: 6,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,107,0,0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
  },

  // ── Shared layout ──
  card: {
    marginBottom: Spacing.sm,   // tight 8px between cards in same section
    padding: Spacing.lg,        // 16px — Card base adds 20px, override via style
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // ── Score card ──
  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.45)',
    textTransform: 'uppercase',
  },
  heroNumber: {
    fontSize: 52,
    fontWeight: '800',
    color: '#FFF',
    lineHeight: 60,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 99,
  },
  insightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    padding: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  insightText: {
    marginLeft: Spacing.sm,
    flex: 1,
    lineHeight: 18,
  },

  // ── Inline Verify Card ──
  verifyIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  emissionChip: {
    backgroundColor: 'rgba(255,149,0,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,149,0,0.2)',
  },
  rewardChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59,232,176,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(59,232,176,0.2)',
  },
  moreChip: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  swipeHint: {
    marginTop: Spacing.md,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingTop: Spacing.sm,
  },
  // ── Streak Warning ──
  streakWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,69,58,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,69,58,0.25)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: 4,
  },
  streakWarningBtn: {
    backgroundColor: 'rgba(255,69,58,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,69,58,0.3)',
    marginLeft: Spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  // ── Impact Zone ──
  impactStatsRow: {
    flexDirection: 'row',
    marginTop: Spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  impactStat: {
    flex: 1,
    padding: Spacing.md,
  },

  // ── CTAs ──
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: Radius.lg,
  },
  ctaGhost: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  habitatEmoji: {
    fontSize: 40,
    lineHeight: 48,
  },

  // ── Challenge ──
  challengeBadge: {
    backgroundColor: 'rgba(255,184,0,0.15)',
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,184,0,0.3)',
  },
  progressBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    marginTop: Spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFB800',
    borderRadius: 3,
  },

  // ── User Header ──
  userHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  userEmail: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
  },
  signOutBtn: {
    backgroundColor: 'rgba(255, 69, 58, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  signOutText: {
    color: '#FF453A',
    fontSize: 12,
    fontWeight: '700',
  },

  // ── Device banner ──
  deviceIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(59,232,176,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissBtn: {
    padding: Spacing.sm,
  },

  // ── Oakley ──
  coachRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  coachAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    marginTop: 3,
    flexShrink: 0,
  },
  coachBubble: {
    flex: 1,
    backgroundColor: '#161616',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  coachBubbleTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  oakleyBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 99,
  },
  lootBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
  },
  coachText: {
    color: '#C8C8C8',
    lineHeight: 22,
  },
  coachActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  coachChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  // ── FAB ──
  fab: {
    position: 'absolute',
    right: Spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web:     { boxShadow: '0 6px 20px rgba(59,232,176,0.35)' } as any,
      default: {
        shadowColor: '#3BE8B0',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 10,
      },
    }),
  },

  // ── Bottom sheet ──
  sheetContent: {
    flex: 1,
    padding: Spacing.xl,
  },
  quickRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
});
