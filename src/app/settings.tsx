import React from 'react';
import { StyleSheet, View, Switch, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { ThemedView } from '../components/themed-view';
import { ThemedText } from '../components/themed-text';
import { Spacing, Radius } from '../constants/theme';
import { Moon, Sun, Monitor, Activity, Bell, Briefcase, ShieldAlert } from 'lucide-react-native';
import { useThemeColor } from '../hooks/useThemeColor';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);
  
  const corporateEmail = useStore((state) => state.corporateEmail);
  const isCorporateBeta = corporateEmail !== null;
  const setCorporateAuth = useStore((state) => state.setCorporateAuth);
  
  const primaryColor = useThemeColor({}, 'primary');
  const cardColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');

  const renderSettingItem = (icon: React.ReactNode, title: string, subtitle: string, rightElement: React.ReactNode) => (
    <View style={[styles.settingItem, { borderBottomColor: `${textSecondary}20` }]}>
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <View>
          <ThemedText type="default" weight="bold">{title}</ThemedText>
          <ThemedText type="small" colorName="textSecondary">{subtitle}</ThemedText>
        </View>
      </View>
      <View>{rightElement}</View>
    </View>
  );

  return (
    <ThemedView style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <ThemedText type="subtitle" style={styles.sectionTitle}>Appearance</ThemedText>
        
        <View style={[styles.card, { backgroundColor: cardColor }]}>
          {renderSettingItem(
            <Moon size={20} color={textColor} />,
            "Dark Mode",
            "Force dark theme",
            <Switch 
              value={theme === 'dark'} 
              onValueChange={(val) => setTheme(val ? 'dark' : 'system')} 
              trackColor={{ true: primaryColor }}
            />
          )}
          {renderSettingItem(
            <Sun size={20} color={textColor} />,
            "Light Mode",
            "Force light theme",
            <Switch 
              value={theme === 'light'} 
              onValueChange={(val) => setTheme(val ? 'light' : 'system')} 
              trackColor={{ true: primaryColor }}
            />
          )}
          {renderSettingItem(
            <Monitor size={20} color={textColor} />,
            "System Default",
            "Match device settings",
            <Switch 
              value={theme === 'system'} 
              onValueChange={(val) => setTheme(val ? 'system' : 'dark')} 
              trackColor={{ true: primaryColor }}
            />
          )}
        </View>

        <ThemedText type="subtitle" style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>Corporate</ThemedText>
        
        <View style={[styles.card, { backgroundColor: cardColor }]}>
          {renderSettingItem(
            <Briefcase size={20} color={textColor} />,
            "Corporate Mode (Beta)",
            isCorporateBeta ? corporateEmail : "Sync with company goals",
            <Switch 
              value={isCorporateBeta} 
              onValueChange={(val) => {
                if (val) {
                  router.push('/corporate-auth');
                } else {
                  setCorporateAuth(null);
                }
              }} 
              trackColor={{ true: '#007AFF' }} 
            />
          )}
          {isCorporateBeta && (
            <View style={styles.privacyBanner}>
              <ShieldAlert size={16} color="#007AFF" />
              <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                <ThemedText type="small" style={{ color: '#007AFF', fontWeight: 'bold' }}>Privacy Protected</ThemedText>
                <ThemedText type="small" colorName="textSecondary" style={{ marginTop: 2 }}>
                  Your data is aggregated and anonymized. No individual tracking is visible to your employer.
                </ThemedText>
              </View>
            </View>
          )}
        </View>

        <ThemedText type="subtitle" style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>Integrations</ThemedText>
        
        <View style={[styles.card, { backgroundColor: cardColor }]}>
          {renderSettingItem(
            <Activity size={20} color={textColor} />,
            "Strava Connect",
            "Sync walks and bike rides",
            <Switch value={false} disabled trackColor={{ true: primaryColor }} />
          )}
          {renderSettingItem(
            <Activity size={20} color={textColor} />,
            "Apple Health / Fit",
            "Sync pedometer data",
            <Switch value={false} disabled trackColor={{ true: primaryColor }} />
          )}
        </View>

        <ThemedText type="subtitle" style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>Notifications</ThemedText>
        
        <View style={[styles.card, { backgroundColor: cardColor }]}>
          {renderSettingItem(
            <Bell size={20} color={textColor} />,
            "Smart Nudges",
            "Get AI suggestions",
            <Switch value={true} trackColor={{ true: primaryColor }} />
          )}
        </View>

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
    marginLeft: Spacing.xs,
  },
  card: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  privacyBanner: {
    flexDirection: 'row',
    padding: Spacing.md,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 122, 255, 0.2)',
  }
});
