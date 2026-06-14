/**
 * HabitatVisualizer.tsx
 * Phase 4 — Ownership: Growing habitat visualization.
 * Shows seedling → sapling → young tree → full tree based on m² protected.
 */
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withRepeat, withSequence, withTiming,
  FadeInDown,
} from 'react-native-reanimated';
import { ThemedText } from './themed-text';
import { Spacing, Radius } from '../constants/theme';
import { useEffect } from 'react';

interface Props {
  habitatId: string;
  areaProtected: number; // m²
  impactCredits: number;
  onProtect: () => void;
  primaryColor: string;
}

function getGrowthStage(area: number) {
  if (area === 0)   return { emoji: '🌱', label: 'Seedling',   sublabel: 'Plant your first m²', color: '#4CAF50', progress: 0 };
  if (area < 1)     return { emoji: '🌿', label: 'Sprout',     sublabel: `${area.toFixed(2)} m² protected`, color: '#56C785', progress: area };
  if (area < 5)     return { emoji: '🌳', label: 'Sapling',    sublabel: `${area.toFixed(1)} m² protected`, color: '#3BE8B0', progress: area / 5 };
  if (area < 20)    return { emoji: '🌲', label: 'Young Tree', sublabel: `${area.toFixed(1)} m² protected`, color: '#00F0FF', progress: area / 20 };
  if (area < 100)   return { emoji: '🌴', label: 'Mature',     sublabel: `${area.toFixed(0)} m² protected`, color: '#FFD700', progress: area / 100 };
  return             { emoji: '🏔️', label: 'Guardian',   sublabel: `${area.toFixed(0)} m² — Legend!`,  color: '#FF6B00', progress: 1 };
}

function getNextMilestone(area: number): { target: number; label: string } {
  if (area < 1)   return { target: 1,   label: 'Sprout' };
  if (area < 5)   return { target: 5,   label: 'Sapling' };
  if (area < 20)  return { target: 20,  label: 'Young Tree' };
  if (area < 100) return { target: 100, label: 'Mature Tree' };
  return           { target: 500, label: 'Guardian' };
}

export function HabitatVisualizer({ areaProtected, impactCredits, onProtect, primaryColor }: Props) {
  const stage = getGrowthStage(areaProtected);
  const milestone = getNextMilestone(areaProtected);
  const progressPct = Math.min(stage.progress * 100, 100);

  // Gentle floating animation — started in effect, never during render
  const floatY = useSharedValue(0);
  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 1800 }),
        withTiming(0,  { duration: 1800 })
      ),
      -1,
      true
    );
  }, []); // runs once on mount

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  // Progress bar — animates to correct width, re-runs when progress changes
  const barWidth = useSharedValue(0);
  useEffect(() => {
    barWidth.value = withSpring(progressPct, { damping: 18, stiffness: 80 });
  }, [progressPct]); // re-animates when stage changes

  const barStyle = useAnimatedStyle(() => ({ width: `${barWidth.value}%` as any }));

  const nextCreditsNeeded = Math.ceil((milestone.target - areaProtected) * 50);

  return (
    <Animated.View entering={FadeInDown.duration(400)} style={styles.container}>
      {/* Stage indicator */}
      <View style={styles.stageRow}>
        <View style={[styles.stageBadge, { borderColor: `${stage.color}50`, backgroundColor: `${stage.color}12` }]}>
          <ThemedText type="tiny" style={{ color: stage.color, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            {stage.label}
          </ThemedText>
        </View>
        <ThemedText type="caption" colorName="textSecondary">{stage.sublabel}</ThemedText>
      </View>

      {/* Central visual */}
      <View style={styles.centerVisual}>
        {/* Concentric glow rings */}
        <View style={[styles.glowOuter, { borderColor: `${stage.color}18` }]} />
        <View style={[styles.glowInner, { borderColor: `${stage.color}35` }]} />

        {/* Animated emoji tree */}
        <Animated.View style={[styles.emojiWrapper, floatStyle]}>
          <ThemedText style={styles.emoji}>{stage.emoji}</ThemedText>
        </Animated.View>

        {/* Area badge */}
        {areaProtected > 0 && (
          <Animated.View
            entering={FadeInDown.delay(300)}
            style={[styles.areaBadge, { backgroundColor: `${stage.color}20`, borderColor: `${stage.color}40` }]}
          >
            <ThemedText type="tiny" style={{ color: stage.color, fontWeight: '700' }}>
              {areaProtected.toFixed(2)} m²
            </ThemedText>
          </Animated.View>
        )}
      </View>

      {/* Growth progress bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressLabelRow}>
          <ThemedText type="caption" colorName="textSecondary">
            Progress to {milestone.label}
          </ThemedText>
          <ThemedText type="caption" style={{ color: stage.color, fontWeight: '700' }}>
            {progressPct.toFixed(0)}%
          </ThemedText>
        </View>
        <View style={styles.progressBg}>
          <Animated.View style={[styles.progressFill, barStyle, { backgroundColor: stage.color }]} />
        </View>
        <ThemedText type="tiny" style={{ color: '#666', marginTop: 4 }}>
          {areaProtected < milestone.target
            ? `${nextCreditsNeeded} more credits needed`
            : '✓ Milestone reached!'}
        </ThemedText>
      </View>

      {/* CTA */}
      <TouchableOpacity
        style={[styles.cta, { backgroundColor: impactCredits >= 10 ? primaryColor : 'rgba(255,255,255,0.06)' }]}
        onPress={onProtect}
        activeOpacity={0.85}
      >
        <ThemedText
          type="body"
          weight="bold"
          style={{ color: impactCredits >= 10 ? '#0B0B0B' : '#555' }}
        >
          {impactCredits >= 10 ? `Grow with ${impactCredits} credits` : 'Earn more credits →'}
        </ThemedText>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  stageBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  centerVisual: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 140,
    position: 'relative',
  },
  glowOuter: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
  },
  glowInner: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
  },
  emojiWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 56,
    lineHeight: 68,
  },
  areaBadge: {
    position: 'absolute',
    bottom: 0,
    right: '25%',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  progressSection: {
    gap: 4,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  cta: {
    height: 48,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
});
