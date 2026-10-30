// Customer App — Profile & Order History Screen

import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Shadow } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { mockOrders } from '../../mock-data/orders';

const ProfileScreen = ({ onTrackOrder, onLogout }) => {
  const user = {
    name: 'Abhishek Giri',
    phone: '+91 98765 43210',
    email: 'abhishek@quickkart.com',
    walletBalance: 350,
    totalSaved: 420,
    ordersCount: 14,
  };

  const pastOrders = [
    {
      id: 'QK-849201',
      storeName: 'Fresh Basket Supermart',
      date: 'Today, 2:30 PM',
      items: 'Amul Milk (2), Fresh Tomatoes (1)',
      amount: 182,
      status: 'On the Way 🛵',
      statusColor: '#D97706',
      canTrack: true,
    },
    {
      id: 'QK-712890',
      storeName: 'Spice Garden Restaurant',
      date: 'Yesterday, 8:15 PM',
      items: 'Paneer Butter Masala (1), Butter Naan (3)',
      amount: 340,
      status: 'Delivered ✅',
      statusColor: '#16A34A',
      canTrack: false,
    },
    {
      id: 'QK-591204',
      storeName: 'Quick Bites Fast Food',
      date: '28 Oct 2026',
      items: 'Veg Cheese Burger (2), French Fries (1)',
      amount: 210,
      status: 'Delivered ✅',
      statusColor: '#16A34A',
      canTrack: false,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Header Profile Section */}
      <View style={styles.profileHeader}>
        <View style={styles.userRow}>
          <View style={styles.avatar}>
            <Text style={{ fontSize: 32 }}>👤</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.userName}>{user.name}</Text>
              <View style={styles.goldBadge}>
                <Text style={styles.goldBadgeText}>⭐ GOLD</Text>
              </View>
            </View>
            <Text style={styles.userPhone}>{user.phone}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>

        {/* Stats Strip */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>₹{user.walletBalance}</Text>
            <Text style={styles.statLabel}>QuickCash Wallet</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statVal}>₹{user.totalSaved}</Text>
            <Text style={styles.statLabel}>Total Saved</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{user.ordersCount}</Text>
            <Text style={styles.statLabel}>Orders Placed</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Recent Orders Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <TouchableOpacity onPress={() => Alert.alert('All Orders', 'Showing complete orders list...')}>
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {pastOrders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderCardTop}>
              <View>
                <Text style={styles.orderStore}>{order.storeName}</Text>
                <Text style={styles.orderDate}>{order.date} • #{order.id}</Text>
              </View>
              <Text style={[styles.orderStatus, { color: order.statusColor }]}>
                {order.status}
              </Text>
            </View>

            <Text style={styles.orderItems} numberOfLines={1}>{order.items}</Text>

            <View style={styles.orderCardBottom}>
              <Text style={styles.orderPrice}>₹{order.amount}</Text>

              {order.canTrack ? (
                <TouchableOpacity
                  style={styles.trackBtn}
                  onPress={() => onTrackOrder?.()}
                >
                  <Text style={styles.trackBtnText}>Live Track 📍</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.reorderBtn}
                  onPress={() => Alert.alert('Reorder', 'Items re-added to cart!')}
                >
                  <Text style={styles.reorderBtnText}>Reorder 🔁</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        {/* Account Settings Menu */}
        <Text style={[styles.sectionTitle, { marginTop: Spacing.md, marginBottom: Spacing.sm }]}>Account & Settings</Text>
        <View style={styles.menuCard}>
          {[
            { icon: '📍', label: 'Saved Addresses', sub: 'Home, Office & others' },
            { icon: '💳', label: 'Payment Settings', sub: 'Saved UPI, Cards & Wallets' },
            { icon: '🔔', label: 'Notification Preferences', sub: 'Offers and order alerts' },
            { icon: '💬', label: 'Help & 24x7 Customer Support', sub: 'Chat with QuickKart assistance' },
            { icon: '📜', label: 'Privacy Policy & Terms', sub: 'Legal information' },
          ].map((item, idx) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuItem, idx !== 0 && styles.menuItemBorder]}
              onPress={() => Alert.alert(item.label, `Opening ${item.label}...`)}
            >
              <Text style={{ fontSize: 20, marginRight: 12 }}>{item.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSub}>{item.sub}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            Alert.alert('Logout', 'Are you sure you want to log out of QuickKart?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Logout', style: 'destructive', onPress: () => onLogout?.() },
            ]);
          }}
        >
          <Text style={styles.logoutBtnText}>Log Out 🚪</Text>
        </TouchableOpacity>

        <Text style={styles.versionInfo}>QuickKart v1.0.0 (Phase 2 Preview)</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  profileHeader: {
    backgroundColor: '#0F172A',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  userRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: { fontSize: FontSize.md, fontWeight: '700', color: '#FFFFFF' },
  goldBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 },
  goldBadgeText: { color: '#B45309', fontSize: 10, fontWeight: '800' },
  userPhone: { fontSize: FontSize.xs, color: '#94A3B8', marginTop: 2 },
  userEmail: { fontSize: FontSize.xs, color: '#64748B' },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.md,
    paddingVertical: 12,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: FontSize.base, fontWeight: '800', color: '#FFFFFF' },
  statLabel: { fontSize: 10, color: '#94A3B8', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: '#334155' },

  scrollContent: { padding: Spacing.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  sectionTitle: { fontSize: FontSize.base, fontWeight: '800', color: Colors.text.primary },
  seeAllText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '700' },

  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.xs,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  orderCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderStore: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text.primary },
  orderDate: { fontSize: 11, color: Colors.text.tertiary, marginTop: 2 },
  orderStatus: { fontSize: 11, fontWeight: '700' },
  orderItems: { fontSize: FontSize.xs, color: Colors.text.secondary, marginVertical: 8 },
  orderCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  orderPrice: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.text.primary },
  trackBtn: { backgroundColor: '#FFF5F0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: Colors.primary },
  trackBtnText: { color: Colors.primary, fontSize: FontSize.xs, fontWeight: '700' },
  reorderBtn: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  reorderBtnText: { color: '#334155', fontSize: FontSize.xs, fontWeight: '600' },

  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    ...Shadow.xs,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md },
  menuItemBorder: { borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  menuLabel: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text.primary },
  menuSub: { fontSize: 11, color: Colors.text.tertiary, marginTop: 1 },
  menuArrow: { fontSize: 20, color: '#CBD5E1', fontWeight: '700' },

  logoutBtn: {
    marginVertical: Spacing.lg,
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  logoutBtnText: { color: '#DC2626', fontWeight: '700', fontSize: FontSize.sm },
  versionInfo: { textAlign: 'center', fontSize: 11, color: '#94A3B8' },
});

export default ProfileScreen;
