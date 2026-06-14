import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { ThemedView } from '../components/themed-view';
import { ThemedText } from '../components/themed-text';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Spacing, Radius } from '../constants/theme';
import { TreePine, Sun, Train, Coffee, Zap, ShoppingBag, X } from 'lucide-react-native';
import { useThemeColor } from '../hooks/useThemeColor';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { MapView, Marker } from '../components/Map';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';

type MarketCategory = 'All' | 'Offsets' | 'Products' | 'Experiences';

const MARKET_ITEMS = [
  {
    id: 'tree_western_ghats',
    category: 'Offsets',
    title: 'Plant Tree – Western Ghats',
    impact_kg: 20,
    priceINR: 99,
    pricePoints: 200,
    icon: TreePine,
    description: 'Support local farmers in planting indigenous trees.',
    lat: 10.8505,
    lng: 76.2711
  },
  {
    id: 'solar_rajasthan',
    category: 'Offsets',
    title: 'Solar Farm – Rajasthan',
    impact_kg: 50,
    priceINR: 250,
    pricePoints: 500,
    icon: Sun,
    description: 'Invest in solar infrastructure to replace coal power.',
    lat: 27.0238,
    lng: 74.2179
  },
  {
    id: 'metro_pass',
    category: 'Experiences',
    title: 'Monthly Metro Pass',
    impact_kg: 45,
    priceINR: 800,
    pricePoints: 1200,
    icon: Train,
    description: 'Zero-emission commute for 30 days.'
  },
  {
    id: 'reusable_cup',
    category: 'Products',
    title: 'Bamboo Coffee Cup',
    impact_kg: 5,
    priceINR: 499,
    pricePoints: 800,
    icon: Coffee,
    description: 'Ditch single-use plastics forever.'
  }
];

