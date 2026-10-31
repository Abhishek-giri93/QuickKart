import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import DashboardScreen from './src/screens/dashboard/DashboardScreen';
import OrdersScreen from './src/screens/orders/OrdersScreen';
import ProductsScreen from './src/screens/products/ProductsScreen';
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  previewBar: {
    backgroundColor: '#0F172A',
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
    backgroundColor: Colors.primary,
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
