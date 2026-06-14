import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { ThemedView } from '../components/themed-view';
import { ThemedText } from '../components/themed-text';
import { Card } from '../components/Card';
import { Spacing, Radius } from '../constants/theme';
import { useThemeColor } from '../hooks/useThemeColor';
import { router } from 'expo-router';
import { ChevronLeft, Trophy, Building2, Medal } from 'lucide-react-native';

const MOCK_LEADERBOARD = [
  { id: '1', name: 'Google', domain: 'google.com', offset: 125000 },
  { id: '2', name: 'Microsoft', domain: 'microsoft.com', offset: 95000 },
  { id: '3', name: 'Patagonia', domain: 'patagonia.com', offset: 88000 },
  { id: '4', name: 'Tesla', domain: 'tesla.com', offset: 42000 },
  { id: '5', name: 'Apple', domain: 'apple.com', offset: 31000 },
];

export default function CorporateLeaderboardScreen() {
  const insets = useSafeAreaInsets();
  const corporateEmail = useStore((state) => state.corporateEmail);
  
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');
  
  // Extract domain from email to find user's company
  const userDomain = corporateEmail ? corporateEmail.split('@')[1] : '';
  const userCompanyIndex = MOCK_LEADERBOARD.findIndex(c => c.domain === userDomain);
  const userCompany = userCompanyIndex !== -1 ? MOCK_LEADERBOARD[userCompanyIndex] : null;

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={styles.backButton}>
          <ChevronLeft size={24} color={textColor} />
        </TouchableOpacity>
        <ThemedText type="subtitle" weight="bold">Corporate Leaderboard</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.heroSection}>
          <View style={[styles.heroIcon, { backgroundColor: 'rgba(255, 215, 0, 0.1)' }]}>
            <Trophy size={48} color="#FFD700" />
          </View>
          <ThemedText type="large" weight="bold" style={styles.heroTitle}>Top Green Companies</ThemedText>
          <ThemedText type="small" colorName="textSecondary" style={styles.heroSubtitle}>
            Aggregated CO₂ offset across all registered employees.
          </ThemedText>
        </View>

        {userCompany && (
          <Card variant="elevated" style={[styles.userCompanyCard, { borderColor: primaryColor }]}>
            <ThemedText type="small" colorName="primary" style={styles.userCompanyLabel}>YOUR COMPANY</ThemedText>
            <View style={styles.rankRow}>
              <View style={styles.companyInfo}>
                <ThemedText type="default" weight="bold">{userCompany.name}</ThemedText>
                <ThemedText type="small" colorName="textSecondary">Rank #{userCompanyIndex + 1}</ThemedText>
              </View>
              <View style={styles.scoreInfo}>
                <ThemedText type="default" weight="bold">{userCompany.offset.toLocaleString()}</ThemedText>
                <ThemedText type="small" colorName="textSecondary">kg CO₂</ThemedText>
              </View>
            </View>
          </Card>
        )}

        <View style={styles.leaderboardList}>
          {MOCK_LEADERBOARD.map((company, index) => {
            const isUserCompany = company.domain === userDomain;
            
            let MedalIcon = null;
            if (index === 0) MedalIcon = <Medal size={20} color="#FFD700" />;
            else if (index === 1) MedalIcon = <Medal size={20} color="#C0C0C0" />;
            else if (index === 2) MedalIcon = <Medal size={20} color="#CD7F32" />;

            return (
              <Card 
                key={company.id} 
                variant="default" 
                style={[
                  styles.rankCard, 
                  isUserCompany && { borderColor: primaryColor, borderWidth: 1 }
                ]}
              >
                <View style={styles.rankNumberBox}>
                  {MedalIcon ? MedalIcon : <ThemedText type="default" weight="bold" colorName="textSecondary">#{index + 1}</ThemedText>}
                </View>
                
                <View style={[styles.companyIconBox, { overflow: 'hidden' }]}>
                  <Building2 size={20} color={isUserCompany ? primaryColor : textSecondary} style={{ position: 'absolute' }} />
                  <Image 
                    source={{ uri: `https://s2.googleusercontent.com/s2/favicons?domain=${company.domain}&sz=128` }} 
                    style={{ width: '100%', height: '100%', borderRadius: Radius.md }}
                    resizeMode="contain"
                  />
                </View>
                
                <View style={styles.companyDetails}>
                  <ThemedText type="default" weight="bold" style={isUserCompany && { color: primaryColor }}>
                    {company.name}
                  </ThemedText>
                </View>

                <View style={styles.scoreDetails}>
                  <ThemedText type="default" weight="bold">{company.offset.toLocaleString()}</ThemedText>
                  <ThemedText type="small" colorName="textSecondary">kg</ThemedText>
                </View>
              </Card>
            );
          })}
        </View>

      </ScrollView>
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
  scrollContent: {
    padding: Spacing.lg,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    marginTop: Spacing.md,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  heroTitle: {
    marginBottom: Spacing.xs,
  },
  heroSubtitle: {
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
  userCompanyCard: {
    marginBottom: Spacing.xl,
    borderWidth: 1,
    backgroundColor: 'rgba(0, 255, 163, 0.05)',
  },
  userCompanyLabel: {
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
    letterSpacing: 1,
  },
  rankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  companyInfo: {
    flex: 1,
  },
  scoreInfo: {
    alignItems: 'flex-end',
  },
  leaderboardList: {
    gap: Spacing.md,
  },
  rankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  rankNumberBox: {
    width: 30,
    alignItems: 'center',
  },
  companyIconBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(150,150,150,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
  },
  companyDetails: {
    flex: 1,
  },
  scoreDetails: {
    alignItems: 'flex-end',
  }
});
