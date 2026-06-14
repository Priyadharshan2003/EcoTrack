import {
  Platform, StyleSheet, View, TouchableOpacity,
  ScrollView, RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../store';
import { ThemedView } from '../../components/themed-view';
import { ThemedText } from '../../components/themed-text';
import { SwipeableCard } from '../../components/SwipeableCard';
import { Spacing, Radius } from '../../constants/theme';
import {
  Check, X, CarFront, Utensils, Footprints,
  Sparkles, CloudRain, Zap, ChevronRight,
  ArrowLeftRight, TrendingDown,
} from 'lucide-react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown, FadeOut, ZoomIn } from 'react-native-reanimated';
import { useState, useEffect, useCallback, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { toHumanScale, toTrueCostLabel, toOffsetAction } from '../../utils/carbonTranslations';

// ─── +50 pts toast ────────────────────────────────────────────────────────────
function PointsToast({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <Animated.View
      entering={ZoomIn.springify().damping(14)}
      exiting={FadeOut.duration(300)}
      style={styles.toast}
    >
      <Zap size={14} color="#000" />
      <ThemedText style={styles.toastText}>+50 pts</ThemedText>
    </Animated.View>
  );
}

// ─── Activity type helpers ────────────────────────────────────────────────────
function getIcon(type: string, size = 44) {
  switch (type) {
    case 'cab_travel': return <CarFront   size={size} color="#00F0FF" />;
    case 'food_order': return <Utensils   size={size} color="#FFB800" />;
    case 'walk':
    case 'bike':       return <Footprints size={size} color="#3BE8B0" />;
    default:           return <Footprints size={size} color="#3BE8B0" />;
  }
}

function getAccentColor(type: string): string {
  switch (type) {
    case 'cab_travel': return '#00F0FF';
    case 'food_order': return '#FFB800';
    default:           return '#3BE8B0';
  }
}

function getGradient(type: string): [string, string] {
  switch (type) {
    case 'cab_travel': return ['rgba(0,240,255,0.12)', 'rgba(0,0,0,0)'];
    case 'food_order': return ['rgba(255,184,0,0.12)', 'rgba(0,0,0,0)'];
    default:           return ['rgba(59,232,176,0.14)', 'rgba(0,0,0,0)'];
  }
}

const isGreen = (type: string) => type === 'walk' || type === 'bike';

// ─── Progress bar: how many cards left ───────────────────────────────────────
function QueueProgress({ total, done }: { total: number; done: number }) {
  if (total === 0) return null;
  const pct = (done / (total + done)) * 100;
  return (
    <View style={styles.queueRow}>
      <View style={styles.queueBg}>
        <View style={[styles.queueFill, { width: `${pct}%` }]} />
      </View>
      <ThemedText type="tiny" style={styles.queueLabel}>
        {total} remaining
      </ThemedText>
    </View>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────
export default function VerifyScreen() {
  const insets = useSafeAreaInsets();
  const pendingActivities   = useStore((s) => s.pendingActivities);
  const verifiedActivities  = useStore((s) => s.verifiedActivities);
  const verifyActivity      = useStore((s) => s.verifyActivity);
  const addPendingActivities = useStore((s) => s.addPendingActivities);
  const corporateEmail      = useStore((s) => s.corporateEmail);
  const ecoPoints           = useStore((s) => s.ecoPoints);

  const [refreshing, setRefreshing] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const primaryColor = useThemeColor({}, 'primary');
  const dangerColor  = useThemeColor({}, 'danger');

  const showToast = () => {
    setToastVisible(false);
    // Force re-mount for repeat toasts
    requestAnimationFrame(() => setToastVisible(true));
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 1600);
  };

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1400));
    addPendingActivities([{
      id: `task_${Date.now()}`,
      title: 'Coffee Run',
      type: 'food_order',
      description: 'Picked up a latte from Starbucks',
      emissions_kg: 0.8,
      timestamp: new Date().toISOString(),
      status: 'pending',
      confidence: 0.95,
      inferred_from: ['location'],
    }]);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const t = setInterval(onRefresh, 60 * 60 * 1000);
    return () => clearInterval(t);
  }, [onRefresh]);

  const todayVerified = verifiedActivities.length;

  return (
    <ThemedView style={[styles.screen, { paddingTop: insets.top }]}>

      {/* Toast — positioned relative to safe area */}
      <PointsToast visible={toastVisible} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: 110 + insets.bottom },
          pendingActivities.length > 0 && { flexGrow: 1 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={primaryColor}
            colors={[primaryColor]}
          />
        }
      >

        {/* ── Header ─────────────────────────────────────────────── */}
        <View style={styles.header}>
          {/* Top meta row */}
          <View style={styles.headerMeta}>
            <View style={styles.pointsBadge}>
              <Zap size={12} color="#FFD700" />
              <ThemedText type="tiny" style={{ color: '#FFD700', marginLeft: 4, fontWeight: '700' }}>
                {ecoPoints} pts
              </ThemedText>
            </View>
            {todayVerified > 0 && (
              <View style={styles.verifiedBadge}>
                <Check size={12} color="#3BE8B0" />
                <ThemedText type="tiny" style={{ color: '#3BE8B0', marginLeft: 4, fontWeight: '700' }}>
                  {todayVerified} verified today
                </ThemedText>
              </View>
            )}
          </View>

          <ThemedText type="h2" style={styles.title}>Verify your day</ThemedText>
          <ThemedText type="caption" colorName="textSecondary" style={styles.subtitle}>
            {pendingActivities.length > 0
              ? `${pendingActivities.length} activit${pendingActivities.length === 1 ? 'y' : 'ies'} detected by AI`
              : 'All clear — pull down to sync'}
          </ThemedText>

          {/* Swipe hint row */}
          {pendingActivities.length > 0 && (
            <Animated.View entering={FadeIn.delay(300)} style={styles.swipeHintRow}>
              <View style={styles.swipeHintChip}>
                <X size={12} color={dangerColor} />
                <ThemedText type="tiny" style={{ color: dangerColor, marginLeft: 4 }}>Reject</ThemedText>
              </View>
              <ArrowLeftRight size={14} color="#444" />
              <View style={[styles.swipeHintChip, { borderColor: `${primaryColor}40`, backgroundColor: `${primaryColor}10` }]}>
                <Check size={12} color={primaryColor} />
                <ThemedText type="tiny" style={{ color: primaryColor, marginLeft: 4 }}>Confirm</ThemedText>
              </View>
            </Animated.View>
          )}

          {/* Queue progress bar */}
          <QueueProgress total={pendingActivities.length} done={todayVerified} />
        </View>

        {/* ── Cards / Empty State ────────────────────────────────── */}
        {pendingActivities.length === 0 ? (

          // ── Empty State ────────────────────────────────────────
          <Animated.View entering={FadeInDown.duration(400)} style={styles.emptyState}>
            <View style={styles.emptyIconRing}>
              <Check size={52} color={primaryColor} />
            </View>

            <View style={styles.emptyBadge}>
              <Sparkles size={14} color="#00FFA3" />
              <ThemedText type="tiny" weight="bold" style={{ color: '#00FFA3', marginLeft: 5 }}>
                All Caught Up
              </ThemedText>
            </View>

            <ThemedText type="h2" style={styles.emptyTitle}>Inbox Zero!</ThemedText>
            <ThemedText type="body" colorName="textSecondary" style={styles.emptyBody}>
              You've cleared your daily queue.{'\n'}EcoTrack AI is monitoring your next activities.
            </ThemedText>

            {todayVerified > 0 && (
              <View style={styles.verifiedSummary}>
                <TrendingDown size={16} color="#3BE8B0" />
                <ThemedText type="caption" style={{ color: '#3BE8B0', marginLeft: 6 }}>
                  {todayVerified} activities verified · +{todayVerified * 50} pts earned today
                </ThemedText>
              </View>
            )}

            <TouchableOpacity
              style={styles.emptyRefreshBtn}
              onPress={onRefresh}
              activeOpacity={0.8}
            >
              <ThemedText type="body" weight="bold" colorName="primary">Pull to refresh</ThemedText>
              <ChevronRight size={16} color={primaryColor} />
            </TouchableOpacity>

            {corporateEmail && (
              <TouchableOpacity
                style={styles.leaderboardBtn}
                onPress={() => router.push('/corporate-leaderboard')}
              >
                <ThemedText type="body" weight="bold" colorName="primary">View Leaderboard</ThemedText>
              </TouchableOpacity>
            )}
          </Animated.View>

        ) : (

          // ── Card Deck ─────────────────────────────────────────
          <View style={styles.deckContainer}>
            {[...pendingActivities].reverse().map((activity, reversedIndex) => {
              const forwardIndex = pendingActivities.length - 1 - reversedIndex;
              if (forwardIndex > 2) return null;
              const accent  = getAccentColor(activity.type);
              const green   = isGreen(activity.type);

              return (
                <SwipeableCard
                  key={activity.id}
                  index={forwardIndex}
                  onSwipeRight={() => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    showToast();
                    verifyActivity(activity.id, true);
                  }}
                  onSwipeLeft={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    verifyActivity(activity.id, false);
                  }}
                >
                  {/* Background gradient */}
                  <LinearGradient
                    colors={getGradient(activity.type)}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                  />

                  <View style={styles.cardInner}>

                    {/* ── Top: icon + title ── */}
                    <View style={styles.cardTop}>
                      <View style={[styles.iconRing, { borderColor: `${accent}35`, backgroundColor: `${accent}12` }]}>
                        {getIcon(activity.type)}
                      </View>

                      <ThemedText type="h1" style={styles.cardTitle}>{activity.title}</ThemedText>
                      <ThemedText type="caption" colorName="textSecondary" style={styles.cardDesc}>
                        {activity.description}
                      </ThemedText>

                      {/* Confidence badge */}
                      <View style={[styles.confidenceBadge, { backgroundColor: `${accent}14`, borderColor: `${accent}30` }]}>
                        <ThemedText type="tiny" style={{ color: accent, fontWeight: '700' }}>
                          {Math.round(activity.confidence * 100)}% AI confidence
                        </ThemedText>
                      </View>
                    </View>

                    {/* ── Middle: metrics ── */}
                    <View style={styles.metricsRow}>
                      <View style={[styles.metricPill, { backgroundColor: `${accent}14`, borderColor: `${accent}25` }]}>
                        <CloudRain size={13} color={accent} />
                        <ThemedText type="caption" weight="bold" style={{ color: accent, marginLeft: 5 }}>
                          {green ? 'Zero emissions' : `+${activity.emissions_kg} kg CO₂`}
                        </ThemedText>
                      </View>
                      <View style={styles.metricPill}>
                        <ThemedText type="caption" colorName="textSecondary">
                          {toHumanScale(activity.emissions_kg)}
                        </ThemedText>
                      </View>
                    </View>

                    {/* ── Bottom: true cost or green badge ── */}
                    {green ? (
                      <View style={[styles.costBox, { backgroundColor: 'rgba(59,232,176,0.06)', borderColor: '#3BE8B0' }]}>
                        <ThemedText type="caption" weight="bold" style={{ color: '#3BE8B0' }}>
                          🌿 Green Choice
                        </ThemedText>
                        <ThemedText type="caption" style={styles.costText}>
                          {toTrueCostLabel(activity.type, activity.emissions_kg)}
                        </ThemedText>
                      </View>
                    ) : (
                      <View style={styles.costBox}>
                        <ThemedText type="caption" weight="bold" style={{ color: '#FF453A' }}>
                          True Cost
                        </ThemedText>
                        <ThemedText type="caption" style={styles.costText}>
                          {toTrueCostLabel(activity.type, activity.emissions_kg)}
                        </ThemedText>
                        <TouchableOpacity
                          style={styles.offsetBtn}
                          onPress={() => router.push('/impact-redeem')}
                          activeOpacity={0.8}
                        >
                          <Zap size={11} color="#3BE8B0" />
                          <ThemedText type="tiny" weight="bold" style={{ color: '#3BE8B0', marginLeft: 4 }}>
                            {toOffsetAction(activity.emissions_kg)}
                          </ThemedText>
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* ── Reward row ── */}
                    <View style={styles.rewardRow}>
                      <View style={styles.rewardPill}>
                        <Zap size={12} color="#FFD700" />
                        <ThemedText type="tiny" weight="bold" style={{ color: '#FFD700', marginLeft: 4 }}>
                          +50 pts on confirm
                        </ThemedText>
                      </View>
                    </View>

                  </View>
                </SwipeableCard>
              );
            })}
          </View>
        )}

      </ScrollView>
    </ThemedView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: Spacing.lg,
  },

  // Toast
  toast: {
    position: 'absolute',
    top: 70,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#3BE8B0',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8,
    borderRadius: Radius.full,
    zIndex: 999,
    ...Platform.select({
      web:     { boxShadow: '0 4px 16px rgba(59,232,176,0.5)' } as any,
      default: { shadowColor: '#3BE8B0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 8 },
    }),
  },
  toastText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '800',
  },

  // Header
  header: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    alignItems: 'center',
  },
  headerMeta: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,215,0,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.2)',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59,232,176,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(59,232,176,0.2)',
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  swipeHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  swipeHintChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,69,58,0.3)',
    backgroundColor: 'rgba(255,69,58,0.08)',
  },
  queueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    width: '100%',
    paddingHorizontal: Spacing.md,
  },
  queueBg: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  queueFill: {
    height: '100%',
    backgroundColor: '#FFB800',
    borderRadius: 2,
  },
  queueLabel: {
    color: '#555',
    minWidth: 70,
    textAlign: 'right',
  },

  deckContainer: {
    height: 520,
    width: '100%',
    alignItems: 'center',
    marginTop: Spacing.md,
    position: 'relative',
  },

  // Card internals
  cardInner: {
    padding: Spacing.xl,
    width: '100%',
    height: 520,
    justifyContent: 'space-between',
  },
  cardTop: {
    alignItems: 'center',
    gap: 8,
  },
  iconRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  cardTitle: {
    textAlign: 'center',
    color: '#FFF',
  },
  cardDesc: {
    textAlign: 'center',
    lineHeight: 18,
  },
  confidenceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    marginTop: 4,
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  metricPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  costBox: {
    backgroundColor: 'rgba(255,69,58,0.06)',
    borderLeftWidth: 3,
    borderLeftColor: '#FF453A',
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: 4,
  },
  costText: {
    color: '#AAA',
    lineHeight: 18,
  },
  offsetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 4,
    backgroundColor: 'rgba(59,232,176,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(59,232,176,0.25)',
  },
  rewardRow: {
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  rewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,215,0,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.15)',
  },

  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.xxl,
    gap: Spacing.md,
  },
  emptyIconRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0,255,163,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(0,255,163,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,255,163,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(0,255,163,0.2)',
  },
  emptyTitle: {
    textAlign: 'center',
  },
  emptyBody: {
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.xl,
  },
  verifiedSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59,232,176,0.07)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.full,
  },
  emptyRefreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm,
  },
  leaderboardBtn: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderRadius: Radius.full,
    borderColor: 'rgba(0,255,163,0.3)',
    backgroundColor: 'rgba(0,255,163,0.05)',
  },
});
