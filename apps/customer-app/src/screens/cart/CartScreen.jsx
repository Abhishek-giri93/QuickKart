// Customer App — Cart & Checkout Screen (Enterprise Polish)

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, StatusBar, Alert, Modal, Image,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Shadow } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { useCartStore } from '../../store/cartStore';

export default function CartScreen({ onBackToShopping, onOrderPlaced }) {
  const items = useCartStore((state) => state.items);
  const storeName = useCartStore((state) => state.storeName);
  const updateQty = useCartStore((state) => state.updateQty);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // UPI | COD | CARD
  const [selectedAddress, setSelectedAddress] = useState('Home');
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState('');

  // Bill calculations
  const itemsTotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = itemsTotal >= 199 || itemsTotal === 0 ? 0 : 25;
  const platformFee = items.length > 0 ? 5 : 0;
  const discount = appliedCoupon ? Math.min(appliedCoupon.discount, itemsTotal) : 0;
  const grandTotal = Math.max(0, itemsTotal + deliveryFee + platformFee - discount);
  const totalSavings = discount + (itemsTotal >= 199 ? 25 : 0);

  const availableCoupons = [
    { code: 'QUICK50', label: '₹50 OFF', desc: 'Flat ₹50 on ₹199+', discount: 50, min: 199 },
    { code: 'WELCOME100', label: '₹100 OFF', desc: '₹100 on ₹299+', discount: 100, min: 299 },
    { code: 'FREEDEL', label: 'FREE DEL', desc: 'Zero delivery fee', discount: deliveryFee, min: 99 },
  ];

  const handleApplyCouponCode = (codeToApply) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    if (code === 'QUICK50') {
      if (itemsTotal < 199) {
        Alert.alert('Minimum Order Required', 'QUICK50 requires a minimum order of ₹199');
        return;
      }
      setAppliedCoupon({ code: 'QUICK50', discount: 50 });
      setCouponCode('');
      Alert.alert('Success! 🎉', '₹50 discount applied on your order!');
    } else if (code === 'WELCOME100') {
      if (itemsTotal < 299) {
        Alert.alert('Minimum Order Required', 'WELCOME100 requires a minimum order of ₹299');
        return;
      }
      setAppliedCoupon({ code: 'WELCOME100', discount: 100 });
      setCouponCode('');
      Alert.alert('Success! 🎉', '₹100 discount applied on your order!');
    } else if (code === 'FREEDEL') {
      setAppliedCoupon({ code: 'FREEDEL', discount: deliveryFee });
      setCouponCode('');
      Alert.alert('Success! 🎉', 'Free Delivery coupon applied!');
    } else {
      Alert.alert('Invalid Coupon', 'Available codes: QUICK50, WELCOME100, FREEDEL');
    }
  };

  const handlePlaceOrder = () => {
    const newId = `#QK-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedOrderId(newId);
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
          Your order from <Text style={{ fontWeight: '700' }}>{storeName || 'Fresh Basket Supermart'}</Text> has been accepted and is being prepared in the kitchen.
        </Text>

        <View style={styles.orderIdCard}>
          <Text style={styles.orderIdLabel}>Order ID: {generatedOrderId || '#QK-9214'}</Text>
          <Text style={styles.orderEta}>Estimated Delivery: 12-15 mins ⚡</Text>
          <Text style={styles.orderOtpNotice}>Your Delivery OTP: <Text style={{ fontWeight: '800', color: '#0F172A' }}>5831</Text></Text>
        </View>

        <View style={styles.successActions}>
          <TouchableOpacity
            style={styles.trackOrderBtn}
            onPress={() => {
              setOrderSuccess(false);
              onOrderPlaced?.();
            }}
          >
            <Text style={styles.trackOrderBtnText}>🛵 Track Order Live</Text>
          </TouchableOpacity>

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
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <Image
          source={require('../../../assets/illustrations/empty-cart.png')}
          style={styles.emptyImg}
          resizeMode="contain"
        />
        <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
        <Text style={styles.emptySubtitle}>Explore verified nearby stores and add daily essentials in 12 minutes!</Text>
        <TouchableOpacity
          style={styles.browseBtn}
          onPress={() => onBackToShopping?.()}
        >
          <Text style={styles.browseBtnText}>Explore Stores 🏪</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Screen Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onBackToShopping?.()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginHorizontal: 12 }}>
          <Text style={styles.headerTitle}>Order Checkout</Text>
          <Text style={styles.headerStoreName} numberOfLines={1}>Store: {storeName || 'Fresh Basket'}</Text>
        </View>
        <TouchableOpacity onPress={clearCart} style={styles.clearCartPill}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Delivery Address Card */}
        <View style={styles.sectionCard}>
          <View style={styles.addressRow}>
            <View style={styles.addressIconBox}>
              <Text style={{ fontSize: 20 }}>{selectedAddress === 'Home' ? '🏠' : '💼'}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.addressLabel}>Delivering to {selectedAddress}</Text>
                <View style={styles.fastDeliveryTag}>
                  <Text style={styles.fastDeliveryTagText}>⚡ 12 MINS</Text>
                </View>
              </View>
              <Text style={styles.addressDetails} numberOfLines={1}>
                {selectedAddress === 'Home'
                  ? 'Flat 402, Lakeview Enclave, Sector 4'
                  : 'Tower B, 5th Floor, Cyber Tech Park'}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setAddressModalVisible(true)} style={styles.changeAddressBtn}>
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

        {/* Coupons & Offers Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeader}>Coupons & Discounts 🏷️</Text>

          {appliedCoupon ? (
            <View style={styles.appliedCouponRow}>
              <View>
                <Text style={styles.appliedCode}>🎉 {appliedCoupon.code} Applied!</Text>
                <Text style={styles.appliedDesc}>You are saving ₹{appliedCoupon.discount} on this order</Text>
              </View>
              <TouchableOpacity onPress={() => setAppliedCoupon(null)} style={styles.removeCouponBtn}>
                <Text style={styles.removeCouponText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* One-Tap Coupon Pills */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.couponPillsRow}>
                {availableCoupons.map((c) => (
                  <TouchableOpacity
                    key={c.code}
                    style={styles.couponPillCard}
                    onPress={() => handleApplyCouponCode(c.code)}
                  >
                    <View style={styles.couponPillTop}>
                      <Text style={styles.couponPillCode}>{c.code}</Text>
                      <Text style={styles.couponPillDiscount}>{c.label}</Text>
                    </View>
                    <Text style={styles.couponPillDesc}>{c.desc}</Text>
                    <Text style={styles.couponPillApply}>TAP TO APPLY →</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.couponInputRow}>
                <TextInput
                  style={styles.couponInput}
                  placeholder="Or enter coupon code..."
                  placeholderTextColor="#94A3B8"
                  value={couponCode}
                  onChangeText={setCouponCode}
                  autoCapitalize="characters"
                />
                <TouchableOpacity
                  style={[styles.applyBtn, !couponCode && styles.applyBtnDisabled]}
                  onPress={() => handleApplyCouponCode(couponCode)}
                  disabled={!couponCode}
                >
                  <Text style={styles.applyBtnText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* Bill Summary */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeader}>Bill Details</Text>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Item Total</Text>
            <Text style={styles.billVal}>₹{itemsTotal}</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Partner Fee</Text>
            {deliveryFee === 0 ? (
              <Text style={[styles.billVal, { color: '#16A34A', fontWeight: '700' }]}>FREE</Text>
            ) : (
              <Text style={styles.billVal}>₹{deliveryFee}</Text>
            )}
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Handling & Platform Fee</Text>
            <Text style={styles.billVal}>₹{platformFee}</Text>
          </View>

          {discount > 0 && (
            <View style={styles.billRow}>
              <Text style={[styles.billLabel, { color: '#16A34A', fontWeight: '700' }]}>Coupon Discount ({appliedCoupon?.code})</Text>
              <Text style={[styles.billVal, { color: '#16A34A', fontWeight: '700' }]}>− ₹{discount}</Text>
            </View>
          )}

          <View style={styles.billDivider} />

          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>To Pay</Text>
            <Text style={styles.grandTotalVal}>₹{grandTotal}</Text>
          </View>

          {totalSavings > 0 && (
            <View style={styles.savingsBanner}>
              <Text style={styles.savingsText}>🎉 You saved ₹{totalSavings} on this order!</Text>
            </View>
          )}
        </View>

        {/* Payment Method Selector */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeader}>Select Payment Mode</Text>

          {[
            { id: 'UPI', label: 'UPI (GPay, PhonePe, Paytm)', icon: '📱' },
            { id: 'COD', label: 'Cash on Delivery (Pay upon delivery)', icon: '💵' },
            { id: 'CARD', label: 'Credit or Debit Card', icon: '💳' },
          ].map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={[styles.paymentRow, paymentMethod === mode.id && styles.paymentRowActive]}
              onPress={() => setPaymentMethod(mode.id)}
            >
              <Text style={{ fontSize: 20, marginRight: 10 }}>{mode.icon}</Text>
              <Text style={[styles.paymentLabel, paymentMethod === mode.id && styles.paymentLabelActive]}>
                {mode.label}
              </Text>
              <View style={[styles.radioOuter, paymentMethod === mode.id && styles.radioOuterActive]}>
                {paymentMethod === mode.id && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Cancellation Guarantee Notice */}
        <View style={styles.guaranteeBox}>
          <Text style={styles.guaranteeIcon}>🛡️</Text>
          <Text style={styles.guaranteeText}>
            QuickKart Freshness Guarantee: 100% replacement or refund if any item is damaged or missing.
          </Text>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Floating Checkout Footer Bar */}
      <View style={styles.checkoutFooter}>
        <View>
          <Text style={styles.footerLabel}>TOTAL TO PAY</Text>
          <Text style={styles.footerAmount}>₹{grandTotal}</Text>
        </View>

        <TouchableOpacity
          style={styles.placeOrderBtn}
          onPress={handlePlaceOrder}
          activeOpacity={0.85}
        >
          <Text style={styles.placeOrderBtnText}>Place Order ({paymentMethod}) ➔</Text>
        </TouchableOpacity>
      </View>

      {/* Address Switcher Modal */}
      <Modal visible={addressModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Delivery Address</Text>
            <Text style={styles.modalSub}>Select where you want your order delivered:</Text>

            <TouchableOpacity
              style={[styles.addressOption, selectedAddress === 'Home' && styles.addressOptionActive]}
              onPress={() => {
                setSelectedAddress('Home');
                setAddressModalVisible(false);
              }}
            >
              <Text style={{ fontSize: 24, marginRight: 10 }}>🏠</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.addressOptionTitle}>Home</Text>
                <Text style={styles.addressOptionSub}>Flat 402, Lakeview Enclave, Sector 4</Text>
              </View>
              {selectedAddress === 'Home' && <Text style={{ color: '#16A34A', fontWeight: '800' }}>✓</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.addressOption, selectedAddress === 'Work' && styles.addressOptionActive]}
              onPress={() => {
                setSelectedAddress('Work');
                setAddressModalVisible(false);
              }}
            >
              <Text style={{ fontSize: 24, marginRight: 10 }}>💼</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.addressOptionTitle}>Work</Text>
                <Text style={styles.addressOptionSub}>Tower B, 5th Floor, Cyber Tech Park</Text>
              </View>
              {selectedAddress === 'Work' && <Text style={{ color: '#16A34A', fontWeight: '800' }}>✓</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setAddressModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#0F172A',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: FontSize.base,
    fontWeight: '800',
  },
  headerStoreName: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  clearCartPill: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  clearText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadow.xs,
  },
  cardHeader: {
    fontSize: FontSize.sm,
    fontWeight: '800',
    color: Colors.text.primary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressLabel: {
    fontSize: FontSize.sm,
    fontWeight: '800',
    color: Colors.text.primary,
  },
  fastDeliveryTag: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  fastDeliveryTagText: {
    color: '#059669',
    fontSize: 9,
    fontWeight: '800',
  },
  addressDetails: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  changeAddressBtn: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  changeAddressText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  itemName: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  itemPrice: {
    fontSize: 11,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 6,
    marginRight: 12,
  },
  stepperAction: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  stepperMinus: {
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 14,
  },
  stepperPlus: {
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 14,
  },
  stepperNumber: {
    fontWeight: '800',
    fontSize: 12,
    color: Colors.primary,
    paddingHorizontal: 4,
  },
  itemTotal: {
    fontSize: FontSize.sm,
    fontWeight: '800',
    color: Colors.text.primary,
    minWidth: 45,
    textAlign: 'right',
  },
  addMoreRow: {
    marginTop: 10,
    paddingTop: 8,
    alignItems: 'center',
  },
  addMoreText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  appliedCouponRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  appliedCode: {
    color: '#15803D',
    fontSize: FontSize.sm,
    fontWeight: '800',
  },
  appliedDesc: {
    color: '#166534',
    fontSize: 11,
    marginTop: 2,
  },
  removeCouponBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  removeCouponText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '700',
  },
  couponPillsRow: {
    gap: 8,
    paddingBottom: 10,
  },
  couponPillCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    width: 140,
  },
  couponPillTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  couponPillCode: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
  },
  couponPillDiscount: {
    fontSize: 9,
    fontWeight: '800',
    backgroundColor: '#FEF3C7',
    color: '#B45309',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  couponPillDesc: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 4,
  },
  couponPillApply: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 6,
  },
  couponInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    height: 40,
    fontSize: 12,
  },
  applyBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  billLabel: {
    fontSize: 12,
    color: '#475569',
  },
  billVal: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  billDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 8,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  grandTotalLabel: {
    fontSize: FontSize.base,
    fontWeight: '800',
    color: Colors.text.primary,
  },
  grandTotalVal: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text.primary,
  },
  savingsBanner: {
    backgroundColor: '#DCFCE7',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  savingsText: {
    color: '#15803D',
    fontSize: 11,
    fontWeight: '800',
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  paymentRowActive: {
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    paddingHorizontal: 6,
  },
  paymentLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  paymentLabelActive: {
    color: Colors.text.primary,
    fontWeight: '800',
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  guaranteeIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  guaranteeText: {
    flex: 1,
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },
  checkoutFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    ...Shadow.lg,
  },
  footerLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
  },
  footerAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text.primary,
  },
  placeOrderBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: BorderRadius.pill,
  },
  placeOrderBtnText: {
    color: '#FFFFFF',
    fontSize: FontSize.sm,
    fontWeight: '800',
  },
  emptyImg: {
    width: 190,
    height: 190,
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.text.primary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  browseBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: BorderRadius.pill,
  },
  browseBtnText: {
    color: '#FFFFFF',
    fontSize: FontSize.base,
    fontWeight: '800',
  },
  successContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  successIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  successTitle: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
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
  orderIdLabel: {
    fontSize: FontSize.sm,
    fontWeight: '800',
    color: Colors.text.primary,
  },
  orderEta: {
    fontSize: FontSize.xs,
    color: '#16A34A',
    fontWeight: '800',
    marginTop: 4,
  },
  orderOtpNotice: {
    fontSize: FontSize.xs,
    color: '#64748B',
    marginTop: 4,
  },
  successActions: {
    width: '100%',
    gap: 12,
  },
  trackOrderBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: BorderRadius.pill,
    alignItems: 'center',
  },
  trackOrderBtnText: {
    color: '#FFFFFF',
    fontSize: FontSize.base,
    fontWeight: '800',
  },
  continueBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: BorderRadius.pill,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  continueBtnText: {
    color: '#334155',
    fontSize: FontSize.base,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.lg,
  },
  modalTitle: {
    fontSize: FontSize.md,
    fontWeight: '800',
    color: Colors.text.primary,
  },
  modalSub: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
    marginBottom: 16,
  },
  addressOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: BorderRadius.sm,
    backgroundColor: '#F8FAFC',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  addressOptionActive: {
    borderColor: '#16A34A',
    backgroundColor: '#F0FDF4',
  },
  addressOptionTitle: {
    fontSize: FontSize.sm,
    fontWeight: '800',
    color: Colors.text.primary,
  },
  addressOptionSub: {
    fontSize: 11,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  modalCloseBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  modalCloseText: {
    color: '#475569',
    fontWeight: '700',
    fontSize: 13,
  },
});
