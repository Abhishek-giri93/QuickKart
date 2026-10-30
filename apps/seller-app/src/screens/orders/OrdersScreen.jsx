// Seller App — Orders Management Screen

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Shadow } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';

const OrdersScreen = () => {
  const [activeTab, setActiveTab] = useState('Preparing');

  const ordersData = [
    {
      id: 'QK-9210',
      status: 'Preparing',
      customerName: 'Ananya Roy',
      phone: '+91 98200 11223',
      items: [
        { name: 'Fresh Tomatoes', qty: 2, price: 60 },
        { name: 'Amul Milk 1L', qty: 1, price: 66 },
        { name: 'Green Chillies 100g', qty: 1, price: 15 },
      ],
      total: 141,
      payment: 'Paid Online',
      orderTime: '12 mins ago',
      riderAssigned: 'Raju (Arriving in 6 mins)',
    },
    {
      id: 'QK-9208',
      status: 'Ready',
      customerName: 'Karan Mehra',
      phone: '+91 98765 00112',
      items: [
        { name: 'Tata Salt 1kg', qty: 2, price: 40 },
        { name: 'Sugar 1kg', qty: 1, price: 45 },
      ],
      total: 85,
      payment: 'Cash on Delivery',
      orderTime: '24 mins ago',
      riderAssigned: 'Vikram (Waiting at store)',
    },
    {
      id: 'QK-9201',
      status: 'Completed',
      customerName: 'Sunita Patel',
      phone: '+91 91234 56789',
      items: [
        { name: 'Aashirvaad Atta 5kg', qty: 1, price: 235 },
      ],
      total: 235,
      payment: 'Paid Online',
      orderTime: '1 hr ago',
      riderAssigned: 'Delivered by Ramesh',
    },
  ];

  const filteredOrders = ordersData.filter((o) => o.status === activeTab);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      {/* Screen Title */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order Management</Text>
        <Text style={styles.headerSubtitle}>Manage incoming & ongoing kitchen/packing orders</Text>
      </View>

      {/* Tab Filter Pills */}
      <View style={styles.tabBar}>
        {['Preparing', 'Ready', 'Completed'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabBtnText, activeTab === tab && styles.tabBtnTextActive]}>
              {tab} ({ordersData.filter((o) => o.status === tab).length})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 48, marginBottom: 8 }}>📋</Text>
            <Text style={styles.emptyText}>No orders in {activeTab}</Text>
          </View>
        ) : (
          filteredOrders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderCardTop}>
                <View>
                  <Text style={styles.orderId}>Order #{order.id}</Text>
                  <Text style={styles.customerLine}>👤 {order.customerName} • {order.orderTime}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>{order.status}</Text>
                </View>
              </View>

              {/* Items Table */}
              <View style={styles.itemsTable}>
                {order.items.map((it, idx) => (
                  <View key={idx} style={styles.itemRow}>
                    <Text style={styles.itemQuantity}>{it.qty}x</Text>
                    <Text style={styles.itemName}>{it.name}</Text>
                    <Text style={styles.itemPrice}>₹{it.price}</Text>
                  </View>
                ))}
              </View>

              {/* Summary line */}
              <View style={styles.orderSummaryRow}>
                <Text style={styles.paymentInfo}>💳 {order.payment}</Text>
                <Text style={styles.orderGrandTotal}>Total: ₹{order.total}</Text>
              </View>

              {/* Rider Status */}
              <View style={styles.riderRow}>
                <Text style={styles.riderText}>🛵 Rider: <Text style={{ fontWeight: '700' }}>{order.riderAssigned}</Text></Text>
              </View>

              {/* Action Buttons depending on status */}
              <View style={styles.actionRow}>
                {order.status === 'Preparing' && (
                  <TouchableOpacity
                    style={styles.readyBtn}
                    onPress={() => Alert.alert('Order Ready! 📦', `Order #${order.id} marked as packed and ready for delivery partner pickup.`)}
                  >
                    <Text style={styles.readyBtnText}>Mark as Packed & Ready 📦</Text>
                  </TouchableOpacity>
                )}

                {order.status === 'Ready' && (
                  <TouchableOpacity
                    style={styles.handoverBtn}
                    onPress={() => Alert.alert('Handover Verified', `Handed over to rider for delivery.`)}
                  >
                    <Text style={styles.handoverBtnText}>Verify & Handover to Rider 🛵</Text>
                  </TouchableOpacity>
                )}

                {order.status === 'Completed' && (
                  <TouchableOpacity
                    style={styles.historyBtn}
                    onPress={() => Alert.alert('Invoice', `Printing order invoice #${order.id}...`)}
                  >
                    <Text style={styles.historyBtnText}>View Receipt / Invoice 🧾</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
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

  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: BorderRadius.pill,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  tabBtnActive: { backgroundColor: Colors.primary },
  tabBtnText: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.text.secondary },
  tabBtnTextActive: { color: '#FFFFFF', fontWeight: '700' },

  scrollContent: { padding: Spacing.md, gap: Spacing.sm },

  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadow.xs,
  },
  orderCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderId: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.text.primary },
  customerLine: { fontSize: 11, color: Colors.text.secondary, marginTop: 2 },
  statusBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusBadgeText: { color: '#166534', fontSize: 11, fontWeight: '700' },

  itemsTable: { marginVertical: 10, backgroundColor: '#F8FAFC', padding: 8, borderRadius: 6 },
  itemRow: { flexDirection: 'row', paddingVertical: 3, alignItems: 'center' },
  itemQuantity: { width: 30, fontSize: FontSize.xs, fontWeight: '700', color: Colors.primary },
  itemName: { flex: 1, fontSize: FontSize.xs, color: Colors.text.primary },
  itemPrice: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.text.primary },

  orderSummaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  paymentInfo: { fontSize: 11, color: Colors.text.secondary },
  orderGrandTotal: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.text.primary },

  riderRow: { marginTop: 8, paddingVertical: 6, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  riderText: { fontSize: 11, color: Colors.text.secondary },

  actionRow: { marginTop: 10 },
  readyBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  readyBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FontSize.xs },
  handoverBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  handoverBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FontSize.xs },
  historyBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  historyBtnText: { color: Colors.text.primary, fontWeight: '600', fontSize: FontSize.xs },

  emptyContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { color: Colors.text.tertiary, fontSize: FontSize.sm },
});

export default OrdersScreen;
