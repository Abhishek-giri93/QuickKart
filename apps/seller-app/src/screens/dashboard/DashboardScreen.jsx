// Seller App — Dashboard Screen

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Switch, StatusBar, Alert,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Shadow } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';

const DashboardScreen = ({ onNavigateToOrders, onNavigateToProducts, onNavigateToEarnings }) => {
  const [isStoreOpen, setIsStoreOpen] = useState(true);

  const stats = [
    { label: "Today's Sales", value: '₹4,850', icon: '💰', sub: '+18% vs yesterday' },
    { label: 'Orders Received', value: '18', icon: '📦', sub: '3 pending' },
    { label: 'Avg Prep Time', value: '14 min', icon: '⏱️', sub: 'Fast performance' },
    { label: 'Store Rating', value: '⭐ 4.6', icon: '🌟', sub: 'Based on 238 reviews' },
  ];

  const incomingOrders = [
    {
      id: 'QK-9214',
      customerName: 'Rahul Verma',
      items: 'Amul Milk 1L (2), Tata Salt 1kg (1)',
      total: 152,
      timeAgo: '2 mins ago',
      payment: 'Paid Online (UPI)',
    },
    {
      id: 'QK-9215',
      customerName: 'Priya Sharma',
      items: 'Fresh Tomatoes 1kg (1), Potatoes 2kg (1)',
      total: 90,
      timeAgo: ' Just now',
      payment: 'Cash on Delivery',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      {/* Top Merchant Header */}
      <View style={styles.header}>
        <View style={styles.storeProfileRow}>
          <View style={styles.storeAvatar}>
            <Text style={{ fontSize: 28 }}>🏪</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.storeName}>Fresh Basket Supermart</Text>
            <Text style={styles.storeId}>Merchant ID: #QK-M-7492</Text>
          </View>
        </View>

        {/* Store Open / Closed Toggle Bar */}
        <View style={[styles.statusToggleBar, isStoreOpen ? styles.barOpen : styles.barClosed]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={[styles.statusDot, { backgroundColor: isStoreOpen ? '#22C55E' : '#EF4444' }]} />
            <Text style={styles.statusToggleText}>
              {isStoreOpen ? 'STORE ONLINE — Accepting Orders' : 'STORE OFFLINE — Paused'}
            </Text>
          </View>
          <Switch
            value={isStoreOpen}
            onValueChange={(val) => {
              setIsStoreOpen(val);
              Alert.alert('Store Status', val ? 'Your store is now ONLINE and visible to customers!' : 'Your store is now PAUSED.');
            }}
            trackColor={{ false: '#64748B', true: '#16A34A' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Urgent Incoming Orders Box */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Incoming Orders (New)</Text>
          <TouchableOpacity onPress={() => onNavigateToOrders?.()}>
            <Text style={styles.viewAllText}>View All ({incomingOrders.length})</Text>
          </TouchableOpacity>
        </View>

        {incomingOrders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderId}>Order #{order.id}</Text>
                <Text style={styles.orderCustomer}>{order.customerName} • <Text style={{ color: Colors.primary, fontWeight: '700' }}>{order.timeAgo}</Text></Text>
              </View>
              <Text style={styles.orderPrice}>₹{order.total}</Text>
            </View>

            <Text style={styles.orderItemsText} numberOfLines={2}>{order.items}</Text>
            <Text style={styles.orderPaymentText}>💳 {order.payment}</Text>

            <View style={styles.orderActions}>
              <TouchableOpacity
                style={styles.rejectBtn}
                onPress={() => Alert.alert('Reject Order', 'Are you sure you want to decline this order?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Decline', style: 'destructive' }
                ])}
              >
                <Text style={styles.rejectBtnText}>Decline</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.acceptBtn}
                onPress={() => {
                  Alert.alert('Order Accepted! 🍳', `Order #${order.id} marked as 'Preparing'. Rider is being assigned.`);
                }}
              >
                <Text style={styles.acceptBtnText}>Accept & Prepare 🍳</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* 4 Performance Metrics Grid */}
        <Text style={[styles.sectionTitle, { marginTop: Spacing.md, marginBottom: Spacing.sm }]}>Today's Performance</Text>
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

        {/* Quick Management Shortcuts */}
        <Text style={[styles.sectionTitle, { marginTop: Spacing.md, marginBottom: Spacing.sm }]}>Quick Store Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => onNavigateToProducts?.()}>
            <Text style={{ fontSize: 28, marginBottom: 4 }}>📦</Text>
            <Text style={styles.actionBtnTitle}>Manage Stock</Text>
            <Text style={styles.actionBtnSub}>Update product prices & stock</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => onNavigateToEarnings?.()}>
            <Text style={{ fontSize: 28, marginBottom: 4 }}>💵</Text>
            <Text style={styles.actionBtnTitle}>Settlements</Text>
            <Text style={styles.actionBtnSub}>Bank payouts & commission</Text>
          </TouchableOpacity>
        </View>

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
  storeProfileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  storeAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeName: { fontSize: FontSize.md, fontWeight: '700', color: '#FFFFFF' },
  storeId: { fontSize: FontSize.xs, color: '#A7F3D0', marginTop: 2 },

  statusToggleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
  },
  barOpen: { backgroundColor: 'rgba(255,255,255,0.18)' },
  barClosed: { backgroundColor: 'rgba(0,0,0,0.3)' },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  statusToggleText: { fontSize: FontSize.xs, fontWeight: '700', color: '#FFFFFF' },

  scrollContent: { padding: Spacing.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  sectionTitle: { fontSize: FontSize.base, fontWeight: '800', color: Colors.text.primary },
  viewAllText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '700' },

  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadow.xs,
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderId: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.text.primary },
  orderCustomer: { fontSize: FontSize.xs, color: Colors.text.secondary, marginTop: 2 },
  orderPrice: { fontSize: FontSize.base, fontWeight: '800', color: Colors.primary },
  orderItemsText: { fontSize: FontSize.xs, color: Colors.text.primary, marginVertical: 8, lineHeight: 18 },
  orderPaymentText: { fontSize: 11, color: Colors.text.secondary, marginBottom: 12 },

  orderActions: { flexDirection: 'row', gap: 10 },
  rejectBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
  },
  rejectBtnText: { color: '#DC2626', fontWeight: '700', fontSize: FontSize.xs },
  acceptBtn: {
    flex: 2,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  acceptBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FontSize.xs },

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

  actionGrid: { flexDirection: 'row', gap: 10 },
  actionBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadow.xs,
  },
  actionBtnTitle: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text.primary },
  actionBtnSub: { fontSize: 10, color: Colors.text.tertiary, marginTop: 2 },
});

export default DashboardScreen;

