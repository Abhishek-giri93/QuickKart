// Delivery Partner App — Earnings & Shifts Screen

import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Shadow } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';

const EarningsScreen = () => {
  const earnings = {
    weeklyTotal: 5420,
    tripsCount: 74,
    tipsEarned: 380,
    surgeBonus: 640,
    walletBalance: 1250,
    bankAccount: 'SBI Bank •••• 8120',
  };

  const dailyTrips = [
    { date: 'Today (30 Oct)', trips: 9, amount: 850, tips: 60, status: 'Active Shift 🟢' },
    { date: 'Yesterday (29 Oct)', trips: 14, amount: 1120, tips: 80, status: 'Settled ✅' },
    { date: 'Wednesday (28 Oct)', trips: 12, amount: 980, tips: 50, status: 'Settled ✅' },
    { date: 'Tuesday (27 Oct)', trips: 16, amount: 1240, tips: 110, status: 'Settled ✅' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D1B2A" />

      {/* Screen Title */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rider Earnings</Text>
        <Text style={styles.headerSubtitle}>Weekly earnings, trip incentives & tips</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Wallet Balance Card */}
        <View style={styles.walletCard}>
          <Text style={styles.walletLabel}>CURRENT UNSETTLED EARNINGS</Text>
          <Text style={styles.walletAmount}>₹{earnings.walletBalance}</Text>
          <Text style={styles.walletBank}>{earnings.bankAccount}</Text>

          <TouchableOpacity
            style={styles.cashoutBtn}
            onPress={() => Alert.alert('Instant Transfer', `₹${earnings.walletBalance} will be deposited to ${earnings.bankAccount} instantly.`)}
          >
            <Text style={styles.cashoutBtnText}>INSTANT CASHOUT ⚡</Text>
          </TouchableOpacity>
        </View>

        {/* Weekly Stats Strip */}
        <View style={styles.statsStrip}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>₹{earnings.weeklyTotal}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{earnings.tripsCount}</Text>
            <Text style={styles.statLabel}>Deliveries</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statVal}>₹{earnings.tipsEarned}</Text>
            <Text style={styles.statLabel}>Tips</Text>
          </View>
        </View>

        {/* Daily Breakdown */}
        <Text style={styles.sectionTitle}>Daily Trip Logs</Text>
        {dailyTrips.map((day) => (
          <View key={day.date} style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <View>
                <Text style={styles.dayDate}>{day.date}</Text>
                <Text style={styles.daySub}>{day.trips} deliveries • +₹{day.tips} tips</Text>
              </View>
              <Text style={styles.dayAmount}>₹{day.amount}</Text>
            </View>
            <Text style={styles.dayStatus}>{day.status}</Text>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1FAEE' },
  header: {
    backgroundColor: '#0D1B2A',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: '800', color: '#FFFFFF' },
  headerSubtitle: { fontSize: FontSize.xs, color: '#94A3B8', marginTop: 2 },

  scrollContent: { padding: Spacing.md, gap: Spacing.md },

  walletCard: {
    backgroundColor: '#0F172A',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  walletLabel: { fontSize: 10, fontWeight: '700', color: '#94A3B8' },
  walletAmount: { fontSize: 34, fontWeight: '800', color: '#22C55E', marginVertical: 4 },
  walletBank: { fontSize: 11, color: '#94A3B8' },
  cashoutBtn: {
    marginTop: Spacing.md,
    backgroundColor: '#16A34A',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cashoutBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: FontSize.sm },

  statsStrip: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadow.xs,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: FontSize.base, fontWeight: '800', color: Colors.text.primary },
  statLabel: { fontSize: 10, color: Colors.text.secondary, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: '#E2E8F0' },

  sectionTitle: { fontSize: FontSize.base, fontWeight: '800', color: Colors.text.primary },
  dayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadow.xs,
  },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  dayDate: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text.primary },
  daySub: { fontSize: 11, color: Colors.text.secondary, marginTop: 2 },
  dayAmount: { fontSize: FontSize.base, fontWeight: '800', color: Colors.text.primary },
  dayStatus: { fontSize: 11, color: '#16A34A', marginTop: 6, fontWeight: '600' },
});

export default EarningsScreen;

