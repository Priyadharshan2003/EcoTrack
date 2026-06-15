import { Stack } from 'expo-router';
import { useActiveTheme, useThemeColor } from '../hooks/useThemeColor';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ClerkProvider } from '@clerk/expo';
import { Platform } from 'react-native';

import { tokenCache as cache } from '../utils/tokenCache';

const tokenCache = Platform.OS !== 'web' ? cache : undefined;

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file');
}

export default function RootLayout() {
  const activeTheme = useActiveTheme();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor },
              headerTintColor: textColor,
              headerShadowVisible: false,
            }}
          >
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen 
              name="chat" 
              options={{ 
                presentation: 'transparentModal', 
                headerShown: false 
              }} 
            />
            <Stack.Screen 
              name="offset" 
              options={{ 
                title: 'Carbon Offsets',
              }} 
            />
            <Stack.Screen 
              name="settings" 
              options={{ 
                title: 'Settings',
              }} 
            />
            <Stack.Screen 
              name="corporate-auth" 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="corporate-leaderboard" 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="impact-story" 
              options={{ 
                presentation: 'transparentModal', 
                headerShown: false,
                animation: 'fade'
              }} 
            />
          </Stack>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </ClerkProvider>
  );
}