export default function EcoMarketScreen() {
  const insets = useSafeAreaInsets();
  const purchaseOffset = useStore((state) => state.purchaseOffset);
  const ecoPoints = useStore((state) => state.ecoPoints);
  
  const primaryColor = useThemeColor({}, 'primary');
  const cardColor = useThemeColor({}, 'surface');
  
  const [activeCategory, setActiveCategory] = useState<MarketCategory>('All');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Animated Drawer state
  const translateY = useSharedValue(400);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const handleMarkerPress = (item: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedProject(item);
    translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
  };

  const closeDrawer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    translateY.value = withTiming(400, { duration: 200 }, (finished) => {
      if (finished) {
        runOnJS(setSelectedProject)(null);
      }
    });
  };

  const animatedDrawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const filteredItems = activeCategory === 'All' 
    ? MARKET_ITEMS 
    : MARKET_ITEMS.filter(item => item.category === activeCategory);

  // Mock Recommendation Logic
  const recommendedItem = MARKET_ITEMS.find(i => i.id === 'metro_pass');

  const handlePurchase = (item: typeof MARKET_ITEMS[0], method: 'INR' | 'PTS') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (method === 'PTS' && ecoPoints < item.pricePoints!) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Not enough points", "You need more EcoPoints to unlock this reward.");
      return;
    }

    setLoadingId(item.id);
    
    setTimeout(() => {
      purchaseOffset({
        id: Date.now().toString(),
        title: item.title,
        impact_kg: item.impact_kg,
        price: method === 'INR' ? item.priceINR : item.pricePoints,
        currency: method === 'INR' ? 'INR' : 'PTS',
        timestamp: new Date().toISOString(),
      }, method === 'PTS' ? item.pricePoints : 0);
      
      setLoadingId(null);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        "Success!", 
        `You claimed ${item.title} and saved ${item.impact_kg}kg of CO₂!`,
        [{ text: "Awesome" }]
      );
    }, 1000);
  };

  return (
    <ThemedView style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* 3D Interactive Impact Map */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          userInterfaceStyle="dark"
          initialRegion={{
            latitude: 20.5937,
            longitude: 78.9629,
            latitudeDelta: 20,
            longitudeDelta: 20,
          }}
        >
          {MARKET_ITEMS.filter(i => i.lat).map(item => (
            <Marker
              key={item.id}
              coordinate={{ latitude: item.lat!, longitude: item.lng! }}
              title={item.title}
              description={`Saves ${item.impact_kg}kg CO₂`}
              onPress={() => handleMarkerPress(item)}
            >
              <View style={[styles.markerIcon, { backgroundColor: primaryColor }]}>
                <item.icon size={16} color="#000" />
              </View>
            </Marker>
          ))}
        </MapView>
        <View style={styles.mapOverlay}>
          <ThemedText type="subtitle" weight="bold" style={{ color: '#FFF' }}>Global Impact Map</ThemedText>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header: Points Economy */}
        <View style={styles.header}>
          <View style={styles.pointsBadge}>
            <Zap size={20} color="#FFD700" />
            <ThemedText type="large" style={{ color: '#FFD700', marginLeft: 8, fontWeight: 'bold' }}>
              {ecoPoints} EcoPoints
            </ThemedText>
          </View>
          <ThemedText type="small" colorName="textSecondary" style={{ marginTop: 8 }}>
            Earn points by logging low-emission days
          </ThemedText>
        </View>

        {/* Dynamic Recommendation */}
        {recommendedItem && (
          <View style={styles.recommendationSection}>
            <ThemedText type="default" weight="bold" style={styles.sectionTitle}>✨ Sustainable Pick for You</ThemedText>
            <Card variant="elevated" style={[styles.projectCard, { borderColor: primaryColor, borderWidth: 1 }]}>
              <View style={styles.projectHeader}>
                <View style={[styles.iconWrapper, { backgroundColor: `${primaryColor}20` }]}>
                  <recommendedItem.icon size={24} color={primaryColor} />
                </View>
                <View style={styles.projectTitleBox}>
                  <ThemedText type="default" weight="bold">{recommendedItem.title}</ThemedText>
                  <ThemedText type="small" colorName="primary">Saves {recommendedItem.impact_kg}kg CO₂</ThemedText>
                </View>
              </View>
              <ThemedText type="small" colorName="textSecondary" style={styles.projectDesc}>
                Because you log high transport emissions, this pass will drastically reduce your footprint.
              </ThemedText>
              
              <View style={styles.actionsRow}>
                <Button 
                  title={`Use ${recommendedItem.pricePoints} pts`}
                  variant="primary"
                  onPress={() => handlePurchase(recommendedItem, 'PTS')}
                  disabled={loadingId !== null}
                  style={styles.actionBtn}
                />
              </View>
            </Card>
          </View>
        )}

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {['All', 'Offsets', 'Products', 'Experiences'].map(cat => (
            <TouchableOpacity 
              key={cat} 
              onPress={() => setActiveCategory(cat as MarketCategory)}
              style={[styles.categoryPill, activeCategory === cat && { backgroundColor: primaryColor }]}
            >
              <ThemedText 
                type="small" 
                weight="bold" 
                style={{ color: activeCategory === cat ? '#000' : '#888' }}
              >
                {cat}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Market Items */}
        {filteredItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.id} variant="default" style={styles.projectCard}>
              <View style={styles.projectHeader}>
                <View style={[styles.iconWrapper, { backgroundColor: 'rgba(150,150,150,0.1)' }]}>
                  <Icon size={24} color="#FFF" />
                </View>
                <View style={styles.projectTitleBox}>
                  <ThemedText type="default" weight="bold">{item.title}</ThemedText>
                  <ThemedText type="small" colorName="primary">Saves {item.impact_kg}kg CO₂</ThemedText>
                </View>
              </View>
              
              <ThemedText type="small" colorName="textSecondary" style={styles.projectDesc}>
                {item.description}
              </ThemedText>

              <View style={styles.actionsRow}>
                <Button 
                  title={`₹${item.priceINR}`}
                  variant="secondary"
                  onPress={() => handlePurchase(item, 'INR')}
                  disabled={loadingId !== null}
                  style={styles.actionBtn}
                />
                <Button 
                  title={`${item.pricePoints} pts`}
                  variant="primary"
                  onPress={() => handlePurchase(item, 'PTS')}
                  disabled={loadingId !== null}
                  style={styles.actionBtn}
                />
              </View>
            </Card>
          );
        })}
      </ScrollView>

      {/* Animated Bottom Drawer for Map Marker Details */}
      <Animated.View style={[styles.drawerContainer, animatedDrawerStyle]}>
        {selectedProject && (
          <View style={styles.drawerContent}>
            {/* Header */}
            <View style={styles.drawerHeader}>
              <View style={styles.drawerTitleRow}>
                <View style={[styles.drawerIconWrapper, { backgroundColor: `${primaryColor}20` }]}>
                  {React.createElement(selectedProject.icon, { size: 24, color: primaryColor })}
                </View>
                <View style={styles.drawerTitleText}>
                  <ThemedText type="default" weight="bold">{selectedProject.title}</ThemedText>
                  <ThemedText type="small" colorName="primary">Saves {selectedProject.impact_kg}kg CO₂</ThemedText>
                </View>
              </View>
              <TouchableOpacity onPress={closeDrawer} style={styles.closeBtn}>
                <X size={20} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* Description */}
            <ThemedText type="small" colorName="textSecondary" style={styles.drawerDesc}>
              {selectedProject.description}
            </ThemedText>

            {/* Purchase buttons */}
            <View style={styles.drawerActions}>
              <Button 
                title={`₹${selectedProject.priceINR}`}
                variant="secondary"
                onPress={() => {
                  handlePurchase(selectedProject, 'INR');
                  closeDrawer();
                }}
                disabled={loadingId !== null}
                style={styles.drawerActionBtn}
              />
              <Button 
                title={`${selectedProject.pricePoints} pts`}
                variant="primary"
                onPress={() => {
                  handlePurchase(selectedProject, 'PTS');
                  closeDrawer();
                }}
                disabled={loadingId !== null}
                style={styles.drawerActionBtn}
              />
            </View>
          </View>
        )}
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    height: 250,
    width: '100%',
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
  mapOverlay: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  markerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
  },
  recommendationSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  categoryScroll: {
    flexDirection: 'row',
    marginBottom: Spacing.xl,
  },
  categoryPill: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(150,150,150,0.1)',
    marginRight: Spacing.sm,
  },
  projectCard: {
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  projectTitleBox: {
    flex: 1,
  },
  projectDesc: {
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionBtn: {
    flex: 1,
  },
  drawerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#161616',
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#333',
    padding: Spacing.lg,
    zIndex: 100,
    ...Platform.select({
      web: {
        boxShadow: '0px -10px 30px rgba(0,0,0,0.5)',
      } as any,
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
      }
    }),
  },
  drawerContent: {
    paddingBottom: Spacing.md,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  drawerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  drawerIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  drawerTitleText: {
    flex: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  drawerDesc: {
    marginBottom: Spacing.lg,
    lineHeight: 18,
  },
  drawerActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  drawerActionBtn: {
    flex: 1,
  }
});
