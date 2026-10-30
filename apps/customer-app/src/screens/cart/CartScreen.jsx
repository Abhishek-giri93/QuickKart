// Customer App — Cart & Checkout Screen

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, StatusBar, Alert,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Shadow } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { useCartStore } from '../../store/cartStore';

const CartScreen = ({ onBackToShopping, onOrderPlaced }) => {
  const items = useCartStore((state) => state.items);
  const storeName = useCartStore((state) => state.storeName);
  const updateQty = useCartStore((state) => state.updateQty);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // UPI | COD | CARD
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Bill calculations
  const itemsTotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = itemsTotal >= 199 || itemsTotal === 0 ? 0 : 25;
  const platformFee = items.length > 0 ? 5 : 0;
  const discount = appliedCoupon ? Math.min(appliedCoupon.discount, itemsTotal) : 0;
  const grandTotal = Math.max(0, itemsTotal + deliveryFee + platformFee - discount);

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'QUICK50') {
      setAppliedCoupon({ code: 'QUICK50', discount: 50 });
      Alert.alert('Success! 🎉', '₹50 discount applied on your order!');
    } else {
      Alert.alert('Invalid Coupon', 'Please enter a valid code (Try QUICK50)');
    }
  };

  const handlePlaceOrder = () => {
    setOrderSuccess(true);
    setTimeout(() => {
      clearCart();
    }, 1500);
  };

  if (orderSuccess) {
    return (
      <View style={styles.successContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.successIconCircle}>
          <Text style={{ fontSize: 64 }}>🎉</Text>
        </View>
        <Text style={styles.successTitle}>Order Placed Successfully!</Text>
        <Text style={styles.successSubtitle}>
          Your order from <Text style={{ fontWeight: '700' }}>{storeName || 'QuickKart Store'}</Text> has been received and is being prepared.
        </Text>

        <View style={styles.orderIdCard}>
          <Text style={styles.orderIdLabel}>Order ID: #QK-{Math.floor(100000 + Math.random() * 900000)}</Text>
          <Text style={styles.orderEta}>Estimated Delivery: 20-25 mins 🕒</Text>
        </View>

        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => {
            setOrderSuccess(false);
            onBackToShopping?.();
          }}
        >
          <Text style={styles.continueBtnText}>Continue Shopping 🛍️</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <Text style={{ fontSize: 72, marginBottom: Spacing.md }}>🛒</Text>
        <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
        <Text style={styles.emptySubtitle}>Explore nearby stores and add delicious food or fresh groceries!</Text>
        <TouchableOpacity
          style={styles.browseBtn}
          onPress={() => onBackToShopping?.()}
        >
          <Text style={styles.browseBtnText}>Browse Stores 🏪</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Screen Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onBackToShopping?.()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Review Cart</Text>
          <Text style={styles.headerStoreName}>{storeName || 'Selected Store'}</Text>
        </View>
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Delivery Address Banner */}
        <View style={styles.sectionCard}>
          <View style={styles.addressRow}>
            <Text style={{ fontSize: 24, marginRight: 10 }}>📍</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.addressLabel}>Delivering to Home</Text>
              <Text style={styles.addressDetails} numberOfLines={1}>Flat 402, Green Valley Apartments, Near City Center</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.changeAddressText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cart Items List */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeader}>Items in Cart ({items.length})</Text>

          {items.map((item) => (
            <View key={item.productId} style={styles.itemRow}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>₹{item.price} each</Text>
              </View>

              {/* Stepper */}
              <View style={styles.stepper}>
                <TouchableOpacity
                  style={styles.stepperAction}
                  onPress={() => updateQty(item.productId, item.qty - 1)}
                >
                  <Text style={styles.stepperMinus}>−</Text>
                </TouchableOpacity>
                <Text style={styles.stepperNumber}>{item.qty}</Text>
                <TouchableOpacity
                  style={styles.stepperAction}
                  onPress={() => updateQty(item.productId, item.qty + 1)}
                >
                  <Text style={styles.stepperPlus}>+</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.itemTotal}>₹{item.price * item.qty}</Text>
            </View>
          ))}

          <TouchableOpacity
            style={styles.addMoreRow}
            onPress={() => onBackToShopping?.()}
          >
            <Text style={styles.addMoreText}>+ Add more items from {storeName || 'store'}</Text>
          </TouchableOpacity>
        </View>

        {/* Coupons & Offers */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeader}>Coupons & Offers 🏷️</Text>
          {appliedCoupon ? (
            <View style={styles.appliedCouponRow}>
              <View>
                <Text style={styles.appliedCode}>{appliedCoupon.code} Applied!</Text>
                <Text style={styles.appliedDesc}>You saved ₹{appliedCoupon.discount}</Text>
              </View>
              <TouchableOpacity onPress={() => setAppliedCoupon(null)}>
                <Text style={styles.removeCouponText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <View style={styles.couponInputRow}>
                <TextInput
                  style={styles.couponInput}
                  placeholder="Enter Coupon Code"
                  value={couponCode}
                  onChangeText={setCouponCode}
                  autoCapitalize="characters"
                />
                <TouchableOpacity
                  style={styles.applyBtn}
                  onPress={handleApplyCoupon}
                >
                  <Text style={styles.applyBtnText}>APPLY</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.suggestedCoupon}
                onPress={() => {
                  setCouponCode('QUICK50');
                  setAppliedCoupon({ code: 'QUICK50', discount: 50 });
                }}
              >
                <Text style={styles.suggestedCode}>QUICK50</Text>
                <Text style={styles.suggestedText}>• Tap to apply ₹50 off</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Payment Options */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeader}>Payment Method 💳</Text>
          <View style={styles.paymentMethodsRow}>
            {['UPI', 'COD', 'Card'].map((pm) => (
              <TouchableOpacity
                key={pm}
                style={[styles.pmChip, paymentMethod === pm && styles.pmChipActive]}
                onPress={() => setPaymentMethod(pm)}
              >
                <Text style={[styles.pmText, paymentMethod === pm && styles.pmTextActive]}>
                  {pm === 'UPI' ? '⚡ UPI / GPay' : pm === 'COD' ? '💵 Cash on Delivery' : '💳 Debit/Credit'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bill Summary */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeader}>Bill Details</Text>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Item Total</Text>
            <Text style={styles.billValue}>₹{itemsTotal}</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Fee</Text>
            <Text style={[styles.billValue, deliveryFee === 0 && { color: Colors.status.success }]}>
              {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
            </Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Platform & Packaging Fee</Text>
            <Text style={styles.billValue}>₹{platformFee}</Text>
          </View>

          {discount > 0 && (
            <View style={styles.billRow}>
              <Text style={[styles.billLabel, { color: Colors.status.success }]}>Coupon Discount</Text>
              <Text style={[styles.billValue, { color: Colors.status.success }]}>− ₹{discount}</Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>To Pay</Text>
            <Text style={styles.grandTotalValue}>₹{grandTotal}</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Bottom Order Bar */}
      <View style={styles.stickyFooter}>
        <View>
          <Text style={styles.footerLabel}>TOTAL AMOUNT</Text>
          <Text style={styles.footerAmount}>₹{grandTotal}</Text>
        </View>

        <TouchableOpacity
          style={styles.orderBtn}
          onPress={handlePlaceOrder}
          activeOpacity={0.85}
        >
          <Text style={styles.orderBtnText}>Place Order →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: { padding: 4 },
  backBtnText: { fontSize: 24, fontWeight: '700', color: Colors.text.primary },
  headerTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text.primary },
  headerStoreName: { fontSize: FontSize.xs, color: Colors.text.secondary },
  clearText: { color: Colors.status.error, fontSize: FontSize.sm, fontWeight: '600' },

  scrollContent: { padding: Spacing.md, gap: Spacing.md },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadow.xs,
  },
  cardHeader: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text.primary, marginBottom: Spacing.sm },

  addressRow: { flexDirection: 'row', alignItems: 'center' },
  addressLabel: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text.primary },
  addressDetails: { fontSize: FontSize.xs, color: Colors.text.secondary, marginTop: 2 },
  changeAddressText: { color: Colors.primary, fontSize: FontSize.xs, fontWeight: '700' },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  itemName: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text.primary },
  itemPrice: { fontSize: FontSize.xs, color: Colors.text.secondary, marginTop: 2 },

  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 6,
    backgroundColor: '#FFF5F0',
  },
  stepperAction: { paddingHorizontal: 10, paddingVertical: 4 },
  stepperMinus: { color: Colors.primary, fontSize: 16, fontWeight: '700' },
  stepperPlus: { color: Colors.primary, fontSize: 16, fontWeight: '700' },
  stepperNumber: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary, paddingHorizontal: 4 },
  itemTotal: { width: 60, textAlign: 'right', fontSize: FontSize.sm, fontWeight: '700', color: Colors.text.primary },

  addMoreRow: { paddingTop: 12, alignItems: 'center' },
  addMoreText: { color: Colors.primary, fontSize: FontSize.xs, fontWeight: '700' },

  couponInputRow: { flexDirection: 'row', gap: 8 },
  couponInput: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: FontSize.sm,
    backgroundColor: '#F8FAFC',
  },
  applyBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    borderRadius: 6,
    justifyContent: 'center',
  },
  applyBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FontSize.xs },
  suggestedCoupon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#FEF3C7',
    padding: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  suggestedCode: { color: '#B45309', fontWeight: '800', fontSize: 11 },
  suggestedText: { color: '#B45309', fontSize: 11, marginLeft: 4 },
  appliedCouponRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    padding: 10,
    borderRadius: 6,
  },
  appliedCode: { color: '#166534', fontWeight: '700', fontSize: FontSize.sm },
  appliedDesc: { color: '#166534', fontSize: FontSize.xs },
  removeCouponText: { color: Colors.status.error, fontWeight: '700', fontSize: FontSize.xs },

  paymentMethodsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  pmChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
  },
  pmChipActive: { borderColor: Colors.primary, backgroundColor: '#FFF5F0' },
  pmText: { fontSize: FontSize.xs, color: Colors.text.secondary, fontWeight: '500' },
  pmTextActive: { color: Colors.primary, fontWeight: '700' },

  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  billLabel: { fontSize: FontSize.xs, color: Colors.text.secondary },
  billValue: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.text.primary },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 8 },
  grandTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  grandTotalLabel: { fontSize: FontSize.base, fontWeight: '800', color: Colors.text.primary },
  grandTotalValue: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary },

  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadow.lg,
  },
  footerLabel: { fontSize: 10, color: Colors.text.tertiary, fontWeight: '700' },
  footerAmount: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.text.primary },
  orderBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  orderBtnText: { color: '#FFFFFF', fontSize: FontSize.base, fontWeight: '700' },

  emptyContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.text.primary, marginBottom: 6 },
  emptySubtitle: { fontSize: FontSize.sm, color: Colors.text.secondary, textAlign: 'center', marginBottom: Spacing.xl },
  browseBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: BorderRadius.pill,
  },
  browseBtnText: { color: '#FFFFFF', fontSize: FontSize.base, fontWeight: '700' },

  successContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  successIconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  successTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.text.primary, textAlign: 'center' },
  successSubtitle: { fontSize: FontSize.sm, color: Colors.text.secondary, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  orderIdCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    marginVertical: Spacing.xl,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  orderIdLabel: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text.primary },
  orderEta: { fontSize: FontSize.xs, color: Colors.status.success, fontWeight: '700', marginTop: 4 },
  continueBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: BorderRadius.pill,
  },
  continueBtnText: { color: '#FFFFFF', fontSize: FontSize.base, fontWeight: '700' },
});

export default CartScreen;
