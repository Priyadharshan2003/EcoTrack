import React, { forwardRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { ThemedText } from './themed-text';
import { useStore } from '../store';
import { Colors, Spacing, Radius } from '../constants/theme';
import { Leaf, Award, Globe } from 'lucide-react-native';

const BANNER_WIDTH = 400;
const BANNER_HEIGHT = 711; // 16:9 ratio for Instagram Stories

export const ShareBanner = forwardRef<any>((props, ref) => {
  const carbonScore = useStore((state) => state.carbonScore);
  const ecoScore = useStore((state) => state.ecoScore);

  return (
    <ViewShot 
      ref={ref} 
      options={{ format: 'png', quality: 1.0 }} 
      style={styles.container}
    >
      <View style={styles.banner}>
        {/* Background Decorative Elements */}
        <View style={styles.decorationCircle1} />
        <View style={styles.decorationCircle2} />

        {/* Header */}
        <View style={styles.header}>
          <Leaf size={24} color="#00FFA3" />
          <ThemedText style={styles.brandText}>ECOTRACK AI</ThemedText>
        </View>

        {/* Main Content Area */}
        <View style={styles.mainContent}>
          <ThemedText style={styles.label}>MY ECO SCORE</ThemedText>
          <ThemedText style={styles.scoreLarge}>{ecoScore.toFixed(0)}</ThemedText>
          
          <View style={styles.pillBadge}>
            <Award size={16} color="#000" />
            <ThemedText style={styles.pillText}>Top 10% Contributor</ThemedText>
          </View>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statBox}>
            <ThemedText style={styles.statValue}>{carbonScore.toFixed(1)}</ThemedText>
            <ThemedText style={styles.statLabel}>kg CO₂ Today</ThemedText>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <ThemedText style={styles.statValue}>+3</ThemedText>
            <ThemedText style={styles.statLabel}>Day Streak</ThemedText>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Globe size={16} color="#888" />
            <ThemedText style={styles.url}>ecotrack.ai</ThemedText>
          </View>
          <ThemedText style={styles.username}>@eco_warrior</ThemedText>
        </View>
      </View>
    </ViewShot>
  );
});

const styles = StyleSheet.create({
  container: {
    // Rendered off-screen
    position: 'absolute',
    left: -10000,
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
  },
  banner: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    backgroundColor: '#09090B', // Pitch dark premium background
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  decorationCircle1: {
    position: 'absolute',
    top: -150,
    right: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(0, 255, 163, 0.05)',
  },
  decorationCircle2: {
    position: 'absolute',
    bottom: 50,
    left: -150,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(0, 255, 163, 0.08)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.xl,
    paddingTop: Spacing.xxl,
  },
  brandText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 3,
    marginLeft: Spacing.sm,
  },
  mainContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  label: {
    color: '#00FFA3',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 4,
    marginBottom: Spacing.sm,
  },
  scoreLarge: {
    color: '#FFF',
    fontSize: 140,
    fontWeight: '900',
    lineHeight: 160,
    includeFontPadding: false,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00FFA3',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 99,
    marginTop: Spacing.md,
  },
  pillText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: Spacing.xs,
  },
  statsCard: {
    flexDirection: 'row',
    marginHorizontal: Spacing.xl,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: Spacing.md,
  },
  statValue: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '800',
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  url: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  username: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  }
});
