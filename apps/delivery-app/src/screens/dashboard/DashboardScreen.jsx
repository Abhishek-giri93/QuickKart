// Delivery Partner App — Dashboard Screen

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Switch, StatusBar, Alert,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Shadow } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';

const DashboardScreen = ({ onAcceptOrder, onNavigateToEarnings }) => {
  const [isOnline, setIsOnline] = useState(true);

  const stats = [
    { label: "Today's Payout", value: '₹850', icon: '💰', sub: '9 deliveries' },
    { label: 'Active Shift', value: '5.2 hrs', icon: '⏱️', sub: 'Target: 8 hrs' },
    { label: 'Acceptance Rate', value: '96%', icon: '📈', sub: 'High incentive zone' },
    { label: 'Rider Rating', value: '⭐ 4.9', icon: '🌟', sub: 'Top rated rider' },
  ];

  const pendingRequest = {
    orderId: 'QK-9214',
    pickupStore: 'Fresh Basket Supermart',
    pickupAddress: '12, MG Road (0.6 km away)',
    dropCustomer: 'Rahul Verma',
    dropAddress: 'Flat 301, Lakeview Enclave (1.8 km)',
    totalDistance: '2.4 km',
    estTime: '18 mins',
    earnings: 65,
    surgeBonus: 15,
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      {/* Rider Top Header */}
      <View style={styles.header}>
        <View style={styles.riderRow}>
          <View style={styles.riderAvatar}>
            <Text style={{ fontSize: 28 }}>🛵</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.riderName}>Ramesh Kumar</Text>
            <Text style={styles.riderVehicle}>ID: #QK-R-8120 • Splendor Plus</Text>
          </View>
          <TouchableOpacity style={styles.earningsPill} onPress={() => onNavigateToEarnings?.()}>
            <Text style={styles.earningsPillText}>₹850 Today ›</Text>
          </TouchableOpacity>
        </View>

        {/* Online / Offline Shift Toggle */}
        <View style={[styles.statusToggleBar, isOnline ? styles.barOnline : styles.barOffline]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={[styles.statusDot, { backgroundColor: isOnline ? '#22C55E' : '#94A3B8' }]} />
            <Text style={styles.statusToggleText}>
              {isOnline ? 'DUTY ON — Ready for Deliveries' : 'DUTY OFF — Offline'}
            </Text>
          </View>
          <Switch
            value={isOnline}
            onValueChange={(val) => {
              setIsOnline(val);
              Alert.alert('Rider Status', val ? 'You are now online! Listening for delivery requests near you.' : 'You are now offline.');
            }}
            trackColor={{ false: '#475569', true: '#16A34A' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Incoming Delivery Request Card */}
        {isOnline && (
          <View style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <View style={styles.badgeNew}>
                <Text style={styles.badgeNewText}>NEW DELIVERY REQUEST 🔔</Text>
              </View>
              <Text style={styles.requestEarnings}>₹{pendingRequest.earnings}</Text>
            </View>

            {/* Pickup & Drop Points Visual */}
            <View style={styles.tripRouteBox}>
              <View style={styles.routeRow}>
                <Text style={styles.routeIcon}>🟢</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.routeLabel}>PICKUP (STORE)</Text>
                  <Text style={styles.routeStoreName}>{pendingRequest.pickupStore}</Text>
                  <Text style={styles.routeSub}>{pendingRequest.pickupAddress}</Text>
                </View>
              </View>

              <View style={styles.routeLine} />

              <View style={styles.routeRow}>
                <Text style={styles.routeIcon}>🔴</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.routeLabel}>DROP (CUSTOMER)</Text>
                  <Text style={styles.routeStoreName}>{pendingRequest.dropCustomer}</Text>
                  <Text style={styles.routeSub}>{pendingRequest.dropAddress}</Text>
                </View>
              </View>
            </View>

            {/* Distance & Surge info */}
            <View style={styles.metaStrip}>
              <Text style={styles.metaItem}>📏 Total: {pendingRequest.totalDistance}</Text>
              <Text style={styles.metaItem}>⏱️ Est: {pendingRequest.estTime}</Text>
              <Text style={[styles.metaItem, { color: '#16A34A', fontWeight: '700' }]}>🔥 +₹{pendingRequest.surgeBonus} Surge Bonus</Text>
            </View>

            {/* Accept / Decline actions */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.declineBtn}
                onPress={() => Alert.alert('Request Declined', 'Looking for next nearest delivery...')}
              >
                <Text style={styles.declineBtnText}>Decline</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.acceptBtn}
                onPress={() => onAcceptOrder?.(pendingRequest)}
              >
                <Text style={styles.acceptBtnText}>ACCEPT DELIVERY 🛵</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 4 Performance Metrics Grid */}
        <Text style={styles.sectionTitle}>Today's Performance</Text>
        <View style={styles.statsGrid}>
          {stats.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <View style={styles.statIconRow}>
                <Text style={{ fontSize: 24 }}>{s.icon}</Text>
                <Text style={styles.statValue}>{s.value}</Text>
              </View>
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text style={styles.statSub}>{s.sub}</Text>
            </View>
          ))}
        </View>

        {/* Safety & Support Banner */}
        <View style={styles.supportBanner}>
          <Text style={{ fontSize: 24, marginRight: 10 }}>🛡️</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.supportTitle}>Rider Insurance & Support</Text>
            <Text style={styles.supportSub}>QuickKart 24x7 Emergency helpline: 1800-123-QUICK</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1FAEE' },

  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  riderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  riderAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  riderName: { fontSize: FontSize.md, fontWeight: '700', color: '#FFFFFF' },
  riderVehicle: { fontSize: FontSize.xs, color: '#94A3B8', marginTop: 2 },
  earningsPill: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.pill,
  },
  earningsPillText: { color: '#FFFFFF', fontWeight: '800', fontSize: FontSize.xs },

  statusToggleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
  },
  barOnline: { backgroundColor: 'rgba(34, 197, 94, 0.25)' },
  barOffline: { backgroundColor: 'rgba(0,0,0,0.35)' },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  statusToggleText: { fontSize: FontSize.xs, fontWeight: '700', color: '#FFFFFF' },

  scrollContent: { padding: Spacing.md, gap: Spacing.md },

  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: '#E63946',
    ...Shadow.md,
  },
  requestHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  badgeNew: { backgroundColor: '#FEE2E2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeNewText: { color: '#DC2626', fontSize: 11, fontWeight: '800' },
  requestEarnings: { fontSize: 26, fontWeight: '800', color: '#16A34A' },

  tripRouteBox: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8 },
  routeRow: { flexDirection: 'row', alignItems: 'flex-start' },
  routeIcon: { fontSize: 14, marginRight: 10, marginTop: 2 },
  routeLabel: { fontSize: 9, fontWeight: '800', color: Colors.text.tertiary, letterSpacing: 0.5 },
  routeStoreName: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text.primary, marginTop: 1 },
  routeSub: { fontSize: 11, color: Colors.text.secondary, marginTop: 1 },
  routeLine: { width: 2, height: 18, backgroundColor: '#CBD5E1', marginLeft: 6, marginVertical: 3 },

  metaStrip: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12, paddingHorizontal: 4 },
  metaItem: { fontSize: 11, color: Colors.text.secondary, fontWeight: '600' },

  actionRow: { flexDirection: 'row', gap: 10 },
  declineBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  declineBtnText: { color: Colors.text.secondary, fontWeight: '700', fontSize: FontSize.sm },
  acceptBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    ...Shadow.sm,
  },
  acceptBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: FontSize.sm },

  sectionTitle: { fontSize: FontSize.base, fontWeight: '800', color: Colors.text.primary },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadow.xs,
  },
  statIconRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statValue: { fontSize: FontSize.base, fontWeight: '800', color: Colors.text.primary },
  statLabel: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.text.secondary, marginTop: 6 },
  statSub: { fontSize: 10, color: '#16A34A', marginTop: 2 },

  supportBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  supportTitle: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.text.primary },
  supportSub: { fontSize: 11, color: Colors.text.secondary, marginTop: 2 },
});

export default DashboardScreen;

