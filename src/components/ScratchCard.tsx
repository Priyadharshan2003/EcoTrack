import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, Pressable, Dimensions, Platform } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  withSequence,
  runOnJS,
  ZoomIn,
  FadeInUp,
  FadeOut
} from 'react-native-reanimated';
import { X, Sprout, Car, Flame, Wind, HelpCircle, Gift } from 'lucide-react-native';
import { ThemedText } from './themed-text';
import { Button } from './Button';
import { useThemeColor } from '../hooks/useThemeColor';
import * as Haptics from 'expo-haptics';
import { Spacing, Radius } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.85;

interface ScratchCardProps {
  visible: boolean;
  onClose: () => void;
  onWin: (points: number) => void;
}

interface ScratchCellProps {
  index: number;
  icon: React.ElementType;
  color: string;
  isScratched: boolean;
  onScratch: (index: number) => void;
}

function ScratchCell({ index, icon: Icon, color, isScratched, onScratch }: ScratchCellProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const primaryColor = useThemeColor({}, 'primary');

  const handlePress = () => {
    if (isScratched) return;
    
    // Play haptic click
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Silver overlay shrink & fade out
    scale.value = withTiming(0, { duration: 250 });
    opacity.value = withTiming(0, { duration: 250 }, (finished) => {
      if (finished) {
        runOnJS(onScratch)(index);
      }
    });
  };

  const overlayStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value
  }));

  return (
    <Pressable onPress={handlePress} style={styles.cellContainer}>
      {/* Hidden Icon (Revealed underneath) */}
      <View style={styles.revealedContent}>
        <Icon size={32} color={color} />
      </View>
      
      {/* Silver Scratch Overlay */}
      <Animated.View style={[styles.silverOverlay, overlayStyle]}>
        <Gift size={24} color="#666" />
      </Animated.View>
    </Pressable>
  );
}

export function ScratchCard({ visible, onClose, onWin }: ScratchCardProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const [scratchedCells, setScratchedCells] = useState<Record<number, boolean>>({});
  const [gameWon, setGameWon] = useState(false);
  const [pointsReward, setPointsReward] = useState(100);

  // Marketing taglines inspired by Swiggy/Zomato copywriting teams
  const marketingTaglines = [
    "Biryani Offset Confirmed! You ordered deliciousness, but offset its footprint. Oakley is shedding a happy tear!",
    "Eco Ride Activated! You skipped the gas-guzzling cab for the metro. You are a carbon tracking superhero!",
    "Zero Emission Day! Oakley has locked up the carbon smog. Tap to claim your green rewards!",
    "Oakley says: Your screen-time carbon footprint was offset. Oakley's nest is glowing bright green today!"
  ];
  
  const [tagline, setTagline] = useState(marketingTaglines[0]);

  // Seed 6 cells: index 0, 2, 4 are Sprout (Leaf) -> Match 3 Leafs to Win!
  const cells = [
    { icon: Sprout, color: '#00FFA3', label: 'Leaf' },
    { icon: Car, color: '#007AFF', label: 'Car' },
    { icon: Sprout, color: '#00FFA3', label: 'Leaf' },
    { icon: Flame, color: '#FF9500', label: 'Fire' },
    { icon: Sprout, color: '#00FFA3', label: 'Leaf' },
    { icon: Wind, color: '#5AC8FA', label: 'Wind' }
  ];

  useEffect(() => {
    if (visible) {
      setScratchedCells({});
      setGameWon(false);
      // Randomize tagline and points reward (+50 to +200)
      setTagline(marketingTaglines[Math.floor(Math.random() * marketingTaglines.length)]);
      setPointsReward(50 + Math.floor(Math.random() * 16) * 10); // 50, 60, ... 200
    }
  }, [visible]);

  const handleScratch = (index: number) => {
    setScratchedCells(prev => {
      const updated = { ...prev, [index]: true };
      
      // Check if all Sprout (index 0, 2, 4) have been scratched
      if (updated[0] && updated[2] && updated[4]) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setGameWon(true);
      }
      
      return updated;
    });
  };

  const handleClaim = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onWin(pointsReward);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBg}>
        <Animated.View 
          entering={ZoomIn.duration(300)}
          exiting={FadeOut}
          style={styles.cardContainer}
        >
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <ThemedText type="default" weight="bold" style={styles.headerTitle}>🌱 EcoLoot Card</ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color="#888" />
            </TouchableOpacity>
          </View>

          {/* Subtitle */}
          <ThemedText type="small" colorName="textSecondary" style={styles.subtitle}>
            Scratch off the silver boxes to reveal 3 matching Leaf icons!
          </ThemedText>

          {/* Grid of 6 Scratch Cells */}
          <View style={styles.gridContainer}>
            {cells.map((cell, idx) => (
              <ScratchCell
                key={idx}
                index={idx}
                icon={cell.icon}
                color={cell.color}
                isScratched={!!scratchedCells[idx]}
                onScratch={handleScratch}
              />
            ))}
          </View>

          {/* Win Screen overlay */}
          {gameWon ? (
            <Animated.View entering={FadeInUp.springify().damping(12)} style={styles.winContainer}>
              <Gift size={40} color={primaryColor} style={{ marginBottom: 12 }} />
              <ThemedText type="subtitle" weight="bold" style={styles.winTitle}>Match-3 Sprout Win!</ThemedText>
              
              {/* Marketing Tagline */}
              <ThemedText type="small" style={styles.winTagline}>
                {tagline}
              </ThemedText>

              <View style={styles.rewardBox}>
                <ThemedText type="large" weight="bold" style={{ color: primaryColor }}>
                  +{pointsReward} EcoPoints
                </ThemedText>
              </View>

              <Button
                title="Claim Loot"
                variant="primary"
                onPress={handleClaim}
                style={styles.claimBtn}
              />
            </Animated.View>
          ) : (
            <View style={styles.scratchNoticeContainer}>
              <HelpCircle size={18} color="#888" />
              <ThemedText type="small" colorName="textSecondary" style={{ marginLeft: 8 }}>
                Wipe to scratch the silver cards
              </ThemedText>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  cardContainer: {
    width: CARD_WIDTH,
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: '#242424',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: '0px 10px 40px rgba(0,255,163,0.1)' } as any,
      default: {
        shadowColor: '#00FFA3',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
      }
    })
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: Spacing.xs,
  },
  headerTitle: {
    color: '#FFF',
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  cellContainer: {
    width: (CARD_WIDTH - Spacing.lg * 2 - Spacing.md * 2) / 3, // 3 columns
    height: (CARD_WIDTH - Spacing.lg * 2 - Spacing.md * 2) / 3,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#2D2D2D',
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  revealedContent: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  silverOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#3A3A3C',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Radius.md - 1,
    borderWidth: 1,
    borderColor: '#48484A',
  },
  winContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderColor: '#242424',
  },
  winTitle: {
    color: '#FFF',
    marginBottom: Spacing.xs,
  },
  winTagline: {
    color: '#888',
    textAlign: 'center',
    lineHeight: 18,
    marginVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  rewardBox: {
    backgroundColor: 'rgba(0, 255, 163, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 163, 0.2)',
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    marginVertical: Spacing.md,
  },
  claimBtn: {
    width: '100%',
  },
  scratchNoticeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
  }
});
