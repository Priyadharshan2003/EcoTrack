import React from 'react';
import MapViewOriginal, { Marker } from 'react-native-maps';

// Premium Space-Age Dark Theme style for native Google Maps
const DARK_MAP_STYLE = [
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#121212" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#888888" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#121212" }]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [{ "color": "#333333" }]
  },
  {
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": [{ "color": "#444444" }]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#A8A8A8" }]
  },
  {
    "featureType": "poi",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{ "color": "#1A1A1A" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{ "color": "#242424" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [{ "color": "#1F1F1F" }]
  },
  {
    "featureType": "transit",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#080808" }]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#444444" }]
  }
];

export const MapView = React.forwardRef((props: any, ref: any) => {
  return (
    <MapViewOriginal
      ref={ref}
      customMapStyle={DARK_MAP_STYLE}
      provider="google" // Standardize on Google Maps for consistent dark styling across Android/iOS
      {...props}
    />
  );
});

export { Marker };
