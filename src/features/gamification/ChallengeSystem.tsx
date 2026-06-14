import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useStore } from '@/store';
import { ThemedText } from '@/components/themed-text';

export const ChallengeSystem = React.memo(() => {
  const activeChallenge = useStore(state => state.activeChallenge);

  if (!activeChallenge) return null;

  const progressPercent = Math.min(100, Math.round((activeChallenge.progress / activeChallenge.target) * 100));

  return (
    <View style={styles.card} accessible={true} accessibilityRole="summary" accessibilityLabel={`Weekly challenge: ${activeChallenge.title}. Progress: ${progressPercent}%. ${activeChallenge.daysLeft} days left.`}>
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold">Weekly Challenge</ThemedText>
        <ThemedText style={styles.daysLeft}>{activeChallenge.daysLeft} days left</ThemedText>
      </View>
      <ThemedText style={styles.title}>{activeChallenge.title}</ThemedText>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
      </View>
      <ThemedText style={styles.progressText}>{activeChallenge.progress} / {activeChallenge.target}</ThemedText>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  daysLeft: {
    color: '#888',
    fontSize: 12,
  },
  title: {
    fontSize: 16,
    marginBottom: 12,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4ade80', // Green accent
    borderRadius: 4,
  },
  progressText: {
    marginTop: 8,
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  }
});
