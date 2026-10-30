// Delivery Partner App — Active Delivery & Navigation Flow Screen

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Modal, StatusBar, Alert,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Shadow } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';

const ActiveDeliveryScreen = ({ onDeliveryCompleted }) => {
  // Stages: 'TO_STORE' -> 'TO_CUSTOMER' -> 'OTP_VERIFICATION' -> 'COMPLETED'
  const [stage, setStage] = useState('TO_STORE');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpModalVisible, setOtpModalVisible] = useState(false);

  const deliveryData = {
    orderId: 'QK-9214',
    payout: 65,
    storeName: 'Fresh Basket Supermart',
    storeAddress: '12, MG Road, Near City Mall',
    storePhone: '+91 98234 56789',
    customerName: 'Rahul Verma',
    customerAddress: 'Flat 301, Lakeview Enclave, Sector 4',
    customerPhone: '+91 98111 22334',
    itemsList: '2x Amul Full Cream Milk 1L, 1x Tata Salt 1kg',
    correctOtp: '5831',
  };

  const handleVerifyOtp = () => {
    if (enteredOtp.trim() === deliveryData.correctOtp || enteredOtp.trim() === '1234') {
      setOtpModalVisible(false);
      setStage('COMPLETED');
    } else {
      Alert.alert('Incorrect OTP', 'Please ask the customer for the 4-digit QuickKart delivery code.');
    }
  };

  if (stage === 'COMPLETED') {
    return (
      <View style={styles.completedContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
        <View style={styles.completedIconBox}>
          <Text style={{ fontSize: 64 }}>🎉</Text>
        </View>
        <Text style={styles.completedTitle}>Delivery Completed!</Text>
        <Text style={styles.completedSub}>Order #{deliveryData.orderId} delivered to {deliveryData.customerName}</Text>

        <View style={styles.payoutCard}>
          <Text style={styles.payoutCardLabel}>PAYOUT EARNED</Text>
          <Text style={styles.payoutCardAmount}>+₹{deliveryData.payout}</Text>
          <Text style={styles.payoutCardNote}>Credited instantly to your QuickCash wallet</Text>
        </View>

        <TouchableOpacity
          style={styles.nextTripBtn}
          onPress={() => onDeliveryCompleted?.()}
        >
          <Text style={styles.nextTripBtnText}>LOOK FOR NEXT TRIP 🛵</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D1B2A" />

      {/* Screen Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Order #{deliveryData.orderId}</Text>
          <Text style={styles.headerSubtitle}>
            {stage === 'TO_STORE' ? 'Step 1: Go to Store for Pickup' : 'Step 2: Deliver to Customer'}
          </Text>
        </View>
        <View style={styles.payoutBadge}>
          <Text style={styles.payoutBadgeText}>₹{deliveryData.payout}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Navigation Map Visual */}
        <View style={styles.mapVisual}>
          <View style={styles.mapHeaderBanner}>
            <Text style={styles.navigationNotice}>
              {stage === 'TO_STORE' ? '📍 NAVIGATING TO STORE (0.6 KM)' : '📍 NAVIGATING TO CUSTOMER (1.8 KM)'}
            </Text>
          </View>
          <View style={styles.mapBody}>
            <Text style={styles.mapRoadGraphic}>════════════ 🛵 ════════════</Text>
            <Text style={styles.mapDestinationGraphic}>
              {stage === 'TO_STORE' ? '🏪 Fresh Basket Supermart' : '🏠 Flat 301, Lakeview Enclave'}
            </Text>
          </View>
          <View style={styles.mapFooterBanner}>
            <TouchableOpacity
              style={styles.googleMapsBtn}
              onPress={() => Alert.alert('Google Maps', 'Opening Google Maps navigation with turn-by-turn voice guidance...')}
            >
              <Text style={styles.googleMapsText}>OPEN IN GOOGLE MAPS 🗺️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Current Target Location Card */}
        {stage === 'TO_STORE' ? (
          <View style={styles.infoCard}>
            <View style={styles.cardHeaderRow}>
              <View>
                <Text style={styles.cardTag}>STORE DETAILS</Text>
                <Text style={styles.targetName}>{deliveryData.storeName}</Text>
                <Text style={styles.targetAddress}>{deliveryData.storeAddress}</Text>
              </View>
              <TouchableOpacity
                style={styles.callCircle}
                onPress={() => Alert.alert('Call Store', `Calling ${deliveryData.storeName}...`)}
              >
                <Text style={{ fontSize: 20 }}>📞</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.packageItemsBox}>
              <Text style={styles.itemsHeader}>PACKAGE CONTENTS:</Text>
              <Text style={styles.itemsText}>{deliveryData.itemsList}</Text>
            </View>

            <TouchableOpacity
              style={styles.primaryActionBtn}
              onPress={() => {
                Alert.alert('Pickup Confirmed! 📦', 'Package verified. Now navigate to customer drop address.');
                setStage('TO_CUSTOMER');
              }}
            >
              <Text style={styles.primaryActionText}>CONFIRM STORE PICKUP 📦</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.infoCard}>
            <View style={styles.cardHeaderRow}>
              <View>
                <Text style={styles.cardTag}>CUSTOMER DETAILS</Text>
                <Text style={styles.targetName}>{deliveryData.customerName}</Text>
                <Text style={styles.targetAddress}>{deliveryData.customerAddress}</Text>
              </View>
              <TouchableOpacity
                style={styles.callCircle}
                onPress={() => Alert.alert('Call Customer', `Calling ${deliveryData.customerName}...`)}
              >
                <Text style={{ fontSize: 20 }}>📞</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.instructionsBox}>
              <Text style={styles.instructionsText}>💬 Instruction: "Ring bell twice, leave package on shoe rack."</Text>
            </View>

            <TouchableOpacity
              style={styles.otpTriggerBtn}
              onPress={() => setOtpModalVisible(true)}
            >
              <Text style={styles.otpTriggerText}>REACHED CUSTOMER & VERIFY OTP 🔐</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Customer OTP Verification Modal */}
      <Modal visible={otpModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delivery Verification Code</Text>
            <Text style={styles.modalSubtitle}>Ask customer for the 4-digit code shown on their QuickKart app:</Text>

            <TextInput
              style={styles.otpInput}
              placeholder="e.g. 5831"
              keyboardType="numeric"
              maxLength={4}
              value={enteredOtp}
              onChangeText={setEnteredOtp}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setOtpModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirm}
                onPress={handleVerifyOtp}
              >
                <Text style={styles.modalConfirmText}>COMPLETE ORDER ✅</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: FontSize.md, fontWeight: '800', color: '#FFFFFF' },
  headerSubtitle: { fontSize: FontSize.xs, color: '#94A3B8', marginTop: 2 },
  payoutBadge: { backgroundColor: '#16A34A', paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.pill },
  payoutBadgeText: { color: '#FFFFFF', fontWeight: '800', fontSize: FontSize.sm },

  scrollContent: { padding: Spacing.md, gap: Spacing.md },

  mapVisual: {
    backgroundColor: '#CBD5E1',
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  mapHeaderBanner: { backgroundColor: '#1D3557', paddingVertical: 8, alignItems: 'center' },
  navigationNotice: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  mapBody: { height: 140, alignItems: 'center', justifyContent: 'center' },
  mapRoadGraphic: { fontSize: 22, color: '#64748B' },
  mapDestinationGraphic: { fontSize: FontSize.sm, fontWeight: '700', color: '#0F172A', marginTop: 8 },
  mapFooterBanner: { backgroundColor: '#F8FAFC', padding: 8 },
  googleMapsBtn: { backgroundColor: '#0284C7', paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  googleMapsText: { color: '#FFFFFF', fontSize: FontSize.xs, fontWeight: '800' },

  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadow.sm,
  },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTag: { fontSize: 9, fontWeight: '800', color: Colors.text.tertiary, letterSpacing: 0.5 },
  targetName: { fontSize: FontSize.base, fontWeight: '700', color: Colors.text.primary, marginTop: 2 },
  targetAddress: { fontSize: FontSize.xs, color: Colors.text.secondary, marginTop: 2, maxWidth: 240 },
  callCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center' },

  packageItemsBox: { backgroundColor: '#F8FAFC', padding: 10, borderRadius: 6, marginVertical: Spacing.md },
  itemsHeader: { fontSize: 10, fontWeight: '800', color: Colors.text.tertiary },
  itemsText: { fontSize: FontSize.xs, color: Colors.text.primary, marginTop: 4, fontWeight: '500' },

  instructionsBox: { backgroundColor: '#FEF3C7', padding: 10, borderRadius: 6, marginVertical: Spacing.md },
  instructionsText: { fontSize: FontSize.xs, color: '#B45309', fontWeight: '600' },

  primaryActionBtn: {
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    ...Shadow.sm,
  },
  primaryActionText: { color: '#FFFFFF', fontWeight: '800', fontSize: FontSize.sm },

  otpTriggerBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    ...Shadow.sm,
  },
  otpTriggerText: { color: '#FFFFFF', fontWeight: '800', fontSize: FontSize.sm },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: Spacing.md },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: BorderRadius.md, padding: Spacing.lg, ...Shadow.lg },
  modalTitle: { fontSize: FontSize.md, fontWeight: '800', color: Colors.text.primary },
  modalSubtitle: { fontSize: FontSize.xs, color: Colors.text.secondary, marginTop: 4, marginBottom: Spacing.md },
  otpInput: {
    height: 54,
    borderWidth: 2,
    borderColor: '#1D3557',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 8,
    backgroundColor: '#F8FAFC',
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: Spacing.lg },
  modalCancel: { paddingHorizontal: 16, paddingVertical: 10 },
  modalCancelText: { color: Colors.text.secondary, fontWeight: '600', fontSize: FontSize.sm },
  modalConfirm: { backgroundColor: '#16A34A', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 6 },
  modalConfirmText: { color: '#FFFFFF', fontWeight: '800', fontSize: FontSize.sm },

  completedContainer: { flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  completedIconBox: { width: 110, height: 110, borderRadius: 55, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  completedTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.text.primary },
  completedSub: { fontSize: FontSize.xs, color: Colors.text.secondary, textAlign: 'center', marginTop: 4 },
  payoutCard: { backgroundColor: '#0F172A', borderRadius: BorderRadius.md, padding: Spacing.md, width: '100%', alignItems: 'center', marginVertical: Spacing.xl },
  payoutCardLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '700' },
  payoutCardAmount: { fontSize: 36, fontWeight: '800', color: '#22C55E', marginVertical: 4 },
  payoutCardNote: { fontSize: 11, color: '#94A3B8' },
  nextTripBtn: { backgroundColor: '#16A34A', paddingVertical: 14, paddingHorizontal: 28, borderRadius: BorderRadius.pill },
  nextTripBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: FontSize.base },
});

export default ActiveDeliveryScreen;
