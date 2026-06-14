/**
 * WelcomeCelebration.tsx
 * Phase 4 — Ownership: First-launch celebration showing the 50 welcome credits gift.
 * Fires once, marks hasSeenWelcome in store, never shows again.
 */
import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withDelay, withTiming,
  FadeIn, FadeOut, ZoomIn, ZoomOut,
  withSequence, withRepeat,
} from 'react-native-reanimated';
import { ThemedText } from './themed-text';
import { Spacing, Radius } from '../constants/theme';
import { useEffect } from 'react';
import { Zap, Leaf, Star } from 'lucide-react-native';

interface Props {
  visible: boolean;
  credits: number;
  onDismiss: () => void;
}

function FloatingParticle({ delay, x, color }: { delay: number; x: number; color: string }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    setTimeout(() => {
      opacity.value = withSequence(withTiming(1, { duration: 300 }), withDelay(600, withTiming(0, { duration: 400 })));
      translateY.value = withTiming(-120, { duration: 1200 });
    }, delay);
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { translateX: x }],
  }));

  return (
    <Animated.View style={[styles.particle, style, { backgroundColor: color }]} />
  );
}

export function WelcomeCelebration({ visible, credits, onDismiss }: Props) {
  const scale = useSharedValue(0.6);
  const glow = useSharedValue(0.3);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 12, stiffness: 120 });
      glow.value = withRepeat(
        withSequence(withTiming(1, { duration: 800 }), withTiming(0.3, { duration: 800 })),
        4, true
      );
    }
  }, [visible]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value * 0.6,
  }));

  const particles = [
    { delay: 200, x: -40, color: '#3BE8B0' },
    { delay: 350, x: 20,  color: '#FFD700' },
    { delay: 500, x: -10, color: '#00F0FF' },
    { delay: 150, x: 50,  color: '#3BE8B0' },
    { delay: 600, x: -55, color: '#FFD700' },
    { delay: 400, x: 65,  color: '#FF6B00' },
  ];

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)} style={styles.overlay}>

        {/* Ambient glow ring */}
        <Animated.View style={[styles.glowRing, glowStyle]} />

        {/* Floating particles */}
        <View style={styles.particleContainer}>
          {particles.map((p, i) => (
            <FloatingParticle key={i} delay={p.delay} x={p.x} color={p.color} />
          ))}
        </View>

        <Animated.View style={[styles.card, cardStyle]}>

          {/* Top badge */}
          <Animated.View entering={ZoomIn.delay(200)} style={styles.iconBadge}>
            <Leaf size={32} color="#3BE8B0" />
          </Animated.View>

          <Animated.View entering={FadeIn.delay(300)}>
            <ThemedText type="tiny" style={styles.eyebrow}>WELCOME TO ECOTRACK</ThemedText>
            <ThemedText type="h1" style={styles.headline}>
              You've received
            </ThemedText>
          </Animated.View>

          {/* Credits display */}
          <Animated.View entering={ZoomIn.delay(450)} style={styles.creditsBadge}>
            <Zap size={20} color="#0B0B0B" />
            <ThemedText style={styles.creditsNumber}>{credits}</ThemedText>
            <ThemedText style={styles.creditsLabel}>Impact Credits</ThemedText>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(600)}>
            <ThemedText type="caption" style={styles.subtitle}>
              Your welcome gift. Use them to protect real habitat — mangrove forests, arctic ice, Amazon rainforest.
            </ThemedText>

            <View style={styles.benefitsRow}>
              {[
                { icon: '🌿', text: 'Protect real land' },
                { icon: '📍', text: `${(credits * 0.02).toFixed(1)} m² protected` },
                { icon: '🌍', text: 'Climate action' },
              ].map(({ icon, text }) => (
                <View key={text} style={styles.benefit}>
                  <ThemedText style={styles.benefitIcon}>{icon}</ThemedText>
                  <ThemedText type="tiny" style={styles.benefitText}>{text}</ThemedText>
                </View>
              ))}
            </View>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(800)}>
            <TouchableOpacity style={styles.ctaBtn} onPress={onDismiss} activeOpacity={0.85}>
              <Star size={16} color="#0B0B0B" />
              <ThemedText type="body" weight="bold" style={{ color: '#0B0B0B', marginLeft: 6 }}>
                Start Protecting
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipBtn} onPress={onDismiss}>
              <ThemedText type="caption" style={{ color: '#666' }}>Dismiss</ThemedText>
            </TouchableOpacity>
          </Animated.View>

        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  glowRing: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#3BE8B0',
    // web compat
    ...({ boxShadow: '0 0 120px 60px rgba(59,232,176,0.25)' } as any),
  },
  particleContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: '50%',
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#141414',
    borderRadius: 28,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(59,232,176,0.3)',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(59,232,176,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59,232,176,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
  },
  headline: {
    textAlign: 'center',
    color: '#FFF',
    marginTop: 4,
  },
  creditsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#3BE8B0',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
  },
  creditsNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0B0B0B',
    lineHeight: 38,
  },
  creditsLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B0B0B',
  },
  subtitle: {
    textAlign: 'center',
    color: '#888',
    lineHeight: 20,
    paddingHorizontal: Spacing.sm,
  },
  benefitsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  benefit: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  benefitIcon: { fontSize: 20 },
  benefitText: {
    color: '#888',
    textAlign: 'center',
    lineHeight: 16,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3BE8B0',
    height: 52,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.xxl,
  },
  skipBtn: {
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
});
