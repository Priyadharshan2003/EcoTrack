import { StyleSheet, View, TouchableOpacity, ScrollView, Animated as RNAnimated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { ThemedView } from '../components/themed-view';
import { ThemedText } from '../components/themed-text';
import { Spacing, Radius } from '../constants/theme';
import { ChevronLeft, Globe, Check } from 'lucide-react-native';
import { useThemeColor } from '../hooks/useThemeColor';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useState } from 'react';
import { getHabitatsForRegion, convertCreditsToArea } from '../constants/habitats';
import { LinearGradient } from 'expo-linear-gradient';

export default function ImpactRedeemScreen() {
  const insets = useSafeAreaInsets();
  const primaryColor = useThemeColor({}, 'primary');
  
  const impactCredits = useStore((state) => state.impactCredits);
  const userRegion = useStore((state) => state.userRegion);
  const redeemCredits = useStore((state) => state.redeemCredits);
  const selectedHabitatId = useStore((state) => state.selectedHabitat);
  const setSelectedHabitat = useStore((state) => state.setSelectedHabitat);

  const availableHabitats = getHabitatsForRegion(userRegion);
  
  // Slider state for how many credits they want to spend
  const [spendAmount, setSpendAmount] = useState(Math.min(100, impactCredits));
  
  const selectedHabitat = availableHabitats.find(h => h.id === selectedHabitatId) || availableHabitats[0];
  const projectedArea = convertCreditsToArea(spendAmount, selectedHabitat.id);

  const handleRedeem = () => {
    if (spendAmount <= 0 || spendAmount > impactCredits) return;
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    redeemCredits(spendAmount, selectedHabitat.id, projectedArea);
    
    // Reset slider
    setSpendAmount(0);
    alert(`Success! You just protected ${projectedArea} m² of ${selectedHabitat.name}!`);
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <ThemedText type="subtitle" weight="bold">Impact Zone</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: Spacing.xxl }}>
        <Animated.View entering={FadeInUp.delay(100)} style={styles.heroSection}>
          <ThemedText type="large" style={{ textAlign: 'center', marginBottom: Spacing.sm }}>
            Turn Your Carbon Savings into Real Protection
          </ThemedText>
          <View style={styles.balanceBadge}>
            <Globe size={18} color={primaryColor} />
            <ThemedText type="default" weight="bold" style={{ marginLeft: 8, color: primaryColor }}>
              {impactCredits} Credits Available
            </ThemedText>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200)} style={styles.section}>
          <ThemedText type="subtitle" weight="bold" style={{ marginBottom: Spacing.md }}>
            Select Ecosystem
          </ThemedText>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: Spacing.lg }}>
            {availableHabitats.map((habitat) => {
              const isSelected = habitat.id === selectedHabitatId;
              return (
                <TouchableOpacity
                  key={habitat.id}
                  style={[
                    styles.habitatCard,
                    isSelected && { borderColor: primaryColor, backgroundColor: 'rgba(0, 255, 163, 0.1)' }
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setSelectedHabitat(habitat.id);
                  }}
                >
                  <View style={styles.habitatIconBox}>
                    <ThemedText type="large" style={{ fontSize: 32 }}>{habitat.icon}</ThemedText>
                  </View>
                  <ThemedText type="default" weight="bold">{habitat.name}</ThemedText>
                  <ThemedText type="small" colorName="textSecondary">{habitat.animal}</ThemedText>
                  
                  {isSelected && (
                    <View style={styles.checkBadge}>
                      <Check size={12} color="#000" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300)} style={styles.section}>
          <LinearGradient
            colors={['rgba(255,255,255,0.05)', 'rgba(0,0,0,0.2)']}
            style={styles.conversionBox}
          >
            <ThemedText type="small" colorName="textSecondary" style={{ textAlign: 'center' }}>
              Conversion Preview
            </ThemedText>
            
            <View style={styles.conversionRow}>
              <View style={styles.conversionCol}>
                <ThemedText type="title" weight="bold">{spendAmount}</ThemedText>
                <ThemedText type="small">Credits</ThemedText>
              </View>
              
              <ThemedText type="title" colorName="textSecondary">→</ThemedText>
              
              <View style={styles.conversionCol}>
                <ThemedText type="title" weight="bold" style={{ color: primaryColor }}>{projectedArea}</ThemedText>
                <ThemedText type="small" style={{ color: primaryColor }}>m² Protected</ThemedText>
              </View>
            </View>

            {/* Simulated Slider Control using simple buttons for now */}
            <View style={styles.sliderControls}>
              <TouchableOpacity 
                style={styles.sliderBtn}
                onPress={() => setSpendAmount(Math.max(10, spendAmount - 50))}
              >
                <ThemedText type="default">-</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.sliderBtn}
                onPress={() => setSpendAmount(impactCredits)}
              >
                <ThemedText type="small">MAX</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.sliderBtn}
                onPress={() => setSpendAmount(Math.min(impactCredits, spendAmount + 50))}
              >
                <ThemedText type="default">+</ThemedText>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400)} style={{ marginTop: Spacing.xl, paddingHorizontal: Spacing.lg }}>
          <TouchableOpacity 
            style={[
              styles.redeemButton, 
              (spendAmount <= 0 || impactCredits === 0) && { opacity: 0.5 }
            ]}
            disabled={spendAmount <= 0 || impactCredits === 0}
            onPress={handleRedeem}
          >
            <LinearGradient
              colors={['#00FFA3', '#00B8FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <ThemedText type="default" weight="bold" style={{ color: '#000' }}>
              Redeem Now
            </ThemedText>
          </TouchableOpacity>
          <ThemedText type="small" colorName="textSecondary" style={{ textAlign: 'center', marginTop: Spacing.md }}>
            Your {spendAmount} credits = ₹{(spendAmount * 0.02).toFixed(2)} donated to verified climate NGOs
          </ThemedText>
        </Animated.View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroSection: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  balanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 163, 0.1)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    marginTop: Spacing.md,
  },
  section: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  habitatCard: {
    width: 140,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 2,
    borderColor: 'transparent',
    marginRight: Spacing.md,
    alignItems: 'center',
  },
  habitatIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#00FFA3',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  conversionBox: {
    padding: Spacing.xl,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  conversionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  conversionCol: {
    alignItems: 'center',
  },
  sliderControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  sliderBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
  },
  redeemButton: {
    height: 56,
    borderRadius: Radius.full,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
