import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import HomeScreen from './src/screens/home/HomeScreen';
import StoreDetailScreen from './src/screens/home/StoreDetailScreen';
import CartScreen from './src/screens/cart/CartScreen';
import LiveTrackingScreen from './src/screens/orders/LiveTrackingScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import SplashScreen from './src/screens/auth/SplashScreen';
import { Colors } from './src/constants/colors';
import { useCartStore } from './src/store/cartStore';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [activeStoreId, setActiveStoreId] = useState('store_001');

  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const handleOpenStore = (storeId) => {
    if (storeId) setActiveStoreId(storeId);
    setCurrentScreen('Store');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Screen Preview Switcher Bar */}
      <View style={styles.previewBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.previewScroll}>
          <TouchableOpacity
            style={[styles.previewBtn, currentScreen === 'Home' && styles.previewBtnActive]}
            onPress={() => setCurrentScreen('Home')}
          >
            <Text style={[styles.previewBtnText, currentScreen === 'Home' && styles.previewBtnTextActive]}>
              🏠 Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.previewBtn, currentScreen === 'Store' && styles.previewBtnActive]}
            onPress={() => setCurrentScreen('Store')}
          >
            <Text style={[styles.previewBtnText, currentScreen === 'Store' && styles.previewBtnTextActive]}>
              🏪 Store
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.previewBtn, currentScreen === 'Cart' && styles.previewBtnActive]}
            onPress={() => setCurrentScreen('Cart')}
          >
            <Text style={[styles.previewBtnText, currentScreen === 'Cart' && styles.previewBtnTextActive]}>
              🛒 Cart {cartCount > 0 ? `(${cartCount})` : ''}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.previewBtn, currentScreen === 'Track' && styles.previewBtnActive]}
            onPress={() => setCurrentScreen('Track')}
          >
            <Text style={[styles.previewBtnText, currentScreen === 'Track' && styles.previewBtnTextActive]}>
              🛵 Live Track
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.previewBtn, currentScreen === 'Profile' && styles.previewBtnActive]}
            onPress={() => setCurrentScreen('Profile')}
          >
            <Text style={[styles.previewBtnText, currentScreen === 'Profile' && styles.previewBtnTextActive]}>
              👤 Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.previewBtn, currentScreen === 'Login' && styles.previewBtnActive]}
            onPress={() => setCurrentScreen('Login')}
          >
            <Text style={[styles.previewBtnText, currentScreen === 'Login' && styles.previewBtnTextActive]}>
              🔐 Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.previewBtn, currentScreen === 'Splash' && styles.previewBtnActive]}
            onPress={() => setCurrentScreen('Splash')}
          >
            <Text style={[styles.previewBtnText, currentScreen === 'Splash' && styles.previewBtnTextActive]}>
              ✨ Splash
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Render Selected Screen */}
      <View style={styles.screenWrapper}>
        {currentScreen === 'Home' && (
          <HomeScreen
            navigation={{
              navigate: (screen, params) => {
                if (screen === 'StoreDetail' || screen === 'Store') {
                  handleOpenStore(params?.storeId);
                } else if (screen === 'Cart') {
                  setCurrentScreen('Cart');
                }
              },
            }}
          />
        )}

        {currentScreen === 'Store' && (
          <StoreDetailScreen
            storeId={activeStoreId}
            navigation={{ goBack: () => setCurrentScreen('Home') }}
            onGoToCart={() => setCurrentScreen('Cart')}
          />
        )}

        {currentScreen === 'Cart' && (
          <CartScreen
            onBackToShopping={() => setCurrentScreen('Home')}
            onOrderPlaced={() => setCurrentScreen('Track')}
          />
        )}

        {currentScreen === 'Track' && (
          <LiveTrackingScreen
            onBackToHome={() => setCurrentScreen('Home')}
          />
        )}

        {currentScreen === 'Profile' && (
          <ProfileScreen
            onTrackOrder={() => setCurrentScreen('Track')}
            onLogout={() => setCurrentScreen('Login')}
          />
        )}

        {currentScreen === 'Login' && (
          <LoginScreen
            navigation={{
              navigate: () => {},
              replace: () => setCurrentScreen('Home'),
            }}
          />
        )}

        {currentScreen === 'Splash' && (
          <SplashScreen
            navigation={{
              replace: () => setCurrentScreen('Home'),
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
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
