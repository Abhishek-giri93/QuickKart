import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import DashboardScreen from './src/screens/dashboard/DashboardScreen';
import ActiveDeliveryScreen from './src/screens/delivery/ActiveDeliveryScreen';
import EarningsScreen from './src/screens/earnings/EarningsScreen';
import { Colors } from './src/constants/colors';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Dashboard');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      {/* Screen Preview Switcher Bar */}
      <View style={styles.previewBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.previewScroll}>
          <TouchableOpacity
            style={[styles.previewBtn, currentScreen === 'Dashboard' && styles.previewBtnActive]}
            onPress={() => setCurrentScreen('Dashboard')}
          >
            <Text style={[styles.previewBtnText, currentScreen === 'Dashboard' && styles.previewBtnTextActive]}>
              🛵 Dashboard
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.previewBtn, currentScreen === 'ActiveTrip' && styles.previewBtnActive]}
            onPress={() => setCurrentScreen('ActiveTrip')}
          >
            <Text style={[styles.previewBtnText, currentScreen === 'ActiveTrip' && styles.previewBtnTextActive]}>
              🗺️ Active Trip & OTP
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.previewBtn, currentScreen === 'Earnings' && styles.previewBtnActive]}
            onPress={() => setCurrentScreen('Earnings')}
          >
            <Text style={[styles.previewBtnText, currentScreen === 'Earnings' && styles.previewBtnTextActive]}>
              💰 Rider Earnings
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Render Selected Screen */}
      <View style={styles.screenWrapper}>
        {currentScreen === 'Dashboard' && (
          <DashboardScreen
            onAcceptOrder={() => setCurrentScreen('ActiveTrip')}
            onNavigateToEarnings={() => setCurrentScreen('Earnings')}
          />
        )}

        {currentScreen === 'ActiveTrip' && (
          <ActiveDeliveryScreen
            onDeliveryCompleted={() => setCurrentScreen('Dashboard')}
          />
        )}

        {currentScreen === 'Earnings' && <EarningsScreen />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1FAEE',
  },
  previewBar: {
    backgroundColor: '#0D1B2A',
    paddingVertical: 8,
  },
  previewScroll: {
    paddingHorizontal: 12,
    gap: 8,
    alignItems: 'center',
  },
  previewBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#1E293B',
  },
  previewBtnActive: {
    backgroundColor: '#16A34A',
  },
  previewBtnText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  previewBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  screenWrapper: {
    flex: 1,
  },
});
