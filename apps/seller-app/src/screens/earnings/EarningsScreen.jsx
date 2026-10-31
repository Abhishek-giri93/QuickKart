// Seller App — Earnings & Payouts Screen

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
    weeklySales: 38420,
    commissionDeducted: 1921,
    availableBalance: 14650,
    bankName: 'HDFC Bank Ltd.',
    accountNo: '•••• •••• 4912',
    ifsc: 'HDFC0001234',
  };

  const payouts = [
    { id: 'SET-99124', date: '28 Oct 2026', amount: 18240, status: 'Settled to Bank ✅', ref: 'UPI/6291048' },
    { id: 'SET-99081', date: '21 Oct 2026', amount: 15490, status: 'Settled to Bank ✅', ref: 'UPI/6182903' },
    { id: 'SET-98942', date: '14 Oct 2026', amount: 16820, status: 'Settled to Bank ✅', ref: 'UPI/5982104' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      {/* Screen Title */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Earnings & Settlements</Text>
        <Text style={styles.headerSubtitle}>Monitor daily business revenue and bank transfers</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Available for Payout Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>AVAILABLE FOR PAYOUT</Text>
          <Text style={styles.balanceAmount}>₹{earnings.availableBalance}</Text>
          <Text style={styles.cycleNote}>Next automated weekly cycle on Monday morning</Text>

          <TouchableOpacity
            style={styles.withdrawBtn}
            onPress={() => Alert.alert('Instant Transfer Initiated', `₹${earnings.availableBalance} will be credited to ${earnings.bankName} (${earnings.accountNo}) within 15 minutes.`)}
          >
            <Text style={styles.withdrawBtnText}>Transfer to Bank Now ⚡</Text>
          </TouchableOpacity>
        </View>

        {/* Breakdown Summary */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardTitle}>Sales Breakdown (This Month)</Text>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Gross Order Sales</Text>
            <Text style={styles.rowVal}>₹{earnings.weeklySales}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>QuickKart Commission (5%)</Text>
            <Text style={[styles.rowVal, { color: Colors.status.error }]}>− ₹{earnings.commissionDeducted}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Customer Delivery Subsidies</Text>
            <Text style={[styles.rowVal, { color: Colors.status.success }]}>+ ₹320</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.netRow}>
            <Text style={styles.netLabel}>Net Merchant Earnings</Text>
            <Text style={styles.netVal}>₹{earnings.weeklySales - earnings.commissionDeducted + 320}</Text>
          </View>
        </View>

        {/* Linked Bank Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardTitle}>Primary Settlement Bank Account</Text>
          <View style={styles.bankRow}>
            <View style={styles.bankIcon}>
              <Text style={{ fontSize: 24 }}>🏛️</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.bankName}>{earnings.bankName}</Text>
              <Text style={styles.bankAcc}>A/C: {earnings.accountNo} • IFSC: {earnings.ifsc}</Text>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>VERIFIED & ACTIVE ✅</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Past Payouts History */}
        <Text style={[styles.sectionTitle, { marginTop: Spacing.md, marginBottom: Spacing.sm }]}>Past Settlement History</Text>
        {payouts.map((p) => (
          <View key={p.id} style={styles.payoutCard}>
            <View style={styles.payoutTop}>
              <View>
                <Text style={styles.payoutId}>Payout #{p.id}</Text>
                <Text style={styles.payoutDate}>{p.date} • {p.ref}</Text>
              </View>
              <Text style={styles.payoutAmount}>₹{p.amount}</Text>
            </View>
            <Text style={styles.payoutStatus}>{p.status}</Text>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: '800', color: '#FFFFFF' },
  headerSubtitle: { fontSize: FontSize.xs, color: '#A7F3D0', marginTop: 2 },

  scrollContent: { padding: Spacing.md, gap: Spacing.md },

  balanceCard: {
    backgroundColor: '#0F172A',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  balanceLabel: { fontSize: 10, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.5 },
  balanceAmount: { fontSize: 32, fontWeight: '800', color: '#FFFFFF', marginVertical: 4 },
  cycleNote: { fontSize: 11, color: '#94A3B8' },
  withdrawBtn: {
    marginTop: Spacing.md,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  withdrawBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FontSize.sm },

  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadow.xs,
  },
  cardTitle: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text.primary, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  rowLabel: { fontSize: FontSize.xs, color: Colors.text.secondary },
  rowVal: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.text.primary },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 8 },
  netRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  netLabel: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.text.primary },
  netVal: { fontSize: FontSize.md, fontWeight: '800', color: Colors.primary },

  bankRow: { flexDirection: 'row', alignItems: 'center' },
  bankIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankName: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text.primary },
  bankAcc: { fontSize: 11, color: Colors.text.secondary, marginTop: 2 },
  verifiedBadge: { marginTop: 4, backgroundColor: '#DCFCE7', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  verifiedText: { color: '#166534', fontSize: 9, fontWeight: '800' },

  sectionTitle: { fontSize: FontSize.base, fontWeight: '800', color: Colors.text.primary },
  payoutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadow.xs,
  },
  payoutTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  payoutId: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.text.primary },
  payoutDate: { fontSize: 10, color: Colors.text.tertiary, marginTop: 2 },
  payoutAmount: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.text.primary },
  payoutStatus: { fontSize: 11, color: '#16A34A', marginTop: 4, fontWeight: '600' },
});

export default EarningsScreen;

