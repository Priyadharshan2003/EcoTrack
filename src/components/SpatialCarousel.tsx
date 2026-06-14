import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedScrollHandler, 
  useAnimatedStyle, 
  interpolate, 
  Extrapolation 
} from 'react-native-reanimated';
import { Card } from './Card';
import { ThemedText } from './themed-text';
import { Leaf, Award, Bike } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.75;
const SPACER_WIDTH = (width - ITEM_WIDTH) / 2;

export interface CarouselItem {
  id: string;
  user: string;
  action: string;
  impact: string;
  type: 'plant' | 'bike' | 'award';
}

interface SpatialCarouselProps {
  data: CarouselItem[];
}

export function SpatialCarousel({ data }: SpatialCarouselProps) {
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <Animated.ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={ITEM_WIDTH}
      decelerationRate="fast"
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Start Spacer to center the first item */}
      <View style={{ width: SPACER_WIDTH }} />

      {data.map((item, index) => {
        return (
          <CarouselCard 
            key={item.id} 
            item={item} 
            index={index} 
            scrollX={scrollX} 
          />
        );
      })}

      {/* End Spacer */}
      <View style={{ width: SPACER_WIDTH }} />
    </Animated.ScrollView>
  );
}

import { SharedValue } from 'react-native-reanimated';

interface CarouselCardProps {
  item: CarouselItem;
  index: number;
  scrollX: SharedValue<number>;
}

function CarouselCard({ item, index, scrollX }: CarouselCardProps) {
  const animatedStyle = useAnimatedStyle(() => {
    // The precise input range for this item
    const inputRange = [
      (index - 1) * ITEM_WIDTH,
      index * ITEM_WIDTH,
      (index + 1) * ITEM_WIDTH,
    ];

    // Scale down items that are not centered
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      Extrapolation.CLAMP
    );

    // Fade out items that are not centered
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.5, 1, 0.5],
      Extrapolation.CLAMP
    );

    // 3D Rotation effect (Cover Flow)
    const rotateY = interpolate(
      scrollX.value,
      inputRange,
      [45, 0, -45],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [
        { perspective: 800 },
        { scale },
        { rotateY: `${rotateY}deg` }
      ],
    };
  });

  const getIcon = () => {
    switch (item.type) {
      case 'plant': return <Leaf color="#00FFA3" size={32} />;
      case 'bike': return <Bike color="#00F0FF" size={32} />;
      case 'award': return <Award color="#FFB800" size={32} />;
    }
  };

  return (
    <Animated.View style={[styles.itemContainer, animatedStyle]}>
      <Card variant="elevated" style={styles.card}>
        <View style={styles.iconContainer}>
          {getIcon()}
        </View>
        <ThemedText type="large" weight="bold" style={styles.user}>{item.user}</ThemedText>
        <ThemedText type="default" colorName="textSecondary" style={styles.action}>{item.action}</ThemedText>
        
        <View style={styles.impactBadge}>
          <ThemedText type="small" weight="bold" style={{ color: '#000' }}>{item.impact}</ThemedText>
        </View>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: 32,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '90%',
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(20,20,30,0.8)',
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  user: {
    marginBottom: 8,
    textAlign: 'center',
  },
  action: {
    textAlign: 'center',
    marginBottom: 24,
  },
  impactBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#00FFA3',
  }
});
