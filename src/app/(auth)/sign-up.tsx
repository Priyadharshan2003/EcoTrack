import { useAuth, useSignUp, useOAuth } from '@clerk/expo';
import { type Href, Link, useRouter } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { Pressable, StyleSheet, TextInput, View, Text, Alert, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useWarmUpBrowser } from '../../hooks/useWarmUpBrowser';

WebBrowser.maybeCompleteAuthSession();

export default function SignUpPage() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setLoading] = useState(false);

  useWarmUpBrowser();

  const { startOAuthFlow: startGoogleFlow } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startMicrosoftFlow } = useOAuth({ strategy: 'oauth_microsoft' });

  const handleOAuth = useCallback(async (strategy: 'oauth_google' | 'oauth_microsoft') => {
    try {
      setLoading(true);
      const startFlow = strategy === 'oauth_google' ? startGoogleFlow : startMicrosoftFlow;
      const { createdSessionId, setActive } = await startFlow({
        redirectUrl: Linking.createURL('/(tabs)')
      });
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      console.error('OAuth error', err);
      Alert.alert('OAuth Error', err?.errors?.[0]?.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  }, [startGoogleFlow, startMicrosoftFlow, router, signUp]);

  const handleSubmit = async () => {
    if (!signUp) return;
    setLoading(true);
    try {
      const { error } = await signUp.password({
        emailAddress,
        password,
      });
      if (!error) {
        await signUp.verifications.sendEmailCode();
        setPendingVerification(true);
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert('Sign Up Failed', err?.errors?.[0]?.message || 'An error occurred during sign up.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!signUp) return;
    setLoading(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
      if (completeSignUp.status === 'complete') {
        await signUp.setActive({ session: completeSignUp.createdSessionId });
        router.replace('/(tabs)');
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
        Alert.alert('Verification Incomplete', 'Further action is required.');
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert('Verification Failed', err?.errors?.[0]?.message || 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Verify your account</Text>
        <TextInput
          style={styles.input}
          value={code}
          placeholder="Enter verification code"
          placeholderTextColor="#666666"
          onChangeText={setCode}
          keyboardType="numeric"
        />
        <Pressable 
          style={({ pressed }) => [
            styles.button,
            (!code || loading) && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]} 
          onPress={handleVerify}
          disabled={!code || loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Verifying...' : 'Verify'}</Text>
        </Pressable>

        {/* Clerk CAPTCHA Container */}
        <View nativeID="clerk-captcha" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign up</Text>
      <Text style={styles.label}>Email address</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        placeholderTextColor="#666666"
        onChangeText={setEmailAddress}
        keyboardType="email-address"
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Enter password"
        placeholderTextColor="#666666"
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      <Pressable 
        style={({ pressed }) => [
          styles.button,
          (!emailAddress || !password || loading) && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]} 
        onPress={handleSubmit}
        disabled={!emailAddress || !password || loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Signing up...' : 'Sign up'}</Text>
      </Pressable>

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.divider} />
      </View>

      <Pressable 
        style={({ pressed }) => [styles.oauthButton, pressed && styles.buttonPressed]} 
        onPress={() => handleOAuth('oauth_google')}
        disabled={loading}
      >
        <Text style={styles.oauthButtonText}>Sign up with Google</Text>
      </Pressable>

      <Pressable 
        style={({ pressed }) => [styles.oauthButton, pressed && styles.buttonPressed]} 
        onPress={() => handleOAuth('oauth_microsoft')}
        disabled={loading}
      >
        <Text style={styles.oauthButtonText}>Sign up with Microsoft</Text>
      </Pressable>
      <View style={styles.linkContainer}>
        <Text style={{color: '#ccc'}}>Already have an account? </Text>
        <Link href="/(auth)/sign-in">
          <Text style={{ color: '#10b981' }}>Sign in</Text>
        </Link>
      </View>

      {/* Clerk CAPTCHA Container */}
      <View nativeID="clerk-captcha" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', gap: 12, backgroundColor: '#111' },
  title: { marginBottom: 8, fontSize: 32, fontWeight: 'bold', color: 'white' },
  label: { fontWeight: '600', fontSize: 14, color: '#ccc' },
  input: { borderWidth: 1, borderColor: '#333', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#222', color: 'white' },
  button: { backgroundColor: '#10b981', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonPressed: { opacity: 0.7 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  oauthButton: { backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  oauthButtonText: { color: '#000', fontWeight: '600' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  divider: { flex: 1, height: 1, backgroundColor: '#333' },
  dividerText: { color: '#666', paddingHorizontal: 10, fontSize: 12, fontWeight: 'bold' },
  linkContainer: { flexDirection: 'row', marginTop: 12, alignItems: 'center' },
});
