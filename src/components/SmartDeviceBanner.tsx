import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useStore } from '@/store';
import { useThemeColor } from '@/hooks/useThemeColor';

export const SmartDeviceBanner = React.memo(() => {
  const isDeviceBannerDismissed = useStore((state) => state.isDeviceBannerDismissed);
  const dismissDeviceBanner = useStore((state) => state.dismissDeviceBanner);
  const tint = useThemeColor({}, 'tint');

  if (isDeviceBannerDismissed) return null;

  return (
    <View style={[styles.container, { backgroundColor: tint + '20' }]} accessible={true} accessibilityRole="alert" accessibilityLabel="Connect your wearable to improve accuracy. Press to dismiss.">
      <Text style={[styles.text, { color: tint }]}>Connect your wearable to improve accuracy</Text>
      <TouchableOpacity onPress={dismissDeviceBanner} accessibilityRole="button" accessibilityLabel="Dismiss device banner">
        <Text style={[styles.dismiss, { color: tint }]}>✕</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
  dismiss: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  }
});
