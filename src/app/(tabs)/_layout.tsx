import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useActiveTheme, useThemeColor } from '../../hooks/useThemeColor';
import { initializeMockData } from '../../utils/mockEngine';
import { Home, CheckSquare, User, Globe } from 'lucide-react-native';
import { CustomTabBar } from '../../components/CustomTabBar';

export default function AppLayout() {
  const activeTheme = useActiveTheme();
  const kkm  = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'primary');
  const inactiveTintColor = useThemeColor({}, 'textSecondary');

  useEffect(() => {
    initializeMockData();
  }, []);

  return (
    <>
      <StatusBar style={activeTheme === 'dark' ? 'light' : 'dark'} />
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="verify"
          options={{
            title: 'Verify',
            tabBarIcon: ({ color, size }) => <CheckSquare color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="social"
          options={{
            title: 'Community',
            tabBarIcon: ({ color, size }) => <Globe color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          }}
        />
      </Tabs>
    </>
  );
}
