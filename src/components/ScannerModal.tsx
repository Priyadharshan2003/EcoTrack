import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing,
  FadeIn,
  FadeOut
} from 'react-native-reanimated';
import { X, ScanLine, BrainCircuit } from 'lucide-react-native';
import { ThemedText } from './themed-text';
import { useThemeColor } from '../hooks/useThemeColor';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');
const SCANNER_SIZE = width * 0.8;

interface ScannerModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ScannerModal({ visible, onClose }: ScannerModalProps) {
  const insets = useSafeAreaInsets();
  const primaryColor = useThemeColor({}, 'primary');
  const [analyzing, setAnalyzing] = useState(false);
  
  const laserPosition = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      // Sweeping laser animation
      laserPosition.value = withRepeat(
        withSequence(
          withTiming(SCANNER_SIZE, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      
      // Heartbeat scale for crosshairs
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        true
      );
    } else {
      setAnalyzing(false);
    }
  }, [visible]);

  const laserStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: laserPosition.value }],
  }));

  const crosshairStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleScan = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setAnalyzing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill}>
        
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X color="#FFF" size={24} />
          </TouchableOpacity>
          <ThemedText type="subtitle" weight="bold" style={{ color: '#FFF' }}>Eco Vision AI</ThemedText>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.container}>
          {analyzing ? (
            <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.analyzingContainer}>
              <BrainCircuit color={primaryColor} size={64} />
              <ThemedText type="large" weight="bold" style={{ color: primaryColor, marginTop: 24 }}>
                Processing Image...
              </ThemedText>
              <ThemedText type="default" colorName="textSecondary" style={{ marginTop: 8 }}>
                Running 345 parameters
              </ThemedText>
            </Animated.View>
          ) : (
            <>
              <ThemedText type="default" colorName="textSecondary" style={styles.instruction}>
                Align your receipt or meal in the frame
              </ThemedText>

              {/* Viewfinder */}
              <Animated.View style={[styles.viewfinder, crosshairStyle, { borderColor: primaryColor }]}>
                {/* Laser */}
                <Animated.View style={[styles.laser, laserStyle, { 
                  backgroundColor: primaryColor, 
                  ...Platform.select({
                    web: { boxShadow: `0px 0px 10px ${primaryColor}` } as any,
                    default: { shadowColor: primaryColor }
                  }) 
                }]} />
                
                {/* Grid Overlay */}
                <View style={styles.gridLineHorizontal} />
                <View style={styles.gridLineHorizontal2} />
                <View style={styles.gridLineVertical} />
                <View style={styles.gridLineVertical2} />
                
                <View style={styles.cornerTL} />
                <View style={styles.cornerTR} />
                <View style={styles.cornerBL} />
                <View style={styles.cornerBR} />
              </Animated.View>

              <TouchableOpacity 
                style={[styles.scanBtn, { backgroundColor: primaryColor }]} 
                onPress={handleScan}
              >
                <ScanLine color="#000" size={24} />
                <ThemedText type="default" weight="bold" style={{ color: '#000', marginLeft: 8 }}>
                  Analyze
                </ThemedText>
              </TouchableOpacity>
            </>
          )}
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instruction: {
    marginBottom: 40,
  },
  analyzingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewfinder: {
    width: SCANNER_SIZE,
    height: SCANNER_SIZE,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    overflow: 'hidden',
  },
  laser: {
    width: '100%',
    height: 3,
    position: 'absolute',
    ...Platform.select({
      default: {
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 5,
      }
    }),
    zIndex: 10,
  },
  gridLineHorizontal: {
    position: 'absolute', width: '100%', height: 1, backgroundColor: 'rgba(255,255,255,0.1)', top: '33%',
  },
  gridLineHorizontal2: {
    position: 'absolute', width: '100%', height: 1, backgroundColor: 'rgba(255,255,255,0.1)', top: '66%',
  },
  gridLineVertical: {
    position: 'absolute', height: '100%', width: 1, backgroundColor: 'rgba(255,255,255,0.1)', left: '33%',
  },
  gridLineVertical2: {
    position: 'absolute', height: '100%', width: 1, backgroundColor: 'rgba(255,255,255,0.1)', left: '66%',
  },
  cornerTL: { position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderTopWidth: 4, borderLeftWidth: 4, borderColor: '#FFF' },
  cornerTR: { position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderTopWidth: 4, borderRightWidth: 4, borderColor: '#FFF' },
  cornerBL: { position: 'absolute', bottom: 0, left: 0, width: 40, height: 40, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: '#FFF' },
  cornerBR: { position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderBottomWidth: 4, borderRightWidth: 4, borderColor: '#FFF' },
  scanBtn: {
    flexDirection: 'row',
    marginTop: 60,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 32,
    alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: '0px 0px 10px rgba(0, 255, 163, 0.5)' } as any,
      default: {
        shadowColor: '#00FFA3',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 8,
      }
    })
  }
});
