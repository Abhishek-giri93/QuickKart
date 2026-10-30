import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import HomeScreen from './src/screens/home/HomeScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import SplashScreen from './src/screens/auth/SplashScreen';
import { Colors } from './src/constants/colors';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Home');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Screen Preview Switcher Bar */}
      <View style={styles.previewBar}>
        <Text style={styles.previewTitle}>QuickKart Preview:</Text>
        <TouchableOpacity
          style={[styles.previewBtn, currentScreen === 'Home' && styles.previewBtnActive]}
          onPress={() => setCurrentScreen('Home')}
        >
          <Text style={[styles.previewBtnText, currentScreen === 'Home' && styles.previewBtnTextActive]}>
            🏠 Home
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
      </View>

      {/* Render Selected Screen */}
      <View style={styles.screenWrapper}>
        {currentScreen === 'Home' && <HomeScreen navigation={{ navigate: () => {} }} />}
        {currentScreen === 'Login' && <LoginScreen navigation={{ navigate: () => {}, replace: () => setCurrentScreen('Home') }} />}
        {currentScreen === 'Splash' && <SplashScreen navigation={{ replace: () => setCurrentScreen('Home') }} />}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#1E293B',
    gap: 8,
  },
  previewTitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  previewBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#334155',
  },
  previewBtnActive: {
    backgroundColor: Colors.primary,
  },
  previewBtnText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '500',
  },
  previewBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  screenWrapper: {
    flex: 1,
  },
});
