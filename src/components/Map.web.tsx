import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './themed-text';

export const MapView = ({ children, style }: any) => {
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

  // Extract markers from children
  const markers: any[] = [];
  React.Children.forEach(children, (child) => {
    if (child && child.props) {
      markers.push({
        id: child.key || Math.random().toString(),
        coordinate: child.props.coordinate,
        title: child.props.title,
        description: child.props.description,
        customIcon: child.props.children,
        onPress: child.props.onPress || (() => {})
      });
    }
  });

  // Equirectangular projection mapping
  // Map dimensions are 100% width and 100% height
  // We place markers as absolute positioned elements using percentage values:
  // x% = ((lng + 180) / 360) * 100
  // y% = ((90 - lat) / 180) * 100
  const getMarkerPosition = (coordinate: { latitude: number, longitude: number }) => {
    const x = ((coordinate.longitude + 180) / 360) * 100;
    const y = ((90 - coordinate.latitude) / 180) * 100;
    return { x: `${x}%` as any, y: `${y}%` as any };
  };

  return (
    <View style={[styles.container, style]}>
      {/* Glow World Grid Vector Map */}
      <svg
        viewBox="0 0 360 180"
        style={styles.svgMap}
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Glowing space-age background */}
        <rect width="360" height="180" fill="#121212" />

        {/* Tactical Grid Lines */}
        {/* Horizontal latitude lines */}
        {[30, 60, 90, 120, 150].map((y) => (
          <line
            key={`h-${y}`}
            x1="0"
            y1={y}
            x2="360"
            y2={y}
            stroke="rgba(0, 255, 163, 0.04)"
            strokeWidth="0.5"
          />
        ))}
        {/* Vertical longitude lines */}
        {[30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((x) => (
          <line
            key={`v-${x}`}
            x1={x}
            y1="0"
            x2={x}
            y2="180"
            stroke="rgba(0, 255, 163, 0.04)"
            strokeWidth="0.5"
          />
        ))}

        {/* Abstract Continent Vector Paths */}
        {/* North America */}
        <path
          d="M 35,35 L 60,35 L 90,50 L 98,70 L 90,90 L 80,105 L 72,120 L 68,135 L 65,140 L 58,140 L 54,130 L 50,110 L 40,100 L 28,95 L 20,80 L 24,65 L 28,50 Z"
          fill="rgba(0, 255, 163, 0.03)"
          stroke="rgba(0, 255, 163, 0.12)"
          strokeWidth="0.8"
        />
        {/* South America */}
        <path
          d="M 68,140 L 80,150 L 88,165 L 92,180 L 84,205 L 76,225 L 67,245 L 65,250 L 60,245 L 58,225 L 60,205 L 63,185 L 61,165 L 65,145 Z"
          fill="rgba(0, 255, 163, 0.03)"
          stroke="rgba(0, 255, 163, 0.12)"
          strokeWidth="0.8"
          transform="translate(10, -10)"
        />
        {/* Greenland */}
        <path
          d="M 90,15 L 110,15 L 115,25 L 105,35 L 90,30 Z"
          fill="rgba(0, 255, 163, 0.03)"
          stroke="rgba(0, 255, 163, 0.10)"
          strokeWidth="0.8"
        />
        {/* Africa */}
        <path
          d="M 160,110 L 175,100 L 195,110 L 210,125 L 213,145 L 202,175 L 190,205 L 186,225 L 178,225 L 174,205 L 172,185 L 168,165 L 158,150 L 154,135 L 157,120 Z"
          fill="rgba(0, 255, 163, 0.03)"
          stroke="rgba(0, 255, 163, 0.12)"
          strokeWidth="0.8"
          transform="translate(5, 5)"
        />
        {/* Eurasia */}
        <path
          d="M 150,90 L 165,70 L 180,60 L 195,45 L 215,38 L 245,45 L 275,50 L 295,65 L 291,85 L 272,100 L 252,110 L 242,125 L 232,140 L 220,135 L 208,120 L 192,112 L 177,100 L 157,95 Z"
          fill="rgba(0, 255, 163, 0.03)"
          stroke="rgba(0, 255, 163, 0.12)"
          strokeWidth="0.8"
          transform="translate(15, 8)"
        />
        {/* Australia */}
        <path
          d="M 285,140 L 305,142 L 310,160 L 295,168 L 280,160 L 281,148 Z"
          fill="rgba(0, 255, 163, 0.03)"
          stroke="rgba(0, 255, 163, 0.12)"
          strokeWidth="0.8"
          transform="translate(20, 10)"
        />
      </svg>

      {/* Markers Container */}
      <View style={StyleSheet.absoluteFill}>
        {markers.map((marker) => {
          const pos = getMarkerPosition(marker.coordinate);
          return (
            <TouchableOpacity
              key={marker.id}
              style={[styles.markerWrapper, { left: pos.x, top: pos.y }]}
              onPress={marker.onPress}
              activeOpacity={0.8}
              {...({
                onMouseEnter: () => setHoveredMarker(marker.id),
                onMouseLeave: () => setHoveredMarker(null)
              } as any)}
            >
              {/* Outer pulsing ring */}
              <View style={styles.pulseRing} />
              
              {/* Custom Icon wrapper */}
              <View style={styles.markerContent}>
                {marker.customIcon}
              </View>

              {/* Hover Tooltip (Web Only) */}
              {hoveredMarker === marker.id && (
                <View style={styles.tooltip}>
                  <ThemedText type="small" weight="bold" style={styles.tooltipTitle}>{marker.title}</ThemedText>
                  <ThemedText type="small" style={styles.tooltipDesc}>{marker.description}</ThemedText>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export const Marker = ({ children, coordinate, title, description, onPress }: any) => {
  return null;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    position: 'relative',
    overflow: 'hidden',
  },
  svgMap: {
    width: '100%',
    height: '100%',
  },
  markerWrapper: {
    position: 'absolute',
    width: 36,
    height: 36,
    marginLeft: -18,
    marginTop: -18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  pulseRing: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00FFA3',
    backgroundColor: 'rgba(0, 255, 163, 0.08)',
  },
  markerContent: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00FFA3',
  },
  tooltip: {
    position: 'absolute',
    top: -55,
    width: 140,
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 163, 0.3)',
    borderRadius: 6,
    padding: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    zIndex: 20,
  },
  tooltipTitle: {
    color: '#FFF',
    fontSize: 10,
    marginBottom: 2,
    textAlign: 'center',
  },
  tooltipDesc: {
    color: '#00FFA3',
    fontSize: 8,
    textAlign: 'center',
  }
});
