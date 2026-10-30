// Customer App — Live Order Tracking Screen

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Shadow } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';

const STEPS = [
  { id: 1, title: 'Order Placed', desc: 'Received by store', icon: '📝' },
  { id: 2, title: 'Store Preparing', desc: 'Freshly packing items', icon: '🍳' },
  { id: 3, title: 'Rider Picked Up', desc: 'Rider is on the way to you', icon: '🛵' },
  { id: 4, title: 'Delivered', desc: 'Enjoy your essentials!', icon: '🏡' },
];

const LiveTrackingScreen = ({ onBackToHome }) => {
  const [currentStep, setCurrentStep] = useState(3); // Default at Rider Picked Up
  const [etaMinutes, setEtaMinutes] = useState(14);
  const orderId = 'QK-849201';
  const deliveryOtp = '5831';

  // Simulate countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setEtaMinutes((prev) => (prev > 1 ? prev - 1 : 1));
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => onBackToHome?.()}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerTitle}>Live Order Tracking</Text>
          <Text style={styles.headerOrderId}>Order #{orderId}</Text>
        </View>
        <TouchableOpacity
          style={styles.helpBtn}
          onPress={() => Alert.alert('Support', 'Connecting you to QuickKart 24x7 Customer Care...')}
        >
          <Text style={styles.helpBtnText}>Support</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ETA & Status Card */}
        <View style={styles.etaCard}>
          <View style={styles.etaHeader}>
            <View>
              <Text style={styles.etaSubtext}>ESTIMATED ARRIVAL</Text>
              <Text style={styles.etaMinutes}>{etaMinutes} Mins</Text>
            </View>
            <View style={styles.otpBadge}>
              <Text style={styles.otpLabel}>DELIVERY OTP</Text>
              <Text style={styles.otpCode}>{deliveryOtp}</Text>
            </View>
          </View>

          {/* Stepper Progress Bar */}
          <View style={styles.stepperContainer}>
            {STEPS.map((step, idx) => {
              const isPassed = step.id <= currentStep;
              const isCurrent = step.id === currentStep;

              return (
                <View key={step.id} style={styles.stepItem}>
                  <View style={[styles.stepCircle, isPassed && styles.stepCircleActive, isCurrent && styles.stepCircleCurrent]}>
                    <Text style={{ fontSize: 14 }}>{step.icon}</Text>
                  </View>
                  <Text style={[styles.stepTitle, isPassed && styles.stepTitleActive]}>
                    {step.title}
                  </Text>
                  {idx < STEPS.length - 1 && (
                    <View style={[styles.stepLine, step.id < currentStep && styles.stepLineActive]} />
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Simulated Map Visual */}
        <View style={styles.mapContainer}>
          <View style={styles.mapBackground}>
            <Text style={styles.mapRoad}>════════════════════════════</Text>
            <View style={styles.mapMarkersRow}>
              <View style={styles.mapPin}>
                <Text style={{ fontSize: 26 }}>🏪</Text>
                <Text style={styles.pinLabel}>Fresh Basket</Text>
              </View>

              <View style={[styles.mapPin, styles.riderPin]}>
                <Text style={{ fontSize: 28 }}>🛵💨</Text>
                <Text style={styles.riderPinLabel}>Ramesh (Rider)</Text>
              </View>

              <View style={styles.mapPin}>
                <Text style={{ fontSize: 26 }}>🏠</Text>
                <Text style={styles.pinLabel}>Your Home</Text>
              </View>
            </View>
          </View>
          <View style={styles.mapFooterBanner}>
            <Text style={styles.mapStatusNote}>⚡ Rider is riding at safe speed towards your location</Text>
          </View>
        </View>

        {/* Delivery Partner Details Card */}
        <View style={styles.partnerCard}>
          <View style={styles.partnerInfoRow}>
            <View style={styles.partnerAvatar}>
              <Text style={{ fontSize: 28 }}>👨‍💼</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.partnerName}>Ramesh Kumar</Text>
              <Text style={styles.partnerVehicle}>Hero Splendor • MP 04 AB 4912</Text>
              <View style={styles.partnerRating}>
                <Text style={styles.partnerRatingText}>⭐ 4.8 (850+ deliveries)</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.callBtn}
              onPress={() => Alert.alert('Calling Rider', 'Dialing Ramesh Kumar (+91 98765 43210)...')}
            >
              <Text style={styles.callBtnIcon}>📞</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Delivery Instructions */}
        <View style={styles.instructionCard}>
          <Text style={styles.instructionHeader}>Delivery Address & Instructions</Text>
          <Text style={styles.addressLine}>📍 Flat 402, Green Valley Apartments, Near City Center</Text>
          <View style={styles.contactlessRow}>
            <Text style={{ fontSize: 18, marginRight: 8 }}>🚪</Text>
            <Text style={styles.contactlessText}>Leave package at the door / with security guard</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  header: {
    backgroundColor: '#0F172A',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1E293B', alignItems: 'center', justifyContent: 'center' },
  backBtnText: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  headerTitle: { color: '#FFFFFF', fontSize: FontSize.md, fontWeight: '700' },
  headerOrderId: { color: '#94A3B8', fontSize: FontSize.xs, marginTop: 2 },
  helpBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, backgroundColor: '#1E293B' },
  helpBtnText: { color: '#E2E8F0', fontSize: FontSize.xs, fontWeight: '600' },

  scrollContent: { padding: Spacing.md, gap: Spacing.md },

  etaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  etaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  etaSubtext: { fontSize: 10, fontWeight: '700', color: Colors.text.tertiary, letterSpacing: 0.5 },
  etaMinutes: { fontSize: 28, fontWeight: '800', color: Colors.primary, marginTop: 2 },
  otpBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  otpLabel: { fontSize: 9, fontWeight: '800', color: '#B45309' },
  otpCode: { fontSize: 18, fontWeight: '800', color: '#B45309', letterSpacing: 2 },

  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
    position: 'relative',
  },
  stepItem: { alignItems: 'center', flex: 1 },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    zIndex: 2,
  },
  stepCircleActive: { backgroundColor: '#DCFCE7' },
  stepCircleCurrent: { borderWidth: 2, borderColor: Colors.primary },
  stepTitle: { fontSize: 10, color: Colors.text.tertiary, textAlign: 'center', fontWeight: '500' },
  stepTitleActive: { color: Colors.text.primary, fontWeight: '700' },
  stepLine: {
    position: 'absolute',
    top: 15,
    left: '50%',
    width: '100%',
    height: 3,
    backgroundColor: '#E2E8F0',
    zIndex: 1,
  },
  stepLineActive: { backgroundColor: '#22C55E' },

  mapContainer: {
    backgroundColor: '#E2E8F0',
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  mapBackground: {
    height: 160,
    backgroundColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mapRoad: {
    color: '#94A3B8',
    fontSize: 22,
    letterSpacing: -1,
    position: 'absolute',
  },
  mapMarkersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '88%',
    alignItems: 'center',
    zIndex: 2,
  },
  mapPin: { alignItems: 'center' },
  pinLabel: { fontSize: 10, fontWeight: '700', color: '#334155', marginTop: 4, backgroundColor: '#FFFFFF', paddingHorizontal: 6, borderRadius: 4 },
  riderPin: { transform: [{ translateY: -10 }] },
  riderPinLabel: { fontSize: 10, fontWeight: '700', color: Colors.primary, marginTop: 4, backgroundColor: '#FFF5F0', paddingHorizontal: 6, borderRadius: 4 },

  mapFooterBanner: {
    backgroundColor: '#0F172A',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  mapStatusNote: { color: '#E2E8F0', fontSize: 11, textAlign: 'center', fontWeight: '500' },

  partnerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  partnerInfoRow: { flexDirection: 'row', alignItems: 'center' },
  partnerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerName: { fontSize: FontSize.base, fontWeight: '700', color: Colors.text.primary },
  partnerVehicle: { fontSize: FontSize.xs, color: Colors.text.secondary, marginTop: 2 },
  partnerRating: { marginTop: 4 },
  partnerRatingText: { fontSize: FontSize.xs, color: '#166534', fontWeight: '600' },
  callBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callBtnIcon: { fontSize: 20 },

  instructionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  instructionHeader: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text.primary, marginBottom: 6 },
  addressLine: { fontSize: FontSize.xs, color: Colors.text.secondary, lineHeight: 18 },
  contactlessRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, backgroundColor: '#F8FAFC', padding: 8, borderRadius: 6 },
  contactlessText: { fontSize: FontSize.xs, color: Colors.text.secondary, fontWeight: '500' },
});

export default LiveTrackingScreen;
