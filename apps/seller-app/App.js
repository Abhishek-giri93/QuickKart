import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar, ScrollView, Platform,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import DashboardScreen from './src/screens/dashboard/DashboardScreen';
import OrdersScreen from './src/screens/orders/OrdersScreen';
import ProductsScreen from './src/screens/products/ProductsScreen';
import EarningsScreen from './src/screens/earnings/EarningsScreen';
import { Colors } from './src/constants/colors';

function SellerAppContent() {
  const [currentScreen, setCurrentScreen] = useState('Dashboard');
  const [showSwitcher, setShowSwitcher] = useState(true);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      {/* Solid Status Bar matching Seller theme */}
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.primaryDark || '#1B4332'}
        translucent={false}
      />

      {/* Screen Preview Switcher Bar (Collapsible) */}
      {showSwitcher ? (
        <View style={styles.previewBar}>
          <View style={styles.previewBarHeader}>
            <Text style={styles.previewBarTitle}>🏪 QuickKart Seller Hub</Text>
            <TouchableOpacity
              onPress={() => setShowSwitcher(false)}
              style={styles.hideBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.hideBtnText}>Hide ✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.previewScroll}
          >
            <TouchableOpacity
              style={[styles.previewBtn, currentScreen === 'Dashboard' && styles.previewBtnActive]}
              onPress={() => setCurrentScreen('Dashboard')}
            >
              <Text style={[styles.previewBtnText, currentScreen === 'Dashboard' && styles.previewBtnTextActive]}>
                📊 Dashboard
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.previewBtn, currentScreen === 'Orders' && styles.previewBtnActive]}
              onPress={() => setCurrentScreen('Orders')}
            >
              <Text style={[styles.previewBtnText, currentScreen === 'Orders' && styles.previewBtnTextActive]}>
                📦 Orders
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.previewBtn, currentScreen === 'Products' && styles.previewBtnActive]}
              onPress={() => setCurrentScreen('Products')}
            >
              <Text style={[styles.previewBtnText, currentScreen === 'Products' && styles.previewBtnTextActive]}>
                🛍️ Inventory
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.previewBtn, currentScreen === 'Earnings' && styles.previewBtnActive]}
              onPress={() => setCurrentScreen('Earnings')}
            >
              <Text style={[styles.previewBtnText, currentScreen === 'Earnings' && styles.previewBtnTextActive]}>
                💰 Earnings
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      ) : (
        /* Floating Pill to reopen switcher if hidden */
        <TouchableOpacity
          style={styles.floatingShowBtn}
          onPress={() => setShowSwitcher(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.floatingShowBtnText}>🏪 Switch Screen ({currentScreen}) ▾</Text>
        </TouchableOpacity>
      )}

      {/* Render Selected Screen */}
      <View style={styles.screenWrapper}>
        {currentScreen === 'Dashboard' && (
          <DashboardScreen
            onNavigateToOrders={() => setCurrentScreen('Orders')}
            onNavigateToProducts={() => setCurrentScreen('Products')}
            onNavigateToEarnings={() => setCurrentScreen('Earnings')}
          />
        )}

        {currentScreen === 'Orders' && <OrdersScreen />}
        {currentScreen === 'Products' && <ProductsScreen />}
        {currentScreen === 'Earnings' && <EarningsScreen />}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SellerAppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  previewBar: {
    backgroundColor: '#0F172A',
    paddingTop: 6,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  previewBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  previewBarTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  hideBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  hideBtnText: {
    fontSize: 11,
    color: '#CBD5E1',
    fontWeight: '600',
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
    backgroundColor: Colors.primary || '#2D6A4F',
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
  floatingShowBtn: {
    backgroundColor: '#1E293B',
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'center',
    borderRadius: 20,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#334155',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  floatingShowBtnText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '700',
  },
  screenWrapper: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
