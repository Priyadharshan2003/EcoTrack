import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { ThemedView } from '../components/themed-view';
import { ThemedText } from '../components/themed-text';
import { Button } from '../components/Button';
import { Spacing, Radius } from '../constants/theme';
import { useThemeColor } from '../hooks/useThemeColor';
import { router } from 'expo-router';
import { Briefcase, KeyRound, ChevronLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function CorporateAuthScreen() {
  const insets = useSafeAreaInsets();
  const setCorporateAuth = useStore((state) => state.setCorporateAuth);
  
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const cardColor = useThemeColor({}, 'surface');

  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const handleSendOTP = () => {
    if (!email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid company email address.');
      return;
    }
    setStep('otp');
  };

  const handleVerifyOTP = () => {
    if (otp === '0000') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCorporateAuth(email);
      router.canGoBack() ? router.back() : router.replace('/settings');
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Invalid OTP', 'Please use the test OTP: 0000');
    }
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/settings')} style={styles.backButton}>
          <ChevronLeft size={24} color={textColor} />
        </TouchableOpacity>
        <ThemedText type="subtitle" weight="bold">Corporate Mode</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {step === 'email' ? (
          <View style={styles.card}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(0, 122, 255, 0.1)' }]}>
              <Briefcase size={32} color="#007AFF" />
            </View>
            <ThemedText type="large" weight="bold" style={styles.title}>Join your Company</ThemedText>
            <ThemedText type="default" colorName="textSecondary" style={styles.subtitle}>
              Link your corporate email to access company leaderboards and aggregated sustainability insights.
            </ThemedText>

            <TextInput
              style={[styles.input, { color: textColor, borderColor: textSecondary, backgroundColor: cardColor }]}
              placeholder="e.g. jane@acmecorp.com"
              placeholderTextColor={textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Button 
              title="Send OTP" 
              onPress={handleSendOTP} 
              style={styles.button}
            />
          </View>
        ) : (
          <View style={styles.card}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(0, 200, 100, 0.1)' }]}>
              <KeyRound size={32} color="#00C864" />
            </View>
            <ThemedText type="large" weight="bold" style={styles.title}>Verify OTP</ThemedText>
            <ThemedText type="default" colorName="textSecondary" style={styles.subtitle}>
              We sent a 4-digit code to {email}. (Hint: use 0000)
            </ThemedText>

            <TextInput
              style={[styles.input, { color: textColor, borderColor: textSecondary, backgroundColor: cardColor, textAlign: 'center', fontSize: 24, letterSpacing: 10 }]}
              placeholder="0000"
              placeholderTextColor={textSecondary}
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={4}
            />

            <Button 
              title="Verify & Join" 
              onPress={handleVerifyOTP} 
              style={styles.button}
            />
          </View>
        )}
      </View>
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
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  backButton: {
    padding: Spacing.sm,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
  },
  card: {
    alignItems: 'center',
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  input: {
    width: '100%',
    height: 56,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
    marginBottom: Spacing.xl,
  },
  button: {
    width: '100%',
  }
});
