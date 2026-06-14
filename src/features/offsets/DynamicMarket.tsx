import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useStore, OffsetTransaction } from '@/store';
import { generateUserContext } from '../insights/contextEngine';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/useThemeColor';

const MARKET_ITEMS = [
  { id: 'off_transport', title: 'Fund EV Transit', impact_kg: 50, price: 500, currency: 'PTS', tags: ['cab_travel'] },
  { id: 'off_food', title: 'Compost Project', impact_kg: 20, price: 200, currency: 'PTS', tags: ['food_order'] },
  { id: 'off_general', title: 'Plant 5 Trees', impact_kg: 100, price: 1000, currency: 'PTS', tags: ['general'] },
];

export const DynamicMarket = React.memo(() => {
  const tint = useThemeColor({}, 'tint');
  const verifiedActivities = useStore(state => state.verifiedActivities);
  const carbonScore = useStore(state => state.carbonScore);
  const ecoScore = useStore(state => state.ecoScore);
  const purchaseOffset = useStore(state => state.purchaseOffset);

  const context = useMemo(() => generateUserContext(verifiedActivities, carbonScore, ecoScore), [verifiedActivities, carbonScore, ecoScore]);

  const recommendedItems = useMemo(() => {
    return MARKET_ITEMS.sort((a, b) => {
      const aMatches = a.tags.includes(context.dominantSource || 'general') ? 1 : 0;
      const bMatches = b.tags.includes(context.dominantSource || 'general') ? 1 : 0;
      return bMatches - aMatches;
    });
  }, [context.dominantSource]);

  const handlePurchase = (item: typeof MARKET_ITEMS[0]) => {
    const transaction: OffsetTransaction = {
      id: `${item.id}_${Date.now()}`,
      title: item.title,
      impact_kg: item.impact_kg,
      price: item.price,
      currency: item.currency,
      timestamp: new Date().toISOString()
    };
    purchaseOffset(transaction, item.price);
    Alert.alert('Success!', `You offset ${item.impact_kg}kg of CO₂ by funding: ${item.title}`);
  };

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.heading}>Recommended For You</ThemedText>
      {recommendedItems.map(item => (
        <View key={item.id} style={styles.card} accessible={true} accessibilityRole="button" accessibilityLabel={`Offset ${item.impact_kg}kg of CO2 by funding ${item.title} for ${item.price} points.`}>
          <View style={styles.info}>
            <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
            <ThemedText style={styles.impact}>-{item.impact_kg}kg CO₂</ThemedText>
          </View>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: tint }]} 
            onPress={() => handlePurchase(item)}
            accessibilityRole="button"
            accessibilityLabel={`Purchase ${item.title}`}
          >
            <ThemedText style={styles.buttonText}>{item.price} PTS</ThemedText>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  heading: {
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    marginBottom: 8,
  },
  info: {
    flex: 1,
  },
  impact: {
    color: '#4ade80',
    marginTop: 4,
    fontSize: 14,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});
