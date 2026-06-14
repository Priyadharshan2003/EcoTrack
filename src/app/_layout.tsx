import { Stack } from 'expo-router';
import { useActiveTheme, useThemeColor } from '../hooks/useThemeColor';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

export default function RootLayout() {
  const activeTheme = useActiveTheme();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor },
            headerTintColor: textColor,
            headerShadowVisible: false,
          }}
        >
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
  );
}
