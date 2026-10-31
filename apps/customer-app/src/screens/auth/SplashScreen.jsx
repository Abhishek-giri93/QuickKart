// Customer App — Splash Screen

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { Colors } from '../../constants/colors';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Auto-navigate after 2 seconds
    // In real app: check token validity here
    const timer = setTimeout(() => {
      navigation?.replace('Onboarding');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>🛒</Text>
        <Text style={styles.appName}>QuickKart</Text>
        <Text style={styles.tagline}>Deliver Everything Nearby</Text>
      </View>
      <Text style={styles.version}>v1.0.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    fontSize: 72,
    marginBottom: 16,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
    fontWeight: '400',
  },
  version: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginBottom: 32,
  },
});

export default SplashScreen;

