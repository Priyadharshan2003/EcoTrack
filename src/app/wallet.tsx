import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore, Transaction } from '../store';
import { ThemedView } from '../components/themed-view';
import { ThemedText } from '../components/themed-text';
import { Spacing, Radius } from '../constants/theme';
import { ArrowDownLeft, ArrowUpRight, Zap, TreePine, ChevronRight, Receipt, Trash } from 'lucide-react-native';
import { useThemeColor } from '../hooks/useThemeColor';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import * as Haptics from 'expo-haptics';

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const ecoPoints = useStore((state) => state.ecoPoints);
  const transactions = useStore((state) => state.transactions);
  
  const primaryColor = useThemeColor({}, 'primary');
  const cardColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const dangerColor = useThemeColor({}, 'danger');

  const renderRightActions = () => {
    return (
      <View style={styles.rightActionContainer}>
        <TouchableOpacity 
          style={styles.actionBtnReceipt}
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }}
        >
          <Receipt size={20} color="#FFF" />
          <ThemedText type="small" style={{ color: '#FFF', marginLeft: 4 }}>Receipt</ThemedText>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const isEarn = item.type === 'EARN';
    const isOffset = item.type === 'OFFSET';
    const color = isEarn ? primaryColor : (isOffset ? '#007AFF' : dangerColor);
    const Icon = isEarn ? ArrowDownLeft : (isOffset ? TreePine : ArrowUpRight);

    return (
      <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
        <View style={styles.transactionRow}>
          <View style={[styles.txIconBox, { backgroundColor: `${color}20` }]}>
            <Icon size={20} color={color} />
          </View>
          <View style={styles.txInfo}>
            <ThemedText type="default" weight="bold">{item.title}</ThemedText>
            <ThemedText type="small" colorName="textSecondary">
              {new Date(item.timestamp).toLocaleDateString()}
            </ThemedText>
          </View>
          <ThemedText type="default" weight="bold" style={{ color }}>
            {isEarn ? '+' : '-'}{item.amount} {item.currency}
          </ThemedText>
        </View>
      </Swipeable>
    );
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ThemedText type="title">Carbon Wallet</ThemedText>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* The Digital Card */}
        <LinearGradient
          colors={['#1E1E1E', '#111'] as const}
          style={styles.digitalCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardTop}>
            <ThemedText type="small" style={{ color: '#AAA' }}>Total Balance</ThemedText>
            <Zap size={24} color="#FFD700" />
          </View>
          
          <View style={styles.cardMiddle}>
            <ThemedText style={styles.balanceText}>{ecoPoints}</ThemedText>
            <ThemedText type="default" style={{ color: '#FFD700', marginLeft: Spacing.sm, marginBottom: 8 }}>PTS</ThemedText>
          </View>
          
          <View style={styles.cardBottom}>
            <ThemedText type="small" style={{ color: '#AAA' }}>Account Active</ThemedText>
            <ThemedText type="small" weight="bold" style={{ color: '#FFF' }}>EcoTrack Member</ThemedText>
          </View>
        </LinearGradient>

        {/* Action Row */}
        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: `${primaryColor}20` }]}
            onPress={() => router.push('/offset')}
          >
            <TreePine size={24} color={primaryColor} />
            <ThemedText type="small" weight="bold" colorName="primary" style={{ marginTop: Spacing.sm }}>Eco Market</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Ledger Section */}
        <View style={styles.ledgerHeader}>
          <ThemedText type="large" weight="bold">Recent Transactions</ThemedText>
        </View>

        {transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <ThemedText type="default" colorName="textSecondary">No transactions yet.</ThemedText>
          </View>
        ) : (
          <View style={[styles.ledgerCard, { backgroundColor: cardColor }]}>
            {transactions.map((tx, index) => (
              <React.Fragment key={tx.id}>
                {renderTransaction({ item: tx })}
                {index < transactions.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  digitalCard: {
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    minHeight: 200,
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'space-between',
    ...Platform.select({
      web: { boxShadow: '0px 10px 30px rgba(0, 255, 163, 0.3)' } as any,
      default: {
        shadowColor: '#00FFA3',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 30,
        elevation: 10,
      }
    })
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardMiddle: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: Spacing.lg,
  },
  balanceText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: -1,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  actionBtn: {
    flex: 1,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  ledgerHeader: {
    marginTop: Spacing.xxl,
    marginBottom: Spacing.md,
  },
  ledgerCard: {
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  txIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  txInfo: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(150,150,150,0.1)',
  },
  emptyState: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  rightActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing.md,
  },
  actionBtnReceipt: {
    backgroundColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    height: '100%',
    borderRadius: Radius.md,
  }
});
